# Troubleshooting 500 Internal Server Error

## Quick Diagnostic Commands

Run these commands on your EC2 server to identify the issue:

```bash
# 1. Check Nginx error logs (MOST IMPORTANT)
sudo tail -50 /var/log/nginx/error.log

# 2. Check if backend is running
pm2 status

# 3. Check backend logs
pm2 logs morgan-mallet-backend --lines 50

# 4. Check if backend port is listening
sudo netstat -tlnp | grep 3037

# 5. Test Nginx configuration
sudo nginx -t

# 6. Check if frontend files exist
ls -la /var/www/morgan-mallet-crm/front/dist/browser/

# 7. Check Nginx access logs
sudo tail -20 /var/log/nginx/access.log

# 8. Check file permissions
ls -la /var/www/morgan-mallet-crm/
```

## Common Causes & Solutions

### 1. Backend Not Running

**Check:**
```bash
pm2 status
```

**Fix:**
```bash
cd /var/www/morgan-mallet-crm
pm2 restart morgan-mallet-backend

# If not started:
pm2 start ecosystem.config.js
```

### 2. Frontend Build Missing

**Check:**
```bash
ls /var/www/morgan-mallet-crm/front/dist/browser/index.html
```

**Fix:**
```bash
cd /var/www/morgan-mallet-crm/front
npm run build
sudo systemctl reload nginx
```

### 3. Backend Build Missing

**Check:**
```bash
ls /var/www/morgan-mallet-crm/dist/back/main.js
```

**Fix:**
```bash
cd /var/www/morgan-mallet-crm
npm run build
pm2 restart morgan-mallet-backend
```

### 4. Wrong File Permissions

**Check:**
```bash
ls -la /var/www/morgan-mallet-crm/front/dist/
```

**Fix:**
```bash
sudo chown -R ec2-user:ec2-user /var/www/morgan-mallet-crm
sudo chmod -R 755 /var/www/morgan-mallet-crm/front/dist
```

### 5. Database Connection Error

**Check backend logs:**
```bash
pm2 logs morgan-mallet-backend --lines 100 | grep -i error
```

**Fix:**
```bash
# Test database connection
mysql -u morganmallet -p morgan_mallet_crm

# Check MySQL is running
sudo systemctl status mysqld

# Restart MySQL if needed
sudo systemctl restart mysqld

# Verify credentials in env.json
cat /var/www/morgan-mallet-crm/back/environment/env.json
```

### 6. Nginx Configuration Error

**Check:**
```bash
sudo nginx -t
```

**Fix:**
```bash
# If syntax error, edit config
sudo vim /etc/nginx/conf.d/morgan-mallet.conf

# After fixing:
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SELinux Blocking (Amazon Linux)

**Check:**
```bash
sudo getenforce
```

**Fix (if enforcing):**
```bash
# Temporarily disable to test
sudo setenforce 0

# If this fixes it, set proper context:
sudo setenforce 1
sudo chcon -R -t httpd_sys_content_t /var/www/morgan-mallet-crm/front/dist/
sudo setsebool -P httpd_can_network_connect 1
```

### 8. Port 3037 Not Accessible

**Check:**
```bash
curl http://localhost:3037
```

**Fix:**
```bash
# Check if backend is listening
sudo netstat -tlnp | grep 3037

# If not, restart backend
pm2 restart morgan-mallet-backend

# Check backend logs for startup errors
pm2 logs morgan-mallet-backend
```

### 9. Environment File Issues

**Check:**
```bash
cat /var/www/morgan-mallet-crm/back/environment/env.json
```

**Fix:**
```bash
# Ensure file exists and has correct format
vim /var/www/morgan-mallet-crm/back/environment/env.json

# Restart after changes
pm2 restart morgan-mallet-backend
```

### 10. Nginx Can't Read Files

**Check:**
```bash
sudo -u nginx test -r /var/www/morgan-mallet-crm/front/dist/browser/index.html && echo "OK" || echo "FAIL"
```

**Fix:**
```bash
sudo chmod -R 755 /var/www/morgan-mallet-crm/front/dist
sudo chown -R ec2-user:ec2-user /var/www/morgan-mallet-crm
```

## Step-by-Step Diagnosis

### Step 1: Check What's Actually Failing

```bash
# Try accessing directly
curl http://localhost

# Check response
curl -I http://localhost
```

### Step 2: Check Nginx Error Log

```bash
sudo tail -100 /var/log/nginx/error.log
```

Look for:
- `connect() failed (111: Connection refused)` → Backend not running
- `No such file or directory` → Frontend build missing
- `Permission denied` → File permission issue
- `upstream timed out` → Backend taking too long

### Step 3: Verify All Services

```bash
# Check Nginx
sudo systemctl status nginx

# Check PM2
pm2 status

# Check MySQL
sudo systemctl status mysqld
```

### Step 4: Test Backend Directly

```bash
# Test if backend responds
curl http://localhost:3037

# If it works, issue is with Nginx config
# If it fails, issue is with backend
```

## Complete Reset (If Nothing Works)

```bash
# 1. Stop everything
pm2 stop all
sudo systemctl stop nginx

# 2. Rebuild application
cd /var/www/morgan-mallet-crm
npm install
cd front && npm install && cd ..
cd front && npm run build && cd ..
npm run build

# 3. Check builds exist
ls -la front/dist/browser/index.html
ls -la dist/back/main.js

# 4. Start services
pm2 start ecosystem.config.js
sudo systemctl start nginx

# 5. Check logs
pm2 logs morgan-mallet-backend
sudo tail -f /var/log/nginx/error.log
```

## Get Detailed Error Information

```bash
# Enable detailed Nginx error logging
sudo vim /etc/nginx/nginx.conf

# Change error_log line to:
# error_log /var/log/nginx/error.log debug;

# Reload Nginx
sudo systemctl reload nginx

# Try accessing site, then check logs
sudo tail -100 /var/log/nginx/error.log

# Don't forget to change back to 'warn' or 'error' after debugging
```

## Share These Outputs for Help

If you need further assistance, share these outputs:

```bash
# 1. Nginx error log
sudo tail -50 /var/log/nginx/error.log

# 2. PM2 status
pm2 status

# 3. Backend logs
pm2 logs morgan-mallet-backend --lines 50 --nostream

# 4. Nginx config test
sudo nginx -t

# 5. Port check
sudo netstat -tlnp | grep -E '(80|3037)'

# 6. File structure
ls -la /var/www/morgan-mallet-crm/front/dist/
ls -la /var/www/morgan-mallet-crm/dist/back/
```
