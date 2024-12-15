# Dockerfile for FastAPI-based LLM service

# Base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install slowapi
# Copy the FastAPI application
COPY . .

# Expose the application port
EXPOSE 3131

# Command to run the application
#sign in to huggingface
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3131"]