'use client';
import React from 'react';
import { useModalStore } from '../store/modalStore';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentModal, closeModal } = useModalStore();

  return (
    <>
      {children}
      {currentModal && (
        <currentModal.component
          {...currentModal.props}
          onClose={closeModal}
        />
      )}
    </>
  );
}; 