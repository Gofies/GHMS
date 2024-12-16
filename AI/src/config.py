# src/config.py
import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {
        'png': 'image',
        'jpg': 'image',
        'jpeg': 'image',
        'pdf': 'pdf'
    }
    PORT = int(os.getenv('PORT', 3131))
    
    @staticmethod
    def init_app(app):
        # Create upload directory if it doesn't exist
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)