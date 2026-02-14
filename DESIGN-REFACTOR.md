# Design Refactor Notes

## What Changed

The entire frontend has been redesigned with a premium, minimal aesthetic inspired by companies like Linear, Stripe, and Vercel.

### Key Design Decisions

**Typography & Spacing**
- Neutral color palette (neutral-50 to neutral-900)
- Consistent but not uniform spacing
- Clean type hierarchy without excessive sizes
- Font smoothing for crisp text rendering

**Components**
- Removed all shadcn/ui Card abstractions from main pages
- Direct HTML/CSS with intentional spacing
- Flat component hierarchies
- No generic wrapper components

**Colors**
- Primary: Neutral-900 (not amber/orange)
- Backgrounds: White and neutral-50
- Borders: Neutral-200/300
- Minimal use of color - only for warnings/errors

**Interactions**
- Subtle hover states (no dramatic transforms)
- Clean transitions (200-300ms)
- No bouncing animations or blobs
- Focus rings on neutral-900

**Layout Philosophy**
- Generous whitespace
- Asymmetric sections where appropriate
- Single-column forms (no over-complicated grids)
- Data-first dashboard (metrics without decoration)

### Pages Refactored

✅ Landing page - Bold, minimal hero
✅ Login - Centered, clean form
✅ Signup - Minimal, focused
✅ Check-in - Simple, functional
✅ Dashboard layout - Top nav, no sidebar clutter
✅ Dashboard home - Data-focused metrics
✅ Onboarding - Linear-style setup flow

### Removed
- All gradient backgrounds
- Emoji headers
- Decorative blob animations
- Over-designed card components
- Excessive rounded corners
- Colored accent borders
- "Template-y" success messages

### What Stayed
- Core functionality unchanged
- API routes untouched
- Database schema same
- All features work identically

## Design Principles Applied

1. **Confident spacing** - Not everything needs equal padding
2. **Minimal color** - Neutral palette with purpose
3. **Flat hierarchies** - Less component nesting
4. **Real naming** - `Dashboard` not `DashboardPage`
5. **Subtle motion** - Transitions, not animations
6. **Data first** - Show info clearly, don't decorate
7. **No template feels** - Every page has intention

## Typography

- Headings: 2xl-3xl (not 4xl-6xl)
- Body: text-sm and text-base
- Weights: normal (400), medium (500), semibold (600), bold (700)
- Line heights: relaxed where needed, tight for headings

## Spacing System

- Tight: 1-3 (4-12px) - Between related elements
- Normal: 4-6 (16-24px) - General spacing
- Loose: 8-12 (32-48px) - Section breaks
- Extra loose: 16-20 (64-80px) - Page sections

## Form Inputs

- Border: neutral-300
- Focus: 2px ring neutral-900
- Padding: px-4 py-2.5
- Rounded: lg (8px)
- No placeholder animations
- Clean, functional

## Buttons

- Primary: bg-neutral-900 hover:bg-neutral-800
- Secondary: border border-neutral-300 hover:border-neutral-400
- Rounded: lg (8px)
- Font: medium weight
- No excessive padding

## This Feels Human Because

- Decisions were made, not defaults accepted
- Spacing varies with purpose
- Color is restrained
- Motion is subtle
- Names are straightforward
- Components don't over-abstract
- Layout has opinion

The codebase now reads like a senior engineer wrote it for a real product, not generated it from a template.
