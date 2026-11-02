import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Cpu, 
  HelpCircle, 
  FileText, 
  FileCheck2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowUpDown,
  Filter,
  Layers,
  ArrowRight,
  UploadCloud,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryPage({ onSelectDoc, onNavigate }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL FORMATS');
  const [statusFilter, setStatusFilter] = useState('ALL STATUS');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (formatFilter !== 'ALL FORMATS') params.format = formatFilter;
      if (statusFilter !== 'ALL STATUS') params.status = statusFilter;
      params.sort = sortBy;

      const res = await api.getDocuments(params);
      setDocuments(res.documents || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch ingestion history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [formatFilter, statusFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDocuments();
  };

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${filename}' and all its extracted data, analysis records, and Q&A history from the local database?`)) return;
    try {
      await api.deleteDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      alert(`Error deleting document: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* ─── Page Heading ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Document &amp; Ingestion History
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 ml-11">
            Review, analyze, query, or delete previously processed documents and their report archives.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all self-start md:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Format Filter */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs cursor-pointer"
          >
            <option value="ALL FORMATS">All Formats</option>
            <option value="PDF">PDF Documents</option>
            <option value="DOCX">DOCX Documents</option>
            <option value="TXT">TXT Documents</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs cursor-pointer"
          >
            <option value="ALL STATUS">All Statuses</option>
            <option value="PROCESSED">PROCESSED</option>
            <option value="ERROR">ERROR</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="words">Sort: Highest Word Count</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── 3-Column Document Cards Grid ─── */}
      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Retrieving ingestion records from SQLite...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">No documents found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No document records match your current search or filter criteria.
            </p>
          </div>
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload a Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => {
            const formatBadgeColors = {
              PDF: 'bg-rose-50 text-rose-700 border-rose-200',
              DOCX: 'bg-blue-50 text-blue-700 border-blue-200',
              TXT: 'bg-slate-100 text-slate-700 border-slate-200',
            };
            const formatColor = formatBadgeColors[doc.file_format] || 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <div
                key={doc.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                {/* Top Row: Format, Filename, Status */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border font-mono uppercase shrink-0 ${formatColor}`}>
                        {doc.file_format}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={doc.filename}>
                        {doc.filename}
                      </h3>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-1">
                    Uploaded: {doc.created_at}
                  </p>
                </div>

                {/* Middle Row: Metrics Inset */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Pages
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {doc.page_count}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Words
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {doc.word_count?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Size
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {doc.file_size_formatted}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => { onSelectDoc(doc.id); onNavigate('analysis'); }}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                    >
                      Analysis
                    </button>
                    <button
                      onClick={() => { onSelectDoc(doc.id); onNavigate('qa'); }}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Ask
                    </button>
                    <button
                      onClick={() => { onSelectDoc(doc.id); onNavigate('report-generator'); }}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                    >
                      Report
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(doc.id, doc.filename)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
