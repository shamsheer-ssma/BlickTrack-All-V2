import React, { createContext, useContext, ReactNode } from 'react';
import ConfirmationModal from './ConfirmationModal';

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

interface ConfirmationContextType {
  showConfirmation: (config: Omit<ConfirmationState, 'isOpen'>) => void;
  hideConfirmation: () => void;
  confirm: (config: Omit<ConfirmationState, 'isOpen'>) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
}

interface ConfirmationProviderProps {
  children: ReactNode;
}

export function ConfirmationProvider({ children }: ConfirmationProviderProps) {
  const [confirmation, setConfirmation] = React.useState<ConfirmationState>({
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

  return (
    <ConfirmationContext.Provider value={{ showConfirmation, hideConfirmation, confirm }}>
      {children}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
      />
    </ConfirmationContext.Provider>
  );
}

