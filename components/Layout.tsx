import React from 'react';
import { LayoutDashboard, Search, Settings, Activity } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-800 border-r border-slate-700 flex flex-col items-center lg:items-stretch transition-all duration-300 z-20">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-700">
          <Activity className="w-8 h-8 text-green-500" />
          <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-white">
            N-Rank<span className="text-green-500">.AI</span>
          </span>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="대시보드" 
            active={currentView === ViewState.DASHBOARD}
            onClick={() => onNavigate(ViewState.DASHBOARD)}
          />
          <NavItem 
            icon={<Search />} 
            label="키워드 분석" 
            active={currentView === ViewState.ANALYSIS}
            onClick={() => onNavigate(ViewState.ANALYSIS)}
          />
          <NavItem 
            icon={<Settings />} 
            label="설정" 
            active={currentView === ViewState.SETTINGS}
            onClick={() => onNavigate(ViewState.SETTINGS)}
          />
        </nav>
        
        <div className="p-4 border-t border-slate-700 hidden lg:block">
            <div className="bg-slate-700/50 rounded-lg p-3 text-xs text-slate-400">
                <p>Status: <span className="text-green-400">Online</span></p>
                <p>API: Gemini 2.5 Flash</p>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6 z-10 sticky top-0">
          <h1 className="text-lg font-semibold text-white">
            {currentView === ViewState.DASHBOARD && '실시간 트렌드 모니터링'}
            {currentView === ViewState.ANALYSIS && '키워드 심층 분석'}
            {currentView === ViewState.SETTINGS && '시스템 설정'}
          </h1>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                U
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center p-3 rounded-xl transition-all duration-200 group
        ${active 
          ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/50' 
          : 'text-slate-400 hover:bg-slate-700 hover:text-white'}
      `}
    >
      <span className="w-6 h-6 flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, { 
            className: active ? "stroke-[2.5px]" : "stroke-2" 
        })}
      </span>
      <span className="hidden lg:block ml-3 font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 hidden lg:block animate-pulse" />}
    </button>
  );
};