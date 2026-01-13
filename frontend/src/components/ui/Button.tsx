import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const loadingClass = isLoading ? 'btn-loading' : '';
  const disabledClass = disabled || isLoading ? 'btn-disabled' : '';

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="btn-spinner" aria-hidden="true" />}
      <span className={isLoading ? 'btn-content-loading' : ''}>{children}</span>
    </button>
  );
}


