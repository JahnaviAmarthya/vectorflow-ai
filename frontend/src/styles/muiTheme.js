import { createTheme } from '@mui/material/styles';

export function buildMuiTheme(mode) {
  const isDark = mode !== 'light';
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#6366f1' },
      secondary: { main: '#a855f7' },
      background: {
        default: isDark ? '#0b0e14' : '#f6f7fb',
        paper: isDark ? '#12151c' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e7e9ee' : '#171923',
        secondary: isDark ? '#9298ab' : '#565c72',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
  });
}
