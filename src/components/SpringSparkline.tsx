import React, { useMemo } from 'react';

interface SpringSparklineProps {
  stiffness: number;
  damping: number;
  mass?: number;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Real-time harmonic oscillator spring trajectory sparkline.
 * Plots step response x(t) from t=0 to settling time.
 */
export const SpringSparkline: React.FC<SpringSparklineProps> = ({
  stiffness,
  damping,
  mass = 0.8,
  width = 120,
  height = 36,
  className = '',
}) => {
  const pathD = useMemo(() => {
    const points: [number, number][] = [];
    const numPoints = 50;
    const duration = 1.2; // simulated seconds

    const k = stiffness;
    const c = damping;
    const m = mass;

    const w0 = Math.sqrt(k / m);
    const zeta = c / (2 * Math.sqrt(k * m));

    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * duration;
      let pos = 1;

      if (zeta < 1) {
        // Underdamped
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        const envelope = Math.exp(-zeta * w0 * t);
        pos = 1 - envelope * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
      } else if (Math.abs(zeta - 1) < 0.001) {
        // Critically damped
        pos = 1 - Math.exp(-w0 * t) * (1 + w0 * t);
      } else {
        // Overdamped
        const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
        const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
        pos = 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
      }

      const x = (i / numPoints) * width;
      // Invert Y so target value 1 is near top with padding
      const y = height - (pos * (height * 0.65) + height * 0.15);
      points.push([x, Math.max(2, Math.min(height - 2, y))]);
    }

    return points.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [stiffness, damping, mass, width, height]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Target 1.0 Baseline */}
        <line
          x1={0}
          y1={height - (1 * (height * 0.65) + height * 0.15)}
          x2={width}
          y2={height - (1 * (height * 0.65) + height * 0.15)}
          stroke="var(--border-strong)"
          strokeDasharray="2 2"
          strokeWidth={1}
        />
        {/* Dynamic Spring Trajectory */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-signal)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
