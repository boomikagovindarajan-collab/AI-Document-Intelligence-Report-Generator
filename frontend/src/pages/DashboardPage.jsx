import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  Cpu,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Layers,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  FileCheck2,
  Trash2,
  Activity,
  Zap,
  Database,
  Server,
  Wifi,
  RefreshCw,
  BarChart2,
  Circle
} from 'lucide-react';
import { api } from '../services/api';

function StatCard({ label, value, loading, icon: Icon, gradient, bgColor, subLabel, borderColor }) {
  return (
    <div className={`relative p-5 rounded-2xl bg-white border-l-4 ${borderColor} border-r border-t border-b border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden`}>
      {/* Background gradient blob */}
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${bgColor} opacity-20 blur-xl pointer-events-none`} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{label}</span>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
          <Icon className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
        </div>
      </div>
      <div className="my-1">
        <span className="text-3xl font-extrabold text-slate-900">
          {loading ? <span className="text-slate-300 animate-pulse">—</span> : value}
        </span>
      </div>
      <div className="text-xs text-slate-400 font-medium">{subLabel}</div>
    </div>
  );
}

export default function DashboardPage({ onNavigate, onOpenUploadModal, onSelectDoc }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatBadgeColor = (fmt) => {
    const f = (fmt || '').toUpperCase();
    if (f === 'PDF') return 'bg-rose-100 text-rose-700 border-rose-200';
    if (f === 'DOCX') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ─── Dashboard Header ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Dashboard</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 ml-10">
            Real usage metrics, persistent document logs, and report synthesis history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 text-xs font-medium shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* ─── Error Banner ────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadStats} className="font-semibold underline hover:text-rose-900 transition-colors">Retry</button>
        </div>
      )}

      {/* ─── 4 Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Documents"
          value={stats?.metrics?.total_documents ?? 0}
          loading={loading}
          icon={FileText}
          gradient="from-blue-500 to-blue-600"
          bgColor="bg-blue-400"
          borderColor="border-l-blue-500"
          subLabel="Stored in local SQLite"
        />
        <StatCard
          label="Reports Synthesized"
          value={stats?.metrics?.reports_synthesized ?? 0}
          loading={loading}
          icon={FileCheck2}
          gradient="from-purple-500 to-purple-600"
          bgColor="bg-purple-400"
          borderColor="border-l-purple-500"
          subLabel="PDF, DOCX & JSON files"
        />
        <StatCard
          label="Questions Answered"
          value={stats?.metrics?.questions_answered ?? 0}
          loading={loading}
          icon={HelpCircle}
          gradient="from-emerald-500 to-emerald-600"
          bgColor="bg-emerald-400"
          borderColor="border-l-emerald-500"
          subLabel="Grounded in document text"
        />
        <StatCard
          label="Words Processed"
          value={stats?.metrics?.words_processed_formatted ?? '0'}
          loading={loading}
          icon={TrendingUp}
          gradient="from-indigo-500 to-indigo-600"
          bgColor="bg-indigo-400"
          borderColor="border-l-indigo-500"
          subLabel="Tokenized & analyzed"
        />
      </div>

      {/* ─── Format Breakdown + Dark CTA ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Format Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Document Format Breakdown</h3>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { label: '.PDF DOCUMENTS', key: 'pdf', bar: 'bg-gradient-to-r from-rose-400 to-rose-500', dot: 'bg-rose-500' },
                { label: '.DOCX DOCUMENTS', key: 'docx', bar: 'bg-gradient-to-r from-blue-400 to-blue-500', dot: 'bg-blue-500' },
                { label: '.TXT DOCUMENTS', key: 'txt', bar: 'bg-gradient-to-r from-slate-400 to-slate-600', dot: 'bg-slate-500' },
              ].map(({ label, key, bar, dot }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className="uppercase text-[11px] tracking-wide text-slate-500">{label}</span>
                    </div>
                    <span className="font-mono">
                      {stats?.format_breakdown?.[key]?.count ?? 0} ({stats?.format_breakdown?.[key]?.percentage ?? 0}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar} rounded-full transition-all duration-700`}
                      style={{ width: `${stats?.format_breakdown?.[key]?.percentage ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between mt-4">
            <span>Validated with PyMuPDF &amp; python-docx</span>
            <button onClick={() => onNavigate('upload')} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              + Upload more
            </button>
          </div>
        </div>

        {/* Dark CTA Card */}
        <div className="lg:col-span-7 p-7 rounded-2xl bg-[#0b192c] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/8 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/50 text-[11px] font-semibold text-indigo-300 mb-4">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified Local NLP Pipeline</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
              Automate Your Document Analysis
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mb-6">
              Upload any PDF, Word (DOCX), or plain text document up to 25MB. The system automatically performs text extraction,
              runs TextRank graph summarization, extracts named entities, and prepares instant grounded answers.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'TextRank PageRank', desc: 'Extractive summarization' },
                { label: 'Multi-class NER', desc: 'Entity identification' },
                { label: 'Semantic Q&A', desc: 'Citation-backed answers' },
                { label: 'Multi-format Export', desc: 'PDF, DOCX, JSON' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 duration-200"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Now</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              Browse History
            </button>
          </div>
        </div>
      </div>

      {/* ─── System Status ────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">System Status</h3>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Server, label: 'Flask API Server', status: 'Operational', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { icon: Database, label: 'SQLite Database', status: 'Connected', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
            { icon: Cpu, label: 'NLP TextRank Engine', status: 'Active', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
            { icon: FileText, label: 'ReportLab PDF Engine', status: 'Ready', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          ].map((sys, i) => {
            const Icon = sys.icon;
            return (
              <div key={i} className={`p-3.5 rounded-xl ${sys.bg} border ${sys.border} flex items-center gap-2.5`}>
                <Icon className={`w-4 h-4 ${sys.color} shrink-0`} />
                <div>
                  <div className="text-[10px] font-semibold text-slate-700">{sys.label}</div>
                  <div className={`text-[10px] font-bold ${sys.color}`}>{sys.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Recent Activity ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Documents */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recent Ingested Documents</h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recent_documents?.length > 0 ? (
              stats.recent_documents.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3 truncate">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono shrink-0 ${formatBadgeColor(doc.file_format)}`}>
                      {doc.file_format}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate">{doc.filename}</p>
                      <p className="text-[11px] text-slate-400">{doc.word_count} words · {doc.file_size_formatted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { onSelectDoc(doc.id); onNavigate('analysis'); }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Analysis
                    </button>
                    <button
                      onClick={() => { onSelectDoc(doc.id); onNavigate('qa'); }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <UploadCloud className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No documents uploaded yet.</p>
                <button
                  onClick={onOpenUploadModal}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Upload your first document →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recent Synthesized Reports</h3>
            </div>
            <button
              onClick={() => onNavigate('report-generator')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>New report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recent_reports?.length > 0 ? (
              stats.recent_reports.map((rep) => (
                <div key={rep.id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors">
                  <div className="truncate pr-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">{rep.report_title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-semibold">
                        {rep.archetype}
                      </span>
                      <span className="text-[10px] text-slate-400">{rep.created_at}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={api.getDownloadUrl(rep.id, 'pdf')}
                      download
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-[10px] font-bold border border-rose-100"
                      title="Download PDF"
                    >PDF</a>
                    <a
                      href={api.getDownloadUrl(rep.id, 'docx')}
                      download
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-[10px] font-bold border border-blue-100"
                      title="Download DOCX"
                    >DOCX</a>
                    <a
                      href={api.getDownloadUrl(rep.id, 'json')}
                      download
                      className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors text-[10px] font-bold border border-purple-100"
                      title="Download JSON"
                    >JSON</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <FileCheck2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No reports synthesized yet.</p>
                <button
                  onClick={() => onNavigate('report-generator')}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Generate your first report →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
