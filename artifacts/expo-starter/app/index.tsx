import { useVerifyInput, type VerifyResult } from '@workspace/api-client-react';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdBanner } from '@/components/AdBanner';
import { VerificationResultCard } from '@/components/VerificationResultCard';
import { useColors } from '@/hooks/useColors';
import { showInterstitial } from '@/services/interstitial';

function looksLikeUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

export default function HomeScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const verifyMutation = useVerifyInput();

  const inputType = useMemo(() => {
    if (!input.trim()) return 'TEXT OR LINK';
    return looksLikeUrl(input) ? 'LINK DETECTED' : 'CLAIM DETECTED';
  }, [input]);

  const verify = async () => {
    const value = input.trim();
    if (value.length < 3 || isChecking || verifyMutation.isPending) return;

    await Haptics.selectionAsync();
    setResult(null);
    setErrorMessage(null);
    setIsChecking(true);

    try {
      const nextResult = await verifyMutation.mutateAsync({ data: { input: value } });
      await showInterstitial();
      setResult(nextResult);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.replace(/^HTTP \d+ [^:]+:\s*/i, '')
          : 'We could not complete this check. Try again.';
      setErrorMessage(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
              <Feather name="shield" size={18} color={colors.primaryForeground} />
            </View>
            <View>
              <Text style={[styles.brandName, { color: colors.foreground }]}>
                SIGNAL
              </Text>
              <Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>
                Truth, with context
              </Text>
            </View>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: colors.secondary }]}>
            <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.headerBadgeText, { color: colors.secondaryForeground }]}>
              READY
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>CHECK BEFORE YOU SHARE</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Is it real, or{'\n'}
            <Text style={{ color: colors.primary }}>just noise?</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Paste a claim, headline, message, or link. We’ll check the signal
            and give you the context to decide what comes next.
          </Text>
        </View>

        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.inputHeader}>
            <Text style={[styles.inputLabel, { color: colors.cardForeground }]}>
              WHAT DO YOU WANT TO CHECK?
            </Text>
            <Text style={[styles.inputType, { color: colors.primary }]}>{inputType}</Text>
          </View>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Paste a link or type a claim..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={10000}
            textAlignVertical="top"
            testID="verification-input"
            style={[styles.textInput, { color: colors.cardForeground }]}
          />
          <View style={styles.inputFooter}>
            <Text style={[styles.characterCount, { color: colors.mutedForeground }]}>
              {input.length}/10,000
            </Text>
            {input.length > 0 && (
              <Pressable onPress={() => setInput('')} testID="clear-input" hitSlop={10}>
                <Feather name="x-circle" size={19} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        <Pressable
          onPress={verify}
          disabled={input.trim().length < 3 || isChecking || verifyMutation.isPending}
          testID="verify-button"
          style={({ pressed }) => [
            styles.verifyButton,
            {
              backgroundColor:
                input.trim().length < 3 ? colors.muted : colors.primary,
            },
            pressed && input.trim().length >= 3 && styles.buttonPressed,
          ]}
        >
          {isChecking || verifyMutation.isPending ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <>
              <Feather
                name="search"
                size={19}
                color={
                  input.trim().length < 3
                    ? colors.mutedForeground
                    : colors.primaryForeground
                }
              />
              <Text
                style={[
                  styles.verifyButtonText,
                  {
                    color:
                      input.trim().length < 3
                        ? colors.mutedForeground
                        : colors.primaryForeground,
                  },
                ]}
              >
                Verify now
              </Text>
            </>
          )}
        </Pressable>

        <View style={styles.providerRow}>
          <Feather name="lock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.providerText, { color: colors.mutedForeground }]}>
            Your check is sent securely to the verification service.
          </Text>
        </View>

        {errorMessage && (
          <View style={[styles.errorCard, { backgroundColor: colors.accent }]}>
            <Feather name="alert-circle" size={18} color={colors.accentForeground} />
            <Text style={[styles.errorText, { color: colors.accentForeground }]}>
              {errorMessage}
            </Text>
          </View>
        )}

        {result && <VerificationResultCard result={result} />}

        <View style={styles.adSection}>
          <AdBanner />
        </View>

        <View style={styles.footer}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Results are guidance, not a substitute for primary sources.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 21,
    paddingTop: 19,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  brandIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 37,
    justifyContent: 'center',
    marginRight: 10,
    width: 37,
  },
  brandName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: 2.2,
  },
  brandCaption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginTop: 2,
  },
  headerBadge: {
    alignItems: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveDot: {
    borderRadius: 4,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  headerBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.9,
  },
  hero: {
    marginBottom: 25,
    marginTop: 43,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.55,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 38,
    letterSpacing: -1.5,
    lineHeight: 43,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
    maxWidth: 350,
  },
  inputCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  inputHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  inputType: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.7,
  },
  textInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 112,
    paddingHorizontal: 0,
    paddingTop: 18,
  },
  inputFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  characterCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  verifyButton: {
    alignItems: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 56,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  verifyButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    marginLeft: 9,
  },
  providerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 13,
  },
  providerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginLeft: 6,
  },
  errorCard: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 17,
    padding: 13,
  },
  errorText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 9,
  },
  adSection: {
    marginTop: 26,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginLeft: 6,
  },
});