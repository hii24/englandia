import React from 'react';
import { BurgerMenu } from './ui/BurgerMenu';
import { useModalStore } from '@/store/modalStore';
import LoginModal from '@/modals/LoginModal';
import RegistrationModal from '@/modals/RegistrationModal';

interface BurgerMenuHomeProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const BurgerMenuHome: React.FC<BurgerMenuHomeProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const { openModal } = useModalStore();

  const handleLoginClick = () => {
    onToggle();
    openModal({
      id: 'login',
      component: LoginModal,
      props: {
        onClose: () => {},
        onSubmit: async (data: any) => {},
        onRegisterClick: () => {}
      }
    });
  };

  const handleRegisterClick = () => {
    onToggle();
    openModal({
      id: 'registration',
      component: RegistrationModal,
      props: {
        onClose: () => {},
        onSubmit: async (data: any) => {},
        onLoginClick: () => {}
      }
    });
  };

  return (
    <BurgerMenu isOpen={isOpen} onToggle={onToggle}>
      <div className="burger-menu-unauthenticated">
       123
      </div>
    </BurgerMenu>
  );
}; 