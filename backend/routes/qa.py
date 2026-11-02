import json
from flask import Blueprint, jsonify, request
from database import db
from models.document import Document
from models.qa import QAInteraction
from services.qa_engine import QAEngine
from services.llm_service import LLMService

qa_bp = Blueprint('qa', __name__, url_prefix='/api/qa')

@qa_bp.route('/<doc_id>/ask', methods=['POST'])
def ask_question(doc_id):
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404

    data = request.get_json() or {}
    question = data.get('question', '').strip()

    if not question:
        return jsonify({'success': False, 'error': 'No question provided.'}), 400

    if not doc.raw_text:
        return jsonify({
            'success': True,
            'interaction': {
                'question': question,
                'answer': 'The requested information was not found in the uploaded document.',
                'is_grounded': False,
                'confidence': 0.0,
                'citations': []
            }
        })

    # Prepare page breakdown if PDF/DOCX
    from parsers import extract_document_text
    pages_data = []
    try:
        ext = doc.file_format.lower()
        res = extract_document_text(doc.file_path, ext)
        pages_data = res.get('pages', [])
    except Exception:
        pass

    # Run grounded QA engine
    qa_result = QAEngine.answer_question(question, pages_data, doc.raw_text)

    # Optional: check if user configured external LLM for grounded enhancement
    provider = LLMService.get_api_key('gemini')
    if provider and qa_result.get('is_grounded'):
        try:
            llm_ans = LLMService.ask_llm_grounded(question, doc.raw_text, 'gemini')
            if llm_ans:
                qa_result['answer'] = llm_ans
        except Exception:
            pass

    # Persist interaction in SQLite
    interaction = QAInteraction(
        document_id=doc.id,
        question=question,
        answer=qa_result['answer'],
        is_grounded=qa_result['is_grounded'],
        confidence=qa_result['confidence'],
        citations=json.dumps(qa_result['citations'])
    )
    db.session.add(interaction)
    db.session.commit()

    return jsonify({
        'success': True,
        'interaction': interaction.to_dict()
    })

@qa_bp.route('/<doc_id>/history', methods=['GET'])
def get_qa_history(doc_id):
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404

    interactions = QAInteraction.query.filter_by(document_id=doc_id).order_by(QAInteraction.created_at.asc()).all()
    return jsonify({
        'success': True,
        'document': doc.to_dict(),
        'history': [i.to_dict() for i in interactions]
    })

@qa_bp.route('/<doc_id>/history', methods=['DELETE'])
def clear_qa_history(doc_id):
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404

    QAInteraction.query.filter_by(document_id=doc_id).delete()
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Conversation history cleared successfully.'
    })
