export async function showInterstitial(): Promise<boolean> {
  // AdMob is a native-only module. Web keeps the verification flow uninterrupted.
  return false;
}