import { useCallback, useEffect, useState } from 'react';

const KEY = 'vectorflow.theme.v1';

export function useThemeMode() {
  const [mode, setMode] = useState(() => localStorage.getItem(KEY) || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(KEY, mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  return { mode, toggle };
}
