# similarity-service/Dockerfile
# Instructions to run this service inside a Docker container

# Use Python 3.11 as base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first (for faster rebuilds)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app code
COPY . .

# Copy shared folder (config + logging)
COPY ../shared /app/shared

# Expose port 8000 (similarity service runs here)
EXPOSE 8000

# Command to start the service
# uvicorn runs the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
