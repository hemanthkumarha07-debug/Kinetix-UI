import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Eye, Code, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { MagneticSegmentedControl } from '../primitives/Controls/MagneticSegmentedControl';
import { useSpringTransition } from '../context/MotionConfigContext';

export interface A11yFeature {
  attributeOrKey: string;
  description: string;
}

export interface ComponentStageProps {
  id: string;
  title: string;
  badge?: string;
  description: string;
  preview: React.ReactNode;
  codeSnippet: string;
  a11ySpecs: {
    roles: string[];
    keys: { key: string; behavior: string }[];
    notes?: string[];
  };
}

export const ComponentStage: React.FC<ComponentStageProps> = ({
  id,
  title,
  badge,
  description,
  preview,
  codeSnippet,
  a11ySpecs,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'a11y'>('preview');
  const [copied, setCopied] = useState(false);
  const spring = useSpringTransition();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { value: 'preview' as const, label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
    { value: 'code' as const, label: 'TSX Code', icon: <Code className="w-3.5 h-3.5" /> },
    { value: 'a11y' as const, label: 'A11y Spec', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id={id} className="scroll-mt-24">
      <SpotlightCard className="flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:px-6 border-b border-border-subtle bg-surface">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className="micro-label px-2 py-0.5 rounded-full border border-border-strong bg-surface-elevated text-text-secondary">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <MagneticSegmentedControl<'preview' | 'code' | 'a11y'>
              options={tabs}
              value={activeTab}
              onChange={setActiveTab}
              size="sm"
              ariaLabel={`${title} view tabs`}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 min-h-[300px] flex flex-col justify-center bg-canvas/40">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={spring}
                className="w-full flex items-center justify-center"
              >
                {preview}
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={spring}
                className="relative w-full rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden font-mono text-xs"
              >
                {/* Copy Button */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-surface text-text-tertiary">
                  <span className="micro-label text-[10px]">TypeScript JSX</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-elevated hover:bg-surface-active text-text-secondary hover:text-text-primary border border-border-strong transition-colors"
                    aria-label="Copy code snippet"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-status-ok" />
                        <span className="text-[10px] text-status-ok font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 overflow-x-auto text-text-primary leading-relaxed">
                  <code>{codeSnippet}</code>
                </pre>
              </motion.div>
            )}

            {activeTab === 'a11y' && (
              <motion.div
                key="a11y"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={spring}
                className="w-full space-y-4 text-xs"
              >
                {/* Roles */}
                <div className="p-4 rounded-xl border border-border-subtle bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-status-ok" />
                    <h4 className="font-semibold text-text-primary micro-label">
                      WAI-ARIA Roles & Semantics
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a11ySpecs.roles.map((role) => (
                      <span
                        key={role}
                        className="font-mono text-xs px-2 py-1 rounded border border-border-strong bg-surface-elevated text-accent-signal font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keyboard Navigation Matrix */}
                <div className="p-4 rounded-xl border border-border-subtle bg-surface overflow-x-auto">
                  <h4 className="font-semibold text-text-primary micro-label mb-3">
                    Keyboard Interaction Matrix
                  </h4>
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b border-border-subtle text-text-tertiary text-[11px]">
                        <th className="pb-2 font-medium">Key / Shortcut</th>
                        <th className="pb-2 font-medium">Engineered Behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/40">
                      {a11ySpecs.keys.map(({ key, behavior }) => (
                        <tr key={key} className="text-text-secondary">
                          <td className="py-2 pr-4 font-semibold text-text-primary">
                            <kbd className="px-1.5 py-0.5 rounded border border-border-strong bg-surface-elevated micro-label">
                              {key}
                            </kbd>
                          </td>
                          <td className="py-2 text-[11px] font-sans leading-normal">
                            {behavior}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notes */}
                {a11ySpecs.notes && a11ySpecs.notes.length > 0 && (
                  <div className="p-3 rounded-lg border border-border-subtle bg-surface-elevated/40 text-text-secondary text-[11px] leading-relaxed">
                    <ul className="list-disc list-inside space-y-1">
                      {a11ySpecs.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SpotlightCard>
    </section>
  );
};
