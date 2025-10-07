import React from 'react';
import { Modal } from '@/components/ui/Modal';

interface SubscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({
  isOpen,
  onClose,
  sessionId
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="text-center p-6">
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

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Подписка успешно оформлена!
        </h2>

        <p className="text-gray-600 mb-6">
          Поздравляем! Ваша подписка активирована. Теперь у вас есть доступ ко всем урокам платформы.
        </p>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">ID сессии:</p>
            <p className="font-mono text-sm break-all">{sessionId}</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600 font-semibold">
            Что изменилось:
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li>• ✅ Ваша роль изменена с &ldquo;Гость&rdquo; на &ldquo;Студент&rdquo;</li>
            <li>• ✅ Теперь вы можете видеть все уроки курса</li>
            <li>• ✅ Учитель сможет назначать вам занятия</li>
            <li>• ✅ Вы получите доступ к домашним заданиям</li>
            <li>• ✅ Подписка будет автоматически продлеваться</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
}; 