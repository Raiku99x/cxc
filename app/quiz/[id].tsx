import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sbClient } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useContent } from '../../src/hooks/useContent';
import { getRank } from '../../src/utils/constants';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quizzes } = useContent();
  const { user } = useAuth();
  const router = useRouter();

  const quiz = quizzes.find((q: any) => q.id === id);
  const [questions, setQuestions] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [fillVal, setFillVal] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!quiz) return;
    let qs = [...(quiz.questions || [])].sort(() => Math.random() - 0.5).slice(0, 50);
    setQuestions(qs);
  }, [quiz]);

  if (!quiz || !questions.length) return (
    <View style={s.center}><ActivityIndicator color="#c9a84c" /></View>
  );

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  const answer = async (userAns: string) => {
    if (locked) return;
    setLocked(true);
    const { data } = await sbClient.rpc('check_answer', {
      quiz_id: quiz.id.toString(),
      question_id: q.id.toString(),
      user_answer: userAns,
    });
    const correct = data?.correct || false;
    const correctAnswer = data?.correct_answer || '';
    setFeedback({ correct, answer: correctAnswer });
    setResults(prev => [...prev, { correct, userAns, correctAnswer, qid: q.id }]);
    if (correct) setScore(s => s + 1);
  };

  const next = async () => {
    if (isLast) {
      const passed = score / questions.length >= 0.7;
      await sbClient.from('quiz_attempts').insert({
        user_id: user!.id,
        username: user!.user_metadata?.full_name || 'unknown',
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        score,
        total: questions.length,
        passed,
      });
      await sbClient.rpc('add_exp', { amount: score });
      const { data: prof } = await sbClient.from('profiles').select('exp').eq('id', user!.id).single();
      const rankName = getRank(prof?.exp || 0).name;
      await sbClient.from('profiles').update({ rank: rankName }).eq('id', user!.id);
      setFinished(true);
    } else {
      setIdx(i => i + 1);
      setFeedback(null);
      setFillVal('');
      setLocked(false);
    }
  };

  if (finished) {
    const pct = Math.round(score / questions.length * 100);
    const passed = pct >= 70;
    return (
      <ScrollView style={s.container}>
        <View style={s.result}>
          <Text style={s.resultSigil}>{passed ? '✦' : '✗'}</Text>
          <Text style={[s.resultTitle, passed ? s.pass : s.fail]}>{passed ? 'Quiz Passed!' : 'Quiz Failed'}</Text>
          <Text style={s.resultScore}>{score}/{questions.length}</Text>
          <Text style={s.resultPct}>{pct}%</Text>
          <TouchableOpacity style={s.btn} onPress={() => router.back()}>
            <Text style={s.btnTxt}>← Back to Hall</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const choices = q.type === 'true_false' ? ['True', 'False'] : (q.choices || []);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.exit}>✕ Exit</Text></TouchableOpacity>
        <Text style={s.progress}>{idx + 1} / {questions.length}</Text>
      </View>

      <View style={s.progBar}>
        <View style={[s.progFill, { width: `${(idx / questions.length) * 100}%` }]} />
      </View>

      <ScrollView style={s.body}>
        <Text style={s.qText}>{q.question?.replace(/```[\s\S]*?```/g, '[code]')}</Text>

        {['multiple_choice', 'true_false', 'code_output'].includes(q.type) && choices.map((c: string) => (
          <TouchableOpacity
            key={c}
            style={[s.choice, feedback && c.toLowerCase() === feedback.answer.toLowerCase() && s.choiceCorrect, feedback && !feedback.correct && c === feedback.answer && s.choiceWrong]}
            onPress={() => answer(c)}
            disabled={!!feedback}
          >
            <Text style={s.choiceTxt}>{c}</Text>
          </TouchableOpacity>
        ))}

        {q.type === 'fill_blank' && (
          <View style={s.fillRow}>
            <TextInput style={s.fillInput} value={fillVal} onChangeText={setFillVal} placeholder="Type your answer…" placeholderTextColor="#4a3a2a" editable={!feedback} />
            <TouchableOpacity style={s.fillBtn} onPress={() => answer(fillVal)} disabled={!fillVal.trim() || !!feedback}>
              <Text style={s.fillBtnTxt}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {feedback && (
          <View style={[s.fb, feedback.correct ? s.fbOk : s.fbNo]}>
            <Text style={s.fbTxt}>{feedback.correct ? '✦ Correct!' : `✗ Wrong — correct: ${feedback.answer}`}</Text>
          </View>
        )}

        {feedback && (
          <TouchableOpacity style={s.nextBtn} onPress={next}>
            <Text style={s.nextBtnTxt}>{isLast ? '✦ See Results' : 'Next →'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0803' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0803' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#3d2e0e' },
  exit: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#8b1c1c' },
  progress: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#6b5a3a' },
  progBar: { height: 3, backgroundColor: '#3d2e0e' },
  progFill: { height: '100%', backgroundColor: '#c9a84c' },
  body: { flex: 1, padding: 20 },
  qText: { fontFamily: 'CrimsonPro_400Regular', fontSize: 16, color: '#e8dcc8', marginBottom: 20, lineHeight: 24 },
  choice: { backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 6, padding: 14, marginBottom: 10 },
  choiceCorrect: { borderColor: '#4a9e6a', backgroundColor: '#0d1f14' },
  choiceWrong: { borderColor: '#8b1c1c', backgroundColor: '#1a0a0a' },
  choiceTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: '#e8dcc8' },
  fillRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  fillInput: { flex: 1, backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 6, padding: 12, fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: '#e8dcc8' },
  fillBtn: { backgroundColor: '#1f1608', borderWidth: 1, borderColor: '#c9a84c', borderRadius: 6, padding: 12, justifyContent: 'center' },
  fillBtnTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#c9a84c' },
  fb: { borderRadius: 6, padding: 14, marginTop: 10, marginBottom: 10 },
  fbOk: { backgroundColor: '#0d1f14', borderWidth: 1, borderColor: '#4a9e6a' },
  fbNo: { backgroundColor: '#1a0a0a', borderWidth: 1, borderColor: '#8b1c1c' },
  fbTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: '#e8dcc8' },
  nextBtn: { backgroundColor: '#1f1608', borderWidth: 1, borderColor: '#c9a84c', borderRadius: 6, padding: 14, alignItems: 'center', marginTop: 8 },
  nextBtnTxt: { fontFamily: 'Cinzel_400Regular', fontSize: 13, color: '#c9a84c', letterSpacing: 1 },
  result: { alignItems: 'center', padding: 40 },
  resultSigil: { fontSize: 48, marginBottom: 16 },
  resultTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 22, letterSpacing: 2, marginBottom: 8 },
  pass: { color: '#c9a84c' },
  fail: { color: '#8b1c1c' },
  resultScore: { fontFamily: 'Cinzel_400Regular', fontSize: 36, color: '#e8dcc8', marginBottom: 4 },
  resultPct: { fontFamily: 'CrimsonPro_400Regular', fontSize: 16, color: '#6b5a3a', marginBottom: 32 },
  btn: { borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 6, padding: 14, paddingHorizontal: 32 },
  btnTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: '#c9a84c' },
});
