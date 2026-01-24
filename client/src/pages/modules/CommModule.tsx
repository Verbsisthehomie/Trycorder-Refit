import React, { useState } from 'react';
import LCARSButton from '@/components/LCARSButton';
import LCARSBar from '@/components/LCARSBar';

export default function CommModule() {
  const [frequency, setFrequency] = useState(121.5);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [messages, setMessages] = useState<string[]>(['COMM SYSTEM ONLINE']);

  const handleTransmit = () => {
    setIsTransmitting(true);
    setMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] TRANSMISSION ON ${frequency.toFixed(1)} MHz`,
    ]);
    setTimeout(() => setIsTransmitting(false), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="text-[#8899FF] text-sm font-mono tracking-wider mb-4">
        COMMUNICATIONS ARRAY - ACTIVE
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="p-4 bg-black border-2 border-[#8899FF] rounded">
        <div className="text-[#FF9966] font-bold tracking-wider mb-3">
          FREQUENCY CONTROL
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="100"
            max="300"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="flex-1"
          />
          <div className="text-2xl font-bold text-[#FF9966] w-32 text-right">
            {frequency.toFixed(1)} MHz
          </div>
        </div>
      </div>

      <div className="p-4 bg-black border-2 border-[#CC99FF] rounded">
        <div className="text-[#CC99FF] font-bold tracking-wider mb-3">
          TRANSMISSION STATUS
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`w-4 h-4 rounded-full ${
              isTransmitting ? 'bg-[#FF2200] blink-fast' : 'bg-[#666688]'
            }`}
          />
          <span className="text-[#8899FF]">
            {isTransmitting ? 'TRANSMITTING' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <LCARSButton
          color="bluey"
          onClick={handleTransmit}
          disabled={isTransmitting}
          className="flex-1"
        >
          TRANSMIT
        </LCARSButton>
        <LCARSButton color="gray" className="flex-1">
          RECEIVE
        </LCARSButton>
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="p-4 bg-black border-2 border-[#8899FF] rounded h-48 overflow-y-auto">
        <div className="text-[#8899FF] font-bold tracking-wider mb-3">
          MESSAGE LOG
        </div>
        <div className="space-y-1">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-xs text-[#FF9966] font-mono">
              {msg}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-[#8899FF]">
        COMMUNICATIONS ARRAY OPERATIONAL | SIGNAL STRENGTH: EXCELLENT
      </div>
    </div>
  );
}
