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

#attach to postgres container's cli
attach-psql:
	docker exec -it softeng-postgres-1 psql -U admin

#attach to redis container's cli
attach-redis:
	docker exec -it softeng-redis-1 redis-cli

#attach to mongodb container's cli
attach-mongo:
	docker exec -it softeng-mongo-1 mongo -u admin -p admin --authenticationDatabase admin
	
certificates:
	./gen_dev_ssl_cert.sh