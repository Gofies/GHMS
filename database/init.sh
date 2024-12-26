#!/bin/bash

echo "MongoDB Setup started... (approx. 1 minute)"

echo "MongoDB cluster Setup started..."

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
    "docker exec mongo-config-01 sh -c 'mongosh --port 27119 < /scripts/init-configserver.js'"
    "docker exec shard-01-node-a sh -c 'mongosh --port 27122 < /scripts/init-shard01.js'"
    "docker exec shard-02-node-a sh -c 'mongosh --port 27125 < /scripts/init-shard02.js'"
    "docker exec shard-03-node-a sh -c 'mongosh --port 27128 < /scripts/init-shard03.js'"
    "docker exec router-01 sh -c 'mongosh --port 27117 < /scripts/init-router.js'"
    "docker exec mongo-config-01 sh -c 'mongosh admin --port 27119 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker exec shard-01-node-a sh -c 'mongosh admin --port 27122 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker exec shard-02-node-a sh -c 'mongosh admin --port 27125 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker exec shard-03-node-a sh -c 'mongosh admin --port 27128 --eval \"db.createUser({user: \\\"$MONGO_USERNAME\\\", pwd: \\\"$MONGO_PASSWORD\\\", roles:[{role: \\\"root\\\", db: \\\"admin\\\"}]}); db.auth(\\\"$MONGO_USERNAME\\\", \\\"$MONGO_PASSWORD\\\");\"'"
    "docker exec router-01 mongosh --port 27117 -u \"$MONGO_USERNAME\" -p \"$MONGO_PASSWORD\" --authenticationDatabase admin --eval \"sh.enableSharding('HospitalDatabase')\""
)

# Execute each command with retries
for cmd in "${commands[@]}"; do
    execute_with_retry "$cmd"
done

collections=("admins" "appointments" "diagnoses" "doctors" "hospitals" "labtechnicians" "labtests" "patients" "polyclinics" "prescriptions" "treatments")
for collection in "${collections[@]}"; do
    log "Sharding the collection: $collection..."
    execute_with_retry "docker exec router-01 mongosh --port 27117 -u \"${MONGO_USERNAME}\" -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin --eval 'db.adminCommand({ shardCollection: \"HospitalDatabase.${collection}\", key: { _id: \"hashed\" } })'" # random
done

docker exec -it router-01 bash -c "echo 'sh.status()' | mongosh --port 27117 -u \"${MONGO_USERNAME}\" -p \"${MONGO_PASSWORD}\" --authenticationDatabase admin"

log "MongoDB cluster setup complete."


log "MongoDB mock data addition started..."

json_files=("admins.json" "doctors.json" "hospitals.json" "patients.json" "polyclinics.json" "appointments.json")
for json_file in "${json_files[@]}"; do

    execute_with_retry "docker cp ./database/mocks/$json_file router-01:/data/$json_file"
    
    collection_name=$(basename "$json_file" .json)
    
    execute_with_retry "docker exec router-01 sh -c \"mongoimport --host router-01 --port 27117 --db HospitalDatabase --collection $collection_name --file /data/$json_file --jsonArray --username $MONGO_USERNAME --password $MONGO_PASSWORD --authenticationDatabase admin\""
done


log "MongoDB mock data addition complete."

echo "MongoDB setup complete."