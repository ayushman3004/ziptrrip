/**
 * list-main.jsx — Entry point for the Todo List page (MPA Page 1).
 * Mounts TodoList directly. No router involved.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import TodoList from './TodoList';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoList />
  </StrictMode>,
);
