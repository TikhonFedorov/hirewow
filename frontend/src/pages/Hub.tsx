import React from 'react';
import { useNavigate } from 'react-router-dom';
import HubLayout from '../components/HubLayout';
import { Card } from '../components/ui';
import './Hub.css';

export default function Hub() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'calculator',
      title: 'Salary Calculator',
      description: 'Calculate salary with regional coefficients, northern allowances, and KPI bonuses',
      path: '/calculator',
    },
    {
      id: 'generator',
      title: 'Job Generator',
      description: 'Create job descriptions powered by artificial intelligence',
      path: '/job_generator',
    },
    {
      id: 'summary',
      title: 'Summary & Reports',
      description: 'View summaries, analytics, and history of your calculations',
      path: '/summary',
    },
  ];

  return (
    <HubLayout title="Home" description="Select a tool to get started">
      <div className="hub-grid">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            variant="elevated"
            hover
            interactive
            className={`hub-card hub-card-${tool.id}`}
            onClick={() => navigate(tool.path)}
          >
            <div className="hub-card-content">
              <h3 className="hub-card-title">{tool.title}</h3>
              <p className="hub-card-description">{tool.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </HubLayout>
  );
}
