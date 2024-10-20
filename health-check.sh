#!/bin/bash

# Function to check health status of a service
check_service_health() {
    local service=$1
    local max_attempts=$2
    local attempt=1
    
    echo "Checking health status of $service..."
    
    while [[ $attempt -le $max_attempts ]]; do
        # Get container ID first
        container_id=$(docker-compose -f docker-compose.yml ps -q "$service")
        
        if [[ -z "$container_id" ]]; then
            echo "⚠️  No container found for $service"
            return 1
        fi
        
        # Get health status using container ID
        health_status=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id" 2>/dev/null)
        
        echo "Debug: Service=$service, Attempt=$attempt/$max_attempts, Status=$health_status"
        
        if [[ "$health_status" == "healthy" ]]; then
            echo "✅ $service is healthy"
            return 0
        fi
        
        # If container is running but no health check is configured
        if [[ -z "$health_status" ]] && [[ $(docker inspect --format='{{.State.Status}}' "$container_id") == "running" ]]; then
            echo "ℹ️  $service is running (no health check configured)"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts: $service is $health_status"
        attempt=$((attempt + 1))
        sleep 10
    done
    
    echo "❌ $service failed to become healthy after $max_attempts attempts"
    return 1
}

# Main health check function
check_all_services_health() {
    local timeout_minutes=5
    local max_attempts=$((timeout_minutes * 6)) # 6 attempts per minute (10-second intervals)
    local services=("postgres" "mongo" "redis" "nginx")
    local failed_services=()
    
    echo "Starting health checks for all services..."
    echo "Timeout set to $timeout_minutes minutes ($max_attempts attempts)"
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker is not running or not accessible"
        return 1
    fi
    
    # Check if docker-compose file exists
    if [[ ! -f "docker-compose.yml" ]]; then
        echo "❌ docker-compose.yml not found in current directory"
        return 1
    fi
    
    # First check if services are running
    echo "Checking if services are up..."
    docker-compose -f docker-compose.yml ps
    
    for service in "${services[@]}"; do
        if ! check_service_health "$service" "$max_attempts"; then
            failed_services+=("$service")
        fi
    done
    
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        echo "🎉 All services are healthy!"
        return 0
    else
        echo "❌ The following services failed health checks:"
        printf '%s\n' "${failed_services[@]}"
        return 1
    fi
}

# Enable debug mode
#set -x

# Run the health checks
check_all_services_health

# Exit with the status of the health check
exit $?
