import React from 'react';
import {
  FileText,
  UploadCloud,
  Cpu,
  HelpCircle,
  Download,
  CheckCircle2,
  ArrowRight,
  Layers,
  Zap,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  Brain,
  BarChart3,
  Search,
  Tag,
  Users,
  Star,
  ChevronRight,
  Globe,
  Lock,
  Clock,
  TrendingUp,
  Database,
  BookOpen
} from 'lucide-react';

export default function HomePage({ onNavigate, onOpenUploadModal, onOpenTestSuite }) {
  const features = [
    {
      icon: FileText,
      title: 'Smart Text Extraction',
      desc: 'High-fidelity parsers extract digital text, paragraphs, tables, and page partitions from PDF, DOCX, and TXT files with zero layout degradation.',
      color: 'blue',
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
    },
    {
      icon: Brain,
      title: 'AI-Powered Summarization',
      desc: 'TextRank graph centrality algorithm constructs sentence networks via PageRank (d=0.85) to synthesize executive, standard, and detailed summaries.',
      color: 'purple',
      bg: 'bg-purple-50/70',
      border: 'border-purple-100',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
    },
    {
      icon: Tag,
      title: 'Named Entity Recognition (NER)',
      desc: 'Multi-class entity extraction isolates organizations, people, locations, benchmark metrics, and technical concepts across document tokens.',
      color: 'indigo',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-100',
      iconText: 'text-indigo-600',
    },
    {
      icon: HelpCircle,
      title: 'Grounded Q&A with Citations',
      desc: 'Ask questions about your uploaded documents. Answers are strictly retrieved from passages with verified page references and anti-hallucination guardrails.',
      color: 'emerald',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
    },
    {
      icon: FileCheck2,
      title: 'Structured Report Generator',
      desc: 'Synthesize publication-ready documents in styled ReportLab PDF, editable Microsoft Word (.docx), and machine-readable JSON exports.',
      color: 'rose',
      bg: 'bg-rose-50/70',
      border: 'border-rose-100',
      iconBg: 'bg-rose-100',
      iconText: 'text-rose-600',
    },
    {
      icon: Clock,
      title: 'Ingestion History & Storage',
      desc: 'Persistent local SQLite database stores all ingested documents, text extractions, NLP analyses, Q&A exchanges, and generated reports.',
      color: 'amber',
      bg: 'bg-amber-50/70',
      border: 'border-amber-100',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Document Ingestion',
      desc: 'Upload PDF, DOCX, or TXT files up to 25MB or paste raw content directly into the secure portal.',
      icon: UploadCloud,
      color: 'bg-blue-600',
    },
    {
      num: '02',
      title: 'Text Extraction & Parsing',
      desc: 'PyMuPDF and python-docx parse token streams, sentences, and structure with full metadata fidelity.',
      icon: Search,
      color: 'bg-indigo-600',
    },
    {
      num: '03',
      title: 'NLP Graph Intelligence',
      desc: 'TextRank builds sentence-to-sentence similarity graphs, scores centrality, and extracts named entities.',
      icon: Cpu,
      color: 'bg-purple-600',
    },
    {
      num: '04',
      title: 'Reports & Grounded Q&A',
      desc: 'Ask grounded questions with citation receipts, then synthesize tailored publication reports.',
      icon: Download,
      color: 'bg-emerald-600',
    },
  ];

  const techStack = [
    { name: 'Python Flask', category: 'Backend Engine', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'React.js 18', category: 'Frontend SPA', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Tailwind CSS', category: 'Modern Styling', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { name: 'SQLite 3', category: 'Database Storage', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { name: 'PyMuPDF', category: 'PDF Parser', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { name: 'python-docx', category: 'Word Parser', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'ReportLab Platypus', category: 'PDF Synthesis', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'TextRank Algorithm', category: 'NLP Centrality', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Vite', category: 'Build Tool', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc]">

      {/* ═══════════════════════════════════════════════════════════════
          MAIN HERO CARD (EXACTLY MATCHING USER SCREENSHOT)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full">
        <div className="relative rounded-[2.5rem] bg-[#0c1527] border border-slate-800 text-center text-white px-6 py-14 sm:px-12 sm:py-20 shadow-2xl overflow-hidden">
          
          {/* Subtle Ambient Glow Behind Content */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-5xl mx-auto space-y-6">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-blue-950/60 text-blue-300 text-xs font-semibold shadow-xs">
              <span className="text-blue-400 font-bold">✧</span>
              <span>COGNITIVE DOCUMENT INTELLIGENCE PLATFORM</span>
            </div>

            {/* Main Heading (Matching user screenshot) */}
            <div className="space-y-1 pt-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                AI Document Intelligence &amp;
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent leading-tight mt-1">
                Automated Report Generator
              </h2>
            </div>

            {/* Subtitle / Description (Matching user screenshot) */}
            <p className="max-w-4xl mx-auto text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal pt-2">
              An end-to-end cognitive document platform engineered to ingest PDF, DOCX, and TXT files, 
              extract rich semantic text, synthesize multi-paragraph executive summaries, isolate named 
              entities, provide strictly grounded Q&amp;A, and generate publisher-ready PDF, Word, and JSON 
              reports.
            </p>

            {/* 3 Call to Action Buttons (Matching user screenshot) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              {/* Button 1: Upload & Analyze Document */}
              <button
                onClick={onOpenUploadModal}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload &amp; Analyze Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Button 2: View System Dashboard */}
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>View System Dashboard</span>
              </button>

              {/* Button 3: Automated Test Suite (17 TCs) */}
              <button
                onClick={onOpenTestSuite}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 text-xs sm:text-sm font-bold hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Automated Test Suite (17 TCs)</span>
              </button>
            </div>

            {/* Bottom Feature Ribbon (Matching labels in screenshot) */}
            <div className="pt-8 mt-6 border-t border-slate-800/90 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Supported Formats
                </span>
                <p className="text-xs font-bold text-white flex items-center space-x-2">
                  <span className="text-rose-400">PDF</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-blue-400">DOCX</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-400">TXT</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Neural AI Model
                </span>
                <p className="text-xs font-bold text-white">
                  Grounded LLM + TextRank
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Fallback Capability
                </span>
                <p className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Offline Graph Heuristics</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Download Formats
                </span>
                <p className="text-xs font-bold text-white">
                  PDF &bull; Word (.docx) &bull; JSON
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CORE ARCHITECTURAL PILLARS / FEATURES GRID
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              End-to-End Pipeline
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Document Intelligence Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Engineered with deterministic natural language processing, extractive graph networks, and verified citations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-3xl ${feat.bg} border ${feat.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} ${feat.iconText} flex items-center justify-center mb-4 shadow-2xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS / WORKFLOW
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Execution Sequence
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How DocuMind AI Operates
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              From raw uploaded document to verified structured report in four systematic phases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-300 font-mono">
                        {st.num}
                      </span>
                      <div className={`w-9 h-9 rounded-xl ${st.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{st.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TECHNOLOGY STACK
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technology Integration
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Built on Modern Open-Source Engineering Standards
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-2xl border text-xs font-bold ${tech.color} shadow-2xs hover:scale-105 transition-transform flex items-center space-x-2`}
              >
                <span>{tech.name}</span>
                <span className="text-[10px] opacity-70 font-normal">({tech.category})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM CALL TO ACTION & TEAM REGISTRY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            DocuMind AI &bull; Intelligent Document Intelligence &amp; Reporting
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Analyze Your Documents?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload any PDF, Word (DOCX), or plain text document to receive instant extractive summaries, 
            multi-class named entities, grounded citations, and publication-ready structured reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenUploadModal}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document Now</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              View Dashboard
            </button>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 DocuMind AI. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <span>100% Local &amp; Private</span>
              <span>&bull;</span>
              <span>Source Grounded</span>
              <span>&bull;</span>
              <span>Zero Hallucination</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
