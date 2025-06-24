import React from 'react';
import { NumberInput } from './NumberInput';
import './NumberInputRow.scss';

interface NumberInputRowProps {
  leftText: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const NumberInputRow: React.FC<NumberInputRowProps> = ({
  leftText,
  value,
  onChange,
  min,
  max,
  step,
  className = '',
}) => {
  return (
    <div className={`number-input-row ${className}`.trim()}>
      <span className="number-input-row__left">{leftText}</span>
      <NumberInput
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}; 