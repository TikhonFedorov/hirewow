import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className={`input-container ${hasError ? 'input-error' : ''} ${leftIcon ? 'input-has-left-icon' : ''} ${rightIcon ? 'input-has-right-icon' : ''}`}>
        {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
        <input
          id={inputId}
          className={`input ${className}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="input-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
}


