import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
      window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);
}
