'use client';

import { ComponentExamples } from "@/components/examples/ComponentExamples";
import { ModalExamples } from "@/components/examples/ModalExamples";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

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
      {/* <ComponentExamples /> */}
      <ModalExamples />
    </div>
  );
} 