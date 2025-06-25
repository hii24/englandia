'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Сайдбар - только на десктопе */}
      <Sidebar />

      {/* Основной контент */}
      <main className="flex-1 flex flex-col">
        {/* Header с бургер-кнопкой - только на мобильных */}
        <Header />

        {/* Контент страницы */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 