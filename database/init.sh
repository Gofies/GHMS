#!/bin/bash

echo "MongoDB Setup started... (approx. 1 minute)"
LOG_FILE="./database/init_log.txt"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

> "$LOG_FILE"

log "MongoDB cluster setup started..."

# Check if the .env file exists
if [ ! -f ./.env ]; then
  log ".env file not found!"
  exit 1
fi

# Source the .env file
log "Loading environment variables from .env file."
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
            log "Command succeeded: $cmd"
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
    "docker-compose exec configsvr01 sh -c 'mongosh admin --port 27119 --eval \"db.createUser({user: \"$MONGO_USERNAME\", pwd: \"$MONGO_PASSWORD\", roles:[{role: \"root\", db: \"admin\"}]}); db.auth(\"$MONGO_USERNAME\", \"$MONGO_PASSWORD\");\"'"
    "docker-compose exec shard01-a sh -c 'mongosh admin --port 27122 --eval \"db.createUser({user: \"$MONGO_USERNAME\", pwd: \"$MONGO_PASSWORD\", roles:[{role: \"root\", db: \"admin\"}]}); db.auth(\"$MONGO_USERNAME\", \"$MONGO_PASSWORD\");\"'"
    "docker-compose exec shard02-a sh -c 'mongosh admin --port 27125 --eval \"db.createUser({user: \"$MONGO_USERNAME\", pwd: \"$MONGO_PASSWORD\", roles:[{role: \"root\", db: \"admin\"}]}); db.auth(\"$MONGO_USERNAME\", \"$MONGO_PASSWORD\");\"'"
    "docker-compose exec shard03-a sh -c 'mongosh admin --port 27128 --eval \"db.createUser({user: \"$MONGO_USERNAME\", pwd: \"$MONGO_PASSWORD\", roles:[{role: \"root\", db: \"admin\"}]}); db.auth(\"$MONGO_USERNAME\", \"$MONGO_PASSWORD\");\"'"
    "docker-compose exec router01 mongosh --port 27117 -u \"$MONGO_USERNAME\" -p \"$MONGO_PASSWORD\" --authenticationDatabase admin --eval \"sh.enableSharding('HospitalDatabase')\""
)

# Execute each command with retries
for cmd in "${commands[@]}"; do
    log "Starting command: $cmd"
    execute_with_retry "$cmd"
    log "Finished command: $cmd"
    log "---------------------------------------------"
done

collections=("admins" "appointments" "diagnoses" "doctors" "hospitals" "labtechnicians" "labtests" "patients" "polyclinics" "prescriptions" "treatments")
for collection in "${collections[@]}"; do
    log "Sharding the collection: $collection..."
    execute_with_retry "docker-compose exec router01 mongosh --port 27117 -u \"${MONGO_USERNAME}\" -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin --eval 'db.adminCommand({ shardCollection: \"HospitalDatabase.${collection}\", key: { _id: \"hashed\" } })'"
    log "Sharding completed for collection: $collection"
    log "---------------------------------------------"
done

log "Verifying sharding status..."
execute_with_retry "docker exec -it router-01 bash -c 'echo \"sh.status()\" | mongosh --port 27117 -u \"${MONGO_USERNAME}\" -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin'"

log "MongoDB cluster setup complete."
log "---------------------------------------------"

log "MongoDB mock data addition started..."

json_files=("admins.json" "doctors.json" "appointments.json" "hospitals.json" "patients.json" "polyclinics.json" "prescriptions.json")
for json_file in "${json_files[@]}"; do
    log "Copying JSON file: $json_file to router-01"
    docker cp ./database/mocks/$json_file router-01:/data/$json_file

    collection_name=$(basename "$json_file" .json)

    log "Importing JSON file: $json_file into collection: $collection_name"
    execute_with_retry "docker-compose exec router01 sh -c 'mongoimport --host router01 --port 27117 --db HospitalDatabase --collection $collection_name --file /data/$json_file --jsonArray --username $MONGO_USERNAME --password $MONGO_PASSWORD --authenticationDatabase admin'"
    log "Finished importing JSON file: $json_file"
    log "---------------------------------------------"

done

log "MongoDB mock data addition complete."

log "MongoDB setup complete."
