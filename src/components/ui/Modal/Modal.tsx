import React, { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import './Modal.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  className = '',
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="modal-root" onClose={onClose}>
        <div className="modal-backdrop" aria-hidden="true" />
        <div className="modal-container">
          <Transition.Child
            as={Fragment}
            enter="modal-enter"
            enterFrom="modal-enterFrom"
            enterTo="modal-enterTo"
            leave="modal-leave"
            leaveFrom="modal-leaveFrom"
            leaveTo="modal-leaveTo"
          >
            <Dialog.Panel className={`modal-panel ${className}`.trim()}>
              <button className="modal-close" onClick={onClose} aria-label="Закрыть">
                ×
              </button>
              {title && (
                <Dialog.Title as="div" className="modal-title">
                  {title}
                </Dialog.Title>
              )}
              <div className="modal-content">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}; 