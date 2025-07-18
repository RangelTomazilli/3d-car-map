import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ControlPanelProps, PlaybackSpeed } from '../../types';
import './ControlPanel.scss';

const ControlPanel: React.FC<ControlPanelProps> = ({
  animationState,
  onPlay,
  onPause,
  onStop,
  onSpeedChange,
  onSeek,
}) => {
  const { t } = useTranslation();

  const playbackSpeeds: PlaybackSpeed[] = [0.5, 1, 2, 4, 8];

  const handlePlayPause = () => {
    if (animationState.isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    onSeek(value);
  };

  const getProgressMax = (): number => {
    return animationState.currentCourse ? animationState.currentCourse.points.length - 1 : 0;
  };

  const formatProgress = (): string => {
    if (!animationState.currentCourse) return '0/0';
    return `${animationState.currentPointIndex + 1}/${animationState.currentCourse.points.length}`;
  };


  return (
    <div className="control-panel">
      <div className="control-panel__section">
        <div className="control-panel__buttons">
          <button
            className="control-panel__button control-panel__button--play"
            onClick={handlePlayPause}
            disabled={!animationState.currentCourse}
            title={animationState.isPlaying ? t('controls.pause') : t('controls.play')}
          >
            {animationState.isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button
            className="control-panel__button control-panel__button--stop"
            onClick={onStop}
            disabled={!animationState.currentCourse}
            title={t('controls.stop')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z"/>
            </svg>
          </button>
        </div>

        <div className="control-panel__progress">
          <input
            type="range"
            className="control-panel__progress-slider"
            min={0}
            max={getProgressMax()}
            value={animationState.currentPointIndex}
            onChange={handleProgressChange}
            disabled={!animationState.currentCourse}
          />
          <span className="control-panel__progress-text">
            {formatProgress()}
          </span>
        </div>
      </div>

      <div className="control-panel__section">
        <div className="control-panel__speed">
          <label className="control-panel__speed-label">
            {t('controls.speed')}:
          </label>
          <div className="control-panel__speed-buttons">
            {playbackSpeeds.map(speed => (
              <button
                key={speed}
                className={`control-panel__speed-button ${
                  animationState.playbackSpeed === speed ? 'control-panel__speed-button--active' : ''
                }`}
                onClick={() => onSpeedChange(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="control-panel__status">
          <div className="control-panel__status-item">
            <span className="control-panel__status-label">{t('status.label')}:</span>
            <span className={`control-panel__status-value control-panel__status-value--${
              animationState.isPlaying ? 'playing' : animationState.isPaused ? 'paused' : 'stopped'
            }`}>
              {animationState.isPlaying ? t('status.playing') : animationState.isPaused ? t('status.paused') : t('status.stopped')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;