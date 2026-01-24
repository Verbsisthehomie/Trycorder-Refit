import React from 'react';

interface LCARSPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCorners?: boolean;
}

export const LCARSPanel: React.FC<LCARSPanelProps> = ({
  title,
  children,
  className = '',
  showCorners = true,
}) => {
  return (
    <div className={`lcars-panel ${className}`}>
      {showCorners && (
        <>
          <div className="lcars-corner-tl" />
          <div className="lcars-corner-tr" />
          <div className="lcars-corner-bl" />
          <div className="lcars-corner-br" />
        </>
      )}

      {title && <div className="lcars-panel-title">{title}</div>}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LCARSPanel;
