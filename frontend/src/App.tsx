import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './styles/cursor-design.css';

import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Hub from './pages/Hub';
import Calculator from './pages/Calculator';
import JobGenerator from './pages/JobGenerator';
import Summary from './pages/Summary';
import Profile from './pages/Profile';
import RequireAuth from './components/RequireAuth';
import Header from './components/Header';

// Component to conditionally show Header
function ConditionalHeader() {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  
  return isPublicPage ? <Header /> : null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ConditionalHeader />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/hub"
          element={
            <RequireAuth>
              <Hub />
            </RequireAuth>
          }
        />
        <Route
          path="/calculator"
          element={
            <RequireAuth>
              <Calculator />
            </RequireAuth>
          }
        />
        <Route
          path="/job_generator"
          element={
            <RequireAuth>
              <JobGenerator />
            </RequireAuth>
          }
        />
        <Route
          path="/summary"
          element={
            <RequireAuth>
              <Summary />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
