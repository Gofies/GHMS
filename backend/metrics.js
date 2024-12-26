// metrics.js
import promClient from 'prom-client';

// Create a registry to register the metrics
const register = new promClient.Registry();

// Create some metrics for Prometheus to scrape
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.3, 1.2, 5, 10],
});
register.registerMetric(httpRequestDurationMicroseconds);

// Create an HTTP request count metric
const httpRequestCount = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests made',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCount);

// Expose the metrics to the /metrics endpoint
export const setupMetrics = (app) => {
    app.get('/api/metrics', async (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    });
};

// Middleware to track HTTP request duration and count
export const trackRequests = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDurationMicroseconds.labels(req.method, req.route?.path, res.statusCode).observe(duration);
        httpRequestCount.labels(req.method, req.route?.path, res.statusCode).inc();
    });
    next();
};
