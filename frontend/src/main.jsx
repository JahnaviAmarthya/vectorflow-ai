import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { buildMuiTheme } from './styles/muiTheme';
import './styles/theme.css';

const initialMode = localStorage.getItem('vectorflow.theme.v1') || 'dark';
document.documentElement.setAttribute('data-theme', initialMode);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={buildMuiTheme(initialMode)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
