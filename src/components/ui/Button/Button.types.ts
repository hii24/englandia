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

export type IconColor = 'default' | 'white';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  showIcon?: boolean;
  iconColor?: IconColor;
  children: React.ReactNode;
} 