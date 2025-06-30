import React from 'react';
import './Button.scss';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  showIcon = false,
  iconColor = 'default',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    disabled && 'button--disabled',
    loading && 'button--loading',
    className
  ].filter(Boolean).join(' ');

  // Определяем цвета для иконки
  const iconBgColor = iconColor !== 'white' ? '#440693' : '#ffffff';
  const iconStrokeColor = iconColor !== 'white' ? '#ffffff' : '#440693';

  return (
    <div className="button__container">
      <button
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && <span className="button__loader" />}
        <span className="button__content">{children}</span>
      </button>
      {showIcon && (
        <div className="button__icon">
          <div className="circle-btn" style={{ backgroundColor: iconBgColor }}>
            <span className="arrow arrow-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconStrokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className="arrow arrow-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconStrokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 