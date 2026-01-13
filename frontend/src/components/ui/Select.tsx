import React, { useState, useRef, useEffect } from 'react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  label,
  error,
  disabled = false,
  fullWidth = false,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`select-wrapper ${fullWidth ? 'select-full' : ''} ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <div
        ref={selectRef}
        className={`select-container ${isOpen ? 'select-open' : ''} ${error ? 'select-error' : ''} ${disabled ? 'select-disabled' : ''}`}
      >
        <button
          type="button"
          className="select-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={!selectedOption ? 'select-placeholder' : ''}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`select-arrow ${isOpen ? 'select-arrow-open' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="select-dropdown">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`select-option ${value === option.value ? 'select-option-selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
                {value === option.value && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="select-error-text">{error}</span>}
    </div>
  );
}


