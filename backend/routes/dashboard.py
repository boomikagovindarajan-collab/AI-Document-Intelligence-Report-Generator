from flask import Blueprint, jsonify
from database import db
from models.document import Document
from models.report import Report
from models.qa import QAInteraction

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/stats', methods=['GET'])
def get_stats():
    # 1. Total Documents
    total_docs = Document.query.count()

    # 2. Reports Synthesized
    total_reports = Report.query.count()

    # 3. Questions Answered
    total_qa = QAInteraction.query.count()

    # 4. Words Processed
    docs = Document.query.all()
    total_words = sum(d.word_count for d in docs if d.word_count)

    # Format Breakdown
    pdf_count = Document.query.filter_by(file_format='PDF').count()
    docx_count = Document.query.filter_by(file_format='DOCX').count()
    txt_count = Document.query.filter_by(file_format='TXT').count()

    total_counted = pdf_count + docx_count + txt_count
    pdf_pct = round((pdf_count / total_counted * 100)) if total_counted > 0 else 0
    docx_pct = round((docx_count / total_counted * 100)) if total_counted > 0 else 0
    txt_pct = round((txt_count / total_counted * 100)) if total_counted > 0 else 0

    # Recent Documents (up to 5)
    recent_docs = Document.query.order_by(Document.created_at.desc()).limit(5).all()

    # Recent Reports (up to 5)
    recent_reports = Report.query.order_by(Report.created_at.desc()).limit(5).all()

    return jsonify({
        'success': True,
        'metrics': {
            'total_documents': total_docs,
            'reports_synthesized': total_reports,
            'questions_answered': total_qa,
            'words_processed': total_words,
            'words_processed_formatted': f"{total_words:,}"
        },
        'format_breakdown': {
            'pdf': {'count': pdf_count, 'percentage': pdf_pct},
            'docx': {'count': docx_count, 'percentage': docx_pct},
            'txt': {'count': txt_count, 'percentage': txt_pct}
        },
        'recent_documents': [d.to_dict() for d in recent_docs],
        'recent_reports': [r.to_dict() for r in recent_reports],
        'system_status': {
            'api_status': 'Online',
            'database': 'SQLite Connected',
            'nlp_engine': 'Extractive TextRank Graph Centrality (Operational)'
        }
    })
