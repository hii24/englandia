'use client';

import { ComponentExamples } from "@/components/examples/ComponentExamples";
import { ModalExamples } from "@/components/examples/ModalExamples";
import { BurgerMenuExamples } from "@/components/examples/BurgerMenuExamples";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { BurgerMenuDashboard } from "@/components/BurgerMenuDashboard";
import { useBurgerMenu } from "@/hooks/useBurgerMenu";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { isOpen, toggle } = useBurgerMenu();
  useEffect(() => {
    console.log('Главная страница: проверка аутентификации', { isAuthenticated });
    
    // Если пользователь уже авторизован, перенаправляем на dashboard
    if (isAuthenticated) {
      console.log('Главная страница: пользователь авторизован, перенаправляем на dashboard');
      router.push('/dashboard');
    } else {
      console.log('Главная страница: пользователь не авторизован, показываем главную');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white">
      <h1>Home</h1>
      <BurgerMenuDashboard isOpen={isOpen} onToggle={toggle} />
      {/* <ComponentExamples /> */}
      {/* <ModalExamples /> */}
      {/* <BurgerMenuExamples /> */}
    </div>
  );
} 