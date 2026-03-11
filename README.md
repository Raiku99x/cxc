# 🐍 Slytherin Classroom

> BSCS Python Practice Platform — v1.3.1

A cross-platform learning app built with **Expo (React Native)** + **Supabase**.
Runs on Web, iOS, and Android from a single codebase.

---

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then open `.env` and fill in your Supabase URL and anon key.

### 3. Run the app
```bash
# Web browser
npm run web

# iOS simulator (Mac only)
npm run ios

# Android emulator
npm run android

# Expo Go app (scan QR)
npm start
```

---

## 📁 Project Structure

```
slytherin-classroom/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout (auth guard)
│   ├── index.tsx           # Dashboard / Home
│   ├── (auth)/
│   │   ├── login.tsx       # Login screen
│   │   └── register.tsx    # Register screen
│   └── admin/
│       └── index.tsx       # Admin dashboard
│
├── src/
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screen-level components
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   ├── hooks/              # Custom React hooks
│   ├── context/
│   │   └── AuthContext.tsx # Auth state management
│   ├── utils/
│   │   ├── constants.ts    # RANKS, config (unified source of truth)
│   │   └── types.ts        # TypeScript interfaces
│   └── assets/images/      # rank badges, logo
│
├── api/
│   └── why.ts              # Serverless AI explanation endpoint
│
├── .env.example            # Environment variable template
├── app.json                # Expo config
└── tailwind.config.js      # NativeWind (Tailwind for RN)
```

---

## 🔐 Security Notes

- ✅ Supabase keys moved to `.env` (not hardcoded)
- ✅ `.env` is in `.gitignore` — never committed
- ✅ `ANTHROPIC_API_KEY` stays server-side only (Vercel env var)
- ✅ Admin access checked via `admins` table on every load

---

## 🐛 Bugs Fixed During Conversion

| Bug | Original | Fixed |
|-----|----------|-------|
| Dual RANKS system | `app.js` and `admin.html` had different rank names & EXP values | Unified in `src/utils/constants.ts` |
| Hardcoded Supabase keys | In `auth.js` and `admin.html` | Moved to `.env` |
| Global auth race condition | `onAuthSuccess = null` global | Fixed with React Context |

---

## 🌐 Deployment

- **Web**: Deploy to Vercel — `npm run build:web`
- **Mobile**: Use EAS Build — `eas build`
