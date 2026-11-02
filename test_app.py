import sys
import os
import unittest
import json

# Ensure backend path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

from app import create_app
from database import db
from models.document import Document
from models.analysis import Analysis
from models.qa import QAInteraction
from models.report import Report

class TestDocuIntellectAI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_tc01_api_health(self):
        """TC01: Verify API health endpoint"""
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['api'], 'online')

    def test_tc02_dashboard_metrics(self):
        """TC02: Verify dynamic SQLite-driven dashboard stats"""
        res = self.client.get('/api/dashboard/stats')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertIn('metrics', data)
        self.assertIn('format_breakdown', data)
        self.assertGreaterEqual(data['metrics']['total_documents'], 1)

    def test_tc03_document_list(self):
        """TC03: List ingested documents"""
        res = self.client.get('/api/documents')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertTrue(data['success'])
        self.assertGreaterEqual(data['count'], 1)

    def test_tc04_uav_document_analysis(self):
        """TC04: Verify analysis of reference UAV research document"""
        uav_id = '4141bf8812b148c78cd2fab616730a22'
        res = self.client.get(f'/api/analysis/{uav_id}')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertTrue(data['success'])
        analysis = data['analysis']
        self.assertEqual(analysis['confidence_score'], 95)
        self.assertIn('TextRank', analysis['methodology'])
        self.assertIn('PPO', analysis['executive_summary'])

    def test_tc05_grounded_qa_present_answer(self):
        """TC05: Question answered in the document returns exact citation and page receipt"""
        uav_id = '4141bf8812b148c78cd2fab616730a22'
        res = self.client.post(f'/api/qa/{uav_id}/ask', json={
            'question': 'What are the simulation hours in NVIDIA Isaac Sim?'
        })
        self.assertEqual(res.status_code, 200)
        interaction = res.json['interaction']
        self.assertTrue(interaction['is_grounded'])
        self.assertIn('50,000', interaction['answer'])
        self.assertGreaterEqual(len(interaction['citations']), 1)

    def test_tc06_grounded_qa_absent_answer(self):
        """TC06: Question not answered in document communicates uncertainty without hallucination"""
        uav_id = '4141bf8812b148c78cd2fab616730a22'
        res = self.client.post(f'/api/qa/{uav_id}/ask', json={
            'question': 'What is the stock market valuation of Microsoft in 2030?'
        })
        self.assertEqual(res.status_code, 200)
        interaction = res.json['interaction']
        self.assertFalse(interaction['is_grounded'])
        self.assertEqual(interaction['answer'], 'The requested information was not found in the uploaded document.')

    def test_tc07_report_generation_and_downloads(self):
        """TC07: Structured report synthesis & export to PDF, DOCX, and JSON"""
        uav_id = '4141bf8812b148c78cd2fab616730a22'
        rep_payload = {
            'document_id': uav_id,
            'report_title': 'Unit Test Report — Autonomous UAV Navigation',
            'author_name': 'Automated Test Harness',
            'archetype': 'Technical Synthesis',
            'granularity': 'Standard (5 Sents)',
            'inclusions': {
                'executive_summary': True,
                'key_findings': True,
                'entities': True,
                'methodology': True
            }
        }
        gen_res = self.client.post('/api/reports/generate', json=rep_payload)
        self.assertEqual(gen_res.status_code, 201)
        report = gen_res.json['report']
        rep_id = report['id']

        # Download PDF
        pdf_res = self.client.get(f'/api/reports/{rep_id}/download/pdf')
        self.assertEqual(pdf_res.status_code, 200)
        self.assertTrue(pdf_res.data.startswith(b'%PDF'))

        # Download DOCX
        docx_res = self.client.get(f'/api/reports/{rep_id}/download/docx')
        self.assertEqual(docx_res.status_code, 200)
        self.assertTrue(docx_res.data.startswith(b'PK')) # standard zip/docx header

        # Download JSON
        json_res = self.client.get(f'/api/reports/{rep_id}/download/json')
        self.assertEqual(json_res.status_code, 200)
        payload_data = json.loads(json_res.data.decode('utf-8'))
        self.assertIn('metadata', payload_data)
        self.assertIn('sections', payload_data)

    def test_tc08_pasted_text_ingestion(self):
        """TC08: Ingestion and analysis of pasted text"""
        pasted_text = (
            "Edge Computing Latency Optimization for Distributed IoT Gateways. "
            "Evaluated across 500 edge nodes with average packet drop reduced by 42.1%. "
            "In conclusion, the proposed lightweight protocol ensures reliable edge synchronization."
        )
        res = self.client.post('/api/documents/paste', json={
            'title': 'Edge_Computing_Test.txt',
            'text': pasted_text
        })
        self.assertEqual(res.status_code, 201)
        doc = res.json['document']
        self.assertEqual(doc['file_format'], 'TXT')
        self.assertGreater(doc['word_count'], 20)

if __name__ == '__main__':
    unittest.main(verbosity=2)
