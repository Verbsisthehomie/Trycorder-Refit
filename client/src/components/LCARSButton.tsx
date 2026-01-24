import React from 'react';

export type LCARSButtonColor = 'butterscotch' | 'bluey' | 'violet' | 'gold' | 'mars' | 'blue' | 'gray';

interface LCARSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: LCARSButtonColor;
  size?: 'sm' | 'md' | 'lg';
  blink?: 'none' | 'slow' | 'fast';
  children: React.ReactNode;
}

const colorClasses: Record<LCARSButtonColor, string> = {
  butterscotch: 'lcars-button-butterscotch',
  bluey: 'lcars-button-bluey',
  violet: 'lcars-button-violet',
  gold: 'lcars-button-gold',
  mars: 'lcars-button-mars',
  blue: 'lcars-button-blue',
  gray: 'lcars-button-gray',
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const blinkClasses: Record<'none' | 'slow' | 'fast', string> = {
  none: '',
  slow: 'blink-slow',
  fast: 'blink-fast',
};

export const LCARSButton: React.FC<LCARSButtonProps> = ({
  color = 'butterscotch',
  size = 'md',
  blink = 'none',
  className = '',
  ...props
}) => {
  const baseClass = colorClasses[color];
  const sizeClass = sizeClasses[size];
  const blinkClass = blinkClasses[blink];

  return (
    <button
      className={`${baseClass} ${sizeClass} ${blinkClass} ${className}`}
      {...props}
    />
  );
};

export default LCARSButton;
