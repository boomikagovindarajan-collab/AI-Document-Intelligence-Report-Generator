import os
import json
from flask import Blueprint, jsonify, request, send_file, current_app
from database import db
from models.document import Document
from models.analysis import Analysis
from models.report import Report
from services.report_service import ReportService
from services.nlp_engine import NLPEngine

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('', methods=['GET'])
def list_reports():
    reports = Report.query.order_by(Report.created_at.desc()).all()
    return jsonify({
        'success': True,
        'count': len(reports),
        'reports': [r.to_dict() for r in reports]
    })

@reports_bp.route('/<report_id>', methods=['GET'])
def get_report(report_id):
    report = db.session.get(Report, report_id)
    if not report:
        return jsonify({'success': False, 'error': 'Report not found'}), 404
    data = report.to_dict()
    if report.report_data:
        data['full_content'] = json.loads(report.report_data)
    return jsonify({
        'success': True,
        'report': data
    })

@reports_bp.route('/generate', methods=['POST'])
def generate_report():
    data = request.get_json() or {}
    document_id = data.get('document_id')

    if not document_id:
        return jsonify({'success': False, 'error': 'No target document selected.'}), 400

    doc = db.session.get(Document, document_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Selected document not found.'}), 404

    # Ensure document has analysis
    analysis = Analysis.query.filter_by(document_id=doc.id).first()
    if not analysis:
        # Run analysis first
        analysis_data = NLPEngine.analyze_document(doc.raw_text)
        analysis = Analysis(
            document_id=doc.id,
            executive_summary=analysis_data['executive_summary'],
            document_summary=analysis_data['document_summary'],
            key_information=json.dumps(analysis_data['key_information']),
            keywords=json.dumps(analysis_data['keywords']),
            topics=json.dumps(analysis_data['topics']),
            named_entities=json.dumps(analysis_data['named_entities']),
            dates_and_numbers=json.dumps(analysis_data['dates_and_numbers']),
            main_findings=json.dumps(analysis_data['main_findings']),
            conclusions=json.dumps(analysis_data['conclusions']),
            methodology=analysis_data['methodology'],
            confidence_score=analysis_data['confidence_score']
        )
        db.session.add(analysis)
        db.session.commit()

    analysis_dict = analysis.to_dict()

    # Build report using ReportService
    output_dir = current_app.config['GENERATED_REPORTS_FOLDER']
    result = ReportService.generate_all_formats(doc, analysis_dict, data, output_dir)

    new_report = Report(
        document_id=doc.id,
        report_title=data.get('report_title') or f"Analysis Report — {doc.original_filename}",
        author_name=data.get('author_name', 'DocuIntellect Analyst'),
        organization=data.get('organization', 'DocuIntellect Intelligence Unit'),
        report_date=data.get('report_date', ''),
        archetype=data.get('archetype', 'Executive Brief'),
        granularity=data.get('granularity', 'Standard (5 Sents)'),
        inclusions=json.dumps(data.get('inclusions', {})),
        styling=json.dumps(data.get('styling', {})),
        pdf_filename=result['pdf_filename'],
        docx_filename=result['docx_filename'],
        json_filename=result['json_filename'],
        report_data=json.dumps(result['report_payload'])
    )
    db.session.add(new_report)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Report synthesized successfully.',
        'report': new_report.to_dict()
    }), 201

@reports_bp.route('/<report_id>/download/<file_format>', methods=['GET'])
def download_report(report_id, file_format):
    report = db.session.get(Report, report_id)
    if not report:
        return jsonify({'success': False, 'error': 'Report not found'}), 404

    fmt = file_format.lower().lstrip('.')
    filename = None
    mimetype = None

    if fmt == 'pdf':
        filename = report.pdf_filename
        mimetype = 'application/pdf'
    elif fmt in ['docx', 'doc']:
        filename = report.docx_filename
        mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    elif fmt == 'json':
        filename = report.json_filename
        mimetype = 'application/json'
    else:
        return jsonify({'success': False, 'error': f"Unsupported format: {file_format}"}), 400

    if not filename:
        return jsonify({'success': False, 'error': f"Report artifact in {file_format.upper()} format is unavailable."}), 404

    file_path = os.path.join(current_app.config['GENERATED_REPORTS_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({'success': False, 'error': 'Report file does not exist on disk.'}), 404

    return send_file(
        file_path,
        mimetype=mimetype,
        as_attachment=True,
        download_name=filename
    )
