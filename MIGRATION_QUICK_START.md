# 🚀 Quick Start: app.nwis.io Migration

## TL;DR - What You Need to Do

```
Current:  nwis.io/token-purchase → One app, everything together
Target:   app.nwis.io → Separate dapp subdomain (industry standard)
```

## 📊 Visual Architecture

### BEFORE (Current)
```
┌─────────────────────────────────────────┐
│         nwis.io (Single App)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Marketing Pages                │   │
│  │  - Homepage                     │   │
│  │  - About                        │   │
│  │  - Tokenomics                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Dapp (with Web3)               │   │
│  │  - /token-purchase              │   │
│  │  - Wallet connection            │   │
│  │  - Smart contracts              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  All in one deployment                  │
└─────────────────────────────────────────┘
```

### AFTER (Target)
```
┌──────────────────────────────┐       ┌──────────────────────────────┐
│     nwis.io                  │       │     app.nwis.io              │
│  (Marketing Site)            │       │  (Dapp Only)                 │
│                              │       │                              │
│  ┌────────────────────────┐ │       │  ┌────────────────────────┐ │
│  │ Marketing Pages        │ │       │  │ Token Purchase         │ │
│  │ - Homepage             │ │       │  │ - Wallet connection    │ │
│  │ - About                │ │       │  │ - Smart contracts      │ │
│  │ - Tokenomics           │ │       │  │ - Transaction flow     │ │
│  │ - Institutions         │ │       │  └────────────────────────┘ │
│  │ - Careers              │ │       │                              │
│  │                        │ │       │  Independent deployment      │
│  │ [Launch App] ─────────┼─┼───────>  Scales independently       │
│  └────────────────────────┘ │       │                              │
│                              │       │                              │
│  Lightweight, no Web3        │       │  Web3 focused               │
└──────────────────────────────┘       └──────────────────────────────┘
```

## ⚡ Migration Steps (High Level)

### Step 1: Create New Dapp Project (30 minutes)
```bash
mkdir dapp
cd dapp
npx create-next-app@latest . --typescript --tailwind --app
npm install wagmi viem @tanstack/react-query connectkit ethers@5.7.2
```

### Step 2: Move Code (1-2 hours)
Move these from root to `dapp/`:
- ✅ `token-purchase-new.tsx` → `dapp/components/`
- ✅ `components/token-purchase/*` → `dapp/components/token-purchase/`
- ✅ `hooks/*` → `dapp/hooks/`
- ✅ `lib/wagmi.ts` → `dapp/lib/`
- ✅ `wallet-provider.tsx` → `dapp/components/`
- ✅ `app/api/token-sale/` → `dapp/app/api/token-sale/`
- ✅ `app/api/eth-price/` → `dapp/app/api/eth-price/`

### Step 3: Configure DNS (5 minutes setup, 30-60 minutes propagation)
**In your DNS provider (Cloudflare, GoDaddy, etc.):**
```
Type: CNAME
Name: app
Value: ghs.googlehosted.com (or your Cloud Run URL)
TTL: 3600
```

### Step 4: Deploy Dapp (20 minutes)
```bash
cd dapp
./deploy-to-gcp.sh

# Map domain
gcloud run domain-mappings create \
  --service nexuswealth-dapp \
  --domain app.nwis.io \
  --region us-central1
```

### Step 5: Update Marketing Site (15 minutes)
Update links in `nwis.io`:
```typescript
// Change this:
<Link href="/token-purchase">Buy Tokens</Link>

// To this:
<Link href="https://app.nwis.io">Launch App</Link>
```

## 🎯 Quick Wins

### Why This Is Better

| Aspect | Current | After Migration |
|--------|---------|----------------|
| **URL** | `nwis.io/token-purchase` | `app.nwis.io` |
| **Industry Standard** | ❌ Non-standard | ✅ Standard (like Uniswap, Aave) |
| **Code Separation** | ❌ Mixed concerns | ✅ Clean separation |
| **Performance** | ⚠️ Heavy Web3 on all pages | ✅ Web3 only where needed |
| **Scaling** | ⚠️ Everything scales together | ✅ Independent scaling |
| **Maintenance** | ⚠️ Changes affect everything | ✅ Isolated changes |
| **Bundle Size** | ⚠️ Large (300KB+) | ✅ Optimized per site |

## 📦 What Gets Separated

### Marketing Site (nwis.io)
- Homepage
- About pages
- Tokenomics
- Institutions
- Careers
- Contact
- Documents/PDFs
- Privacy/Terms
- **NO Web3 libraries** ✅

### Dapp (app.nwis.io)
- Token purchase interface
- Wallet connection
- Smart contract interactions
- Transaction management
- **ONLY Web3 functionality** ✅

## 💰 Costs

**Current:** ~$30-50/month (one Cloud Run service)
**After:** ~$40-80/month (two Cloud Run services)

**Extra cost:** $10-30/month
**Benefits:** Professional setup, better performance, industry standard

## ⏱️ Timeline

| Phase | Time | Status |
|-------|------|--------|
| 1. Create dapp project | 30 min | Pending |
| 2. Move code | 2 hours | Pending |
| 3. Configure DNS | 5 min + wait | Pending |
| 4. Deploy dapp | 20 min | Pending |
| 5. Update marketing site | 15 min | Pending |
| 6. Test & verify | 30 min | Pending |
| **Total Active Work** | **~4 hours** | |
| **Total with DNS wait** | **~5 hours** | |

## 🚨 Risk Mitigation

### Rollback Plan
If anything breaks:
```bash
# 1. Change DNS back
# 2. Or deploy old version
git checkout <previous-commit>
./deploy-to-gcp.sh
```

### Zero Downtime Strategy
1. Deploy new dapp to `app.nwis.io`
2. Test thoroughly
3. Update links gradually
4. Keep old `/token-purchase` working during transition
5. Remove old route after 1 week

## 🔍 Testing Checklist

Before going live:
- [ ] Dapp loads at app.nwis.io
- [ ] SSL certificate is valid (green padlock)
- [ ] Wallet connects successfully
- [ ] Can switch networks
- [ ] Token purchase flow works
- [ ] Transaction confirmations appear
- [ ] Links to marketing site work
- [ ] Mobile responsive
- [ ] No console errors

## 📞 Next Steps

1. **Read the full guide:** `SUBDOMAIN_MIGRATION_GUIDE.md`
2. **Plan a maintenance window:** Choose low-traffic time
3. **Backup current state:** `git commit -am "Pre-migration backup"`
4. **Start migration:** Follow guide step-by-step
5. **Test thoroughly:** Use checklist above
6. **Announce new URL:** Email users, update social media

## 🎓 Examples from Industry

Other projects using `app.` subdomain:
- `app.uniswap.org` - Uniswap DEX
- `app.aave.com` - Aave lending protocol
- `app.opensea.io` - OpenSea NFT marketplace
- `app.ens.domains` - ENS domains
- `app.compound.finance` - Compound Finance
- `app.sushi.com` - SushiSwap

**You'll be in good company!** 🎉

## 🔗 Resources

- **Full Migration Guide:** `SUBDOMAIN_MIGRATION_GUIDE.md` (detailed 600+ line guide)
- **Google Cloud Run Docs:** https://cloud.google.com/run/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **DNS Configuration:** Check your DNS provider's docs

---

**Ready to start? Open `SUBDOMAIN_MIGRATION_GUIDE.md` for the complete step-by-step guide!**

*Created: October 11, 2025*

