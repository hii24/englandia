import React from 'react';
import { Modal, Button } from '@/components/ui';
import { useModal } from '@/hooks/useModal';

interface PaymentCancelModalProps {
  onClose: () => void;
}

const PaymentCancelModal: React.FC<PaymentCancelModalProps> = ({
  onClose
}) => {
  const { openRegistrationModal } = useModal();

  const handleTryAgain = () => {
    onClose();
    // Можно открыть модалку регистрации или перенаправить к оплате
    openRegistrationModal();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Оплата не прошла 😕
        </h2>
        
        {/* Основной текст */}
        <div className="text-center text-base mb-4">
          Что-то пошло не так.<br />
          Пожалуйста, попробуйте снова или используйте другую карту. Если проблема повторится - напишите нам, и мы обязательно поможем!
        </div>
        
        {/* Кнопка */}
        <Button 
          onClick={handleTryAgain} 
          className="w-64" 
          variant="primary"
          showIcon
        >
          Попробовать снова
        </Button>

        {/* Дополнительная информация */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Нужна помощь? Обратитесь к нам:</p>
          <p className="mt-2">
            <a href="mailto:support@eng-landia.com" className="text-blue-600 hover:underline">
              support@eng-landia.com
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentCancelModal; 