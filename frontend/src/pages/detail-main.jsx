/**
 * detail-main.jsx — Entry point for the Todo Detail page (MPA Page 2).
 * Mounts TodoDetail directly. No router involved.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import TodoDetail from './TodoDetail';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoDetail />
  </StrictMode>,
);
