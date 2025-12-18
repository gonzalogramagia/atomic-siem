# Atomic SIEM

A lightweight, essential Security Information and Event Management (SIEM) system.

## Project Structure

- **backend/**: Python FastAPI application for log ingestion and detection.
- **frontend/**: React application for the dashboard.

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
yarn install
yarn dev
```
