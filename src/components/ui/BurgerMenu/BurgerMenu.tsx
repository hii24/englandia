import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Image from 'next/image';
import { BurgerMenuButton } from '../BurgerMenuButton';
import './BurgerMenu.scss';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <>
      <BurgerMenuButton onClick={onToggle} isOpen={isOpen} />
      
      <Transition.Root show={isOpen} as={Fragment}>
        <div className="burger-menu-overlay" onClick={onToggle}>
          <Transition.Child
            as={Fragment}
            enter="burger-menu-enter"
            enterFrom="burger-menu-enterFrom"
            enterTo="burger-menu-enterTo"
            leave="burger-menu-leave"
            leaveFrom="burger-menu-leaveFrom"
            leaveTo="burger-menu-leaveTo"
          >
            <div className="burger-menu-panel" onClick={(e) => e.stopPropagation()}>
              <div className="burger-menu-header">
                <Image src="/logo.png" alt="logo" width={172} height={32} />
                <button 
                  className="burger-menu-close" 
                  onClick={onToggle}
                  aria-label="Закрыть меню"
                >
                  ×
                </button>
              </div>
              
              <div className="burger-menu-content">
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>
    </>
  );
}; 