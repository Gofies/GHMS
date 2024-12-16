# src/routes/__init__.py
from flask import jsonify
from .health import health_routes
from .processor import processor_routes

def register_routes(app, file_service):
    """Register all route blueprints"""
    app.register_blueprint(health_routes)
    app.register_blueprint(processor_routes(file_service))
