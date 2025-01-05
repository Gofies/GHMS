# src/routes/processor.py
from flask import Blueprint, request, jsonify

def processor_routes(file_service):
    processor = Blueprint('processor', __name__)

    @processor.route('/llm/process', methods=['POST'])
    def process_data():
        try:
            if 'text' not in request.form:
                return jsonify({'error': 'Text prompt is required'}), 400

            result = file_service.process_request(request)
            return jsonify({
                'message': 'Data processed successfully',
                'response': result['analysis']
            }), 200

        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': 'Internal server error'}), 500

    return processor
