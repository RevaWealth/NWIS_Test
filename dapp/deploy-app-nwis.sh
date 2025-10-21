#!/bin/bash

# Deployment Script for app.nwis.io subdomain
# Deploys NexusWealth dApp to Google Cloud Run

# Configuration
PROJECT_ID="nexuswealthtest"
SERVICE_NAME="app-nwis-dapp"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying app.nwis.io to Google Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
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

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
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

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 1 \
    --max-instances 10 \
    --timeout 60 \
    --set-env-vars NODE_ENV=production \
    --quiet

if [ $? -eq 0 ]; then
    echo "✅ Deployed successfully!"
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --platform managed \
        --region $REGION \
        --format="value(status.url)")
    echo ""
    echo "🎉 Deployment Complete!"
    echo "================================================"
    echo "Service URL: $SERVICE_URL"
    echo "================================================"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Set up custom domain mapping for app.nwis.io"
    echo "   2. Configure DNS to point to this service"
    echo "   3. SSL certificate will be automatically provisioned"
    echo ""
    echo "🔗 To set up custom domain, run:"
    echo "   gcloud run domain-mappings create --service=$SERVICE_NAME --domain=app.nwis.io --region=$REGION"
    echo ""
else
    echo "❌ Deployment failed!"
    exit 1
fi
