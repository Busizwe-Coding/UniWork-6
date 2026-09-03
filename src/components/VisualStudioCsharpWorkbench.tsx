import React, { useState } from 'react';
import { FileCode, Folder, FolderOpen, Copy, Download, Play, Check, Terminal, Code2, Server, Cpu, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { csharpSolutionFiles } from '../data/csharpSolutionData';
import { CSharpFile } from '../types';

export const VisualStudioCsharpWorkbench: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CSharpFile>(csharpSolutionFiles[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activeApiRoute, setActiveApiRoute] = useState<string>('/api/sushimenu/seasonal');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("NuriSushi.Backend");

      csharpSolutionFiles.forEach((file) => {
        if (folder) {
          folder.file(file.filename, file.content);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = "NuriSushi.Backend.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Zip generation error:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleExecuteCsharpApi = () => {
    setIsExecutingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      setIsExecutingApi(false);
      if (activeApiRoute === '/api/sushimenu/seasonal') {
        setApiResponse(JSON.stringify([
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Red Dragon Signature',
            japaneseName: 'レッドドラゴン',
            price: 24.00,
            category: 'rolls',
            isChefSpecial: true,
            collection: 'PRESTIGE COLLECTION',
            calories: 480
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Tsukiji Sashimi',
            japaneseName: '築地刺身盛り',
            price: 18.00,
            category: 'sashimi',
            calories: 220
          }
        ], null, 2));
      } else if (activeApiRoute === '/api/orders/checkout') {
        setApiResponse(JSON.stringify({
          orderId: 'NURI-849201',
          status: 'Received',
          estimatedMinutes: 35,
          timestamp: new Date().toISOString(),
          signalRHubChannel: 'OrderTrackingHub/NURI-849201'
        }, null, 2));
      } else {
        setApiResponse(JSON.stringify({
          status: '200 OK',
          service: 'NuriSushi.Backend.ASP.NET Core 9.0',
          database: 'EF Core SQL Server Connected'
        }, null, 2));
      }
    }, 600);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-12">
      {/* Visual Studio C# Banner */}
      <div className="bg-[#1e1e1e] text-white p-6 border-l-4 border-[#bc001f] mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#bc001f] font-mono-caps text-xs">
              <Code2 className="w-5 h-5 text-[#bc001f]" />
              <span>VISUAL STUDIO C# SOLUTION & ASP.NET CORE BACKEND</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold mt-1 text-white">
              NuriSushi.sln — C# Web API & EF Core Architecture
            </h2>
            <p className="font-body text-xs text-gray-400 mt-1 max-w-2xl">
              Complete production-ready C# solution for Visual Studio IDE including ASP.NET Core REST API controllers, Entity Framework Core SQL Server schemas, and SignalR real-time hubs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="bg-[#bc001f] text-white font-mono-caps text-xs px-4 py-2.5 hover:bg-[#e6192e] transition-colors flex items-center gap-2 font-bold shadow-md"
            >
              <Archive className="w-4 h-4" />
              <span>{isZipping ? 'Zipping...' : 'Download Backend (.zip)'}</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="bg-[#2d2d2d] text-white border border-gray-600 font-mono-caps text-xs px-4 py-2.5 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Active File'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="bg-[#2d2d2d] text-white border border-gray-600 font-mono-caps text-xs px-4 py-2.5 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Selected .cs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#1e1e1e] text-[#d4d4d4] border border-gray-800 shadow-2xl rounded-xs overflow-hidden">
        {/* Solution Explorer (Left 4 cols) */}
        <div className="lg:col-span-4 bg-[#252526] border-r border-gray-800 p-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-gray-300 font-bold border-b border-gray-700 pb-3 mb-3">
            <FolderOpen className="w-4 h-4 text-[#bc001f]" />
            <span>Solution 'NuriSushi' (1 Project)</span>
          </div>

          <div className="space-y-1 pl-2">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] mb-2">
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span>NuriSushi.Backend</span>
            </div>

            {csharpSolutionFiles.map((file) => {
              const isSelected = selectedFile.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 font-mono text-xs transition-colors rounded-xs ${
                    isSelected
                      ? 'bg-[#37373d] text-white border-l-2 border-[#bc001f]'
                      : 'hover:bg-[#2a2d2e] text-gray-400'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${file.language === 'xml' ? 'text-blue-400' : 'text-emerald-400'}`} />
                  <span className="truncate">{file.filename}</span>
                </button>
              );
            })}
          </div>

          {/* C# Features Overview Box */}
          <div className="mt-8 bg-[#1e1e1e] p-3 border border-gray-700 text-[11px] space-y-2">
            <span className="text-[#bc001f] font-bold block font-mono-caps">Visual Studio Stack</span>
            <div className="text-gray-400 space-y-1">
              <div>• Framework: .NET 9.0 Web API</div>
              <div>• ORM: Entity Framework Core</div>
              <div>• Realtime: SignalR Hubs</div>
              <div>• Database: SQL Server / Azure SQL</div>
              <div>• AI: Google.GenAI C# SDK</div>
            </div>
          </div>
        </div>

        {/* Code View & Endpoint Execution Console (Right 8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {/* File Header Bar */}
          <div className="bg-[#2d2d2d] px-4 py-2.5 border-b border-gray-800 flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <FileCode className="w-4 h-4 text-[#bc001f]" />
              <span className="font-bold">{selectedFile.path}</span>
            </div>
            <span className="text-gray-400 text-[11px]">{selectedFile.description}</span>
          </div>

          {/* Code Editor Container */}
          <div className="p-4 bg-[#1e1e1e] font-mono text-xs overflow-x-auto max-h-[460px] text-gray-200 leading-relaxed selection:bg-[#bc001f] selection:text-white">
            <pre className="whitespace-pre">{selectedFile.content}</pre>
          </div>

          {/* C# API Endpoint Tester Drawer */}
          <div className="bg-[#252526] border-t border-gray-800 p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <Terminal className="w-4 h-4 text-[#bc001f]" />
                <span>C# ASP.NET Core Endpoint Simulator</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-800">
                http://localhost:5000 (C# Server)
              </span>
            </div>

            <div className="flex gap-2">
              <select
                value={activeApiRoute}
                onChange={(e) => setActiveApiRoute(e.target.value)}
                className="bg-[#1e1e1e] border border-gray-700 text-white p-2 text-xs focus:outline-none focus:border-[#bc001f]"
              >
                <option value="/api/sushimenu/seasonal">GET /api/sushimenu/seasonal</option>
                <option value="/api/orders/checkout">POST /api/orders/checkout</option>
                <option value="/api/sushimenu">GET /api/sushimenu (Full List)</option>
              </select>

              <button
                onClick={handleExecuteCsharpApi}
                disabled={isExecutingApi}
                className="bg-[#bc001f] text-white px-4 py-2 font-mono-caps text-xs hover:bg-[#e6192e] transition-colors flex items-center gap-2 font-bold"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isExecutingApi ? 'Invoking C#...' : 'Execute Request'}</span>
              </button>
            </div>

            {apiResponse && (
              <div className="bg-[#1e1e1e] p-3 border border-gray-700 text-[11px] text-emerald-400 overflow-x-auto max-h-40">
                <pre>{apiResponse}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
