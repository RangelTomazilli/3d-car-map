import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Course, GPSPoint, PlaybackSpeed } from './types';
import { mockCourses, mockVehicle } from './data/mockCourses';
import { useAnimation } from './hooks/useAnimation';
import { useMobileLayout } from './hooks/useMobileLayout';

// Components
import MapContainer from './components/MapContainer';
import ControlPanel from './components/ControlPanel';
import CourseSelector from './components/CourseSelector';
import VehicleInfo from './components/VehicleInfo';
import FloatingButton from './components/FloatingButton';
import MobileOverlay from './components/MobileOverlay';

// Styles
import './styles/main.scss';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPoint, setCurrentPoint] = useState<GPSPoint | null>(null);
  const { 
    isMobile, 
    isVehicleInfoOpen, 
    isCourseSelectorOpen, 
    toggleVehicleInfo, 
    toggleCourseSelector,
    closeAllPanels 
  } = useMobileLayout();

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
          className={isCourseSelectorOpen ? 'course-selector--open' : ''}
        />

        {/* Vehicle Info Panel */}
        <VehicleInfo
          vehicle={mockVehicle}
          currentPoint={currentPoint}
          animationState={animationState}
          className={isVehicleInfoOpen ? 'vehicle-info--open' : ''}
        />

        {/* Mobile Overlays */}
        {isMobile && (
          <>
            <MobileOverlay isOpen={isVehicleInfoOpen} onClose={closeAllPanels}>
              <VehicleInfo
                vehicle={mockVehicle}
                currentPoint={currentPoint}
                animationState={animationState}
              />
            </MobileOverlay>
            
            <MobileOverlay isOpen={isCourseSelectorOpen} onClose={closeAllPanels}>
              <CourseSelector
                courses={mockCourses}
                selectedCourse={selectedCourse}
                onCourseSelect={(course) => {
                  handleCourseSelect(course);
                  closeAllPanels(); // Close modal after selection
                }}
              />
            </MobileOverlay>
          </>
        )}

        {/* Mobile Floating Buttons */}
        {isMobile && (
          <>
            <FloatingButton
              onClick={toggleVehicleInfo}
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              }
              label={t('vehicle.status')}
              position="top-left"
              isActive={isVehicleInfoOpen}
            />
            <FloatingButton
              onClick={toggleCourseSelector}
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              }
              label={t('controls.selectCourse')}
              position="top-right"
              isActive={isCourseSelectorOpen}
            />
          </>
        )}

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
            <p>{t('messages.loadingCourses')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
