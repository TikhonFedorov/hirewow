import React from 'react';
import './Card.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  hover?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

export default function Card({
  variant = 'default',
  hover = false,
  interactive = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'card';
  const variantClass = `card-${variant}`;
  const hoverClass = hover ? 'card-hover' : '';
  const interactiveClass = interactive ? 'card-interactive' : '';

  return (
    <div
      className={`${baseClasses} ${variantClass} ${hoverClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}


