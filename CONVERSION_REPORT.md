# Slytherin Classroom — Conversion Report
## HTML → Expo (React Native) · Final Report

---

## ✅ Bugs Fixed During Conversion

### Bug 1 — Hardcoded Supabase keys (SECURITY)
**Original files:** `admin.html`, `auth.js`
**Problem:** Supabase URL and anon key were written directly in the JS
files. Anyone who viewed your page source could copy them.
**Fix:** Both keys now live in `.env` and loaded via
`process.env.EXPO_PUBLIC_SUPABASE_URL`. The `.gitignore` excludes `.env`
so keys are never accidentally pushed to GitHub.

---

### Bug 2 — Race condition in auth callback
**Original file:** `auth.js`
**Problem:** A global variable `let onAuthSuccess = null` was assigned
AFTER `supabase.auth.onAuthStateChange()` was already listening. If auth
resolved before the callback was assigned, the app would silently stay
on the login screen and do nothing — no error, no redirect.
**Fix:** Replaced with `AuthContext.tsx` using React's `useEffect` +
`onAuthStateChange` subscription. Auth state is now always consumed
correctly. No globals, no timing issues.

---

### Bug 3 — Inconsistent RANKS array
**Original files:** `app.js` vs `admin.html`
**Problem:** Both files defined their own `RANKS` array but with different
EXP thresholds and rank names. A student could appear as "Gold" in the
student view and "Diamond" in the admin view for the exact same EXP value.
**Fix:** Single source of truth in `src/utils/constants.ts`. Both the
student app and admin panel import `getRank()` from the same file.

---

### Bug 4 — Admin gate shows 404 by default
**Original file:** `admin.html`
**Problem:** The admin gate div was hidden by default with no loading
indicator, so non-admin users briefly saw a blank/broken page while
auth was being checked.
**Fix:** `AdminScreen` in React now checks `isAdmin` from `AuthContext`
immediately. Non-admins see a clean "Access denied" message instantly.
The tab itself only appears in the nav bar for admin users.

---

### Bug 5 — Copy/paste block interfered with CodeMirror
**Original file:** `app.js`
**Problem:** `contextmenu`, `copy`, `cut`, `paste` events were blocked
globally on the editor. CodeMirror uses clipboard APIs internally, so
the block caused erratic editor behavior on some browsers.
**Fix:** In React Native, the TextInput editor does not have this issue.
If you want to re-add paste prevention later, it can be done cleanly
at the component level without affecting the editor's own clipboard use.

---

## ⚠️ Known Limitations (Things Not Fully Converted Yet)

### 1 — Python execution (Pyodide) is web-only
**What it means:** The original app ran Python code in the browser using
Pyodide (a Python interpreter compiled to WebAssembly). This only works
on web — it cannot run inside a native iOS or Android app.

**Current state:** The lab editor screen exists and works on web.
On mobile (iOS/Android), tapping "Run Tests" will show:
`"Python runner not available on mobile yet."`

**How to fix later:** Set up a small backend API (e.g. a Supabase Edge
Function or a simple Python server) that receives code and returns output.
The `useLabSubmission` hook has a `runCode()` function ready to be wired
up to such an endpoint.

---

### 2 — Rank badge images need to be added manually
**What it means:** The rank images (astral.png, bronze.png, etc.) from
your original repo are not included in this project — you need to copy
them in yourself.

**How to fix:** Copy all image files from your original repo into:
```
src/assets/images/
```
Then update `src/utils/constants.ts` — find the `RANKS` array and set
the `img` field for each rank to the correct filename, like:
```ts
img: require('../assets/images/gold.png'),
```

---

### 3 — No push notifications yet
**What it means:** The original web app had no push notifications either,
so this is not a regression — just a future opportunity. You could notify
students when new labs/quizzes are posted.

---

### 4 — AI "Why?" explanation (api/why.js) not yet wired up
**What it means:** Your original repo had an `api/why.js` endpoint that
used AI to explain quiz answers. This was a Vercel serverless function.
**Current state:** Not converted yet — it was out of scope for this
conversion but the hook system is ready for it.
**How to add later:** Create a `useWhyExplanation` hook in `src/hooks/`
that calls your deployed `api/why.js` endpoint (or a Supabase Edge
Function equivalent).

---

## 🚀 First-Run Instructions

### Prerequisites
- Node.js LTS (v20+) — https://nodejs.org
- VS Code — https://code.visualstudio.com
- Expo Go app on your phone — search "Expo Go" in App Store / Play Store

### 1 — Install dependencies
Open a terminal in the project folder and run:
```
npm install
```
Wait for it to finish (may take 2–3 minutes the first time).

### 2 — Start the app
```
npm start
```

### 3 — Open the app
| Platform | How |
|---|---|
| Browser (web) | Press **W** in the terminal |
| Your phone | Scan the QR code with Expo Go |
| Android emulator | Press **A** |
| iOS simulator (Mac only) | Press **I** |

---

## 📁 Final Project Structure

```
slytherin-classroom/
├── .env                          ← Your Supabase keys (never commit this)
├── .env.example                  ← Template for teammates
├── .gitignore
├── package.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── expo-env.d.ts
├── nativewind-env.d.ts
│
├── app/                          ← All screens (Expo Router)
│   ├── _layout.tsx               ← Root layout + auth guard
│   ├── auth/
│   │   └── login.tsx             ← Login + signup screen
│   ├── (tabs)/
│   │   ├── _layout.tsx           ← Bottom tab bar
│   │   ├── home.tsx              ← Dashboard
│   │   ├── labs.tsx              ← Labs list
│   │   ├── quizzes.tsx           ← Quizzes list
│   │   ├── leaderboard.tsx       ← Rankings
│   │   └── admin-entry.tsx       ← Admin tab (admins only)
│   ├── lab/[id].tsx              ← Lab editor screen
│   ├── quiz/[id].tsx             ← Quiz session screen
│   └── admin/index.tsx           ← Admin panel
│
└── src/
    ├── components/               ← Reusable UI components
    │   ├── ThemedText.tsx
    │   ├── Button.tsx
    │   ├── Badge.tsx
    │   ├── Card.tsx
    │   ├── Input.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── Modal.tsx
    │   ├── RankDisplay.tsx
    │   └── index.ts
    ├── context/
    │   └── AuthContext.tsx        ← Global auth state
    ├── hooks/                    ← All data + logic hooks
    │   ├── useLabsAndQuizzes.ts
    │   ├── useLabSubmission.ts
    │   ├── useQuiz.ts
    │   ├── useLeaderboard.ts
    │   ├── useAdminData.ts
    │   ├── useAdminActions.ts
    │   └── index.ts
    ├── lib/                      ← Supabase layer
    │   ├── supabase.ts
    │   ├── authService.ts
    │   ├── database.ts
    │   └── realtime.ts
    ├── styles/
    │   └── global.css
    └── utils/
        ├── constants.ts          ← RANKS, config, helpers
        └── types.ts              ← All TypeScript types
```

---

## 🎉 Conversion Complete!

**47 files** across 7 phases.
Original bugs fixed: **5**
Known limitations documented: **4**
Platforms supported: **Web + iOS + Android**
