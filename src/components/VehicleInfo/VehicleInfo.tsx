import React from 'react';
import { useTranslation } from 'react-i18next';
import type { VehicleInfoProps } from '../../types';
import { formatCoordinates, formatSpeed, formatDirection } from '../../utils/geoUtils';
import { formatDateTime } from '../../utils/dateUtils';
import LanguageSelector from '../LanguageSelector';
import './VehicleInfo.scss';

interface VehicleInfoPropsWithClassName extends VehicleInfoProps {
  className?: string;
}

const VehicleInfo: React.FC<VehicleInfoPropsWithClassName> = ({
  vehicle,
  currentPoint,
  animationState,
  className = '',
}) => {
  const { t, i18n } = useTranslation();

  const getStatusColor = () => {
    if (animationState.isPlaying) return '#10b981'; // green
    if (animationState.isPaused) return '#f59e0b'; // amber
    return '#64748b'; // gray
  };

  const getStatusText = () => {
    if (animationState.isPlaying) return t('status.moving');
    if (animationState.isPaused) return t('status.paused');
    return t('status.stopped');
  };

  const getProgressPercentage = (): number => {
    if (!animationState.currentCourse || animationState.currentCourse.points.length === 0) {
      return 0;
    }
    return (animationState.currentPointIndex / (animationState.currentCourse.points.length - 1)) * 100;
  };


  return (
    <div className={`vehicle-info ${className}`}>
      <div className="vehicle-info__header">
        <div className="vehicle-info__vehicle">
          <div className="vehicle-info__vehicle-details">
            <h3 className="vehicle-info__vehicle-plate">{vehicle.plate}</h3>
            <p className="vehicle-info__vehicle-model">
              {vehicle.model} {vehicle.year}
            </p>
          </div>
        </div>

        <LanguageSelector />
      </div>

      <div className="vehicle-info__status">
        <div className="vehicle-info__status-indicator">
          <div 
            className="vehicle-info__status-dot"
            style={{ backgroundColor: getStatusColor() }}
          />
          <span className="vehicle-info__status-text">
            {getStatusText()}
          </span>
        </div>
        
        {animationState.currentCourse && (
          <div className="vehicle-info__progress">
            <div className="vehicle-info__progress-text">
              {animationState.currentPointIndex + 1} / {animationState.currentCourse.points.length}
            </div>
            <div className="vehicle-info__progress-bar">
              <div 
                className="vehicle-info__progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {currentPoint && (
        <div className="vehicle-info__details">
          <div className="vehicle-info__section">
            <h4 className="vehicle-info__section-title">
              {t('vehicle.position')}
            </h4>
            <div className="vehicle-info__field">
              <span className="vehicle-info__field-icon">📍</span>
              <span className="vehicle-info__field-value">
                {formatCoordinates(currentPoint.latitude, currentPoint.longitude)}
              </span>
            </div>
            {currentPoint.address && (
              <div className="vehicle-info__field">
                <span className="vehicle-info__field-icon">📍</span>
                <span className="vehicle-info__field-value vehicle-info__field-value--address">
                  {currentPoint.address}
                </span>
              </div>
            )}
          </div>

          <div className="vehicle-info__section">
            <h4 className="vehicle-info__section-title">
              {t('vehicle.speed')} & {t('vehicle.direction')}
            </h4>
            <div className="vehicle-info__field">
              <span className="vehicle-info__field-icon">🚗</span>
              <span className="vehicle-info__field-label">{t('vehicle.speed')}:</span>
              <span className="vehicle-info__field-value">
                {formatSpeed(currentPoint.speed)}
              </span>
            </div>
            <div className="vehicle-info__field">
              <span className="vehicle-info__field-icon">🧭</span>
              <span className="vehicle-info__field-label">{t('vehicle.direction')}:</span>
              <span className="vehicle-info__field-value">
                {formatDirection(currentPoint.direction)}
              </span>
            </div>
          </div>

          <div className="vehicle-info__section">
            <h4 className="vehicle-info__section-title">
              {t('status.timestamp')}
            </h4>
            <div className="vehicle-info__field">
              <span className="vehicle-info__field-icon">⏰</span>
              <span className="vehicle-info__field-value vehicle-info__field-value--timestamp">
                {formatDateTime(currentPoint.timestamp, i18n.language as 'pt' | 'en' | 'es')}
              </span>
            </div>
          </div>

          {animationState.currentCourse && (
            <div className="vehicle-info__section">
              <h4 className="vehicle-info__section-title">
                {t('controls.course')}
              </h4>
              <div className="vehicle-info__field">
                <span className="vehicle-info__field-icon">🛣️</span>
                <span className="vehicle-info__field-value">
                  {animationState.currentCourse.name}
                </span>
              </div>
              <div className="vehicle-info__field">
                <span className="vehicle-info__field-icon">📏</span>
                <span className="vehicle-info__field-label">{t('info.distance')}:</span>
                <span className="vehicle-info__field-value">
                  {animationState.currentCourse.totalDistance.toFixed(1)} {t('units.km')}
                </span>
              </div>
              <div className="vehicle-info__field">
                <span className="vehicle-info__field-icon">⚡</span>
                <span className="vehicle-info__field-label">{t('vehicle.speed')}:</span>
                <span className="vehicle-info__field-value">
                  {animationState.playbackSpeed}x
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!currentPoint && !animationState.currentCourse && (
        <div className="vehicle-info__empty">
          <div className="vehicle-info__empty-icon">📍</div>
          <p className="vehicle-info__empty-text">
            {t('messages.selectCourseToView')}
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleInfo;