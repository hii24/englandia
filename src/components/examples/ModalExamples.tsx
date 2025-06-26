'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '../../hooks/useModal';
import { sendRegistration, loginUser } from '@/lib/api';

export const ModalExamples: React.FC = () => {
  const router = useRouter();
  const {
    openRegistrationModal,
    openLoginModal,
    openRegistrationSuccessModal,
    closeModal
  } = useModal();

  const handleRegistration = () => {
    openRegistrationModal();
  };

  const handleLogin = () => {
    openLoginModal();
  };

  const handleFormSubmit = (data: any) => {
    console.log('Данные формы:', data);
  };

  const CustomModal = ({ onClose }: { onClose: () => void }) => (
    <div className="custom-modal">
      <h3>Кастомное модальное окно</h3>
      <p>Это пример кастомного модального окна</p>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );

  return (
    <div className="modal-examples p-8">
      <h2 className="text-2xl font-bold mb-6">Примеры модальных окон</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          className="btn btn-primary"
          onClick={handleRegistration}
        >
          Открыть Registration Modal
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleLogin}
        >
          Открыть Login Modal
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => router.push('/dashboard/test')}
        >
          Тестовая страница Dashboard
        </button>
      </div>
    </div>
  );
}; 