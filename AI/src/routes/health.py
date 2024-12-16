# src/routes/health.py
from flask import Blueprint, jsonify

health_routes = Blueprint('health', __name__)

@health_routes.route('/llm/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
    }), 200