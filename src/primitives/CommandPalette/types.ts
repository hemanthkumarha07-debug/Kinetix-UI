import React from 'react';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  onSelect?: () => void;
  childrenPageId?: string; // If set, navigating to this command drills down to this page
}

export interface CommandPage {
  id: string;
  title: string;
  breadcrumb?: string;
  placeholder?: string;
  items: CommandItem[];
}
