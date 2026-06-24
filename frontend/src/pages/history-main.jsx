/**
 * history-main.jsx — Entry point for the Activity History page (MPA Page 3).
 * Mounts HistoryPage directly.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import HistoryPage from './HistoryPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HistoryPage />
  </StrictMode>,
);
