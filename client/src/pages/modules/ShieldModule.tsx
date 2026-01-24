import React, { useState } from 'react';
import LCARSButton from '@/components/LCARSButton';
import LCARSBar from '@/components/LCARSBar';

export default function ShieldModule() {
  const [shieldStrength, setShieldStrength] = useState(75);
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="space-y-4">
      <div className="text-[#8899FF] text-sm font-mono tracking-wider mb-4">
        SHIELD GENERATOR SYSTEM - ACTIVE
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="p-6 bg-black border-2 border-[#FF2200] rounded">
        <div className="text-[#FF2200] font-bold tracking-wider mb-4 text-lg">
          SHIELD STATUS
        </div>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold text-[#FF9966]">
            {shieldStrength}%
          </div>
          <div className="text-[#8899FF] text-sm mt-2">STRUCTURAL INTEGRITY</div>
        </div>
        <div className="w-full h-4 bg-[#333] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#FF9966] via-[#FF2200] to-[#CC4444] transition-all duration-300"
            style={{ width: `${shieldStrength}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-black border-2 border-[#8899FF] rounded">
          <div className="text-[#8899FF] text-xs font-bold mb-2">FREQUENCY</div>
          <div className="text-2xl font-bold text-[#FF9966]">275.3 MHz</div>
        </div>
        <div className="p-4 bg-black border-2 border-[#8899FF] rounded">
          <div className="text-[#8899FF] text-xs font-bold mb-2">POWER DRAW</div>
          <div className="text-2xl font-bold text-[#FF9966]">42.7%</div>
        </div>
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="flex gap-2">
        <LCARSButton
          color={isActive ? 'mars' : 'bluey'}
          onClick={() => setIsActive(!isActive)}
          className="flex-1"
        >
          {isActive ? 'RAISE' : 'LOWER'}
        </LCARSButton>
        <LCARSButton color="gold" className="flex-1">
          MODULATE
        </LCARSButton>
      </div>

      <div className="p-4 bg-black border-2 border-[#CC99FF] rounded">
        <div className="text-[#CC99FF] font-bold tracking-wider mb-3">
          SHIELD SECTORS
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['FORE', 'AFT', 'PORT', 'STARBOARD', 'VENTRAL', 'DORSAL'].map(
            (sector) => (
              <div
                key={sector}
                className="p-2 bg-black border border-[#8899FF] rounded text-center"
              >
                <div className="text-xs text-[#8899FF]">{sector}</div>
                <div className="text-lg font-bold text-[#FF9966]">
                  {Math.floor(Math.random() * 40 + 60)}%
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="text-center text-xs text-[#8899FF]">
        SHIELD GENERATORS ONLINE | ALL SYSTEMS NOMINAL
      </div>
    </div>
  );
}
