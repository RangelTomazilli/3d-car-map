import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Polyline, useMap } from 'react-leaflet';
import { Map as LeafletMapType } from 'leaflet';
import type { MapContainerProps } from '../../types';
import { getBoundsFromPoints } from '../../utils/geoUtils';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../data/mockCourses';
import VehicleSprite from '../VehicleSprite';
import 'leaflet/dist/leaflet.css';
import './MapContainer.scss';

interface MapUpdaterProps {
  selectedCourse: MapContainerProps['selectedCourse'];
  currentPoint: MapContainerProps['currentPoint'];
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ selectedCourse, currentPoint }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCourse && selectedCourse.points.length > 0) {
      const bounds = getBoundsFromPoints(selectedCourse.points);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [selectedCourse, map]);

  useEffect(() => {
    if (currentPoint) {
      map.setView([currentPoint.latitude, currentPoint.longitude], map.getZoom(), {
        animate: true,
        duration: 0.5,
      });
    }
  }, [currentPoint, map]);

  return null;
};

const MapContainerComponent: React.FC<MapContainerProps> = ({
  selectedCourse,
  currentPoint,
  vehicle,
  animationState,
}) => {
  const mapRef = useRef<LeafletMapType | null>(null);

  const getRouteColor = () => {
    if (!selectedCourse) return '#3388ff';
    
    const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c'];
    const index = parseInt(selectedCourse.id.split('-')[1]) - 1;
    return colors[index % colors.length] || '#3388ff';
  };

  const getRoutePoints = (): Array<[number, number]> => {
    if (!selectedCourse) return [];
    return selectedCourse.points.map(point => [point.latitude, point.longitude]);
  };

  const getVehiclePosition = (): [number, number] => {
    if (currentPoint) {
      return [currentPoint.latitude, currentPoint.longitude];
    }
    if (selectedCourse && selectedCourse.points.length > 0) {
      const firstPoint = selectedCourse.points[0];
      return [firstPoint.latitude, firstPoint.longitude];
    }
    return DEFAULT_MAP_CENTER;
  };

  const getVehicleDirection = (): number => {
    if (!currentPoint) {
      return 0;
    }
    return currentPoint.direction || 0;
  };

  return (
    <div className="map-container">
      <LeafletMap
        ref={mapRef}
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        className="map-container__map"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {selectedCourse && (
          <Polyline
            positions={getRoutePoints()}
            color={getRouteColor()}
            weight={4}
            opacity={0.7}
            dashArray="10, 5"
            pathOptions={{
              className: 'route-polyline',
            }}
          />
        )}

        <VehicleSprite
          position={getVehiclePosition()}
          direction={getVehicleDirection()}
          color={vehicle.color}
          isMoving={animationState.isPlaying}
        />

        <MapUpdater
          selectedCourse={selectedCourse}
          currentPoint={currentPoint}
        />
      </LeafletMap>

      {!selectedCourse && (
        <div className="map-container__overlay">
          <div className="map-container__message">
            <h3>Selecione um trajeto para começar</h3>
            <p>Use o painel de controle para escolher um dos trajetos disponíveis</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainerComponent;