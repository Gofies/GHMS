# src/app.py
from flask import Flask
from config import Config
from routes import register_routes
from services import FileService

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize services
    file_service = FileService(app.config['UPLOAD_FOLDER'])
    
    register_routes(app, file_service)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config['PORT'])