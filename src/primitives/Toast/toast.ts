import { toastStore } from './ToastStore';

export interface ToastOptions {
  description?: string;
  duration?: number;
  onUndo?: () => void;
  undoLabel?: string;
}

export const toast = {
  show: (title: string, options?: ToastOptions) => {
    return toastStore.add({
      title,
      variant: 'default',
      ...options,
    });
  },
  success: (title: string, options?: ToastOptions) => {
    return toastStore.add({
      title,
      variant: 'success',
      ...options,
    });
  },
  warning: (title: string, options?: ToastOptions) => {
    return toastStore.add({
      title,
      variant: 'warning',
      ...options,
    });
  },
  error: (title: string, options?: ToastOptions) => {
    return toastStore.add({
      title,
      variant: 'error',
      ...options,
    });
  },
  dismiss: (id: string) => {
    toastStore.dismiss(id);
  },
  clear: () => {
    toastStore.clear();
  },
};
