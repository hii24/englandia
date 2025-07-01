import React, { useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

interface PaymentSuccessModalProps {
  onClose: () => void;
  sessionId?: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  onClose,
  sessionId
}) => {
  const router = useRouter();
  const { refreshUser } = useUserStore();

  // Обновляем данные пользователя при открытии модалки
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleGoToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Оплата прошла успешно!
        </h2>
        
        {/* Основной текст */}
        <div className="text-center text-base mb-2">
          Спасибо за доверие! Все детали и доступы уже отправлены на вашу почту.
        </div>
        
        {/* Дополнительный текст */}
        <div className="text-center font-bold text-lg mb-4">
          До встречи на занятиях — будет интересно! 😊
        </div>

        {/* ID сессии (если есть) */}
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full">
            <p className="text-sm text-gray-500">ID сессии:</p>
            <p className="font-mono text-sm break-all">{sessionId}</p>
          </div>
        )}
        
        {/* Кнопка */}
        <Button 
          onClick={handleGoToDashboard} 
        
          variant="primary"
          showIcon
        >
          Перейти в личный кабинет
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentSuccessModal; 