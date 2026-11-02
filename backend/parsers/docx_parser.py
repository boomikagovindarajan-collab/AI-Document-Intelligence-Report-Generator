import docx
import re

class DOCXParser:
    @staticmethod
    def extract(file_path):
        """
        Extract readable text from a DOCX file using python-docx.
        """
        try:
            doc = docx.Document(file_path)
        except Exception as e:
            raise ValueError(f"Could not open Word document (.docx). File may be corrupted or invalid: {str(e)}")

        paragraphs_text = []
        for p in doc.paragraphs:
            text = p.text.strip()
            if text:
                paragraphs_text.append(text)

        # Also extract table text
        for table in doc.tables:
            for row in table.rows:
                row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if row_cells:
                    paragraphs_text.append(" | ".join(row_cells))

        full_raw_text = "\n\n".join(paragraphs_text).strip()
        total_words = len(re.findall(r'\b\w+\b', full_raw_text))

        if total_words == 0:
            raise ValueError("The Word document is empty or contains no readable text.")

        # Estimate page count (standard approx 350-400 words per page)
        estimated_pages = max(1, (total_words + 349) // 350)

        # Segment into artificial pages for consistent reference
        words_list = full_raw_text.split()
        pages_data = []
        words_per_page = 350
        for i in range(0, max(len(words_list), 1), words_per_page):
            chunk = " ".join(words_list[i:i + words_per_page])
            p_num = (i // words_per_page) + 1
            pages_data.append({
                'page_number': p_num,
                'text': chunk,
                'word_count': len(chunk.split())
            })

        return {
            'raw_text': full_raw_text,
            'page_count': estimated_pages,
            'word_count': total_words,
            'pages': pages_data,
            'metadata': {
                'format': 'DOCX',
                'pages': estimated_pages,
                'words': total_words
            }
        }
