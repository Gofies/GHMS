#!/bin/bash

# Wait for PostgreSQL to be ready
until PGPASSWORD=${POSTGRES_PASSWORD} psql -h citus-master -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c '\q' 2>/dev/null; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Wait for worker nodes to be ready
for i in $(seq 0 $((CITUS_WORKER_COUNT - 1))); do
  WORKER_NAME="softeng-citus-worker-$((i + 1))"
  until PGPASSWORD=${POSTGRES_PASSWORD} psql -h $WORKER_NAME -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c '\q' 2>/dev/null; do
    echo "Waiting for $WORKER_NAME to be ready..."
    sleep 2
  done
done

# Add each worker node
for i in $(seq 0 $((CITUS_WORKER_COUNT - 1))); do
  WORKER_NAME="softeng-citus-worker-$((i + 1))"
  echo "Adding worker node: $WORKER_NAME"
  PGPASSWORD=${POSTGRES_PASSWORD} psql -h citus-master -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT master_add_node('$WORKER_NAME', 5432);"
done

# Verify worker nodes
echo "Verifying worker nodes..."
PGPASSWORD=${POSTGRES_PASSWORD} psql -h citus-master -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT * FROM master_get_active_worker_nodes();"

# Add data
echo "Adding data..."
PGPASSWORD=${POSTGRES_PASSWORD} psql -h citus-master -U ${POSTGRES_USER} -d ${POSTGRES_DB} -f "/data/citus/data.sql" || echo "Error importing data"