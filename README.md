# 🔗 Zync - Modern URL Shortener & Link Management

Welcome to **Zync**, a powerful, modern, and intelligent URL shortener built with [Astro](https://astro.build) and [Supabase](https://supabase.com). Zync goes beyond simple link shortening by offering advanced routing, in-depth analytics, and a built-in AI assistant.

---

## ✨ Key Features

Zync is packed with features designed for marketers, developers, and everyday users who need more control over their links.

*   **🐠 Nemo AI Assistant:** A built-in, floating AI chatbot (powered by Groq) that can answer your questions, shorten links on your behalf, and fetch analytics right from the chat window!
*   **🔀 A/B Routing:** Test the performance of different landing pages by splitting traffic between multiple destination URLs.
*   **🕒 Time-Based Routing:** Automatically redirect users to different URLs depending on the day of the week or time of day. Perfect for time-sensitive campaigns.
*   **📱 Device/OS Routing:** Smart routing that sends iOS users to the App Store, Android users to the Play Store, and Desktop users to a specific web page.
*   **🌍 Geo-Routing:** Redirect users to geographically relevant URLs based on their country.
*   **🛡️ Phishing Shield & Password Protection:** Zync uses heuristics and AI analysis to block malicious URLs. You can also lock your sensitive links behind a password. 🔒
*   **🖼️ Meta-Tag Optimizer:** Leverage AI to generate optimized OpenGraph titles, descriptions, and preview images so your links look perfect when shared on social media.
*   **🏷️ Custom Aliases:** Create memorable, branded short links (e.g., `zync.com/my-campaign`) instead of random character strings.
*   **📊 In-Depth Analytics:** Track clicks, referrers, devices, operating systems, and geographic locations with beautiful, real-time charts.

---

## 🚀 Getting Started

Follow these steps to get Zync up and running locally.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   A [Supabase](https://supabase.com) account & project
*   A [Groq API Key](https://console.groq.com/keys) (for the Nemo AI & Phishing Shield)
*   (Optional) A [Resend API Key](https://resend.com/) for email features
*   (Optional) A [Stripe API Key](https://stripe.com/) for billing/subscriptions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd zync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys. 

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Client (Groq)
GROQ_AI_API_KEY=your_groq_api_key
# Optional: Override the default Groq model
# GROQ_MODEL=llama-3.3-70b-versatile

# Other Services (Optional for basic running)
RESEND_API_KEY=your_resend_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Database Setup (Supabase)
Ensure your Supabase database has the required tables. You will need:
*   `links` table (for storing URL mappings, rules, and passwords)
*   `clicks` table (for tracking analytics)
*(Note: Check the `/supabase/migrations` folder if applicable for SQL schema definitions).*

### 5. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:4321`.

---

## 🛠️ Tech Stack

*   **Framework:** [Astro](https://astro.build/) (Server-Side Rendered)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database & Auth:** [Supabase](https://supabase.com/)
*   **AI Engine:** [Groq](https://groq.com/) (Llama 3 models)
*   **Markdown Parsing:** `marked`
*   **Icons:** Custom SVG / Emojis

---

## 🧞 Astro Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is open-source and available under the MIT License.
