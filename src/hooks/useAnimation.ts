import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnimationState, Course, GPSPoint, PlaybackSpeed } from '../types';
import { interpolatePosition, calculateBearing } from '../utils/geoUtils';

interface UseAnimationOptions {
  initialCourse?: Course | null;
  initialSpeed?: PlaybackSpeed;
  onPointChange?: (point: GPSPoint) => void;
  onAnimationEnd?: () => void;
}

export const useAnimation = (options: UseAnimationOptions = {}) => {
  const {
    initialCourse = null,
    initialSpeed = 1,
    onPointChange,
    onAnimationEnd,
  } = options;

  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    currentPointIndex: 0,
    interpolationProgress: 0,
    playbackSpeed: initialSpeed,
    currentCourse: initialCourse,
  });

  const intervalRef = useRef<number | null>(null);

  const clearInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (!animationState.currentCourse || animationState.currentCourse.points.length === 0) {
      return;
    }

    setAnimationState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));

    clearInterval();

    // Intervalo pequeno para animação suave (60fps)
    const smoothInterval = 16; // ~60fps
    const baseStepsPerSecond = 60; // passos por segundo
    const stepsPerPoint = baseStepsPerSecond / animationState.playbackSpeed; // passos para ir de um ponto ao próximo

    intervalRef.current = window.setInterval(() => {
      setAnimationState(prev => {
        if (!prev.currentCourse) return prev;

        const currentIndex = prev.currentPointIndex;
        const nextIndex = currentIndex + 1;

        // Se chegamos ao fim
        if (nextIndex >= prev.currentCourse.points.length) {
          if (onAnimationEnd) {
            onAnimationEnd();
          }
          return {
            ...prev,
            isPlaying: false,
            isPaused: false,
            interpolationProgress: 0,
          };
        }

        // Incrementar progresso da interpolação
        const progressIncrement = 1 / stepsPerPoint;
        const newProgress = prev.interpolationProgress + progressIncrement;

        if (newProgress >= 1) {
          // Chegou ao próximo ponto
          const nextPoint = prev.currentCourse.points[nextIndex];
          if (onPointChange) {
            onPointChange(nextPoint);
          }

          return {
            ...prev,
            currentPointIndex: nextIndex,
            interpolationProgress: 0,
          };
        } else {
          // Ainda interpolando entre pontos
          const currentPoint = prev.currentCourse.points[currentIndex];
          const nextPoint = prev.currentCourse.points[nextIndex];
          
          // Criar ponto interpolado
          const [lat, lng] = interpolatePosition(currentPoint, nextPoint, newProgress);
          
          // Calcular direção baseada no movimento atual (sempre da posição atual para a próxima)
          const direction = calculateBearing(currentPoint, nextPoint);
          
          const interpolatedPoint: GPSPoint = {
            ...currentPoint,
            latitude: lat,
            longitude: lng,
            direction: direction,
          };

          if (onPointChange) {
            onPointChange(interpolatedPoint);
          }

          return {
            ...prev,
            interpolationProgress: newProgress,
          };
        }
      });
    }, smoothInterval);
  }, [animationState.currentCourse, animationState.playbackSpeed, clearInterval, onPointChange, onAnimationEnd]);

  const pause = useCallback(() => {
    clearInterval();
    setAnimationState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, [clearInterval]);

  const stop = useCallback(() => {
    clearInterval();
    setAnimationState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentPointIndex: 0,
      interpolationProgress: 0,
    }));

    if (animationState.currentCourse && animationState.currentCourse.points.length > 0) {
      const firstPoint = animationState.currentCourse.points[0];
      if (onPointChange) {
        onPointChange(firstPoint);
      }
    }
  }, [clearInterval, animationState.currentCourse, onPointChange]);

  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed) => {
    setAnimationState(prev => ({
      ...prev,
      playbackSpeed: speed,
    }));

    // Se estiver reproduzindo, reinicia com nova velocidade
    if (animationState.isPlaying) {
      clearInterval();
      // O play será chamado automaticamente pelo useEffect
    }
  }, [animationState.isPlaying, clearInterval]);

  const setCourse = useCallback((course: Course | null) => {
    clearInterval();
    setAnimationState(prev => ({
      ...prev,
      currentCourse: course,
      currentPointIndex: 0,
      interpolationProgress: 0,
      isPlaying: false,
      isPaused: false,
    }));

    if (course && course.points.length > 0) {
      const firstPoint = course.points[0];
      if (onPointChange) {
        onPointChange(firstPoint);
      }
    }
  }, [clearInterval, onPointChange]);

  const seekToPoint = useCallback((pointIndex: number) => {
    if (!animationState.currentCourse || pointIndex < 0 || pointIndex >= animationState.currentCourse.points.length) {
      return;
    }

    const wasPlaying = animationState.isPlaying;
    if (wasPlaying) {
      clearInterval();
    }

    setAnimationState(prev => ({
      ...prev,
      currentPointIndex: pointIndex,
      interpolationProgress: 0,
      isPlaying: false,
      isPaused: true,
    }));

    const point = animationState.currentCourse.points[pointIndex];
    if (onPointChange) {
      onPointChange(point);
    }
  }, [animationState.currentCourse, animationState.isPlaying, clearInterval, onPointChange]);

  const getCurrentPoint = useCallback((): GPSPoint | null => {
    if (!animationState.currentCourse || animationState.currentCourse.points.length === 0) {
      return null;
    }
    return animationState.currentCourse.points[animationState.currentPointIndex];
  }, [animationState.currentCourse, animationState.currentPointIndex]);

  // Reinicia reprodução quando velocidade muda durante reprodução
  useEffect(() => {
    if (animationState.isPlaying) {
      play();
    }
  }, [animationState.playbackSpeed, animationState.isPlaying, play]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      clearInterval();
    };
  }, [clearInterval]);

  return {
    animationState,
    play,
    pause,
    stop,
    setPlaybackSpeed,
    setCourse,
    seekToPoint,
    getCurrentPoint,
  };
};