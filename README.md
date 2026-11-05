<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# World Within Engine

A structured system builder for defining internal world logic, visual systems, and narrative engines without automated generation.

View your app in AI Studio: https://ai.studio/apps/5223736b-7fa2-475f-9a2a-aa8d14924bf2

## Multi-App Suite & Shared Firebase Setup

World Within is part of the 4-app suite sharing a centralized Firebase project (`gen-lang-client-0315983382`) with dedicated Firestore databases:

1. **Signal States**: `signalarchiveapp.netlify.app`
2. **Recognition Engine**: `the-recognition-engine-app.netlify.app`
3. **World Within**: `worldwithinappbuildyourworld.netlify.app` (Database: `ai-studio-5223736b-7fa2-475f-9a2a-aa8d14924bf2`)
4. **Imprint Creator Audit**: `imprintcreatoraudit.netlify.app` (Database: `ai-studio-imprintaudit-4ef4e870-6e35-478f-bd43-bc366d967125`)

For complete domain authorization, reCAPTCHA Enterprise key allowlists, App Check setup, and Netlify deployment instructions, see [SHARED_FIREBASE_NETLIFY_SETUP.md](./SHARED_FIREBASE_NETLIFY_SETUP.md).

## Security & Verification Flow

1. **Google Sign-In**: Mandatory authentication via Firebase Google Auth.
2. **Firebase App Check**: ReCaptchaEnterpriseProvider (`6LdbxxAuAAAAANT42qF9TqaGec6Qya8CeBW-SOh6`) initialized before all Auth/Firestore requests.
3. **Customer Gemini API Key**: Customer-supplied Gemini key validated and held in session memory only (never written to disk or database).
4. **Database Isolation**: Dedicated Firestore instance `ai-studio-5223736b-7fa2-475f-9a2a-aa8d14924bf2` with user-scoped ABAC rules.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the full-stack development server:
   `npm run dev`
3. Build for production:
   `npm run build`
