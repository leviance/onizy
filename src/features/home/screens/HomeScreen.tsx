import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  BottomNavigation,
  BrandArtwork,
  Button,
  Card,
  DeckCard,
  Dialog,
  FilterChip,
  IconButton,
  SectionHeading,
  StateView,
  StatCard,
  Sparkle,
  colors,
  layout,
  spacing,
  useResponsiveLayout,
  useScrollNavigation,
} from '@/design-system';
import type { NavigationKey } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useTranslation } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';

import { DailyGoalCard } from '../components/DailyGoalCard';
import { HomeArtwork } from '../components/HomeArtwork';
import { HomeBackdrop } from '../components/HomeBackdrop';
import { HorizontalGroup } from '../components/HorizontalGroup';
import { SearchField } from '../components/SearchField';
import { ToolCard } from '../components/ToolCard';
import { TopicTile } from '../components/TopicTile';
import { buildHomeData } from '../model/home-data';
import { topics } from '../model/sample';
import type { HomeDeck } from '../model/sample';
import { filterDecks } from '../model/search';

type HomeScreenProps = {
  learningDecks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  onOpenStudy: (deckId: string, mode: 'flashcard' | 'quiz') => void;
  onMainNavigate: (key: NavigationKey) => void;
};
type Notice = 'notifications' | 'ai' | 'import';
const noticeCopy: Record<Notice, { title: TranslationKey; body: TranslationKey }> = {
  notifications: { title: 'home.notifications', body: 'home.noNotifications' },
  ai: { title: 'home.aiTitle', body: 'home.aiNotice' },
  import: { title: 'home.importTitle', body: 'home.importNotice' },
};

export function HomeScreen({
  learningDecks,
  records,
  schedules,
  onOpenStudy,
  onMainNavigate,
}: HomeScreenProps) {
  const { t, formatNumber, formatPercent } = useTranslation();
  const { wide, compact, largeText, gutter } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const now = useCurrentTime();
  const scroll = useRef<ScrollView>(null);
  const navigation = useScrollNavigation();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [allDecksOpen, setAllDecksOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const searching = Boolean(query.trim() || topic);
  const data = buildHomeData({
    development: __DEV__,
    decks: learningDecks,
    records,
    schedules,
    now,
    translate: t,
  });
  const localizedDecks = data.decks;
  const dailyGoal = data.dailyGoal;
  const decks = searching ? filterDecks(localizedDecks, query, topic) : localizedDecks.slice(0, 2);
  const chooseTopic = (id: string | null) => {
    setTopic(id);
    setFiltersOpen(false);
    scroll.current?.scrollTo({ y: 0, animated: !reducedMotion });
  };
  const openStudy = (id: string, mode: 'flashcard' | 'quiz' = 'flashcard') => {
    setAllDecksOpen(false);
    setNotice(null);
    onOpenStudy(id, mode);
  };
  const navigate = (key: NavigationKey) => {
    if (key === 'home') scroll.current?.scrollTo({ y: 0, animated: !reducedMotion });
    else onMainNavigate(key);
  };
  const deckCard = (deck: HomeDeck, condensed = false) =>
    deck.studyMode === 'quiz' ? (
      <Card style={styles.quizDeck}>
        <View style={styles.quizHeading}>
          <HomeArtwork name={deck.artwork} size={48} />
          <View style={styles.quizContent}>
            <AppText variant="label" accessibilityRole="header">
              {deck.title}
            </AppText>
            <AppText variant="bodySmall" tone="secondary">
              {deck.subject}
            </AppText>
          </View>
        </View>
        <AppText variant="bodySmall" tone="secondary">
          {t('common.questions', { count: deck.questionCount })}
        </AppText>
        <Button
          label={t('learning.startQuiz')}
          accessibilityLabel={`${t('learning.startQuiz')}: ${deck.title}`}
          variant="tinted"
          trailingIcon="chevron"
          onPress={() => openStudy(deck.id, 'quiz')}
        />
      </Card>
    ) : (
      <DeckCard
        title={deck.title}
        subject={deck.subject}
        cardCount={deck.cardCount}
        dueCount={deck.dueCount}
        progress={deck.progress}
        tone={deck.tone}
        compact={condensed}
        appearance="expressive"
        artwork={<HomeArtwork name={deck.artwork} size={condensed ? 44 : 56} />}
        onOpen={() => openStudy(deck.id, deck.studyMode)}
      />
    );
  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <Animated.ScrollView
        ref={scroll}
        testID="home-scroll"
        onScroll={navigation.onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: gutter,
            paddingTop: Math.max(insets.top, spacing['3xl']),
            paddingBottom: navigation.bottomPadding,
          },
        ]}
      >
        {!largeText ? <HomeBackdrop /> : null}
        <View style={styles.header}>
          {!largeText ? (
            <View aria-hidden>
              <BrandArtwork variant="mascot" width={compact ? 54 : 70} />
            </View>
          ) : null}
          <View style={styles.welcome}>
            <View style={styles.greeting}>
              <AppText variant="h3" accessibilityRole="header" style={styles.greetingText}>
                {t('home.greeting')}
              </AppText>
              {!largeText ? <Sparkle size={18} /> : null}
            </View>
            <AppText variant="bodySmall" tone="secondary">
              {t('home.prompt')}
            </AppText>
          </View>
          <IconButton
            icon="bell"
            label={t('home.notifications')}
            onPress={() => setNotice('notifications')}
          />
        </View>
        <View style={styles.searchGroup}>
          <SearchField value={query} onChange={setQuery} onFilter={() => setFiltersOpen(true)} />
          {topic ? (
            <View style={styles.filterRow}>
              <FilterChip
                label={t('common.all')}
                selected={false}
                onPress={() => chooseTopic(null)}
              />
              <AppText variant="bodySmall" tone="secondary" style={styles.selectedTopic}>
                {t(topics.find((item) => item.id === topic)?.label ?? 'common.all')}
              </AppText>
            </View>
          ) : null}
        </View>
        {!searching && dailyGoal ? (
          <DailyGoalCard {...dailyGoal} onContinue={() => openStudy(dailyGoal.deckId)} />
        ) : null}
        <View style={styles.section}>
          <SectionHeading
            title={t(searching ? 'home.searchResults' : 'home.reviewSection')}
            accent="orange"
            {...(localizedDecks.length ? { onViewAll: () => setAllDecksOpen(true) } : {})}
          />
          {decks.length ? (
            <View style={[styles.deckList, wide && styles.deckGrid]}>
              {decks.map((deck) => (
                <View key={deck.id} style={wide ? styles.half : undefined}>
                  {deckCard(deck)}
                </View>
              ))}
            </View>
          ) : (
            <StateView
              status="empty"
              title={t(localizedDecks.length ? 'home.noResults' : 'library.emptyTitle')}
              message={t(localizedDecks.length ? 'home.noResultsBody' : 'library.emptyDescription')}
              actionLabel={t(localizedDecks.length ? 'common.clear' : 'library.create')}
              onAction={() => {
                if (!localizedDecks.length) onMainNavigate('create');
                else {
                  setQuery('');
                  setTopic(null);
                }
              }}
            />
          )}
        </View>
        <View style={styles.section}>
          <SectionHeading title={t('home.topicsSection')} onViewAll={() => setFiltersOpen(true)} />
          <View style={styles.topicGrid}>
            {topics.map((item) => (
              <View
                key={item.id}
                style={largeText ? styles.full : wide ? styles.third : styles.half}
              >
                <TopicTile
                  label={t(item.label)}
                  icon={item.icon}
                  tone={item.tone}
                  selected={topic === item.id}
                  onPress={() => chooseTopic(topic === item.id ? null : item.id)}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <SectionHeading title={t('home.toolsSection')} accent="orange" />
          <HorizontalGroup wide={wide}>
            <View style={wide ? styles.half : { width: compact ? 222 : 244 }}>
              <ToolCard kind="ai" onPress={() => setNotice('ai')} />
            </View>
            <View style={wide ? styles.half : { width: compact ? 222 : 244 }}>
              <ToolCard kind="import" onPress={() => setNotice('import')} />
            </View>
          </HorizontalGroup>
        </View>
        <View style={styles.section}>
          <SectionHeading title={t('home.activitySection')} accent="yellow" />
          <HorizontalGroup wide={wide}>
            <View style={wide ? styles.third : styles.stat}>
              <StatCard
                label={t('home.studied')}
                value={formatNumber(data.activity.cards)}
                icon="decks"
                tone="green"
                appearance="expressive"
              />
            </View>
            <View style={wide ? styles.third : styles.stat}>
              <StatCard
                label={t('home.quizzes')}
                value={formatNumber(data.activity.quizzes)}
                icon="target"
                tone="orange"
                appearance="expressive"
              />
            </View>
            <View style={wide ? styles.third : styles.stat}>
              <StatCard
                label={t('home.accuracy')}
                value={
                  data.activity.accuracy === null ? '—' : formatPercent(data.activity.accuracy)
                }
                icon="chart"
                tone="blue"
                appearance="expressive"
              />
            </View>
          </HorizontalGroup>
        </View>
        {localizedDecks.length > 2 ? (
          <View style={styles.section}>
            <SectionHeading
              title={t('home.recentSection')}
              onViewAll={() => setAllDecksOpen(true)}
            />
            <HorizontalGroup wide={wide}>
              {localizedDecks.slice(2).map((deck) => (
                <View key={deck.id} style={wide ? styles.half : { width: compact ? 236 : 270 }}>
                  {deckCard(deck, true)}
                </View>
              ))}
            </HorizontalGroup>
          </View>
        ) : null}
      </Animated.ScrollView>
      <BottomNavigation
        active="home"
        visible={navigation.visible}
        hideProgress={navigation.hideProgress}
        appearance="expressive"
        onNavigate={navigate}
        onHeightChange={navigation.onNavigationHeightChange}
      />
      <Dialog visible={filtersOpen} title={t('home.filters')} onClose={() => setFiltersOpen(false)}>
        <View style={styles.chips}>
          <FilterChip label={t('common.all')} selected={!topic} onPress={() => chooseTopic(null)} />
          {topics.map((item) => (
            <FilterChip
              key={item.id}
              label={t(item.label)}
              selected={topic === item.id}
              onPress={() => chooseTopic(item.id)}
            />
          ))}
        </View>
      </Dialog>
      <Dialog
        visible={allDecksOpen}
        title={t('nav.library')}
        onClose={() => setAllDecksOpen(false)}
      >
        {localizedDecks.map((deck) => (
          <View key={deck.id}>{deckCard(deck, true)}</View>
        ))}
      </Dialog>
      {notice ? (
        <Dialog
          visible
          title={t(noticeCopy[notice].title)}
          message={t(noticeCopy[notice].body)}
          onClose={() => setNotice(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.explore.canvas },
  content: {
    width: '100%',
    maxWidth: layout.homeMaxWidth,
    alignSelf: 'center',
    gap: spacing['2xl'],
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  welcome: { flex: 1, gap: spacing.xs },
  greeting: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
  greetingText: { flexShrink: 1 },
  searchGroup: { gap: spacing.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  selectedTopic: { flexShrink: 1 },
  section: { gap: spacing.lg },
  deckList: { gap: spacing.md },
  deckGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  half: { width: '46%', flexGrow: 1 },
  third: { width: '31%', flexGrow: 1 },
  full: { width: '100%' },
  stat: { width: 144 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quizDeck: { borderColor: colors.border.subtle, borderWidth: 1 },
  quizHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  quizContent: { flex: 1, minWidth: 0, gap: spacing.xs },
});
