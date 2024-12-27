# Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies and curl
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY src/ .

COPY models/* /app/models/*

# Create uploads directory
RUN mkdir uploads

# Expose port
EXPOSE 3131

# Run the application
CMD ["python", "app.py"]
