# Hospital Management System

## Overview

This is a full-stack hospital management system built using:

- **Frontend:** React
- **Backend:** Node.js with Express
- **Databases:** MongoDB, PostgreSQL, Redis (for caching)
- **AI Model:** An LLM used for live chat functionality
- **DevOps:** Docker, Docker Compose, GitHub Actions for CI

This document explains the setup process, development workflows, Makefile commands, and project conventions.

## Table of Contents

- [Getting Started](#getting-started)
- [Makefile Commands](#makefile-commands)
- [Running the Project](#running-the-project)
- [Pushing Code and Branching Patterns](#pushing-code-and-branching-patterns)
- [Code Quality](#code-quality)
- [CI Pipeline](#ci-pipeline)
- [Development Tips](#development-tips)
- [AI Services](#ai-services)

## Getting Started

### Prerequisites

Before you can run the project, make sure you have the following installed:

- Docker
- Docker Compose
- Node.js (for local development if needed "backend/frontend teams")
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <git@github.com:Gofies/GHMS.git>
   cd GHMS
   ```

2. Make sure you have `make` installed on your system. If not, you can install it by running on Linux. If you use Windows, please search for the installation instructions:

   ```bash
   sudo apt install make
   ```

3. Install project dependencies by running the following command inside the project root:

   ```bash
   make install
   ```

4. To start the services, run:

   ```bash
   make up
   ```

   This will spin up the Docker containers for MongoDB, PostgreSQL, Redis, and both the frontend and backend.

5. To stop the services:

   ```bash
   make down
   ```

## Makefile Commands

The project uses a Makefile to simplify common tasks. Below are the available commands:

### Service Management

| Command        | Description                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------- |
| `make up`      | Build and run all services (MongoDB, PostgreSQL, Redis, frontend, backend) in detached mode. |
| `make down`    | Stop and remove all services (containers, networks, volumes).                                |
| `make restart` | Restart all running services.                                                                |
| `make clean`   | Remove all Docker images, containers, and volumes.                                           |

### Dependency Management

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `make install`          | Install dependencies for frontend and backend. |
| `make install-frontend` | Install dependencies for the frontend.         |
| `make install-backend`  | Install dependencies for the backend.          |

### Testing and Linting

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `make test`          | Run tests for both frontend and backend. |
| `make test-frontend` | Run tests for the frontend.              |
| `make test-backend`  | Run tests for the backend.               |
| `make lint-frontend` | Lint the frontend code.                  |
| `make lint-backend`  | Lint the backend code.                   |

### Logs

| Command                            | Description                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `make logs service=<service_name>` | View logs for a specific service (e.g., frontend, backend, postgres, mongodb, redis). |

### Development

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `make dev-frontend` | Build the frontend for development. |
| `make dev-backend`  | Build the backend for development.  |

### Building

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `make build-frontend` | Build the frontend for production. |
| `make build-backend`  | Build the backend for production.  |

## Running the Project

1. Start all services: Use `make up` to start the Docker containers for the databases, backend, and frontend.

2. Accessing the services:

   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend:** [http://localhost:5000/api](http://localhost:5000/api)
   - **MongoDB:** `mongodb://localhost:27017`
   - **PostgreSQL:** `postgres://localhost:5432`
   - **Redis:** `redis://localhost:6379`

3. Stopping services: To stop and remove all running services, run `make down`.

## Pushing Code and Branching Patterns

We follow the Git Flow branching model with the following conventions:

### General Practices:

- Always create a new branch from `develop` for any feature or bug fix. **_NEVER_** push directly to `main`.
- Merges will be done via pull requests (PRs) after at least one code review.
- Before doing any commits or starting any development, make sure to pull the latest changes from the `develop` branch or run the following command:

  ```bash
  make pull
  ```

### Branch Types:

- **main:** The production-ready code.
- **develop:** The main branch for integration of all new features.
- **\<Team\>/\<feature-name\>:** Feature branches that implement new functionality.

### Pull Request (PR) Process:

- Always create a new branch from `develop` for any feature or bug fix.

  ```bash
  git checkout develop
  git checkout -b feature/<feature-name>
  ```

- Push the feature branch to the remote repository:

  ```bash
  git push origin feature/<feature-name>
  ```

- Create a pull request (PR) to merge your feature branch into `develop`.

- Ensure your code passes all tests and linting checks before submitting the PR.

- After approval, the feature will be merged into `develop`.

### Commit Message Format:

We follow the Conventional Commits style:

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **style:** Code formatting, no logic change
- **refactor:** Refactoring code
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

Example:

```bash
git commit -m "feat: add patient appointment booking feature"
```

## Code Quality

### Linting

- Linting is enforced for both the frontend and backend. Run `make lint-backend` and `make lint-frontend` to ensure your code passes linting checks.

### Testing

- All new code should include unit tests where applicable. Run tests locally using `make test` before pushing changes.

## CI Pipeline

Our CI pipeline runs on GitHub Actions. Every push to `develop` or `feature/*` branches will trigger:

1. **Build**: The CI will build the Docker containers for the project.
2. **Install Dependencies**: Dependencies for both frontend and backend will be installed.
3. **Run Tests**: Tests for both frontend and backend will be executed.
4. **Tear Down**: The Docker environment will be cleaned up after testing.

If all checks pass, the changes can be merged into `develop` after a code review.

## Development Tips

- **Consistent Environment:** Use Docker Compose to ensure your local development environment mirrors the CI environment.
- **Makefile:** Use the provided Makefile to simplify common tasks and reduce errors.
- **Code Review:** Always request a code review before merging any changes to `develop`.
- **Documentation:** Keep this `README.md` up-to-date as the project evolves.

## AI Services

The AI services consist of two main models one responsible of handling live chat with patients using a language model, and the other one being a cluster of models responsible of analyzing the patient based on the reports and the data provided by the patient.

### Running the AI Service

To run the AI service in isolation, use:

```bash
make up-ai
```

To stop the AI service:

```bash
make down-ai
```

### Interacting with the AI Service

The AI service exposes a REST API at `http://localhost:8000/chat`. You can send a POST request with a patient's query, and it will return the AI-generated response.

Example request payload:

```json
{
  "patientQuery": "How can I book an appointment?"
}
```

### AI Service Testing

To run AI service tests:

```bash
make test-ai
```

### AI Service Virtual Environment

The AI service uses a virtual environment to manage its Python dependencies. This is handled within the Docker container, ensuring that the environment is consistent across all setups.

#### Dependencies

Dependencies are defined in the `requirements.txt` file located in the `ai-service` directory. They are installed in a virtual environment created inside the Docker container.

### Building the AI Service

To build the AI service, ensure that you have Docker and Docker Compose installed, then run:

```bash
make up-ai
```

### Summary

This setup will help keep your AI service's dependencies isolated and manageable while using Docker, and your `.gitignore` will ensure that unnecessary files are not tracked by Git.
