import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileCheck2, 
  Download, 
  Sliders, 
  Eye, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileCode2,
  RefreshCw,
  X,
  Award,
  Cpu,
  GraduationCap,
  Microscope,
  FolderGit2,
  Briefcase,
  Layers,
  Type,
  BookOpen,
  Calendar,
  Building,
  User
} from 'lucide-react';
import { api } from '../services/api';

export default function ReportGenPage({ selectedDocId, onSelectDoc }) {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(selectedDocId || '');
  
  // Section 1: Metadata
  const [reportTitle, setReportTitle] = useState('');
  const [authorName, setAuthorName] = useState('BOOMIKA G & VIBUTHA P');
  const [organization, setOrganization] = useState('Department of Information Technology, KPRIET, Coimbatore');
  const [reportDate, setReportDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  // Section 2: Archetype & Granularity
  const [archetype, setArchetype] = useState('Executive Brief');
  const [granularity, setGranularity] = useState('Standard (5 Sents)');

  // Section 3: Content Inclusions
  const [inclusions, setInclusions] = useState({
    executive_summary: true,
    document_overview: true,
    key_findings: true,
    keywords: true,
    entities: true,
    dates_numbers: true,
    methodology: true,
    conclusions: true,
    qa_summary: true,
    source_references: true,
    limitations: true
  });

  // Section 4: Styling
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [fontSize, setFontSize] = useState('Standard (10pt)');
  const [includePageNumbers, setIncludePageNumbers] = useState(true);

  // States
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const archetypes = [
    { 
      id: 'Executive Brief', 
      desc: 'High-level synthesis focused on key takeaways and metrics.',
      icon: Award,
      badge: 'Strategic',
      color: 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
    },
    { 
      id: 'Technical Synthesis', 
      desc: 'Deep algorithmic mechanics, evaluation parameters, and systems review.',
      icon: Cpu,
      badge: 'Engineering',
      color: 'border-blue-500 bg-blue-50/50 text-blue-700'
    },
    { 
      id: 'Academic Report', 
      desc: 'Formal methodological rigour, citation receipts, and research context.',
      icon: GraduationCap,
      badge: 'Peer-Reviewed',
      color: 'border-purple-500 bg-purple-50/50 text-purple-700'
    },
    { 
      id: 'Research Summary', 
      desc: 'Empirical takeaways, experimental benchmarks, and literature alignment.',
      icon: Microscope,
      badge: 'Empirical',
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
    },
    { 
      id: 'Project Report', 
      desc: 'Capstone objectives, engineering milestones, and delivery registry.',
      icon: FolderGit2,
      badge: 'Deliverable',
      color: 'border-amber-500 bg-amber-50/50 text-amber-700'
    },
    { 
      id: 'Business Report', 
      desc: 'Operational impact, performance ratios, and strategic conclusions.',
      icon: Briefcase,
      badge: 'Corporate',
      color: 'border-rose-500 bg-rose-50/50 text-rose-700'
    },
  ];

  // Load documents
  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.getDocuments();
        setDocuments(res.documents || []);
        if (!activeDocId && res.documents.length > 0) {
          const first = res.documents[0];
          setActiveDocId(first.id);
          setReportTitle(`Analysis Report — ${first.filename}`);
          if (onSelectDoc) onSelectDoc(first.id);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      }
    }
    loadDocs();
  }, []);

  // Sync prop changes
  useEffect(() => {
    if (selectedDocId && selectedDocId !== activeDocId) {
      setActiveDocId(selectedDocId);
      const found = documents.find(d => d.id === selectedDocId);
      if (found) {
        setReportTitle(`Analysis Report — ${found.filename}`);
      }
    }
  }, [selectedDocId, documents]);

  const handleDocChange = (id) => {
    setActiveDocId(id);
    if (onSelectDoc) onSelectDoc(id);
    const found = documents.find(d => d.id === id);
    if (found) {
      setReportTitle(`Analysis Report — ${found.filename}`);
    }
  };

  const toggleInclusion = (key) => {
    setInclusions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async () => {
    if (!activeDocId) {
      setError('Please select a target document.');
      return;
    }
    setGenerating(true);
    setError(null);

    const payload = {
      document_id: activeDocId,
      report_title: reportTitle,
      author_name: authorName,
      organization: organization,
      report_date: reportDate,
      archetype: archetype,
      granularity: granularity,
      inclusions: inclusions,
      styling: {
        fontFamily,
        fontSize,
        includePageNumbers
      }
    };

    try {
      const res = await api.generateReport(payload);
      setGeneratedReport(res.report);
    } catch (err) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* ─── Top Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Structured Report Generator
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 ml-11">
            Configure analytical calibration, select content modules, and synthesize publication-ready PDF, Word, and JSON reports.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            5 Config Sections
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── SECTION 1: Target Document & Report Metadata ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono">
            01
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Target Document &amp; Report Metadata</h3>
            <p className="text-xs text-slate-400">Specify the document source, report headline, and author credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Document Source
            </label>
            <select
              value={activeDocId}
              onChange={(e) => handleDocChange(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer shadow-2xs"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename} (.{d.file_format})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Report Title
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Author(s)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Organization / Lab Name
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: Report Profile & Summary Calibration ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center font-mono">
            02
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Report Profile &amp; Summary Calibration</h3>
            <p className="text-xs text-slate-400">Choose analytical depth, domain focus, and sentence-level granularity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Analytical Archetype Selection */}
          <div className="lg:col-span-7 space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Analytical Archetype ({archetypes.length} Profiles Available)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {archetypes.map((arch) => {
                const isSelected = archetype === arch.id;
                const Icon = arch.icon;
                return (
                  <div
                    key={arch.id}
                    onClick={() => setArchetype(arch.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs scale-[1.01]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900">{arch.id}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {arch.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{arch.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Granularity & Settings */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Summary Granularity Calibration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Brief (3 Sents)', 'Standard (5 Sents)', 'Detailed (8 Sents)'].map((g) => {
                  const isSelected = granularity === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGranularity(g)}
                      className={`py-2.5 px-2 text-center rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Controls the extractive sentence budget calculated via TextRank centrality scores.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Active Profile</span>
              <p className="text-xs font-bold text-slate-900">{archetype} &bull; {granularity}</p>
              <p className="text-[11px] text-slate-600">Ensures strict evidence adherence without artificial extrapolation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: Content Inclusion ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center font-mono">
            03
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Content Inclusions Registry</h3>
            <p className="text-xs text-slate-400">Select which analytical sections to compile into the final document artifacts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'executive_summary', label: 'Executive Summary', desc: 'Calibrated TextRank graph summary' },
            { key: 'document_overview', label: 'Document Overview', desc: 'Metadata, file size, pages & word count' },
            { key: 'key_findings', label: 'Key Findings', desc: 'Empirical takeaways & observations' },
            { key: 'keywords', label: 'Top Keywords & Phrases', desc: 'TF-IDF term significance ranking' },
            { key: 'entities', label: 'Named Entities Registry', desc: 'Organizations, people, places & tools' },
            { key: 'dates_numbers', label: 'Important Dates & Numbers', desc: 'Benchmark metrics and quantitative data' },
            { key: 'methodology', label: 'Methodology Framework', desc: 'Algorithmic approach & evaluation' },
            { key: 'conclusions', label: 'Strategic Conclusions', desc: 'Key insights & forward recommendations' },
            { key: 'qa_summary', label: 'Grounded Q&A Summary', desc: 'Include recent questions & verified answers' },
            { key: 'source_references', label: 'Source References', desc: 'Exact citations & page receipts' },
            { key: 'limitations', label: 'Ingestion Limitations', desc: 'Transparent boundaries & constraints' }
          ].map(({ key, label, desc }) => {
            const isChecked = inclusions[key];
            return (
              <label 
                key={key} 
                onClick={() => toggleInclusion(key)}
                className={`p-3.5 rounded-2xl border-2 flex items-start space-x-3 cursor-pointer transition-all select-none ${
                  isChecked 
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 4: Report Customisation (Typography & Layout) ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
            04
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Typography &amp; Page Layout</h3>
            <p className="text-xs text-slate-400">Configures ReportLab Platypus styles and Word document formatting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Helvetica">Helvetica (Clean Sans-Serif)</option>
              <option value="Times-Roman">Times New Roman (Academic Serif)</option>
              <option value="Courier">Courier (Monospace Engineering)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Font Scale</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Compact (9pt)">Compact (9pt - Dense)</option>
              <option value="Standard (10pt)">Standard (10pt - Balanced)</option>
              <option value="Enlarged (11pt)">Enlarged (11pt - Readable)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Pagination &amp; Headers</label>
            <div className="pt-2 flex items-center space-x-2.5">
              <input
                type="checkbox"
                id="pageNums"
                checked={includePageNumbers}
                onChange={(e) => setIncludePageNumbers(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="pageNums" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Running header &amp; page numbers
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 5: Generate & Actions ─── */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-800/80 text-indigo-200 uppercase font-mono">
              SECTION 05
            </span>
            <h4 className="text-base font-bold text-white">Synthesize Publication-Ready Artifacts</h4>
          </div>
          <p className="text-xs text-slate-300">
            Builds ReportLab Platypus PDF, Microsoft Word (.docx), and structured JSON with full ground-truth traceability.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !activeDocId}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{generating ? 'Synthesizing Artifacts...' : 'Generate Structured Report'}</span>
        </button>
      </div>

      {/* ─── Generated Report Card / Download Actions ─── */}
      {generatedReport && (
        <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-indigo-50/60 border border-emerald-200 shadow-md space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {generatedReport.report_title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Profile: <strong>{generatedReport.archetype}</strong> &bull; Granularity: <strong>{generatedReport.granularity}</strong> &bull; Date: {generatedReport.report_date}
                </p>
              </div>
            </div>

            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 text-xs font-bold shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Preview Structured Report</span>
            </button>
          </div>

          <div className="pt-4 border-t border-emerald-100/80 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700 mr-2">Download Artifacts:</span>
            
            <a
              href={api.getDownloadUrl(generatedReport.id, 'pdf')}
              download
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Document (.pdf)</span>
            </a>

            <a
              href={api.getDownloadUrl(generatedReport.id, 'docx')}
              download
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word Document (.docx)</span>
            </a>

            <a
              href={api.getDownloadUrl(generatedReport.id, 'json')}
              download
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON Structured Export (.json)</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── Report Preview Modal ─── */}
      {previewOpen && generatedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Document Preview: {generatedReport.report_title}
                </h3>
              </div>
              <button 
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
              <div className="border-b border-slate-200 pb-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 font-mono">
                  {generatedReport.archetype} Report
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{generatedReport.report_title}</h2>
                <p className="text-xs text-slate-500">
                  Date: {generatedReport.report_date || 'Today'} &bull; Author: {generatedReport.author_name} &bull; {generatedReport.organization}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">1. Executive Summary</h4>
                <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed text-justify">
                  Synthesized via {archetype} calibration with {granularity} granularity. All key empirical takeaways and multi-class named entities isolated with verified ground-truth traceability.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">2. Inclusions Profile</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(inclusions).filter(([_, v]) => v).map(([k]) => (
                    <span key={k} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                      {k.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">3. Verification &amp; Compliance</h4>
                <p className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                  ✓ Source grounded extraction &bull; No speculative extrapolations &bull; Verified citation indexes
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Rendered via ReportLab Platypus Engine</span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
