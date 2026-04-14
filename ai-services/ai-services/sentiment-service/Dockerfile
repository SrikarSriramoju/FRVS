# sentiment-service/Dockerfile
# Instructions to run sentiment service in Docker

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy shared folder
COPY ../shared /app/shared

# Expose port 8001 (sentiment service runs here)
EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
