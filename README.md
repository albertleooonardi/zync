# Zync: Intelligent URL Shortener 🔗✨

Zync is an advanced, ultra-modern URL shortening and routing platform designed for developers, marketers, and power users. Unlike traditional shorteners, Zync offers dynamic routing, in-depth device and geo-analytics, seamless UI/UX, and is powered directly by AI (Groq platform) to intelligently auto-generate link metadata and protect against phishing.

![Zync Preview]( public/favicon.svg )

---

## 🌟 Key Features

### 1. **Core Link Management**
- **Custom Aliases:** Claim branded, memorable URLs (e.g., `zync.id/promo-2026`).
- **Lightning Fast:** Edged-optimized redirects using Next.js / Astro edge architecture.
- **QR Code Generation:** Share links visually anywhere.

### 2. **Advanced Smart Routing** 🔀
- **A/B Testing:** Split traffic (e.g., 50/50, 70/30) between two destination URLs automatically to see which converts best.
- **Time-Based Routing:** Route users to different destinations based on predefined dates or hours (perfect for flash sales).
- **Device & OS Level Analytics:** Distinguish between iOS, Android, macOS, and Windows. Automatically serve different URLs for different devices!
- **Geo-Routing:** Redirect users depending on the country or region they’re clicking from.

### 3. **AI Integration (Powered by Groq)** 🤖
- **Nemo (AI Assistant):** An interactive chatbot built directly into the dashboard. Nemo isn't just a chatbot; it has agentic access to the platform and can **create links on your behalf** and fetch your analytics directly in chat!
- **Meta-Tag Optimization:** Our AI dynamically writes beautiful, compelling OpenGraph titles and descriptions based on your destination URL so your link previews on platforms like WhatsApp or Twitter look incredible.
- **Phishing Shield:** Each URL submitted to Zync is run through Groq AI to check for malicious intents, scams, or phishing threats, halting dangerous URLs before they are even created.

### 4. **Detailed Analytics** 📊
- **Real-time Live Click Tracking:** Powered by Supabase Realtime—watch your dashboard click counters tick up dynamically.
- **Referrer & Location Metrics:** See the exact sources of traffic and where they originate globally.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Astro.js](https://astro.build/) (Fast, lightweight, SSR & static generation)
- **Styling:** Vanilla CSS & Tailwind CSS for beautiful styling, smooth micro-interactions, and glassmorphic designs.
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + built-in robust Row Level Security + Realtime websockets)
- **AI Processing:** [Groq SDK](https://console.groq.com/docs/quickstart) (Powering Nemo Assistant and Phishing detection)
- **Payment Portal (Coming Soon):** [Stripe](https://stripe.com/) / Midtrans

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have the following installed to run Zync:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) or PNPM
- A Supabase account and project
- A Groq account and API key

### 2. Clone and Install
```bash
git clone https://github.com/your-username/zync.git
cd zync
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your configurations. Use `.env.example` as a reference.

```bash
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_DISPLAY_URL=https://zync.id

# Supabase Configurations
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your.anon.key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External Services
STRIPE_SECRET_KEY=sk_test_...
GROQ_AI_API_KEY=gsk_...
```

### 4. Start the Application
Boot up the development server:

```bash
npm run dev
```

Your app will be live at: [http://localhost:4321](http://localhost:4321)

---

## 📚 Project Structure

```
├── public/                 # Static assets (favicons, generic images)
├── src/                    
│   ├── components/         # Reusable Astro components (NemoChat, Analytics, StatCards)
│   ├── layouts/            # Global page layouts (Header, Footer, Meta)
│   ├── lib/                # Utility scripts (supabase.ts, groq.ts, phishing.ts)
│   └── pages/              # Application pages mapping to routes
│       ├── api/            # Server-less backend endpoints (AI routing, checkouts)
│       └── dashboard/      # Authenticated user dashboard pages
├── supabase/               # Database migrations and configurations
├── package.json
└── astro.config.mjs        # Astro configuration
```

---

## 🔗 Useful Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally                       |
| `npx astro check`         | Type-check your Astro application (TypeScript)   |

---

## 🛡️ License

Zync is developed as a proprietary application. All rights reserved. Do not distribute without permission.
