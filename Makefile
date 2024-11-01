include .env
export $(shell sed 's/=.*//' .env)

# Bring up services dynamically
up:
	docker-compose up $(service)

# Bring down services dynamically
down:
	docker-compose down $(service)

# Show logs
logs:
	docker-compose logs -f $(service)

# Build all services
build:
	docker-compose build

# Clean all services
clean:
	docker-compose down --rmi all --volumes --remove-orphans

# prune all services
prune:
	docker system prune -f

# Restart all services
restart:
	docker-compose restart

# Show status of all services
status:
	docker-compose ps

#attach to a running container
attach:
	docker exec -it softeng-$(service)-1 sh


##### Database Makefile Commands #####

attach-citus-master:
	docker exec -it softeng-citus-master-1 psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

attach-citus-worker:
	docker exec -it softeng-citus-worker-1 psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

attach-mongo:
	docker exec -it softeng-mongo-1 mongosh -u admin -p admin

mongo-up:
	docker-compose up -d mongo

citus-up:
	docker-compose up -d citus-master citus-worker citus-init

citus-down:
	docker-compose down citus-master citus-worker citus-init

citus-logs:
	docker-compose logs -f citus-master citus-worker citus-init