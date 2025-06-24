'use client';
import React from 'react';
import { useModal } from '../../hooks/useModal';

export const ModalExamples: React.FC = () => {
  const {
    openRegistrationModal
  } = useModal();

  const handleConfirm = () => {
    openRegistrationModal({
      onSubmit: (data) => {
        // обработка данных формы
        console.log(data);
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
          onClick={() => handleConfirm()}
        >
          Открыть Confirm Modal
        </button>

        
      </div>
    </div>
  );
}; 