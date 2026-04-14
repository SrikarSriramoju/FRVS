# FRVS Project Setup

FRVS is a full-stack feature-request and analytics platform made up of:

- `frontend/` - React + Vite dashboard and user portal
- `backend/` - Spring Boot API
- `ai-services/ai-services/` - Python FastAPI microservices for similarity and sentiment analysis

## Quick Start

1. Create a MySQL database named `FRVSystem`.
2. Configure Azure Text Analytics credentials in [ai-services/ai-services/.env](ai-services/ai-services/.env).
3. Start the AI services:

```powershell
cd E:\MiniProject2\ai-services\ai-services\similarity-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

```powershell
cd E:\MiniProject2\ai-services\ai-services\sentiment-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

4. Start the backend:

```powershell
cd E:\MiniProject2\backend\backend
.\mvnw spring-boot:run
```

5. Start the frontend:

```powershell
cd E:\MiniProject2\frontend
npm install
npm run dev
```

6. Open `http://localhost:5173`.

## Requirements

Install these before running the project:

- Node.js 18+ and npm
- Java 17+
- Maven Wrapper support is already included in the backend project
- Python 3.11+
- MySQL 8+
- Azure account and Text Analytics resource for the sentiment service
- Optional: Docker Desktop if you want to containerize the Python services manually

## Ports Used

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Similarity service: `http://localhost:8000`
- Sentiment service: `http://localhost:8001`

## Project Order

Run the services in this order:

1. Start MySQL and create the database.
2. Start the AI services.
3. Start the Spring Boot backend.
4. Start the React frontend.

The frontend talks to the backend at `http://localhost:8080/api`, and the backend talks to the AI services on ports `8000` and `8001`.

## 1. Database Setup

Create a MySQL database named `FRVSystem`.

The backend reads its database settings from:

- [backend/backend/src/main/resources/application.yml](backend/backend/src/main/resources/application.yml)

If your local MySQL username, password, or database name is different, update that file before starting the backend.

## 2. Start the AI Services

The Python services live in:

- [ai-services/ai-services/similarity-service](ai-services/ai-services/similarity-service)
- [ai-services/ai-services/sentiment-service](ai-services/ai-services/sentiment-service)

### Environment file

The sentiment service needs Azure Text Analytics credentials. Configure them in:

- [ai-services/ai-services/.env](ai-services/ai-services/.env)

Example values:

```dotenv
AZURE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_KEY=your-key-here
```

### Create a virtual environment

From the AI services folder:

```powershell
cd E:\MiniProject2\ai-services\ai-services
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

### Install dependencies

Similarity service:

```powershell
cd E:\MiniProject2\ai-services\ai-services\similarity-service
python -m pip install -r requirements.txt
```

Sentiment service:

```powershell
cd E:\MiniProject2\ai-services\ai-services\sentiment-service
python -m pip install -r requirements.txt
```

### Run the services

Open two terminals.

Similarity service:

```powershell
cd E:\MiniProject2\ai-services\ai-services\similarity-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Sentiment service:

```powershell
cd E:\MiniProject2\ai-services\ai-services\sentiment-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Service checks

- Similarity docs: `http://localhost:8000/docs`
- Sentiment docs: `http://localhost:8001/docs`
- Health checks: `GET /health` on both services

## 3. Start the Backend

The backend is a Spring Boot application located in:

- [backend/backend](backend/backend)

Run it with the Maven wrapper:

```powershell
cd E:\MiniProject2\backend\backend
.\mvnw spring-boot:run
```

If you are on macOS or Linux, use:

```bash
./mvnw spring-boot:run
```

### Backend dependencies

The backend expects:

- Java 17
- MySQL running locally
- AI services available on ports `8000` and `8001`

### Backend config

Important backend configuration lives in:

- [backend/backend/src/main/resources/application.yml](backend/backend/src/main/resources/application.yml)

That file contains:

- datasource settings for MySQL
- JWT secret and expiration
- AI service URLs

## 4. Start the Frontend

The frontend is a Vite app in:

- [frontend](frontend)

Install dependencies:

```powershell
cd E:\MiniProject2\frontend
npm install
```

Start the development server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## 5. Verify the App

After all services are running:

1. Open `http://localhost:5173`
2. Log in or register through the app flow
3. Verify the dashboard, feature management, and reports pages load correctly
4. Confirm analytics and AI-powered clustering work without connection errors

## Troubleshooting

- If the frontend cannot load data, check that the backend is running on port `8080`.
- If sentiment analysis fails, confirm the Azure endpoint and key in `ai-services/ai-services/.env`.
- If cluster or sentiment requests fail, make sure both Python services are running on ports `8000` and `8001`.
- If the backend fails to start, check the MySQL connection settings in `application.yml`.
- If Python package installation fails on Windows, use Python 3.11 instead of 3.13.

## Notes

- The frontend uses a local API base URL of `http://localhost:8080/api`.
- The backend uses `ddl-auto: update`, so it will create or update tables automatically in the configured database.
- The repository already contains a more detailed AI services guide in [ai-services/ai-services/README.md](ai-services/ai-services/README.md).
