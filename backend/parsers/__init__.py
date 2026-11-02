import os
from parsers.pdf_parser import PDFParser
from parsers.docx_parser import DOCXParser
from parsers.txt_parser import TXTParser

def extract_document_text(file_path, file_extension):
    ext = file_extension.lower().lstrip('.')
    if ext == 'pdf':
        return PDFParser.extract(file_path)
    elif ext in ['docx', 'doc']:
        return DOCXParser.extract(file_path)
    elif ext in ['txt', 'md']:
        return TXTParser.extract(file_path)
    else:
        raise ValueError(f"Unsupported file format: .{ext}. Supported formats are PDF, DOCX, and TXT.")
