#!/bin/bash

# Fix Global Load Balancer for Cloud Run Serverless NEGs
PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")

echo "🔧 Fixing Global Load Balancer for Cloud Run..."

# Set the project
gcloud config set project $PROJECT_ID

# Delete existing backend services
echo "🗑️  Removing existing backend services..."
for region in "${REGIONS[@]}"; do
    echo "   Removing backend service for $region..."
    gcloud compute backend-services delete nexuswealth-backend-$region --global --quiet 2>/dev/null || true
done

# Create new backend services without health checks and port names
echo ""
echo "🏗️  Creating new backend services for Cloud Run..."

for region in "${REGIONS[@]}"; do
    echo "   Creating backend service for $region..."
    
    # Create backend service for Cloud Run (no health checks, no port name)
    gcloud compute backend-services create nexuswealth-backend-$region \
        --global \
        --protocol=HTTPS \
        --enable-logging \
        --quiet
    
    # Add Cloud Run NEG as backend
    gcloud compute backend-services add-backend nexuswealth-backend-$region \
        --global \
        --network-endpoint-group=nexuswealth-neg-$region \
        --network-endpoint-group-region=$region \
        --quiet
    
    echo "   ✅ Backend service created for $region"
done

# Update URL map to use the new backend services
echo ""
echo "🔄 Updating URL map..."
gcloud compute url-maps edit nexuswealth-url-map --global

echo ""
echo "✅ Load Balancer Backend Services Fixed!"
echo "================================================"
echo ""
echo "📋 Manual Step Required:"
echo "Edit the URL map to configure routing between regions:"
echo "   gcloud compute url-maps edit nexuswealth-url-map --global"
echo ""
echo "Example configuration for the URL map:"
echo "   defaultService: https://www.googleapis.com/compute/v1/projects/nexuswealthtest/global/backendServices/nexuswealth-backend-us-central1"
echo ""
echo "For geographic routing, you can add path matchers:"
echo "   - US users: nexuswealth-backend-us-central1"
echo "   - European users: nexuswealth-backend-europe-west1"
echo "   - Asian users: nexuswealth-backend-asia-southeast1"
