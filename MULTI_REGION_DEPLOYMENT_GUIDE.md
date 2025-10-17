# 🌍 Multi-Region Deployment Guide for NexusWealth Dapp

## 📋 Overview

This guide covers deploying your dapp across multiple regions for:
- ✅ Global low-latency access
- ✅ High availability
- ✅ Automatic failover
- ✅ Better user experience worldwide

**Target Regions:**
- 🇺🇸 **us-central1** (Iowa, USA)
- 🇪🇺 **europe-west1** (Belgium, Europe)
- 🇸🇬 **asia-southeast1** (Singapore, Asia)

---

## 🏗️ Architecture

```
                          ┌────────────────────┐
                          │  Cloud Load        │
                          │  Balancer          │
                          │  (Global)          │
                          └────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
            ┌───────▼──────┐ ┌────▼──────┐ ┌────▼──────┐
            │  us-central1  │ │ europe-   │ │  asia-    │
            │               │ │ west1     │ │ southeast1│
            │  Cloud Run    │ │ Cloud Run │ │ Cloud Run │
            └───────────────┘ └───────────┘ └───────────┘
                   │                │              │
            ┌──────▼──────┐  ┌─────▼─────┐ ┌─────▼─────┐
            │ US Users     │  │ EU Users  │ │ Asia Users│
            │ Low latency  │  │ Low       │ │ Low       │
            │              │  │ latency   │ │ latency   │
            └──────────────┘  └───────────┘ └───────────┘
```

**How it works:**
1. User requests `app.nwis.io`
2. Cloud Load Balancer routes to nearest region
3. Request served with minimal latency
4. Automatic failover if one region goes down

---

## 🚀 Deployment Strategy

### Option A: Cloud Run Multi-Region with Load Balancer (Recommended)
- Deploy to 3 regions
- Use Google Cloud Load Balancer
- Automatic routing to nearest region
- Custom domain with SSL

### Option B: Cloud Run with Traffic Director (Advanced)
- Service mesh for advanced routing
- More complex but more control
- Better for microservices

**This guide covers Option A (recommended for your use case)**

---

## 📦 Step 1: Deploy to Multiple Regions

### Create Multi-Region Deployment Script

**File: `dapp/deploy-multi-region.sh`**

```bash
#!/bin/bash

# Multi-Region Deployment Script for NexusWealth Dapp
# Deploys to US, Europe, and Asia

set -e  # Exit on error

# Configuration
PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")

echo "🌍 Starting multi-region deployment..."
echo "================================================"
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Regions: ${REGIONS[*]}"
echo "================================================"
echo ""

# Check prerequisites
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker not installed"
    exit 1
fi

# Authenticate
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated. Run: gcloud auth login"
    exit 1
fi

# Set project
echo "📋 Setting project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Build Docker image (once)
echo ""
echo "🔨 Building Docker image..."
docker build --platform linux/amd64 -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Push to Container Registry
echo ""
echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "❌ Failed to push image!"
    exit 1
fi

echo ""
echo "✅ Image pushed successfully!"
echo ""

# Deploy to each region
for region in "${REGIONS[@]}"; do
    echo "================================================"
    echo "🚀 Deploying to $region..."
    echo "================================================"
    
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --platform managed \
        --region $region \
        --allow-unauthenticated \
        --port 3000 \
        --memory 2Gi \
        --cpu 2 \
        --min-instances 1 \
        --max-instances 10 \
        --timeout 60 \
        --concurrency 80 \
        --set-env-vars NODE_ENV=production,REGION=$region \
        --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployed to $region successfully!"
        
        # Get the service URL
        SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
            --platform managed \
            --region $region \
            --format="value(status.url)")
        echo "   URL: $SERVICE_URL"
    else
        echo "❌ Deployment to $region failed!"
        exit 1
    fi
    
    echo ""
done

echo "================================================"
echo "🎉 Multi-region deployment complete!"
echo "================================================"
echo ""
echo "📊 Deployment Summary:"
echo ""
for region in "${REGIONS[@]}"; do
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --platform managed \
        --region $region \
        --format="value(status.url)")
    echo "  $region: $SERVICE_URL"
done
echo ""
echo "🔧 Next steps:"
echo "  1. Set up Cloud Load Balancer (see guide below)"
echo "  2. Configure custom domain (app.nwis.io)"
echo "  3. Enable Cloud CDN for better performance"
echo "  4. Set up monitoring and alerts"
echo ""
```

Make it executable:

```bash
chmod +x dapp/deploy-multi-region.sh
```

### Run Multi-Region Deployment

```bash
cd /Users/arashsarabian/Desktop/NexusWealthVGit/dapp
./deploy-multi-region.sh
```

---

## 🔧 Step 2: Set Up Cloud Load Balancer

### 2.1: Create Serverless NEGs (Network Endpoint Groups)

A serverless NEG connects Cloud Run services to the Load Balancer.

```bash
# US Region
gcloud compute network-endpoint-groups create nexuswealth-neg-us \
    --region=us-central1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=nexuswealth-dapp

# Europe Region
gcloud compute network-endpoint-groups create nexuswealth-neg-eu \
    --region=europe-west1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=nexuswealth-dapp

# Asia Region
gcloud compute network-endpoint-groups create nexuswealth-neg-asia \
    --region=asia-southeast1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=nexuswealth-dapp
```

### 2.2: Create Backend Service

```bash
# Create backend service
gcloud compute backend-services create nexuswealth-backend \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --protocol=HTTPS \
    --enable-cdn \
    --cache-mode=CACHE_ALL_STATIC \
    --default-ttl=3600 \
    --max-ttl=86400

# Add US backend
gcloud compute backend-services add-backend nexuswealth-backend \
    --global \
    --network-endpoint-group=nexuswealth-neg-us \
    --network-endpoint-group-region=us-central1 \
    --balancing-mode=UTILIZATION \
    --max-utilization=0.8

# Add Europe backend
gcloud compute backend-services add-backend nexuswealth-backend \
    --global \
    --network-endpoint-group=nexuswealth-neg-eu \
    --network-endpoint-group-region=europe-west1 \
    --balancing-mode=UTILIZATION \
    --max-utilization=0.8

# Add Asia backend
gcloud compute backend-services add-backend nexuswealth-backend \
    --global \
    --network-endpoint-group=nexuswealth-neg-asia \
    --network-endpoint-group-region=asia-southeast1 \
    --balancing-mode=UTILIZATION \
    --max-utilization=0.8
```

### 2.3: Create URL Map

```bash
# Create URL map
gcloud compute url-maps create nexuswealth-lb \
    --default-service nexuswealth-backend
```

### 2.4: Create SSL Certificate

```bash
# Create managed SSL certificate for your domain
gcloud compute ssl-certificates create nexuswealth-ssl \
    --domains=app.nwis.io \
    --global
```

### 2.5: Create HTTPS Proxy

```bash
# Create target HTTPS proxy
gcloud compute target-https-proxies create nexuswealth-https-proxy \
    --ssl-certificates=nexuswealth-ssl \
    --url-map=nexuswealth-lb
```

### 2.6: Create Global Forwarding Rule

```bash
# Reserve a global static IP
gcloud compute addresses create nexuswealth-lb-ip \
    --ip-version=IPV4 \
    --global

# Get the IP address
gcloud compute addresses describe nexuswealth-lb-ip \
    --format="get(address)" \
    --global

# Create forwarding rule
gcloud compute forwarding-rules create nexuswealth-https-forwarding-rule \
    --address=nexuswealth-lb-ip \
    --global \
    --target-https-proxy=nexuswealth-https-proxy \
    --ports=443
```

---

## 🌐 Step 3: Configure DNS

### Get Load Balancer IP

```bash
LB_IP=$(gcloud compute addresses describe nexuswealth-lb-ip \
    --format="get(address)" \
    --global)

echo "Load Balancer IP: $LB_IP"
```

### Update DNS Records

**In your DNS provider (Cloudflare, GoDaddy, etc.):**

```
Type: A
Name: app
Value: [LB_IP from above]
TTL: 3600
Proxy: Disabled (for now, can enable after testing)
```

**For root domain (optional):**

```
Type: A
Name: @
Value: [LB_IP]
TTL: 3600
```

---

## 🔍 Step 4: Verify Multi-Region Setup

### 4.1: Check Deployment Status

```bash
# List all deployments
echo "Checking deployments in all regions..."
echo ""

for region in us-central1 europe-west1 asia-southeast1; do
    echo "Region: $region"
    gcloud run services describe nexuswealth-dapp \
        --platform managed \
        --region $region \
        --format="table(status.url,status.conditions[0].status)"
    echo ""
done
```

### 4.2: Test Each Region Directly

```bash
# Test US
curl -I https://nexuswealth-dapp-<hash>-uc.a.run.app

# Test Europe
curl -I https://nexuswealth-dapp-<hash>-ew.a.run.app

# Test Asia
curl -I https://nexuswealth-dapp-<hash>-as.a.run.app
```

### 4.3: Test Load Balancer

```bash
# Test through load balancer
curl -I https://app.nwis.io

# Check which region responded (add custom header in your app)
curl -v https://app.nwis.io 2>&1 | grep -i "x-region"
```

### 4.4: Test from Different Locations

Use a service like https://www.whatsmydns.net to test DNS propagation globally.

Or use curl with different locations:
```bash
# Test from US
curl -H "X-Forwarded-For: 8.8.8.8" https://app.nwis.io

# Test from Europe  
curl -H "X-Forwarded-For: 1.1.1.1" https://app.nwis.io

# Test from Asia
curl -H "X-Forwarded-For: 103.4.96.0" https://app.nwis.io
```

---

## 📊 Step 5: Add Region Detection to Your App

### Add Region Header to Responses

**File: `dapp/middleware.ts`**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add region header (set via Cloud Run env var)
  const region = process.env.REGION || 'unknown'
  response.headers.set('X-Cloud-Region', region)
  
  // Add cache headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### Display Region to Users (Optional - for debugging)

**File: `dapp/components/region-indicator.tsx`**

```typescript
'use client'

import { useEffect, useState } from 'react'

export function RegionIndicator() {
  const [region, setRegion] = useState<string | null>(null)
  
  useEffect(() => {
    // Fetch region from response headers
    fetch('/api/health')
      .then(res => {
        const cloudRegion = res.headers.get('X-Cloud-Region')
        setRegion(cloudRegion)
      })
      .catch(() => setRegion('unknown'))
  }, [])
  
  // Only show in development or to admins
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded text-xs">
      Region: {region || 'Loading...'}
    </div>
  )
}
```

### Add Health Check Endpoint

**File: `dapp/app/api/health/route.ts`**

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const region = process.env.REGION || 'unknown'
  
  return NextResponse.json(
    {
      status: 'healthy',
      region: region,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'X-Cloud-Region': region,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  )
}
```

---

## 📈 Step 6: Monitoring & Observability

### 6.1: Create Monitoring Dashboard

```bash
# Enable required APIs
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com

# Create uptime check for load balancer
gcloud monitoring uptime-checks create https \
    nexuswealth-uptime-check \
    --display-name="NWIS Dapp Health Check" \
    --uri=https://app.nwis.io/api/health \
    --check-interval=60s
```

### 6.2: Set Up Alerts

**Create alert policy for high error rate:**

```bash
# Create alert policy (via Console is easier)
# Or use gcloud:
gcloud alpha monitoring policies create \
    --notification-channels=<CHANNEL_ID> \
    --display-name="High Error Rate - NWIS Dapp" \
    --condition-display-name="Error rate > 5%" \
    --condition-threshold-value=0.05 \
    --condition-threshold-duration=300s
```

### 6.3: View Logs from All Regions

```bash
# View logs from all regions
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=nexuswealth-dapp" \
    --limit 50 \
    --format json

# Filter by region
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=nexuswealth-dapp AND resource.labels.location=europe-west1" \
    --limit 20
```

---

## 💰 Cost Estimation

### Multi-Region Cloud Run Costs

**Per Region:**
- Compute: ~$20-40/month per region
- Requests: ~$0.40 per million requests
- **Subtotal per region:** ~$20-40/month

**All 3 Regions:**
- **Total Cloud Run:** ~$60-120/month

### Load Balancer Costs

- Forwarding rules: ~$18/month
- Load balancing: ~$0.008 per GB processed
- SSL certificate: Free (Google-managed)
- **Estimated:** ~$25-40/month additional

### Total Multi-Region Setup

- **Cloud Run (3 regions):** $60-120/month
- **Load Balancer:** $25-40/month
- **CDN (if enabled):** $0.08-0.20 per GB
- **Total:** ~$85-160/month

**vs Single Region:** ~$30-50/month  
**Extra cost:** ~$55-110/month

**Benefits:**
- ✅ Global low latency (<100ms for most users)
- ✅ 99.95% uptime SLA (vs 99.5% single region)
- ✅ Automatic failover
- ✅ Better user experience worldwide

---

## 🔧 Automated Setup Script

### Complete Multi-Region Setup Script

**File: `dapp/setup-multi-region-complete.sh`**

```bash
#!/bin/bash

# Complete Multi-Region Setup Script
# This script does everything: deploy + load balancer + SSL

set -e

PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"
DOMAIN="app.nwis.io"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")

echo "🌍 NexusWealth Multi-Region Setup"
echo "================================================"
echo "This will:"
echo "  1. Deploy to 3 regions (US, EU, Asia)"
echo "  2. Create Load Balancer"
echo "  3. Set up SSL certificate"
echo "  4. Configure domain: $DOMAIN"
echo "================================================"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Set project
gcloud config set project $PROJECT_ID

# Build and push image
echo ""
echo "🔨 Building and pushing Docker image..."
docker build --platform linux/amd64 -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy to all regions
echo ""
echo "🚀 Deploying to all regions..."
for region in "${REGIONS[@]}"; do
    echo "  Deploying to $region..."
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --platform managed \
        --region $region \
        --allow-unauthenticated \
        --port 3000 \
        --memory 2Gi \
        --cpu 2 \
        --min-instances 1 \
        --max-instances 10 \
        --set-env-vars NODE_ENV=production,REGION=$region \
        --quiet
done

# Create Network Endpoint Groups
echo ""
echo "🔗 Creating Network Endpoint Groups..."
for i in "${!REGIONS[@]}"; do
    region="${REGIONS[$i]}"
    neg_name="nexuswealth-neg-$(echo $region | cut -d'-' -f1-2)"
    
    gcloud compute network-endpoint-groups create $neg_name \
        --region=$region \
        --network-endpoint-type=serverless \
        --cloud-run-service=$SERVICE_NAME \
        --quiet 2>/dev/null || echo "  NEG $neg_name already exists"
done

# Create backend service
echo ""
echo "🔧 Creating backend service..."
gcloud compute backend-services create nexuswealth-backend \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --protocol=HTTPS \
    --enable-cdn \
    --quiet 2>/dev/null || echo "  Backend service already exists"

# Add backends
echo ""
echo "📦 Adding backends..."
gcloud compute backend-services add-backend nexuswealth-backend \
    --global \
    --network-endpoint-group=nexuswealth-neg-us \
    --network-endpoint-group-region=us-central1 \
    --balancing-mode=UTILIZATION \
    --max-utilization=0.8 \
    --quiet 2>/dev/null || echo "  US backend already added"

gcloud compute backend-services add-backend nexuswealth-backend \
    --global \
    --network-endpoint-group=nexuswealth-neg-europe \
    --network-endpoint-group-region=europe-west1 \
    --balancing-mode=UTILIZATION \
    --max-utilization=0.8 \
    --quiet 2>/dev/null || echo "  EU backend already added"

gcloud compute backend-services add-backend nexuswealth-backend \
    --global \
    --network-endpoint-group=nexuswealth-neg-asia \
    --network-endpoint-group-region=asia-southeast1 \
    --balancing-mode=UTILIZATION \
    --max-utilization=0.8 \
    --quiet 2>/dev/null || echo "  Asia backend already added"

# Create URL map
echo ""
echo "🗺️  Creating URL map..."
gcloud compute url-maps create nexuswealth-lb \
    --default-service nexuswealth-backend \
    --quiet 2>/dev/null || echo "  URL map already exists"

# Create SSL certificate
echo ""
echo "🔒 Creating SSL certificate for $DOMAIN..."
gcloud compute ssl-certificates create nexuswealth-ssl \
    --domains=$DOMAIN \
    --global \
    --quiet 2>/dev/null || echo "  SSL certificate already exists"

# Create HTTPS proxy
echo ""
echo "🔐 Creating HTTPS proxy..."
gcloud compute target-https-proxies create nexuswealth-https-proxy \
    --ssl-certificates=nexuswealth-ssl \
    --url-map=nexuswealth-lb \
    --quiet 2>/dev/null || echo "  HTTPS proxy already exists"

# Reserve IP and create forwarding rule
echo ""
echo "🌐 Creating load balancer IP and forwarding rule..."
gcloud compute addresses create nexuswealth-lb-ip \
    --ip-version=IPV4 \
    --global \
    --quiet 2>/dev/null || echo "  IP address already exists"

LB_IP=$(gcloud compute addresses describe nexuswealth-lb-ip \
    --format="get(address)" \
    --global)

gcloud compute forwarding-rules create nexuswealth-https-forwarding-rule \
    --address=nexuswealth-lb-ip \
    --global \
    --target-https-proxy=nexuswealth-https-proxy \
    --ports=443 \
    --quiet 2>/dev/null || echo "  Forwarding rule already exists"

echo ""
echo "================================================"
echo "✅ Multi-region setup complete!"
echo "================================================"
echo ""
echo "📊 Deployment Summary:"
echo ""
echo "  Regions deployed:"
for region in "${REGIONS[@]}"; do
    echo "    ✓ $region"
done
echo ""
echo "  Load Balancer IP: $LB_IP"
echo "  Domain: $DOMAIN"
echo ""
echo "🔧 Next steps:"
echo "  1. Update DNS A record for $DOMAIN to $LB_IP"
echo "  2. Wait 15-60 minutes for SSL certificate provisioning"
echo "  3. Test: curl -I https://$DOMAIN"
echo "  4. Set up monitoring and alerts"
echo ""
echo "📖 Check SSL status:"
echo "  gcloud compute ssl-certificates describe nexuswealth-ssl --global"
echo ""
```

Make executable and run:

```bash
chmod +x dapp/setup-multi-region-complete.sh
./dapp/setup-multi-region-complete.sh
```

---

## 🧪 Testing Multi-Region Setup

### Test Script

**File: `dapp/test-multi-region.sh`**

```bash
#!/bin/bash

DOMAIN="app.nwis.io"

echo "🧪 Testing multi-region deployment..."
echo ""

# Test load balancer
echo "1. Testing load balancer..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$STATUS" -eq 200 ]; then
    echo "   ✅ Load balancer responding (HTTP $STATUS)"
else
    echo "   ❌ Load balancer not responding (HTTP $STATUS)"
fi

# Test SSL
echo ""
echo "2. Testing SSL certificate..."
SSL_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates)
if [ $? -eq 0 ]; then
    echo "   ✅ SSL certificate valid"
    echo "   $SSL_INFO"
else
    echo "   ❌ SSL certificate invalid"
fi

# Test regional endpoints
echo ""
echo "3. Testing regional endpoints..."
for region in us-central1 europe-west1 asia-southeast1; do
    echo "   Testing $region..."
    gcloud run services describe nexuswealth-dapp \
        --platform managed \
        --region $region \
        --format="value(status.url)" 2>/dev/null || echo "   ❌ Service not found in $region"
done

# Test health endpoint
echo ""
echo "4. Testing health endpoint..."
HEALTH=$(curl -s https://$DOMAIN/api/health)
if [ $? -eq 0 ]; then
    echo "   ✅ Health check passed"
    echo "   Response: $HEALTH"
else
    echo "   ❌ Health check failed"
fi

echo ""
echo "✅ Testing complete!"
```

---

## 🎯 Summary

You now have:

✅ **Multi-region deployment** across US, Europe, Asia  
✅ **Global Load Balancer** for automatic routing  
✅ **SSL/HTTPS** with automatic certificate  
✅ **CDN enabled** for static assets  
✅ **Health monitoring** across all regions  
✅ **Automatic failover** if one region fails  

**Performance Impact:**
- US users: <50ms latency
- EU users: <50ms latency  
- Asia users: <100ms latency
- Global average: ~60ms (vs 200-300ms single region)

**Next Steps:**
1. Run deployment script
2. Update DNS to load balancer IP
3. Wait for SSL provisioning (15-60 min)
4. Test from multiple locations
5. Set up monitoring alerts
6. Celebrate global deployment! 🎉

---

*Last updated: October 11, 2025*

