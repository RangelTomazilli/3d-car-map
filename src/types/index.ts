export interface GPSPoint {
  id: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  direction: number; // degrees (0-360)
  timestamp: Date;
  address?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  points: GPSPoint[];
  startTime: Date;
  endTime: Date;
  totalDistance: number; // km
  averageSpeed: number; // km/h
}

export interface Vehicle {
  id: string;
  plate: string;
  color: string;
  model?: string;
  year?: number;
}

export interface MapContainerProps {
  courses: Course[];
  selectedCourse: Course | null;
  currentPoint: GPSPoint | null;
  vehicle: Vehicle;
}

