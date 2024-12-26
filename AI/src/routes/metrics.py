from flask import Blueprint, request, Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

metrics_routes = Blueprint('metrics', __name__)

# Create Prometheus metrics
REQUEST_COUNT = Counter(
    'llm_http_requests_total',
    'Total HTTP requests to LLM service',
    ['method', 'route', 'status']
)

REQUEST_LATENCY = Histogram(
    'llm_http_request_duration_seconds',
    'Duration of HTTP requests in seconds',
    ['method', 'route', 'status'],
    buckets=[0.1, 0.3, 1.2, 5, 10]
)

# Middleware to track request count and duration
@metrics_routes.before_app_request
def before_request():
    request.start_time = request.start_time or 0

@metrics_routes.after_app_request
def after_request(response):
    request_latency = (request.start_time - request.environ.get('werkzeug.request').start_time) / 1000
    route = request.url_rule.rule if request.url_rule else 'unknown'
    
    REQUEST_COUNT.labels(request.method, route, response.status_code).inc()
    REQUEST_LATENCY.labels(request.method, route, response.status_code).observe(request_latency)
    return response

# Expose metrics at /llm/metrics
@metrics_routes.route('/llm/metrics', methods=['GET'])
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)
