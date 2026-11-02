import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, 
  Send, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Trash2, 
  MessageSquare,
  Quote,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  FileText,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function QAPage({ selectedDocId, onSelectDoc }) {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(selectedDocId || '');
  const [activeDoc, setActiveDoc] = useState(null);
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState(null);

  const chatBottomRef = useRef(null);

  const suggestedQueries = [
    'What is the primary objective or main thesis of this document?',
    'What are the key statistical numbers, metrics, or quantitative results?',
    'What methodology, architecture, or techniques are described?',
    'Who are the main organizations or entities identified?',
    'What are the main findings and conclusions reached?'
  ];

  // Load documents list
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

  // Sync prop changes
  useEffect(() => {
    if (selectedDocId && selectedDocId !== activeDocId) {
      setActiveDocId(selectedDocId);
    }
  }, [selectedDocId]);

  // Load QA history for activeDocId
  useEffect(() => {
    if (!activeDocId) return;
    async function loadQA() {
      try {
        const res = await api.getQAHistory(activeDocId);
        setActiveDoc(res.document);
        setHistory(res.history || []);
      } catch (err) {
        console.error('Failed to load QA history:', err);
      }
    }
    loadQA();
  }, [activeDocId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, asking]);

  const handleAsk = async (queryToAsk) => {
    const q = queryToAsk || question;
    if (!q.trim() || !activeDocId || asking) return;

    setAsking(true);
    setError(null);
    const userQuery = q.trim();
    setQuestion('');

    try {
      const res = await api.askQuestion(activeDocId, userQuery);
      setHistory(prev => [...prev, res.interaction]);
    } catch (err) {
      setError(err.message || 'Failed to retrieve answer from document.');
    } finally {
      setAsking(false);
    }
  };

  const handleClear = async () => {
    if (!activeDocId) return;
    if (!window.confirm("Clear all Q&A conversation history for this document?")) return;
    try {
      await api.clearQAHistory(activeDocId);
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* ─── Top Header & Document Selector ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Ask Your Document (Grounded Q&amp;A)
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 ml-11">
            Answers are retrieved strictly from uploaded document passages with exact citation receipts.
          </p>
        </div>

        {/* Active Document Selector */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-600 shrink-0 pl-2">Target Document:</label>
          <select
            value={activeDocId}
            onChange={(e) => {
              setActiveDocId(e.target.value);
              if (onSelectDoc) onSelectDoc(e.target.value);
            }}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer max-w-[240px] truncate"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.filename}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Document Status & Grounding Banner ─── */}
      {activeDoc && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs text-slate-700">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold font-mono">
              {activeDoc.file_format || 'DOC'}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">{activeDoc.filename}</span>
              <div className="flex items-center space-x-2 text-slate-500 mt-0.5">
                <span>{activeDoc.page_count} page(s)</span>
                <span>&bull;</span>
                <span>{activeDoc.word_count?.toLocaleString()} words</span>
                <span>&bull;</span>
                <span className="text-emerald-700 font-medium">Ready for Grounded Retrieval</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Grounded Index Active</span>
            </span>
          </div>
        </div>
      )}

      {/* ─── Question Input Form ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask a question about this document (e.g., What are the key metrics or methodology?)..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={asking || !activeDocId}
              className="w-full text-xs sm:text-sm px-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={asking || !question.trim() || !activeDocId}
            className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
          >
            {asking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{asking ? 'Searching Document...' : 'Ask Document'}</span>
          </button>
        </form>

        {/* Suggested Queries Chips */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 pt-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Suggested Inquiries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(sq)}
                disabled={asking}
                className="text-left text-xs text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Conversation History / Q&A Exchange ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Verified Question &amp; Answer Exchange
            </h3>
            {history.length > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {history.length} question(s)
              </span>
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear exchange</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No questions asked yet for this document</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Type any question into the input above or click one of the suggested prompts to receive source-grounded answers with citations.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((item, idx) => {
              const isAbsent = !item.is_grounded || item.answer.includes('not found in the uploaded document');
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 transition-all">
                  
                  {/* User Question */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      Q
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">
                          {item.question}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.created_at}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grounded Answer Card */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isAbsent
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-gradient-to-br from-slate-50/90 to-indigo-50/30 border-slate-200/90 text-slate-800'
                  }`}>
                    {/* Status Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200/60">
                      <div className="flex items-center space-x-2">
                        {isAbsent ? (
                          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900">
                          {isAbsent ? 'Uncertainty Communicated (Absent from Source)' : 'Grounded Answer Verification'}
                        </span>
                      </div>
                      {!isAbsent && (
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Confidence: {item.confidence || 95}%
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            Source-Verified
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Answer Text */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium text-slate-800">
                      {item.answer}
                    </p>

                    {/* Verified Citation Receipts */}
                    {item.citations && item.citations.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2.5">
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          <Quote className="w-3.5 h-3.5" />
                          <span>Verified Citation Receipt ({item.citations.length} Passage{item.citations.length > 1 ? 's' : ''})</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5">
                          {item.citations.map((cit, cIdx) => (
                            <div key={cIdx} className="bg-white p-3.5 rounded-xl border border-indigo-100/90 text-xs text-slate-700 shadow-2xs space-y-1">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                  Page Reference: {cit.page}
                                </span>
                                <span className="text-emerald-700 font-semibold">
                                  Relevance Match: {cit.relevance_score ?? 95}%
                                </span>
                              </div>
                              <p className="italic text-slate-800 pt-1 leading-relaxed border-l-2 border-indigo-400 pl-2.5">
                                "{cit.passage}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

    </div>
  );
}
