# 🤖 FRVS — AI Services

Your part of the project. Two Python microservices built with FastAPI.

---

## 📁 Folder Structure

```
ai-services/
├── similarity-service/         ← Core AI (ML model)
│   ├── app/
│   │   ├── main.py             ← Entry point (like FrvsApplication.java)
│   │   ├── routes/
│   │   │   └── similarity.py   ← API endpoint POST /similarity
│   │   ├── services/
│   │   │   └── similarity_engine.py  ← Brain: computes similarity
│   │   ├── models/
│   │   │   └── transformer_model.py  ← Loads ML model
│   │   ├── schemas/
│   │   │   └── similarity_schema.py  ← Request/Response format
│   │   └── utils/
│   │       └── text_utils.py   ← Text cleaning helpers
│   ├── requirements.txt
│   └── Dockerfile
│
├── sentiment-service/          ← Azure wrapper
│   ├── app/
│   │   ├── main.py             ← Entry point
│   │   ├── routes/
│   │   │   └── sentiment.py    ← API endpoint POST /sentiment
│   │   ├── services/
│   │   │   └── azure_client.py ← Connects to Azure API
│   │   ├── schemas/
│   │   │   └── sentiment_schema.py  ← Request/Response format
│   │   └── utils/
│   │       └── text_utils.py   ← Text cleaning helpers
│   ├── requirements.txt
│   └── Dockerfile
│
├── shared/
│   ├── config.py               ← Common config (model name, Azure keys)
│   └── logging.py              ← Common logging setup
│
└── docker-compose.yml          ← Run both services together
```

---

## ⚙️ Setup — Step by Step

### Step 1: Get Azure API Key

1. Go to https://portal.azure.com
2. Create a free account
3. Search for "Language Service" → Create
4. Copy your **Endpoint** and **Key**
5. Create/update the `.env` file in this folder (next to `docker-compose.yml`):

```dotenv
AZURE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_KEY=your-key-here
```

Notes:

- `.env` is ignored by git via `.gitignore`
- `shared/config.py` loads these values automatically

---

### Step 2: Install Dependencies

Important (Windows):

- These services are designed to run on **Python 3.11** (same as the Dockerfiles).
- If you use **Python 3.13**, `pip install` may fail because packages like `pydantic-core` and `scikit-learn` need prebuilt wheels (otherwise they try to compile Rust/C extensions).

Recommended local setup (Python 3.11):

1. Install Python **3.11.x** from https://www.python.org/downloads/ (make sure to check **“Add Python to PATH”**).
2. Create + activate a virtual environment from this folder:

```powershell
cd E:\MiniProject2\ai-services\ai-services
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

**For Similarity Service:**

```bash
cd similarity-service
python -m pip install -r requirements.txt
```

**For Sentiment Service:**

```bash
cd sentiment-service
python -m pip install -r requirements.txt
```

---

### Step 3: Run Services (Without Docker)

Open **two terminals**:

**Terminal 1 — Similarity Service (port 8000):**

```bash
cd similarity-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Sentiment Service (port 8001):**

```bash
cd sentiment-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

---

### Step 4: Run Services (With Docker)

Prerequisite: Docker Desktop installed (Windows).

```bash
cd ai-services/ai-services
docker-compose up --build
```

Both services start automatically!

---

## 🧪 Testing Your Services

### Test Similarity Service

Open browser → http://localhost:8000/docs (Swagger UI auto-generated!)

Or use Postman:

```
POST http://localhost:8000/similarity
Content-Type: application/json

{
    "new_feature": "Dark Mode",
    "existing_features": [
        {"feature_id": 10, "title": "Night theme"},
        {"feature_id": 12, "title": "Export PDF"},
        {"feature_id": 45, "title": "Dark UI"}
    ]
}
```

Expected Response:

```json
{
  "results": [
    { "feature_id": 45, "title": "Dark UI", "score": 0.9123 },
    { "feature_id": 10, "title": "Night theme", "score": 0.8734 },
    { "feature_id": 12, "title": "Export PDF", "score": 0.1245 }
  ]
}
```

---

### Test Sentiment Service

```
POST http://localhost:8001/sentiment
Content-Type: application/json

{
    "comment_id": 55,
    "text": "This feature is absolutely amazing!"
}
```

Expected Response:

```json
{
  "comment_id": 55,
  "sentiment": "POSITIVE",
  "confidence": 0.95
}
```

---

### Health Checks

```
GET http://localhost:8000/health  → Similarity service
GET http://localhost:8001/health  → Sentiment service
```

---

## 🔄 How It Connects to Spring Boot

**Similarity Flow:**

```
User submits feature
→ React → POST /api/features → Spring Boot
→ AIService.java → POST http://localhost:8000/similarity
→ similarity_engine.py → ML model
→ Returns scores
→ Spring Boot stores in similarity_mapping table
```

**Sentiment Flow:**

```
User writes comment
→ React → POST /api/comments → Spring Boot
→ AIService.java → POST http://localhost:8001/sentiment
→ azure_client.py → Azure Text Analytics API
→ Returns sentiment + confidence
→ Spring Boot stores in sentiments table
```

---

## 🎤 Viva Answer (Important!)

> "The AI services are implemented as independent Python-based
> microservices using FastAPI. The similarity service uses the
> all-MiniLM-L6-v2 sentence transformer model to convert feature
> text into vector embeddings and computes cosine similarity to
> detect duplicate or related feature requests. The sentiment service
> acts as a wrapper around Azure Text Analytics API, analyzing user
> comment text and returning POSITIVE, NEGATIVE, or NEUTRAL sentiment
> with a confidence score. Both services communicate with the Spring
> Boot backend via REST APIs over HTTP using JSON format."
