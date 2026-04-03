#!/bin/bash
# LexiForge Deployment Script for Hostinger VPS
# Usage: bash deploy.sh

set -e

echo "=== LexiForge Deployment ==="

APP_DIR="/var/www/lexiforge"
LOG_DIR="/var/log/lexiforge"

# 1. Create directories
echo "[1/8] Creating directories..."
sudo mkdir -p $APP_DIR $LOG_DIR
sudo chown -R $USER:$USER $APP_DIR $LOG_DIR

# 2. Copy files (run this from the project root on your local machine via rsync)
echo "[2/8] Syncing files..."
# rsync -avz --exclude=node_modules --exclude=.next ./ user@your-vps-ip:$APP_DIR/

# 3. Install dependencies
echo "[3/8] Installing dependencies..."
cd $APP_DIR
npm ci --production=false

# 4. Generate Prisma client
echo "[4/8] Generating Prisma client..."
npx prisma generate

# 5. Run database migrations
echo "[5/8] Running database migrations..."
npx prisma db push

# 6. Seed database
echo "[6/8] Seeding database..."
npx tsx prisma/seed.ts

# 7. Build Next.js
echo "[7/8] Building Next.js..."
npm run build

# 8. Start/Restart with PM2
echo "[8/8] Starting with PM2..."
pm2 delete lexiforge-web 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "=== Deployment Complete ==="
echo "Marketing site: https://lexireview.in"
echo "Dashboard:      https://lexireview.in/forge"
echo "API:            https://lexireview.in/api"
echo ""
echo "Next steps:"
echo "  1. Set up SSL: sudo certbot --nginx -d lexireview.in -d www.lexireview.in"
echo "  2. Copy nginx.conf to /etc/nginx/sites-available/lexireview.in"
echo "  3. sudo ln -s /etc/nginx/sites-available/lexireview.in /etc/nginx/sites-enabled/"
echo "  4. sudo nginx -t && sudo systemctl reload nginx"
echo "  5. Point DNS: lexireview.in A record -> your VPS IP"
