import { useCallback, useState } from 'react'
import { mockCourses } from './data/mockCourses';
import type { Course, GPSPoint } from './types';
import { useAnimation } from './hooks/useAnimation';

// Components
import MapContainer from './components/MapContainer';
import CourseSelector from './components/CourseSelector';

// Styles
import './styles/main.scss';

const App: React.FC = () => {
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
  
  return (
    <div className="app">
      <div className='app__main'>
        <MapContainer
        courses={mockCourses}
        selectedCourse={selectedCourse}
        currentPoint={currentPoint}
        />

        {/* Course Selector Panel */}
        <CourseSelector
          courses={mockCourses}
          selectedCourse={selectedCourse}
          onCourseSelect={handleCourseSelect}
        />
      </div>
    </div>
  )
}

export default App
