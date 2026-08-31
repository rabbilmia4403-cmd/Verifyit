const isPlaceholder = (value: string) => value.startsWith("YOUR_");

export const ADMOB_BANNER_UNIT_ID =
  process.env["EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID"] ??
  (__DEV__ ? "ca-app-pub-3940256099942544/6300978111" : "YOUR_ADMOB_UNIT_ID");

export const ADMOB_INTERSTITIAL_UNIT_ID =
  process.env["EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID"] ??
  (__DEV__ ? "ca-app-pub-3940256099942544/1033173712" : "YOUR_ADMOB_UNIT_ID");

export { isPlaceholder };