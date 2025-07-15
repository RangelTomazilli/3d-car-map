import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnimationState, Course, GPSPoint } from '../types';

interface UseAnimationOptions {
  initialCourse?: Course | null;
  onPointChange?: (point: GPSPoint) => void;
  onAnimationEnd?: () => void;
}

export const useAnimation = (options: UseAnimationOptions = {}) => {
  const {
    initialCourse = null,
    onPointChange,
  } = options;

  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    currentPointIndex: 0,
    interpolationProgress: 0,
    currentCourse: initialCourse,
  });

  const intervalRef = useRef<number | null>(null);

  const clearInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

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

  const getCurrentPoint = useCallback((): GPSPoint | null => {
    if (!animationState.currentCourse || animationState.currentCourse.points.length === 0) {
      return null;
    }
    return animationState.currentCourse.points[animationState.currentPointIndex];
  }, [animationState.currentCourse, animationState.currentPointIndex]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      clearInterval();
    };
  }, [clearInterval]);

  return {
    animationState,
    stop,
    setCourse,
    getCurrentPoint,
  };
};