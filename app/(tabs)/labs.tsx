import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useContent } from '../../src/hooks/useContent';

export default function Labs() {
  const { labs, loading } = useContent();
  const router = useRouter();

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator color="#c9a84c" />
      <Text style={s.loadTxt}>Loading scrolls…</Text>
    </View>
  );

  return (
    <ScrollView style={s.container}>
      <Text style={s.pageTitle}>Assigned Scrolls</Text>
      {labs.map((lab: any) => (
        <View key={lab.id || lab.title} style={s.card}>
          <Text style={s.labTitle}>{lab.title}</Text>
          <Text style={s.labMeta}>Due: {lab.dueDate} · {lab.problems?.length || 0} problems · Passing: {lab.passingPercent}%</Text>
          <View style={s.problems}>
            {(lab.problems || []).map((p: any) => (
              <TouchableOpacity
                key={p.id}
                style={s.problem}
                onPress={() => router.push({ pathname: '/lab/[id]', params: { id: p.id, labId: lab.id || lab.title } })}
              >
                <Text style={s.probTitle}>{p.title}</Text>
                <View style={s.probTags}>
                  <Text style={s.tag}>{p.difficulty}</Text>
                  <Text style={s.tag}>{p.points}pts</Text>
                </View>
                <Text style={s.cast}>Cast →</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      {!labs.length && <Text style={s.empty}>No labs available yet.</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0803', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0803' },
  loadTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#6b5a3a', marginTop: 8 },
  pageTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 18, color: '#c9a84c', marginBottom: 16, letterSpacing: 1 },
  card: { backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 8, padding: 16, marginBottom: 14 },
  labTitle: { fontFamily: 'Cinzel_400Regular', fontSize: 15, color: '#e8dcc8', marginBottom: 4 },
  labMeta: { fontFamily: 'CrimsonPro_400Regular', fontSize: 11, color: '#6b5a3a', marginBottom: 12 },
  problems: { gap: 8 },
  problem: { backgroundColor: '#120d05', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 6, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  probTitle: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#e8dcc8', flex: 1 },
  probTags: { flexDirection: 'row', gap: 6, marginHorizontal: 8 },
  tag: { fontFamily: 'CrimsonPro_400Regular', fontSize: 10, color: '#c9a84c', backgroundColor: '#1f1608', borderWidth: 1, borderColor: '#3d2e0e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  cast: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#c9a84c' },
  empty: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#6b5a3a', textAlign: 'center', marginTop: 40 },
});
