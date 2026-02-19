# Google Analytics Setup Guide

## ✅ Installation Complete

Google Analytics (GA4) has been successfully integrated into your StarQR application.

---

## What Was Done

### 1. **Updated Root Layout** (`app/layout.tsx`)
- Added Next.js `Script` component for optimal performance
- Imported the Google tag script
- Configured the GA initialization script
- Made it conditional: only loads if `NEXT_PUBLIC_GA_ID` is set

### 2. **Environment Variables** (`.env.local`)
- Added `NEXT_PUBLIC_GA_ID=G-PXN6ZRRKBD`
- Created `.env.example` for reference

### 3. **Script Configuration**
- Used `strategy="afterInteractive"` for best performance
- Scripts load after page interactive (doesn't block page render)
- Safely handles the GA data layer initialization

---

## How It Works

When your site loads:

1. The root layout reads `NEXT_PUBLIC_GA_ID` from environment
2. Google tag script loads asynchronously after page is interactive
3. GA initializes and starts tracking page views automatically
4. Custom events can be tracked via `gtag()` function

---

## Tracking Page Views (Automatic)

✅ **Page views are tracked automatically** for:
- Every route navigation (Next.js handles this)
- Initial page load
- Client-side route changes

No additional code needed for basic tracking.

---

## Tracking Custom Events

To track custom events in your components, add code like:

```typescript
// Example: Track a button click
const handleClick = () => {
  // Send custom event to GA
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'button_click', {
      'event_category': 'engagement',
      'event_label': 'sign_up_button',
      'value': 1,
    });
  }
  
  // Your other logic here...
};
```

### Common Events to Track

**Customer Check-In:**
```typescript
window.gtag('event', 'check_in', {
  'event_category': 'loyalty',
  'event_label': merchant_name,
  'value': 1,
});
```

**Account Signup:**
```typescript
window.gtag('event', 'sign_up', {
  'event_category': 'user',
  'event_label': 'email_signup',
  'value': 1,
});
```

**Subscription Upgrade:**
```typescript
window.gtag('event', 'upgrade', {
  'event_category': 'billing',
  'event_label': 'free_to_paid',
  'value': 9.99,
});
```

---

## Accessing Google Analytics Dashboard

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property: **StarQR Loyalty** (G-PXN6ZRRKBD)
3. You'll see:
   - **Realtime** - Live visitor activity
   - **Audience** - User demographics and behavior
   - **Acquisition** - How users find your site
   - **Engagement** - Page views, events, session duration
   - **Monetization** - Revenue (if configured)
   - **Retention** - User retention metrics

---

## Testing Locally

To test GA in development:

```bash
npm run dev
```

Then open your browser developer tools (F12) → Console and paste:

```javascript
gtag('event', 'test_event', {
  'test': true,
});
```

You should see GA processing the event (might take 5-10 minutes to appear in Analytics dashboard due to GA's 24-hour data processing delay in testing mode).

---

## Important Notes

### 1. Privacy Compliance
Google Analytics requires:
- ✅ Privacy policy mentioning analytics
- ✅ Cookie consent (recommended for EU users)
- ✅ Option to opt-out of tracking

Consider adding a simple cookie banner:
```typescript
// Example: Ask user consent before enabling GA
// Only load GA script if user consents
const hasConsent = localStorage.getItem('ga-consent') === 'true';
// Then conditionally render GA script
```

### 2. Data Collection Delay
- Real-time data: Available immediately
- Standard reports: 24-48 hours delay
- This is normal Google Analytics behavior

### 3. Testing vs Production
- **Development:** Test events might not appear immediately
- **Production:** Data syncs within minutes to a few hours

### 4. Next.js Specific
The `strategy="afterInteractive"` is optimal because:
- Doesn't block page rendering
- Loads after page is interactive
- Best Core Web Vitals score
- Still captures page views reliably

---

## Environment Variable Reference

### Development (`.env.local`)
```
NEXT_PUBLIC_GA_ID=G-PXN6ZRRKBD
```

### Production (Vercel Dashboard)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **StarQR** project
3. Settings → Environment Variables
4. Add: `NEXT_PUBLIC_GA_ID=G-PXN6ZRRKBD`
5. Redeploy

---

## Common Questions

**Q: Will GA slow down my site?**
A: No. With `strategy="afterInteractive"`, GA loads after page is interactive and doesn't block rendering.

**Q: Can I track conversions?**
A: Yes. Set up conversion events in Google Analytics dashboard under Admin → Conversions → New Event.

**Q: How do I find the GA code in Google Analytics?**
A: Admin → Property Settings → Property ID (visible at top right, also in URLs).

**Q: Should I remove the old GA tag?**
A: You've already replaced the manual tag with the Next.js integration, so you're good.

**Q: Can I use this with Vercel Analytics?**
A: Yes, both work well together:
- **Google Analytics:** Full analytics dashboard
- **Vercel Web Analytics:** Quick performance insights

---

## Next Steps (Optional)

1. **Set up Goals:**
   - Admin → Goals → Set up goals for sign-ups, check-ins, purchases

2. **Create Custom Dashboard:**
   - Dashboard → Create new dashboard
   - Add cards for: users, check-ins, page views, bounce rate

3. **Enable E-commerce Tracking:**
   - If tracking purchases: Admin → E-commerce Settings → Enable

4. **Connect Google Search Console:**
   - Admin → Property Settings → Link Google Search Console
   - Get insights on search traffic

5. **Set up Email Reports:**
   - Admin → Scheduled Emails
   - Get weekly/monthly insights

---

## Production Checklist

- [ ] GA ID added to Vercel Environment Variables
- [ ] Site deployed to production
- [ ] Real traffic arrives and GA shows visitors
- [ ] Custom events are firing (check a few)
- [ ] Privacy policy updated to mention analytics
- [ ] Cookie consent considered (EU users)

---

## File Locations

- **Root Layout:** `app/layout.tsx` (GA scripts added here)
- **Config:** `.env.local` (GA ID stored here)
- **Reference:** `.env.example` (template for team)

---

You're all set! 🎉 Google Analytics is now tracking your StarQR application.
