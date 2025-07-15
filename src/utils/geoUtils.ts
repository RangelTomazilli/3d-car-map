import type { GPSPoint } from '../types';

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

export const interpolatePosition = (
  point1: GPSPoint,
  point2: GPSPoint,
  progress: number // 0 to 1
): [number, number] => {
  const lat = point1.latitude + (point2.latitude - point1.latitude) * progress;
  const lng = point1.longitude + (point2.longitude - point1.longitude) * progress;
  return [lat, lng];
};