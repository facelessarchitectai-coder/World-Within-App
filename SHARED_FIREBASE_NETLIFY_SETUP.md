# Shared Firebase & Netlify Multi-App Setup and Deployment Checklist

This document details the shared Firebase project configuration, database isolation, Authentication authorized domains, reCAPTCHA Enterprise / App Check requirements, and Netlify deployment checklist for all four suite applications.

---

## 1. Multi-App Architecture & Database Isolation

All four apps share a common Firebase project for centralized Authentication and App Check, but **each app strictly maintains its own isolated Firestore database instance** to guarantee complete data separation and security.

| Application Name | Production Netlify Domain | Firestore Database ID | Purpose |
| :--- | :--- | :--- | :--- |
| **Signal States** | `signalarchiveapp.netlify.app` | Dedicated database instance | Signal archiving and analysis |
| **Recognition Engine** | `the-recognition-engine-app.netlify.app` | Dedicated database instance | Recognition pattern matching |
| **World Within** *(This App)* | `worldwithinappbuildyourworld.netlify.app` | `ai-studio-5223736b-7fa2-475f-9a2a-aa8d14924bf2` | Structured system & internal world builder |
| **Imprint Creator Audit** | `imprintcreatoraudit.netlify.app` | `ai-studio-imprintaudit-4ef4e870-6e35-478f-bd43-bc366d967125` | Creator audit and positioning analysis |

> **Critical Invariant:** World Within connects exclusively to its database `ai-studio-5223736b-7fa2-475f-9a2a-aa8d14924bf2`. Imprint Creator Audit connects exclusively to `ai-studio-imprintaudit-4ef4e870-6e35-478f-bd43-bc366d967125`. Cross-database reads, writes, and rule mutations are forbidden.

---

## 2. Shared Firebase Project Configuration

- **Firebase / GCP Project ID:** `gen-lang-client-0315983382`
- **Registered Firebase Web App ID:** `1:823709597572:web:b68918bc6d74abf50b67d1`
- **Auth Domain:** `gen-lang-client-0315983382.firebaseapp.com`
- **Storage Bucket:** `gen-lang-client-0315983382.firebasestorage.app`
- **Messaging Sender ID:** `823709597572`

---

## 3. Firebase App Check & reCAPTCHA Enterprise

- **Provider:** reCAPTCHA Enterprise (`ReCaptchaEnterpriseProvider`)
- **Site Key:** `6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`
- **Auto-Refresh:** Enabled (`isTokenAutoRefreshEnabled: true`)
- **Initialization Timing:** Initialized once in `src/services/firebase.ts` immediately upon Firebase app bootstrap, before any Firebase Authentication or Firestore requests are executed.

---

## 4. Google Cloud / Firebase Console Configuration Checklist

The following settings must be verified in the Google Cloud and Firebase Consoles (cannot be verified programmatically from code):

### A. Firebase Authentication -> Authorized Domains
In the [Firebase Console](https://console.firebase.google.com/project/gen-lang-client-0315983382/authentication/settings):
Ensure the following domains are in the **Authorized domains** list:
- [ ] `localhost`
- [ ] `gen-lang-client-0315983382.firebaseapp.com`
- [ ] `signalarchiveapp.netlify.app`
- [ ] `the-recognition-engine-app.netlify.app`
- [ ] `worldwithinappbuildyourworld.netlify.app`
- [ ] `imprintcreatoraudit.netlify.app`
- [ ] AI Studio preview host patterns (e.g., `ais-dev-r5skjlvczrbdqjmjwangml-91501777465.us-west2.run.app`, `ais-pre-r5skjlvczrbdqjmjwangml-91501777465.us-west2.run.app`)

### B. Google Cloud reCAPTCHA Enterprise Key -> Domain List
In Google Cloud Console -> **Security** -> **reCAPTCHA Enterprise** (Key: `6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`):
Ensure the domain allowlist includes:
- [ ] `localhost`
- [ ] `signalarchiveapp.netlify.app`
- [ ] `the-recognition-engine-app.netlify.app`
- [ ] `worldwithinappbuildyourworld.netlify.app`
- [ ] `imprintcreatoraudit.netlify.app`
- [ ] `run.app` (for AI Studio development & preview environments)

### C. Firebase App Check Registration & Enforcement
In [Firebase Console -> App Check](https://console.firebase.google.com/project/gen-lang-client-0315983382/appcheck):
- [ ] Confirm Web App `1:823709597572:web:b68918bc6d74abf50b67d1` has reCAPTCHA Enterprise registered with site key `6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`.
- [ ] Verify enforcement mode: Keep in **Monitoring** mode until all four applications are verified live on their respective Netlify domains, then switch Cloud Firestore to **Enforced**.

---

## 5. Netlify Deployment Configuration (All 4 Apps)

Each application repository should have the following build and redirect definitions:

### Build Settings
- **Base directory:** `/`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

### Netlify Redirects (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 6. Access Control & Entry Flow Invariant (World Within)

This application strictly implements the mandatory entry sequence:
1. **Google Sign-In Check:** Session is checked on launch. If no signed-in session exists, a blocking, non-dismissible Google Sign-In modal is rendered.
2. **Customer Gemini API Key Validation:** Once signed in with Google, if no valid customer-supplied Gemini key exists in session memory, the mandatory Gemini Key Setup screen is rendered. The shared Firebase config key is strictly rejected.
3. **App Access:** Only unlocked when both Google session and validated customer key are active. Sign-out clears the key and locks the app immediately.
