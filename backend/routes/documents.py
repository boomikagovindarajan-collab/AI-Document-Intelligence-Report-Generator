import os
import uuid
import json
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from database import db
from models.document import Document
from models.analysis import Analysis
from parsers import extract_document_text
from services.nlp_engine import NLPEngine

documents_bp = Blueprint('documents', __name__, url_prefix='/api/documents')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@documents_bp.route('', methods=['GET'])
def get_documents():
    search = request.args.get('search', '').strip().lower()
    file_format = request.args.get('format', '').strip().upper()
    status = request.args.get('status', '').strip().upper()
    sort_by = request.args.get('sort', 'newest')

    query = Document.query

    if file_format and file_format != 'ALL FORMATS' and file_format != 'ALL':
        query = query.filter(Document.file_format == file_format.replace('.', ''))

    if status and status != 'ALL STATUS' and status != 'ALL':
        query = query.filter(Document.status == status)

    if search:
        query = query.filter(
            (Document.original_filename.ilike(f'%{search}%')) |
            (Document.filename.ilike(f'%{search}%'))
        )

    if sort_by == 'oldest':
        query = query.order_by(Document.created_at.asc())
    elif sort_by == 'words':
        query = query.order_by(Document.word_count.desc())
    else: # newest
        query = query.order_by(Document.created_at.desc())

    docs = query.all()
    return jsonify({
        'success': True,
        'count': len(docs),
        'documents': [d.to_dict() for d in docs]
    })

@documents_bp.route('/<doc_id>', methods=['GET'])
def get_document(doc_id):
    include_text = request.args.get('include_text', 'false').lower() == 'true'
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404
    return jsonify({
        'success': True,
        'document': doc.to_dict(include_text=include_text)
    })

@documents_bp.route('/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part provided in request.'}), 400

    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected for upload.'}), 400

    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': f"Unsupported file format. Only PDF (.pdf), Word (.docx), and Text (.txt) files are supported."
        }), 400

    orig_name = secure_filename(file.filename) or file.filename
    ext = orig_name.rsplit('.', 1)[1].lower()
    doc_id = uuid.uuid4().hex
    saved_name = f"{doc_id}.{ext}"
    saved_path = os.path.join(current_app.config['UPLOAD_FOLDER'], saved_name)

    try:
        file.save(saved_path)
        file_size = os.path.getsize(saved_path)
    except Exception as e:
        return jsonify({'success': False, 'error': f"Failed to save file to server storage: {str(e)}"}), 500

    # Extract text using corresponding parser
    try:
        extracted = extract_document_text(saved_path, ext)
    except Exception as e:
        # Remove bad file
        if os.path.exists(saved_path):
            os.remove(saved_path)
        return jsonify({'success': False, 'error': str(e)}), 422

    # Save to database
    new_doc = Document(
        id=doc_id,
        filename=saved_name,
        original_filename=file.filename,
        file_format=ext.upper(),
        file_size_bytes=file_size,
        file_path=saved_path,
        word_count=extracted.get('word_count', 0),
        page_count=extracted.get('page_count', 1),
        status='PROCESSED',
        raw_text=extracted.get('raw_text', '')
    )
    db.session.add(new_doc)
    db.session.commit()

    # Automatically run NLP analysis
    try:
        analysis_data = NLPEngine.analyze_document(new_doc.raw_text)
        new_analysis = Analysis(
            document_id=new_doc.id,
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
        db.session.add(new_analysis)
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Auto-analysis failed: {str(e)}")

    return jsonify({
        'success': True,
        'message': 'Document uploaded and analyzed successfully.',
        'document': new_doc.to_dict()
    }), 201

@documents_bp.route('/paste', methods=['POST'])
def paste_text():
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    title = data.get('title', '').strip() or 'Pasted_Text_Document.txt'

    if not text:
        return jsonify({'success': False, 'error': 'No text provided.'}), 400

    doc_id = uuid.uuid4().hex
    saved_name = f"{doc_id}.txt"
    saved_path = os.path.join(current_app.config['UPLOAD_FOLDER'], saved_name)

    with open(saved_path, 'w', encoding='utf-8') as f:
        f.write(text)

    try:
        extracted = extract_document_text(saved_path, 'txt')
    except Exception as e:
        if os.path.exists(saved_path):
            os.remove(saved_path)
        return jsonify({'success': False, 'error': str(e)}), 422

    new_doc = Document(
        id=doc_id,
        filename=saved_name,
        original_filename=title if title.endswith('.txt') else f"{title}.txt",
        file_format='TXT',
        file_size_bytes=len(text.encode('utf-8')),
        file_path=saved_path,
        word_count=extracted.get('word_count', 0),
        page_count=extracted.get('page_count', 1),
        status='PROCESSED',
        raw_text=text
    )
    db.session.add(new_doc)
    db.session.commit()

    # Automatically run NLP analysis
    try:
        analysis_data = NLPEngine.analyze_document(text)
        new_analysis = Analysis(
            document_id=new_doc.id,
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
        db.session.add(new_analysis)
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Auto-analysis failed: {str(e)}")

    return jsonify({
        'success': True,
        'message': 'Text ingested and analyzed successfully.',
        'document': new_doc.to_dict()
    }), 201

@documents_bp.route('/<doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    doc = db.session.get(Document, doc_id)
    if not doc:
        return jsonify({'success': False, 'error': 'Document not found'}), 404

    # Delete physical file
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.session.delete(doc)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f"Document '{doc.original_filename}' and associated analyses deleted."
    })
