# Morgan & Mallet CRM - AWS Linux Deployment Guide

**Complete Step-by-Step Deployment on AWS EC2 (Amazon Linux 2)**

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Setup](#aws-setup)
3. [Server Setup](#server-setup)
4. [Database Setup](#database-setup)
5. [Application Deployment](#application-deployment)
6. [Domain & SSL Setup](#domain--ssl-setup)
7. [Process Management](#process-management)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need:
- AWS Account
- Domain name (optional but recommended)
- SSH client (Terminal on Mac/Linux, PuTTY on Windows)
- This project files
- Basic Linux command knowledge

---

## 1. AWS Setup

### Step 1.1: Create EC2 Instance

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   ```
   Click "Launch Instance"
   
   Name: morgan-mallet-crm-server
   
   AMI: Amazon Linux 2023 (or Amazon Linux 2)
   
   Instance Type: 
   - Development: t2.medium (2 vCPU, 4GB RAM) - ~$35/month
   - Production: t3.large (2 vCPU, 8GB RAM) - ~$70/month
   
   Key Pair: Create new or use existing
   - Name: morgan-mallet-key
   - Download .pem file and save securely
   ```

3. **Configure Security Group**
   ```
   Create security group: morgan-mallet-sg
   
   Inbound Rules:
   - SSH (22) - Your IP only
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (3037) - 0.0.0.0/0 (Backend API - temporary)
   - Custom TCP (3306) - Your IP only (MySQL - if external access needed)
   ```

4. **Configure Storage**
   ```
   Root Volume: 30 GB gp3 (General Purpose SSD)
   ```

5. **Launch Instance**
   - Click "Launch Instance"
   - Wait for instance to be in "Running" state
   - Note down Public IP address

### Step 1.2: Connect to Server

```bash
# Set permissions for key file
chmod 400 ~/Downloads/morgan-mallet-key.pem

# Connect to server
ssh -i ~/Downloads/morgan-mallet-key.pem ec2-user@YOUR_PUBLIC_IP

# Example:
# ssh -i ~/Downloads/morgan-mallet-key.pem ec2-user@54.123.45.67
```

---

## 2. Server Setup

### Step 2.1: Update System

```bash
# Update all packages
sudo yum update -y

# Install basic tools
sudo yum install -y git wget curl vim
```

### Step 2.2: Install Node.js

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x

# Install PM2 globally (process manager)
sudo npm install -g pm2
```

### Step 2.3: Install MySQL

**For Amazon Linux 2023:**
```bash
# Install MariaDB (MySQL alternative)
sudo dnf install -y mariadb105-server

# Start MariaDB service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure MariaDB installation
sudo mysql_secure_installation

# Follow prompts:
# - Set root password: [CREATE_STRONG_PASSWORD]
# - Remove anonymous users: Y
# - Disallow root login remotely: Y
# - Remove test database: Y
# - Reload privilege tables: Y
```

**For Amazon Linux 2:**
```bash
# Install MySQL 8.0
sudo yum install -y mysql-server

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Secure MySQL installation
sudo mysql_secure_installation
```

**Alternative: Install MySQL 8.0 Community on Amazon Linux 2023:**
```bash
# Download MySQL repository
sudo wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm

# Install repository
sudo dnf install -y mysql80-community-release-el9-1.noarch.rpm

# Install MySQL
sudo dnf install -y mysql-community-server

# Start MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation
sudo mysql_secure_installation
```

### Step 2.4: Install Nginx (Web Server)

**For Amazon Linux 2023:**
```bash
# Install Nginx
sudo dnf install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify - visit http://YOUR_PUBLIC_IP in browser
# You should see Nginx welcome page
```

**For Amazon Linux 2:**
```bash
# Install Nginx
sudo amazon-linux-extras install nginx1 -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

---

## 3. Database Setup

### Step 3.1: Create Database

```bash
# Login to MySQL
sudo mysql -u root -p

# In MySQL prompt, run:
```

```sql
-- Create database
CREATE DATABASE morgan_mallet_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'morganmallet'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON morgan_mallet_crm.* TO 'morganmallet'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### Step 3.2: Import Database (if you have backup)

```bash
# If you have a database dump file
mysql -u morganmallet -p morgan_mallet_crm < /path/to/backup.sql
```

---

## 4. Application Deployment

### Step 4.1: Create Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/morgan-mallet-crm
sudo chown -R ec2-user:ec2-user /var/www/morgan-mallet-crm
cd /var/www/morgan-mallet-crm
```

### Step 4.2: Upload Application Files

**Option A: Using SCP (from your local machine)**

```bash
# From your local machine (new terminal)
cd /Users/ranielvincentbesana/Downloads/morgan-mallet-crm-master

# Upload files
scp -i ~/Downloads/morgan-mallet-key.pem -r * ec2-user@YOUR_PUBLIC_IP:/var/www/morgan-mallet-crm/
```

**Option B: Using Git (if you have repository)**

```bash
# On server
cd /var/www/morgan-mallet-crm
git clone YOUR_REPOSITORY_URL .
```

**Option C: Using SFTP Client**
- Use FileZilla, Cyberduck, or WinSCP
- Connect using your .pem key
- Upload all files to /var/www/morgan-mallet-crm

### Step 4.3: Configure Environment

```bash
cd /var/www/morgan-mallet-crm

# Create production environment file
cat > back/environment/env.json << 'EOF'
{
  "EnvName": "production",
  "ApiPort": 3037,
  "ApiBasePath": "/var/www/morgan-mallet-crm",
  "PublicUploadsDirectoryName": "public-uploads",
  "BaseURL": "https://yourdomain.com",
  "FrontURL": "https://yourdomain.com",
  "Database": {
    "host": "localhost",
    "port": 3306,
    "username": "morganmallet",
    "password": "YOUR_DATABASE_PASSWORD",
    "database": "morgan_mallet_crm"
  },
  "JwtSecret": "GENERATE_RANDOM_SECRET_HERE",
  "JwtExpiresIn": "24h",
  "RefreshTokenExpiresIn": "7d",
  "EnableLogging": false,
  "EnableMailSending": true,
  "EnableSmsSending": true,
  "SsrEnabled": false,
  "UseRedisWebSocketAdapter": false
}
EOF

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output and update JwtSecret in env.json
```

### Step 4.4: Install Dependencies

```bash
# Install backend dependencies
cd /var/www/morgan-mallet-crm
npm install

# Install frontend dependencies
cd front
npm install
cd ..
```

### Step 4.5: Build Application

```bash
# Build frontend
cd /var/www/morgan-mallet-crm/front
npm run build

# This creates dist/browser folder with compiled Angular app

# Build backend
cd /var/www/morgan-mallet-crm
npm run build

# This creates dist/back folder with compiled NestJS app
```

### Step 4.6: Run Database Migrations

```bash
cd /var/www/morgan-mallet-crm

# Run migrations (if you have them)
npm run migration:run

# Or manually import schema if needed
```

---

## 5. Process Management with PM2

### Step 5.1: Create PM2 Configuration

```bash
cd /var/www/morgan-mallet-crm

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'morgan-mallet-backend',
    script: 'dist/back/main.js',
    cwd: '/var/www/morgan-mallet-crm',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3037
    },
    error_file: 'logs/backend-error.log',
    out_file: 'logs/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
EOF
```

### Step 5.2: Start Application

```bash
# Create logs directory
mkdir -p /var/www/morgan-mallet-crm/logs

# Start application with PM2
cd /var/www/morgan-mallet-crm
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs morgan-mallet-backend
```

---

## 6. Nginx Configuration

### Step 6.1: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo vim /etc/nginx/conf.d/morgan-mallet.conf
```

Add this configuration:

```nginx
# Backend API
upstream backend {
    server 127.0.0.1:3037;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;
    
    # Client max body size (for file uploads)
    client_max_body_size 10M;
    
    # Frontend (Angular)
    location / {
        root /var/www/morgan-mallet-crm/front/dist/browser;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # WebSocket support
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Uploads directory
    location /uploads {
        alias /var/www/morgan-mallet-crm/uploads/public-uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### Step 6.2: Test and Restart Nginx

```bash
# Test configuration
sudo nginx -t

# If OK, restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

---

## 7. Application Load Balancer with HTTPS Setup

### Step 7.1: Create Target Group

1. Go to **EC2 Console** → **Target Groups** (under Load Balancing)
2. Click **Create target group**
3. Configure:
   - **Target type**: Instances
   - **Target group name**: `morgan-mallet-tg`
   - **Protocol**: HTTP
   - **Port**: 80
   - **VPC**: Select your VPC
   - **Protocol version**: HTTP1
4. **Health checks**:
   - **Health check protocol**: HTTP
   - **Health check path**: `/` (or `/api/health` if you have health endpoint)
   - **Advanced health check settings**:
     - Healthy threshold: 2
     - Unhealthy threshold: 3
     - Timeout: 5 seconds
     - Interval: 30 seconds
     - Success codes: 200
5. Click **Next**
6. **Register targets**:
   - Select your EC2 instance
   - Port: 80
   - Click **Include as pending below**
7. Click **Create target group**

### Step 7.2: Request SSL Certificate (ACM)

1. Go to **AWS Certificate Manager (ACM)** console
2. Ensure you're in the **same region** as your Load Balancer
3. Click **Request certificate**
4. Choose **Request a public certificate** → **Next**
5. Configure:
   - **Domain names**:
     - Add: `app.morganmallet.agency`
     - Click **Add another name to this certificate**
     - Add: `*.morganmallet.agency` (optional, for wildcard)
   - **Validation method**: DNS validation (recommended)
   - **Key algorithm**: RSA 2048
6. Click **Request**
7. **Validate certificate**:
   - Click on the certificate ID
   - Click **Create records in Route 53** (if using Route 53)
   - OR copy the CNAME records and add them to your DNS provider
   - Wait 5-30 minutes for validation (status will change to "Issued")

### Step 7.3: Create Application Load Balancer

1. Go to **EC2 Console** → **Load Balancers**
2. Click **Create Load Balancer**
3. Choose **Application Load Balancer** → **Create**
4. **Basic configuration**:
   - **Name**: `morgan-mallet-alb`
   - **Scheme**: Internet-facing
   - **IP address type**: IPv4
5. **Network mapping**:
   - **VPC**: Select your VPC
   - **Mappings**: Select at least 2 Availability Zones
   - Select public subnets for each AZ
6. **Security groups**:
   - Create new security group or select existing:
     - **Name**: `morgan-mallet-alb-sg`
     - **Inbound rules**:
       - Type: HTTP, Port: 80, Source: 0.0.0.0/0
       - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
7. **Listeners and routing**:
   - **Listener 1**:
     - Protocol: HTTP
     - Port: 80
     - Default action: Redirect to HTTPS (port 443)
   - Click **Add listener**
   - **Listener 2**:
     - Protocol: HTTPS
     - Port: 443
     - Default action: Forward to `morgan-mallet-tg`
     - **Secure listener settings**:
       - Security policy: ELBSecurityPolicy-2016-08 (or latest)
       - Default SSL/TLS certificate: Select your ACM certificate
8. Click **Create load balancer**
9. Wait for status to become **Active** (2-3 minutes)

### Step 7.4: Update EC2 Security Group

1. Go to **EC2 Console** → **Security Groups**
2. Select your EC2 instance's security group
3. **Edit inbound rules**:
   - Remove or restrict port 80/443 from 0.0.0.0/0
   - Add new rules:
     - Type: HTTP, Port: 80, Source: ALB Security Group ID
     - Type: Custom TCP, Port: 3037, Source: ALB Security Group ID (if needed)
   - Keep SSH rule: Port 22, Source: Your IP
4. Save rules

### Step 7.5: Configure DNS (Route 53 or External)

**Option A: Using Route 53**

1. Go to **Route 53** → **Hosted zones**
2. Select `morganmallet.agency`
3. Click **Create record**
4. Configure:
   - **Record name**: `app`
   - **Record type**: A
   - **Alias**: Yes
   - **Route traffic to**: 
     - Alias to Application and Classic Load Balancer
     - Select your region
     - Select your ALB
   - **Routing policy**: Simple routing
5. Click **Create records**

**Option B: Using External DNS Provider**

1. Go to your DNS provider (GoDaddy, Namecheap, etc.)
2. Add CNAME record:
   ```
   Type: CNAME
   Name: app
   Value: morgan-mallet-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com
   TTL: 300
   ```
   (Get ALB DNS name from Load Balancer details)

### Step 7.6: Update Nginx Configuration

Since traffic now comes through ALB, update Nginx to handle forwarded headers:

```bash
sudo vim /etc/nginx/conf.d/morgan-mallet.conf
```

Update to:

```nginx
upstream backend {
    server 127.0.0.1:3037;
    keepalive 64;
}

server {
    listen 80;
    server_name app.morganmallet.agency;
    
    # Get real IP from ALB
    set_real_ip_from 10.0.0.0/8;  # Adjust to your VPC CIDR
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;
    
    client_max_body_size 10M;
    
    # Frontend
    location / {
        root /var/www/morgan-mallet-crm/front/dist/browser;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # WebSocket
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Uploads
    location /uploads {
        alias /var/www/morgan-mallet-crm/uploads/public-uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

```bash
# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7.7: Update Application Environment

```bash
vim /var/www/morgan-mallet-crm/back/environment/env.json
```

Update URLs:

```json
{
  "BaseURL": "https://app.morganmallet.agency",
  "FrontURL": "https://app.morganmallet.agency",
  ...
}
```

```bash
# Restart backend
pm2 restart morgan-mallet-backend
```

### Step 7.8: Test Setup

1. Wait 5-10 minutes for DNS propagation
2. Visit `https://app.morganmallet.agency`
3. Verify:
   - ✅ HTTPS works with valid certificate
   - ✅ HTTP redirects to HTTPS
   - ✅ Application loads correctly
   - ✅ API calls work
   - ✅ WebSocket connections work (if applicable)

### Step 7.9: Monitor Load Balancer

```bash
# Check target health
# Go to EC2 Console → Target Groups → morgan-mallet-tg → Targets tab
# Status should be "healthy"

# View ALB metrics
# Go to Load Balancers → morgan-mallet-alb → Monitoring tab
```

---

## 8. Alternative: Direct SSL Setup (Without Load Balancer)

### Step 8.1: Point Domain to Server

1. Go to your DNS provider
2. Add A record:
   ```
   Type: A
   Name: app
   Value: YOUR_EC2_PUBLIC_IP
   TTL: 300
   ```

### Step 8.2: Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d app.morganmallet.agency

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 8.3: Update Environment

```bash
vim /var/www/morgan-mallet-crm/back/environment/env.json

# Update:
# "BaseURL": "https://app.morganmallet.agency",
# "FrontURL": "https://app.morganmallet.agency",

pm2 restart morgan-mallet-backend
```

---

## 9. Monitoring & Maintenance

### Step 9.1: Setup Monitoring

```bash
# Monitor PM2 processes
pm2 monit

# View logs
pm2 logs morgan-mallet-backend

# View specific log file
tail -f /var/www/morgan-mallet-crm/logs/backend-error.log
tail -f /var/www/morgan-mallet-crm/logs/backend-out.log

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Step 9.2: Database Backup Script

```bash
# Create backup script
cat > /home/ec2-user/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ec2-user/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u morganmallet -p'YOUR_DB_PASSWORD' morgan_mallet_crm | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
EOF

# Make executable
chmod +x /home/ec2-user/backup-db.sh

# Setup daily backup cron job
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * /home/ec2-user/backup-db.sh >> /home/ec2-user/backup.log 2>&1
```

### Step 9.3: Setup Logrotate

```bash
# Create logrotate config
sudo vim /etc/logrotate.d/morgan-mallet
```

Add:

```
/var/www/morgan-mallet-crm/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ec2-user ec2-user
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 10. Useful Commands

### Application Management

```bash
# Restart backend
pm2 restart morgan-mallet-backend

# Stop backend
pm2 stop morgan-mallet-backend

# View logs
pm2 logs morgan-mallet-backend

# Monitor resources
pm2 monit

# List all processes
pm2 list

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

### Deployment Updates

```bash
# When you have new code changes:

# 1. Upload new files (or git pull)
cd /var/www/morgan-mallet-crm
git pull  # if using git

# 2. Install new dependencies (if any)
npm install
cd front && npm install && cd ..

# 3. Rebuild
cd front && npm run build && cd ..
npm run build

# 4. Restart backend
pm2 restart morgan-mallet-backend

# 5. Clear Nginx cache (if needed)
sudo systemctl reload nginx
```

### Database Management

```bash
# Backup database
mysqldump -u morganmallet -p morgan_mallet_crm > backup.sql

# Restore database
mysql -u morganmallet -p morgan_mallet_crm < backup.sql

# Access MySQL
mysql -u morganmallet -p morgan_mallet_crm
```

---

## 11. Troubleshooting

### Issue: Cannot connect to server

```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs morgan-mallet-backend

# Check if port is listening
sudo netstat -tlnp | grep 3037

# Restart backend
pm2 restart morgan-mallet-backend
```

### Issue: 502 Bad Gateway

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if backend is running
pm2 status

# Test Nginx configuration
sudo nginx -t

# Restart services
pm2 restart morgan-mallet-backend
sudo systemctl restart nginx
```

### Issue: Database connection error

```bash
# Check MySQL is running
sudo systemctl status mysqld

# Test database connection
mysql -u morganmallet -p morgan_mallet_crm

# Check credentials in env.json
cat /var/www/morgan-mallet-crm/back/environment/env.json

# Restart MySQL
sudo systemctl restart mysqld
```

### Issue: Out of memory

```bash
# Check memory usage
free -h

# Check PM2 processes
pm2 list

# Restart with memory limit
pm2 restart morgan-mallet-backend --max-memory-restart 1G

# Check logs for memory issues
pm2 logs morgan-mallet-backend --err
```

### Issue: Disk space full

```bash
# Check disk usage
df -h

# Find large files
sudo du -sh /var/www/morgan-mallet-crm/* | sort -h

# Clean old logs
sudo find /var/log -name "*.log" -mtime +30 -delete

# Clean PM2 logs
pm2 flush
```

---

## 11. Security Checklist

- [ ] Changed default MySQL root password
- [ ] Created dedicated database user
- [ ] Configured firewall (Security Groups)
- [ ] Installed SSL certificate
- [ ] Disabled root SSH login
- [ ] Setup SSH key authentication only
- [ ] Configured fail2ban (optional)
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Strong JWT secret generated
- [ ] Environment variables secured

---

## 12. Cost Estimation

### Monthly AWS Costs (Approximate):

**Development Environment:**
- EC2 t2.medium: $35/month
- EBS Storage (30GB): $3/month
- Data Transfer: $5-10/month
- **Total: ~$45-50/month**

**Production Environment:**
- EC2 t3.large: $70/month
- EBS Storage (50GB): $5/month
- Data Transfer: $10-20/month
- Elastic IP: $3.60/month (if stopped)
- **Total: ~$90-100/month**

**Optional Add-ons:**
- RDS MySQL (instead of self-hosted): +$15-30/month
- CloudWatch monitoring: +$5-10/month
- S3 for file storage: +$5-10/month
- Load Balancer: +$20/month

---

## 13. Next Steps

1. **Setup Monitoring**
   - CloudWatch for AWS metrics
   - PM2 monitoring dashboard
   - Application performance monitoring (APM)

2. **Setup CI/CD**
   - GitHub Actions or GitLab CI
   - Automated deployments
   - Automated testing

3. **Scaling**
   - Add load balancer
   - Multiple EC2 instances
   - RDS for database
   - S3 for file storage
   - CloudFront CDN

4. **Backup Strategy**
   - Automated daily backups
   - Off-site backup storage
   - Disaster recovery plan

---

## Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com
- **PM2 Documentation**: https://pm2.keymetrics.io
- **Nginx Documentation**: https://nginx.org/en/docs
- **Let's Encrypt**: https://letsencrypt.org
- **NestJS Deployment**: https://docs.nestjs.com/deployment

---

**Deployment Checklist:**
- [ ] EC2 instance created and running
- [ ] Security groups configured
- [ ] SSH access working
- [ ] Node.js installed
- [ ] MySQL installed and configured
- [ ] Nginx installed
- [ ] Application files uploaded
- [ ] Dependencies installed
- [ ] Application built
- [ ] Database created and migrated
- [ ] PM2 configured and running
- [ ] Nginx configured
- [ ] Domain pointed to server
- [ ] SSL certificate installed
- [ ] Application accessible via domain
- [ ] Backups configured
- [ ] Monitoring setup

---

**Generated:** February 19, 2025  
**Version:** 1.0  
**Project:** Morgan & Mallet CRM
