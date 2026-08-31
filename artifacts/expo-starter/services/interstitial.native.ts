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
  AdEventType: {
    CLOSED: string;
    ERROR: string;
    LOADED: string;
  };
};

export function showInterstitial(): Promise<boolean> {
  if (isPlaceholder(ADMOB_INTERSTITIAL_UNIT_ID)) return Promise.resolve(false);

  try {
    const ads = require('react-native-google-mobile-ads') as NativeInterstitialModule;
    const interstitial = ads.InterstitialAd.createForAdRequest(
      ADMOB_INTERSTITIAL_UNIT_ID,
      { requestNonPersonalizedAdsOnly: true },
    );

    return new Promise((resolve) => {
      let settled = false;
      let timeout: ReturnType<typeof setTimeout> | undefined;
      let unsubscribeLoaded = () => {};
      let unsubscribeError = () => {};
      let unsubscribeClosed = () => {};

      const finish = (shown: boolean) => {
        if (settled) return;
        settled = true;
        if (timeout) clearTimeout(timeout);
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
        resolve(shown);
      };

      unsubscribeLoaded = interstitial.addAdEventListener(
        ads.AdEventType.LOADED,
        () => {
          try {
            void interstitial.show().catch(() => finish(false));
          } catch {
            finish(false);
          }
        },
      );
      unsubscribeError = interstitial.addAdEventListener(
        ads.AdEventType.ERROR,
        () => finish(false),
      );
      unsubscribeClosed = interstitial.addAdEventListener(
        ads.AdEventType.CLOSED,
        () => finish(true),
      );

      timeout = setTimeout(() => finish(false), 12000);
      try {
        interstitial.load();
      } catch {
        finish(false);
      }
    });
  } catch {
    // Expo Go does not include the native AdMob module; the app remains usable.
    return Promise.resolve(false);
  }
}