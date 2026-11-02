import uuid
import json
from datetime import datetime
from database import db

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    document_id = db.Column(db.String(36), db.ForeignKey('documents.id'), nullable=False)
    
    report_title = db.Column(db.String(255), nullable=False)
    author_name = db.Column(db.String(255), default='DocuIntellect Analyst')
    organization = db.Column(db.String(255), nullable=True)
    report_date = db.Column(db.String(50), nullable=True)
    
    archetype = db.Column(db.String(100), default='Executive Brief')
    granularity = db.Column(db.String(50), default='Standard (5 Sents)')
    
    inclusions = db.Column(db.Text, default='{}')  # JSON dict of boolean flags
    styling = db.Column(db.Text, default='{}')     # JSON dict of formatting preferences
    
    pdf_filename = db.Column(db.String(255), nullable=True)
    docx_filename = db.Column(db.String(255), nullable=True)
    json_filename = db.Column(db.String(255), nullable=True)
    
    report_data = db.Column(db.Text, nullable=True) # Full structured JSON content
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'document_filename': self.document.original_filename if self.document else '',
            'report_title': self.report_title,
            'author_name': self.author_name,
            'organization': self.organization,
            'report_date': self.report_date,
            'archetype': self.archetype,
            'granularity': self.granularity,
            'inclusions': json.loads(self.inclusions or '{}'),
            'styling': json.loads(self.styling or '{}'),
            'has_pdf': bool(self.pdf_filename),
            'has_docx': bool(self.docx_filename),
            'has_json': bool(self.json_filename),
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else ''
        }
