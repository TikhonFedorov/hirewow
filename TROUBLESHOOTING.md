# Troubleshooting Guide

## API Container Failed to Start - JWT_SECRET Validation Error

### Error: "String should have at least 32 characters"

**Symptoms:**
```
ValidationError: 1 validation error for Settings
JWT_SECRET
  String should have at least 32 characters [type=string_too_short, input_value='...', input_type=str]
```

**Cause:**
The `JWT_SECRET` in `backend/.env` is shorter than 32 characters (security requirement).

**Solution:**

**For Windows (Local Development):**

1. **Using PowerShell (recommended):**
   ```powershell
   # Run the PowerShell script
   .\generate-secret.ps1
   ```
   This will generate secrets and copy JWT_SECRET to clipboard.

2. **Using Python (if installed):**
   ```cmd
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. **Using Git Bash (if you have Git for Windows):**
   ```bash
   openssl rand -hex 32
   ```

**For Linux/Mac/Server:**

1. **Generate a new JWT_SECRET:**
   ```bash
   # Generate 64 hex characters (32 bytes)
   openssl rand -hex 32
   ```

2. **Or use the helper script:**
   ```bash
   bash generate-secret.sh
   ```

3. **Update `backend/.env` file:**
   ```env
   JWT_SECRET=<generated_secret_from_step_1>
   DATABASE_URL=postgresql://hirewow:YOUR_PASSWORD@db:5432/appdb
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   EMAIL_ENABLED=false
   CORS_ORIGINS=https://hirewow.tech,https://www.hirewow.tech,http://localhost:80,http://localhost
   ```

4. **Restart the API container:**
   ```bash
   docker-compose restart api
   # Or rebuild if needed
   docker-compose up -d --build api
   ```

**Note:** The JWT_SECRET must be at least 32 characters long for security. Using `openssl rand -hex 32` generates 64 hex characters, which is secure.

## Web Container Failed to Start

### Common Causes and Solutions

#### 1. Build Failure

**Check build logs:**
```bash
docker-compose build web
docker-compose logs web
```

**Common build issues:**
- Missing `package-lock.json` - Run `npm install` in frontend directory
- Node version mismatch - Check `package.json` engines
- Network issues during npm install - Check internet connection

**Fix:**
```bash
# Rebuild with no cache
docker-compose build --no-cache web

# Or rebuild all services
docker-compose build --no-cache
```

#### 2. Container Exits Immediately

**Check container logs:**
```bash
docker-compose logs web
docker-compose ps
```

**Check if files exist in container:**
```bash
docker-compose run --rm web ls -la /usr/share/nginx/html
```

**Fix:**
```bash
# Rebuild the web container
docker-compose build web

# Start and check logs
docker-compose up web
```

#### 3. Volume Mount Issues

**Check volume:**
```bash
docker volume ls
docker volume inspect hirewow_web_static
```

**Fix:**
```bash
# Remove and recreate volume
docker-compose down -v
docker-compose up -d
```

#### 4. Missing Dependencies

**Check if frontend builds locally:**
```bash
cd frontend
npm install
npm run build
```

**If local build fails, fix issues first, then:**
```bash
docker-compose build --no-cache web
```

#### 5. Permission Issues

**Check file permissions:**
```bash
docker-compose run --rm web ls -la /usr/share/nginx/html
docker-compose run --rm web ls -la /out
```

**Fix:**
```bash
# Rebuild with proper permissions
docker-compose build --no-cache web
docker-compose up -d web
```

### Step-by-Step Debugging

1. **Check container status:**
   ```bash
   docker-compose ps
   ```

2. **View detailed logs:**
   ```bash
   docker-compose logs -f web
   ```

3. **Inspect the container:**
   ```bash
   docker-compose run --rm web sh
   # Inside container:
   ls -la /usr/share/nginx/html
   ls -la /out
   ```

4. **Test the build manually:**
   ```bash
   docker build -t test-web -f frontend/Dockerfile .
   docker run --rm test-web ls -la /usr/share/nginx/html
   ```

5. **Check environment variables:**
   ```bash
   docker-compose config
   ```

### Quick Fixes

**Option 1: Complete rebuild**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Option 2: Rebuild only web service**
```bash
docker-compose stop web
docker-compose rm -f web
docker-compose build --no-cache web
docker-compose up -d web
```

**Option 3: Use development mode (if production build fails)**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Verify Web Container is Working

After fixing, verify:

```bash
# Check container is running
docker-compose ps web

# Check files are in volume
docker-compose exec web ls -la /out

# Check proxy can access files
docker-compose exec proxy ls -la /usr/share/nginx/html
```

### Common Error Messages

**Error: "Cannot find module"**
- Solution: Rebuild with `--no-cache` to ensure dependencies are installed

**Error: "ENOENT: no such file or directory"**
- Solution: Check Dockerfile paths and build context

**Error: "Permission denied"**
- Solution: Check file permissions in Dockerfile and volumes

**Error: "Container exited with code 1"**
- Solution: Check logs for specific error message

### Getting Help

If issues persist, collect this information:

```bash
# System info
docker --version
docker-compose --version
uname -a

# Container status
docker-compose ps -a

# Full logs
docker-compose logs web > web-logs.txt

# Build output
docker-compose build web 2>&1 | tee build-output.txt
```

