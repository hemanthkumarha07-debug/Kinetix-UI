import React from 'react';
import { motion } from 'framer-motion';
import { useModalContext } from '../context/ModalContext';
import { useSpringTransition } from '../context/MotionConfigContext';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isAnyModalOpen } = useModalContext();
  const spring = useSpringTransition();

  return (
    <motion.div
      animate={
        isAnyModalOpen
          ? {
              scale: 0.982,
              borderRadius: '14px',
              filter: 'brightness(0.75)',
            }
          : {
              scale: 1,
              borderRadius: '0px',
              filter: 'brightness(1)',
            }
      }
      transition={spring}
      className="w-full min-h-screen bg-canvas origin-top overflow-x-hidden transition-colors"
      style={{
        transformOrigin: 'top center',
      }}
    >
      {children}
    </motion.div>
  );
};
