import React from 'react';
import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { VehicleSpriteProps } from '../../types';
import './VehicleSprite.scss';

const VehicleSprite: React.FC<VehicleSpriteProps> = ({
  position,
  direction,
  isMoving,
}) => {
  const createVehicleIcon = () => {
    const size = 32;
    const totalFrames = 120; // 120 sprites
    const degreesPerFrame = 360 / totalFrames; // 3° por sprite
    
    // Normalizar a direção para 0-359 graus
    const normalizedDirection = ((direction % 360) + 360) % 360;

    // Como o sprite gira anti-horário, invertemos a direção
    const frameIndex = Math.floor((360 - normalizedDirection) / degreesPerFrame) % totalFrames;
    
    const html = `
      <div class="vehicle-sprite ${isMoving ? 'vehicle-sprite--moving' : ''}"
           style="
             width: ${size}px;
             height: ${size}px;
             overflow: hidden;
             position: relative;
           ">
        <img 
          src="/assets/cars.png" 
          alt="Vehicle" 
          style="
            position: absolute;
            width: ${totalFrames * size}px;
            height: ${size}px;
            left: -${frameIndex * size}px;
            top: 0;
            image-rendering: pixelated;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          "
        />
        
        ${isMoving ? '<div class="vehicle-sprite__pulse"></div>' : ''}
      </div>
    `;

    return divIcon({
      html,
      className: 'vehicle-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  return (
    <Marker
      position={position}
      icon={createVehicleIcon()}
      zIndexOffset={1000}
    />
  );
};

export default VehicleSprite;