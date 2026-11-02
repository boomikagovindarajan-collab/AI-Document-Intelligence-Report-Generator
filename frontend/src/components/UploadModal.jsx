import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Clipboard } from 'lucide-react';
import { api } from '../services/api';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'paste'
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteText, setPasteText] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setError(null);
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setError(`Unsupported file format (.${ext}). Only PDF, Word (.docx), and Text (.txt) files are supported.`);
      return;
    }
    
    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25 MB maximum upload limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setProgress(30);

    try {
      setProgress(60);
      const res = await api.uploadDocument(selectedFile);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
        onUploadSuccess(res.document);
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || 'An error occurred during document processing.');
      setUploading(false);
    }
  };

  const handleProcessPaste = async () => {
    if (!pasteText.trim()) {
      setError('Please provide text to process.');
      return;
    }
    setUploading(true);
    setError(null);
    setProgress(50);

    try {
      const res = await api.pasteText(pasteTitle || 'Pasted_Document.txt', pasteText);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setPasteText('');
        setPasteTitle('');
        onUploadSuccess(res.document);
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to process pasted text.');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Document</h3>
              <p className="text-xs text-slate-500">Initiate automated extraction and NLP indexing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 pt-3 bg-slate-50/50">
          <button
            onClick={() => { setActiveTab('file'); setError(null); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'file'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File (PDF / DOCX / TXT)</span>
          </button>
          <button
            onClick={() => { setActiveTab('paste'); setError(null); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste Text Manually</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'file' ? (
            <div>
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]' 
                    : selectedFile 
                      ? 'border-indigo-300 bg-indigo-50/20' 
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                />

                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 flex items-center justify-center space-x-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>{selectedFile.name}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for processing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Drag and drop your document here
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports PDF, Word (.docx), and Plain Text (.txt) up to 25 MB
                    </p>
                    <div className="pt-3">
                      <span className="inline-flex px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs">
                        Browse Files on Device
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Extracting text & running NLP pipeline...</span>
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title / Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g., Experimental_Notes_Oct2026.txt"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Raw Text Content
                </label>
                <textarea
                  rows={7}
                  placeholder="Paste article, abstract, research notes, or meeting minutes here..."
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 resize-none font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Powered by TextRank Graph Centrality
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={activeTab === 'file' ? handleProcessFile : handleProcessPaste}
              disabled={uploading || (activeTab === 'file' ? !selectedFile : !pasteText.trim())}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Process Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
