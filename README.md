# DocuIntellect AI — AI Document Intelligence & Report Generator

> **Project Team Members:**  
> • **BOOMIKA G**  
> • **VIBUTHA P**  
> **Department:** Department of Information Technology  
> **Institution:** KPR Institute of Engineering and Technology, Coimbatore  

---

## 📖 Overview

**DocuIntellect AI** is an end-to-end, full-stack document intelligence and automated report generation platform. It transforms unstructured documents (**PDF**, **Word .docx**, and **Plain Text .txt**) into structured, actionable intelligence.

The application follows the design, color palette, navigation hierarchy, component arrangement, and layout showcased in **Chapter 6 (pages 17–20)** of the project report:
- **Branding**: `DocuIntellect AI` (*Document Intelligence & Reporting*)
- **Theme**: Crisp SaaS aesthetic with white/slate backgrounds (`#f8fafc`), deep navy headers (`#0f172a`), purple/blue gradient highlights (`from-indigo-600 to-purple-600`), and rounded cards.
- **Intelligence**: Built-in **TextRank sentence graph centrality** algorithm, multi-class named entity recognition (NER), and grounded question answering with exact citations.
- **Reporting**: ReportLab Platypus PDF generator, Word (.docx) builder, and machine-readable JSON exports.

---

## 🖼️ Chapter 6 Screenshot Reproduction Register

| Report Section | Page | Implemented View | Key Elements |
|---|---|---|---|
| **6.1 Homepage** | 17 | `HomePage.jsx` | Hero banner with *"Full-Stack B.Tech Major Engineering Capstone Project"* pill, dark navy & purple headline, pipeline feature cards, workflow roadmap. |
| **6.2 Dashboard** | 17 | `DashboardPage.jsx` | 4 metric cards (*Total Documents*, *Reports Synthesized*, *Questions Answered*, *Words Processed*), format breakdown bars (.PDF, .DOCX, .TXT), dark hero CTA card (*"Automate Your Document Analysis"*), recent activity logs. |
| **6.3 & 6.8 Upload** | 18, 20 | `UploadPage.jsx` & `UploadModal.jsx` | Drag-and-drop zone with 25MB validation for PDF/DOCX/TXT, manual paste tab, upload progress bar, and instant document processing. |
| **6.4 Analysis** | 18 | `AnalysisPage.jsx` | Document selector, document metadata card, 4 metric cards (*Word Count*, *Pages*, *Methodology: Extractive TextRank + Semantic Heuristics*, *Confidence: 95%*), Executive Summary card, structured analysis tabs. |
| **6.5 Ask Document** | 19 | `QAPage.jsx` | Grounded Q&A interface, suggested query chips, verifiable passage citations with page references, explicit uncertainty fallback when facts are missing. |
| **6.6 Report Generator** | 19 | `ReportGenPage.jsx` | Target document selector, 6 analytical archetypes (*Executive Brief*, *Technical Synthesis*, etc.), 3 summary granularity tiers, content inclusion checkboxes, typography settings, multi-format export. |
| **6.7 History** | 20 | `HistoryPage.jsx` | 3-column document cards with format badges, word/page metrics, search bar, format & status filters, sort options, and quick action buttons. |
| **Settings** | - | `SettingsPage.jsx` | AI Provider selection (*Local NLP*, *Google Gemini*, *OpenAI*), API key validation test, storage management, and database reset. |

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React icons, Vite build tool.
- **Backend**: Python Flask 3.1, Flask-CORS, SQLAlchemy, SQLite 3.
- **Document Parsers**:
  - `PyMuPDF` (`pymupdf`/`fitz`) for high-fidelity PDF extraction and page mapping.
  - `python-docx` for structured Word document parsing.
  - Custom UTF-8 / multi-encoding plain text parser.
- **AI / NLP Engine**:
  - **Local NLP Pipeline (Default & 100% Offline)**: Mihalcea & Tarau TextRank graph centrality via PageRank iteration ($d=0.85$), TF-IDF keyword ranking, and multi-class regex/heuristic NER.
  - **Configurable LLM API**: Google Gemini 1.5 Flash and OpenAI GPT-4o-mini client with strict evidentiary grounding instructions.
- **Report Generation**:
  - `ReportLab Platypus` engine for multi-page styled PDFs with running headers, footers, and dynamic page numbering (`NumberedCanvas`).
  - `python-docx` for structured Word documents.
  - Structured JSON export for downstream API ingestion.

---

## 🚀 Installation & Running Locally

### Prerequisites
1. **Python 3.10+** (tested and verified with Python 3.14)
2. **Node.js v18+ & npm** (included and configured in your environment)

---

### Step 1: Open the Project Directory
```powershell
cd C:\Users\boomi\.gemini\antigravity\scratch\ai-document-intelligence
```

---

### Step 2: Install Dependencies (if not already installed)

**Python Backend Dependencies:**
```powershell
python -m pip install -r backend/requirements.txt
```

**Frontend Dependencies:**
```powershell
cd frontend
npm install
cd ..
```

---

### Step 3: Launch the Application

You can run the application using either of the following two options:

#### Option A: All-in-One Full Stack Server (Recommended)
Runs Flask which directly serves the production React frontend and all API routes:
```powershell
python run.py
```
Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

#### Option B: Vite Dev Server (Matches Screenshot Port `127.0.0.1:5173`)
1. In Terminal 1, start the Python API server:
   ```powershell
   python run.py
   ```
2. In Terminal 2, start the Vite frontend development server:
   ```powershell
   cd frontend
   npm run dev
   ```
Open your browser and navigate to:
👉 **`http://127.0.0.1:5173`**

---

## ⚙️ Configuration & Environment Variables

The application functions **100% offline** out-of-the-box using its built-in Local NLP TextRank engine. 

To optionally connect an external LLM:
1. Open the web application and navigate to the **Settings** tab.
2. Select **Google Gemini API** or **OpenAI API**.
3. Paste your API key and click **Test Key** to verify connectivity.
4. Click **Save Preferences**.

Alternatively, you can set environment variables before running:
```powershell
$env:GEMINI_API_KEY = "your-gemini-api-key"
$env:OPENAI_API_KEY = "your-openai-api-key"
$env:LLM_PROVIDER = "gemini" # or "local"
```

---

## 🧪 Verification & Demonstration Procedure

1. **Dashboard Check**:
   - Navigate to `Dashboard`. Note the 4 live metric cards and format breakdown bars derived from actual SQLite data.
2. **Document Analysis**:
   - Open `Analysis` tab. The sample document `uav_navigation_research.pdf` is pre-seeded with 202 words, 95% confidence, Executive Summary, and extracted entities.
3. **Grounded Q&A Verification**:
   - Open `Ask Doc`.
   - Ask a question present in the document: *"What are the simulation hours in Isaac Sim?"*  
     👉 **Result**: Returns exact 50,000 hours with citation receipt and page reference.
   - Ask an unsupported question: *"What is the stock price of Apple?"*  
     👉 **Result**: Explicitly returns *"The requested information was not found in the uploaded document."* without hallucination.
4. **Report Generation & Download**:
   - Open `Report Gen`. Select archetype (*Executive Brief*), summary granularity (*Standard (5 Sents)*), and click **Generate Report**.
   - Download the generated **PDF**, **DOCX**, and **JSON** files.
5. **Upload Ingestion**:
   - Drag and drop or browse any new `.pdf`, `.docx`, or `.txt` file up to 25MB. Watch the progress bar extract text and update the SQLite database.
