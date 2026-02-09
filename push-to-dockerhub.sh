#!/bin/bash

# FixItNow Docker Build and Push Script
# Usage: ./push-to-dockerhub.sh YOUR_DOCKERHUB_USERNAME

if [ -z "$1" ]; then
    echo "Error: Please provide your DockerHub username"
    echo "Usage: ./push-to-dockerhub.sh YOUR_USERNAME"
    exit 1
fi

DOCKERHUB_USERNAME=$1

echo "========================================"
echo "Building FixItNow Docker Images"
echo "DockerHub Username: $DOCKERHUB_USERNAME"
echo "========================================"

# Navigate to project directory
cd /mnt/c/Users/HP\ ZBook\ 15\ G7/Desktop/DevOps\ Project/final/Proj11

# Check Docker is working
echo ""
echo "Checking Docker..."
docker --version

# Login to DockerHub
echo ""
echo "Please login to DockerHub:"
docker login

# Build Backend
echo ""
echo "Building Backend Image..."
docker build -t $DOCKERHUB_USERNAME/fixitnow-backend:latest ./backend

if [ $? -eq 0 ]; then
    echo "✓ Backend image built successfully"
else
    echo "✗ Backend build failed"
    exit 1
fi

# Build Frontend
echo ""
echo "Building Frontend Image..."
docker build -t $DOCKERHUB_USERNAME/fixitnow-frontend:latest ./fixitnow

if [ $? -eq 0 ]; then
    echo "✓ Frontend image built successfully"
else
    echo "✗ Frontend build failed"
    exit 1
fi

# Show built images
echo ""
echo "Built Images:"
docker images | grep fixitnow

# Push Backend
echo ""
echo "Pushing Backend to DockerHub..."
docker push $DOCKERHUB_USERNAME/fixitnow-backend:latest

if [ $? -eq 0 ]; then
    echo "✓ Backend pushed successfully"
else
    echo "✗ Backend push failed"
    exit 1
fi

# Push Frontend
echo ""
echo "Pushing Frontend to DockerHub..."
docker push $DOCKERHUB_USERNAME/fixitnow-frontend:latest

if [ $? -eq 0 ]; then
    echo "✓ Frontend pushed successfully"
else
    echo "✗ Frontend push failed"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ All Done!"
echo "========================================"
echo "Your images are now available on DockerHub:"
echo "Backend:  https://hub.docker.com/r/$DOCKERHUB_USERNAME/fixitnow-backend"
echo "Frontend: https://hub.docker.com/r/$DOCKERHUB_USERNAME/fixitnow-frontend"
echo ""
echo "Anyone can pull them using:"
echo "  docker pull $DOCKERHUB_USERNAME/fixitnow-backend:latest"
echo "  docker pull $DOCKERHUB_USERNAME/fixitnow-frontend:latest"
