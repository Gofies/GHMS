# src/services/file_service.py
from .llm_service import LLMService
class FileService:
    def __init__(self):
        self.llm_service = LLMService()
        
    def process_request(self, request):
        text = request.form.get('text')
        if not text:
            raise ValueError("No text provided")

        try:
            llm_response = self.llm_service.generate_response(text=text)
            return {'text': text, 'analysis': llm_response}
        except Exception as e:
            raise ValueError(f"Error generating response: {str(e)}")
