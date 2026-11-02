import re

class TXTParser:
    @staticmethod
    def extract(file_path):
        """
        Extract readable text from a plain text file with multi-encoding fallback.
        """
        content = None
        for enc in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
            try:
                with open(file_path, 'r', encoding=enc) as f:
                    content = f.read()
                break
            except (UnicodeDecodeError, Exception):
                continue

        if content is None:
            raise ValueError("Could not decode text file using standard character encodings (UTF-8, Latin-1, CP1252).")

        cleaned_text = re.sub(r'\r\n', '\n', content).strip()
        total_words = len(re.findall(r'\b\w+\b', cleaned_text))

        if total_words == 0:
            raise ValueError("The text file is empty or contains only whitespace characters.")

        estimated_pages = max(1, (total_words + 349) // 350)
        words_list = cleaned_text.split()
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
            'raw_text': cleaned_text,
            'page_count': estimated_pages,
            'word_count': total_words,
            'pages': pages_data,
            'metadata': {
                'format': 'TXT',
                'pages': estimated_pages,
                'words': total_words
            }
        }
