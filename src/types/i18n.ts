export interface TranslationKeys {
  app: {
    title: string;
    description: string;
  };
  vehicle: {
    plate: string;
    speed: string;
    direction: string;
    position: string;
    status: string;
  };
  controls: {
    play: string;
    pause: string;
    stop: string;
    speed: string;
    course: string;
    selectCourse: string;
  };
  courses: {
    course1: string;
    course2: string;
    course3: string;
    course4: string;
    course5: string;
  };
  info: {
    totalPoints: string;
    currentPoint: string;
    duration: string;
    distance: string;
    averageSpeed: string;
  };
  units: {
    kmh: string;
    km: string;
    degrees: string;
    minutes: string;
    seconds: string;
  };
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationKeys;
    };
  }
}