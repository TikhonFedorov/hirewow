import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoImage from '../images/logo.png';
import '../styles/header.css';

export default function Header() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button
            onClick={() => navigate('/')}
            className="header-logo"
            aria-label="Главная страница"
          >
            <img 
              src={logoImage} 
              alt="HireWow" 
              className="header-logo-image"
            />
          </button>
          <nav className="header-nav" aria-label="Основная навигация">
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => scrollToSection('features'), 100);
              }}
              className="header-link"
            >
              Features
            </button>
          </nav>
        </div>
        <div className="header-right">
          {token ? (
            <button
              onClick={() => navigate('/hub')}
              className="header-button header-button-primary"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="header-button"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="header-button header-button-primary"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

