import { useState } from 'react';
import {
  Command,
  Layout,
  Bell,
  CheckSquare,
  Sliders,
  Sun,
  Moon,
  Layers,
  Shield,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MotionConfigProvider, useMotionConfig } from './context/MotionConfigContext';
import { ModalProvider } from './context/ModalContext';

import { AppShell } from './components/AppShell';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ComponentStage } from './components/ComponentStage';
import { PhysicsInspectorDock } from './components/PhysicsInspectorDock';
import { A11yMonitor } from './components/A11yMonitor';

import { CommandPalette } from './primitives/CommandPalette/CommandPalette';
import type { CommandPage } from './primitives/CommandPalette/types';
import { Dialog } from './primitives/Dialog/Dialog';
import { SlideOverDrawer } from './primitives/Dialog/SlideOverDrawer';
import { ToastContainer } from './primitives/Toast/ToastContainer';
import { toast } from './primitives/Toast/toast';
import { MultiSelectCombobox, type ComboboxOption } from './primitives/MultiSelectCombobox/MultiSelectCombobox';
import { MagneticSegmentedControl } from './primitives/Controls/MagneticSegmentedControl';
import { PrecisionSlider } from './primitives/Controls/PrecisionSlider';
import { ThemeToggle } from './primitives/ViewTransitionThemeToggle/ThemeToggle';

import {
  commandPaletteSnippet,
  dialogSnippet,
  toastSnippet,
  comboboxSnippet,
  controlsSnippet,
} from './data/showcaseData';

const initialComboboxOptions: ComboboxOption[] = [
  { id: 'react', label: 'React 18', category: 'Library' },
  { id: 'typescript', label: 'TypeScript', category: 'Language' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'Styling' },
  { id: 'framer', label: 'Framer Motion', category: 'Animation' },
  { id: 'vite', label: 'Vite', category: 'Bundler' },
  { id: 'lucide', label: 'Lucide Icons', category: 'Assets' },
  { id: 'aria', label: 'WAI-ARIA', category: 'Standards' },
];

function Playground() {
  const { setTheme } = useTheme();
  const { timeScale, setTimeScale, stiffness, setStiffness, damping, setDamping } = useMotionConfig();

  // Dialog & Drawer state
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isA11yHudOpen, setIsA11yHudOpen] = useState(true);

  // Combobox demo state
  const [comboboxOptions, setComboboxOptions] = useState(initialComboboxOptions);
  const [selectedComboboxIds, setSelectedComboboxIds] = useState<string[]>([
    'react',
    'typescript',
    'framer',
  ]);

  // Controls demo state
  const [segmentedValue, setSegmentedValue] = useState<'tokens' | 'physics' | 'a11y'>('physics');
  const [sliderFrequency, setSliderFrequency] = useState(60);
  const [sliderThreshold, setSliderThreshold] = useState(0.85);

  const commandPages: Record<string, CommandPage> = {
    root: {
      id: 'root',
      title: 'Global Commands',
      placeholder: 'Type a command, component, or action...',
      items: [
        {
          id: 'jump-cmd',
          title: 'Jump to Command Palette',
          description: 'Fuzzy search, nested drill-down page stack & keyboard navigation',
          icon: <Command className="w-4 h-4" />,
          shortcut: ['⌘', '1'],
          onSelect: () => document.getElementById('command-palette')?.scrollIntoView({ behavior: 'smooth' }),
        },
        {
          id: 'jump-dialog',
          title: 'Jump to Dialog & Slide-Over Drawer',
          description: 'Viewport depth scale, custom focus trap & drag-to-dismiss',
          icon: <Layout className="w-4 h-4" />,
          shortcut: ['⌘', '2'],
          onSelect: () => document.getElementById('dialog-drawer')?.scrollIntoView({ behavior: 'smooth' }),
        },
        {
          id: 'jump-toast',
          title: 'Jump to Toast Engine',
          description: 'Stacked physics geometry, hover fan-out & sync external store',
          icon: <Bell className="w-4 h-4" />,
          shortcut: ['⌘', '3'],
          onSelect: () => document.getElementById('toast-stack')?.scrollIntoView({ behavior: 'smooth' }),
        },
        {
          id: 'jump-combobox',
          title: 'Jump to Multi-Select Combobox',
          description: 'PopLayout animated pills, double-backspace removal & item creation',
          icon: <CheckSquare className="w-4 h-4" />,
          shortcut: ['⌘', '4'],
          onSelect: () => document.getElementById('combobox')?.scrollIntoView({ behavior: 'smooth' }),
        },
        {
          id: 'theme-page',
          title: 'Switch Color Theme →',
          description: 'Obsidian Dark / Architectural Alabaster via View Transitions',
          icon: <Sun className="w-4 h-4" />,
          childrenPageId: 'theme',
        },
        {
          id: 'speed-page',
          title: 'Adjust Motion Speed →',
          description: 'Inspect spring trajectories at 1.0×, 0.5×, or 0.25× Slow-Mo',
          icon: <Sliders className="w-4 h-4" />,
          childrenPageId: 'speed',
        },
        {
          id: 'open-dialog',
          title: 'Open Physics Dialog Modal',
          description: 'Triggers background page recess and locks body scroll',
          icon: <Layout className="w-4 h-4" />,
          onSelect: () => setIsDialogOpen(true),
        },
        {
          id: 'open-drawer',
          title: 'Open Slide-Over Drawer',
          description: 'Side panel with velocity-threshold swipe-to-dismiss',
          icon: <Layout className="w-4 h-4" />,
          onSelect: () => setIsDrawerOpen(true),
        },
        {
          id: 'fire-toast-success',
          title: 'Fire Success Toast',
          description: 'Pushes a high-priority notification to the physics stack',
          icon: <Bell className="w-4 h-4" />,
          onSelect: () => {
            toast.success('Architecture Deployed', {
              description: 'Zero headless libraries detected. Pure craft verified.',
            });
          },
        },
        {
          id: 'burst-toasts',
          title: 'Burst 3 Stacked Toasts',
          description: 'Triggers a cascade to inspect stack depth and fan-out',
          icon: <Bell className="w-4 h-4" />,
          onSelect: () => {
            toast.show('Initial handshake established', { description: 'Connected to local runtime' });
            setTimeout(() => {
              toast.warning('Memory allocation threshold', { description: 'Physics cache reached 82%' });
            }, 150);
            setTimeout(() => {
              toast.success('State synced successfully', { description: 'All subscribers notified' });
            }, 300);
          },
        },
        {
          id: 'toggle-hud',
          title: 'Toggle A11y Focus HUD',
          description: 'Live telemetry displaying active element, role, and keypresses',
          icon: <Shield className="w-4 h-4" />,
          onSelect: () => setIsA11yHudOpen((prev) => !prev),
        },
      ],
    },
    theme: {
      id: 'theme',
      title: 'Select Theme',
      breadcrumb: 'Themes',
      placeholder: 'Choose color scheme...',
      items: [
        {
          id: 'theme-dark',
          title: 'Obsidian Dark (Default)',
          description: '#08080A root canvas with specular metallic catches',
          icon: <Moon className="w-4 h-4 text-accent-signal" />,
          onSelect: () => setTheme('dark'),
        },
        {
          id: 'theme-light',
          title: 'Architectural Alabaster',
          description: '#FAFAFB crisp background with high-contrast obsidian ink',
          icon: <Sun className="w-4 h-4 text-amber-500" />,
          onSelect: () => setTheme('light'),
        },
      ],
    },
    speed: {
      id: 'speed',
      title: 'Select Playback Speed',
      breadcrumb: 'Physics',
      placeholder: 'Choose spring playback speed...',
      items: [
        {
          id: 'speed-1',
          title: '1.0× Normal Speed',
          description: 'Natural high-response harmonic oscillator',
          onSelect: () => setTimeScale(1),
        },
        {
          id: 'speed-05',
          title: '0.5× Half Speed',
          description: 'Smooth precision debugging',
          onSelect: () => setTimeScale(0.5),
        },
        {
          id: 'speed-025',
          title: '0.25× Cinematic Slow-Mo',
          description: 'Observe exact spring trajectories and frame pacing',
          onSelect: () => setTimeScale(0.25),
        },
      ],
    },
  };

  const handleCreateComboboxOption = (label: string) => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    const newOpt: ComboboxOption = { id, label, category: 'Custom' };
    setComboboxOptions((prev) => [...prev, newOpt]);
    setSelectedComboboxIds((prev) => [...prev, id]);
    toast.success(`Created "${label}"`, {
      description: 'Custom tag added to options and selected.',
    });
  };

  const handleBurstToasts = () => {
    toast.show('Workspace Initialized', { description: 'React 18 + TypeScript environment active' });
    setTimeout(() => {
      toast.warning('High Precision Mode', {
        description: 'Spring stiffness set to 460 N/m with 34 Ns/m damping',
      });
    }, 120);
    setTimeout(() => {
      toast.error('Simulated Failure', {
        description: 'Click undo to restore previous parameters',
        onUndo: () => {
          toast.success('Restored previous state successfully');
        },
        undoLabel: 'Revert',
      });
    }, 240);
  };

  return (
    <div className="relative min-h-screen bg-canvas text-text-primary">
      {/* Background Page Shell with Viewport Scale */}
      <AppShell>
        {/* Sticky Blurred Header */}
        <Header
          onOpenCmdK={() => setIsCmdKOpen(true)}
          isA11yHudOpen={isA11yHudOpen}
          onToggleA11yHud={() => setIsA11yHudOpen((prev) => !prev)}
        />

        {/* Hero Section */}
        <HeroSection
          onOpenCmdK={() => setIsCmdKOpen(true)}
          onScrollToPhysics={() => {
            const el = document.getElementById('controls');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Component Stages Grid */}
        <main id="primitives" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
          {/* Section 1: Command Palette */}
          <ComponentStage
            id="command-palette"
            title="CommandPalette"
            badge="Keyboard First"
            description="Fuzzy-searched, multi-level drill-down command hub with live count badges, physical keycaps footer, and complete ARIA combobox wiring."
            codeSnippet={commandPaletteSnippet}
            a11ySpecs={{
              roles: ['dialog', 'combobox', 'listbox', 'option'],
              keys: [
                { key: '⌘K / Ctrl+K', behavior: 'Toggles command palette dialog open/closed from any screen context' },
                { key: '↑ / ↓', behavior: 'Navigates options with wrapping and scrolls active option smoothly into view' },
                { key: '↵ Enter', behavior: 'Executes command or slides into nested sub-page' },
                { key: '⌫ Backspace', behavior: 'On empty search input, pops back to the parent page' },
                { key: 'ESC', behavior: 'Pops nested sub-page or closes the palette entirely' },
              ],
              notes: [
                'Uses aria-activedescendant to track selection without moving virtual focus from the input element.',
                'Fuzzy matcher provides deterministic character-by-character indices for bold highlighted text rendering.',
              ],
            }}
            preview={
              <div className="flex flex-col items-center gap-4 py-8">
                <button
                  type="button"
                  onClick={() => setIsCmdKOpen(true)}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-xl border border-border-strong bg-surface hover:bg-surface-elevated text-text-primary text-sm font-medium shadow-elevation-dark transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ boxShadow: 'var(--specular-top)' }}
                >
                  <Command className="w-4 h-4 text-accent-signal" />
                  <span>Launch Live Command Palette</span>
                  <kbd className="micro-label px-2 py-0.5 rounded border border-border-subtle bg-surface-elevated text-xs text-text-tertiary">
                    ⌘K
                  </kbd>
                </button>
                <p className="text-xs text-text-tertiary">
                  Try typing <code className="text-text-primary">theme</code> or <code className="text-text-primary">speed</code> to test sub-page slide transitions!
                </p>
              </div>
            }
          />

          {/* Section 2: Dialog & SlideOverDrawer */}
          <ComponentStage
            id="dialog-drawer"
            title="Dialog & SlideOverDrawer"
            badge="Viewport Depth Scaling"
            description="Physical overlay modals featuring strict focus trapping, scrollbar-compensated scroll lock, left-edge drag pills, and background viewport depth scaling."
            codeSnippet={dialogSnippet}
            a11ySpecs={{
              roles: ['dialog', 'button'],
              keys: [
                { key: 'Tab', behavior: 'Traps focus deterministically; wraps from last element to first element' },
                { key: 'Shift + Tab', behavior: 'Traps focus deterministically; wraps from first element to last element' },
                { key: 'ESC', behavior: 'Closes dialog/drawer and returns focus to triggering element' },
              ],
              notes: [
                'Body scroll lock calculates window.innerWidth - clientWidth to pad body right by exact scrollbar width, eliminating 100% of layout shift.',
                'The main AppShell reacts to active modals by scaling down to 0.982 with 14px border radius and 0.75 brightness.',
              ],
            }}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-4 py-8">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border-strong hover:bg-surface-elevated text-text-primary text-sm font-medium transition-all active:scale-95"
                  style={{ boxShadow: 'var(--specular-top)' }}
                >
                  <Layout className="w-4 h-4 text-accent-signal" />
                  <span>Open Modal Dialog</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border-strong hover:bg-surface-elevated text-text-primary text-sm font-medium transition-all active:scale-95"
                  style={{ boxShadow: 'var(--specular-top)' }}
                >
                  <Layout className="w-4 h-4 text-status-ok" />
                  <span>Open Slide-Over Drawer</span>
                </button>
              </div>
            }
          />

          {/* Section 3: Toast Engine */}
          <ComponentStage
            id="toast-stack"
            title="Toast Notification Engine"
            badge="Stacked Geometry"
            description="Zero-re-render pub/sub notifications via useSyncExternalStore. Displays up to 3 stacked toasts with depth scaling, hover fan-out, hairline timer progress bars, and swipe-to-dismiss."
            codeSnippet={toastSnippet}
            a11ySpecs={{
              roles: ['status', 'alert', 'button'],
              keys: [
                { key: 'Swipe / Drag Right', behavior: 'Fling dismissal triggered when dragged past 80px or velocity > 400px/s' },
                { key: 'Hover Stack', behavior: 'Smoothly fans out stack vertically with 10px gaps and freezes progress countdown' },
              ],
              notes: [
                'Consumed through useSyncExternalStore; triggering toasts causes 0 re-renders in the parent application tree.',
                'Supports interactive undo callbacks directly on individual toast cards.',
              ],
            }}
            preview={
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success('Production Build Ready', {
                        description: 'TypeScript bundle compiled with zero errors.',
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-status-ok/30 text-text-primary text-xs font-medium hover:bg-surface-elevated transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-status-ok" />
                    <span>Fire Success Toast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast.error('Network Request Dropped', {
                        description: 'Failed to synchronize physics telemetry.',
                        onUndo: () => toast.success('Telemetry reconnected'),
                        undoLabel: 'Retry',
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-status-err/30 text-text-primary text-xs font-medium hover:bg-surface-elevated transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-status-err" />
                    <span>Fire Error with Undo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBurstToasts}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-canvas text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Burst 3 Toasts (Test Fan-Out)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.clear()}
                    className="p-2 rounded-xl border border-border-subtle bg-surface text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    title="Clear all toasts"
                    aria-label="Clear all toasts"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-text-tertiary">
                  Hover over the bottom-right stack to inspect the vertical fan-out and frozen countdown bars!
                </p>
              </div>
            }
          />

          {/* Section 4: MultiSelectCombobox */}
          <ComponentStage
            id="combobox"
            title="MultiSelectCombobox"
            badge="PopLayout Physics"
            description="Searchable multi-select dropdown featuring Framer Motion popLayout tag pills, double-backspace deletion UX, instant option creation, and ARIA combobox semantics."
            codeSnippet={comboboxSnippet}
            a11ySpecs={{
              roles: ['combobox', 'listbox', 'option'],
              keys: [
                { key: '↑ / ↓', behavior: 'Navigates filtered options with wrap-around' },
                { key: '↵ Enter', behavior: 'Toggles option selection or creates new option if unmatched' },
                { key: '⌫ Backspace', behavior: 'When query is empty, 1st press highlights last pill; 2nd press deletes it' },
                { key: 'ESC', behavior: 'Closes dropdown menu' },
              ],
              notes: [
                'Tags animate via Framer Motion AnimatePresence mode="popLayout", gliding naturally into place when tags are removed.',
              ],
            }}
            preview={
              <div className="w-full max-w-md py-6">
                <MultiSelectCombobox
                  label="Architectural Primitives"
                  helperText="Press Backspace with empty query to delete tags. Type a new name to create."
                  options={comboboxOptions}
                  selectedIds={selectedComboboxIds}
                  onChange={setSelectedComboboxIds}
                  onCreateOption={handleCreateComboboxOption}
                />
              </div>
            }
          />

          {/* Section 5: Magnetic Controls */}
          <ComponentStage
            id="controls"
            title="Magnetic Controls & Precision Sliders"
            badge="Harmonic Feedback"
            description="Shared-element layoutId segmented controls paired with precision sliders featuring tick marks, tactile thumb compression, and floating monospace tooltips."
            codeSnippet={controlsSnippet}
            a11ySpecs={{
              roles: ['tablist', 'tab', 'slider'],
              keys: [
                { key: '← / → or ↑ / ↓', behavior: 'Adjusts active tab or increments/decrements slider value' },
                { key: 'PageUp / PageDown', behavior: 'Steps slider by 10× step factor' },
                { key: 'Home / End', behavior: 'Jumps slider directly to min or max limit' },
              ],
              notes: [
                'Segmented control uses Framer Motion layoutId with spring physics for seamless pill sliding.',
                'Slider thumb provides micro-scale active depression feedback (scale: 0.90) and floating tabular tooltip.',
              ],
            }}
            preview={
              <div className="w-full max-w-lg space-y-8 py-6">
                {/* Segmented Control Demo */}
                <div className="space-y-2">
                  <div className="text-xs micro-label text-text-secondary">
                    View Configuration (layoutId Pill)
                  </div>
                  <MagneticSegmentedControl<'tokens' | 'physics' | 'a11y'>
                    options={[
                      { value: 'tokens', label: 'Design Tokens', icon: <Layers className="w-3.5 h-3.5" /> },
                      { value: 'physics', label: 'Spring Physics', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
                      { value: 'a11y', label: 'Accessibility', icon: <Shield className="w-3.5 h-3.5" /> },
                    ]}
                    value={segmentedValue}
                    onChange={setSegmentedValue}
                  />
                </div>

                {/* Precision Sliders Demo */}
                <div className="space-y-6">
                  <PrecisionSlider
                    label="Refresh Frequency"
                    value={sliderFrequency}
                    min={20}
                    max={144}
                    step={1}
                    onChange={setSliderFrequency}
                    unit="Hz"
                    ticks={[30, 60, 90, 120, 144]}
                  />

                  <PrecisionSlider
                    label="Velocity Damping Factor"
                    value={sliderThreshold}
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    onChange={setSliderThreshold}
                    formatValue={(val) => `${(val * 100).toFixed(0)}%`}
                    ticks={[0.25, 0.5, 0.75, 1.0]}
                  />
                </div>
              </div>
            }
          />
        </main>

        {/* Footer */}
        <footer className="border-t border-border-subtle bg-surface/50 py-12 px-4 sm:px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary">KinetixUI</span>
              <span>— Crafted with zero external headless dependencies.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="tabular font-mono text-[11px]">
                Motion: k={stiffness} c={damping} ({timeScale}×)
              </span>
              <span className="text-border-strong">·</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-text-primary transition-colors"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </footer>
      </AppShell>

      {/* Global Modals & Portals */}
      <CommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        pages={commandPages}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Harmonic Physics Parameters"
        description="Fine-tune spring response curves. Changes apply live to all active overlays and components."
        footer={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded-xl border border-border-strong bg-surface hover:bg-surface-elevated text-text-primary text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDialogOpen(false);
                toast.success('Physics coefficients updated');
              }}
              className="px-4 py-2 rounded-xl bg-accent text-canvas text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Save & Apply
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <PrecisionSlider
            label="Modal Spring Stiffness"
            value={stiffness}
            min={150}
            max={700}
            step={10}
            onChange={setStiffness}
            unit="N/m"
          />
          <PrecisionSlider
            label="Modal Spring Damping"
            value={damping}
            min={12}
            max={60}
            step={1}
            onChange={setDamping}
            unit="Ns/m"
          />
          <p className="text-xs text-text-tertiary">
            Notice how the entire background page scaled down to 0.982 and dimmed smoothly when this dialog opened!
          </p>
        </div>
      </Dialog>

      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="System Inspector"
        description="Slide-over panel equipped with velocity threshold drag-to-dismiss."
        footer={
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-full py-2 rounded-xl bg-accent text-canvas text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Close Drawer
          </button>
        }
      >
        <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
          <div className="p-3.5 rounded-xl border border-border-subtle bg-surface-elevated space-y-2">
            <div className="font-semibold text-text-primary">Drag-to-Dismiss Instructions</div>
            <p>
              Grab the subtle pill handle on the left edge or drag anywhere on the drawer to the right. Flinging with velocity over 400px/s will cleanly dismiss the panel.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-text-primary">Theme & View Transitions</div>
            <p>
              Clicking the theme toggle triggers a circular clip-path expansion calculated from the exact hypotenuse radius of your click coordinates.
            </p>
            <div className="pt-2">
              <ThemeToggle showLabel />
            </div>
          </div>
        </div>
      </SlideOverDrawer>

      {/* Floating Notifications Container */}
      <ToastContainer />

      {/* Floating Physics Inspector Dock */}
      <PhysicsInspectorDock />

      {/* Toggleable Live A11y HUD */}
      <A11yMonitor
        isVisible={isA11yHudOpen}
        onClose={() => setIsA11yHudOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MotionConfigProvider>
        <ModalProvider>
          <Playground />
        </ModalProvider>
      </MotionConfigProvider>
    </ThemeProvider>
  );
}

export default App;
