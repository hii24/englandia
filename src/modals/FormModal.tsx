'use client';
import { Modal } from '@/components/ui/Modal/Modal';
import React, { useState } from 'react';

interface FormModalProps {
  title?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
}

const FormModal: React.FC<FormModalProps> = ({
  title = 'Форма',
  onSubmit,
  onCancel,
  submitText = 'Отправить',
  cancelText = 'Отмена',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal open={true} onClose={onCancel} title={title}>
      <div className="form-modal">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FormModal; 