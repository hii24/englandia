'use client';
import React from 'react';
import './NumberInput.scss';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  error?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = '',
  className = '',
  error,
}) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - step);
  };
  const handleIncrement = () => {
    if (value < max) onChange(value + step);
  };
  return (
    <div className={`number-input-wrapper ${className}`.trim()}>
      {label && (
        <span className="number-input__label">{label}</span>
      )}
      <div className="number-input__container">
        <button
          type="button"
          className="number-input__btn number-input__btn--minus"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Уменьшить"
        >
          <span className="number-input__icon">–</span>
        </button>
        <span className="number-input__value">{value}</span>
        <button
          type="button"
          className="number-input__btn number-input__btn--plus"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Увеличить"
        >
          <span className="number-input__icon">+</span>
        </button>
      </div>
      {error && <div className="number-input__error">{error}</div>}
    </div>
  );
};

export type { NumberInputProps }; 