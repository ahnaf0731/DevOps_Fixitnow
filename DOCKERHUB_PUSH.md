# Push Docker Images to DockerHub

## Step 1: Login to DockerHub

Open your WSL terminal and login:
```bash
docker login
```
Enter your DockerHub username and password when prompted.

## Step 2: Navigate to Project Directory

```bash
cd /mnt/c/Users/HP\ ZBook\ 15\ G7/Desktop/DevOps\ Project/final/Proj11
```

## Step 3: Build Docker Images

Replace `YOUR_DOCKERHUB_USERNAME` with your actual DockerHub username:

```bash
# Build Backend Image
docker build -t YOUR_DOCKERHUB_USERNAME/fixitnow-backend:latest ./backend

# Build Frontend Image
docker build -t YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:latest ./fixitnow
```

Example with username `john`:
```bash
docker build -t john/fixitnow-backend:latest ./backend
docker build -t john/fixitnow-frontend:latest ./fixitnow
```

## Step 4: Verify Images Built Successfully

```bash
docker images | grep fixitnow
```

You should see both images listed.

## Step 5: Push Images to DockerHub

```bash
# Push Backend
docker push YOUR_DOCKERHUB_USERNAME/fixitnow-backend:latest

# Push Frontend
docker push YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:latest
```

Example:
```bash
docker push john/fixitnow-backend:latest
docker push john/fixitnow-frontend:latest
```

## Step 6: Update docker-compose.yml

After pushing, update your `docker-compose.yml` to use the DockerHub images:

```yaml
services:
  backend:
    image: YOUR_DOCKERHUB_USERNAME/fixitnow-backend:latest
    # Remove the build section
    
  frontend:
    image: YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:latest
    # Remove the build section
```

## Alternative: Build and Push with Tags

If you want versioned images:

```bash
# Backend with version
docker build -t YOUR_DOCKERHUB_USERNAME/fixitnow-backend:v1.0 ./backend
docker build -t YOUR_DOCKERHUB_USERNAME/fixitnow-backend:latest ./backend
docker push YOUR_DOCKERHUB_USERNAME/fixitnow-backend:v1.0
docker push YOUR_DOCKERHUB_USERNAME/fixitnow-backend:latest

# Frontend with version
docker build -t YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:v1.0 ./fixitnow
docker build -t YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:latest ./fixitnow
docker push YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:v1.0
docker push YOUR_DOCKERHUB_USERNAME/fixitnow-frontend:latest
```

## Quick Script

Create a bash script `push-to-dockerhub.sh`:

```bash
#!/bin/bash

# Set your DockerHub username
DOCKERHUB_USERNAME="YOUR_USERNAME"

echo "Building images..."
docker build -t $DOCKERHUB_USERNAME/fixitnow-backend:latest ./backend
docker build -t $DOCKERHUB_USERNAME/fixitnow-frontend:latest ./fixitnow

echo "Pushing images to DockerHub..."
docker push $DOCKERHUB_USERNAME/fixitnow-backend:latest
docker push $DOCKERHUB_USERNAME/fixitnow-frontend:latest

echo "Done! Images pushed successfully."
echo "Backend: https://hub.docker.com/r/$DOCKERHUB_USERNAME/fixitnow-backend"
echo "Frontend: https://hub.docker.com/r/$DOCKERHUB_USERNAME/fixitnow-frontend"
```

Make it executable and run:
```bash
chmod +x push-to-dockerhub.sh
./push-to-dockerhub.sh
```

## Verify on DockerHub

Visit your DockerHub repositories:
- `https://hub.docker.com/r/YOUR_USERNAME/fixitnow-backend`
- `https://hub.docker.com/r/YOUR_USERNAME/fixitnow-frontend`

## Pull and Run from DockerHub

Anyone can now pull and run your images:

```bash
docker pull YOUR_USERNAME/fixitnow-backend:latest
docker pull YOUR_USERNAME/fixitnow-frontend:latest

# Or use docker-compose with updated image names
docker-compose up -d
```

## Troubleshooting

### Access Denied
Make sure you're logged in: `docker login`

### Image Too Large
- Check `.dockerignore` files are present
- Consider multi-stage builds (already implemented)

### Build Fails in WSL
- Ensure Docker daemon is running in WSL
- Check disk space: `df -h`
- Restart Docker: `sudo service docker restart`

### Permission Denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```

## Build Time Estimates
- Backend: ~3-5 minutes (Maven dependencies download)
- Frontend: ~2-4 minutes (npm install and build)
- Push time: Depends on your internet speed (~100-500MB per image)
