import json
from flask import Blueprint, jsonify, request
from database import db
from models.document import Document
from models.analysis import Analysis
from services.nlp_engine import NLPEngine

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')

@analysis_bp.route('/<doc_id>', methods=['GET'])
def get_analysis(doc_id):
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404

    analysis = Analysis.query.filter_by(document_id=doc_id).first()
    if not analysis:
        # Generate on demand
        if not doc.raw_text:
            return jsonify({'success': False, 'error': 'Document has no text content to analyze.'}), 400

        data = NLPEngine.analyze_document(doc.raw_text)
        analysis = Analysis(
            document_id=doc.id,
            executive_summary=data['executive_summary'],
            document_summary=data['document_summary'],
            key_information=json.dumps(data['key_information']),
            keywords=json.dumps(data['keywords']),
            topics=json.dumps(data['topics']),
            named_entities=json.dumps(data['named_entities']),
            dates_and_numbers=json.dumps(data['dates_and_numbers']),
            main_findings=json.dumps(data['main_findings']),
            conclusions=json.dumps(data['conclusions']),
            methodology=data['methodology'],
            confidence_score=data['confidence_score']
        )
        db.session.add(analysis)
        db.session.commit()

    return jsonify({
        'success': True,
        'document': doc.to_dict(),
        'analysis': analysis.to_dict()
    })

@analysis_bp.route('/<doc_id>/reanalyze', methods=['POST'])
def reanalyze(doc_id):
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404

    if not doc.raw_text:
        return jsonify({'success': False, 'error': 'Document contains no readable text.'}), 400

    data = NLPEngine.analyze_document(doc.raw_text)
    analysis = Analysis.query.filter_by(document_id=doc_id).first()
    if not analysis:
        analysis = Analysis(document_id=doc.id)

    analysis.executive_summary = data['executive_summary']
    analysis.document_summary = data['document_summary']
    analysis.key_information = json.dumps(data['key_information'])
    analysis.keywords = json.dumps(data['keywords'])
    analysis.topics = json.dumps(data['topics'])
    analysis.named_entities = json.dumps(data['named_entities'])
    analysis.dates_and_numbers = json.dumps(data['dates_and_numbers'])
    analysis.main_findings = json.dumps(data['main_findings'])
    analysis.conclusions = json.dumps(data['conclusions'])
    analysis.methodology = data['methodology']
    analysis.confidence_score = data['confidence_score']

    db.session.add(analysis)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Analysis updated successfully.',
        'document': doc.to_dict(),
        'analysis': analysis.to_dict()
    })
