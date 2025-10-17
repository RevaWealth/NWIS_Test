# 🚀 Migration to app.nwis.io - Documentation Index

## 📚 Overview

This folder contains complete documentation for migrating your Web3 dapp from `nwis.io/token-purchase` to the industry-standard `app.nwis.io` subdomain pattern.

## 📖 Documentation Files

### 1. **MIGRATION_QUICK_START.md** ⚡
**Start here!** Quick overview with visual diagrams and TL;DR summary.
- Time estimate
- High-level architecture diagrams
- Quick comparison table
- Cost analysis
- 4-hour timeline

**Best for:** Getting a quick understanding of what's involved

---

### 2. **HYBRID_DEPLOYMENT_GUIDE.md** 🔄 ⭐ NEW!
**Run both simultaneously!** Guide for keeping both old and new versions running.
- Dual deployment strategy (zero downtime)
- Shared backend approach
- Progressive migration timeline
- Cost comparison
- A/B testing capability
- **Recommended for risk-free migration!**

**Best for:** Those who want to keep `nwis.io/token-purchase` AND `app.nwis.io` running together

---

### 3. **SUBDOMAIN_MIGRATION_GUIDE.md** 📘
**Complete technical guide.** Detailed step-by-step instructions with code examples.
- 10 comprehensive phases
- 600+ lines of detailed instructions
- Code samples for every file
- Deployment scripts
- Troubleshooting section
- Security best practices

**Best for:** Following along during actual migration

---

### 4. **MIGRATION_CHECKLIST.md** ✅
**Practical checklist.** Print this and check off items as you go.
- Pre-migration setup
- 8 migration phases with checkboxes
- Testing checklist
- Post-migration tasks
- Rollback plan
- Sign-off section

**Best for:** Tracking progress during migration

---

### 5. **MULTI_REGION_DEPLOYMENT_GUIDE.md** 🌍 ⭐ NEW!
**Deploy globally!** Complete guide for multi-region setup across US, Europe, and Asia.
- Deploy to 3 regions simultaneously
- Set up Cloud Load Balancer
- Configure global SSL and routing
- Enable Cloud CDN
- Monitoring and health checks
- **Sub-100ms latency worldwide!**

**Best for:** Those who want global low-latency access for international users

---

## 🎯 How to Use These Documents

### Before You Start
1. **Read:** `MIGRATION_QUICK_START.md` (15 minutes)
2. **Understand:** Architecture changes and benefits
3. **Plan:** Schedule 4-hour window for migration
4. **Print:** `MIGRATION_CHECKLIST.md` for tracking

### During Migration
1. **Follow:** `SUBDOMAIN_MIGRATION_GUIDE.md` step-by-step
2. **Check off:** Items in `MIGRATION_CHECKLIST.md`
3. **Reference:** Quick Start for reminders

### After Migration
1. **Verify:** Complete all checklist items
2. **Monitor:** Site performance and uptime
3. **Document:** Any issues in checklist notes section

---

## 🗂️ Quick Reference

### Current Architecture
```
nwis.io/
├── / (homepage)
├── /about/story
├── /tokenomics
├── /token-purchase ← Dapp is here
└── ... (other marketing pages)
```

### Target Architecture
```
nwis.io/ (Marketing Only)
├── / (homepage)
├── /about/story
├── /tokenomics
└── ... (other marketing pages)

app.nwis.io/ (Dapp Only)
└── / ← Token purchase dapp
```

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Reading documentation | 30 min |
| Setup new project | 30 min |
| Moving code | 2 hours |
| DNS configuration | 5 min + 30-60 min wait |
| Deployment | 20 min |
| Testing | 30 min |
| **Total Active Work** | **~4 hours** |
| **Total with DNS wait** | **~5 hours** |

---

## 💰 Cost Impact

### Single Region Deployment
| Item | Current | After |
|------|---------|-------|
| Cloud Run (Marketing) | Included | ~$20-40/month |
| Cloud Run (Dapp) | Included | ~$20-40/month |
| **Total** | **~$30-50/month** | **~$40-80/month** |
| **Increase** | - | **+$10-30/month** |

### Multi-Region Deployment (Recommended)
| Item | Current | After |
|------|---------|-------|
| Cloud Run (Marketing - Single Region) | Included | ~$20-40/month |
| Cloud Run (Dapp - 3 Regions) | Included | ~$60-120/month |
| Load Balancer (Global) | - | ~$25-40/month |
| **Total** | **~$30-50/month** | **~$105-200/month** |
| **Increase** | - | **+$75-150/month** |

**Multi-Region Benefits:**
- 🌍 <100ms latency worldwide
- 🔄 Automatic failover
- 📈 99.95% uptime SLA
- ⚡ Better user experience globally

---

## 🎯 Success Criteria

Migration is successful when:
- ✅ `https://nwis.io` loads (marketing site)
- ✅ `https://app.nwis.io` loads (dapp)
- ✅ SSL certificates valid on both
- ✅ Wallet connection works
- ✅ Token purchase flow works
- ✅ All links work correctly
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Performance acceptable

---

## 🚨 Emergency Contacts

### Rollback
If migration fails, see:
- `SUBDOMAIN_MIGRATION_GUIDE.md` → "Rollback Plan" section
- `MIGRATION_CHECKLIST.md` → "Rollback Plan" section

Quick rollback:
```bash
# Revert DNS
# Deploy previous version
git checkout <previous-commit>
./deploy-to-gcp.sh
```

### Support Resources
- **Google Cloud Run:** https://cloud.google.com/run/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **WagMi Docs:** https://wagmi.sh
- **ConnectKit Docs:** https://docs.family.co/connectkit

---

## 📊 Migration Phases Summary

| Phase | Description | Time | Difficulty |
|-------|-------------|------|-----------|
| 1. Project Setup | Create new dapp directory | 30 min | Easy |
| 2. Code Migration | Move files and update imports | 2 hours | Medium |
| 3. DNS Config | Add CNAME record | 5 min | Easy |
| 4. Docker & Deploy | Build and deploy to Cloud Run | 20 min | Medium |
| 5. Env Vars | Configure environment | 10 min | Easy |
| 6. Update Marketing | Change links and redirects | 15 min | Easy |
| 7. Testing | Full functional testing | 30 min | Medium |
| 8. Post-Migration | SEO, monitoring, docs | 30 min | Easy |

---

## 🎓 Why This Pattern?

### Industry Examples
All major Web3 projects use this pattern:
- `app.uniswap.org` - Uniswap DEX
- `app.aave.com` - Aave lending
- `app.opensea.io` - OpenSea NFT
- `app.ens.domains` - ENS domains
- `app.compound.finance` - Compound
- `app.sushi.com` - SushiSwap

### Benefits
1. **Professional:** Industry-standard URL structure
2. **Performance:** Marketing site is faster (no Web3 overhead)
3. **Scalability:** Dapp scales independently
4. **Maintenance:** Clean code separation
5. **Security:** Isolated concerns
6. **SEO:** Better optimization per site

---

## 📝 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| Quick Start | 1.0 | Oct 11, 2025 |
| Hybrid Deployment | 1.1 | Oct 11, 2025 |
| Migration Guide | 1.1 | Oct 11, 2025 |
| Multi-Region Guide | 1.0 | Oct 11, 2025 |
| Checklist | 1.0 | Oct 11, 2025 |
| This Index | 1.1 | Oct 11, 2025 |

---

## ✅ Pre-Flight Checklist

Before starting migration, verify:
- [ ] Read all documentation
- [ ] Understand architecture changes
- [ ] Have DNS provider access
- [ ] Have Google Cloud access
- [ ] Have backup of current code
- [ ] Scheduled maintenance window
- [ ] Team is informed
- [ ] Printed checklist

---

## 🚀 Ready to Start?

1. **Read:** `MIGRATION_QUICK_START.md` (15 min)
2. **Print:** `MIGRATION_CHECKLIST.md`
3. **Follow:** `SUBDOMAIN_MIGRATION_GUIDE.md`
4. **Deploy:** Execute migration steps
5. **Verify:** Complete all tests
6. **Celebrate:** You're now following industry best practices! 🎉

---

## 📞 Questions?

If you encounter issues:
1. Check "Troubleshooting" section in Migration Guide
2. Review checklist for missed steps
3. Check Cloud Run logs
4. Verify DNS configuration
5. Test with different browsers/wallets

---

## 🎯 Next Steps

1. Open `MIGRATION_QUICK_START.md`
2. Review the architecture diagrams
3. Understand the time commitment
4. Plan your migration window
5. Begin when ready!

---

**Good luck with your migration!** 🚀

*This migration will bring your dapp in line with industry standards and provide a better experience for your users.*

---

*Last updated: October 11, 2025*

