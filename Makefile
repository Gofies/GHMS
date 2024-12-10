include .env
export $(shell sed 's/=.*//' .env)

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
	mkdir -p ssl
	bash gen_dev_ssl_cert.sh
	docker-compose build

# Clean all services
clean:
	docker-compose down --volumes --remove-orphans
	rm -rf ssl
	docker system prune
	rm -rf ./database/mongodb/sh*
	rm -rf ./database/mongodb/con*
	rm -rf ./database/postgres/pgdata

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

certificates:
	./gen_dev_ssl_cert.sh

##### Database Commands #####
mongo-up:
	docker-compose up -d configsvr1 shard1 shard2 mongos mongo-init

psql-up:
	docker-compose up -d postgres

attach-psql:
	docker compose exec postgres psql -U ${POSTGRES_USERNAME} -d ${POSTGRES_DATABASE}

attach-mongos:
	docker exec -it mongos mongosh --port 27020

attach-configsvr1:
	docker exec -it configsvr1 mongosh --port 27019

attach-shard1:
	docker exec -it shard1 mongosh --port 27018

attach-shard2:
	docker exec -it shard2 mongosh --port 27017