import { HTMLAttributes } from 'react';

export type TextVariant = 
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'caption'
  | 'overline';

export type TextSize = 
  | 'xs'
  | 'small'
  | 'medium'
  | 'large'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

export type TextWeight = 
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type TextColor = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted'
  | 'white';

export type TextAlign = 
  | 'left'
  | 'center'
  | 'right'
  | 'justify';

export type TextElement = 
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  truncate?: boolean;
  as?: TextElement;
  children: React.ReactNode;
} 