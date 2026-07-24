# 🧭 Smartyatra

> AI-Powered Smart Travel Planner for Andhra Pradesh

Smartyatra is an intelligent travel planning platform that helps users discover tourist destinations, generate optimized travel routes, estimate trip budgets, and create personalized AI-powered travel itineraries.

The project combines modern full-stack development, geospatial technologies, optimization algorithms, and Generative AI to simplify travel planning through a single unified platform.

---

## ✨ Features (Version 1 - Completed)

- **Interactive Tourism Map**: OpenStreetMap visual markers and trip path rendering with Leaflet.
- **Tourist Destination Explorer**: Detailed views with averages costs, local reviews, rating tallies, and travel season guides.
- **Smart Route Optimizer**: Traveling Salesperson Problem solvers sorting multi-stop visits efficiently using exact permutations or greedy nearest-neighbor fallbacks.
- **Travel Budget Estimation**: Complete hotel rate forecasts, food allowance computations, and mileage transit fuel logs.
- **AI-Powered Itinerary Generation**: Interactive travel generator powered by Google Gemini API with customized local rule-based itinerary fallback support.
- **Responsive Layout**: Mobile-first fluid grids, custom user navigation drawers, loading overlays, and dark-theme configurations.

---

## 🏗️ Project Architecture

```
Smartyatra/
├── backend/
│   ├── app/
│   │   ├── ai/            # Routing, budget, and Gemini LLM submodules
│   │   ├── api/           # Router registries and API endpoints
│   │   ├── core/          # App settings, logging, and exception handlers
│   │   ├── db/            # SQLAlchemy database engine and local sessions
│   │   └── models/        # Database tables schemas
│   └── tests/             # Automated unittest suite
└── frontend/
    ├── src/
    │   ├── app/           # Navigation routers and page views
    │   ├── components/    # Common UI elements and map components
    │   ├── services/      # Axios API request hooks
    │   └── store/         # Zustand global client state
    └── package.json
```

---

## 🚀 Full-Stack Setup & Startup Runbook

### 1. Database Setup
Ensure PostgreSQL is running locally, then log in and create a database named `smartyatra`:
```sql
CREATE DATABASE smartyatra;
```

### 2. Backend Setup
1. Navigate to the backend directory and install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` parameters (DB username, DB password, and optionally your `GEMINI_API_KEY`).
4. Apply database migrations to create the tables schema:
   ```bash
   python -m alembic upgrade head
   ```
5. Seed the database with cities, categories, and destinations:
   ```bash
   python seed.py
   ```
6. Start the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --port 8000 --reload
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Install frontend Node modules:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Running Verifications

### Backend Unit Tests
Run the test suite using standard Python `unittest`:
```bash
cd backend
set PYTHONPATH=.
python -m unittest discover -s tests
```

### Frontend Linters & Builds
Run linter verification and verify Next.js production builds:
```bash
cd frontend
npm run lint
npm run build
```
