import React from 'react';
import { Input } from '../Input';
import './SearchInput.scss';
import { InputProps } from '../Input/Input.types';
import Image from 'next/image';

export const SearchInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      {...props}
      className={`search-input ${props.className || ''}`.trim()}
      rightIcon={
        <Image src="/search.svg" alt="search" width={24} height={24} />
      }
      variant="outlined"
    />
  );
}; 