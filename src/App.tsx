import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Course, GPSPoint, PlaybackSpeed } from './types';
import { mockCourses, mockVehicle } from './data/mockCourses';
import { useAnimation } from './hooks/useAnimation';

// Components
import MapContainer from './components/MapContainer';
import ControlPanel from './components/ControlPanel';
import CourseSelector from './components/CourseSelector';
import VehicleInfo from './components/VehicleInfo';

// Styles
import './styles/main.scss';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPoint, setCurrentPoint] = useState<GPSPoint | null>(null);

  const handlePointChange = useCallback((point: GPSPoint) => {
    setCurrentPoint(point);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    console.log('Animation completed');
  }, []);

  const {
    animationState,
    play,
    pause,
    stop,
    setPlaybackSpeed,
    setCourse,
    seekToPoint,
  } = useAnimation({
    initialCourse: selectedCourse,
    initialSpeed: 1,
    onPointChange: handlePointChange,
    onAnimationEnd: handleAnimationEnd,
  });

  const handleCourseSelect = useCallback((course: Course) => {
    setSelectedCourse(course);
    setCourse(course);
    if (course.points.length > 0) {
      setCurrentPoint(course.points[0]);
    }
  }, [setCourse]);

  const handlePlay = useCallback(() => {
    if (!selectedCourse) {
      console.warn('No course selected');
      return;
    }
    play();
  }, [play, selectedCourse]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleStop = useCallback(() => {
    stop();
    if (selectedCourse && selectedCourse.points.length > 0) {
      setCurrentPoint(selectedCourse.points[0]);
    }
  }, [stop, selectedCourse]);

  const handleSpeedChange = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
  }, [setPlaybackSpeed]);

  const handleSeek = useCallback((pointIndex: number) => {
    seekToPoint(pointIndex);
  }, [seekToPoint]);

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__title">
            {t('app.title')}
          </h1>
          <p className="app__description">
            {t('app.description')}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="app__main">
        {/* Map Container */}
        <MapContainer
          courses={mockCourses}
          selectedCourse={selectedCourse}
          currentPoint={currentPoint}
          vehicle={mockVehicle}
          animationState={animationState}
        />

        {/* Course Selector Panel */}
        <CourseSelector
          courses={mockCourses}
          selectedCourse={selectedCourse}
          onCourseSelect={handleCourseSelect}
        />

        {/* Vehicle Info Panel */}
        <VehicleInfo
          vehicle={mockVehicle}
          currentPoint={currentPoint}
          animationState={animationState}
        />

        {/* Control Panel */}
        <ControlPanel
          animationState={animationState}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onSpeedChange={handleSpeedChange}
          onSeek={handleSeek}
        />
      </main>

      {/* Loading or Error States */}
      {mockCourses.length === 0 && (
        <div className="app__loading">
          <div className="app__loading-content">
            <div className="app__loading-spinner"></div>
            <p>Carregando trajetos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
