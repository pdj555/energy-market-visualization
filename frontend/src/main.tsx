import React from 'react';
import ReactDOM from 'react-dom/client';
import { EnergyDashboard } from './EnergyDashboard';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <EnergyDashboard />
  </React.StrictMode>
);
