import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { ADMOB_BANNER_UNIT_ID, isPlaceholder } from '@/constants/config';

type NativeAdsModule = {
  BannerAd: React.ComponentType<{
    unitId: string;
    size: string;
    requestOptions?: { requestNonPersonalizedAdsOnly?: boolean };
  }>;
  BannerAdSize: { BANNER: string };
};

function loadNativeAds(): NativeAdsModule | null {
  try {
    return require('react-native-google-mobile-ads') as NativeAdsModule;
  } catch {
    return null;
  }
}

export function AdBanner() {
  const colors = useColors();
  const [nativeAds, setNativeAds] = useState<NativeAdsModule | null>(null);

  useEffect(() => {
    setNativeAds(loadNativeAds());
  }, []);

  if (!nativeAds || isPlaceholder(ADMOB_BANNER_UNIT_ID)) {
    return (
      <View style={[styles.fallback, { borderColor: colors.border }]}>
        <Text style={[styles.fallbackLabel, { color: colors.mutedForeground }]}>
          AD SPACE
        </Text>
        <Text style={[styles.fallbackText, { color: colors.mutedForeground }]}>
          Your banner appears here in the native build
        </Text>
      </View>
    );
  }

  const { BannerAd, BannerAdSize } = nativeAds;
  return (
    <View style={styles.banner}>
      <BannerAd
        unitId={ADMOB_BANNER_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    minHeight: 50,
  },
  fallback: {
    alignItems: 'center',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 18,
    width: '100%',
  },
  fallbackLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.4,
  },
  fallbackText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginTop: 4,
  },
});