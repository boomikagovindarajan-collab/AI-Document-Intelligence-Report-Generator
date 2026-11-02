import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadModal from './components/UploadModal';
import TestSuiteModal from './components/TestSuiteModal';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import QAPage from './pages/QAPage';
import ReportGenPage from './pages/ReportGenPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // Default to the attractive Home / Front page!
  const [selectedDocId, setSelectedDocId] = useState('4141bf8812b148c78cd2fab616730a22'); // default to UAV seed doc
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  // Health check on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        setApiOnline(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (doc) => {
    setSelectedDocId(doc.id);
    setActivePage('analysis');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Fixed SaaS Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenTestSuite={() => setIsTestSuiteOpen(true)}
        apiOnline={apiOnline}
      />

      {/* Main Content View */}
      <main className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <HomePage
            onNavigate={setActivePage}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenTestSuite={() => setIsTestSuiteOpen(true)}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            onNavigate={setActivePage}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onSelectDoc={setSelectedDocId}
          />
        )}

        {activePage === 'upload' && (
          <UploadPage
            onNavigate={setActivePage}
            onSelectDoc={setSelectedDocId}
          />
        )}

        {activePage === 'analysis' && (
          <AnalysisPage
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'qa' && (
          <QAPage
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
          />
        )}

        {activePage === 'report-generator' && (
          <ReportGenPage
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            onSelectDoc={setSelectedDocId}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActivePage} />

      {/* Upload Modal (Replicating Screenshot 6.8) */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Test Suite Modal (17 TCs) */}
      <TestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
      />
    </div>
  );
}
