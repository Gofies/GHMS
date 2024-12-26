from flask import Flask, request
from config import Config
from routes import register_routes
from services import FileService
import time

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Track request time
    @app.before_request
    def start_timer():
        request.start_time = time.time()
    
    # Initialize services
    file_service = FileService(app.config['UPLOAD_FOLDER'])
    
    register_routes(app, file_service)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config['PORT'])