# 🔗 Zync — Modern URL Shortener & Intelligent Link Management

<div align="center">

**Zync** is a full-featured, production-ready URL shortener built with [Astro](https://astro.build) and [Supabase](https://supabase.com). It goes far beyond simple link shortening — with smart routing, real-time analytics, AI-powered features, and an interactive AI assistant named **Nemo 🐠**.

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![AI by Groq](https://img.shields.io/badge/AI%20by-Groq-F55036?logo=groq&logoColor=white)](https://groq.com)

</div>

---

## ✨ Features

### 🔗 Core Link Management
| Feature | Description |
|---|---|
| **URL Shortening** | Instantly shorten any `http://` or `https://` URL into a clean, compact link |
| **Custom Aliases** | Create branded short links like `zync.id/my-campaign` instead of random characters |
| **Phishing Shield 🛡️** | AI-powered heuristic scanner that blocks malicious/phishing URLs before they can be shortened |
| **Password Protection 🔒** | Lock individual links behind a password so only authorized people can access the destination |

### 📊 Analytics & Tracking
| Feature | Description |
|---|---|
| **Click Tracking** | Every click on a Zync link is logged in real-time |
| **Device & OS Breakdown** | See which devices (Mobile, Desktop, Tablet) and operating systems are clicking your links |
| **Geographic Analytics** | Country-level breakdown of your link traffic |
| **Referrer Tracking** | Know where your traffic is coming from (social media, direct, other sites) |
| **Time-Series Charts** | Beautiful click-over-time graphs |

### 🧠 Smart Routing
> One link, infinite flexibility. Configure rules to redirect different visitors to different destinations based on conditions.

| Rule Type | Description |
|---|---|
| **🔀 A/B Routing** | Split traffic between two URLs (e.g., 70/30) to run experiments and find which page converts better |
| **⏰ Time-Based Routing** | Automatically redirect users to different URLs based on the time of day or day of the week. Great for flash sales or event-specific campaigns |
| **📱 Device/OS Routing** | Send iOS users to the App Store, Android users to the Play Store, and Desktop users to your website — all from one smart link |
| **🌍 Geo-Routing** | Redirect visitors to country-specific pages. Perfect for international campaigns or serving localized content |

### 🤖 AI Features
| Feature | Description |
|---|---|
| **Nemo AI Assistant 🐠** | A floating AI chatbot (powered by Groq's Llama 3) that can answer questions, shorten links, and pull up analytics — all from the chat window |
| **Meta-Tag Optimizer** | AI generates optimized OpenGraph `title`, `description`, and preview images so links look stunning on WhatsApp, Twitter, Instagram, and more |

---

## 🚀 Getting Started

### Prerequisites
Before you begin, make sure you have these installed/available:
- [Node.js](https://nodejs.org/) **v18 or higher**
- A [Supabase](https://supabase.com) account and project
- A [Groq API Key](https://console.groq.com/keys) (free tier available – powers Nemo AI and Phishing Shield)
- *(Optional)* A [Resend API Key](https://resend.com/) for email features
- *(Optional)* A [Stripe API Key](https://stripe.com/) for billing/subscriptions

---

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd zync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root and populate it with the following:

```env
# ── Supabase ────────────────────────────────────────────────────────────────
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ── AI (Groq) ────────────────────────────────────────────────────────────────
# Get a free key at: https://console.groq.com/keys
GROQ_AI_API_KEY=gsk_...
# Optional: Override the default model (default: llama-3.3-70b-versatile)
# GROQ_MODEL=llama-3.3-70b-versatile

# ── Email (Resend) ───────────────────────────────────────────────────────────
# Optional – needed for email invitations and notifications
RESEND_API_KEY=re_...

# ── Billing (Stripe) ─────────────────────────────────────────────────────────
# Optional – needed for subscription plans
STRIPE_SECRET_KEY=sk_...
```

> [!IMPORTANT]
> Never commit your `.env` file to version control. It's already in `.gitignore`.

---

### 4. Database Setup (Supabase)

Apply the SQL migrations found in the `/supabase/migrations/` folder to your Supabase project. The core tables are:

- **`links`** — Stores all shortened links, their destinations, smart routing rules, OG metadata, and password hashes.
- **`clicks`** — Append-only table that logs every click event with device, OS, country, and referrer data.

You can run the migrations via the [Supabase SQL Editor](https://supabase.com/dashboard) or the Supabase CLI:
```bash
supabase db push
```

---

### 5. Run the Development Server
```bash
npm run dev
```
Visit `http://localhost:4321` to see your local Zync instance.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro](https://astro.build/) (Server-Side Rendered, Node.js adapter) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security) |
| **AI Engine** | [Groq](https://groq.com/) with Llama 3.3 70B |
| **Payments** | [Stripe](https://stripe.com/) |
| **Email** | [Resend](https://resend.com/) |
| **Markdown Parsing** | `marked` (for Nemo's rich text responses) |

---

## 📁 Project Structure

```
/
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── analytics/   # Analytics chart components
│   │   ├── dashboard/   # Dashboard navigation & UI
│   │   └── ui/          # Generic UI primitives
│   ├── layouts/         # Page layout wrappers
│   ├── lib/             # Server-side utilities
│   │   ├── groq.ts      # Groq AI client (chat, meta-optimization, phishing)
│   │   ├── phishing.ts  # URL safety scanner (heuristics + AI)
│   │   ├── supabase.ts  # Supabase server & client helpers
│   │   └── meta.ts      # OpenGraph metadata fetcher
│   ├── pages/
│   │   ├── api/         # API route handlers (chat, ai-meta, checkout, etc.)
│   │   ├── dashboard/   # Dashboard pages (new link, edit, analytics)
│   │   └── [alias].astro # The core redirect handler
│   └── types/           # TypeScript type definitions
├── supabase/
│   └── migrations/      # SQL migration files
└── astro.config.mjs
```

---

## 🔌 API Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat` | Nemo AI chat endpoint (supports tool calling) |
| `POST` | `/api/ai-meta` | AI-powered OpenGraph meta-tag improvement |
| `POST` | `/api/fetch-meta` | Scrape OG meta tags from a URL |
| `POST` | `/api/checkout` | Stripe checkout session creation |
| `GET/POST` | `/[alias]` | The core redirect handler with all routing logic |

---

## 🧞 Commands

| Command | Action |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npx astro check` | Run TypeScript checks on all Astro files |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please open an issue to discuss major changes first.

## 📝 License

This project is open-source and available under the **MIT License**.
