import { Modal } from '@/components/ui/Modal/Modal';
import React from 'react';

interface InfoModalProps {
  title?: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  title = 'Информация',
  message,
  onClose,
  buttonText = 'Понятно',
}) => {
  return (
    <Modal open={true} onClose={onClose} title={title}>
      <div className="info-modal">
        <p className="info-message">{message}</p>
        <div className="info-actions">
          <button 
            className="btn btn-primary" 
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal; 