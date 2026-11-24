import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, ChevronDown } from 'lucide-react';
import { useSpringTransition } from '../../context/MotionConfigContext';

export interface ComboboxOption {
  id: string;
  label: string;
  category?: string;
  icon?: React.ReactNode;
}

export interface MultiSelectComboboxProps {
  options: ComboboxOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  onCreateOption?: (label: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
}

export const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  options,
  selectedIds,
  onChange,
  onCreateOption,
  placeholder = 'Select items or type to create...',
  label,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedLastPill, setHighlightedLastPill] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const spring = useSpringTransition();
  const listboxId = useId();

  // Selected item lookup
  const selectedMap = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedOptions = useMemo(() => {
    return selectedIds
      .map((id) => options.find((opt) => opt.id === id) || { id, label: id })
      .filter(Boolean);
  }, [selectedIds, options]);

  // Filtered options
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  // Is there an exact match or should we offer "Create 'XYZ'"
  const showCreateOption = useMemo(() => {
    const q = query.trim();
    if (!q) return false;
    const exactMatch = options.some((opt) => opt.label.toLowerCase() === q.toLowerCase());
    return !exactMatch;
  }, [query, options]);

  // Total selectable items in dropdown list: filteredOptions + (showCreateOption ? 1 : 0)
  const totalItems = filteredOptions.length + (showCreateOption ? 1 : 0);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedLastPill(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight if query changes
  useEffect(() => {
    setHighlightedLastPill(false);
    setActiveIndex(0);
  }, [query]);

  const toggleOption = (id: string) => {
    if (selectedMap.has(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
    setQuery('');
    inputRef.current?.focus();
  };

  const handleCreate = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (onCreateOption) {
      onCreateOption(trimmed);
    } else {
      onChange([...selectedIds, trimmed]);
    }
    setQuery('');
    inputRef.current?.focus();
  };

  const removePill = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id));
    setHighlightedLastPill(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (totalItems === 0 ? 0 : (prev + 1) % totalItems));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (totalItems === 0 ? 0 : (prev - 1 + totalItems) % totalItems));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (showCreateOption && activeIndex === filteredOptions.length) {
        handleCreate();
      } else if (filteredOptions[activeIndex]) {
        toggleOption(filteredOptions[activeIndex].id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Backspace') {
      if (query === '' && selectedIds.length > 0) {
        if (!highlightedLastPill) {
          setHighlightedLastPill(true);
        } else {
          // Remove the last pill on second backspace
          const lastId = selectedIds[selectedIds.length - 1];
          removePill(lastId);
        }
      }
    } else {
      if (highlightedLastPill) {
        setHighlightedLastPill(false);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  const activeDescendantId =
    isOpen && totalItems > 0
      ? activeIndex === filteredOptions.length && showCreateOption
        ? 'combobox-create-option'
        : `combobox-opt-${filteredOptions[activeIndex]?.id}`
      : undefined;

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {label && (
        <label className="block text-xs font-medium text-text-secondary mb-1.5 micro-label">
          {label}
        </label>
      )}

      {/* Multi-Select Input Well */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`group relative flex flex-wrap items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-xl border bg-surface-elevated text-text-primary cursor-text transition-all ${
          isOpen
            ? 'border-border-strong shadow-focus-ring'
            : 'border-border-subtle hover:border-border-strong'
        }`}
        style={{
          boxShadow: isOpen
            ? '0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--accent-signal)'
            : 'var(--specular-top)',
        }}
      >
        {/* Animated Tag Pills with popLayout */}
        <AnimatePresence mode="popLayout">
          {selectedOptions.map((opt, i) => {
            const isLastPill = i === selectedOptions.length - 1;
            const isHighlighted = isLastPill && highlightedLastPill;

            return (
              <motion.span
                layout
                key={opt.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={spring}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border select-none transition-colors ${
                  isHighlighted
                    ? 'bg-status-err/20 border-status-err text-status-err'
                    : 'bg-surface text-text-primary border-border-strong'
                }`}
              >
                {opt.icon && <span className="opacity-70">{opt.icon}</span>}
                <span>{opt.label}</span>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePill(opt.id);
                  }}
                  className="p-0.5 rounded hover:bg-surface-active text-text-tertiary hover:text-text-primary transition-colors"
                  aria-label={`Remove ${opt.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            );
          })}
        </AnimatePresence>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedIds.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none py-1"
        />

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="p-1 rounded text-text-tertiary hover:text-text-primary transition-colors text-xs micro-label"
              title="Clear all"
            >
              Clear
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-text-primary' : ''
            }`}
          />
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-text-tertiary mt-1.5 leading-normal">
          {helperText}
        </p>
      )}

      {/* Floating Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={spring}
            className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl border border-border-strong bg-surface text-text-primary shadow-dropdown overflow-hidden"
            style={{
              boxShadow:
                '0 0 0 1px var(--border-subtle), 0 20px 40px -12px rgba(0, 0, 0, 0.75), var(--specular-top)',
            }}
          >
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              className="max-h-60 overflow-y-auto p-1.5 space-y-0.5"
            >
              {filteredOptions.length === 0 && !showCreateOption ? (
                <li className="px-3 py-6 text-center text-xs text-text-tertiary">
                  No options found.
                </li>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected = selectedMap.has(opt.id);
                  const isFocused = index === activeIndex;

                  return (
                    <li
                      key={opt.id}
                      id={`combobox-opt-${opt.id}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleOption(opt.id)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer select-none transition-colors ${
                        isFocused
                          ? 'bg-surface-active text-text-primary'
                          : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-accent text-canvas border-accent'
                              : 'border-border-strong bg-surface-elevated'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        {opt.icon && <span className="text-text-tertiary">{opt.icon}</span>}
                        <span className={isSelected ? 'font-medium text-text-primary' : ''}>
                          {opt.label}
                        </span>
                      </div>
                      {opt.category && (
                        <span className="micro-label text-[10px] text-text-tertiary">
                          {opt.category}
                        </span>
                      )}
                    </li>
                  );
                })
              )}

              {/* Instant "Create 'XYZ'" option at the bottom */}
              {showCreateOption && (
                <li
                  id="combobox-create-option"
                  data-index={filteredOptions.length}
                  role="option"
                  aria-selected={false}
                  onClick={handleCreate}
                  onMouseEnter={() => setActiveIndex(filteredOptions.length)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer border-t border-border-subtle mt-1 text-accent-signal hover:bg-surface-elevated transition-colors ${
                    activeIndex === filteredOptions.length ? 'bg-surface-active font-medium' : ''
                  }`}
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>
                    Create <strong className="text-text-primary">"{query.trim()}"</strong>
                  </span>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
