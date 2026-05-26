import { useState, useEffect } from 'react';

const DESKTOP_QUERY = '(min-width: 769px)';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mediaQuery.matches);

    const onChange = event => setIsDesktop(event.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
};

export default useIsDesktop;
