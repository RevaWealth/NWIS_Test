# 🔄 Hybrid Deployment: Running Both Setups Simultaneously

## 📋 Overview

**Yes, you can have BOTH!** This guide covers running your dapp at **both** locations:
- `nwis.io/token-purchase` (current/legacy)
- `app.nwis.io` (new/standard)

This is the **recommended approach** for:
- ✅ Zero-downtime migration
- ✅ Gradual user transition
- ✅ A/B testing
- ✅ Rollback safety
- ✅ SEO preservation

---

## 🎯 Three Deployment Strategies

### Strategy 1: Dual Deployment (Recommended) ⭐
Run both independently, gradually shift traffic to new subdomain.

### Strategy 2: Shared Backend
Deploy once, serve from multiple domains (monorepo with routing).

### Strategy 3: Progressive Migration
Start with both, deprecate old URL after transition period.

---

## 🏗️ Strategy 1: Dual Deployment (Recommended)

### Architecture

```
┌─────────────────────────────────────┐
│  nwis.io (Current Setup)            │
│                                     │
│  - Marketing pages                  │
│  - /token-purchase (dapp) ✅        │
│  - All current functionality        │
│                                     │
│  Status: LIVE, existing users       │
└─────────────────────────────────────┘
              ↓
         [Traffic Split]
              ↓
┌─────────────────────────────────────┐
│  app.nwis.io (New Setup)            │
│                                     │
│  - Token purchase dapp only         │
│  - Same functionality               │
│  - Modern architecture              │
│                                     │
│  Status: LIVE, new users            │
└─────────────────────────────────────┘
```

### Implementation Steps

#### Step 1: Deploy app.nwis.io (Keep Current Setup)

```bash
# Keep your current nwis.io deployment as-is
# Don't change anything!

# Create new dapp deployment
cd /Users/arashsarabian/Desktop/NexusWealthVGit
mkdir dapp
cd dapp

# Copy (don't move) files for new deployment
cp -r ../app/token-purchase ./app/
cp -r ../components/token-purchase ./components/
cp -r ../hooks ./hooks/
cp -r ../lib/wagmi.ts ./lib/
# ... etc (copy, don't move)
```

#### Step 2: Configure DNS for app.nwis.io

```
Type: CNAME
Name: app
Value: ghs.googlehosted.com
TTL: 3600
```

#### Step 3: Deploy to Separate Cloud Run Service (Multi-Region)

**File: `dapp/deploy-to-gcp.sh`**

```bash
#!/bin/bash

# Deploy dapp to NEW Cloud Run service (Multi-Region)
PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp-v2"  # Different service name!
REGIONS=("us-central1" "europe-west1" "asia-southeast1")  # Multi-region
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🌍 Deploying NEW dapp to app.nwis.io (multi-region)..."

# Build and push once
docker build --platform linux/amd64 -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy to all regions
for region in "${REGIONS[@]}"; do
    echo "Deploying to $region..."
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

echo "✅ Deployed to all regions!"
echo "✅ Old setup at nwis.io/token-purchase still running"
echo "✅ New setup deployed to US, Europe, and Asia"
echo ""
echo "💡 Next: Set up Cloud Load Balancer for app.nwis.io"
echo "   See MULTI_REGION_DEPLOYMENT_GUIDE.md for details"
```

#### Step 4: Update Marketing Site (Add Links to Both)

**File: `sections/navbar.tsx`** (on nwis.io)

```typescript
// Add both links during transition
<div className="flex gap-4">
  {/* Link to current/legacy dapp */}
  <Link
    href="/token-purchase"
    className="text-white hover:text-[#a57e24]"
  >
    Buy Tokens
  </Link>
  
  {/* Link to new dapp (with badge) */}
  <Link
    href="https://app.nwis.io"
    className="bg-[#a57e24] hover:bg-[#8a6a1f] text-white px-4 py-2 rounded-lg relative"
  >
    Launch App
    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
      New!
    </span>
  </Link>
</div>
```

#### Step 5: Add Banner on Old Dapp

**File: `app/token-purchase/page.tsx`** (existing)

```typescript
export default function TokenPurchasePage() {
  return (
    <div className="min-h-screen">
      {/* Migration Banner */}
      <div className="bg-gradient-to-r from-[#a57e24] to-[#8a6a1f] text-white py-3 px-4 text-center">
        <p className="text-sm md:text-base">
          🚀 Try our new app at{" "}
          <a 
            href="https://app.nwis.io" 
            className="underline font-bold hover:text-gray-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            app.nwis.io
          </a>
          {" "}with improved performance!
        </p>
      </div>

      {/* Rest of your existing code */}
      {/* ... */}
    </div>
  )
}
```

### Benefits of Dual Deployment

✅ **Zero downtime** - Both work simultaneously  
✅ **No risk** - Old version still accessible  
✅ **Gradual migration** - Users can choose when to switch  
✅ **Easy rollback** - Just remove banner and new links  
✅ **Testing** - Compare performance/behavior  
✅ **SEO preserved** - Old URLs still work  

### Cost Impact

```
Current Cost (Single Region):        $30-50/month
Dual Deployment (Both Multi-Region): $120-200/month (2 services × 3 regions)
After Migration (Multi-Region):      $85-160/month (1 service × 3 regions + LB)
```

**During transition period:** Extra $60-90/month (temporary)

**Note:** For cost savings during transition, you can:
- Keep old setup single-region: $30-50/month
- Deploy new setup multi-region: $85-160/month
- **Total:** $115-210/month during transition

---

## 🔀 Strategy 2: Shared Backend with Multi-Domain

### Architecture

```
┌────────────────────────────────────────────┐
│  Single Next.js App (Smart Routing)        │
│                                            │
│  Routes:                                   │
│  - app.nwis.io → Token Purchase            │
│  - nwis.io/token-purchase → Token Purchase │
│  - nwis.io/* → Marketing pages             │
│                                            │
│  Same codebase, multiple entry points      │
└────────────────────────────────────────────┘
```

### Implementation

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Handle multiple domains
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },

  // Rewrite app.nwis.io to token-purchase internally
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'app.nwis.io',
            },
          ],
          destination: '/token-purchase/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
```

**File: `middleware.ts`**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // If accessing from app.nwis.io
  if (hostname === 'app.nwis.io') {
    // Only allow access to token purchase
    const url = request.nextUrl.clone()
    
    // Root of app.nwis.io goes to token purchase
    if (url.pathname === '/') {
      url.pathname = '/token-purchase'
      return NextResponse.rewrite(url)
    }
    
    // Block access to marketing pages from app subdomain
    const marketingPages = ['/about', '/tokenomics', '/institutions', '/careers']
    if (marketingPages.some(page => url.pathname.startsWith(page))) {
      return NextResponse.redirect(new URL('https://nwis.io' + url.pathname))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Deploy Single Service with Multiple Domains (Multi-Region):**

```bash
# Deploy to all regions once
REGIONS=("us-central1" "europe-west1" "asia-southeast1")

for region in "${REGIONS[@]}"; do
    gcloud run deploy nexuswealth-dapp \
        --image $IMAGE_NAME \
        --platform managed \
        --region $region \
        --allow-unauthenticated \
        --set-env-vars NODE_ENV=production,REGION=$region
done

# Then set up global Load Balancer to serve both domains
# See MULTI_REGION_DEPLOYMENT_GUIDE.md for complete setup
```

### Benefits of Shared Backend

✅ **Single deployment** - Easier to maintain  
✅ **Shared code** - No duplication  
✅ **Same cost** - Only one service  
✅ **Consistent behavior** - Exact same code  

### Drawbacks

❌ **Can't scale independently**  
❌ **More complex routing logic**  
❌ **Both go down if service fails**  

---

## 🎯 Strategy 3: Progressive Migration (Best Practice)

### Timeline

```
Week 1-2:   Deploy app.nwis.io, add banner to old version
Week 3-4:   Monitor traffic split, fix any issues
Week 5-6:   Promote new URL, update documentation
Week 7-8:   80% traffic to new URL
Week 9-12:  90% traffic to new URL
Month 4+:   Deprecate old URL, add redirect
```

### Phase 1: Soft Launch (Week 1-2)

**Goal:** Deploy new version, test with small audience

```typescript
// Add banner to old version
<div className="bg-blue-600 text-white py-2 px-4 text-center">
  🧪 Beta: Try our new app at <a href="https://app.nwis.io">app.nwis.io</a>
</div>
```

**Marketing site:**
- Keep primary CTA pointing to old URL
- Add secondary "Try New Version" button

### Phase 2: Parallel Running (Week 3-4)

**Goal:** Run both, monitor for issues

```typescript
// Update primary CTA to new URL
<Link href="https://app.nwis.io" className="btn-primary">
  Launch App
</Link>

// Add fallback link
<Link href="/token-purchase" className="text-sm text-gray-500">
  Use legacy version
</Link>
```

**Monitor:**
- Transaction success rates on both
- Wallet connection rates
- User feedback
- Error rates

### Phase 3: Primary Migration (Week 5-8)

**Goal:** Make new URL the primary, keep old as fallback

```typescript
// Update old version with deprecation notice
<div className="bg-yellow-600 text-white py-3 px-4 text-center">
  ⚠️ This version will be deprecated soon. Please use 
  <a href="https://app.nwis.io" className="underline font-bold">
    app.nwis.io
  </a>
</div>
```

**Actions:**
- Update all documentation
- Send email to users
- Update social media links
- Update whitepaper

### Phase 4: Deprecation (Week 9-12)

**Goal:** Warn users of upcoming removal

```typescript
// Strong deprecation warning
<div className="bg-red-600 text-white py-4 px-4 text-center">
  🚨 This version will be removed on [DATE]. 
  Please switch to <a href="https://app.nwis.io">app.nwis.io</a>
  <br />
  <Link href="https://app.nwis.io" className="btn mt-2">
    Switch Now →
  </Link>
</div>
```

### Phase 5: Full Migration (Month 4+)

**Goal:** Remove old version, add redirect

```javascript
// next.config.js
async redirects() {
  return [
    {
      source: '/token-purchase',
      destination: 'https://app.nwis.io',
      permanent: true,  // 301 redirect
    },
  ]
}
```

**Actions:**
- Remove old dapp code
- Add permanent redirect
- Remove old Cloud Run service
- Update sitemap

---

## 📊 Comparison Matrix

| Feature | Dual Deployment | Shared Backend | Progressive |
|---------|----------------|----------------|-------------|
| **Cost** | Higher (2x) | Same | Higher → Same |
| **Risk** | Lowest | Medium | Lowest |
| **Complexity** | Low | High | Medium |
| **Downtime** | None | None | None |
| **Independent Scaling** | ✅ Yes | ❌ No | ✅ Yes |
| **Easy Rollback** | ✅ Yes | ⚠️ Moderate | ✅ Yes |
| **SEO Impact** | None | None | Minimal |
| **User Experience** | Smooth | Smooth | Smoothest |
| **Recommended** | ✅ Yes | ⚠️ Advanced | ⭐ Best |

---

## 🔧 Implementation: Quick Start Guide

### Option A: Keep Both Indefinitely (Dual Deployment)

```bash
# 1. Don't touch current deployment at all!

# 2. Create new dapp in separate folder
mkdir dapp
cd dapp
# ... follow SUBDOMAIN_MIGRATION_GUIDE.md

# 3. Deploy to NEW Cloud Run service
./deploy-to-gcp.sh

# 4. Add links to both in your marketing site
# 5. Done! Both are now running
```

**Timeline:** 4-5 hours  
**Cost:** +$20-30/month  
**Risk:** Minimal  

### Option B: Shared Backend (Advanced)

```bash
# 1. Add middleware.ts with domain detection
# 2. Update next.config.js with rewrites
# 3. Map both domains to same Cloud Run service
# 4. Test thoroughly
```

**Timeline:** 2-3 hours  
**Cost:** No change  
**Risk:** Medium (more complex)  

### Option C: Progressive Migration (Recommended)

```bash
# Week 1: Deploy app.nwis.io (keep old)
# Week 2-3: Test and monitor both
# Week 4-8: Gradually shift traffic
# Week 9-12: Deprecation warnings
# Month 4+: Remove old, add redirect
```

**Timeline:** 3-4 months  
**Cost:** +$20-30/month (temporary)  
**Risk:** Minimal  
**Result:** Smoothest user experience  

---

## 🎯 Recommended Approach

### For Immediate Deployment: Dual Deployment
**Best if:** You want new URL live ASAP with zero risk

1. Deploy app.nwis.io as separate service
2. Keep nwis.io/token-purchase running
3. Add both links to marketing site
4. Monitor traffic split
5. Eventually deprecate old URL

### For Gradual Transition: Progressive Migration
**Best if:** You want smoothest user experience

1. Week 1: Deploy app.nwis.io, soft launch
2. Week 2-4: Run both, gather feedback
3. Week 5-8: Make app.nwis.io primary
4. Week 9-12: Deprecation warnings
5. Month 4+: Remove old version

### For Single Deployment: Shared Backend
**Best if:** You want to minimize costs

1. Add middleware for domain detection
2. Use rewrites to serve same code
3. Map both domains to one service
4. Eventually remove old domain mapping

---

## 🚨 Important Considerations

### Contract Addresses
**Question:** Should both use the same contracts?

**Answer:** YES! Both should point to the **same** smart contracts.

```typescript
// lib/constants.ts (shared or duplicated)
export const CONTRACT_ADDRESSES = {
  TOKEN: "0x...", // Same address in both
  PRESALE: "0x...", // Same address in both
}
```

### Analytics Tracking

Track which version users are using:

```typescript
// In app.nwis.io
useEffect(() => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_location: 'app.nwis.io',
      version: 'v2'
    })
  }
}, [])

// In nwis.io/token-purchase
useEffect(() => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_location: 'nwis.io/token-purchase',
      version: 'v1_legacy'
    })
  }
}, [])
```

### Database/State
If you're storing user preferences or transaction history:
- Use same backend API for both
- Or use wallet address as key (already works cross-site)

---

## ✅ Decision Matrix

### Choose **Dual Deployment** if:
- ✅ You want zero risk
- ✅ You need easy rollback
- ✅ Cost increase is acceptable
- ✅ You want independent scaling
- ✅ You want A/B testing capability

### Choose **Shared Backend** if:
- ✅ You want minimal cost
- ✅ You're comfortable with complex routing
- ✅ You don't need independent scaling
- ✅ You want single source of truth

### Choose **Progressive Migration** if:
- ✅ You want smoothest user experience
- ✅ You have 3-4 months for transition
- ✅ You want to educate users gradually
- ✅ You want to preserve SEO fully

---

## 📝 Quick Reference Commands

### Deploy Both (Dual Deployment)

```bash
# Deploy current (if not already deployed)
gcloud run deploy nexuswealth-dapp \
    --image gcr.io/nexuswealthtest/nexuswealth-dapp \
    --region us-central1

# Deploy new dapp
cd dapp
./deploy-to-gcp.sh

# Result: Both running simultaneously
```

### Check Running Services

```bash
# List all Cloud Run services
gcloud run services list --platform managed --region us-central1

# Should see:
# - nexuswealth-dapp (for nwis.io)
# - nexuswealth-dapp-v2 (for app.nwis.io)
```

### Monitor Both

```bash
# Check logs for current version
gcloud run services logs read nexuswealth-dapp \
    --region us-central1 --limit 50

# Check logs for new version
gcloud run services logs read nexuswealth-dapp-v2 \
    --region us-central1 --limit 50
```

---

## 🎉 Summary

**YES, you can have both!**

| Scenario | Solution | Cost | Complexity |
|----------|----------|------|------------|
| **Testing new URL** | Dual Deployment | +$20-30/mo | Low |
| **Gradual migration** | Progressive | +$20-30/mo (temp) | Medium |
| **Cost-effective** | Shared Backend | $0 extra | High |
| **Long-term (recommended)** | Progressive → Single | $0 extra eventually | Medium |

**My Recommendation:**
1. **Start:** Dual Deployment (deploy app.nwis.io, keep old)
2. **Monitor:** Run both for 2-4 weeks
3. **Transition:** Progressive migration over 3 months
4. **End:** Remove old version, keep app.nwis.io only

This gives you **zero risk**, **smooth transition**, and **professional result**! 🚀

---

*Last updated: October 11, 2025*

