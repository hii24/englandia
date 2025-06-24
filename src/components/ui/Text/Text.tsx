import React from 'react';
import { TextProps } from './Text.types';
import './Text.scss';

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size = 'medium',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  truncate = false,
  className = '',
  as: Component = 'span',
  ...props
}) => {
  const textClasses = [
    'text',
    `text--${variant}`,
    `text--${size}`,
    `text--${weight}`,
    `text--${color}`,
    `text--${align}`,
    truncate && 'text--truncate',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
}; 