# src/services/file_service.py
import os
from werkzeug.utils import secure_filename
from config import Config
from .llm_service import LLMService


class FileService:
    def __init__(self, upload_folder):
        self.upload_folder = upload_folder
        self.llm_service = LLMService()
        
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS
    
    def get_file_type(self, filename):
        return Config.ALLOWED_EXTENSIONS.get(filename.rsplit('.', 1)[1].lower())
    
    def save_file(self, file):
        if file and file.filename:
            if self.allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(self.upload_folder, filename)
                file.save(file_path)
                return filename, self.get_file_type(filename)
        return None, None
    
    def process_request(self, request):
        received_data = {
            'text': None,
            'image': None,
            'pdf': None
        }
        
        file_paths = {}
        
        # Handle text data
        if 'text' in request.form:
            received_data['text'] = request.form['text']
        
        # Handle files
        for file_key in request.files:
            file = request.files[file_key]
            filename, file_type = self.save_file(file)
            
            if filename and file_type:
                received_data[file_type] = filename
                file_paths[file_type] = os.path.join(self.upload_folder, filename)
            elif file.filename:
                raise ValueError(f'Invalid file type for {file.filename}')
        
        # Generate LLM response
        try:
            llm_response = self.llm_service.generate_response(
                text=received_data['text'],
                image_path=file_paths.get('image'),
                pdf_path=file_paths.get('pdf')
            )
            
            received_data['analysis'] = llm_response
            
        except Exception as e:
            raise ValueError(f"Error generating analysis: {str(e)}")
        
        return received_data