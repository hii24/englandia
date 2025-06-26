import React from 'react';
import { BurgerMenu } from './ui/BurgerMenu';
import { useUserStore } from '@/store/userStore';
import { useModalStore } from '@/store/modalStore';
import RegistrationModal from '@/modals/RegistrationModal';
import { sendRegistration } from '@/lib/api';
import { LoginModal } from '@/modals';
import { useModal } from '@/hooks/useModal';
import { ProfileInfoBlock } from './dashboard/Sidebar/ProfileInfoBlock';
import './dashboard/Sidebar/Sidebar.scss';

interface BurgerMenuDashboardProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const BurgerMenuDashboard: React.FC<BurgerMenuDashboardProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const { user, logout, isAuthenticated } = useUserStore();

  const handleLogout = () => {
    logout();
    onToggle();
  };


  return (
    <BurgerMenu isOpen={isOpen} onToggle={onToggle}>
       <ProfileInfoBlock user={user} onLogout={handleLogout} />
    </BurgerMenu>
  );
}; 