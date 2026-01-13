import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui';
import logoImage from '../images/logo.png';
import './HubLayout.css';

interface HubLayoutProps {
  children: ReactNode;
  inputPanel?: ReactNode;
  outputPanel?: ReactNode;
  title?: string;
  description?: string;
}

export default function HubLayout({
  children,
  inputPanel,
  outputPanel,
  title,
  description,
}: HubLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/hub', label: 'Home' },
    { path: '/calculator', label: 'Calculator' },
    { path: '/job_generator', label: 'Job Generator' },
    { path: '/summary', label: 'Summary' },
    { path: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hub-layout">
      <div className="hub-layout-container">
        {/* Left Sidebar */}
        <aside className="hub-sidebar">
          <div className="sidebar-header">
            <button
              onClick={() => navigate('/hub')}
              className="sidebar-logo"
              aria-label="Главная страница"
            >
              <img 
                src={logoImage} 
                alt="HireWow" 
                className="hub-page-logo"
              />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Основная навигация">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
              <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={logout}
              className="logout-button"
            >
              Sign out
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        {outputPanel ? (
          <main className="hub-output-panel">
            <div className="panel-header">
              {title ? (
                <div className="panel-title-section">
                  <h1 className="panel-title">{title}</h1>
                  {description && <p className="panel-description">{description}</p>}
                </div>
              ) : (
                <h2 className="panel-title">Result</h2>
              )}
            </div>
            <div className="panel-content">{outputPanel}</div>
          </main>
        ) : (
          <main className="hub-main">
            {title && (
              <div className="main-header">
                <h1 className="main-title">{title}</h1>
                {description && <p className="main-description">{description}</p>}
              </div>
            )}
            {children}
          </main>
        )}

        {/* Input Panel */}
        {inputPanel && (
          <aside className="hub-input-panel">
            <div className="panel-header">
              <h2 className="panel-title">Parameters</h2>
            </div>
            <div className="panel-content">{inputPanel}</div>
          </aside>
        )}
      </div>
    </div>
  );
}
