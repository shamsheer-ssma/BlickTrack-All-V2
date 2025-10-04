import { useState } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function useConfirmation() {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showConfirmation = (config: Omit<ConfirmationState, 'isOpen'>) => {
    setConfirmation({
      ...config,
      isOpen: true
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const confirm = (config: Omit<ConfirmationState, 'isOpen'>): Promise<boolean> => {
    return new Promise((resolve) => {
      showConfirmation({
        ...config,
        onConfirm: () => {
          config.onConfirm();
          hideConfirmation();
          resolve(true);
        },
        onCancel: () => {
          config.onCancel?.();
          hideConfirmation();
          resolve(false);
        }
      });
    });
  };

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirm
  };
}

