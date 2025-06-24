'use client';
import { useModalStore, ModalConfig } from '../store/modalStore';
import ConfirmModal from '../modals/ConfirmModal';
import InfoModal from '../modals/InfoModal';
import FormModal from '../modals/FormModal';

export const useModal = () => {
  const { openModal, closeModal } = useModalStore();

  const openConfirmModal = (props: {
    title?: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => {
    const modalConfig: ModalConfig = {
      id: 'confirm',
      component: ConfirmModal,
      props: {
        ...props,
        onCancel: closeModal,
      },
    };
    openModal(modalConfig);
  };

  const openInfoModal = (props: {
    title?: string;
    message: string;
    buttonText?: string;
  }) => {
    const modalConfig: ModalConfig = {
      id: 'info',
      component: InfoModal,
      props: {
        ...props,
        onClose: closeModal,
      },
    };
    openModal(modalConfig);
  };

  const openFormModal = (props: {
    title?: string;
    onSubmit: (data: any) => void;
    submitText?: string;
    cancelText?: string;
  }) => {
    const modalConfig: ModalConfig = {
      id: 'form',
      component: FormModal,
      props: {
        ...props,
        onCancel: closeModal,
      },
    };
    openModal(modalConfig);
  };

  const openCustomModal = (component: React.ComponentType<any>, props?: Record<string, any>) => {
    const modalConfig: ModalConfig = {
      id: 'custom',
      component,
      props: {
        ...props,
        onClose: closeModal,
      },
    };
    openModal(modalConfig);
  };

  return {
    openConfirmModal,
    openInfoModal,
    openFormModal,
    openCustomModal,
    closeModal,
  };
}; 