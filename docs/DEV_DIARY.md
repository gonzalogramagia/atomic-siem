# Building Atomic SIEM with AI

This document chronicles the development journey of **Atomic SIEM**, a project built to demonstrate core cybersecurity concepts using modern full-stack technologies. The project is being developed with the assistance of an advanced AI agent to accelerate planning, boilerplate generation, and implementation while adhering to strict engineering standards.

## Phase 1: Inception & Planning

The project kicked off with a clear goal: build a lightweight SIEM with essential functionalities (Log Ingestion, Detection, Alerting) using a specific stack (React, Python/FastAPI).

### Initial Prompt
We defined the scope and constraints, ensuring a focus on "Atomic" (essential) features.

![Initial Prompt](./initial-prompt.png)

### Task Breakdown
The AI proposed a structured implementation plan, breaking the project into logical phases:
1.  **Setup & Architecture**: Monorepo structure, tooling.
2.  **Backend Core**: FastAPI, Database, Auth.
3.  **Detection Engine**: The core logic.
4.  **Frontend**: React dashboard.
5.  **Integration**: End-to-end testing.

![Project Tasks](./project-tasks.png)


## Phase 2: Backend Core Implementation

With the plan in place, we moved to building the backend foundation using **FastAPI**.

### Key Decisions
- **Database**: We opted for **SQLite** (via `aiosqlite`) for the MVP to keep local development frictionless, avoiding the need for Docker at this stage. The code uses **SQLModel**, making it easy to switch to PostgreSQL later.
- **Authentication**: Implemented a standard JWT-based flow (`OAuth2PasswordBearer`).
- **Structure**: Adopted a clean, modular structure:
  - `app/models`: Pydantic and SQLModel definitions.
  - `app/api`: Route handlers.
  - `app/core`: Configuration and security logic.

### Progress
- [x] **Log Ingestion**: `POST /api/v1/logs/ingest` is live. It accepts JSON logs, validates them, and stores them asynchronously.
- [x] **Auth**: `POST /api/v1/auth/token` provides access tokens for secure endpoints.

We are now ready to build the **Detection Engine** on top of this solid foundation.

## Phase 3: Detection Engine

We moved to the core value proposition: **Detection**.

### Architecture
- **Rule Engine**: Implemented a JSON-based rule logic stored in the database.
- **Real-time Evaluation**: Used FastAPI `BackgroundTasks` to evaluate logs immediately after ingestion.
- **Alerting**: Matches generate `Alert` records for triage.

### Progress
- [x] **Models**: Created `Rule` and `Alert` SQLModel classes.
- [x] **Service**: Implemented `evaluate_log` logic supporting `eq` and `contains` operators.
- [x] **API**: Added CRUD endpoints for Rules and Alerts.
- [x] **Verification**: Validated the flow with `backend/tests/verify_detection.py`.

## Phase 4: Frontend Dashboard

We built the user interface using **React** and **Vite**, styled with **TailwindCSS (v4)**.

### Key Features
- **Dashboard**: Overview of system status.
- **Logs Viewer**: Real-time table of ingested logs with severity highlighting.
- **Alerts Management**: Interface to view and resolve security alerts.
- **Rules Editor**: Form to create and manage detection rules.

### Tech Stack Choices
- **React Query**: Used for efficient server state management and polling.
- **Lucide React**: For consistent and clean iconography.
- **Yarn**: Switched to Yarn for better dependency management in the frontend.

### Progress
- [x] **Setup**: Initialized Vite project with TypeScript.
- [x] **Layout**: Implemented a responsive sidebar layout.
- [x] **Pages**: Built Logs, Alerts, and Rules pages connected to the backend API.
- [x] **Polish**: Aligned UI elements and updated versioning to `v0.2.3`.
