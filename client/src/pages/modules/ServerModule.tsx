import React, { useState } from 'react';
import LCARSButton from '@/components/LCARSButton';
import LCARSPanel from '@/components/LCARSPanel';
import LCARSBar from '@/components/LCARSBar';

interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  uptime?: string;
  cpu?: number;
  memory?: number;
  disk?: number;
  lastConnected?: string;
}

const ServerModule: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([
    {
      id: '1',
      name: 'STARBASE-1',
      host: '192.168.1.100',
      port: 22,
      username: 'admin',
      status: 'connected',
      uptime: '45d 12h 33m',
      cpu: 42,
      memory: 68,
      disk: 85,
      lastConnected: '2026-01-24 05:00:00'
    },
    {
      id: '2',
      name: 'OUTPOST-DELTA',
      host: '192.168.1.101',
      port: 22,
      username: 'user',
      status: 'disconnected',
      lastConnected: '2026-01-23 14:30:00'
    }
  ]);

  const [selectedServer, setSelectedServer] = useState<Server | null>(servers[0]);
  const [showAddServer, setShowAddServer] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    host: '',
    port: 22,
    username: ''
  });

  const handleAddServer = () => {
    if (newServer.name && newServer.host && newServer.username) {
      const server: Server = {
        id: Date.now().toString(),
        ...newServer,
        status: 'disconnected'
      };
      setServers([...servers, server]);
      setNewServer({ name: '', host: '', port: 22, username: '' });
      setShowAddServer(false);
    }
  };

  const handleConnect = (server: Server) => {
    const updatedServers = servers.map(s =>
      s.id === server.id ? { ...s, status: 'connecting' as const } : s
    );
    setServers(updatedServers);

    // Simulate connection
    setTimeout(() => {
      const finalServers = updatedServers.map(s =>
        s.id === server.id
          ? {
              ...s,
              status: 'connected' as const,
              uptime: '2d 5h 12m',
              cpu: Math.floor(Math.random() * 100),
              memory: Math.floor(Math.random() * 100),
              disk: Math.floor(Math.random() * 100),
              lastConnected: new Date().toLocaleString()
            }
          : s
      );
      setServers(finalServers);
      setSelectedServer(finalServers.find(s => s.id === server.id) || null);
    }, 1500);
  };

  const handleDisconnect = (server: Server) => {
    const updatedServers = servers.map(s =>
      s.id === server.id ? { ...s, status: 'disconnected' as const } : s
    );
    setServers(updatedServers);
    setSelectedServer(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-[#00FF00]';
      case 'connecting':
        return 'text-[#FFAA00] animate-pulse';
      case 'error':
        return 'text-[#FF2200]';
      default:
        return 'text-[#666688]';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'connected':
        return '●';
      case 'connecting':
        return '◐';
      case 'error':
        return '✕';
      default:
        return '○';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#FF9966] tracking-wider">
          SERVER MANAGEMENT SYSTEM
        </h2>
        <p className="text-xs text-[#8899FF] tracking-widest mt-1">
          STARSHIP COMPUTER NETWORK - ACTIVE
        </p>
      </div>

      <LCARSBar orientation="horizontal" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Server List */}
        <div className="lg:col-span-1">
          <LCARSPanel>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#FF9966] font-bold text-sm tracking-wider">
                AVAILABLE SERVERS
              </h3>
              <LCARSButton
                color="bluey"
                size="sm"
                onClick={() => setShowAddServer(!showAddServer)}
              >
                {showAddServer ? 'CANCEL' : 'ADD'}
              </LCARSButton>
            </div>

            {showAddServer && (
              <div className="bg-black border border-[#8899FF] p-3 mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Server Name"
                  value={newServer.name}
                  onChange={(e) =>
                    setNewServer({ ...newServer, name: e.target.value })
                  }
                  className="w-full bg-black border border-[#666688] text-[#FF9966] px-2 py-1 text-xs focus:outline-none focus:border-[#8899FF]"
                />
                <input
                  type="text"
                  placeholder="Host/IP"
                  value={newServer.host}
                  onChange={(e) =>
                    setNewServer({ ...newServer, host: e.target.value })
                  }
                  className="w-full bg-black border border-[#666688] text-[#FF9966] px-2 py-1 text-xs focus:outline-none focus:border-[#8899FF]"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newServer.username}
                  onChange={(e) =>
                    setNewServer({ ...newServer, username: e.target.value })
                  }
                  className="w-full bg-black border border-[#666688] text-[#FF9966] px-2 py-1 text-xs focus:outline-none focus:border-[#8899FF]"
                />
                <LCARSButton
                  color="gold"
                  size="sm"
                  onClick={handleAddServer}
                  className="w-full"
                >
                  CONFIRM
                </LCARSButton>
              </div>
            )}

            <div className="space-y-2">
              {servers.map((server) => (
                <div
                  key={server.id}
                  onClick={() => setSelectedServer(server)}
                  className={`p-3 border border-[#666688] cursor-pointer transition-all ${
                    selectedServer?.id === server.id
                      ? 'border-[#FFAA00] bg-[#1a1a1a]'
                      : 'hover:border-[#8899FF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-lg ${getStatusColor(server.status)}`}>
                      {getStatusIndicator(server.status)}
                    </span>
                    <span className="text-[#FF9966] font-bold text-xs">
                      {server.name}
                    </span>
                  </div>
                  <p className="text-[#8899FF] text-xs">{server.host}</p>
                  <p className="text-[#666688] text-xs mt-1">
                    {server.status.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </LCARSPanel>
        </div>

        {/* Server Details */}
        <div className="lg:col-span-2">
          {selectedServer ? (
            <LCARSPanel>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[#FF9966] font-bold text-lg tracking-wider">
                    {selectedServer.name}
                  </h3>
                  <p className="text-[#8899FF] text-xs mt-1">
                    {selectedServer.host}:{selectedServer.port}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedServer.status === 'connected' ? (
                    <LCARSButton
                      color="mars"
                      size="sm"
                      onClick={() => handleDisconnect(selectedServer)}
                    >
                      DISCONNECT
                    </LCARSButton>
                  ) : selectedServer.status === 'connecting' ? (
                    <LCARSButton color="gold" size="sm" disabled>
                      CONNECTING...
                    </LCARSButton>
                  ) : (
                    <LCARSButton
                      color="bluey"
                      size="sm"
                      onClick={() => handleConnect(selectedServer)}
                    >
                      CONNECT
                    </LCARSButton>
                  )}
                </div>
              </div>

              <LCARSBar orientation="horizontal" />

              {selectedServer.status === 'connected' ? (
                <>
                  {/* System Metrics */}
                  <div className="grid grid-cols-3 gap-4 my-4">
                    <div className="border border-[#666688] p-3">
                      <p className="text-[#8899FF] text-xs mb-2">CPU USAGE</p>
                      <div className="bg-black border border-[#FF9966] h-2 mb-1">
                        <div
                          className="bg-[#FF9966] h-full transition-all"
                          style={{ width: `${selectedServer.cpu}%` }}
                        />
                      </div>
                      <p className="text-[#FF9966] font-bold text-sm">
                        {selectedServer.cpu}%
                      </p>
                    </div>

                    <div className="border border-[#666688] p-3">
                      <p className="text-[#8899FF] text-xs mb-2">MEMORY</p>
                      <div className="bg-black border border-[#8899FF] h-2 mb-1">
                        <div
                          className="bg-[#8899FF] h-full transition-all"
                          style={{ width: `${selectedServer.memory}%` }}
                        />
                      </div>
                      <p className="text-[#8899FF] font-bold text-sm">
                        {selectedServer.memory}%
                      </p>
                    </div>

                    <div className="border border-[#666688] p-3">
                      <p className="text-[#8899FF] text-xs mb-2">DISK</p>
                      <div className="bg-black border border-[#CC99FF] h-2 mb-1">
                        <div
                          className="bg-[#CC99FF] h-full transition-all"
                          style={{ width: `${selectedServer.disk}%` }}
                        />
                      </div>
                      <p className="text-[#CC99FF] font-bold text-sm">
                        {selectedServer.disk}%
                      </p>
                    </div>
                  </div>

                  <LCARSBar orientation="horizontal" />

                  {/* Server Info */}
                  <div className="grid grid-cols-2 gap-4 my-4 text-xs">
                    <div>
                      <p className="text-[#8899FF] mb-1">UPTIME</p>
                      <p className="text-[#FF9966] font-bold">
                        {selectedServer.uptime}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#8899FF] mb-1">LAST CONNECTION</p>
                      <p className="text-[#FF9966] font-bold">
                        {selectedServer.lastConnected}
                      </p>
                    </div>
                  </div>

                  <LCARSBar orientation="horizontal" />

                  {/* Control Commands */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[#8899FF] text-xs font-bold mb-2">
                      SERVER CONTROLS
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <LCARSButton color="bluey" size="sm">
                        RESTART
                      </LCARSButton>
                      <LCARSButton color="gold" size="sm">
                        REBOOT
                      </LCARSButton>
                      <LCARSButton color="mars" size="sm">
                        SHUTDOWN
                      </LCARSButton>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#8899FF] text-sm">
                    {selectedServer.status === 'connecting'
                      ? 'ESTABLISHING CONNECTION...'
                      : 'AWAITING CONNECTION COMMAND'}
                  </p>
                </div>
              )}
            </LCARSPanel>
          ) : (
            <LCARSPanel>
              <div className="text-center py-12">
                <p className="text-[#8899FF] text-sm">
                  SELECT A SERVER TO VIEW DETAILS
                </p>
              </div>
            </LCARSPanel>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerModule;
