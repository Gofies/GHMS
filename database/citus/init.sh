#!/bin/bash

# Define the container name for the master
MASTER_CONTAINER_NAME=ghms-citus-master-1

# Get number of workers
WORKER_COUNT=$(docker ps --format '{{.Names}}' | grep -c "citus-worker")

# Wait for the master to be ready
until docker exec "$MASTER_CONTAINER_NAME" psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c '\q'; do
  echo "Waiting for master database to be ready..."
  sleep 2
done

# Add each worker node
for i in $(seq 1 $WORKER_COUNT); do
  WORKER_NAME="citus-worker"
  if [ $WORKER_COUNT -gt 1 ]; then
    WORKER_NAME="ghms-citus-worker-${i}"
  fi
  
  echo "Adding worker node: $WORKER_NAME"
  docker exec "$MASTER_CONTAINER_NAME" psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT master_add_node('$WORKER_NAME', 5432);"
done

# Verify worker nodes
echo "Verifying worker nodes..."
docker exec "$MASTER_CONTAINER_NAME" psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT * FROM master_get_active_worker_nodes();"