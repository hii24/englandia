'use client';
import { useModalStore, ModalConfig } from '../store/modalStore';
import ConfirmModal from '../modals/ConfirmModal';
import LoginModal from '../modals/LoginModal';
import RegistrationModal from '../modals/RegistrationModal';
import RegistrationSuccessModal from '../modals/RegistrationSuccessModal';

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

  const openRegistrationModal = () => {
    const modalConfig: ModalConfig = {
      id: "registration",
      component: RegistrationModal,
      props: {
        onClose: closeModal,
      },
    };
    openModal(modalConfig);
  };

  const openLoginModal = () => {
    const modalConfig: ModalConfig = {
      id: "login",
      component: LoginModal,
      props: {
        onClose: closeModal,
        onRegisterClick: openRegistrationModal,
      },
    };
    openModal(modalConfig);
  };

  const openRegistrationSuccessModal = (props: { onClose: () => void }) => {
    const modalConfig: ModalConfig = {
      id: 'registration-success',
      component: RegistrationSuccessModal,
      props: {
        ...props,
        onClose: closeModal,
      },
    };
    openModal(modalConfig);
  };

  return {
    openConfirmModal,
    openCustomModal,
    openRegistrationModal,
    openLoginModal,
    openRegistrationSuccessModal,
    closeModal,
  };
}; 