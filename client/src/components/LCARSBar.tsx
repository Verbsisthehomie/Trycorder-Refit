import React from 'react';

interface LCARSBarProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const LCARSBar: React.FC<LCARSBarProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  const baseClass =
    orientation === 'horizontal' ? 'lcars-bar' : 'lcars-bar-vertical';

  return <div className={`${baseClass} ${className}`} />;
};

export default LCARSBar;
