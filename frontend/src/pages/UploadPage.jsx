import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clipboard,
  FileCheck2,
  Sparkles,
  ArrowRight,
  X,
  File,
  Info
} from 'lucide-react';
import { api } from '../services/api';

const FormatCard = ({ ext, lib, color, bg, desc }) => (
  <div className={`p-4 rounded-xl border ${bg} flex items-start space-x-3`}>
    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${color} font-mono shrink-0`}>
      .{ext}
    </span>
    <div>
      <p className="text-xs font-bold text-slate-800">{lib}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

export default function UploadPage({ onNavigate, onSelectDoc }) {
  const [activeTab, setActiveTab] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteText, setPasteText] = useState('');

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState(null);
  const [successDoc, setSuccessDoc] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = (file) => {
    setError(null);
    setSuccessDoc(null);
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError(`Unsupported format (.${ext}). Please upload PDF, DOCX, or TXT files only.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds the 25 MB size limit. Please upload a smaller file.');
      return;
    }
    setSelectedFile(file);
  };

  const simulateProgress = async (setP, setLabel) => {
    const steps = [
      [20, 'Validating file format...'],
      [45, 'Extracting text content...'],
      [70, 'Running NLP analysis...'],
      [90, 'Building entity index...'],
      [100, 'Complete!'],
    ];
    for (const [val, label] of steps) {
      await new Promise(r => setTimeout(r, 300));
      setP(val);
      setLabel(label);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setError(null);
    setProgress(0);

    const progressPromise = simulateProgress(setProgress, setProgressLabel);
    try {
      const res = await api.uploadDocument(selectedFile);
      await progressPromise;
      setSuccessDoc(res.document);
      setSelectedFile(null);
      if (onSelectDoc) onSelectDoc(res.document.id);
    } catch (err) {
      setError(err.message || 'Error processing document. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessPaste = async () => {
    if (!pasteText.trim()) {
      setError('Please enter document text before processing.');
      return;
    }
    setProcessing(true);
    setError(null);
    setProgress(0);

    const progressPromise = simulateProgress(setProgress, setProgressLabel);
    try {
      const res = await api.pasteText(pasteTitle || 'Pasted_Document.txt', pasteText);
      await progressPromise;
      setSuccessDoc(res.document);
      setPasteText('');
      setPasteTitle('');
      if (onSelectDoc) onSelectDoc(res.document.id);
    } catch (err) {
      setError(err.message || 'Error processing pasted text.');
    } finally {
      setProcessing(false);
    }
  };

  const getFileIcon = (ext) => {
    if (ext === 'pdf') return '📄';
    if (ext === 'docx') return '📝';
    return '📃';
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ─── Page Header ─── */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Document Ingestion & Analysis
            </h1>
          </div>
        </div>
        <p className="text-sm text-slate-500 ml-12">
          Upload PDF, DOCX, or TXT files to begin automated text extraction, NLP summarisation, and entity indexing.
        </p>
      </div>

      {/* ─── Format Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormatCard
          ext="PDF"
          lib="PyMuPDF Parser"
          color="bg-rose-100 text-rose-700"
          bg="bg-rose-50/50 border-rose-100"
          desc="Full text extraction from native digital PDFs with page & metadata support"
        />
        <FormatCard
          ext="DOCX"
          lib="python-docx Parser"
          color="bg-blue-100 text-blue-700"
          bg="bg-blue-50/50 border-blue-100"
          desc="Paragraph, table, and heading extraction from Microsoft Word documents"
        />
        <FormatCard
          ext="TXT"
          lib="UTF-8 File Handler"
          color="bg-slate-100 text-slate-700"
          bg="bg-slate-50/50 border-slate-100"
          desc="Clean plain text ingestion with automatic encoding detection"
        />
      </div>

      {/* ─── Tab Switcher ─── */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl">
        {[
          { id: 'file', label: 'Upload File', icon: UploadCloud, sub: 'PDF / DOCX / TXT' },
          { id: 'paste', label: 'Paste Text', icon: Clipboard, sub: 'Raw text input' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(null); setSuccessDoc(null); }}
              className={`flex-1 sm:flex-initial flex items-center space-x-2 pb-3 pt-3 px-6 text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">— {tab.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Error Banner ─── */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError(null)} className="shrink-0">
            <X className="w-3.5 h-3.5 text-rose-400 hover:text-rose-600" />
          </button>
        </div>
      )}

      {/* ─── Main Upload Area ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 space-y-6">

        {activeTab === 'file' ? (
          <div className="space-y-6">
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !processing && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl py-16 px-6 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01] shadow-lg'
                  : selectedFile
                    ? 'border-indigo-400 bg-indigo-50/30'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="text-4xl">{getFileIcon(selectedFile.name.split('.').pop().toLowerCase())}</div>
                  <div className="inline-flex items-center space-x-2 text-sm font-bold text-slate-900 bg-white px-5 py-2 rounded-full border border-indigo-200 shadow-sm">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Ready for extraction
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto shadow-inner">
                    <UploadCloud className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {dragActive ? 'Drop your document here' : 'Drag & drop your document'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, Word (.docx), and Plain Text (.txt) up to 25 MB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all pointer-events-none"
                  >
                    Browse Files on Device
                  </button>
                </div>
              )}
            </div>

            {/* File Actions */}
            {selectedFile && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setSelectedFile(null); setError(null); }}
                  disabled={processing}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove file</span>
                </button>
                <button
                  onClick={handleProcessFile}
                  disabled={processing}
                  className="flex items-center space-x-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-60 transition-all"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{processing ? 'Processing...' : 'Process Document'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ─── Paste Tab ─── */
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Document Title / Identifier
              </label>
              <input
                type="text"
                placeholder="e.g., Research_Notes_Oct2026.txt"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Document Text Content
              </label>
              <textarea
                rows={10}
                placeholder="Enter or paste your document text here — articles, research papers, meeting notes, reports, or any text content..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="w-full text-sm p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 resize-y font-mono transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">{pasteText.length} characters · {pasteText.trim().split(/\s+/).filter(Boolean).length} words</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleProcessPaste}
                disabled={processing || !pasteText.trim()}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{processing ? 'Processing...' : 'Process Pasted Text'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Progress Bar ─── */}
        {processing && (
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span className="flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>{progressLabel || 'Processing document...'}</span>
              </span>
              <span className="font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-full transition-all duration-500 bg-[length:200%] animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Validation → Extraction → Analysis → Indexing</span>
              <span>{progress < 100 ? 'In progress...' : 'Complete!'}</span>
            </div>
          </div>
        )}

        {/* ─── Success Card ─── */}
        {successDoc && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Document Ingested & Analysed Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    <strong>{successDoc.filename}</strong> · {successDoc.word_count} words · {successDoc.page_count} page(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => { onSelectDoc(successDoc.id); onNavigate('analysis'); }}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <span>View Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { onSelectDoc(successDoc.id); onNavigate('qa'); }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300 text-xs font-bold shadow-sm transition-colors"
                >
                  Ask Questions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Info Note ─── */}
      <div className="flex items-start space-x-2.5 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-700">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
        <div>
          <span className="font-bold">Note: </span>
          Only digitally-created PDF files with embedded text are supported. Scanned image-based PDFs without OCR preprocessing cannot be extracted. For best results, ensure your PDF contains selectable text.
        </div>
      </div>
    </div>
  );
}
