# Bring up all services
up-all:
	docker-compose up -d

# Stop all services
down-all:
	docker-compose down

# Bring up services dynamically
up:
	docker-compose up $(service)

# Bring down services dynamically
down:
	docker-compose down $(service)

# Usage:
# To run: make up service=frontend
# To stop: make down service=frontend

# Show logs
logs:
	docker-compose logs -f
# Build all services
build:
	docker-compose build

# Clean all services
clean:
	docker-compose down --rmi all --volumes --remove-orphans

# Restart all services
restart:
	docker-compose restart

# Show status of all services
status:
	docker-compose ps
