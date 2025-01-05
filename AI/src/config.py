# src/config.py
import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    PORT = int(os.getenv('PORT', 3131))
    
    @staticmethod
    def init_app(app):
        # Create upload directory if it doesn't exist
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)