import React from 'react';
import './MobileOverlay.scss';

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-overlay" onClick={onClose}>
      <div className="mobile-overlay__content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="mobile-overlay__close" 
          onClick={onClose}
          aria-label="Fechar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default MobileOverlay;