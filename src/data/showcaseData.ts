export const commandPaletteSnippet = `import { CommandPalette } from '@/primitives/CommandPalette';

// Multi-level drill down, deterministic fuzzy match, ARIA combobox
<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  pages={{
    root: {
      id: 'root',
      title: 'Commands',
      items: [
        { id: 'theme', title: 'Switch Theme →', childrenPageId: 'theme' },
        { id: 'toast', title: 'Fire Toast Stack', onSelect: () => toast.success('Action executed') },
      ],
    },
    theme: {
      id: 'theme',
      title: 'Select Theme',
      breadcrumb: 'Themes',
      items: [
        { id: 'dark', title: 'Obsidian Dark', onSelect: () => setTheme('dark') },
        { id: 'light', title: 'Alabaster Light', onSelect: () => setTheme('light') },
      ],
    },
  }}
/>`;

export const dialogSnippet = `import { Dialog, SlideOverDrawer } from '@/primitives/Dialog';

// Dialog with custom useFocusTrap and Viewport Depth Scaling
<Dialog
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  title="Harmonic Physics Parameters"
  description="Tune spring coefficients in real time with hardware acceleration."
  footer={
    <button onClick={() => setIsDialogOpen(false)} className="btn-primary">
      Confirm & Apply
    </button>
  }
>
  <p className="text-sm">Body scroll is safely locked with zero layout shift.</p>
</Dialog>

// Slide-Over Drawer with drag-to-dismiss velocity threshold
<SlideOverDrawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  title="Component Inspector"
>
  <p className="text-sm">Grab the left edge pill handle to fling close.</p>
</SlideOverDrawer>`;

export const toastSnippet = `import { toast, ToastContainer } from '@/primitives/Toast';

// Trigger from anywhere without re-rendering the app (useSyncExternalStore)
toast.success('Configuration deployed', {
  description: 'Version 2.4.0 is now live across edge nodes.',
  duration: 4000,
});

toast.error('Record deleted', {
  description: '3 primitives removed from local cache.',
  onUndo: () => console.log('Restored!'),
  undoLabel: 'Undo',
});

// Mount container once at the root:
<ToastContainer />`;

export const comboboxSnippet = `import { MultiSelectCombobox } from '@/primitives/MultiSelectCombobox';

<MultiSelectCombobox
  label="Framework Ecosystem"
  helperText="Press Backspace with empty query to delete tags. Type to create new options."
  options={[
    { id: 'react', label: 'React 18' },
    { id: 'ts', label: 'TypeScript' },
    { id: 'tailwind', label: 'Tailwind CSS' },
    { id: 'motion', label: 'Framer Motion' },
  ]}
  selectedIds={selected}
  onChange={setSelected}
  onCreateOption={(label) => {
    setSelected([...selected, label]);
  }}
/>`;

export const controlsSnippet = `import { MagneticSegmentedControl, PrecisionSlider } from '@/primitives/Controls';

// Shared layoutId pill with arrow navigation & magnetic hover
<MagneticSegmentedControl
  options={[
    { value: '1x', label: '1.0× Normal' },
    { value: '0.5x', label: '0.5× Slow' },
    { value: '0.25x', label: '0.25× Cinema' },
  ]}
  value={speed}
  onChange={setSpeed}
/>

// Precision accessible slider with tactile feedback & live tooltip
<PrecisionSlider
  label="Spring Stiffness"
  min={150}
  max={700}
  step={10}
  unit="N/m"
  value={stiffness}
  onChange={setStiffness}
/>`;
