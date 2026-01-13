import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Main.css';
import '../styles/cursor-design.css';

export default function Main() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTryDemo = () => {
    if (token) {
      navigate('/hub');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-title">
              The AI-powered platform for recruiters
            </h1>
            <p className="hero-description">
              Automate salary calculations, generate job descriptions with AI, and analyze data. 
              Everything you need in one place.
            </p>
            <div className="hero-cta">
              <button 
                className="cursor-btn cursor-btn-primary" 
                onClick={() => navigate('/register')}
                aria-label="Перейти к регистрации"
              >
                Get started
              </button>
              <button 
                className="cursor-btn cursor-btn-ghost" 
                onClick={handleTryDemo}
                aria-label="Запросить демонстрацию"
              >
                View demo
              </button>
            </div>
          </div>
          <div className="hero-visual"></div>
        </div>
      </section>

      {/* Companies Strip */}
      <section className="companies">
        <div className="container">
          <p className="companies-label">Trusted by companies</p>
          <div className="companies-logos">
            <span>TechCorp®</span>
            <span>Innovate Inc.</span>
            <span>SkyNet Solutions</span>
            <span>CodeMasters</span>
            <span>QuantumLabs</span>
            <span>TechPulse</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-description">
              Powerful tools to streamline your recruitment workflow and boost productivity
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Salary Calculator</h3>
              <p className="feature-description">
                Accurate salary calculations with regional coefficients, 
                northern allowances, and KPI bonuses. Detailed monthly breakdown.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">AI Job Generator</h3>
              <p className="feature-description">
                Create professional job descriptions powered by AI 
                in minutes, not hours.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Analytics & Reports</h3>
              <p className="feature-description">
                Comprehensive dashboards and tools to track 
                performance and analyze data.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Templates & Documents</h3>
              <p className="feature-description">
                Ready-to-use document templates and automated 
                report generation for your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust">
        <div className="container">
          <div className="trust-header">
            <h2 className="section-title">Trusted by professionals</h2>
            <p className="section-description">
              Thousands of recruiters already use our tools to boost efficiency
            </p>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-metric">10k+</div>
              <p className="trust-label">
                Active users
              </p>
            </div>
            <div className="trust-card">
              <div className="trust-metric">99.9%</div>
              <p className="trust-label">
                Uptime
              </p>
            </div>
            <div className="trust-card">
              <div className="trust-metric">24/7</div>
              <p className="trust-label">
                Availability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="section-title">Ready to get started?</h2>
          <p className="section-description">
            Join thousands of recruiters already using HireWow
          </p>
          <div className="cta-buttons">
            <button 
              className="cursor-btn cursor-btn-primary" 
              onClick={() => navigate('/register')}
              aria-label="Начать регистрацию"
            >
              Get started
            </button>
            <button 
              className="cursor-btn cursor-btn-ghost" 
              onClick={handleTryDemo}
              aria-label="Попробовать демо"
            >
              View demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-title">HireWow</h3>
              <p className="footer-text">AI-powered recruitment tools</p>
            </div>
            <nav className="footer-nav" aria-label="Footer navigation">
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="footer-link">
                Features
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); }} className="footer-link">
                Contact
              </a>
            </nav>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">©2024 HireWow</p>
            <div className="footer-links">
              <a href="#privacy" className="footer-link-small">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
