import uuid
import json
from datetime import datetime
from database import db

class Analysis(db.Model):
    __tablename__ = 'analyses'

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    document_id = db.Column(db.String(36), db.ForeignKey('documents.id'), nullable=False)
    
    executive_summary = db.Column(db.Text, nullable=False)
    document_summary = db.Column(db.Text, nullable=False)
    
    # JSON-encoded structured extraction fields
    key_information = db.Column(db.Text, default='[]')
    keywords = db.Column(db.Text, default='[]')
    topics = db.Column(db.Text, default='[]')
    named_entities = db.Column(db.Text, default='{}')
    dates_and_numbers = db.Column(db.Text, default='[]')
    main_findings = db.Column(db.Text, default='[]')
    conclusions = db.Column(db.Text, default='[]')
    
    methodology = db.Column(db.String(255), default='Extractive TextRank + Semantic Heuristics')
    confidence_score = db.Column(db.Integer, default=95)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'executive_summary': self.executive_summary,
            'document_summary': self.document_summary,
            'key_information': json.loads(self.key_information or '[]'),
            'keywords': json.loads(self.keywords or '[]'),
            'topics': json.loads(self.topics or '[]'),
            'named_entities': json.loads(self.named_entities or '{}'),
            'dates_and_numbers': json.loads(self.dates_and_numbers or '[]'),
            'main_findings': json.loads(self.main_findings or '[]'),
            'conclusions': json.loads(self.conclusions or '[]'),
            'methodology': self.methodology,
            'confidence_score': self.confidence_score,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else ''
        }
