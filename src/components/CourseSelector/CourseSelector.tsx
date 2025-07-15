import React from 'react';
import { useTranslation } from 'react-i18next';
import type { CourseSelectorProps } from '../../types';
import { formatDuration } from '../../utils/dateUtils';
import { getDurationBetweenDates } from '../../utils/dateUtils';
import './CourseSelector.scss';

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourse,
  onCourseSelect,
}) => {
  const { t, i18n } = useTranslation();

  const handleCourseClick = (course: CourseSelectorProps['courses'][0]) => {
    onCourseSelect(course);
  };

  const getCourseStats = (course: CourseSelectorProps['courses'][0]) => {
    const duration = getDurationBetweenDates(course.startTime, course.endTime);
    return {
      duration: formatDuration(duration, i18n.language as 'pt' | 'en'),
      points: course.points.length,
      distance: course.totalDistance.toFixed(1),
      avgSpeed: course.averageSpeed.toFixed(0),
    };
  };

  const getCourseIcon = (courseId: string) => {
    const icons = {
      'course-001': '🏛️', // Centro histórico
      'course-002': '🏖️', // Praia
      'course-003': '🚢', // Porto
      'course-004': '🛣️', // Via expressa
      'course-005': '🔄', // Circuito
    };
    return icons[courseId as keyof typeof icons] || '📍';
  };

  const getCourseColor = (courseId: string) => {
    const colors = {
      'course-001': '#e74c3c',
      'course-002': '#f39c12', 
      'course-003': '#2ecc71',
      'course-004': '#9b59b6',
      'course-005': '#1abc9c',
    };
    return colors[courseId as keyof typeof colors] || '#3498db';
  };

  return (
    <div className="course-selector">
      <div className="course-selector__header">
        <h3 className="course-selector__title">
          {t('controls.selectCourse')}
        </h3>
        <div className="course-selector__subtitle">
          {courses.length} {courses.length === 1 ? 'trajeto disponível' : 'trajetos disponíveis'}
        </div>
      </div>

      <div className="course-selector__list">
        {courses.map((course) => {
          const stats = getCourseStats(course);
          const isSelected = selectedCourse?.id === course.id;
          
          return (
            <div
              key={course.id}
              className={`course-selector__item ${
                isSelected ? 'course-selector__item--selected' : ''
              }`}
              onClick={() => handleCourseClick(course)}
            >
              <div className="course-selector__item-header">
                <div 
                  className="course-selector__item-icon"
                  style={{ backgroundColor: getCourseColor(course.id) }}
                >
                  {getCourseIcon(course.id)}
                </div>
                
                <div className="course-selector__item-info">
                  <h4 className="course-selector__item-title">
                    {t(`courses.${course.id.replace('-', '')}`)}
                  </h4>
                  <p className="course-selector__item-description">
                    {course.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="course-selector__item-indicator">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="course-selector__item-stats">
                <div className="course-selector__stat">
                  <div className="course-selector__stat-left">
                    <span className="course-selector__stat-icon">📍</span>
                    <span className="course-selector__stat-label">{t('info.totalPoints')}</span>
                  </div>
                  <span className="course-selector__stat-value">{stats.points}</span>
                </div>

                <div className="course-selector__stat">
                  <div className="course-selector__stat-left">
                    <span className="course-selector__stat-icon">📏</span>
                    <span className="course-selector__stat-label">{t('info.distance')}</span>
                  </div>
                  <span className="course-selector__stat-value">{stats.distance} {t('units.km')}</span>
                </div>

                <div className="course-selector__stat">
                  <div className="course-selector__stat-left">
                    <span className="course-selector__stat-icon">⏱️</span>
                    <span className="course-selector__stat-label">{t('info.duration')}</span>
                  </div>
                  <span className="course-selector__stat-value">{stats.duration}</span>
                </div>

                <div className="course-selector__stat">
                  <div className="course-selector__stat-left">
                    <span className="course-selector__stat-icon">🚗</span>
                    <span className="course-selector__stat-label">{t('info.averageSpeed')}</span>
                  </div>
                  <span className="course-selector__stat-value">{stats.avgSpeed} {t('units.kmh')}</span>
                </div>
              </div>

              <div 
                className="course-selector__item-progress"
                style={{ backgroundColor: getCourseColor(course.id) }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSelector;