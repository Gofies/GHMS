#!/bin/bash

services=( "ghms_backend_1" "ghms_frontend_1" "ghms_redis_1" "ghms_mongo_1" "ghms_postgres_1" )
for service in "${services[@]}"; do
  echo "Checking health of $service..."
  until [ "`docker inspect -f {{.State.Health.Status}} $service`" == "healthy" ]; do
    echo "$service is not healthy yet. Waiting..."
    sleep 5
  done
  echo "$service is healthy!"
done
