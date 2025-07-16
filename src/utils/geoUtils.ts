import type { GPSPoint } from '../types';

export const calculateDistance = (point1: GPSPoint, point2: GPSPoint): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

export const calculateBearing = (point1: GPSPoint, point2: GPSPoint): number => {
  const dLon = toRadians(point2.longitude - point1.longitude);
  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
};

export const interpolatePosition = (
  point1: GPSPoint,
  point2: GPSPoint,
  progress: number // 0 to 1
): [number, number] => {
  const lat = point1.latitude + (point2.latitude - point1.latitude) * progress;
  const lng = point1.longitude + (point2.longitude - point1.longitude) * progress;
  return [lat, lng];
};

export const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
};

export const formatSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} km/h`;
};

export const formatDirection = (direction: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(direction / 45) % 8;
  return `${direction.toFixed(0)}° ${directions[index]}`;
};

export const getBoundsFromPoints = (points: GPSPoint[]): [[number, number], [number, number]] => {
  if (points.length === 0) {
    return [[-23.9930, -46.2564], [-23.9930, -46.2564]];
  }
  
  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;
  
  points.forEach(point => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  });
  
  return [[minLat, minLng], [maxLat, maxLng]];
};
