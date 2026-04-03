# LexiForge — LexiReview Marketing & Agent Dashboard

## Project Overview
Marketing website + LexiForge agent dashboard for LexiReview (app.lexireview.in), an AI-powered contract intelligence platform built for Indian law by LexiDraft Technologies.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion
- **Database**: PostgreSQL + Prisma 5
- **Deployment**: Hostinger VPS (46.202.160.52), PM2, Nginx reverse proxy

@AGENTS.md

## Brand Identity

### Colors (CRITICAL — do not use gold/amber)
- **Primary Blue**: #2563eb → #1d4ed8 (gradient) — Tailwind blue-600/blue-700
- **Dark/Text**: #0f172a (slate-900) for headings, #1e293b (slate-800) for body
- **Navy**: #102a43 → #243b53 → #334e68 — used for dark sections, buttons, backgrounds
- **Emerald**: #10b981 — success states, safe indicators, checkmarks
- **Muted**: #94a3b8 (slate-400) for secondary text, taglines
- **Background**: #f8fafc (slate-50) light blue-gray tint
- **The gold-* CSS tokens map to BLUE values** (kept for code compatibility)

### Logo
- Shield icon (blue gradient #2563eb→#1d4ed8) with document lines and green (#10b981) checkmark circle
- "Lexi" in #0f172a + "Review" in #2563eb
- Tagline: "AI CONTRACT INTELLIGENCE" in #94a3b8
- SVG assets: `/public/logo-icon.svg` (icon only), `/public/logo-full.svg` (full with text)
- Component: `/src/components/marketing/lexi-logo.tsx` — supports "brand" and "white" variants

### Typography
- **Headings**: Urbanist (font-heading) — weights 400-900
- **Body**: Poppins (font-body) — weights 300-700
- **Code**: Geist Mono

### Design Language
- Glass morphism panels, aurora backgrounds with blue/emerald tints
- Risk severity color-coding: Critical (Red), High (Orange), Medium (Amber), Low (Emerald)
- Framer Motion animations: fadeUp, scaleReveal, stagger, heroWord, float, tabContentIn
- Card effects: card-3d hover lift, card-highlight mouse spotlight, shadow-premium/elevated
- Animation variants defined in `/src/lib/motion.ts`

## Product Capabilities (for marketing content accuracy)

### What LexiReview Does
Full contract lifecycle: Triage → Review → Generate → Sign → Vault → Comply

### Key Features
- 6 parallel AI analysis engines (Risk, Citations, Template Comparison, Recommendations, Overview, Custom)
- Quick Triage: instant go/no-go in <2 seconds, zero credits
- LexiCoPilot: RAG-powered contract chat with cited answers
- Contract Generation Wizard (6-step AI chat flow)
- LexiBrain: autonomous 4-stage regulatory intelligence pipeline monitoring eGazette, MeitY, RBI
- Indian law compliance: ICA, DPDP, RBI, SEBI, RERA, Stamp Acts (28 states)
- e-Office government integration (unique differentiator)
- Chain-hashed audit trails (SHA-256, CAG-suitable)
- White-label branding for resellers
- Batch processing (100+ contracts)
- Precedent search (Supreme Court, High Courts, NCLAT, NCDRC, RERA, DRT)

### ICPs
1. Law Firms — Matter Workspaces, Playbooks, White-Label, Precedent Search
2. NBFCs & Banks — RBI compliance, Batch Processing, Vendor Risk, Regulatory Alerts
3. Government & PSUs — e-Office, CAG reports, chain-hashed audit trails
4. SMEs/Startups/Real Estate — Quick Triage, Templates, Stamp Duty Calculator, RERA

### Pricing
- Free Trial: ₹0 (3 reviews)
- Starter: ₹4,999/mo (25 reviews, 3 users)
- Professional: ₹14,999/mo (100 reviews, 10 users) — most popular
- Business: ₹34,999/mo (500 reviews, 50 users)
- Enterprise: Custom (unlimited)

### Social Proof
- 2,500+ Contracts Analyzed
- 150+ Legal Teams
- 98.5% Detection Accuracy
- 45 seconds average analysis time

## Route Structure
```
/                       → Landing page
/features               → Platform capabilities
/pricing                → Plans + credits
/solutions/nbfc         → NBFC solution
/solutions/banking      → Banking solution
/solutions/legal-firms  → Law firm solution
/solutions/real-estate  → Real estate solution
/solutions/government   → Government & PSU solution
/compare/spotdraft      → vs SpotDraft
/compare/leegality      → vs Leegality
/compare/provakil       → vs Provakil
/blog                   → Blog index
/blog/[slug]            → Blog posts
/resources              → Guides, templates, checklists
/contact                → Contact + demo booking
/forge/*                → LexiForge dashboard (auth-protected)
```
