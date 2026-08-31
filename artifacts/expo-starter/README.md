# Signal

Signal is an Expo React Native fact-checking and link-safety app. It sends text claims to Gemini and URLs to Google Safe Browsing through the shared API server, so provider keys never live in the mobile bundle.

## Provider setup

Add these values as server-side Replit Secrets:

- `GEMINI_API_KEY` — a Google Gemini API key with Generative Language API access
- `SAFE_BROWSING_API_KEY` — a Google Safe Browsing API key

The placeholders are intentionally shown in `.env.example` as `YOUR_GEMINI_API_KEY` and `YOUR_SAFE_BROWSING_API_KEY`. The server returns a clear configuration error until real values are present.

## AdMob setup

The app includes `react-native-google-mobile-ads` with the official Google test app IDs in `app.json`. The app uses Google test banner and interstitial units during development.

Before shipping a native build:

1. Replace the test iOS and Android app IDs in `app.json` with your AdMob app IDs.
2. Set `EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID` and `EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID` to your production unit IDs.
3. Build a development client or AAB; plain Expo Go does not include the native AdMob module and will show the safe ad placeholder instead.

## Build profiles

`eas.json` includes:

- `development` for an internal development client
- `preview` for an Android APK
- `production` for an Android AAB