import React from 'react';
import { 
  FileText, 
  Home,
  LayoutGrid, 
  UploadCloud, 
  Cpu, 
  MessageSquare, 
  FileCheck2,
  History, 
  Settings,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenUploadModal, onOpenTestSuite, apiOnline = true }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'qa', label: 'Ask Document', icon: MessageSquare },
    { id: 'report-generator', label: 'Report Generator', icon: FileCheck2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'test-suite', label: 'Test Suite', icon: ShieldCheck, action: onOpenTestSuite },
    { id: 'settings', label: 'About & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* ─── Left Brand: import React from 'react';
import { 
  FileText, 
  Home,
  LayoutGrid, 
  UploadCloud, 
  Cpu, 
  MessageSquare, 
  FileCheck2,
  History, 
  Settings,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenUploadModal, onOpenTestSuite, apiOnline = true }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'qa', label: 'Ask Document', icon: MessageSquare },
    { id: 'report-generator', label: 'Report Generator', icon: FileCheck2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'test-suite', label: 'Test Suite', icon: ShieldCheck, action: onOpenTestSuite },
    { id: 'settings', label: 'About & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* ─── Left Brand: import React from 'react';
import { 
  FileText, 
  Home,
  LayoutGrid, 
  UploadCloud, 
  Cpu, 
  MessageSquare, 
  FileCheck2,
  History, 
  Settings,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenUploadModal, onOpenTestSuite, apiOnline = true }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'qa', label: 'Ask Document', icon: MessageSquare },
    { id: 'report-generator', label: 'Report Generator', icon: FileCheck2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'test-suite', label: 'Test Suite', icon: ShieldCheck, action: onOpenTestSuite },
    { id: 'settings', label: 'About & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* ─── Left Brand: import React from 'react';
import { 
  FileText, 
  Home,
  LayoutGrid, 
  UploadCloud, 
  Cpu, 
  MessageSquare, 
  FileCheck2,
  History, 
  Settings,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenUploadModal, onOpenTestSuite, apiOnline = true }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'qa', label: 'Ask Document', icon: MessageSquare },
    { id: 'report-generator', label: 'Report Generator', icon: FileCheck2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'test-suite', label: 'Test Suite', icon: ShieldCheck, action: onOpenTestSuite },
    { id: 'settings', label: 'About & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* ─── Left Brand: import React from 'react';
import { 
  FileText, 
  Home,
  LayoutGrid, 
  UploadCloud, 
  Cpu, 
  MessageSquare, 
  FileCheck2,
  History, 
  Settings,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenUploadModal, onOpenTestSuite, apiOnline = true }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'qa', label: 'Ask Document', icon: MessageSquare },
    { id: 'report-generator', label: 'Report Generator', icon: FileCheck2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'test-suite', label: 'Test Suite', icon: ShieldCheck, action: onOpenTestSuite },
    { id: 'settings', label: 'About & Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* ─── Left Brand: DocuIntellect  / DocuIntellect AI v2.4 ─── */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  DocuIntellect AI
              </span>
                
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 tracking-wider">
                AI 
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-tight -mt-0.5">
              Document Intelligence &amp; Report Generator
            </span>
          </div>
        </div>

        {/* ─── Central Navigation Items ─── */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            const handleClick = () => {
              if (item.action) {
                item.action();
              } else {
                setActivePage(item.id);
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ─── Right Pill: Gemini 3.8 Flash Online Status ─── */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Document Intelligence Online</span>
        </div>
      </div>

      {/* ─── Mobile / Tablet Navigation Scroller ─── */}
      <div className="xl:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/70 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              setActivePage(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
 / DocuIntellect AI v2.4 ─── */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  DocuIntellect AI
              </span>
                
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 tracking-wider">
                AI 
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-tight -mt-0.5">
              Document Intelligence &amp; Report Generator
            </span>
          </div>
        </div>

        {/* ─── Central Navigation Items ─── */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            const handleClick = () => {
              if (item.action) {
                item.action();
              } else {
                setActivePage(item.id);
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ─── Right Pill: Gemini 3.8 Flash Online Status ─── */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Document Intelligence Online</span>
        </div>
      </div>

      {/* ─── Mobile / Tablet Navigation Scroller ─── */}
      <div className="xl:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/70 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              setActivePage(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
 / DocuIntellect AI v2.4 ─── */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  DocuIntellect AI
              </span>
                
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 tracking-wider">
                AI 
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-tight -mt-0.5">
              Document Intelligence &amp; Report Generator
            </span>
          </div>
        </div>

        {/* ─── Central Navigation Items ─── */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            const handleClick = () => {
              if (item.action) {
                item.action();
              } else {
                setActivePage(item.id);
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ─── Right Pill: Gemini 3.8 Flash Online Status ─── */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Document Intelligence Online</span>
        </div>
      </div>

      {/* ─── Mobile / Tablet Navigation Scroller ─── */}
      <div className="xl:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/70 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              setActivePage(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
s / DocuIntellect AI v2.4 ─── */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  DocuIntellect AI
              </span>
                
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 tracking-wider">
                AI 
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-tight -mt-0.5">
              Document Intelligence &amp; Report Generator
            </span>
          </div>
        </div>

        {/* ─── Central Navigation Items ─── */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            const handleClick = () => {
              if (item.action) {
                item.action();
              } else {
                setActivePage(item.id);
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ─── Right Pill: Gemini 3.8 Flash Online Status ─── */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Document Intelligence Online</span>
        </div>
      </div>

      {/* ─── Mobile / Tablet Navigation Scroller ─── */}
      <div className="xl:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/70 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              setActivePage(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
 / DocuIntellect AI v2.4 ─── */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  DocuIntellect AI
              </span>
                
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 tracking-wider">
                AI 
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-tight -mt-0.5">
              Document Intelligence &amp; Report Generator
            </span>
          </div>
        </div>

        {/* ─── Central Navigation Items ─── */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            const handleClick = () => {
              if (item.action) {
                item.action();
              } else {
                setActivePage(item.id);
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ─── Right Pill: Gemini 3.8 Flash Online Status ─── */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Document Intelligence Online</span>
        </div>
      </div>

      {/* ─── Mobile / Tablet Navigation Scroller ─── */}
      <div className="xl:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/70 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              setActivePage(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
