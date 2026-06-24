import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetail from './pages/TodoDetail';

/**
 * App — sets up React Router v6 routes.
 * Navigation between pages uses window.location.href (full page reloads),
 * not React Router's useNavigate, satisfying the multi-page requirement.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/todo" element={<TodoDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
