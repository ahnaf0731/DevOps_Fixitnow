# Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### 1. Build and Start All Services
```bash
docker-compose up -d --build
```

This will:
- Build the Spring Boot backend image
- Build the React frontend image
- Pull MySQL 8.0 image
- Create a Docker network
- Start all containers

### 2. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8090/api
- **MySQL Database**: localhost:3306

### 3. Check Container Status
```bash
docker-compose ps
```

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 5. Stop Services
```bash
docker-compose down
```

### 6. Stop and Remove Volumes (Clean Restart)
```bash
docker-compose down -v
```

## Services

### MySQL Database
- **Container**: fixitnow-mysql
- **Port**: 3306
- **Database**: fixitnow
- **Username**: fixitnow_user
- **Password**: fixitnow_pass
- **Root Password**: root

### Backend (Spring Boot)
- **Container**: fixitnow-backend
- **Port**: 8090
- **Profile**: docker
- **Base URL**: http://localhost:8090

### Frontend (React + Nginx)
- **Container**: fixitnow-frontend
- **Port**: 80
- **Base URL**: http://localhost

## Development Workflow

### Rebuild Specific Service
```bash
# Rebuild backend
docker-compose up -d --build backend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Access Container Shell
```bash
# Backend
docker exec -it fixitnow-backend sh

# Frontend
docker exec -it fixitnow-frontend sh

# MySQL
docker exec -it fixitnow-mysql bash
```

### Database Operations
```bash
# Connect to MySQL
docker exec -it fixitnow-mysql mysql -u fixitnow_user -pfixitnow_pass fixitnow

# Backup database
docker exec fixitnow-mysql mysqldump -u fixitnow_user -pfixitnow_pass fixitnow > backup.sql

# Restore database
docker exec -i fixitnow-mysql mysql -u fixitnow_user -pfixitnow_pass fixitnow < backup.sql
```

## Troubleshooting

### Backend Won't Start
1. Check MySQL is healthy: `docker-compose ps`
2. View backend logs: `docker-compose logs backend`
3. Verify database connection in logs

### Frontend Can't Reach Backend
1. Check nginx configuration in `fixitnow/nginx.conf`
2. Verify backend is running: `curl http://localhost:8090/api/categories`
3. Check network: `docker network inspect proj11_fixitnow-network`

### Port Conflicts
If ports 80, 8090, or 3306 are in use:
```yaml
# Edit docker-compose.yml and change port mappings
services:
  mysql:
    ports:
      - "3307:3306"  # Use 3307 instead
```

### Clean Start
```bash
# Remove all containers, networks, and volumes
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up -d --build
```

## Production Deployment

### Environment Variables
Create `.env` file in project root:
```env
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
SPRING_DATASOURCE_PASSWORD=your_secure_password
```

### Security Best Practices
1. Change default passwords in production
2. Use secrets management for sensitive data
3. Enable SSL/TLS for MySQL
4. Configure HTTPS for frontend (nginx SSL)
5. Set up firewall rules
6. Use non-root users in containers

### Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=3
```

## CI/CD Integration

### Build Images
```bash
# Backend
docker build -t fixitnow-backend:latest ./backend

# Frontend
docker build -t fixitnow-frontend:latest ./fixitnow
```

### Push to Registry
```bash
docker tag fixitnow-backend:latest your-registry/fixitnow-backend:latest
docker push your-registry/fixitnow-backend:latest
```

## Monitoring

### Resource Usage
```bash
docker stats fixitnow-backend fixitnow-frontend fixitnow-mysql
```

### Health Checks
```bash
# Backend health
curl http://localhost:8090/actuator/health

# MySQL health
docker exec fixitnow-mysql mysqladmin ping -h localhost
```
