import os
import requests
import json

class LLMService:
    @staticmethod
    def get_api_key(provider='gemini'):
        from models.setting import SystemSetting
        key_name = f"{provider.upper()}_API_KEY"
        # Check database setting first, then env
        setting = SystemSetting.query.filter_by(key=key_name).first()
        if setting and setting.value:
            return setting.value.strip()
        return os.environ.get(key_name, '').strip()

    @classmethod
    def test_connection(cls, provider='gemini', api_key=None):
        """Test whether the provided API key is valid and responsive."""
        if not api_key:
            api_key = cls.get_api_key(provider)
        
        if not api_key:
            return {'status': 'unconfigured', 'message': f'No API key configured for {provider.capitalize()}.'}

        if provider == 'gemini':
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
            try:
                resp = requests.get(url, timeout=5)
                if resp.status_code == 200:
                    return {'status': 'online', 'message': 'Gemini API connected successfully.'}
                else:
                    return {'status': 'error', 'message': f'Gemini API authentication failed: HTTP {resp.status_code}'}
            except Exception as e:
                return {'status': 'error', 'message': f'Connection failed: {str(e)}'}

        elif provider == 'openai':
            url = "https://api.openai.com/v1/models"
            headers = {"Authorization": f"Bearer {api_key}"}
            try:
                resp = requests.get(url, headers=headers, timeout=5)
                if resp.status_code == 200:
                    return {'status': 'online', 'message': 'OpenAI API connected successfully.'}
                else:
                    return {'status': 'error', 'message': f'OpenAI authentication failed: HTTP {resp.status_code}'}
            except Exception as e:
                return {'status': 'error', 'message': f'Connection failed: {str(e)}'}

        return {'status': 'error', 'message': f'Unknown provider: {provider}'}

    @classmethod
    def ask_llm_grounded(cls, question, document_text, provider='gemini'):
        """
        Query LLM with strict grounding instructions.
        """
        api_key = cls.get_api_key(provider)
        if not api_key:
            return None  # Signal to fall back to Local NLP

        system_instruction = (
            "You are DocuIntellect AI, a precision document intelligence engine. "
            "Answer the question strictly and solely based on the provided document text excerpt. "
            "If the document text does not contain sufficient facts to answer the question, you MUST reply: "
            "'The requested information was not found in the uploaded document.' "
            "Do not hallucinate or extrapolate facts not present in the text."
        )

        prompt = f"DOCUMENT EXCERPT:\n{document_text[:8000]}\n\nQUESTION:\n{question}\n\nANSWER:"

        if provider == 'gemini':
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_instruction}\n\n{prompt}"}]}
                ],
                "generationConfig": {"temperature": 0.1, "maxOutputTokens": 600}
            }
            try:
                resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=12)
                if resp.status_code == 200:
                    data = resp.json()
                    ans = data['candidates'][0]['content']['parts'][0]['text'].strip()
                    return ans
            except Exception:
                return None

        return None
