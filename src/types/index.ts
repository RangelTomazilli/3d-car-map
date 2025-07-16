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

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPointIndex: number;
  interpolationProgress: number; // 0-1 progresso entre pontos atual e próximo
  playbackSpeed: number; // multiplier (0.5x, 1x, 2x, etc.)
  currentCourse: Course | null;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  bearing: number;
}

export type PlaybackSpeed = 0.5 | 1 | 2 | 4 | 8;

export interface ControlPanelProps {
  animationState: AnimationState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onSeek: (pointIndex: number) => void;
}

export interface CourseSelectorProps {
  courses: Course[];
  selectedCourse: Course | null;
  onCourseSelect: (course: Course) => void;
}

export interface VehicleInfoProps {
  vehicle: Vehicle;
  currentPoint: GPSPoint | null;
  animationState: AnimationState;
}

export interface VehicleSpriteProps {
  position: [number, number];
  direction: number;
  color: string;
  isMoving: boolean;
}

export interface MapContainerProps {
  courses: Course[];
  selectedCourse: Course | null;
  currentPoint: GPSPoint | null;
  vehicle: Vehicle;
  animationState: AnimationState;
}