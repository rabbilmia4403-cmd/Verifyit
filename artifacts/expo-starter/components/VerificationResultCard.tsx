import { Feather } from '@expo/vector-icons';
import type { VerifyResult } from '@workspace/api-client-react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

type VerificationResultCardProps = {
  result: VerifyResult;
};

export function VerificationResultCard({ result }: VerificationResultCardProps) {
  const colors = useColors();
  const isPositive = result.status === 'real' || result.status === 'safe';
  const isNegative = result.status === 'fake' || result.status === 'unsafe';
  const resultColor = isPositive
    ? colors.secondaryForeground
    : isNegative
      ? colors.destructive
      : colors.accentForeground;
  const resultSurface = isPositive
    ? colors.secondary
    : isNegative
      ? colors.destructiveForeground
      : colors.accent;
  const icon = isPositive ? 'check-circle' : isNegative ? 'alert-triangle' : 'help-circle';
  const eyebrow = result.kind === 'link' ? 'LINK SAFETY' : 'CONTENT CHECK';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: resultSurface }]}>
          <Feather name={icon} size={22} color={resultColor} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>{eyebrow}</Text>
          <Text style={[styles.title, { color: colors.cardForeground }]}>{result.title}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: resultSurface }]}>
          <Text style={[styles.statusText, { color: resultColor }]}>
            {result.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[styles.explanation, { color: colors.cardForeground }]}>
        {result.explanation}
      </Text>

      {result.matchedThreats && result.matchedThreats.length > 0 && (
        <View style={[styles.threats, { borderTopColor: colors.border }]}>
          <Text style={[styles.threatLabel, { color: colors.mutedForeground }]}>
            DETECTED SIGNALS
          </Text>
          <Text style={[styles.threatText, { color: colors.destructive }]}>
            {result.matchedThreats.join(' · ')}
          </Text>
        </View>
      )}

      <View style={[styles.checkedRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.checkedLabel, { color: colors.mutedForeground }]}>
          CHECKED
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={[styles.checkedValue, { color: colors.mutedForeground }]}
        >
          {result.checkedValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 17,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  headerCopy: {
    flex: 1,
    marginLeft: 12,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
    marginTop: 4,
  },
  statusPill: {
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  statusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.7,
  },
  explanation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 18,
  },
  threats: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 13,
  },
  threatLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.3,
  },
  threatText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 6,
  },
  checkedRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 13,
  },
  checkedLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.2,
    marginRight: 9,
  },
  checkedValue: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
});