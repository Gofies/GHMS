include .env
export $(shell sed 's/=.*//' .env)

all: build up

deploy: build-deploy up

up: mongo-up
	docker-compose up -d $(service)

# Bring down services dynamically
down:
	docker-compose down $(service)

# Show logs
logs:
	docker-compose logs -f $(service)

# Build all services
build: mongo-build
	mkdir -p ssl
	bash gen_dev_ssl_cert.sh
	docker-compose build

build-deploy: mongo-build
	docker-compose build
	
prune:
	docker system prune -f

# Clean all services
clean:
	docker-compose down --volumes --remove-orphans
	rm -rf ssl
	rm -rf ./database/init_log.txt
	rm -rf ./database/persistant
	rm -rf ./database/mongodb-build/auth/mongodb-keyfile

# Restart all services
restart:
	docker-compose restart

# Show status of all services
status:
	docker-compose ps -a

#attach to a running container
attach:
	docker exec -it softeng-$(service)-1 sh

certificates:
	./gen_dev_ssl_cert.sh

##### Database Commands #####
mongo-build:
	openssl rand -base64 756 > ./database/mongodb-build/auth/mongodb-keyfile
	chmod 400 ./database/mongodb-build/auth/mongodb-keyfile

mongo-up:
	docker-compose up -d router01 router02 configsvr01 configsvr02 configsvr03 shard01-a shard01-b shard02-a shard02-b shard03-a shard03-b
	chmod +x ./database/init.sh
	./database/init.sh

attach-mongo:
	docker-compose exec router01 mongosh HospitalDatabase --port 27117 -u ${MONGO_USERNAME} -p ${MONGO_PASSWORD} --authenticationDatabase admin