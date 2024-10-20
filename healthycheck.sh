#!/bin/bash


services=( "ghms_backend_1" "ghms_frontend_1" "ghms_redis_1" "ghms_mongo_1" "ghms_postgres_1" )
for service in "${services[@]}"; do
printf "Checking health of %s...\n" "$service"
until [ "`docker inspect -f {{.State.Health.Status}} $service`" == "healthy" ]; do
    printf "%s is not healthy yet. Waiting...\n" "$service"
    sleep 5
done
printf "%s is healthy!\n" "$service"
done