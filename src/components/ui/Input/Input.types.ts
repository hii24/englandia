import { InputHTMLAttributes } from 'react';

export type InputVariant = 
  | 'outlined'
  | 'filled'
  | 'underlined'
  | 'ghost';

export type InputSize = 
  | 'small'
  | 'medium'
  | 'large';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} 