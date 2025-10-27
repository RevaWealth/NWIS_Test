#!/bin/bash

# Google Cloud Run Traffic Analytics Script
# This script provides comprehensive traffic reports for your Cloud Run services

PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")

echo "🚀 Google Cloud Run Traffic Analytics Report"
echo "=============================================="
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Date: $(date)"
echo ""

# Function to get service metrics
get_service_metrics() {
    local region=$1
    echo "📊 Metrics for $region:"
    
    # Get request count
    local request_count=$(gcloud monitoring metrics list --filter="metric.type:run.googleapis.com/request_count AND resource.labels.service_name:$SERVICE_NAME AND resource.labels.location:$region" --limit=1 --format="value(metric.type)" 2>/dev/null)
    
    if [ -n "$request_count" ]; then
        echo "  ✅ Request monitoring enabled"
    else
        echo "  ⚠️  Request monitoring not available"
    fi
    
    # Get service URL
    local service_url=$(gcloud run services describe $SERVICE_NAME --region=$region --format="value(status.url)" 2>/dev/null)
    if [ -n "$service_url" ]; then
        echo "  🌐 URL: $service_url"
    else
        echo "  ❌ Service not found in $region"
    fi
    echo ""
}

# Function to get recent traffic
get_recent_traffic() {
    echo "📈 Recent Traffic Analysis (Last 24 hours):"
    echo "-------------------------------------------"
    
    # Get recent requests
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND timestamp>=\"$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)\"" \
        --limit=50 \
        --format="table(timestamp,httpRequest.requestUrl,httpRequest.status,httpRequest.userAgent)" \
        --project=$PROJECT_ID 2>/dev/null || echo "No recent traffic data available"
    echo ""
}

# Function to get page-specific analytics
get_page_analytics() {
    echo "📄 Page-Specific Analytics:"
    echo "---------------------------"
    
    # Count requests by path
    echo "Request counts by path (last 24 hours):"
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND timestamp>=\"$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)\"" \
        --limit=1000 \
        --format="value(httpRequest.requestUrl)" \
        --project=$PROJECT_ID 2>/dev/null | \
        sed 's|.*/|/|' | sort | uniq -c | sort -nr | head -10 || echo "No page data available"
    echo ""
}

# Function to get error analysis
get_error_analysis() {
    echo "🚨 Error Analysis:"
    echo "------------------"
    
    # Get error responses
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND httpRequest.status>=400 AND timestamp>=\"$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)\"" \
        --limit=20 \
        --format="table(timestamp,httpRequest.requestUrl,httpRequest.status,httpRequest.responseSize)" \
        --project=$PROJECT_ID 2>/dev/null || echo "No errors found in last 24 hours"
    echo ""
}

# Function to get performance metrics
get_performance_metrics() {
    echo "⚡ Performance Metrics:"
    echo "-----------------------"
    
    # Get average response time
    echo "Average response times by region (last hour):"
    for region in "${REGIONS[@]}"; do
        local avg_time=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND resource.labels.location=$region AND timestamp>=\"$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)\"" \
            --limit=100 \
            --format="value(httpRequest.latency)" \
            --project=$PROJECT_ID 2>/dev/null | \
            awk '{sum+=$1; count++} END {if(count>0) print sum/count "s"; else print "No data"}' 2>/dev/null)
        echo "  $region: $avg_time"
    done
    echo ""
}

# Main execution
echo "🔍 Analyzing all regions..."
for region in "${REGIONS[@]}"; do
    get_service_metrics $region
done

get_recent_traffic
get_page_analytics
get_error_analysis
get_performance_metrics

echo "📊 Additional Resources:"
echo "========================"
echo "• Cloud Run Metrics Dashboard: https://console.cloud.google.com/run?project=$PROJECT_ID"
echo "• Cloud Monitoring: https://console.cloud.google.com/monitoring?project=$PROJECT_ID"
echo "• Cloud Logging: https://console.cloud.google.com/logs?project=$PROJECT_ID"
echo ""
echo "💡 Pro Tips:"
echo "• Set up alerts for high error rates"
echo "• Monitor response times for performance optimization"
echo "• Use Cloud Monitoring dashboards for real-time metrics"
echo "• Enable detailed logging for better analytics"
