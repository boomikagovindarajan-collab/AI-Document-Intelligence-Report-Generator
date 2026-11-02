import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  FileText, 
  HelpCircle, 
  FileCheck2, 
  CheckCircle2, 
  Calendar, 
  Hash, 
  Tag, 
  Layers, 
  Building2, 
  Compass, 
  Sparkles,
  RefreshCw,
  Loader2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  TrendingUp,
  Award,
  BarChart2,
  MapPin,
  Users
} from 'lucide-react';
import { api } from '../services/api';

export default function AnalysisPage({ selectedDocId, onSelectDoc, onNavigate }) {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(selectedDocId || '');
  const [docData, setDocData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Load document list
  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.getDocuments();
        setDocuments(res.documents || []);
        if (!activeDocId && res.documents.length > 0) {
          setActiveDocId(res.documents[0].id);
          if (onSelectDoc) onSelectDoc(res.documents[0].id);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      }
    }
    loadDocs();
  }, []);

  // Sync when selectedDocId prop changes
  useEffect(() => {
    if (selectedDocId && selectedDocId !== activeDocId) {
      setActiveDocId(selectedDocId);
    }
  }, [selectedDocId]);

  // Load analysis for activeDocId
  useEffect(() => {
    if (!activeDocId) return;
    async function loadAnalysis() {
      setLoading(true);
      try {
        const res = await api.getAnalysis(activeDocId);
        setDocData(res.document);
        setAnalysisData(res.analysis);
      } catch (err) {
        console.error('Failed to load analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [activeDocId]);

  const handleReanalyze = async () => {
    if (!activeDocId) return;
    setReanalyzing(true);
    try {
      const res = await api.reanalyzeDocument(activeDocId);
      setAnalysisData(res.analysis);
    } catch (err) {
      console.error('Failed to reanalyze:', err);
    } finally {
      setReanalyzing(false);
    }
  };

  const handleCopyRaw = () => {
    if (currentDoc?.raw_text) {
      navigator.clipboard.writeText(currentDoc.raw_text);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  const currentDoc = documents.find(d => d.id === activeDocId) || docData;

  const tabList = [
    { id: 'summary', label: 'Document Summary', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'key_info', label: 'Key Information', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'keywords', label: 'Keywords & Phrases', icon: Tag, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'topics', label: 'Main Topics', icon: Layers, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { id: 'entities', label: 'Named Entities', icon: Building2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'dates_numbers', label: 'Dates & Numbers', icon: Hash, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'findings', label: 'Key Findings', icon: Compass, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'conclusions', label: 'Conclusions', icon: CheckCircle2, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'raw_text', label: 'Extracted Raw Text', icon: BookOpen, color: 'text-slate-600 bg-slate-50 border-slate-200' }
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* ─── Top Header & Document Selector ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Document Intelligence &amp; NLP Analysis
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 ml-11">
            Verified extraction results and computational graph centrality derived from ground-truth source text.
          </p>
        </div>

        {/* File Selector Dropdown */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-600 shrink-0 pl-2">Active Document:</label>
          <select
            value={activeDocId}
            onChange={(e) => {
              setActiveDocId(e.target.value);
              if (onSelectDoc) onSelectDoc(e.target.value);
            }}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer max-w-[260px] truncate"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.filename} (.{d.file_format})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Synthesizing Document Intelligence</h3>
            <p className="text-xs text-slate-500">Executing TextRank graph algorithms, named entity recognition, and topic extraction...</p>
          </div>
        </div>
      ) : currentDoc && analysisData ? (
        <div className="space-y-6">

          {/* ─── Document Hero Card ─── */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-sm uppercase font-mono shadow-sm shrink-0 ${
                currentDoc.file_format === 'PDF' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                currentDoc.file_format === 'DOCX' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                <span>{currentDoc.file_format}</span>
                <span className="text-[9px] font-normal opacity-80">FILE</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">{currentDoc.filename}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Extracted &amp; Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Uploaded on <strong>{currentDoc.created_at}</strong> &bull; Size: <strong>{currentDoc.file_size_formatted}</strong> &bull; Storage: Local SQLite
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => { if (onSelectDoc) onSelectDoc(activeDocId); onNavigate('qa'); }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold shadow-xs hover:-translate-y-0.5 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask Questions</span>
              </button>
              <button
                onClick={() => { if (onSelectDoc) onSelectDoc(activeDocId); onNavigate('report-generator'); }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* ─── 4 Metric Cards Row ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Word Count */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Word Count</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {currentDoc.word_count?.toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Processed tokens</p>
            </div>

            {/* Total Pages */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Pages</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {currentDoc.page_count}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Page partitions</p>
            </div>

            {/* Model Methodology */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Methodology</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <span className="text-sm font-bold text-indigo-700 block line-clamp-1">
                {analysisData.methodology || 'TextRank Centrality'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Graph PageRank d=0.85</p>
            </div>

            {/* Confidence Score */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extraction Confidence</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-black text-emerald-600 tracking-tight">
                {analysisData.confidence_score}%
              </span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${analysisData.confidence_score}%` }}
                />
              </div>
            </div>
          </div>

          {/* ─── Executive Summary Card ─── */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 border border-indigo-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-indigo-100/80 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Executive Summary</h3>
                  <p className="text-xs text-indigo-700 font-medium">Extractive TextRank Graph Centrality</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
                  Confidence: {analysisData.confidence_score}%
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Calibrated Synthesis
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-white/90 p-5 rounded-2xl border border-indigo-100/70 shadow-2xs">
              {analysisData.executive_summary}
            </p>
          </div>

          {/* ─── Multi-Section Analysis Modules (Tabs Container) ─── */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none px-4 pt-3 gap-1">
              {tabList.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-indigo-700 shadow-xs border-t-2 border-indigo-600 -mb-px'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents Area */}
            <div className="p-6 sm:p-8">

              {/* 1. Full Document Summary */}
              {activeTab === 'summary' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Standard Synthesized Summary
                      </h4>
                      <p className="text-xs text-slate-500">Multi-sentence coverage synthesized via sentence-to-sentence PageRank centrality</p>
                    </div>
                    <button
                      onClick={handleReanalyze}
                      disabled={reanalyzing}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs text-indigo-700 font-bold border border-indigo-200/80 transition-colors self-start sm:self-auto"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin' : ''}`} />
                      <span>{reanalyzing ? 'Regenerating...' : 'Regenerate Summary'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {analysisData.document_summary.split('. ').filter(s => s.trim().length > 0).map((sentence, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start space-x-3 hover:bg-slate-50 transition-colors">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {sentence.trim().endsWith('.') ? sentence.trim() : `${sentence.trim()}.`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Key Information Extraction */}
              {activeTab === 'key_info' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Key Information Extraction</h4>
                    <p className="text-xs text-slate-500">Isolated structural objectives, core findings, experimental metrics, and constraints</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisData.key_information?.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-2xs space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Keywords & Phrases */}
              {activeTab === 'keywords' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Extracted Top Keywords</h4>
                    <p className="text-xs text-slate-500">Ranked by term frequency and semantic significance across document tokens</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {analysisData.keywords?.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 text-indigo-900 text-xs font-semibold shadow-2xs hover:scale-105 transition-transform cursor-default"
                      >
                        <span>{kw.keyword}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-white rounded-lg text-indigo-600 font-mono font-bold shadow-2xs">
                          {kw.count}x
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Main Topics */}
              {activeTab === 'topics' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Main Topics &amp; Themes</h4>
                    <p className="text-xs text-slate-500">Thematic clusters identified through keyword co-occurrence graph analysis</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisData.topics?.map((top, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition-colors space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">{top.topic}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>Relevance</span>
                            <span className="font-bold text-indigo-600">{top.relevance}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Named Entities */}
              {activeTab === 'entities' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Named Entities Registry</h4>
                    <p className="text-xs text-slate-500">Multi-class entity extraction categorized into organizations, persons, locations, and concepts</p>
                  </div>

                  {Object.entries(analysisData.named_entities || {}).map(([category, items]) => {
                    if (!items || items.length === 0) return null;
                    const catColors = {
                      organizations: 'bg-blue-50 text-blue-700 border-blue-200',
                      persons: 'bg-purple-50 text-purple-700 border-purple-200',
                      locations: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      technologies: 'bg-amber-50 text-amber-700 border-amber-200'
                    };
                    const colorClass = catColors[category] || 'bg-slate-100 text-slate-800 border-slate-200';
                    return (
                      <div key={category} className="space-y-2.5">
                        <div className="flex items-center space-x-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            {category.replace('_', ' ')}
                          </h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {items.length} detected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {items.map((it, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${colorClass} shadow-2xs`}
                            >
                              {it.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 6. Dates and Numbers */}
              {activeTab === 'dates_numbers' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Important Dates &amp; Numeric Values</h4>
                    <p className="text-xs text-slate-500">Quantifiable data points, benchmarks, years, and measurements extracted from source text</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {analysisData.dates_and_numbers?.map((d, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate mr-2">{d.value}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700 font-mono font-bold shrink-0">
                          {d.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Findings */}
              {activeTab === 'findings' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Key Document Findings</h4>
                    <p className="text-xs text-slate-500">Verified core outcomes and experimental highlights synthesized directly from source text</p>
                  </div>

                  <div className="space-y-3">
                    {analysisData.main_findings?.map((f, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start space-x-3.5">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          ✓
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {f}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Conclusions */}
              {activeTab === 'conclusions' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900">Strategic Conclusions</h4>
                    <p className="text-xs text-slate-500">Forward-looking conclusions, theoretical implications, and research summaries</p>
                  </div>

                  <div className="space-y-3">
                    {analysisData.conclusions?.map((c, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/60 to-purple-50/40 border border-indigo-100 flex items-start space-x-3.5">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          ★
                        </div>
                        <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                          {c}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. Raw Text */}
              {activeTab === 'raw_text' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Extracted Raw Text</h4>
                      <p className="text-xs text-slate-500">Digital text extracted directly via PyMuPDF or python-docx</p>
                    </div>
                    <button
                      onClick={handleCopyRaw}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRaw ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed border border-slate-800 shadow-inner">
                    {currentDoc.raw_text || 'Raw text not loaded.'}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No document selected</h3>
          <p className="text-xs text-slate-400">Please upload a document from the Upload page or select an entry in History.</p>
        </div>
      )}

    </div>
  );
}
