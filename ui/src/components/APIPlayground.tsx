import React, { useState } from 'react';
import { ActiveAPIPlaygroundLog } from '../types';
import { Terminal, Copy, Check, Trash2, ArrowRightLeft, Database } from 'lucide-react';

interface APIPlaygroundProps {
  logs: ActiveAPIPlaygroundLog[];
  onClear: () => void;
}

export const APIPlayground: React.FC<APIPlaygroundProps> = ({ logs, onClear }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'POST': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PUT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PATCH': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed bottom-0 right-0 left-0 bg-gray-900 border-t border-gray-800 text-gray-100 z-50 flex flex-col transition-all duration-300 shadow-2xl"
         style={{ height: isOpen ? '280px' : '44px' }}>
      
      {/* Drawer Header */}
      <div className="bg-gray-950 px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-gray-800 select-none"
           onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-3">
          <div className="bg-[#C8102E] p-1 rounded">
            <Database size={15} className="text-white" />
          </div>
          <span className="font-mono text-xs font-bold tracking-wider text-gray-200 uppercase flex items-center gap-1.5">
            Los API Console Log <span className="text-gray-500 font-normal">| Connected to localhost:8080/los/system/ (Simulated H2)</span>
          </span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
            SPRING_BOOT_ACTIVE
          </span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
          {logs.length > 0 && (
            <button 
              onClick={onClear} 
              className="text-gray-400 hover:text-white flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded transition text-[11px]"
              title="Clear Console Logs"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
          <span className="text-gray-400">
            {logs.length} Operations recorded
          </span>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white font-bold px-2 py-0.5 rounded hover:bg-gray-800 text-sm"
          >
            {isOpen ? 'Collapse ▾' : 'Expand API Console ▴'}
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="p-3 overflow-y-auto flex-1 font-mono text-xs space-y-2.5 bg-gray-950/70">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 py-6">
              <Terminal size={32} className="stroke-1 mb-2 text-gray-600" />
              <p>Execute board actions (drag cards, upload docs, add tasks, switch roles) to view transactional API payloads.</p>
              <p className="text-[10px] text-gray-600 mt-1">Endpoints bind to controller route pattern: <code className="text-amber-500">@RestController @RequestMapping(&quot;/los/system/*&quot;)</code></p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-900 border border-gray-800 rounded-md overflow-hidden transition-all hover:border-gray-700">
                  
                  {/* Log Header */}
                  <div className="bg-gray-950/80 px-3 py-1.5 flex items-center justify-between border-b border-gray-800/50">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 border rounded font-mono ${getMethodBadgeClass(log.method)}`}>
                        {log.method}
                      </span>
                      <span className="text-gray-200 font-medium font-mono font-semibold text-[11px] selection:bg-red-900 leading-none">
                        /api/los/system/{log.endpoint}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-gray-500">
                      <span>{log.timestamp}</span>
                      <span className="text-emerald-500 font-bold">HTTP 200 OK</span>
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify({ request: JSON.parse(log.payload), response: JSON.parse(log.response) }, null, 2), log.id)}
                        className="text-gray-400 hover:text-white cursor-pointer"
                        title="Copy Payload JSON"
                      >
                        {copiedId === log.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Log Body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                    
                    {/* Request Payload */}
                    <div className="p-2 bg-gray-900/40">
                      <div className="text-[10px] text-amber-500 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                        <span>→ Request Body (Payload to H2)</span>
                      </div>
                      <pre className="text-gray-400 whitespace-pre overflow-x-auto text-[10.5px] max-h-[120px] scrollbar-thin">
                        {log.payload}
                      </pre>
                    </div>

                    {/* Response Payload */}
                    <div className="p-2 bg-gray-900/10">
                      <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                        <span>← Response (H2 Stored Entity)</span>
                      </div>
                      <pre className="text-gray-300 whitespace-pre overflow-x-auto text-[10.5px] max-h-[120px] scrollbar-thin">
                        {log.response}
                      </pre>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
