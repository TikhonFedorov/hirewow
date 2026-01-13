import React from 'react';
import './Checkbox.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  fullWidth?: boolean;
}

export default function Checkbox({
  label,
  fullWidth = false,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`checkbox-wrapper ${fullWidth ? 'checkbox-full' : ''}`}>
      <input
        type="checkbox"
        id={checkboxId}
        className={`checkbox-input ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="checkbox-label">
          {label}
        </label>
      )}
    </div>
  );
}


