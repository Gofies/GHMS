#!/bin/bash

services=( "backend" "frontend" "redis" "mongo" "postgres" )
for service in "${services[@]}"; do
  echo "Checking health of $service..."
  until [ "`docker inspect -f {{.State.Health.Status}} $service`" == "healthy" ]; do
    echo "$service is not healthy yet. Waiting..."
    sleep 5
  done
  echo "$service is healthy!"
done
