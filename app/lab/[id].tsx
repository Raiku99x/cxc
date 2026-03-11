// ─────────────────────────────────────────────────────────────
// app/lab/[id].tsx — Lab Editor Screen
// Converted from: openLab(), btn-submit, btn-cast in app.js
// Full-screen modal: problem selector, code editor, test cases
//
// NOTE: CodeMirror (web) is replaced with a React Native
// TextInput styled as a code editor. On web via Expo, you
// could swap this for a WebView with CodeMirror.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLabsAndQuizzes } from '../../src/hooks/useLabsAndQuizzes';
import { useLabSubmission } from '../../src/hooks/useLabSubmission';
import {
  ThemedText,
  Button,
  Badge,
  Loading,
  EmptyState,
  CongratsModal,
} from '../../src/components';
import { RankUpPopup } from '../../src/components/RankDisplay';
import { ConfirmModal } from '../../src/components/Modal';
import { DIFFICULTY_CONFIG } from '../../src/utils/constants';
import type { Problem } from '../../src/utils/types';

export default function LabScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { labs, isLoading } = useLabsAndQuizzes();

  const lab = useMemo(() => labs.find((l: any) => l.id === id), [labs, id]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [code, setCode]           = useState('');
  const [showExit, setShowExit]   = useState(false);
  const [tcResults, setTcResults] = useState<any[] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    pendingRankUp,
    clearRankUp,
    submitSolution,
    isRunning,
    error,
  } = useLabSubmission();

  if (isLoading) return <Loading text="Opening lab…" />;
  if (!lab) return <EmptyState icon="◈" message="Lab not found." />;

  const problems: Problem[] = (lab as any).problems ?? [];
  const problem = problems[activeIdx];
  const diff = problem?.difficulty as keyof typeof DIFFICULTY_CONFIG;
  const diffConfig = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.medium;

  const handleSubmit = async () => {
    if (!problem || !lab) return;
    await submitSolution(code, problem, lab as any);
    setSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowExit(true)} style={styles.backBtn}>
          <ThemedText variant="mono" size={11} color="#607860">✕  Exit</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="display" size={15} color="#141f14" style={styles.headerTitle} numberOfLines={1}>
          {(lab as any).title}
        </ThemedText>
        <ThemedText variant="caption" color="#607860">
          {problems.length} problems
        </ThemedText>
      </View>

      {/* ── Problem tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.probTabs}
        contentContainerStyle={styles.probTabsContent}
      >
        {problems.map((p, i) => (
          <TouchableOpacity
            key={p.id ?? i}
            onPress={() => { setActiveIdx(i); setCode(''); setTcResults(null); setSubmitted(false); }}
            style={[styles.probTab, activeIdx === i && styles.probTabActive]}
          >
            <ThemedText variant="label" color={activeIdx === i ? '#1a6b30' : '#607860'}>
              {i + 1}. {p.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {problem && (
          <>
            {/* Problem header */}
            <View style={styles.probHeader}>
              <View style={styles.probTitleRow}>
                <ThemedText variant="body" size={16} bold color="#141f14" style={{ flex: 1 }}>
                  {problem.title}
                </ThemedText>
                <Badge label={diffConfig.label} variant={diff as any} />
              </View>
              <ThemedText variant="body" color="#607860" size={13} style={styles.probDesc}>
                {problem.description}
              </ThemedText>
              {/* Points */}
              <View style={styles.probMeta}>
                <Badge label={`${problem.points ?? 0} pts`} variant="gold" />
                <Badge label={`Pass: ${problem.passingPercent ?? 60}%`} variant="muted" />
              </View>
            </View>

            {/* ── Code editor ── */}
            <View style={styles.editorWrap}>
              <View style={styles.editorHeader}>
                <ThemedText variant="label" color="#607860">Python</ThemedText>
                <TouchableOpacity onPress={() => setCode('')}>
                  <ThemedText variant="label" color="#b02020">Clear</ThemedText>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.editor}
                value={code}
                onChangeText={setCode}
                multiline
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
                placeholder={"# Write your solution here\n"}
                placeholderTextColor="#9a8a68"
                textAlignVertical="top"
              />
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <ThemedText variant="mono" size={11} color="#b02020">{error}</ThemedText>
              </View>
            ) : null}

            {/* Test results */}
            {tcResults && (
              <View style={styles.tcSection}>
                <ThemedText variant="label" color="#607860" style={styles.tcTitle}>
                  Test Cases  {tcResults.filter(r => r.pass).length}/{tcResults.length} passed
                </ThemedText>
                {tcResults.map((tc, i) => (
                  <View key={i} style={[styles.tcRow, tc.pass ? styles.tcPass : styles.tcFail]}>
                    <Badge label={tc.pass ? 'Pass' : 'Fail'} variant={tc.pass ? 'pass' : 'fail'} />
                    <ThemedText variant="caption" style={{ flex: 1 }}>
                      {tc.label ?? `Test ${i + 1}`}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                label="▶ Cast"
                onPress={() => {/* run custom input */}}
                variant="ghost"
                size="md"
                style={{ flex: 1 }}
              />
              <Button
                label={isRunning ? 'Running…' : '◈ Run Tests'}
                onPress={() => {/* run all test cases */}}
                variant="emerald"
                loading={isRunning}
                size="md"
                style={{ flex: 1 }}
              />
              <Button
                label="✓ Submit"
                onPress={handleSubmit}
                variant="gold"
                disabled={!code.trim()}
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Modals ── */}
      <ConfirmModal
        visible={showExit}
        onCancel={() => setShowExit(false)}
        onConfirm={() => { setShowExit(false); router.back(); }}
        title="Exit Lab?"
        message="Your current solution will not be saved."
        confirmLabel="Exit"
        cancelLabel="Stay"
        danger
        icon="◈"
      />

      <CongratsModal
        visible={submitted}
        pts={0}
        maxPts={problem?.points ?? 0}
        trialsCount={problem?.testCases?.length ?? 0}
        onRetake={() => { setSubmitted(false); setCode(''); setTcResults(null); }}
        onHall={() => router.back()}
      />

      <RankUpPopup
        visible={!!pendingRankUp}
        rankName={pendingRankUp?.name ?? ''}
        rankImg={pendingRankUp?.img ?? null}
        onClose={clearRankUp}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f9f4' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ebe0',
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  backBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e0ebe0',
    borderRadius: 4,
  },
  headerTitle: { flex: 1 },

  probTabs: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ebe0',
    maxHeight: 44,
  },
  probTabsContent: { paddingHorizontal: 12, gap: 4, alignItems: 'center', paddingVertical: 6 },
  probTab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  probTabActive: {
    borderColor: '#9ecfb0',
    backgroundColor: '#e8f5ec',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 32, gap: 14 },

  probHeader: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ebe0',
    borderRadius: 10,
    padding: 16,
    gap: 10,
  },
  probTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  probDesc: { lineHeight: 20 },
  probMeta: { flexDirection: 'row', gap: 6 },

  editorWrap: {
    backgroundColor: '#1e2818',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2e3a28',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2e3a28',
  },
  editor: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 13,
    color: '#c8d8b8',
    padding: 14,
    minHeight: 200,
    lineHeight: 22,
  },

  errorBox: {
    backgroundColor: 'rgba(176,32,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(176,32,32,0.3)',
    borderRadius: 4,
    padding: 10,
  },

  tcSection: { gap: 6 },
  tcTitle: { marginBottom: 4 },
  tcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  tcPass: { backgroundColor: '#e8f5ec', borderColor: '#9ecfb0' },
  tcFail: { backgroundColor: '#fdf0f0', borderColor: '#e0a8a8' },

  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
});
