# 🧭 Smartyatra Frontend

> AI-Powered Smart Travel Planner Interface built with Next.js, Tailwind CSS, TypeScript, and Leaflet Maps.

This directory contains the user interface of the Smartyatra application, enabling travelers to sign up, input preferences, browse tourist destination details, and build optimized day-by-day travel itineraries.

---

## 🛠️ Technology Stack & Libraries

- **Framework**: Next.js 16 (App Router, Turbopack enabled)
- **Styling**: Tailwind CSS & CSS Modules
- **State Management**: Zustand (for user session profiles, local settings, and travel preferences)
- **Interactive Maps**: Leaflet & React-Leaflet (loaded with client-side dynamic imports to ensure SSR compatibility)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP client**: Axios

---

## 📂 Directory Structure

```
frontend/
├── public/                 # Static assets (images, markers)
└── src/
    ├── app/                # Page route handlers (explore, planner, settings, etc.)
    ├── components/         # Modular layout, form, map, and ui elements
    ├── services/           # Axios network endpoints communication hooks
    ├── store/              # Zustand global client-side state managers
    └── types/              # Unified TypeScript definitions
```

---

## 🚀 Getting Started

### 1. Configure Environments
Copy the configuration template and verify the target FastAPI backend endpoint:
```bash
cp .env.example .env.local
```
Ensure `NEXT_PUBLIC_API_URL` points to your running backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm run start
```
