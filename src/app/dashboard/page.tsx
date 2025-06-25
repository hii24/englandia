'use client';

import AuthGuard from '@/components/AuthGuard';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { BurgerMenuButton } from '@/components/ui';
import React, { useState } from 'react';
import { BurgerMenuHome } from '@/components/BurgerMenuHome';
import { BurgerMenuDashboard } from '@/components/BurgerMenuDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
      
        <BurgerMenuDashboard isOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
      </div>
    </AuthGuard>
  );
} 