import { ADMOB_INTERSTITIAL_UNIT_ID, isPlaceholder } from '@/constants/config';

type NativeInterstitialModule = {
  InterstitialAd: {
    createForAdRequest: (
      unitId: string,
      options?: { requestNonPersonalizedAdsOnly?: boolean },
    ) => {
      addAdEventListener: (event: string, listener: () => void) => () => void;
      load: () => void;
      show: () => Promise<void>;
    };
  };
  AdEventType: { LOADED: string };
};

export function showInterstitial() {
  if (isPlaceholder(ADMOB_INTERSTITIAL_UNIT_ID)) return;

  try {
    const ads = require('react-native-google-mobile-ads') as NativeInterstitialModule;
    const interstitial = ads.InterstitialAd.createForAdRequest(
      ADMOB_INTERSTITIAL_UNIT_ID,
      { requestNonPersonalizedAdsOnly: true },
    );
    let hasShown = false;
    const unsubscribe = interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
      hasShown = true;
      void interstitial.show();
      unsubscribe();
    });
    interstitial.load();
    setTimeout(() => {
      if (!hasShown) unsubscribe();
    }, 12000);
  } catch {
    // Expo Go does not include the native AdMob module; the app remains usable.
  }
}