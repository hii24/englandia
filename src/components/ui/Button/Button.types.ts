import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'outline'
  | 'ghost';

export type ButtonSize = 
  | 'small'
  | 'medium'
  | 'large'
  | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  showIcon?: boolean;
  children: React.ReactNode;
} 