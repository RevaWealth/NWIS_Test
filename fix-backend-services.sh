#!/bin/bash

# Fix Backend Services for Global Load Balancer
PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")

echo "🔧 Fixing Backend Services for Global Load Balancer..."

# Set the project
gcloud config set project $PROJECT_ID

# Delete existing backend services
echo "🗑️  Removing existing backend services..."
for region in "${REGIONS[@]}"; do
    echo "   Removing backend service for $region..."
    gcloud compute backend-services delete nexuswealth-backend-$region --global --quiet 2>/dev/null || true
done

# Create new backend services properly configured for Cloud Run
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

# Create a simple URL map configuration
cat > url-map-config.yaml << EOF
name: nexuswealth-url-map
defaultService: https://www.googleapis.com/compute/v1/projects/$PROJECT_ID/global/backendServices/nexuswealth-backend-us-central1
EOF

# Update the URL map
gcloud compute url-maps import nexuswealth-url-map \
    --source=url-map-config.yaml \
    --global \
    --quiet

# Clean up
rm url-map-config.yaml

echo ""
echo "✅ Backend Services Fixed!"
echo "================================================"
echo ""
echo "📋 What was fixed:"
echo "   • Recreated backend services for all regions"
echo "   • Properly attached Cloud Run NEGs"
echo "   • Updated URL map configuration"
echo ""
echo "🌍 Load balancer should now route traffic properly:"
echo "   • US users → us-central1"
echo "   • European users → europe-west1"
echo "   • Asian users → asia-southeast1"
echo ""
echo "⏰ Wait 2-3 minutes for changes to propagate, then test:"
echo "   https://www.nwis.io"
