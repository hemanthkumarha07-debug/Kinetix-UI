import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Transition } from 'framer-motion';

export type TimeScale = 1 | 0.5 | 0.25;

export interface MotionConfigState {
  stiffness: number;
  damping: number;
  mass: number;
  timeScale: TimeScale;
  reducedMotion: boolean;
  setStiffness: (stiffness: number) => void;
  setDamping: (damping: number) => void;
  setMass: (mass: number) => void;
  setTimeScale: (timeScale: TimeScale) => void;
  setReducedMotion: (reduced: boolean) => void;
  resetMotion: () => void;
}

const DEFAULT_STIFFNESS = 460;
const DEFAULT_DAMPING = 34;
const DEFAULT_MASS = 0.8;
const DEFAULT_TIMESCALE: TimeScale = 1;

const MotionConfigContext = createContext<MotionConfigState | null>(null);

export const MotionConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stiffness, setStiffness] = useState<number>(DEFAULT_STIFFNESS);
  const [damping, setDamping] = useState<number>(DEFAULT_DAMPING);
  const [mass, setMass] = useState<number>(DEFAULT_MASS);
  const [timeScale, setTimeScale] = useState<TimeScale>(DEFAULT_TIMESCALE);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const resetMotion = () => {
    setStiffness(DEFAULT_STIFFNESS);
    setDamping(DEFAULT_DAMPING);
    setMass(DEFAULT_MASS);
    setTimeScale(DEFAULT_TIMESCALE);
  };

  const value = useMemo(
    () => ({
      stiffness,
      damping,
      mass,
      timeScale,
      reducedMotion,
      setStiffness,
      setDamping,
      setMass,
      setTimeScale,
      setReducedMotion,
      resetMotion,
    }),
    [stiffness, damping, mass, timeScale, reducedMotion]
  );

  return (
    <MotionConfigContext.Provider value={value}>
      {children}
    </MotionConfigContext.Provider>
  );
};

export const useMotionConfig = (): MotionConfigState => {
  const context = useContext(MotionConfigContext);
  if (!context) {
    throw new Error('useMotionConfig must be used within a MotionConfigProvider');
  }
  return context;
};

/**
 * Mathematically scales spring physics or durations for slow-motion observation.
 * When timeScale is 0.25 (4x slow motion), stiffness scales by timeScale^2
 * and damping scales by timeScale so the trajectory remains identical.
 */
export const useSpringTransition = (overrides?: Partial<Transition>): Transition => {
  const { stiffness, damping, mass, timeScale, reducedMotion } = useMotionConfig();

  return useMemo(() => {
    if (reducedMotion) {
      return {
        type: 'tween',
        duration: 0.05,
        ...overrides,
      };
    }

    // Exact physical slow-motion formula:
    // Natural angular frequency omega_0 = sqrt(k / m) -> omega' = alpha * omega_0 => k' = alpha^2 * k
    // Damping ratio zeta = c / (2 * sqrt(k*m)) -> unchanged => c' = alpha * c
    const effectiveStiffness = stiffness * (timeScale * timeScale);
    const effectiveDamping = damping * timeScale;
    const effectiveMass = mass;

    return {
      type: 'spring',
      stiffness: effectiveStiffness,
      damping: effectiveDamping,
      mass: effectiveMass,
      restDelta: 0.0005,
      ...overrides,
    };
  }, [stiffness, damping, mass, timeScale, reducedMotion, overrides]);
};
