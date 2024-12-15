#!/bin/bash

echo "MongoDB cluster setup started. Please wait..."

LOG_FILE="./database/init_log.txt"

log() {
    echo "$1" >> "$LOG_FILE"
}

> "$LOG_FILE"

# Check if the .env file exists
if [ ! -f ./.env ]; then
  echo ".env file not found!"
  exit 1
fi

# Source the .env file
source ./.env

# Maximum number of retries
MAX_RETRIES=15
# Delay between retries in seconds
RETRY_DELAY=1

# Function to execute a command with retries and log output
execute_with_retry() {
    local cmd=$1
    local retries=0
    local success=0

    while [ $retries -lt $MAX_RETRIES ]; do
        log "Executing: $cmd (attempt $((retries + 1))/$MAX_RETRIES)"
        eval $cmd >> "$LOG_FILE" 2>&1
        if [ $? -eq 0 ]; then
            success=1
            break
        fi
        retries=$((retries + 1))
        log "Command failed. Retrying in $RETRY_DELAY seconds..."
        sleep $RETRY_DELAY
    done

    if [ $success -eq 0 ]; then
        log "Command failed after $MAX_RETRIES attempts: $cmd"
        exit 1
    fi
}

commands=(
    "docker-compose exec configsvr01 sh -c 'mongosh --port 27119 < /scripts/init-configserver.js'"
    "docker-compose exec shard01-a sh -c 'mongosh --port 27122 < /scripts/init-shard01.js'"
    "docker-compose exec shard02-a sh -c 'mongosh --port 27125 < /scripts/init-shard02.js'"
    "docker-compose exec shard03-a sh -c 'mongosh --port 27128 < /scripts/init-shard03.js'"
    "docker-compose exec router01 sh -c 'mongosh --port 27117 < /scripts/init-router.js'"
    "docker-compose exec configsvr01 sh -c 'mongosh admin --port 27119 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker-compose exec shard01-a sh -c 'mongosh admin --port 27122 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker-compose exec shard02-a sh -c 'mongosh admin --port 27125 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker-compose exec shard03-a sh -c 'mongosh admin --port 27128 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker-compose exec router01 mongosh --port 27117 -u \"$MONGO_USERNAME\" -p \"$MONGO_PASSWORD\" --authenticationDatabase admin --eval \"sh.enableSharding('HospitalDatabase')\""
)

# Execute each command with retries
for cmd in "${commands[@]}"; do
    execute_with_retry "$cmd"
done

collections=("admins" "appointments" "diagnoses" "doctors" "hospitals" "labtechnicians" "patients" "polyclinics" "prescriptions")

for collection in "${collections[@]}"; do
    log "Sharding the collection: $collection..."
    execute_with_retry "docker-compose exec router01 mongosh --port 27117 -u \"${MONGO_USERNAME}\" -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin --eval 'db.adminCommand({ shardCollection: \"HospitalDatabase.${collection}\", key: { _id: \"hashed\" } })'" # random
done

log docker exec -it router-01 bash -c "echo 'sh.status()' | mongosh --port 27117 -u \"${MONGO_USERNAME}\" -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin"

log "MongoDB cluster cluster setup complete."

echo "MongoDB cluster cluster setup complete."