import pymupdf
import re

class PDFParser:
    @staticmethod
    def extract(file_path):
        """
        Extract readable text and metadata from a PDF document using PyMuPDF.
        Returns:
            dict with:
                'raw_text': str,
                'page_count': int,
                'word_count': int,
                'pages': list of dicts {'page_number': int, 'text': str, 'word_count': int},
                'metadata': dict
        """
        try:
            doc = pymupdf.open(file_path)
        except Exception as e:
            raise ValueError(f"Could not open PDF file. The file may be corrupt or not a valid PDF: {str(e)}")

        if doc.is_encrypted:
            raise ValueError("The PDF document is password-protected or encrypted. Please provide an unencrypted document.")

        total_pages = len(doc)
        if total_pages == 0:
            raise ValueError("The PDF document contains no pages.")

        pages_data = []
        full_text_parts = []

        for page_idx in range(total_pages):
            page = doc[page_idx]
            page_text = page.get_text("text") or ""
            # Basic normalisation
            cleaned_page_text = re.sub(r'[ \t]+', ' ', page_text).strip()
            page_words = len(re.findall(r'\b\w+\b', cleaned_page_text))
            
            pages_data.append({
                'page_number': page_idx + 1,
                'text': cleaned_page_text,
                'word_count': page_words
            })
            if cleaned_page_text:
                full_text_parts.append(cleaned_page_text)

        doc.close()

        full_raw_text = "\n\n".join(full_text_parts).strip()
        total_words = len(re.findall(r'\b\w+\b', full_raw_text))

        if total_words == 0:
            raise ValueError("No extractable digital text found. If this is a scanned PDF image, digital text extraction requires an OCR layer.")

        return {
            'raw_text': full_raw_text,
            'page_count': total_pages,
            'word_count': total_words,
            'pages': pages_data,
            'metadata': {
                'format': 'PDF',
                'pages': total_pages,
                'words': total_words
            }
        }
