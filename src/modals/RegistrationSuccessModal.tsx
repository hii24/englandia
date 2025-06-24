import { Modal, Button } from "@/components/ui";
import React from "react";

interface RegistrationSuccessModalProps {
  onClose: () => void;
}

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({ onClose }) => (
  <Modal open={true} onClose={onClose}>
    <div className="flex flex-col items-center gap-6 py-4 px-2">
      <h2 className="text-2xl font-bold text-center mb-2">Спасибо за регистрацию!</h2>
      <div className="text-center text-base mb-2">
        Мы уже получили вашу заявку.<br />
        Скоро на вашу почту придёт письмо с приглашением и доступом к пробному занятию.
      </div>
      <div className="text-center font-bold text-lg mb-4">
        До встречи на уроке! <span role="img" aria-label="smile">😊</span>
      </div>
      <Button onClick={onClose} className="w-40" variant="primary">
        Закрыть
      </Button>
    </div>
  </Modal>
);

export default RegistrationSuccessModal; 