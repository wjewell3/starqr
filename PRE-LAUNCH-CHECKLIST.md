# StarQR Loyalty - Pre-Launch Checklist

Use this checklist before deploying to production.

## Database Setup
- [ ] Supabase production project created
- [ ] All SQL migrations run successfully
- [ ] All tables visible in Table Editor
- [ ] RLS policies enabled on all tables
- [ ] Service role key secured (not in Git)
- [ ] Test merchant account created
- [ ] Database indexes verified with `\di` in SQL editor

## Stripe Configuration
- [ ] Stripe account fully verified
- [ ] Product created: "StarQR Loyalty - Monthly"
- [ ] Price set to $9.00/month recurring
- [ ] Price ID copied to environment variables
- [ ] Live API keys obtained (not test keys)
- [ ] Webhook endpoint configured
- [ ] Webhook signing secret saved
- [ ] Test subscription flow completed in test mode
- [ ] Customer portal settings configured

## Environment Variables
- [ ] All variables in .env.example have values
- [ ] NEXT_PUBLIC_SUPABASE_URL is production URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is production key
- [ ] SUPABASE_SERVICE_ROLE_KEY is production service role
- [ ] STRIPE_SECRET_KEY is live key (sk_live_...)
- [ ] STRIPE_PUBLISHABLE_KEY is live key (pk_live_...)
- [ ] STRIPE_WEBHOOK_SECRET matches production webhook
- [ ] NEXT_PUBLIC_STRIPE_PRICE_ID is correct price ID
- [ ] NEXT_PUBLIC_APP_URL is production domain
- [ ] NEXT_PUBLIC_CUSTOMER_URL is production domain
- [ ] No test/development keys in production

## Code Quality
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes with no errors
- [ ] TypeScript compilation successful
- [ ] No console.error or console.log in production code
- [ ] All TODO comments addressed or documented
- [ ] Error boundaries implemented
- [ ] Loading states added to all forms

## Security
- [ ] Service role key only used server-side
- [ ] No API keys in client-side code
- [ ] RLS policies tested with different users
- [ ] Phone number hashing working correctly
- [ ] Stripe webhook signature verification enabled
- [ ] CORS configured correctly (if needed)
- [ ] Rate limiting on check-in endpoint (24hr built-in)
- [ ] SQL injection prevention (using parameterized queries)

## Testing
- [ ] Customer check-in flow works end-to-end
- [ ] Duplicate check-in prevention working
- [ ] 10th stamp triggers reward correctly
- [ ] Free tier limit enforced at 25 customers
- [ ] Paid upgrade flow completes successfully
- [ ] Subscription webhook updates database
- [ ] Canceled subscription downgrades correctly
- [ ] Dashboard loads without errors
- [ ] QR code generates properly
- [ ] Mobile responsive on all pages
- [ ] Tested on iOS Safari
- [ ] Tested on Android Chrome

## Performance
- [ ] Images optimized (if any)
- [ ] Fonts loading efficiently
- [ ] Lighthouse score > 90 for performance
- [ ] Time to First Byte (TTFB) < 600ms
- [ ] Check-in API responds in < 1 second
- [ ] Database queries optimized
- [ ] Indexes on frequently queried fields

## Deployment (Vercel)
- [ ] GitHub repository created and pushed
- [ ] Vercel project connected to GitHub
- [ ] Environment variables added to Vercel
- [ ] Production build successful
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] DNS configured correctly
- [ ] Redirects set up (www to non-www or vice versa)

## Monitoring & Analytics
- [ ] Vercel Analytics enabled
- [ ] Supabase logging enabled
- [ ] Stripe webhook delivery monitoring set up
- [ ] Error tracking configured (optional: Sentry)
- [ ] Uptime monitoring (optional: UptimeRobot)

## Content & Legal
- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] Cookie consent (if in EU/California)
- [ ] Business contact information added
- [ ] Support email configured
- [ ] Social media links (if applicable)

## Post-Launch
- [ ] Test production check-in flow with real phone
- [ ] Verify Stripe webhook triggering in production
- [ ] Monitor Vercel function logs for errors
- [ ] Check Supabase database logs
- [ ] Set up alerts for webhook failures
- [ ] Document any production-specific quirks
- [ ] Share test QR code with team for validation

## Marketing Assets
- [ ] QR code template designed
- [ ] Printable sticker template created
- [ ] Example marketing materials for merchants
- [ ] Screenshot for website/social media
- [ ] Product demo video (optional)

## Customer Onboarding
- [ ] Signup flow tested
- [ ] Welcome email configured (if using Resend)
- [ ] Onboarding wizard works
- [ ] QR code download working
- [ ] First merchant can create account
- [ ] Email verification working (if enabled)

## Backup & Recovery
- [ ] Database backup strategy documented
- [ ] Supabase Point-in-Time Recovery (PITR) enabled
- [ ] Environment variables backed up securely
- [ ] Recovery procedures documented
- [ ] Disaster recovery plan created

## Compliance (if applicable)
- [ ] GDPR compliance (EU customers)
- [ ] CCPA compliance (California customers)
- [ ] Data retention policy defined
- [ ] Right to deletion implemented
- [ ] Data export functionality (for users)

## Support & Documentation
- [ ] README.md up to date
- [ ] SETUP.md complete and tested
- [ ] API documentation complete
- [ ] Support email set up
- [ ] FAQ page created
- [ ] Knowledge base started

## Go-Live Criteria
All items above must be checked before going live. Minimum requirements:

**Critical (Must Have):**
- ✅ Database setup complete with RLS
- ✅ All environment variables configured
- ✅ Stripe integration working
- ✅ Customer check-in flow tested
- ✅ Deployment successful
- ✅ Production domain working

**Important (Should Have):**
- ✅ Security tested
- ✅ Performance optimized
- ✅ Monitoring enabled
- ✅ Privacy policy published

**Nice to Have:**
- Analytics configured
- Marketing assets ready
- Support documentation complete

## Emergency Contacts

**Vercel Support:** https://vercel.com/support
**Supabase Support:** https://supabase.com/support  
**Stripe Support:** https://support.stripe.com

## Rollback Plan

If production deployment fails:

1. Check Vercel deployment logs
2. Revert to previous deployment in Vercel dashboard
3. Check environment variables match requirements
4. Review Supabase logs for database errors
5. Verify Stripe webhook endpoint is accessible
6. Test locally with production environment variables (careful!)

## Post-Launch Monitoring (First 24 Hours)

- [ ] Check Vercel logs every 4 hours
- [ ] Monitor Stripe webhooks dashboard
- [ ] Review Supabase logs for errors
- [ ] Test customer check-in from mobile device
- [ ] Verify email notifications working (if enabled)
- [ ] Check for any user-reported issues

## Success Metrics

Track these KPIs post-launch:
- Total merchants signed up
- Total customers created
- Check-ins per day
- Rewards redeemed per day
- Conversion rate (free → paid)
- Average stamps per customer
- Checkout abandonment rate

---

**Ready to launch? Double-check everything, take a deep breath, and ship it! 🚀**
