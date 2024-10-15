# Dockerfile for AI Service
FROM python:3.9

# Set working directory
WORKDIR /app

# Install virtualenv
RUN pip install virtualenv

# Create a virtual environment
RUN virtualenv venv

# Activate the virtual environment
# Using `bash` because the command is multi-line
# This is important to ensure that subsequent commands run in the virtual environment
# However, keep in mind that each command runs in a separate shell, so we'll 
# need to combine commands and execute them in the same shell
# Use ENTRYPOINT to ensure the virtual environment is activated whenever the container runs
ENTRYPOINT ["/bin/bash", "-c", "source venv/bin/activate && exec python"]

# Install dependencies inside the virtual environment
COPY requirements.txt .
RUN /bin/bash -c "source venv/bin/activate && pip install -r requirements.txt"

# Copy application files
COPY . .

# Expose the port
EXPOSE 8000

# Run the AI service (using FastAPI or Flask as an example)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
