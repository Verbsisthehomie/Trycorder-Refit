import React, { useState } from 'react';
import TrycorderLayout, { TrycorderModule } from '@/components/TrycorderLayout';
import SensorModule from './modules/SensorModule';
import CommModule from './modules/CommModule';
import ShieldModule from './modules/ShieldModule';
import FireModule from './modules/FireModule';
import ServerModule from './modules/ServerModule';

export default function Trycorder() {
  const [currentModule, setCurrentModule] = useState<TrycorderModule>('sensors');

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'sensors':
        return <SensorModule />;
      case 'comm':
        return <CommModule />;
      case 'shield':
        return <ShieldModule />;
      case 'fire':
        return <FireModule />;
      case 'transp':
        return <div className="text-[#FF9966]">TRANSPORTER SYSTEM - OPERATIONAL</div>;
      case 'tractor':
        return <div className="text-[#8899FF]">TRACTOR BEAM SYSTEM - STANDBY</div>;
      case 'motor':
        return <div className="text-[#CC99FF]">MOTOR CONTROL - READY</div>;
      case 'viewer':
        return <div className="text-[#FFAA00]">VIEWSCREEN - ONLINE</div>;
      case 'logs':
        return <div className="text-[#FF9966]">SYSTEM LOGS - AVAILABLE</div>;
      case 'mode':
        return <ServerModule />;
      default:
        return <div>UNKNOWN MODULE</div>;
    }
  };

  return (
    <TrycorderLayout
      currentModule={currentModule}
      onModuleChange={setCurrentModule}
    >
      {renderModuleContent()}
    </TrycorderLayout>
  );
}
