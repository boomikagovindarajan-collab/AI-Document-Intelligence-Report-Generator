import os
from flask import Blueprint, jsonify, request, current_app
from database import db
from models.setting import SystemSetting
from models.document import Document
from models.report import Report
from models.qa import QAInteraction
from models.analysis import Analysis
from services.llm_service import LLMService

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

@settings_bp.route('', methods=['GET'])
def get_settings():
    settings = SystemSetting.query.all()
    s_map = {s.key: s.value for s in settings}
    return jsonify({
        'success': True,
        'settings': {
            'llm_provider': s_map.get('LLM_PROVIDER', current_app.config.get('LLM_PROVIDER', 'local')),
            'gemini_api_key_configured': bool(s_map.get('GEMINI_API_KEY') or current_app.config.get('GEMINI_API_KEY')),
            'openai_api_key_configured': bool(s_map.get('OPENAI_API_KEY') or current_app.config.get('OPENAI_API_KEY')),
            'theme': s_map.get('THEME', 'light'),
            'summary_default_granularity': s_map.get('DEFAULT_GRANULARITY', 'Standard (5 Sents)'),
            'max_upload_size_mb': 25
        }
    })

@settings_bp.route('', methods=['POST'])
def save_settings():
    data = request.get_json() or {}
    
    if 'llm_provider' in data:
        p_val = data['llm_provider']
        s = SystemSetting.query.filter_by(key='LLM_PROVIDER').first() or SystemSetting(key='LLM_PROVIDER')
        s.value = p_val
        db.session.add(s)

    if 'gemini_api_key' in data:
        g_val = data['gemini_api_key'].strip()
        if g_val:
            s = SystemSetting.query.filter_by(key='GEMINI_API_KEY').first() or SystemSetting(key='GEMINI_API_KEY')
            s.value = g_val
            db.session.add(s)

    if 'openai_api_key' in data:
        o_val = data['openai_api_key'].strip()
        if o_val:
            s = SystemSetting.query.filter_by(key='OPENAI_API_KEY').first() or SystemSetting(key='OPENAI_API_KEY')
            s.value = o_val
            db.session.add(s)

    if 'theme' in data:
        t_val = data['theme']
        s = SystemSetting.query.filter_by(key='THEME').first() or SystemSetting(key='THEME')
        s.value = t_val
        db.session.add(s)

    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Settings saved successfully.'
    })

@settings_bp.route('/test-connection', methods=['POST'])
def test_connection():
    data = request.get_json() or {}
    provider = data.get('provider', 'gemini')
    api_key = data.get('api_key')
    result = LLMService.test_connection(provider, api_key)
    return jsonify(result)

@settings_bp.route('/clear-history', methods=['POST'])
def clear_history():
    # Remove files from uploads and generated reports
    up_dir = current_app.config['UPLOAD_FOLDER']
    rep_dir = current_app.config['GENERATED_REPORTS_FOLDER']

    for d in Document.query.all():
        if os.path.exists(d.file_path):
            try:
                os.remove(d.file_path)
            except Exception:
                pass

    for r in Report.query.all():
        for f in [r.pdf_filename, r.docx_filename, r.json_filename]:
            if f:
                p = os.path.join(rep_dir, f)
                if os.path.exists(p):
                    try:
                        os.remove(p)
                    except Exception:
                        pass

    QAInteraction.query.delete()
    Analysis.query.delete()
    Report.query.delete()
    Document.query.delete()
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'All documents, analysis logs, questions, and reports cleared.'
    })
