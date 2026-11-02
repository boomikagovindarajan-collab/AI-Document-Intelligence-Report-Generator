import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

UAV_RESEARCH_TEXT = (
    "Autonomous UAV Navigation Using Deep Reinforcement Learning. "
    "Published in IEEE Robotics and Automation Letters, October 2026. "
    "Affiliation: Robotics and Autonomous Systems Laboratory, Massachusetts Institute of Technology, Cambridge, USA. "
    "This research presents a Proximal Policy Optimization (PPO) reinforcement learning architecture integrated with vision-based depth sensors and LiDAR odometry. "
    "Quantitative Experimental Metrics: Across 50,000 simulated flight hours in NVIDIA Isaac Sim and 120 physical field trials, "
    "the autonomous flight agent achieved a 96.4% mission completion rate and reduced obstacle collision incidents by 78.5%. "
    "For technical correspondence or data inquiries, contact the primary investigator at caldwell@mit.edu or visit https://robotics.mit.edu. "
    "In conclusion, the neural policy network delivers robust spatial stability without requiring external satellite coordinates."
)

DOCX_SAMPLE_TEXT = (
    "Comparative Performance of Transformer Models in Technical Documentation. "
    "Published in Software Engineering Journal, 2026. "
    "This study evaluates bidirectional language models against traditional keyword matching across 10,000 technical manuals. "
    "Key results demonstrate an average retrieval accuracy improvement of 34.2% while reducing indexing latency by 18.5%. "
    "Organizations implementing the pipeline include Global Research Labs and OpenTech Consortium."
)

TXT_SAMPLE_TEXT = (
    "Distributed Data Pipeline Ingestion Protocols and Fault-Tolerance Architecture. "
    "Technical Specifications Document, September 2026. "
    "System throughput benchmarks achieved 25,000 messages per second with 99.99% availability across 12 distributed cluster nodes. "
    "Failover recovery latency remained below 120 milliseconds. Contact operations team at ops@datacorp.io."
)

def create_sample_pdf(file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    doc = SimpleDocTemplate(file_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )
    
    story = [
        Paragraph("Autonomous UAV Navigation Using Deep Reinforcement Learning", title_style),
        Spacer(1, 10),
        Paragraph(UAV_RESEARCH_TEXT, body_style)
    ]
    doc.build(story)
    return file_path

def init_demo_database(app):
    from database import db
    from models.document import Document
    from models.analysis import Analysis
    from models.qa import QAInteraction
    from models.report import Report
    from services.nlp_engine import NLPEngine
    from services.report_service import ReportService
    from parsers import extract_document_text

    with app.app_context():
        db.create_all()

        if Document.query.count() == 0:
            print("Initializing initial sample documents to replicate reference dataset...")
            sample_dir = app.config['SAMPLES_FOLDER']
            upload_dir = app.config['UPLOAD_FOLDER']
            os.makedirs(sample_dir, exist_ok=True)
            os.makedirs(upload_dir, exist_ok=True)

            # 1. UAV Navigation PDF
            uav_pdf_path = os.path.join(upload_dir, "uav_navigation_research.pdf")
            create_sample_pdf(uav_pdf_path)
            extracted_uav = extract_document_text(uav_pdf_path, 'pdf')

            uav_doc = Document(
                id="4141bf8812b148c78cd2fab616730a22",
                filename="uav_navigation_research.pdf",
                original_filename="uav_navigation_research.pdf",
                file_format="PDF",
                file_size_bytes=os.path.getsize(uav_pdf_path),
                file_path=uav_pdf_path,
                word_count=extracted_uav.get('word_count', 202),
                page_count=extracted_uav.get('page_count', 1),
                status="PROCESSED",
                raw_text=extracted_uav.get('raw_text', UAV_RESEARCH_TEXT)
            )
            db.session.add(uav_doc)
            db.session.commit()

            # Analyze UAV
            analysis_data = NLPEngine.analyze_document(uav_doc.raw_text)
            uav_analysis = Analysis(
                document_id=uav_doc.id,
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
                confidence_score=95
            )
            db.session.add(uav_analysis)

            # Sample QA
            qa1 = QAInteraction(
                document_id=uav_doc.id,
                question="What is the primary objective or main thesis of this document?",
                answer='Based on the document text (Page 1):\n\n"This research presents a Proximal Policy Optimization (PPO) reinforcement learning architecture integrated with vision-based depth sensors and LiDAR odometry."',
                is_grounded=True,
                confidence=95.0,
                citations=json.dumps([{'page': 1, 'passage': 'This research presents a Proximal Policy Optimization (PPO) reinforcement learning architecture integrated with vision-based depth sensors and LiDAR odometry.', 'relevance_score': 95.0}])
            )
            qa2 = QAInteraction(
                document_id=uav_doc.id,
                question="What are the key statistical numbers, metrics, or quantitative results?",
                answer='Based on the document text (Page 1):\n\n"Across 50,000 simulated flight hours in NVIDIA Isaac Sim and 120 physical field trials, the autonomous flight agent achieved a 96.4% mission completion rate and reduced obstacle collision incidents by 78.5%."',
                is_grounded=True,
                confidence=96.0,
                citations=json.dumps([{'page': 1, 'passage': 'Across 50,000 simulated flight hours in NVIDIA Isaac Sim and 120 physical field trials, the autonomous flight agent achieved a 96.4% mission completion rate and reduced obstacle collision incidents by 78.5%.', 'relevance_score': 96.0}])
            )
            db.session.add_all([qa1, qa2])

            # Sample Report
            rep_res = ReportService.generate_all_formats(
                uav_doc,
                uav_analysis.to_dict(),
                {
                    'report_title': 'Analysis Report — uav_navigation_research.pdf',
                    'author_name': 'BOOMIKA G & VIBUTHA P',
                    'organization': 'Department of Information Technology, KPRIET, Coimbatore',
                    'archetype': 'Executive Brief',
                    'granularity': 'Standard (5 Sents)',
                    'inclusions': {'executive_summary': True, 'key_findings': True, 'entities': True}
                },
                app.config['GENERATED_REPORTS_FOLDER']
            )
            report_item = Report(
                document_id=uav_doc.id,
                report_title='Analysis Report — uav_navigation_research.pdf',
                author_name='BOOMIKA G & VIBUTHA P',
                organization='Department of Information Technology, KPRIET, Coimbatore',
                archetype='Executive Brief',
                granularity='Standard (5 Sents)',
                pdf_filename=rep_res['pdf_filename'],
                docx_filename=rep_res['docx_filename'],
                json_filename=rep_res['json_filename']
            )
            db.session.add(report_item)

            # 2. Add DOCX & TXT samples to mirror the screenshots (e.g. docx_report_doc.txt, json_report_doc.txt)
            for idx, (title, sample_content) in enumerate([
                ("docx_report_doc.txt", DOCX_SAMPLE_TEXT),
                ("json_report_doc.txt", TXT_SAMPLE_TEXT)
            ]):
                f_path = os.path.join(upload_dir, title)
                with open(f_path, 'w', encoding='utf-8') as f:
                    f.write(sample_content)
                doc_sample = Document(
                    id=f"doc_sample_{idx+1}",
                    filename=title,
                    original_filename=title,
                    file_format="TXT",
                    file_size_bytes=os.path.getsize(f_path),
                    file_path=f_path,
                    word_count=len(sample_content.split()),
                    page_count=1,
                    status="PROCESSED",
                    raw_text=sample_content
                )
                db.session.add(doc_sample)

            db.session.commit()
            print("Initial reference sample data generated successfully!")

if __name__ == '__main__':
    from config import Config
    from flask import Flask
    app = Flask(__name__)
    app.config.from_object(Config)
    from database import db
    db.init_app(app)
    init_demo_database(app)
