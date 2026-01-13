# Deployment Guide for hirewow.tech

This guide covers deploying the HireWow application to a production server with the domain `hirewow.tech`.

## Prerequisites

- Server with Docker and Docker Compose installed
- Domain `hirewow.tech` pointing to your server's IP address
- SSH access to the server
- (Optional) SSL certificate from Let's Encrypt

## Step 1: Server Setup

### 1.1. Install Docker and Docker Compose

**Recommended Method (Official Script):**
```bash
# On Ubuntu/Debian - Use official Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

**Alternative: Manual Installation (if script fails)**

If you encounter issues with `containerd.io` package (404 errors), especially on Ubuntu 24.04 (Noble), try:

```bash
# Method 1: Install containerd.io from Ubuntu repos first
sudo apt-get update
sudo apt-get install containerd.io
sudo apt-get install docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin

# Method 2: For Ubuntu 24.04 (Noble) - Use Jammy repository (compatible)
# This works because Docker packages are compatible across Ubuntu versions
sudo rm -f /etc/apt/sources.list.d/docker.list

# Setup Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Use Jammy repository for Noble (packages are compatible)
echo \
  "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  jammy stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install containerd.io docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin
```

**For Ubuntu 24.04 (Noble) amd64 specifically:**

**Option A: Install available version 2.2.0 (if 2.2.1 not available)**
```bash
# Clean up any existing Docker setup
sudo apt-get remove docker docker-engine docker.io containerd runc 2>/dev/null
sudo rm -f /etc/apt/sources.list.d/docker.list

# Install prerequisites
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository for Noble
echo \
  "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  noble stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package lists
sudo apt-get update

# Install specific available version (2.2.0) instead of latest
sudo apt-get install containerd.io=2.2.0-1~ubuntu.24.04~noble docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin

# Or manually download and install containerd.io 2.2.0
cd /tmp
wget https://download.docker.com/linux/ubuntu/dists/noble/pool/stable/amd64/containerd.io_2.2.0-1~ubuntu.24.04~noble_amd64.deb
sudo dpkg -i containerd.io_2.2.0-1~ubuntu.24.04~noble_amd64.deb
sudo apt-get install -f
sudo apt-get install docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin
```

**Option B: Use Jammy repository (more stable, recommended)**
```bash
# Clean up any existing Docker setup
sudo apt-get remove docker docker-engine docker.io containerd runc 2>/dev/null
sudo rm -f /etc/apt/sources.list.d/docker.list

# Install prerequisites
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository using Jammy (works for Noble)
echo \
  "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  jammy stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install
sudo apt-get update
sudo apt-get install containerd.io docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin
```

**Note:** Docker Compose is included with Docker Engine (as a plugin), so separate installation is not needed.

### 1.2. Clone/Upload Project

```bash
# On your server
git clone <your-repo-url> /opt/hirewow
cd /opt/hirewow
```

## Step 2: Configuration

### 2.1. Create Environment Files

```bash
# Copy example files
cp .env.production.example .env.production
cp backend/.env.example backend/.env

# Edit backend/.env with your production values
nano backend/.env
```

**Important:** Update these values in `backend/.env`:
- `JWT_SECRET`: Generate a strong random secret (e.g., `openssl rand -hex 32`)
- `POSTGRES_PASSWORD`: Use a strong password
- `DATABASE_URL`: Update with your database password

### 2.2. Update Frontend Build Configuration

Create `.env.production` in the project root:
```bash
VITE_API_BASE_URL=https://hirewow.tech
```

Or set it when building:
```bash
export VITE_API_BASE_URL=https://hirewow.tech
```

### 2.3. Update Nginx Configuration

For **staging/testing** (HTTP only):
```bash
cp nginx/nginx.staging.conf nginx/nginx.conf
```

For **production** (HTTPS):
```bash
cp nginx/nginx.production.conf nginx/nginx.conf
```

## Step 3: SSL Certificate (Production)

### 3.1. Install Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

### 3.2. Obtain SSL Certificate

**Option A: Using standalone mode (recommended for first time)**

```bash
# Stop nginx temporarily
docker-compose down proxy

# Get certificate
sudo certbot certonly --standalone -d hirewow.tech -d www.hirewow.tech

# Certificates will be in /etc/letsencrypt/live/hirewow.tech/
```

**Option B: Using nginx plugin (after initial setup)**

```bash
sudo certbot --nginx -d hirewow.tech -d www.hirewow.tech
```

### 3.3. Update docker-compose.prod.yml

Uncomment and update the SSL certificate volume mounts:

```yaml
proxy:
  volumes:
    - ./nginx/nginx.production.conf:/etc/nginx/nginx.conf:ro
    - web_static:/usr/share/nginx/html
    - /etc/letsencrypt:/etc/letsencrypt:ro
    - /var/www/certbot:/var/www/certbot:ro
```

### 3.4. Auto-renewal

Add to crontab:
```bash
sudo crontab -e
# Add this line:
0 0 * * * certbot renew --quiet && docker-compose -f /opt/hirewow/docker-compose.yml -f /opt/hirewow/docker-compose.prod.yml restart proxy
```

## Step 4: Build and Deploy

### 4.1. Build Images

```bash
# Build all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Or build specific services
docker-compose build web api
```

### 4.2. Start Services

```bash
# Start all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4.3. Verify Deployment

```bash
# Check if services are running
curl http://localhost/health

# Check API health
curl http://localhost/health

# Test from browser
# Visit: https://hirewow.tech
```

## Step 5: DNS Configuration

Ensure your domain DNS records point to your server:

```
A     @            -> YOUR_SERVER_IP
A     www          -> YOUR_SERVER_IP
```

## Step 6: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

## Step 7: Monitoring and Maintenance

### 7.1. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f proxy
```

### 7.2. Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Or rebuild specific service
docker-compose build web
docker-compose up -d web
```

### 7.3. Database Backups

```bash
# Backup database
docker-compose exec db pg_dump -U hirewow appdb > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T db psql -U hirewow appdb < backup_20241220.sql
```

## Troubleshooting

### Issue: 502 Bad Gateway

- Check if API service is running: `docker-compose ps api`
- Check API logs: `docker-compose logs api`
- Verify API health: `docker-compose exec api curl http://localhost:8000/health`

### Issue: CORS Errors

- Verify `CORS_ORIGINS` in `backend/.env` includes your domain
- Check backend logs for CORS-related errors
- Restart API service: `docker-compose restart api`

### Issue: SSL Certificate Not Working

- Verify certificate paths in `docker-compose.prod.yml`
- Check certificate expiration: `sudo certbot certificates`
- Ensure nginx can read certificate files: `sudo chmod 644 /etc/letsencrypt/live/hirewow.tech/*.pem`

### Issue: Frontend Can't Reach API

- Verify `VITE_API_BASE_URL` is set correctly during build
- Check browser console for API errors
- Verify nginx proxy configuration

## Security Checklist

- [ ] Changed default database password
- [ ] Generated strong JWT_SECRET
- [ ] Enabled HTTPS/SSL
- [ ] Configured firewall
- [ ] Set up SSL certificate auto-renewal
- [ ] Disabled unnecessary ports
- [ ] Regular security updates
- [ ] Database backups configured

## Performance Optimization

- Consider using a reverse proxy (like Cloudflare) in front of your server
- Enable nginx caching for static assets
- Monitor resource usage: `docker stats`
- Scale services if needed (adjust worker counts in docker-compose)


