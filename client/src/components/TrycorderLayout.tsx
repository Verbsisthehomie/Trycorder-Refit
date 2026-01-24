import React, { useState } from 'react';
import LCARSButton from './LCARSButton';
import LCARSPanel from './LCARSPanel';
import LCARSBar from './LCARSBar';

export type TrycorderModule =
  | 'sensors'
  | 'comm'
  | 'shield'
  | 'fire'
  | 'transp'
  | 'tractor'
  | 'motor'
  | 'viewer'
  | 'logs'
  | 'mode';

interface TrycorderLayoutProps {
  currentModule: TrycorderModule;
  onModuleChange: (module: TrycorderModule) => void;
  children: React.ReactNode;
  onSound?: (soundType: string) => void;
}

const modules: { id: TrycorderModule; label: string; color: 'butterscotch' | 'bluey' | 'violet' | 'gold' | 'mars' | 'blue' | 'gray' }[] = [
  { id: 'sensors', label: 'SENSORS', color: 'gold' },
  { id: 'comm', label: 'COMM', color: 'bluey' },
  { id: 'shield', label: 'SHIELD', color: 'mars' },
  { id: 'fire', label: 'FIRE', color: 'mars' },
  { id: 'transp', label: 'TRANSP', color: 'violet' },
  { id: 'tractor', label: 'TRACTOR', color: 'blue' },
  { id: 'motor', label: 'MOTOR', color: 'bluey' },
  { id: 'viewer', label: 'VIEWER', color: 'violet' },
  { id: 'logs', label: 'LOGS', color: 'butterscotch' },
  { id: 'mode', label: 'MODE', color: 'gray' },
];

export const TrycorderLayout: React.FC<TrycorderLayoutProps> = ({
  currentModule,
  onModuleChange,
  children,
  onSound,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleModuleClick = (module: TrycorderModule) => {
    onModuleChange(module);
    if (onSound && soundEnabled) {
      onSound('beep');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white lcars-bg">
      {/* Top Control Bar */}
      <div className="bg-black border-b-2 border-[#8899FF] p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <LCARSButton
            color="gray"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={soundEnabled ? '' : 'opacity-50'}
          >
            Sound
          </LCARSButton>
          <LCARSButton color="bluey" size="sm">
            Start
          </LCARSButton>
          <LCARSButton color="mars" size="sm">
            Stop
          </LCARSButton>
          <LCARSButton color="violet" size="sm">
            Setup
          </LCARSButton>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#FF9966] tracking-wider">
            TRYCORDER
          </h1>
          <p className="text-xs text-[#8899FF] tracking-widest">LCARS SYSTEM</p>
        </div>

        <div className="w-20" />
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="flex">
        {/* Left Sidebar - Module Selection */}
        <div className="w-32 bg-black border-r-2 border-[#8899FF] p-2 space-y-2">
          {modules.map((module) => (
            <LCARSButton
              key={module.id}
              color={module.color}
              size="sm"
              onClick={() => handleModuleClick(module.id)}
              className={`w-full ${
                currentModule === module.id ? 'ring-2 ring-[#FFAA00]' : ''
              }`}
            >
              {module.label}
            </LCARSButton>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <LCARSPanel title={`ACTIVE MODULE: ${currentModule.toUpperCase()}`}>
            {children}
          </LCARSPanel>
        </div>
      </div>

      <LCARSBar orientation="horizontal" />

      {/* Bottom Status Bar */}
      <div className="bg-black border-t-2 border-[#8899FF] p-4 flex justify-center gap-4">
        <LCARSButton color="gray" size="sm">
          Snap
        </LCARSButton>
        <LCARSButton color="bluey" size="sm">
          Photo
        </LCARSButton>
        <LCARSButton color="mars" size="sm">
          Record
        </LCARSButton>
        <LCARSButton color="violet" size="sm">
          Gallery
        </LCARSButton>
      </div>

      {/* Status Display */}
      <div className="bg-black border-t-2 border-[#FF9966] p-2 text-center text-xs text-[#FF9966]">
        <span className="blink">SYSTEM ONLINE</span> | STARDATE 78234.5 | SECTOR
        001G
      </div>
    </div>
  );
};

export default TrycorderLayout;
