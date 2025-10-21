# NexusWealth DApp (app.nwis.io)

## Overview

This is the **Web3 DApp** for NexusWealth Investment Solutions, deployed at `app.nwis.io`. It provides the token purchase interface for the NWIS token presale.

**This is separate from the main marketing site at `nwis.io`.**

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server (port 3001)
npm run dev

# Open http://localhost:3001
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📦 What's Included

### Core Features
- ✅ Token purchase interface
- ✅ Wallet connection (MetaMask, WalletConnect, etc.)
- ✅ Multi-currency support (ETH, USDT, USDC)
- ✅ Real-time price updates
- ✅ Transaction tracking
- ✅ Mobile responsive design

### Tech Stack
- **Framework:** Next.js 15
- **Blockchain:** wagmi + viem
- **Wallet:** ConnectKit
- **UI:** Radix UI + Tailwind CSS
- **Language:** TypeScript

---

## 🌐 Deployment

### Local Docker Build

```bash
# Build Docker image
docker build -t nexuswealth-dapp .

# Run container
docker run -p 3000:3000 nexuswealth-dapp
```

### Multi-Region Deploy to Google Cloud Run

```bash
# Deploy to US, Europe, and Asia
./deploy-to-gcp.sh
```

This will deploy to:
- 🇺🇸 us-central1 (Iowa, USA)
- 🇪🇺 europe-west1 (Belgium, Europe)
- 🇸🇬 asia-southeast1 (Singapore, Asia)

---

## 📁 Project Structure

```
dapp/
├── app/
│   ├── api/
│   │   ├── eth-price/       # ETH price API
│   │   └── token-sale/      # Token sale data API
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main token purchase page
│   └── globals.css          # Global styles
├── components/
│   ├── token-purchase/      # Token purchase components
│   ├── UI/                  # UI components
│   ├── wallet-provider.tsx  # Wallet connection provider
│   └── token-purchase-new.tsx
├── hooks/
│   ├── use-contract-data.ts
│   ├── use-eth-price.ts
│   ├── use-token-approval.ts
│   └── ...
├── lib/
│   ├── wagmi.ts             # Wagmi configuration
│   ├── constants.ts         # Contract addresses, etc.
│   └── ...
├── sections/
│   ├── navbar.tsx
│   └── countdown-timer.tsx
├── public/
│   └── images/
├── Dockerfile
├── deploy-to-gcp.sh
└── package.json
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Public variables (exposed to browser)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=0xYourPresaleAddress
NEXT_PUBLIC_CHAIN_ID=1
```

### Contract Configuration

Update `lib/constants.ts` with your contract addresses.

---

## 🌍 Multi-Region Setup

This dapp is configured for multi-region deployment:

### Current Setup
- **Service Name:** `nexuswealth-dapp-v2`
- **Regions:** us-central1, europe-west1, asia-southeast1
- **Memory:** 2GB per instance
- **CPU:** 2 vCPU per instance

### DNS Setup

After deployment, set up Cloud Load Balancer:
1. Create Network Endpoint Groups (NEGs)
2. Create Backend Service
3. Create URL Map
4. Create SSL Certificate for `app.nwis.io`
5. Create Global Forwarding Rule

See `../MULTI_REGION_DEPLOYMENT_GUIDE.md` for complete instructions.

---

## 🔗 Links to Main Site

Marketing pages redirect to main site:
- `/about/*` → `https://nwis.io/about/*`
- `/tokenomics` → `https://nwis.io/tokenomics`
- `/institutions` → `https://nwis.io/institutions`
- `/careers` → `https://nwis.io/careers`
- `/contact` → `https://nwis.io/contact`

---

## 🧪 Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test wallet connection
# Test token purchase flow
# Test different currencies
```

### Production Testing

After deployment:
```bash
# Test each region
curl -I https://nexuswealth-dapp-v2-xxx-uc.a.run.app  # US
curl -I https://nexuswealth-dapp-v2-xxx-ew.a.run.app  # EU
curl -I https://nexuswealth-dapp-v2-xxx-as.a.run.app  # Asia
```

---

## 📊 Monitoring

### View Logs

```bash
# All regions
gcloud logging read "resource.labels.service_name=nexuswealth-dapp-v2" --limit 50

# Specific region
gcloud logging read "resource.labels.service_name=nexuswealth-dapp-v2 AND resource.labels.location=us-central1" --limit 20
```

### Check Service Status

```bash
gcloud run services list --platform managed --format="table(REGION,SERVICE,URL)"
```

---

## 🆚 Difference from Main Site

| Feature | Main Site (nwis.io) | DApp (app.nwis.io) |
|---------|---------------------|---------------------|
| **Purpose** | Marketing & Information | Token Purchase |
| **Content** | About, Tokenomics, etc. | Token Sale Interface |
| **Web3** | No wallet needed | Requires wallet connection |
| **Deployment** | Separate service | Separate service |
| **URL** | https://nwis.io | https://app.nwis.io |

---

## 🔒 Security

- ✅ All transactions signed by user wallet
- ✅ No private keys stored
- ✅ HTTPS only
- ✅ Secure RPC endpoints
- ✅ Contract verified on Etherscan

---

## 💡 Common Issues

### Wallet Not Connecting
- Check if MetaMask is installed
- Try refreshing the page
- Check if on correct network

### Transaction Failing
- Check gas fees
- Check token approval
- Verify sufficient balance

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📚 Documentation

- **Main Migration Guide:** `../SUBDOMAIN_MIGRATION_GUIDE.md`
- **Multi-Region Setup:** `../MULTI_REGION_DEPLOYMENT_GUIDE.md`
- **Hybrid Deployment:** `../HYBRID_DEPLOYMENT_GUIDE.md`

---

## 🚀 Status

- ✅ **Ready for deployment**
- ✅ **Multi-region configured**
- ✅ **Separate from main site**
- ✅ **Production-ready**

---

## 📞 Support

For issues or questions:
1. Check the documentation in parent directory
2. Review deployment logs
3. Test on testnet first

---

*Last updated: October 11, 2025*
*Version: 2.0*

