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

