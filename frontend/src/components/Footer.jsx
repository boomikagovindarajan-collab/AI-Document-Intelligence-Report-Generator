import React from 'react';
import { FileText, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-sm">DocuIntellect AI</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">v1.0.0</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md">
              AI Document Intelligence & Structured Report Generator. Engineered for automated digital text extraction, TextRank graph-based summarization, grounded Q&A verification, and synthesis of publication-ready PDF, Word, and JSON reports.
            </p>
            <div className="flex items-center space-x-4 pt-1 text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>TextRank Graph Centrality</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Grounded Citation Model</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Modules</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 transition-colors">System Dashboard</button></li>
              <li><button onClick={() => onNavigate('upload')} className="hover:text-indigo-600 transition-colors">Document Ingestion</button></li>
              <li><button onClick={() => onNavigate('analysis')} className="hover:text-indigo-600 transition-colors">NLP Intelligence</button></li>
              <li><button onClick={() => onNavigate('qa')} className="hover:text-indigo-600 transition-colors">Ask Your Document</button></li>
              <li><button onClick={() => onNavigate('report-generator')} className="hover:text-indigo-600 transition-colors">Report Generator</button></li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Capstone Project Team</h4>
            <div className="space-y-1.5 text-xs text-slate-700 mb-3">
              <p className="font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>BOOMIKA G</span>
              </p>
              <p className="font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>VIBUTHA P</span>
              </p>
            </div>
            <ul className="space-y-1 text-slate-500 text-[11px]">
              <li className="font-medium text-slate-700">KPR Institute of Engineering and Technology, Coimbatore</li>
              <li>Department of Information Technology</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-4">
          <p>© 2026 DocuIntellect AI. All rights reserved. Designed for Academic Demonstration.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Local Processing Ready</span>
            <span>•</span>
            <span>Zero Data Leakage Guarantee</span>
            <span>•</span>
            <span>Ground-Truth Evidentiary AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
