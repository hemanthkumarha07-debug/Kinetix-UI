export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // duration in ms, default 5000
  createdAt: number;
  onUndo?: () => void;
  undoLabel?: string;
}

class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Set<() => void> = new Set();
  private snapshot: ToastItem[] = [];

  constructor() {
    this.updateSnapshot();
  }

  private updateSnapshot() {
    this.snapshot = [...this.toasts];
  }

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): ToastItem[] => {
    return this.snapshot;
  };

  private notify() {
    this.updateSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  public add(item: Omit<ToastItem, 'id' | 'createdAt'>): string {
    const id = `toast-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
    const newToast: ToastItem = {
      ...item,
      id,
      createdAt: Date.now(),
      duration: item.duration ?? 5000,
    };

    // Prepend new toast to list
    this.toasts = [newToast, ...this.toasts];
    this.notify();
    return id;
  }

  public dismiss = (id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  };

  public clear = () => {
    this.toasts = [];
    this.notify();
  };
}

export const toastStore = new ToastStore();
