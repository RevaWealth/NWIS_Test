# ✅ Migration Checklist: nwis.io → app.nwis.io

**Date Started:** _______________
**Target Completion:** _______________
**Completed:** _______________

---

## 🔧 Pre-Migration Setup

### Prerequisites
- [ ] Read `SUBDOMAIN_MIGRATION_GUIDE.md`
- [ ] Read `MIGRATION_QUICK_START.md`
- [ ] Backup current codebase (`git commit` + `git push`)
- [ ] Note current Cloud Run service URL
- [ ] Verify DNS provider access (Cloudflare/GoDaddy/etc.)
- [ ] Verify gcloud CLI installed: `gcloud --version`
- [ ] Verify Docker installed: `docker --version`
- [ ] Verify authenticated: `gcloud auth list`
- [ ] Plan maintenance window (low traffic time)
- [ ] Notify team about migration

**Backup Created:** `git rev-parse HEAD` → _______________

---

## 📁 Phase 1: Project Setup

### Create Dapp Directory
- [ ] Create `dapp/` directory
- [ ] Initialize new Next.js project in `dapp/`
- [ ] Install Web3 dependencies (wagmi, viem, connectkit, ethers)
- [ ] Install UI dependencies (Radix UI, Tailwind, etc.)
- [ ] Verify `dapp/package.json` has correct dependencies
- [ ] Run `npm install` successfully
- [ ] Test dev server: `npm run dev` (should run on port 3001)

**Notes:**
```
Dapp directory created: [ YES / NO ]
Dependencies installed: [ YES / NO ]
Dev server works: [ YES / NO ]
```

---

## 📦 Phase 2: Code Migration

### Move Core Components
- [ ] Move `token-purchase-new.tsx` → `dapp/components/`
- [ ] Move `token-purchase-new-backup.tsx` → `dapp/components/`
- [ ] Move `components/token-purchase/*` → `dapp/components/token-purchase/`
- [ ] Move `wallet-provider.tsx` → `dapp/components/`

### Move Hooks
- [ ] Move `hooks/use-contract-data.ts` → `dapp/hooks/`
- [ ] Move `hooks/use-eth-price.ts` → `dapp/hooks/`
- [ ] Move `hooks/use-token-approval.ts` → `dapp/hooks/`
- [ ] Move `hooks/use-token-calculation.ts` → `dapp/hooks/`
- [ ] Move `hooks/use-transaction-confirmation.ts` → `dapp/hooks/`
- [ ] Move `hooks/use-tracking.ts` → `dapp/hooks/`

### Move Libraries
- [ ] Move `lib/wagmi.ts` → `dapp/lib/`
- [ ] Move `lib/constants.ts` → `dapp/lib/`
- [ ] Move `lib/currency-config.tsx` → `dapp/lib/`
- [ ] Move `lib/token-purchase-utils.ts` → `dapp/lib/`
- [ ] Move `lib/types.ts` → `dapp/lib/`
- [ ] Move `lib/wallet-browser-utils.ts` → `dapp/lib/`

### Move API Routes
- [ ] Move `app/api/token-sale/` → `dapp/app/api/token-sale/`
- [ ] Move `app/api/eth-price/` → `dapp/app/api/eth-price/`

### Move Contracts & Config
- [ ] Move `contract-config.js` → `dapp/lib/`
- [ ] Move or reference `contracts/` (or keep in root for Truffle)

### Move Assets
- [ ] Copy relevant images from `public/images/` → `dapp/public/images/`
- [ ] Copy relevant fonts/icons if needed
- [ ] Copy favicon files → `dapp/public/`

### Create New Files
- [ ] Create `dapp/app/layout.tsx` (with WalletProvider)
- [ ] Create `dapp/app/page.tsx` (main dapp page)
- [ ] Create `dapp/app/globals.css`
- [ ] Create `dapp/next.config.js`
- [ ] Create `dapp/tailwind.config.js`
- [ ] Create `dapp/tsconfig.json`
- [ ] Create `dapp/Dockerfile`
- [ ] Create `dapp/deploy-to-gcp.sh`
- [ ] Create `dapp/.env.local` (don't commit!)
- [ ] Create `dapp/.env.template`

### Fix Import Paths
- [ ] Update all imports to use `@/` alias
- [ ] Test compilation: `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Fix any linting errors

**Notes:**
```
Files moved: [ ALL / SOME / NONE ]
New files created: [ YES / NO ]
Build succeeds: [ YES / NO ]
Errors to fix: _______________
```

---

## 🌐 Phase 3: DNS Configuration

### Access DNS Provider
- [ ] Log into DNS provider (Cloudflare/GoDaddy/etc.)
- [ ] Navigate to domain: `nwis.io`
- [ ] Navigate to DNS settings

### Add DNS Record
- [ ] Add CNAME record:
  - Type: `CNAME`
  - Name: `app`
  - Target: `ghs.googlehosted.com` or Cloud Run URL
  - TTL: `3600` or `Auto`
  - Proxy: `Enabled` (if Cloudflare)
- [ ] Save DNS changes
- [ ] Note time of DNS change: _______________

### Verify DNS (wait 15-60 minutes)
- [ ] Test DNS: `dig app.nwis.io`
- [ ] Test DNS: `nslookup app.nwis.io`
- [ ] Verify it points to correct target
- [ ] Wait for propagation if needed

**Notes:**
```
DNS record added: [ YES / NO ]
Time added: _______________
DNS resolves: [ YES / NO ]
Propagation complete: [ YES / NO ]
```

---

## 🐳 Phase 4: Docker & Deployment

### Prepare Deployment
- [ ] Review `dapp/Dockerfile`
- [ ] Review `dapp/deploy-to-gcp.sh`
- [ ] Make script executable: `chmod +x dapp/deploy-to-gcp.sh`
- [ ] Set correct PROJECT_ID in script
- [ ] Set correct SERVICE_NAME in script
- [ ] Set correct REGION in script

### Test Local Build
- [ ] Build Docker image locally: `docker build -t test-build .`
- [ ] Run container locally: `docker run -p 3000:3000 test-build`
- [ ] Test in browser: `http://localhost:3000`
- [ ] Verify app loads
- [ ] Verify wallet connects
- [ ] Stop container

### Deploy to Cloud Run
- [ ] Authenticate with gcloud: `gcloud auth login`
- [ ] Set project: `gcloud config set project nexuswealthtest`
- [ ] Navigate to dapp directory: `cd dapp`
- [ ] Run deployment script: `./deploy-to-gcp.sh`
- [ ] Wait for deployment to complete
- [ ] Note the Cloud Run URL: _______________

### Map Custom Domain
- [ ] Create domain mapping: 
  ```bash
  gcloud run domain-mappings create \
    --service nexuswealth-dapp \
    --domain app.nwis.io \
    --region us-central1
  ```
- [ ] Wait for SSL certificate (15-60 minutes)
- [ ] Check certificate status:
  ```bash
  gcloud run domain-mappings describe app.nwis.io \
    --region us-central1
  ```

### Verify Deployment
- [ ] Test Cloud Run URL (direct)
- [ ] Test `https://app.nwis.io` (after DNS propagation)
- [ ] Verify SSL certificate (green padlock)
- [ ] Check for mixed content warnings
- [ ] Verify no console errors

**Notes:**
```
Docker build: [ SUCCESS / FAILED ]
Deployment status: [ SUCCESS / FAILED ]
Cloud Run URL: _______________
SSL status: [ ACTIVE / PENDING / FAILED ]
app.nwis.io loads: [ YES / NO ]
```

---

## 🔧 Phase 5: Environment Variables

### Set Environment Variables
- [ ] Create list of required env vars
- [ ] Set `NEXT_PUBLIC_CONTRACT_ADDRESS`
- [ ] Set `NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS`
- [ ] Set `NEXT_PUBLIC_CHAIN_ID`
- [ ] Set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- [ ] Set `NEXT_PUBLIC_GA_ID` (if using analytics)
- [ ] Set any API keys (server-side only)

### Update Cloud Run Service
```bash
gcloud run services update nexuswealth-dapp \
  --region us-central1 \
  --update-env-vars KEY1=VALUE1,KEY2=VALUE2
```

- [ ] Update env vars in Cloud Run
- [ ] Redeploy if necessary
- [ ] Verify env vars are set:
  ```bash
  gcloud run services describe nexuswealth-dapp \
    --region us-central1 \
    --format="yaml(spec.template.spec.containers[0].env)"
  ```

**Notes:**
```
Env vars set: [ ALL / SOME / NONE ]
Verification passed: [ YES / NO ]
```

---

## 🔗 Phase 6: Update Marketing Site

### Update Links
- [ ] Update `app/page.tsx` - change CTA buttons
- [ ] Update `sections/navbar.tsx` - change navigation links
- [ ] Update `sections/footer.tsx` - change footer links
- [ ] Search for all `/token-purchase` references
- [ ] Replace with `https://app.nwis.io`
- [ ] Test all links manually

### Add Redirects
- [ ] Add redirects in `next.config.js`:
  ```javascript
  async redirects() {
    return [
      {
        source: '/token-purchase',
        destination: 'https://app.nwis.io',
        permanent: true,
      },
    ]
  }
  ```
- [ ] Test redirect: `curl -I https://nwis.io/token-purchase`

### Clean Up Old Code
- [ ] Remove `app/token-purchase/` directory
- [ ] Remove `app/api/token-sale/` directory
- [ ] Remove `app/api/eth-price/` directory
- [ ] Remove Web3 dependencies from root `package.json`:
  - Remove `@wagmi/core`
  - Remove `connectkit`
  - Remove `ethers`
  - Remove `viem`
  - Remove `wagmi`
  - Remove `web3`
- [ ] Run `npm install` to clean up
- [ ] Test marketing site build: `npm run build`

### Deploy Updated Marketing Site
- [ ] Commit changes: `git add . && git commit -m "Migration to app.nwis.io"`
- [ ] Deploy to production (your current deployment method)
- [ ] Verify marketing site still works
- [ ] Verify redirects work

**Notes:**
```
Links updated: [ ALL / SOME / NONE ]
Redirects work: [ YES / NO ]
Old code removed: [ YES / NO ]
Marketing site deployed: [ YES / NO ]
```

---

## 🧪 Phase 7: Testing

### Functional Testing
- [ ] Visit `https://nwis.io` - homepage loads
- [ ] Visit `https://app.nwis.io` - dapp loads
- [ ] Click "Launch App" from marketing site
- [ ] Verify lands on `app.nwis.io`
- [ ] Test old URL: `nwis.io/token-purchase` redirects
- [ ] Connect wallet (MetaMask)
- [ ] Connect wallet (WalletConnect)
- [ ] Switch networks
- [ ] Check wallet balance displays
- [ ] Select token amount
- [ ] Check USD calculation
- [ ] Approve token (if using USDT/USDC)
- [ ] Execute purchase transaction
- [ ] Verify transaction confirmation
- [ ] Check transaction on Etherscan

### Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Brave
- [ ] Test on mobile Chrome
- [ ] Test on mobile Safari
- [ ] Test in MetaMask browser
- [ ] Test in Trust Wallet browser

### Performance Testing
- [ ] Run Lighthouse on `nwis.io`
  - Performance: _____ / 100
  - Accessibility: _____ / 100
  - SEO: _____ / 100
- [ ] Run Lighthouse on `app.nwis.io`
  - Performance: _____ / 100
  - Accessibility: _____ / 100
  - SEO: _____ / 100

### Security Testing
- [ ] Verify HTTPS on both sites
- [ ] Check SSL certificate validity
- [ ] Verify no mixed content warnings
- [ ] Test CORS (if applicable)
- [ ] Verify wallet signature works
- [ ] Test with different wallet amounts
- [ ] Test edge cases (0 balance, max amount, etc.)

### Monitoring
- [ ] Check Cloud Run logs (no errors)
- [ ] Check browser console (no errors)
- [ ] Verify analytics tracking works
- [ ] Set up uptime monitoring

**Notes:**
```
All tests passed: [ YES / NO ]
Issues found: _______________
Issues fixed: _______________
```

---

## 📊 Phase 8: Post-Migration

### SEO & Announcements
- [ ] Update sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Update social media links (Twitter, Discord, etc.)
- [ ] Update whitepaper links
- [ ] Update documentation
- [ ] Send email to users about new URL
- [ ] Post announcement on social media
- [ ] Update email signatures

### Documentation
- [ ] Update README.md with new URLs
- [ ] Update deployment docs
- [ ] Document rollback procedure
- [ ] Create troubleshooting guide
- [ ] Update team knowledge base

### Monitoring Setup
- [ ] Enable Cloud Monitoring
- [ ] Set up uptime checks
- [ ] Set up alerting (if service goes down)
- [ ] Set up error tracking (Sentry/etc.)
- [ ] Monitor user feedback

### Cost Monitoring
- [ ] Check Cloud Run costs before migration: $_____
- [ ] Monitor costs after migration
- [ ] Optimize if needed (min instances, etc.)

**Notes:**
```
Announcements sent: [ YES / NO ]
Documentation updated: [ YES / NO ]
Monitoring active: [ YES / NO ]
```

---

## 🚨 Rollback Plan (If Needed)

### If Something Goes Wrong
- [ ] Note what went wrong: _______________
- [ ] Revert DNS changes
- [ ] Deploy previous version:
  ```bash
  git checkout <backup-commit-hash>
  ./deploy-to-gcp.sh
  ```
- [ ] Or rollback Cloud Run revision:
  ```bash
  gcloud run services update-traffic nexuswealth-dapp \
    --to-revisions <previous-revision>=100
  ```
- [ ] Notify users of issue
- [ ] Document what went wrong
- [ ] Plan next attempt

**Rollback executed:** [ YES / NO ]
**Reason:** _______________
**Time:** _______________

---

## ✅ Final Verification

### Sign-Off Checklist
- [ ] Both sites (`nwis.io` and `app.nwis.io`) are live
- [ ] SSL certificates are valid
- [ ] DNS resolves correctly
- [ ] Wallet connection works
- [ ] Token purchase works end-to-end
- [ ] All links work correctly
- [ ] Redirects work correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Analytics tracking works
- [ ] Performance acceptable
- [ ] Team notified
- [ ] Users notified
- [ ] Documentation updated
- [ ] Monitoring active

### Success Metrics (Check after 24 hours)
- [ ] Site uptime: _____ %
- [ ] Average load time: _____ seconds
- [ ] Transaction success rate: _____ %
- [ ] User complaints: _____ (target: 0)
- [ ] Wallet connection rate: _____ %

---

## 📝 Notes & Issues

### Issues Encountered
1. _______________
2. _______________
3. _______________

### Solutions Applied
1. _______________
2. _______________
3. _______________

### Lessons Learned
1. _______________
2. _______________
3. _______________

### Future Improvements
1. _______________
2. _______________
3. _______________

---

## 🎉 Migration Complete!

**Completed by:** _______________
**Date:** _______________
**Total time:** _____ hours
**Status:** [ SUCCESS / PARTIAL / FAILED ]

**Sign-off:**
- Technical Lead: _______________
- Product Owner: _______________
- QA: _______________

---

*Use this checklist to track your migration progress. Check off items as you complete them.*
*For detailed instructions on each step, refer to `SUBDOMAIN_MIGRATION_GUIDE.md`*

