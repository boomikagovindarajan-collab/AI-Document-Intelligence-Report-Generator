import uuid
from datetime import datetime
from database import db

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_format = db.Column(db.String(10), nullable=False)  # PDF, DOCX, TXT
    file_size_bytes = db.Column(db.Integer, default=0)
    file_path = db.Column(db.String(512), nullable=False)
    word_count = db.Column(db.Integer, default=0)
    page_count = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='PROCESSED')  # PENDING, PROCESSING, PROCESSED, ERROR
    error_message = db.Column(db.Text, nullable=True)
    raw_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    analyses = db.relationship('Analysis', backref='document', cascade='all, delete-orphan', lazy=True)
    qa_interactions = db.relationship('QAInteraction', backref='document', cascade='all, delete-orphan', lazy=True)
    reports = db.relationship('Report', backref='document', cascade='all, delete-orphan', lazy=True)

    def to_dict(self, include_text=False):
        size_kb = round(self.file_size_bytes / 1024, 1) if self.file_size_bytes else 0
        data = {
            'id': self.id,
            'filename': self.original_filename or self.filename,
            'original_filename': self.original_filename,
            'file_format': self.file_format.upper(),
            'file_size_bytes': self.file_size_bytes,
            'file_size_formatted': f"{size_kb} KB" if size_kb < 1024 else f"{round(size_kb / 1024, 2)} MB",
            'word_count': self.word_count,
            'page_count': self.page_count,
            'status': self.status,
            'error_message': self.error_message,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else ''
        }
        if include_text:
            data['raw_text'] = self.raw_text
        return data
