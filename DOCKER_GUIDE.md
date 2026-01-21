# Docker Deployment Guide for Tombolav2

## Overview
This guide explains how to run Tombolav2 in a Docker container for easy deployment and portability.

## Prerequisites

### Install Docker
- **Windows/Mac**: Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux**: 
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```

Verify installation:
```bash
docker --version
docker-compose --version
```

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Navigate to the Tombolav2 directory**:
   ```bash
   cd c:\Users\VincentTerrone\Downloads\Git\Tombolav2
   ```

2. **Build and start the container**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Open browser: http://localhost:5000
   - From other devices: http://YOUR_IP:5000

4. **View logs**:
   ```bash
   docker-compose logs -f
   ```

5. **Stop the container**:
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker Commands

1. **Build the image**:
   ```bash
   docker build -t tombolav2 .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name tombolav2 \
     -p 5000:5000 \
     -v $(pwd)/tombola_data.json:/app/tombola_data.json \
     tombolav2
   ```

3. **Stop the container**:
   ```bash
   docker stop tombolav2
   docker rm tombolav2
   ```

## File Structure

```
Tombolav2/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore          # Files to exclude from image
├── requirements.txt       # Python dependencies
├── app.py                # Flask application
├── tombola_data.json     # Game data (persisted)
├── static/               # CSS, JS files
├── templates/            # HTML templates
└── data/                 # Additional data directory
```

## Docker Configuration Details

### Dockerfile
- **Base Image**: Python 3.11 slim (lightweight)
- **Working Directory**: /app
- **Exposed Port**: 5000
- **Dependencies**: Installed from requirements.txt
- **Command**: Runs `python app.py`

### docker-compose.yml
- **Service Name**: tombolav2
- **Port Mapping**: 5000:5000 (host:container)
- **Volumes**: 
  - `./tombola_data.json` - Game data persistence
  - `./data` - Additional data directory
- **Restart Policy**: unless-stopped
- **Network**: Custom bridge network

## Data Persistence

### Game Data
The `tombola_data.json` file is mounted as a volume, so your game history persists even if the container is recreated:

```yaml
volumes:
  - ./tombola_data.json:/app/tombola_data.json
```

### Backup Data
To backup your game data:
```bash
# Copy from container
docker cp tombolav2:/app/tombola_data.json ./backup_tombola_data.json

# Or just copy the local file (since it's mounted)
cp tombola_data.json backup_tombola_data.json
```

## Common Docker Commands

### Container Management
```bash
# Start container
docker-compose up -d

# Stop container
docker-compose down

# Restart container
docker-compose restart

# View running containers
docker ps

# View all containers
docker ps -a
```

### Logs and Debugging
```bash
# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# Execute command in running container
docker exec -it tombolav2 bash

# Check container status
docker-compose ps
```

### Image Management
```bash
# List images
docker images

# Remove image
docker rmi tombolav2

# Rebuild image
docker-compose build

# Rebuild without cache
docker-compose build --no-cache
```

## Network Access

### Local Network
The container is accessible on your local network:

1. Find your host IP:
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig` or `ip addr`

2. Access from other devices:
   ```
   http://YOUR_HOST_IP:5000
   ```

### Port Configuration
To change the port, edit `docker-compose.yml`:
```yaml
ports:
  - "8080:5000"  # Access on port 8080 instead
```

## Production Deployment

### Environment Variables
Add environment variables in `docker-compose.yml`:
```yaml
environment:
  - FLASK_ENV=production
  - SECRET_KEY=your-secret-key-here
  - MAX_CONNECTIONS=100
```

### Reverse Proxy (Nginx)
For production, use Nginx as reverse proxy:

```yaml
# Add to docker-compose.yml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
  depends_on:
    - tombolav2
```

### HTTPS/SSL
For HTTPS, use Let's Encrypt with Nginx:
```bash
# Install certbot
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d yourdomain.com
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac
```

### Can't Access from Other Devices
1. Check firewall settings
2. Verify container is running: `docker ps`
3. Test locally first: http://localhost:5000
4. Ensure correct IP address

### Data Not Persisting
1. Check volume mounts: `docker inspect tombolav2`
2. Verify file permissions
3. Ensure `tombola_data.json` exists before starting

### WebSocket Connection Issues
1. Ensure port 5000 is properly exposed
2. Check if firewall blocks WebSocket connections
3. Verify CORS settings in app.py

## Updating the Application

### Update Code
```bash
# Stop container
docker-compose down

# Pull latest code (if using git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Update Dependencies
```bash
# Edit requirements.txt
# Then rebuild
docker-compose build --no-cache
docker-compose up -d
```

## Docker Hub Deployment

### Push to Docker Hub
```bash
# Login
docker login

# Tag image
docker tag tombolav2 yourusername/tombolav2:latest

# Push
docker push yourusername/tombolav2:latest
```

### Pull and Run
```bash
# On another machine
docker pull yourusername/tombolav2:latest
docker run -d -p 5000:5000 yourusername/tombolav2:latest
```

## Resource Limits

### Set Memory/CPU Limits
Edit `docker-compose.yml`:
```yaml
services:
  tombolav2:
    # ... other config ...
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Health Checks

### Add Health Check
Edit `docker-compose.yml`:
```yaml
services:
  tombolav2:
    # ... other config ...
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Multi-Container Setup

### Add Redis for Session Storage
```yaml
services:
  tombolav2:
    # ... existing config ...
    depends_on:
      - redis
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

## Backup and Restore

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker cp tombolav2:/app/tombola_data.json ./backups/tombola_data_$DATE.json
```

### Restore from Backup
```bash
# Stop container
docker-compose down

# Restore file
cp backups/tombola_data_20260121.json tombola_data.json

# Start container
docker-compose up -d
```

## Performance Tips

1. **Use slim base images** (already using python:3.11-slim)
2. **Multi-stage builds** for smaller images
3. **Layer caching** - Copy requirements.txt before code
4. **Volume mounts** for development
5. **Resource limits** to prevent container from consuming too much

## Security Best Practices

1. **Don't run as root** - Add user in Dockerfile
2. **Use secrets** for sensitive data
3. **Keep images updated** - Regularly rebuild
4. **Scan for vulnerabilities**: `docker scan tombolav2`
5. **Use private registry** for production images

## Monitoring

### View Resource Usage
```bash
# Real-time stats
docker stats tombolav2

# Container info
docker inspect tombolav2
```

### Logging to File
```bash
# Redirect logs to file
docker-compose logs > tombolav2.log
```

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify configuration: `docker-compose config`
3. Test locally first
4. Check Docker documentation: https://docs.docker.com

---

**Your Tombolav2 app is now containerized and ready for deployment! 🐳**