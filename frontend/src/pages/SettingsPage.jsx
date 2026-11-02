import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Cpu, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Database, 
  Trash2, 
  Save, 
  Moon, 
  Sun,
  User,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage() {
  const [provider, setProvider] = useState('local');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [theme, setTheme] = useState('light');
  const [granularity, setGranularity] = useState('Standard (5 Sents)');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getSettings();
        if (res.settings) {
          setProvider(res.settings.llm_provider || 'local');
          setTheme(res.settings.theme || 'light');
          setGranularity(res.settings.summary_default_granularity || 'Standard (5 Sents)');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        llm_provider: provider,
        theme,
        granularity
      };
      if (geminiKey.trim()) payload.gemini_api_key = geminiKey.trim();
      if (openaiKey.trim()) payload.openai_api_key = openaiKey.trim();

      await api.saveSettings(payload);
      setSaveMessage('Settings saved successfully.');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTestKey = async (providerToTest) => {
    setTesting(true);
    setTestResult(null);
    const key = providerToTest === 'gemini' ? geminiKey : openaiKey;

    try {
      const res = await api.testConnection(providerToTest, key);
      setTestResult({
        provider: providerToTest,
        status: res.status,
        message: res.message
      });
    } catch (err) {
      setTestResult({
        provider: providerToTest,
        status: 'error',
        message: err.message || 'Connection test failed.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm("WARNING: This will delete ALL uploaded documents, extracted texts, analysis results, Q&A history, and generated reports from the local SQLite database. Are you sure?")) {
      return;
    }
    setClearing(true);
    try {
      await api.clearHistory();
      alert('All local database records and uploaded files cleared.');
      window.location.reload();
    } catch (err) {
      alert(`Error clearing history: ${err.message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            System Settings &amp; Configuration
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure AI intelligence providers, model inference parameters, security, and storage.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Project Team Profile */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Project Team & Institution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Team Member Cards */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/60 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">B</div>
              <div>
                <p className="text-sm font-bold text-slate-900">BOOMIKA G</p>
                <p className="text-xs text-indigo-700 font-medium">Team Member</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/60 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">V</div>
              <div>
                <p className="text-sm font-bold text-slate-900">VIBUTHA P</p>
                <p className="text-xs text-purple-700 font-medium">Team Member</p>
              </div>
            </div>
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-900">KPR Institute of Engineering and Technology, Coimbatore</p>
              <p className="text-xs text-slate-500">Department of Information Technology</p>
            </div>
          </div>
        </div>

        {/* AI & NLP Model Settings */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>AI Model &amp; Processing Engine Configuration</span>
          </div>

          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Active Intelligence Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'local', title: 'Local NLP Pipeline', desc: 'TextRank graph centrality + BM25 retrieval. Fully offline, no API key needed.' },
                { id: 'gemini', title: 'Google Gemini API', desc: 'Gemini 1.5 Flash grounded synthesis. Requires Gemini API key.' },
                { id: 'openai', title: 'OpenAI API', desc: 'GPT-4o mini grounded Q&A. Requires OpenAI API key.' }
              ].map((p) => {
                const isSelected = provider === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setProvider(p.id)}
                          className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="text-xs font-bold text-slate-900">{p.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Keys Configuration */}
          {provider === 'gemini' && (
            <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Gemini API Key
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    placeholder="Enter your AI Studio API key (AIzaSy...)"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestKey('gemini')}
                    disabled={testing}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Test Key'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {provider === 'openai' && (
            <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  OpenAI API Key
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    placeholder="Enter your OpenAI API key (sk-...)"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestKey('openai')}
                    disabled={testing}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Test Key'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Status Feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
              testResult.status === 'online'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {testResult.status === 'online' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Database & Storage Management */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Storage &amp; Database Maintenance</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Purge Ingestion Records</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Clears all documents, extracted texts, analysis records, questions, and generated files from SQLite.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearDatabase}
              disabled={clearing}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              {clearing ? 'Clearing...' : 'Purge All Database Records'}
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveMessage ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMessage}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Settings persist in local SQLite store.</span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
