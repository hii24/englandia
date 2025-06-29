'use client';

import React from 'react';
import Link from 'next/link';

export default function StripeSetupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Настройка Stripe</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">1. Создание аккаунта Stripe</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Перейдите на <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com</a></li>
              <li>Создайте аккаунт (можно использовать тестовый режим)</li>
              <li>Перейдите в Dashboard</li>
            </ol>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">2. Получение API ключей</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>В Dashboard перейдите в "Developers" → "API keys"</li>
              <li>Скопируйте "Publishable key" (начинается с pk_test_)</li>
              <li>Скопируйте "Secret key" (начинается с sk_test_)</li>
              <li>Добавьте их в .env.local</li>
            </ol>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">3. Создание продуктов и цен</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Перейдите в "Products"</li>
              <li>Создайте продукт "Базовый план"</li>
              <li>Добавьте цену с рекуррентной оплатой (4 урока/мес)</li>
              <li>Создайте продукт "Интенсивный план"</li>
              <li>Добавьте цену с рекуррентной оплатой (8 уроков/мес)</li>
              <li>Скопируйте Price IDs (начинаются с price_)</li>
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">4. Настройка Webhook</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Перейдите в "Developers" → "Webhooks"</li>
              <li>Нажмите "Add endpoint"</li>
              <li>URL: <code className="bg-gray-100 px-2 py-1 rounded">https://your-domain.com/api/webhooks/stripe</code></li>
              <li>Выберите события:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• checkout.session.completed</li>
                  <li>• customer.subscription.created</li>
                  <li>• customer.subscription.updated</li>
                  <li>• customer.subscription.deleted</li>
                  <li>• invoice.payment_failed</li>
                </ul>
              </li>
              <li>Скопируйте "Signing secret" (начинается с whsec_)</li>
            </ol>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">5. Переменные окружения</h2>
            <p className="text-sm mb-4">Добавьте в файл <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:</p>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{`# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs
STRIPE_BASIC_PRICE_ID=price_your_basic_price_id_here
STRIPE_INTENSIVE_PRICE_ID=price_your_intensive_price_id_here

# Domain
NEXT_PUBLIC_DOMAIN=http://localhost:3000`}</pre>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">6. Тестирование</h2>
            <div className="space-y-3">
              <Link href="/test-stripe-links" className="btn-primary inline-block">
                Тест создания ссылок
              </Link>
              <Link href="/test-stripe" className="btn-secondary inline-block ml-3">
                Тест модалок
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              После настройки всех переменных, протестируйте создание ссылок на Stripe.
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Проблемы и решения</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-red-700">Email приходит без кнопок оплаты</h3>
            <p className="text-sm text-gray-600 mt-1">
              Проверьте, что все переменные окружения настроены правильно. 
              Используйте тестовую страницу для диагностики.
            </p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-yellow-700">Ошибки при создании ссылок</h3>
            <p className="text-sm text-gray-600 mt-1">
              Убедитесь, что Price IDs существуют в Stripe Dashboard и соответствуют 
              рекуррентным подпискам.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-blue-700">Webhook не работает</h3>
            <p className="text-sm text-gray-600 mt-1">
              Для локальной разработки используйте Stripe CLI: 
              <code className="bg-gray-100 px-2 py-1 rounded ml-2">stripe listen --forward-to localhost:3000/api/webhooks/stripe</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 