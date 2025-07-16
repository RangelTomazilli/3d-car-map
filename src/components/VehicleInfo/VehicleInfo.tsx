import React from 'react';
import { useTranslation } from 'react-i18next';
import type { VehicleInfoProps } from '../../types';
import { formatCoordinates, formatSpeed, formatDirection } from '../../utils/geoUtils';
import { formatDateTime } from '../../utils/dateUtils';
import './VehicleInfo.scss';

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  vehicle,
  currentPoint,
  animationState,
}) => {
  const { t, i18n } = useTranslation();

  const getStatusColor = () => {
    if (animationState.isPlaying) return '#10b981'; // green
    if (animationState.isPaused) return '#f59e0b'; // amber
    return '#64748b'; // gray
  };

  const getStatusText = () => {
    if (animationState.isPlaying) return 'Em movimento';
    if (animationState.isPaused) return 'Pausado';
    return 'Parado';
  };

  const getProgressPercentage = (): number => {
    if (!animationState.currentCourse || animationState.currentCourse.points.length === 0) {
      return 0;
    }
    return (animationState.currentPointIndex / (animationState.currentCourse.points.length - 1)) * 100;
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="vehicle-info">
      <div className="vehicle-info__header">
        <div className="vehicle-info__vehicle">
          <div 
            className="vehicle-info__vehicle-icon"
            style={{ backgroundColor: vehicle.color }}
          >
            🚗
          </div>
          <div className="vehicle-info__vehicle-details">
            <h3 className="vehicle-info__vehicle-plate">{vehicle.plate}</h3>
            <p className="vehicle-info__vehicle-model">
              {vehicle.model} {vehicle.year}
            </p>
          </div>
        </div>

        <button 
          className="vehicle-info__language-toggle"
          onClick={toggleLanguage}
          title={`Switch to ${i18n.language === 'pt' ? 'English' : 'Português'}`}
        >
          {i18n.language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
        </button>
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
              Timestamp
            </h4>
            <div className="vehicle-info__field">
              <span className="vehicle-info__field-icon">⏰</span>
              <span className="vehicle-info__field-value vehicle-info__field-value--timestamp">
                {formatDateTime(currentPoint.timestamp, i18n.language as 'pt' | 'en')}
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
                  {t(`courses.${animationState.currentCourse.id.replace('-', '')}`)}
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
                <span className="vehicle-info__field-label">Velocidade:</span>
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
            Selecione um trajeto para ver as informações do veículo
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleInfo;