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
  status: {
    moving: string;
    paused: string;
    stopped: string;
    playing: string;
    label: string;
    timestamp: string;
  };
  messages: {
    selectCourseToView: string;
    courseAvailable: string;
    coursesAvailable: string;
    selectCourseToStart: string;
    useControlPanel: string;
    loadingCourses: string;
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