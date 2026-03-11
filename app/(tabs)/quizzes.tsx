import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useContent } from '../../src/hooks/useContent';

export default function Quizzes() {
  const { quizzes, loading } = useContent();
  const router = useRouter();

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator color="#c9a84c" />
      <Text style={s.loadTxt}>Loading quizzes…</Text>
    </View>
  );

  return (
    <ScrollView style={s.container}>
      <Text style={s.pageTitle}>Practice Quizzes</Text>
      {quizzes.map((quiz: any) => (
        <TouchableOpacity
          key={quiz.id}
          style={s.card}
          onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: quiz.id } })}
        >
          <Text style={s.quizTitle}>{quiz.title}</Text>
          <Text style={s.quizMeta}>{quiz.topic} · {quiz.questions?.length || 0} questions</Text>
          <Text style={s.start}>Start →</Text>
        </TouchableOpacity>
      ))}
      {!quizzes.length && <Text style={s.empty}>No quizzes available yet.</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0803', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0803' },
  loadTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#6b5a3a', marginTop: 8 },
  pageTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 18, color: '#c9a84c', marginBottom: 16, letterSpacing: 1 },
  card: { backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 8, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quizTitle: { fontFamily: 'Cinzel_400Regular', fontSize: 14, color: '#e8dcc8', flex: 1 },
  quizMeta: { fontFamily: 'CrimsonPro_400Regular', fontSize: 11, color: '#6b5a3a', marginTop: 3 },
  start: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#c9a84c', marginLeft: 12 },
  empty: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#6b5a3a', textAlign: 'center', marginTop: 40 },
});
