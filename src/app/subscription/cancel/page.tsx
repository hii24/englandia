'use client';

import React from 'react';
import Link from 'next/link';

export default function SubscriptionCancelPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-8 h-8 text-yellow-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Оплата отменена
        </h1>

        <p className="text-gray-600 mb-6">
          Вы отменили оформление подписки. Ваша роль осталась "Гость" и у вас есть доступ только к первому уроку.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Что это означает?
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li>• Вы можете продолжить обучение с первым уроком</li>
            <li>• Для доступа к остальным урокам нужна подписка</li>
            <li>• Вы можете оформить подписку в любое время</li>
            <li>• Проверьте email с предложением подписки</li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          <Link 
            href="/dashboard" 
            className="btn-primary inline-block"
          >
            Вернуться к урокам
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Нужна помощь? Обратитесь к нам:</p>
            <p className="mt-2">
              <a href="mailto:support@eng-landia.com" className="text-blue-600 hover:underline">
                support@eng-landia.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 