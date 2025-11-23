import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { KeywordAnalyzer } from './components/KeywordAnalyzer';
import { ViewState } from './types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.ANALYSIS:
        return <KeywordAnalyzer />;
      case ViewState.SETTINGS:
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <Settings className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-2xl font-semibold mb-2 text-slate-300">설정</h2>
                <p>현재 버전에서는 사용자 설정을 지원하지 않습니다.</p>
                <p className="text-sm mt-2">v1.0.0 (Gemini Powered)</p>
            </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;