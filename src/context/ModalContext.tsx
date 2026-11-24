import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface ModalContextValue {
  isAnyModalOpen: boolean;
  registerModal: () => () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalCount, setModalCount] = useState(0);

  const registerModal = useCallback(() => {
    setModalCount((prev) => prev + 1);
    return () => {
      setModalCount((prev) => Math.max(0, prev - 1));
    };
  }, []);

  const value = useMemo(
    () => ({
      isAnyModalOpen: modalCount > 0,
      registerModal,
    }),
    [modalCount, registerModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
