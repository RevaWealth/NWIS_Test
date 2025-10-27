#!/bin/bash

# Enhanced Traffic Analytics for Google Cloud Run
# Provides detailed page-level traffic reports

PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"

echo "🚀 Enhanced Cloud Run Traffic Analytics"
echo "======================================="
echo "Project: $PROJECT_ID | Service: $SERVICE_NAME"
echo "Generated: $(date)"
echo ""

# Function to get page traffic summary
get_page_traffic() {
    echo "📄 Page Traffic Summary (Last 1000 requests):"
    echo "=============================================="
    
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME" \
        --limit=1000 \
        --format="value(httpRequest.requestUrl)" \
        --project=$PROJECT_ID 2>/dev/null | \
        sed 's|.*/|/|' | \
        grep -E "^/[a-zA-Z]" | \
        sort | uniq -c | sort -nr | head -15
    
    echo ""
}

# Function to get status code analysis
get_status_analysis() {
    echo "📊 HTTP Status Code Analysis:"
    echo "============================="
    
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME" \
        --limit=500 \
        --format="value(httpRequest.status)" \
        --project=$PROJECT_ID 2>/dev/null | \
        sort | uniq -c | sort -nr
    
    echo ""
}

# Function to get regional traffic
get_regional_traffic() {
    echo "🌍 Regional Traffic Distribution:"
    echo "================================"
    
    for region in us-central1 europe-west1 asia-southeast1; do
        count=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND resource.labels.location=$region" \
            --limit=1000 \
            --format="value(httpRequest.requestUrl)" \
            --project=$PROJECT_ID 2>/dev/null | wc -l)
        echo "  $region: $count requests"
    done
    echo ""
}

# Function to get quest-specific traffic
get_quest_traffic() {
    echo "🎯 Quest System Traffic:"
    echo "======================="
    
    quest_traffic=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND httpRequest.requestUrl~'/quest'" \
        --limit=100 \
        --format="value(httpRequest.requestUrl)" \
        --project=$PROJECT_ID 2>/dev/null | wc -l)
    
    api_traffic=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND httpRequest.requestUrl~'/api/quest-log'" \
        --limit=100 \
        --format="value(httpRequest.requestUrl)" \
        --project=$PROJECT_ID 2>/dev/null | wc -l)
    
    echo "  Quest pages: $quest_traffic requests"
    echo "  Quest API: $api_traffic requests"
    echo ""
}

# Function to get performance metrics
get_performance() {
    echo "⚡ Performance Overview:"
    echo "======================="
    
    # Get recent response times
    echo "Recent response times (last 50 requests):"
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME" \
        --limit=50 \
        --format="table(httpRequest.requestUrl,httpRequest.latency)" \
        --project=$PROJECT_ID 2>/dev/null | head -10
    
    echo ""
}

# Function to generate recommendations
get_recommendations() {
    echo "💡 Optimization Recommendations:"
    echo "==============================="
    
    # Analyze most requested pages
    most_requested=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME" \
        --limit=500 \
        --format="value(httpRequest.requestUrl)" \
        --project=$PROJECT_ID 2>/dev/null | \
        sed 's|.*/|/|' | \
        grep -E "^/[a-zA-Z]" | \
        sort | uniq -c | sort -nr | head -1 | awk '{print $2}')
    
    echo "• Most requested page: $most_requested"
    echo "• Consider caching for frequently accessed API endpoints"
    echo "• Monitor quest system usage for optimization opportunities"
    echo "• Set up alerts for error rates > 5%"
    echo "• Enable Cloud CDN for static assets"
    echo ""
}

# Main execution
get_page_traffic
get_status_analysis
get_regional_traffic
get_quest_traffic
get_performance
get_recommendations

echo "🔗 Quick Access Links:"
echo "====================="
echo "• Cloud Run Dashboard: https://console.cloud.google.com/run?project=$PROJECT_ID"
echo "• Cloud Monitoring: https://console.cloud.google.com/monitoring?project=$PROJECT_ID"
echo "• Cloud Logging: https://console.cloud.google.com/logs?project=$PROJECT_ID"
echo "• Load Balancer: https://console.cloud.google.com/net-services/loadbalancing?project=$PROJECT_ID"
