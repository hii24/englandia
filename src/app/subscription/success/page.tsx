'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

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

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">ID сессии:</p>
            <p className="font-mono text-sm break-all">{sessionId}</p>
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

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Загрузка...</div>}>
      <SuccessContent />
    </Suspense>
  );
} 