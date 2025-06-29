'use client';

import React, { useState } from 'react';
import { SubscriptionSuccessModal, SubscriptionCancelModal } from '@/modals';

export default function TestStripePage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sessionId, setSessionId] = useState('cs_test_1234567890');

  const handleTestSuccess = () => {
    setSessionId('cs_test_' + Math.random().toString(36).substr(2, 9));
    setShowSuccessModal(true);
  };

  const handleTestCancel = () => {
    setShowCancelModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тест интеграции Stripe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Модалки подписки</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleTestSuccess}
              className="btn-primary w-full"
            >
              Тест успешной оплаты
            </button>
            
            <button
              onClick={handleTestCancel}
              className="btn-secondary w-full"
            >
              Тест отмененной оплаты
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Информация</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold">Переменные окружения:</h3>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• STRIPE_SECRET_KEY</li>
                <li>• STRIPE_PUBLISHABLE_KEY</li>
                <li>• STRIPE_WEBHOOK_SECRET</li>
                <li>• STRIPE_BASIC_PRICE_ID</li>
                <li>• STRIPE_INTENSIVE_PRICE_ID</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">API endpoints:</h3>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• POST /api/subscription/create-checkout</li>
                <li>• POST /api/webhooks/stripe</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Страницы:</h3>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• /subscription/success</li>
                <li>• /subscription/cancel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Модалки */}
      <SubscriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        sessionId={sessionId}
      />
      
      <SubscriptionCancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
    </div>
  );
} 