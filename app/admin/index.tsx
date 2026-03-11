// ─────────────────────────────────────────────────────────────
// app/admin/index.tsx — Admin Dashboard Screen
// Converted from: admin.html full page
// Guarded: only visible to isAdmin users
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useAdminData } from '../../src/hooks/useAdminData';
import { useAdminActions } from '../../src/hooks/useAdminActions';
import {
  ThemedText,
  Button,
  Badge,
  SectionCard,
  StatCard,
  Loading,
  EmptyState,
} from '../../src/components';
import { ConfirmModal } from '../../src/components/Modal';

type AdminTab = 'overview' | 'labs' | 'quizzes' | 'students' | 'submissions';

export default function AdminScreen() {
  const { isAdmin, profile } = useAuth();

  // Guard — non-admins should never reach here
  if (!isAdmin) {
    return (
      <View style={styles.root}>
        <EmptyState icon="⚙" message="Access denied." />
      </View>
    );
  }

  const {
    labs, quizzes, submissions, attempts, users, stats,
    maintenanceMode, isLoading, error, reload,
  } = useAdminData();

  const { toggleActive, deleteItem, setMaintenance, setUserExp, isBusy } = useAdminActions();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'lab' | 'quiz'; id: string; title: string } | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const TABS: { key: AdminTab; label: string }[] = [
    { key: 'overview',    label: 'Overview'    },
    { key: 'labs',        label: 'Labs'        },
    { key: 'quizzes',     label: 'Quizzes'     },
    { key: 'students',    label: 'Students'    },
    { key: 'submissions', label: 'Submissions' },
  ];

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <ThemedText variant="display" size={17} color="#141f14">Admin Panel</ThemedText>
          <ThemedText variant="caption" color="#607860">Slytherin Classroom</ThemedText>
        </View>
        <Button label="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
          >
            <ThemedText
              variant="label"
              color={activeTab === t.key ? '#1a6b30' : '#607860'}
              style={styles.tabLabel}
            >
              {t.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <Loading text="Loading admin data…" />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1a7a3c" />}
        >

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <>
              <View style={styles.statsRow}>
                <StatCard value={stats.totalUsers}       label="Students"    color="green" />
                <StatCard value={stats.totalSubmissions} label="Submissions"  color="teal" />
                <StatCard value={stats.totalAttempts}    label="Quiz Tries"   color="violet" />
              </View>
              <View style={styles.statsRow}>
                <StatCard value={stats.activeLabs}    label="Active Labs"    color="amber" />
                <StatCard value={stats.activeQuizzes} label="Active Quizzes" color="blue" />
              </View>

              {/* Maintenance toggle */}
              <SectionCard title="Settings">
                <View style={styles.settingRow}>
                  <View>
                    <ThemedText variant="body" size={13} color="#141f14">Maintenance Mode</ThemedText>
                    <ThemedText variant="caption">Locks access for non-admins</ThemedText>
                  </View>
                  <Button
                    label={maintenanceMode ? 'ON — Disable' : 'OFF — Enable'}
                    onPress={() => setMaintenance(!maintenanceMode)}
                    variant={maintenanceMode ? 'red' : 'ghost'}
                    size="sm"
                    loading={isBusy}
                  />
                </View>
              </SectionCard>
            </>
          )}

          {/* ── Labs ── */}
          {activeTab === 'labs' && (
            <SectionCard title="Labs" count={labs.length}>
              {labs.length === 0 ? (
                <EmptyState icon="◈" message="No labs uploaded" />
              ) : (
                <View style={styles.tableWrap}>
                  {labs.map((lab: any) => (
                    <View key={lab.id} style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="body" size={13} color="#141f14">{lab.title}</ThemedText>
                        <ThemedText variant="caption">{lab.problems?.length ?? 0} problems</ThemedText>
                      </View>
                      <Badge label={lab.active ? 'Active' : 'Hidden'} variant={lab.active ? 'pass' : 'muted'} />
                      <Button
                        label={lab.active ? 'Hide' : 'Show'}
                        onPress={() => toggleActive('lab', lab.id, lab.active)}
                        variant={lab.active ? 'ghost' : 'green'}
                        size="sm"
                        loading={isBusy}
                      />
                      <Button
                        label="Del"
                        onPress={() => setConfirmDelete({ type: 'lab', id: lab.id, title: lab.title })}
                        variant="red"
                        size="sm"
                      />
                    </View>
                  ))}
                </View>
              )}
            </SectionCard>
          )}

          {/* ── Quizzes ── */}
          {activeTab === 'quizzes' && (
            <SectionCard title="Quizzes" count={quizzes.length}>
              {quizzes.length === 0 ? (
                <EmptyState icon="✦" message="No quizzes uploaded" />
              ) : (
                <View style={styles.tableWrap}>
                  {quizzes.map((q: any) => (
                    <View key={q.id} style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="body" size={13} color="#141f14">{q.title}</ThemedText>
                        <ThemedText variant="caption">{q.questions?.length ?? 0} questions</ThemedText>
                      </View>
                      <Badge label={q.active ? 'Active' : 'Hidden'} variant={q.active ? 'pass' : 'muted'} />
                      <Button
                        label={q.active ? 'Hide' : 'Show'}
                        onPress={() => toggleActive('quiz', q.id, q.active)}
                        variant={q.active ? 'ghost' : 'green'}
                        size="sm"
                        loading={isBusy}
                      />
                      <Button
                        label="Del"
                        onPress={() => setConfirmDelete({ type: 'quiz', id: q.id, title: q.title })}
                        variant="red"
                        size="sm"
                      />
                    </View>
                  ))}
                </View>
              )}
            </SectionCard>
          )}

          {/* ── Students ── */}
          {activeTab === 'students' && (
            <SectionCard title="Students" count={users.length}>
              {users.length === 0 ? (
                <EmptyState icon="◆" message="No students yet" />
              ) : (
                <View style={styles.tableWrap}>
                  {users
                    .sort((a: any, b: any) => (b.exp ?? 0) - (a.exp ?? 0))
                    .map((u: any, i: number) => (
                      <View key={u.id} style={styles.tableRow}>
                        <ThemedText variant="mono" size={11} color="#607860" style={{ width: 22 }}>
                          {i + 1}
                        </ThemedText>
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="body" size={13} color="#141f14">{u.username}</ThemedText>
                          <ThemedText variant="caption">{u.exp ?? 0} EXP</ThemedText>
                        </View>
                      </View>
                    ))
                  }
                </View>
              )}
            </SectionCard>
          )}

          {/* ── Submissions ── */}
          {activeTab === 'submissions' && (
            <>
              <SectionCard title="Lab Submissions" count={submissions.length}>
                {submissions.length === 0 ? (
                  <EmptyState icon="◈" message="No submissions yet" />
                ) : (
                  <View style={styles.tableWrap}>
                    {submissions.slice(0, 30).map((s: any, i: number) => (
                      <View key={i} style={styles.tableRow}>
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="body" size={12} color="#141f14">{s.username}</ThemedText>
                          <ThemedText variant="caption" numberOfLines={1}>{s.problem_title}</ThemedText>
                        </View>
                        <Badge label={s.passed ? 'Pass' : 'Fail'} variant={s.passed ? 'pass' : 'fail'} />
                        <ThemedText variant="mono" size={11} color="#8a6318">{s.score}/{s.max_score}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </SectionCard>

              <SectionCard title="Quiz Attempts" count={attempts.length}>
                {attempts.length === 0 ? (
                  <EmptyState icon="✦" message="No attempts yet" />
                ) : (
                  <View style={styles.tableWrap}>
                    {attempts.slice(0, 30).map((a: any, i: number) => (
                      <View key={i} style={styles.tableRow}>
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="body" size={12} color="#141f14">{a.username}</ThemedText>
                          <ThemedText variant="caption" numberOfLines={1}>{a.quiz_title}</ThemedText>
                        </View>
                        <Badge label={a.passed ? 'Pass' : 'Fail'} variant={a.passed ? 'pass' : 'fail'} />
                        <ThemedText variant="mono" size={11} color="#8a6318">{a.score}/{a.total}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </SectionCard>
            </>
          )}
        </ScrollView>
      )}

      {/* Delete confirm dialog */}
      <ConfirmModal
        visible={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) {
            await deleteItem(confirmDelete.type, confirmDelete.id);
            setConfirmDelete(null);
            reload();
          }
        }}
        title={`Delete ${confirmDelete?.type}?`}
        message={`"${confirmDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        icon="⚠"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f9f4' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ebe0',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 14,
  },

  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ebe0',
    maxHeight: 44,
  },
  tabBarContent: { paddingHorizontal: 12, gap: 4, alignItems: 'center', paddingVertical: 6 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: { borderColor: '#9ecfb0', backgroundColor: '#e8f5ec' },
  tabLabel: { fontSize: 10 },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 12, paddingBottom: 40 },

  statsRow: { flexDirection: 'row', gap: 10 },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  tableWrap: { paddingVertical: 4 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f0',
  },
});
