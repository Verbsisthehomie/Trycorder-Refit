import React, { useState, useEffect } from 'react';
import LCARSBar from '@/components/LCARSBar';

interface SensorData {
  temperature: number;
  pressure: number;
  light: number;
  magnetic: number;
  gravity: number;
  orientation: { alpha: number; beta: number; gamma: number };
}

export default function SensorModule() {
  const [sensors, setSensors] = useState<SensorData>({
    temperature: 72,
    pressure: 101.3,
    light: 500,
    magnetic: 45,
    gravity: 9.8,
    orientation: { alpha: 0, beta: 0, gamma: 0 },
  });

  useEffect(() => {
    // Request permission for device orientation (iOS 13+)
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS 13 devices
      window.addEventListener('deviceorientation', handleOrientation);
    }

    // Simulate sensor data updates
    const interval = setInterval(() => {
      setSensors((prev) => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        pressure: prev.pressure + (Math.random() - 0.5) * 0.5,
        light: Math.max(0, prev.light + (Math.random() - 0.5) * 50),
        magnetic: prev.magnetic + (Math.random() - 0.5) * 5,
        gravity: 9.8 + (Math.random() - 0.5) * 0.2,
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setSensors((prev) => ({
      ...prev,
      orientation: {
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      },
    }));
  };

  const SensorReading = ({
    label,
    value,
    unit,
    color = 'butterscotch',
  }: {
    label: string;
    value: number;
    unit: string;
    color?: string;
  }) => (
    <div className="mb-4 p-3 bg-black border border-[#8899FF] rounded">
      <div className={`text-sm font-bold tracking-wider font-${color}`}>
        {label}
      </div>
      <div className="text-2xl font-bold text-[#FF9966] mt-2">
        {value.toFixed(2)} <span className="text-sm">{unit}</span>
      </div>
      <div className="mt-2 h-1 bg-[#333] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF9966] to-[#8899FF]"
          style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-[#8899FF] text-sm font-mono tracking-wider mb-4">
        ENVIRONMENTAL SENSOR ARRAY - ACTIVE
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorReading
          label="TEMPERATURE"
          value={sensors.temperature}
          unit="°C"
          color="mars"
        />
        <SensorReading
          label="ATMOSPHERIC PRESSURE"
          value={sensors.pressure}
          unit="kPa"
          color="bluey"
        />
        <SensorReading
          label="LIGHT INTENSITY"
          value={sensors.light}
          unit="lux"
          color="gold"
        />
        <SensorReading
          label="MAGNETIC FIELD"
          value={sensors.magnetic}
          unit="μT"
          color="violet"
        />
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="p-4 bg-black border-2 border-[#CC99FF] rounded">
        <div className="text-[#CC99FF] font-bold tracking-wider mb-3">
          ORIENTATION DATA
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-[#8899FF]">ALPHA</div>
            <div className="text-xl font-bold text-[#FF9966]">
              {sensors.orientation.alpha.toFixed(1)}°
            </div>
          </div>
          <div>
            <div className="text-xs text-[#8899FF]">BETA</div>
            <div className="text-xl font-bold text-[#FF9966]">
              {sensors.orientation.beta.toFixed(1)}°
            </div>
          </div>
          <div>
            <div className="text-xs text-[#8899FF]">GAMMA</div>
            <div className="text-xl font-bold text-[#FF9966]">
              {sensors.orientation.gamma.toFixed(1)}°
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#8899FF] mt-4">
        <span className="blink">SCANNING...</span> | RESOLUTION: HIGH | UPDATE
        INTERVAL: 1.0s
      </div>
    </div>
  );
}
