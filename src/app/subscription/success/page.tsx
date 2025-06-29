'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    
    if (sessionId) {
      // Здесь можно сделать запрос к API для получения данных о сессии
      setSessionData({ id: sessionId });
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Обрабатываем ваш платеж...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Подписка успешно оформлена!
        </h1>

        <p className="text-gray-600 mb-6">
          Поздравляем! Ваша подписка активирована. Теперь у вас есть доступ ко всем урокам платформы.
        </p>

        {sessionData?.id && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">ID сессии:</p>
            <p className="font-mono text-sm break-all">{sessionData.id}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Что дальше?
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li>• Ваша роль изменена с "Гость" на "Студент"</li>
            <li>• Теперь вы можете видеть все уроки курса</li>
            <li>• Учитель сможет назначать вам занятия</li>
            <li>• Вы получите доступ к домашним заданиям</li>
            <li>• Подписка будет автоматически продлеваться</li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link 
            href="/dashboard" 
            className="btn-primary inline-block"
          >
            Перейти к урокам
          </Link>
        </div>
      </div>
    </div>
  );
} 