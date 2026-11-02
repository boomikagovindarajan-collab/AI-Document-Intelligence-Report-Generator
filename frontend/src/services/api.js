const API_BASE = '/api';

export const api = {
  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
    return res.json();
  },

  // Documents
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/documents?${query}`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async getDocument(id, includeText = false) {
    const res = await fetch(`${API_BASE}/documents/${id}?include_text=${includeText}`);
    if (!res.ok) throw new Error('Failed to fetch document details');
    return res.json();
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload document');
    return data;
  },

  async pasteText(title, text) {
    const res = await fetch(`${API_BASE}/documents/paste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to process pasted text');
    return data;
  },

  async deleteDocument(id) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete document');
    return data;
  },

  // Analysis
  async getAnalysis(docId) {
    const res = await fetch(`${API_BASE}/analysis/${docId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch document analysis');
    return data;
  },

  async reanalyzeDocument(docId) {
    const res = await fetch(`${API_BASE}/analysis/${docId}/reanalyze`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reanalyze document');
    return data;
  },

  // Q&A
  async askQuestion(docId, question) {
    const res = await fetch(`${API_BASE}/qa/${docId}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to answer question');
    return data;
  },

  async getQAHistory(docId) {
    const res = await fetch(`${API_BASE}/qa/${docId}/history`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch conversation history');
    return data;
  },

  async clearQAHistory(docId) {
    const res = await fetch(`${API_BASE}/qa/${docId}/history`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to clear conversation');
    return data;
  },

  // Reports
  async generateReport(payload) {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate report');
    return data;
  },

  async getReports() {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async getReport(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch report');
    return data;
  },

  getDownloadUrl(reportId, format) {
    return `${API_BASE}/reports/${reportId}/download/${format}`;
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async saveSettings(payload) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save settings');
    return data;
  },

  async testConnection(provider, apiKey) {
    const res = await fetch(`${API_BASE}/settings/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, api_key: apiKey }),
    });
    return res.json();
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE}/settings/clear-history`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to clear history');
    return data;
  }
};
