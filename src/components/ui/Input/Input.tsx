'use client';
import React, { forwardRef, useRef, useEffect, useState, useId } from 'react';
import './Input.scss';
import { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  disabled = false,
  required = false,
  className = '',
  leftIcon,
  rightIcon,
  id,
  placeholder,
  onChange,
  ...props
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(props.defaultValue ?? '');
  const generatedId = useId();

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(inputRef.current);
    } else if (ref) {
      // @ts-ignore
      ref.current = inputRef.current;
    }
  }, [ref]);

  const isControlled = props.value !== undefined;
  const currentValue = isControlled ? props.value : internalValue;
  const hasValue = currentValue !== undefined && currentValue !== '';

  const inputId = id || generatedId;
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    fullWidth && 'input--full-width',
    disabled && 'input--disabled',
    error && 'input--error',
    hasValue && 'input--with-label',
    className
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'input-wrapper',
    fullWidth && 'input-wrapper--full-width',
    disabled && 'input-wrapper--disabled',
    error && 'input-wrapper--error',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className="input__container">
        {leftIcon && (
          <span className="input__icon input__icon--left">{leftIcon}</span>
        )}

        {(label ||placeholder) && hasValue && (
          <label
            className="input__label input__label--static"
            htmlFor={inputId}
          >
            {label || placeholder }
            {required && <span className="input__required">*</span>}
          </label>
        )}
        <input
          ref={inputRef}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          placeholder={!hasValue ? placeholder || label : ''}
          autoComplete="off"
          value={isControlled ? props.value : undefined}
          defaultValue={props.defaultValue}
          onChange={e => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <span className="input__icon input__icon--right">{rightIcon}</span>
        )}
      </div>
      {(error || helperText) && (
        <div className="input__message">
          {error && <span className="input__error" id={`${inputId}-error`}>{error}</span>}
          {helperText && !error && <span className="input__helper" id={`${inputId}-helper`}>{helperText}</span>}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input'; 