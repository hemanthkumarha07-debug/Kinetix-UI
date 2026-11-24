import React, { useRef, useState, useCallback } from 'react';

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  spotlightSize?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  onClick,
  spotlightSize = 400,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cardRef.current.style.setProperty('--mx', `${x}px`);
      cardRef.current.style.setProperty('--my', `${y}px`);
      setOpacity(1);
    },
    []
  );

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative rounded-2xl border border-border-subtle bg-surface text-text-primary overflow-hidden transition-colors ${className}`}
      style={{
        boxShadow: 'var(--specular-top)',
      }}
    >
      {/* Radial Specular Light Catch Perimeter (Strictly subtle white/silver, zero rainbow slop) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at var(--mx, -100px) var(--my, -100px), rgba(255, 255, 255, 0.12), transparent 70%)`,
        }}
      />

      {/* Internal Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
