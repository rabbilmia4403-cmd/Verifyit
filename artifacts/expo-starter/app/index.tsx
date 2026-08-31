import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
  icon: keyof typeof Feather.glyphMap;
};

const checklist: ChecklistItem[] = [
  {
    id: 'scaffold',
    label: 'Expo scaffold',
    detail: 'Routing, fonts, and safe areas are ready',
    icon: 'layers',
  },
  {
    id: 'native',
    label: 'Native-friendly UI',
    detail: 'Built for touch, motion, and small screens',
    icon: 'smartphone',
  },
  {
    id: 'idea',
    label: 'Your next idea',
    detail: 'Swap this screen for your product direction',
    icon: 'edit-3',
  },
];

const STORAGE_KEY = '@expo-starter/checklist';

export default function HomeScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [completed, setCompleted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (isMounted && value) {
          setCompleted(JSON.parse(value) as string[]);
        }
      })
      .catch(() => {
        // The starter remains usable when local storage is unavailable.
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const progress = useMemo(
    () => Math.round((completed.length / checklist.length) * 100),
    [completed.length],
  );

  const toggleItem = async (id: string) => {
    await Haptics.selectionAsync();
    const next = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];

    setCompleted(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const startBuilding = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowNudge(true);
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
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 28,
            backgroundColor: colors.background,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={[styles.brandMark, { borderColor: colors.brandOutline }]}>
            <View style={[styles.brandMarkInner, { backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.topBarText}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              EXPO STARTER
            </Text>
            <Text style={[styles.date, { color: colors.foreground }]}>
              Monday, ready to ship
            </Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: colors.secondary }]}>
            <View style={[styles.statusDotInner, { backgroundColor: colors.primary }]} />
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.kicker, { color: colors.primary }]}>A fresh canvas</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Your next build{'\n'}
            <Text style={{ color: colors.primary }}>starts here.</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A thoughtfully wired mobile foundation for turning a good idea into
            something people can tap, feel, and keep.
          </Text>
        </View>

        <LinearGradient
          colors={[colors.progressDark, colors.progressDarkAlt]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressCardHeader}>
            <View>
              <Text style={[styles.progressEyebrow, { color: colors.onDarkMuted }]}>
                BUILD MOMENTUM
              </Text>
              <Text style={[styles.progressTitle, { color: colors.onDark }]}>
                Everything is in place.
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator color="#FFFDFC" />
            ) : (
              <Text style={[styles.progressPercent, { color: colors.onDark }]}>
                {progress}%
              </Text>
            )}
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.onDarkTrack }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(progress, 8)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressHint, { color: colors.onDarkMuted }]}>
            Tap through the checklist to make this starter yours.
          </Text>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Your launch checklist
          </Text>
          <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
            {completed.length}/{checklist.length}
          </Text>
        </View>

        <View
          style={[
            styles.checklistCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {checklist.map((item, index) => {
            const isComplete = completed.includes(item.id);

            return (
              <Pressable
                key={item.id}
                onPress={() => toggleItem(item.id)}
                testID={`checklist-${item.id}`}
                style={({ pressed }) => [
                  styles.checklistRow,
                  index !== checklist.length - 1 && [
                    styles.rowBorder,
                    { borderBottomColor: colors.border },
                  ],
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.itemIcon,
                    {
                      backgroundColor: isComplete ? colors.secondary : colors.accent,
                    },
                  ]}
                >
                  <Feather
                    name={isComplete ? 'check' : item.icon}
                    size={17}
                    color={isComplete ? colors.secondaryForeground : colors.accentForeground}
                  />
                </View>
                <View style={styles.itemCopy}>
                  <Text
                    style={[
                      styles.itemLabel,
                      { color: colors.cardForeground },
                      isComplete && styles.itemLabelComplete,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={[styles.itemDetail, { color: colors.mutedForeground }]}>
                    {item.detail}
                  </Text>
                </View>
                <Feather
                  name={isComplete ? 'check-circle' : 'circle'}
                  size={21}
                  color={isComplete ? colors.primary : colors.border}
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={startBuilding}
          testID="start-building"
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
            Start building
          </Text>
          <Feather name="arrow-up-right" size={19} color={colors.primaryForeground} />
        </Pressable>

        {showNudge && (
          <View style={[styles.nudge, { backgroundColor: colors.secondary }]}>
            <Feather name="zap" size={16} color={colors.secondaryForeground} />
            <Text style={[styles.nudgeText, { color: colors.secondaryForeground }]}>
              Nice. Replace this screen with your first product idea.
            </Text>
            <Pressable
              onPress={() => setShowNudge(false)}
              testID="dismiss-nudge"
              hitSlop={12}
            >
              <Feather name="x" size={17} color={colors.secondaryForeground} />
            </Pressable>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Made for ideas that deserve a first tap.
          </Text>
          <Feather name="heart" size={14} color={colors.primary} />
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
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 42,
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
    width: 38,
  },
  brandMarkInner: {
    borderRadius: 6,
    height: 18,
    transform: [{ rotate: '18deg' }],
    width: 18,
  },
  topBarText: {
    flex: 1,
    marginLeft: 12,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.7,
  },
  date: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 3,
  },
  statusDot: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  statusDotInner: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  hero: {
    marginBottom: 28,
  },
  kicker: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 0.4,
    marginBottom: 13,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 39,
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 18,
    maxWidth: 350,
  },
  progressCard: {
    borderRadius: 22,
    marginBottom: 32,
    padding: 21,
  },
  progressCardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressEyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.6,
  },
  progressTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    marginTop: 7,
  },
  progressPercent: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  progressTrack: {
    borderRadius: 5,
    height: 7,
    marginTop: 26,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 5,
    height: '100%',
  },
  progressHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  sectionCount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  checklistCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 19,
    overflow: 'hidden',
  },
  checklistRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 77,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  pressed: {
    opacity: 0.72,
  },
  itemIcon: {
    alignItems: 'center',
    borderRadius: 11,
    height: 38,
    justifyContent: 'center',
    marginRight: 12,
    width: 38,
  },
  itemCopy: {
    flex: 1,
    paddingRight: 10,
  },
  itemLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  itemLabelComplete: {
    textDecorationLine: 'line-through',
  },
  itemDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.985 }],
  },
  primaryButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    marginRight: 9,
  },
  nudge: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  nudgeText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 17,
    marginHorizontal: 9,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginRight: 6,
  },
});