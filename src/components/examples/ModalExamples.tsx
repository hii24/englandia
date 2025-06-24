'use client';
import React from 'react';
import { useModal } from '../../hooks/useModal';

export const ModalExamples: React.FC = () => {
  const {
    openConfirmModal,
    openInfoModal,
    openFormModal,
    openCustomModal,
  } = useModal();

  const handleConfirm = () => {
    console.log('Подтверждено!');
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
          onClick={() => openConfirmModal({
            title: 'Подтверждение действия',
            message: 'Вы уверены, что хотите выполнить это действие?',
            onConfirm: handleConfirm,
            confirmText: 'Да, выполнить',
            cancelText: 'Отмена',
          })}
        >
          Открыть Confirm Modal
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => openInfoModal({
            title: 'Информация',
            message: 'Это информационное сообщение для пользователя.',
            buttonText: 'Понятно',
          })}
        >
          Открыть Info Modal
        </button>

        <button
          className="btn btn-success"
          onClick={() => openFormModal({
            title: 'Форма регистрации',
            onSubmit: handleFormSubmit,
            submitText: 'Зарегистрироваться',
            cancelText: 'Отмена',
          })}
        >
          Открыть Form Modal
        </button>

        <button
          className="btn btn-warning"
          onClick={() => openCustomModal(CustomModal)}
        >
          Открыть Custom Modal
        </button>
      </div>
    </div>
  );
}; 