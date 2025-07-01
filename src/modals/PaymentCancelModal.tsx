import React from 'react';
import { Modal, Button } from '@/components/ui';

interface PaymentCancelModalProps {
  onClose: () => void;
}

const PaymentCancelModal: React.FC<PaymentCancelModalProps> = ({
  onClose
}) => {
  const handleTryAgain = () => {
    onClose();
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
          <b>Что-то пошло не так.</b><br />
          Но не переживайте! Вы можете повторить оплату.
        </div>

        {/* Инструкция */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 w-full">
          <h4 className="font-bold text-blue-900 mb-2">📧 Как повторить оплату:</h4>
          <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
            <li>Перейдите в свою почту</li>
            <li>Найдите письмо <b>"Поздравляем с первым уроком!"</b> от Eng-Landia</li>
            <li>В этом письме есть кнопки <b>"Оформить базовую подписку"</b> и <b>"Оформить интенсивную подписку"</b></li>
            <li>Нажмите на нужную кнопку для повторной оплаты</li>
          </ol>
          <p className="text-xs text-blue-600 mt-3">
            💡 Если письма нет в основной папке, проверьте папку "Спам"
          </p>
        </div>
        
        {/* Кнопка */}
        <Button 
          onClick={handleTryAgain} 
          variant="primary"
          showIcon
        >
          Понятно
        </Button>

        
      </div>
    </Modal>
  );
};

export default PaymentCancelModal; 