import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function AdBanner() {
  const colors = useColors();
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

const styles = StyleSheet.create({
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