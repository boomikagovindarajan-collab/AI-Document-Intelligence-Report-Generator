import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-only-change-this-secret'
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'docuintellect.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    GENERATED_REPORTS_FOLDER = os.path.join(BASE_DIR, 'generated_reports')
    SAMPLES_FOLDER = os.path.join(BASE_DIR, 'samples')
    
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024  # 25 MB limit
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
    
    # LLM Settings
    LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'local')  # 'local', 'gemini', 'openai'
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
