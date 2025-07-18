import { useState, useEffect } from 'react';

interface MobileLayoutState {
  isMobile: boolean;
  isVehicleInfoOpen: boolean;
  isCourseSelectorOpen: boolean;
}

export const useMobileLayout = () => {
  const [state, setState] = useState<MobileLayoutState>({
    isMobile: false,
    isVehicleInfoOpen: false,
    isCourseSelectorOpen: false,
  });

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 640; // $breakpoint-sm
      setState(prev => ({ ...prev, isMobile }));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleVehicleInfo = () => {
    setState(prev => ({
      ...prev,
      isVehicleInfoOpen: !prev.isVehicleInfoOpen,
      // Close course selector when opening vehicle info
      isCourseSelectorOpen: prev.isVehicleInfoOpen ? prev.isCourseSelectorOpen : false,
    }));
  };

  const toggleCourseSelector = () => {
    setState(prev => ({
      ...prev,
      isCourseSelectorOpen: !prev.isCourseSelectorOpen,
      // Close vehicle info when opening course selector
      isVehicleInfoOpen: prev.isCourseSelectorOpen ? prev.isVehicleInfoOpen : false,
    }));
  };

  const closeAllPanels = () => {
    setState(prev => ({
      ...prev,
      isVehicleInfoOpen: false,
      isCourseSelectorOpen: false,
    }));
  };

  return {
    ...state,
    toggleVehicleInfo,
    toggleCourseSelector,
    closeAllPanels,
  };
};