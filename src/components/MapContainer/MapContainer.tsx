import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Polyline, useMap } from 'react-leaflet';
import { Map as LeafletMapType } from 'leaflet';
import type { MapContainerProps } from '../../types';
import 'leaflet/dist/leaflet.css';
import './MapContainer.scss';

const MapContainerComponent: React.FC<MapContainerProps> = () => {
  const mapRef = useRef<LeafletMapType | null>(null);

  return (
    <div className="map-container">
      <LeafletMap
        ref={mapRef}
        className="map-container__map"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
      </LeafletMap>
    </div>
  );
};

export default MapContainerComponent;