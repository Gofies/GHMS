# src/routes/__init__.py
from .health import health_routes
from .metrics import metrics_routes
from .processor import processor_routes

def register_routes(app, file_service):
    """Register all route blueprints"""
    app.register_blueprint(health_routes)
    app.register_blueprint(metrics_routes)
    app.register_blueprint(processor_routes(file_service))
