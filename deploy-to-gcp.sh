#!/bin/bash

# Multi-Region Deployment Script for NexusWealth Main Website (nwis.io)
# Deploys to US, Europe, and Asia for global low-latency access

# Configuration
PROJECT_ID="nexuswealthtest"  # Your actual Google Cloud Project ID
SERVICE_NAME="nexuswealth-dapp"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")  # Multi-region deployment
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🌍 Starting multi-region deployment to Google Cloud Run..."
echo "Regions: ${REGIONS[*]}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Error: Not authenticated with gcloud. Please run 'gcloud auth login' first."
    exit 1
fi

# Set the project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Build the Docker image (once for all regions)
echo ""
echo "🔨 Building Docker image..."
docker build --platform linux/amd64 -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Push the image to Google Container Registry
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
        --set-env-vars NODE_ENV=production,REGION=$region \
        --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployed to $region successfully!"
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
for region in "${REGIONS[@]}"; do
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --platform managed \
        --region $region \
        --format="value(status.url)")
    echo "  $region: $SERVICE_URL"
done
echo ""
echo "💡 Load balancer already configured:"
echo "   Your existing load balancer will automatically route to the new deployments"
echo "   No changes needed to load balancer configuration"
echo ""
