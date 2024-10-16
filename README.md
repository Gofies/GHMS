# Hospital Management System

## Overview

This is a full-stack hospital management system built using:

- **Frontend:** React with Tailwind CSS
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

2. Make sure you have `make` installed on your system. If you are using a linux based system you probably have it, but in case run the command below. If you use Windows, google how to install make on windows.

   ```bash
   sudo apt install make
   ```

3. set up the project by running:

   ```bash
   make build
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

| Command                                                    | Description                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `make build`                                               | Build all service images (MongoDB, PostgreSQL, Redis, frontend, backend) |
| `make up`                                                  | Start all services (MongoDB, PostgreSQL, Redis, frontend, backend)       |
| `make down`                                                | Stop all running services.                                               |
| `make up service=<frontend/backend/etc...> "overloaded"`   | Start a specific service (MongoDB, PostgreSQL, Redis, frontend, backend) |
| `make down service=<frontend/backend/etc...> "overloaded"` | Stop a specific service (MongoDB, PostgreSQL, Redis, frontend, backend)  |
| `make restart`                                             | Restart all running services.                                            |
| `make clean`                                               | Remove all Docker images, containers, and volumes.                       |
| `make status`                                              | Show the status of all running services.                                 |
| `make logs`                                                | View logs for all services.                                              |

### How to attach to a running container

To attach to one of the running containers, you can use the following commands:

| Command                                       | Description                                                                   |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `make attach service=<postgres/redis/etc...>` | Attach to a running container (MongoDB, PostgreSQL, Redis, frontend, backend) |
| `make attach-psql`                            | Attach to the PostgreSQL container's cli.                                     |
| `make attach-redis`                           | Attach to the Redis container's cli.                                          |
| `make attach-mongo`                           | Attach to the MongoDB container's cli.                                        |

When running the commands make sure to check the `.env` file for the environment variables needed for the services to run. It is used to determine whether the services are running in development or production mode.

## Running the Project

1. Start all services: Use `make up-all` to start the Docker containers for the databases, backend, and frontend.

2. Accessing the services:

   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend:** [http://localhost:5000](http://localhost:5000)
   - **MongoDB:** `mongodb://localhost:27017`
   - **PostgreSQL:** `postgres://localhost:5432`
   - **Redis:** `redis://localhost:6379`

3. Stopping services: To stop and remove all running services, run `make down`.

## Pushing Code and Branching Patterns

We follow the Git Flow branching model with the following conventions:

### General Practices:

- Always create a new branch from `develop` for any feature or bug fix. **_NEVER_** push directly to `main`.
- Merges will be done via pull requests (PRs) after at least one code review.
- Before doing any commits or starting any development, make sure to pull the latest changes from all branches by running the following command:

  ```bash
   git pull --all
  ```

### Branch Types:

- **main:** The production-ready code.
- **develop:** The main branch for integration of all new features.
- **\<Team\>/\<feature-name\>:** Feature branches that implement new functionality.

### Pull Request (PR) Process:

- Always create a new branch from `develop` for any feature or bug fix.

  ```bash
  git checkout develop
  git checkout -b <team>/<feature-name>
  ```

- Push the feature branch to the remote repository:

  ```bash
  git push origin <team>/<feature-name>
  ```

- Create a pull request (PR) to merge your feature branch into `develop`.

- Ensure your code passes all tests and linting checks before submitting the PR.

- After approval, the feature will be merged into `develop`.

- Occasionally, `develop` will be merged into `main` for deployment testing.

### Commit Message Format:

We follow the Conventional Commits style:

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **refactor:** Refactoring code
- **test:** Adding or updating tests

Example:

```bash
git commit -m "feat: add patient appointment booking feature"
```

## Code Quality

### Testing

- All new code should include unit tests where applicable.

## CI Pipeline

Our CI pipeline runs on GitHub Actions. Every push or pull to `develop` branch will trigger:

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

# needs revisiting after a while

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
