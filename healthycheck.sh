#!/bin/bash

services=( "ghms_frontend_1" "ghms_backend_1" "ghms_redis_1" "ghms_mongo_1" "ghms_postgres_1" )
for service in "${services[@]}"; do
  echo "Checking health of $service..."
  until [ "$(docker inspect -f '{{.State.Health.Status}}' $service 2>/dev/null)" == "healthy" ]; do
    if [ $? -ne 0 ]; then
      echo "Error: $service does not exist or is unreachable."
      exit 1
    fi
    echo "$service is not healthy yet. Waiting..."
    sleep 5
  done
  echo "$service is healthy!"
done
