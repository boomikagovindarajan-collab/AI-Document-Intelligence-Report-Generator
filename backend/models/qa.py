import uuid
import json
from datetime import datetime
from database import db

class QAInteraction(db.Model):
    __tablename__ = 'qa_interactions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    document_id = db.Column(db.String(36), db.ForeignKey('documents.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    is_grounded = db.Column(db.Boolean, default=True)
    confidence = db.Column(db.Float, default=0.95)
    citations = db.Column(db.Text, default='[]')  # JSON list of {passage, page, score}
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'question': self.question,
            'answer': self.answer,
            'is_grounded': self.is_grounded,
            'confidence': self.confidence,
            'citations': json.loads(self.citations or '[]'),
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else ''
        }
