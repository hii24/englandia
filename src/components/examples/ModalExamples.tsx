'use client';
import React from 'react';
import { useModal } from '../../hooks/useModal';
import { sendRegistration, loginUser } from '@/lib/api';

export const ModalExamples: React.FC = () => {
  const {
    openRegistrationModal,
    openLoginModal,
    openInfoModal,
    openRegistrationSuccessModal,
    closeModal
  } = useModal();

  const handleRegistration = () => {
    openRegistrationModal({
      onSubmit: async (data) => {
        try {
          const result = await sendRegistration(data);
          if (result.data && result.data.plainPassword) {
            alert('Ваш временный пароль: ' + result.data.plainPassword);
          }
          openRegistrationSuccessModal({ onClose: closeModal });
        } catch (e: any) {
          alert(e.message);
        }
      }
    });
  };

  const handleLogin = () => {
    openLoginModal({
      onSubmit: async (data) => {
        try {
          const result = await loginUser(data);
          openInfoModal({
            title: 'Успешно!',
            message: `Добро пожаловать, ${result.data.user.firstName} ${result.data.user.lastName}!`,
            buttonText: 'Понятно'
          });
        } catch (e: any) {
          openInfoModal({
            title: 'Ошибка входа',
            message: e.message,
            buttonText: 'Понятно'
          });
        }
      },
      onRegisterClick: () => {
        handleRegistration();
      }
    });
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
      
      <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}; 