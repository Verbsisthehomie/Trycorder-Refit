import React, { useState } from 'react';
import LCARSButton from '@/components/LCARSButton';
import LCARSBar from '@/components/LCARSBar';

export default function FireModule() {
  const [phaserCharge, setPhaserCharge] = useState(85);
  const [torpedoCount, setTorpedoCount] = useState(12);
  const [targetLocked, setTargetLocked] = useState(false);

  const handleFire = () => {
    if (phaserCharge > 20) {
      setPhaserCharge((prev) => Math.max(0, prev - 25));
      setTargetLocked(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-[#8899FF] text-sm font-mono tracking-wider mb-4">
        WEAPONS SYSTEMS - ARMED
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-black border-2 border-[#FF2200] rounded">
          <div className="text-[#FF2200] font-bold tracking-wider mb-3">
            PHASER ARRAY
          </div>
          <div className="text-3xl font-bold text-[#FF9966] mb-2">
            {phaserCharge}%
          </div>
          <div className="w-full h-3 bg-[#333] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF9966] to-[#FF2200] transition-all"
              style={{ width: `${phaserCharge}%` }}
            />
          </div>
          <div className="text-xs text-[#8899FF] mt-2">CHARGE STATUS</div>
        </div>

        <div className="p-4 bg-black border-2 border-[#FF2200] rounded">
          <div className="text-[#FF2200] font-bold tracking-wider mb-3">
            PHOTON TORPEDOES
          </div>
          <div className="text-3xl font-bold text-[#FF9966] mb-2">
            {torpedoCount}
          </div>
          <div className="text-xs text-[#8899FF]">READY TO FIRE</div>
        </div>
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="p-4 bg-black border-2 border-[#CC99FF] rounded">
        <div className="text-[#CC99FF] font-bold tracking-wider mb-3">
          TARGET ACQUISITION
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`w-4 h-4 rounded-full ${
              targetLocked ? 'bg-[#FF2200] blink-fast' : 'bg-[#666688]'
            }`}
          />
          <span className="text-[#8899FF]">
            {targetLocked ? 'TARGET LOCKED' : 'NO TARGET'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <LCARSButton
          color="mars"
          onClick={handleFire}
          disabled={phaserCharge < 20}
          className="flex-1"
        >
          FIRE PHASERS
        </LCARSButton>
        <LCARSButton
          color="mars"
          disabled={torpedoCount === 0}
          className="flex-1"
        >
          LAUNCH TORPEDO
        </LCARSButton>
      </div>

      <div className="p-4 bg-black border-2 border-[#8899FF] rounded">
        <div className="text-[#8899FF] font-bold tracking-wider mb-3">
          TARGETING COMPUTER
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#8899FF]">RANGE:</span>
            <span className="text-[#FF9966]">45,000 km</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8899FF]">BEARING:</span>
            <span className="text-[#FF9966]">127 mark 4</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8899FF]">LOCK TIME:</span>
            <span className="text-[#FF9966]">3.2 seconds</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#FF2200] blink-slow">
        ⚠ WEAPONS SYSTEMS ARMED ⚠
      </div>
    </div>
  );
}
