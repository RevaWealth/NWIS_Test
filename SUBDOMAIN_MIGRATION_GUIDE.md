# 🚀 Complete Migration Guide: app.nwis.io Subdomain Setup

## 📋 Overview

This guide covers migrating your Web3 dapp from `nwis.io/token-purchase` to the industry-standard `app.nwis.io` subdomain pattern.

**Current Architecture:**
```
nwis.io/                    → Landing page
nwis.io/token-purchase      → Dapp (blockchain-connected)
nwis.io/about/story         → Marketing content
```

**Target Architecture:**
```
nwis.io/                    → Marketing site only
app.nwis.io/                → Full dapp with blockchain functionality
```

---

## 🎯 Migration Approaches

### **Option A: Two Separate Next.js Apps (Recommended)**
- **Pros:** Clean separation, independent scaling, easier to maintain
- **Cons:** More complex initial setup, duplicate shared code
- **Best for:** Production-grade applications with different scaling needs

### **Option B: Single Next.js App with Multi-Domain Routing**
- **Pros:** Simpler deployment, shared code/components
- **Cons:** Everything scales together, more complex routing
- **Best for:** Smaller projects or tight resource constraints

**This guide will cover Option A (recommended for your scale).**

---

## 📁 Phase 1: Project Structure Setup

### Step 1.1: Create New Project Structure

```bash
# Your new folder structure
NexusWealthVGit/
├── marketing-site/          # Main nwis.io (marketing)
│   ├── app/
│   │   ├── about/
│   │   ├── tokenomics/
│   │   ├── institutions/
│   │   ├── careers/
│   │   └── ...
│   ├── components/
│   ├── sections/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── dapp/                    # New app.nwis.io (dapp)
│   ├── app/
│   │   ├── page.tsx         # Main token purchase page
│   │   └── layout.tsx
│   ├── components/
│   │   └── token-purchase/
│   ├── hooks/
│   ├── lib/
│   ├── public/              # Shared or dapp-specific assets
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile
│
└── shared/                  # Optional: Shared components/utils
    ├── components/
    │   └── UI/
    └── lib/
```

### Step 1.2: Initialize New Dapp Project

```bash
# From your project root
cd /Users/arashsarabian/Desktop/NexusWealthVGit

# Create new dapp directory
mkdir dapp
cd dapp

# Initialize new Next.js project
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Install Web3 dependencies
npm install wagmi viem @tanstack/react-query connectkit ethers@5.7.2 web3
npm install @radix-ui/react-toast @radix-ui/react-label @radix-ui/react-progress
npm install lucide-react class-variance-authority clsx tailwind-merge next-themes
```

---

## 🔧 Phase 2: Code Migration

### Step 2.1: Move Dapp-Specific Files

**Files to move from root to `dapp/`:**

```bash
# Core dapp components
token-purchase-new.tsx → dapp/components/token-purchase-new.tsx
token-purchase-new-backup.tsx → dapp/components/token-purchase-new-backup.tsx

# Token purchase components
components/token-purchase/* → dapp/components/token-purchase/

# Hooks (all Web3 related)
hooks/use-contract-data.ts → dapp/hooks/
hooks/use-eth-price.ts → dapp/hooks/
hooks/use-token-approval.ts → dapp/hooks/
hooks/use-token-calculation.ts → dapp/hooks/
hooks/use-transaction-confirmation.ts → dapp/hooks/
hooks/use-tracking.ts → dapp/hooks/

# Libraries
lib/wagmi.ts → dapp/lib/
lib/constants.ts → dapp/lib/
lib/currency-config.tsx → dapp/lib/
lib/token-purchase-utils.ts → dapp/lib/
lib/types.ts → dapp/lib/
lib/wallet-browser-utils.ts → dapp/lib/

# Web3 providers
wallet-provider.tsx → dapp/components/wallet-provider.tsx

# API routes (token-sale, eth-price)
app/api/token-sale/ → dapp/app/api/token-sale/
app/api/eth-price/ → dapp/app/api/eth-price/

# Contract config
contract-config.js → dapp/lib/contract-config.js
contracts/ → dapp/contracts/
```

### Step 2.2: Create Dapp Layout and Main Page

**File: `dapp/app/layout.tsx`**

```typescript
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/wallet-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/UI/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NWIS Token Sale | NexusWealth DApp",
  description: "Purchase NWIS tokens through our secure blockchain-powered platform",
  keywords: "NWIS, token sale, Web3, DeFi, NexusWealth",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NWIS Token Sale | NexusWealth DApp",
    description: "Purchase NWIS tokens through our secure blockchain-powered platform",
    type: "website",
    siteName: "NexusWealth DApp",
    url: "https://app.nwis.io",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#a57e24" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <WalletProvider>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="dark" 
              enableSystem={false}
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

**File: `dapp/app/page.tsx`**

```typescript
'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import CountdownTimer from "@/components/countdown-timer"
import TokenPurchaseNew from "@/components/token-purchase-new"
import Navbar from "@/components/navbar"
import { isMobileDevice, isWalletBrowser } from "@/lib/wallet-browser-utils"

interface TokenSaleData {
  currentPrice: string
  amountRaised: string
  tokenValue: string
}

export default function DappHome() {
  const [tokenSaleData, setTokenSaleData] = useState<TokenSaleData | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/token-sale")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data: TokenSaleData = await response.json()
        setTokenSaleData(data)
      } catch (error) {
        console.error("Failed to fetch token sale data:", error)
        setTokenSaleData({
          currentPrice: "$0.001",
          amountRaised: "$345,000",
          tokenValue: "1 NWIS = $0.001",
        })
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const checkBrowser = () => {
      const isMobile = isMobileDevice()
      const isWallet = isWalletBrowser()
      setIsDesktop(!isMobile && !isWallet)
    }
    
    checkBrowser()
    window.addEventListener('resize', checkBrowser)
    return () => window.removeEventListener('resize', checkBrowser)
  }, [])

  if (!tokenSaleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative">
      {/* Video Background - Desktop Only */}
      {isDesktop && (
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/images/ST5.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#000000] to-sky-900 py-8 px-4">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              NWIS Token Presale
            </h1>
            <p className="text-xl text-[#a57e24] font-medium">
              Own stake in the disruptive force that is reshaping the future of asset management
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-[#0c1220] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
              <div className="relative">
                <div className="bg-[#a57e24] p-4 text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-white">Series A</span>
                  </div>
                  <span className="text-sm text-white">DAO Presale</span>
                </div>
              </div>

              <div className="p-6 bg-[#000000]">
                <p className="text-gray-400 text-sm text-center mb-4">
                  Can't find tokens in your wallet?
                </p>

                <h3 className="text-2xl font-bold text-center mb-6">
                  <span className="text-white">First Stage - Buy </span>
                  <span className="text-[rgba(165,126,36,1)]">NWIS</span>
                  <span className="text-white"> Now</span>
                </h3>

                <CountdownTimer />

                <p className="text-gray-400 text-center text-sm mt-4 mb-6">
                  ICO Starts October 1st, 2025
                </p>

                <TokenPurchaseNew />
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 text-center">
              <p className="text-gray-300 mb-4">
                Ready to start improving your financial future?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://nwis.io/about/story"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Learn More About NexusWealth
                </a>
                <span className="text-xs text-gray-500">•</span>
                <a
                  href="https://nwis.io/tokenomics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  View Tokenomics
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
```

### Step 2.3: Update Next.js Config for Dapp

**File: `dapp/next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nwis.io',
      },
    ],
  },
  // Enable external links to marketing site
  async redirects() {
    return [
      {
        source: '/about/:path*',
        destination: 'https://nwis.io/about/:path*',
        permanent: true,
      },
      {
        source: '/tokenomics',
        destination: 'https://nwis.io/tokenomics',
        permanent: true,
      },
      {
        source: '/institutions',
        destination: 'https://nwis.io/institutions',
        permanent: true,
      },
    ]
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### Step 2.4: Create Dapp Package.json

**File: `dapp/package.json`**

```json
{
  "name": "nexuswealth-dapp",
  "version": "2.0.0",
  "description": "NexusWealth Web3 DApp - Token Purchase Platform",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-toast": "^1.2.15",
    "@tanstack/react-query": "^5.0.0",
    "@wagmi/core": "^2.19.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "connectkit": "^1.9.1",
    "ethers": "^5.7.2",
    "lucide-react": "^0.541.0",
    "next": "^15.5.0",
    "next-themes": "^0.4.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^3.3.1",
    "viem": "^2.34.0",
    "wagmi": "^2.16.4",
    "web3": "^4.16.0"
  },
  "devDependencies": {
    "@types/node": "^24.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.9.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🌐 Phase 3: DNS & Domain Configuration

### Step 3.1: Configure DNS Records

You need to add DNS records to point `app.nwis.io` to your deployment. This depends on your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap).

**For Google Cloud Run (your current setup):**

1. **Get your Cloud Run service URL:**
```bash
gcloud run services describe nexuswealth-dapp \
  --platform managed \
  --region us-central1 \
  --format="value(status.url)"
```

2. **Add DNS records:**

If using **Cloud DNS** or similar:

```
Type: CNAME
Name: app
Value: ghs.googlehosted.com
TTL: 3600
```

OR if using **A record** (after getting Cloud Run IP):

```
Type: A
Name: app
Value: [Cloud Run IP address]
TTL: 3600
```

**For Cloudflare (recommended):**

1. Log into Cloudflare dashboard
2. Select your domain `nwis.io`
3. Go to DNS → Records
4. Add new record:
   - Type: `CNAME`
   - Name: `app`
   - Target: Your Cloud Run URL or `ghs.googlehosted.com`
   - Proxy status: Proxied (orange cloud) ✅
   - TTL: Auto

### Step 3.2: Verify Domain Ownership in Google Cloud

```bash
# Add domain mapping to Cloud Run
gcloud run domain-mappings create \
  --service nexuswealth-dapp \
  --domain app.nwis.io \
  --region us-central1 \
  --platform managed
```

### Step 3.3: SSL Certificate Configuration

Google Cloud Run automatically provisions SSL certificates via Let's Encrypt. This takes 15-60 minutes after DNS propagation.

**Check certificate status:**

```bash
gcloud run domain-mappings describe \
  --domain app.nwis.io \
  --region us-central1 \
  --platform managed
```

---

## 🐳 Phase 4: Docker & Deployment

### Step 4.1: Create Dockerfile for Dapp

**File: `dapp/Dockerfile`**

```dockerfile
# Use Node.js 18 Alpine as base
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --platform=linux --arch=x64

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Step 4.2: Create Deployment Script

**File: `dapp/deploy-to-gcp.sh`**

```bash
#!/bin/bash

# Multi-Region Deployment Script for NexusWealth Dapp
# Deploys to US, Europe, and Asia for global low-latency access

# Configuration
PROJECT_ID="nexuswealthtest"
SERVICE_NAME="nexuswealth-dapp"
REGIONS=("us-central1" "europe-west1" "asia-southeast1")
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🌍 Starting multi-region deployment of NexusWealth DApp..."
echo "Regions: ${REGIONS[*]}"
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

# Build Docker image (once for all regions)
echo ""
echo "🔨 Building Docker image..."
docker build --platform linux/amd64 -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Push to Container Registry
echo ""
echo "📤 Pushing to Google Container Registry..."
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
echo "🌐 Next Steps:"
echo "  1. Set up Cloud Load Balancer for app.nwis.io"
echo "  2. Configure global routing and SSL"
echo "  3. See MULTI_REGION_DEPLOYMENT_GUIDE.md for details"
echo ""
```

Make it executable:

```bash
chmod +x dapp/deploy-to-gcp.sh
```

### Step 4.3: Deploy the Dapp

```bash
# Navigate to dapp directory
cd /Users/arashsarabian/Desktop/NexusWealthVGit/dapp

# Run deployment
./deploy-to-gcp.sh
```

---

## 🔗 Phase 5: Update Marketing Site

### Step 5.1: Update Links in Marketing Site

Now update your main `nwis.io` site to link to the new dapp.

**Update these files in your root/marketing-site:**

**File: `app/page.tsx` (Homepage)**

```typescript
// Update CTA button
<Link
  href="https://app.nwis.io"
  className="bg-[#a57e24] hover:bg-[#8a6a1f] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
>
  Launch App
</Link>
```

**File: `sections/navbar.tsx`**

```typescript
// Update navigation link
<Link
  href="https://app.nwis.io"
  className="bg-[#a57e24] hover:bg-[#8a6a1f] text-white px-6 py-2 rounded-lg font-semibold"
>
  Launch App
</Link>
```

### Step 5.2: Remove Dapp Route from Marketing Site

```bash
# In your root directory
rm -rf app/token-purchase
rm -rf app/api/token-sale
rm -rf app/api/eth-price
```

### Step 5.3: Clean Up Marketing Site Dependencies

**File: `package.json` (root/marketing-site)**

Remove Web3-specific dependencies:

```json
{
  "dependencies": {
    // Remove these:
    // "@wagmi/core": "^2.19.0",
    // "connectkit": "^1.9.1",
    // "ethers": "^5.7.2",
    // "viem": "^2.34.0",
    // "wagmi": "^2.16.4",
    // "web3": "^4.16.0"
    
    // Keep marketing site dependencies
    "next": "^15.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    // ... other UI libraries
  }
}
```

Then reinstall:

```bash
npm install
```

---

## 🔒 Phase 6: Environment Variables & Security

### Step 6.1: Create Dapp Environment File

**File: `dapp/.env.local`**

```bash
# Public variables (exposed to browser)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=0xYourPresaleAddress
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# API Keys (server-side only)
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature flags
NEXT_PUBLIC_ENABLE_TESTNET=false
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### Step 6.2: Set Environment Variables in Cloud Run

```bash
# Set secrets for production
gcloud run services update nexuswealth-dapp \
  --region us-central1 \
  --update-env-vars \
    NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourAddress,\
    NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=0xYourPresaleAddress,\
    NEXT_PUBLIC_CHAIN_ID=1,\
    NODE_ENV=production
```

### Step 6.3: Configure CORS

**File: `dapp/middleware.ts`**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Allow requests from marketing site
  response.headers.set('Access-Control-Allow-Origin', 'https://nwis.io')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## 📊 Phase 7: Testing & Verification

### Step 7.1: Local Testing

```bash
# Terminal 1: Start marketing site
cd /Users/arashsarabian/Desktop/NexusWealthVGit
npm run dev
# Opens on http://localhost:3000

# Terminal 2: Start dapp
cd /Users/arashsarabian/Desktop/NexusWealthVGit/dapp
npm run dev
# Opens on http://localhost:3001
```

**Test checklist:**
- ✅ Marketing site loads at localhost:3000
- ✅ Dapp loads at localhost:3001
- ✅ Links from marketing site to dapp work
- ✅ Wallet connection works in dapp
- ✅ Token purchase flow works
- ✅ No console errors

### Step 7.2: Staging/Production Testing

After deployment:

```bash
# Check if services are running
gcloud run services list --platform managed --region us-central1

# Check domain mapping
gcloud run domain-mappings list --platform managed --region us-central1

# View logs
gcloud run services logs read nexuswealth-dapp \
  --platform managed \
  --region us-central1 \
  --limit 50
```

**Production checklist:**
- ✅ `https://nwis.io` loads correctly
- ✅ `https://app.nwis.io` loads correctly
- ✅ SSL certificates are valid (check padlock icon)
- ✅ DNS resolves correctly: `dig app.nwis.io`
- ✅ Cross-origin requests work
- ✅ Wallet connects on production
- ✅ Transactions work end-to-end
- ✅ Analytics tracking works
- ✅ Mobile responsiveness

### Step 7.3: Performance Testing

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Test both sites
lhci autorun --url=https://nwis.io
lhci autorun --url=https://app.nwis.io
```

---

## 🚨 Phase 8: Troubleshooting

### Common Issues & Solutions

#### 1. **DNS Not Resolving**

```bash
# Check DNS propagation
dig app.nwis.io
nslookup app.nwis.io

# Clear DNS cache (Mac)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Wait 15-60 minutes for propagation
```

#### 2. **SSL Certificate Issues**

```bash
# Check certificate status
gcloud run domain-mappings describe app.nwis.io \
  --region us-central1 --platform managed

# Force certificate renewal (if needed)
gcloud run domain-mappings delete app.nwis.io \
  --region us-central1 --platform managed
# Then recreate the mapping
```

#### 3. **CORS Errors**

Add this to `dapp/next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://nwis.io' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ]
}
```

#### 4. **Wallet Connection Fails**

Check:
- WalletConnect Project ID is set
- RPC URLs are correct
- Chain ID matches your network
- MetaMask is on correct network

#### 5. **Build Fails on Cloud Run**

```bash
# Check Docker build locally first
cd dapp
docker build -t test-build .

# Check logs
docker run -p 3000:3000 test-build
```

#### 6. **Environment Variables Not Loading**

```bash
# Verify Cloud Run env vars
gcloud run services describe nexuswealth-dapp \
  --region us-central1 \
  --format="yaml(spec.template.spec.containers[0].env)"

# Update if needed
gcloud run services update nexuswealth-dapp \
  --region us-central1 \
  --update-env-vars KEY=VALUE
```

---

## 📋 Phase 9: Post-Migration Checklist

### Technical Checklist

- [ ] DNS records configured
- [ ] SSL certificates active
- [ ] Both sites deployed and accessible
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Wallet connection works
- [ ] Token purchase flow works
- [ ] Analytics tracking active
- [ ] Error monitoring setup
- [ ] Backup/rollback plan ready

### SEO Checklist

- [ ] Set up 301 redirects from old URLs
- [ ] Update sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Update social media links
- [ ] Update documentation links
- [ ] Notify users of new URL

### Marketing Checklist

- [ ] Announce new dapp URL
- [ ] Update email signatures
- [ ] Update whitepaper links
- [ ] Update social media bios
- [ ] Update advertisements
- [ ] Update partner integrations

---

## 🎯 Phase 10: SEO & Redirects

### Step 10.1: Set Up Redirects

**In your marketing site `next.config.js`:**

```javascript
async redirects() {
  return [
    {
      source: '/token-purchase',
      destination: 'https://app.nwis.io',
      permanent: true, // 301 redirect
    },
    {
      source: '/app',
      destination: 'https://app.nwis.io',
      permanent: true,
    },
  ]
}
```

### Step 10.2: Create Sitemap

**File: `dapp/public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://app.nwis.io</loc>
    <lastmod>2025-10-11</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Step 10.3: Update robots.txt

**File: `dapp/public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://app.nwis.io/sitemap.xml
```

---

## 💰 Cost Estimation

### Google Cloud Run Costs (Multi-Region)

**Dapp (app.nwis.io) - Multi-Region:**
- Cloud Run (3 regions): ~$60-120/month
- Load Balancer: ~$25-40/month
- Bandwidth: ~$10-20/month
- **Total: ~$85-160/month**

**Marketing Site (nwis.io) - Single Region:**
- Container: ~$20-40/month
- **Total: ~$20-40/month**

**Combined Monthly Cost: $105-200**

**Benefits of Multi-Region:**
- 🌍 Global low latency (<100ms worldwide)
- 🔄 Automatic failover
- 📈 99.95% uptime SLA
- ⚡ Better user experience

Cost optimizations:
- Set min-instances to 0 during low traffic
- Use Cloud CDN for static assets
- Implement caching strategies

---

## 🔄 Rollback Plan

If something goes wrong:

```bash
# 1. Revert DNS
# Change app.nwis.io CNAME back to old target

# 2. Deploy old version
git checkout <previous-commit>
./deploy-to-gcp.sh

# 3. Or point to old Cloud Run revision
gcloud run services update-traffic nexuswealth-dapp \
  --region us-central1 \
  --to-revisions <previous-revision>=100
```

---

## 📞 Support & Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [WagMi Documentation](https://wagmi.sh)
- [ConnectKit Documentation](https://docs.family.co/connectkit)

### Monitoring

Set up monitoring with:

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime-checks create HTTPS \
  --display-name="NWIS Dapp Health Check" \
  --uri=https://app.nwis.io \
  --check-interval=60s
```

---

## ✅ Success Metrics

After migration, monitor:

1. **Uptime**: Should be >99.9%
2. **Load Time**: <2s for first contentful paint
3. **Wallet Connection Rate**: Track successful connections
4. **Transaction Success Rate**: Monitor failed transactions
5. **User Complaints**: Track support tickets

---

## 🎉 Summary

You now have:

✅ **Separated architecture**
- Marketing site: `nwis.io`
- Dapp: `app.nwis.io`

✅ **Professional setup**
- Industry-standard URL structure
- Clean code separation
- Independent scaling

✅ **Production-ready**
- SSL enabled
- DNS configured
- Monitoring active

---

**Need help? Create an issue or contact your DevOps team!**

*Last updated: October 11, 2025*

