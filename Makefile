# Project Variables
DOCKER_COMPOSE = docker-compose -f docker-compose.yml
FRONTEND_SERVICE = frontend
BACKEND_SERVICE = backend

# pull the changes from the repository from all branches
pull:
	git pull origin --all

# Build and run all services in detached mode
up:
	$(DOCKER_COMPOSE) up --build -d

# Stop and remove containers, networks, and volumes
down:
	$(DOCKER_COMPOSE) down

# Install dependencies for both frontend and backend
install:
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm install
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm install

# Install frontend dependencies
install-frontend:
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm install

# Install backend dependencies
install-backend:
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm install

# Run tests for both frontend and backend
test:
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm test
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm test

# Run backend tests
test-backend:
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm test

# Run frontend tests
test-frontend:
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm test

# Lint the backend code
lint-backend:
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm run lint

# Lint the frontend code
lint-frontend:
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm run lint

# Build the frontend (for production)
build-frontend:
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm run build

# Run the frontend in development mode
dev-frontend:
	$(DOCKER_COMPOSE) exec $(FRONTEND_SERVICE) npm run dev

# Build the backend (for production)
build-backend:
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm run build

# Run backend in development mode
dev-backend:
	$(DOCKER_COMPOSE) exec $(BACKEND_SERVICE) npm run dev

# View logs for a specific service (frontend or backend)
logs:
	$(DOCKER_COMPOSE) logs $(service)

# Restart the services
restart:
	$(DOCKER_COMPOSE) restart

# Clean up the project (remove Docker images, containers, and volumes)
clean:
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

	
########################################AI commands##############################################

# Start AI service
up-ai:
    docker-compose up -d ai-service

# Stop AI service
down-ai:
    docker-compose down ai-service

# AI Service Logs
logs-ai:
    docker-compose logs -f ai-service

# Run AI Service Tests
test-ai:
    docker-compose run --rm ai-service pytest
