import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { sbClient } from '../../src/lib/supabase';
import { getRank } from '../../src/utils/constants';
import { useAuth } from '../../src/context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: setting } = await sbClient.from('settings').select('value').eq('key', 'lb_enabled').single();
      if (setting && setting.value === false) { setDisabled(true); setLoading(false); return; }
      const { data } = await sbClient.from('profiles').select('id,exp,username').order('exp', { ascending: false });
      setProfiles(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  if (loading) return (
    <View style={s.center}><ActivityIndicator color="#c9a84c" /></View>
  );

  if (disabled) return (
    <View style={s.center}>
      <Text style={s.disabledTxt}>Leaderboard is currently hidden.</Text>
    </View>
  );

  return (
    <ScrollView style={s.container}>
      <Text style={s.pageTitle}>⬡ Rankings</Text>
      {profiles.map((p, i) => {
        const rank = getRank(p.exp || 0);
        const isMe = p.id === user?.id;
        return (
          <View key={p.id} style={[s.row, isMe && s.rowMe, i === 0 && s.row1, i === 1 && s.row2, i === 2 && s.row3]}>
            <Text style={s.medal}>{i < 3 ? medals[i] : `#${i + 1}`}</Text>
            <View style={s.info}>
              <Text style={[s.name, isMe && s.nameMe]}>User#{i}{isMe ? ' (you)' : ''}</Text>
              <Text style={s.rankTxt}>{rank.name}</Text>
            </View>
            <Text style={s.exp}>{(p.exp || 0).toLocaleString()} EXP</Text>
          </View>
        );
      })}
      {!profiles.length && <Text style={s.empty}>No data yet.</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0803', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0803' },
  pageTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 18, color: '#c9a84c', marginBottom: 16, letterSpacing: 1 },
  row: { backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 6, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  row1: { borderColor: '#c9a84c', backgroundColor: '#1f1608' },
  row2: { borderColor: '#888', backgroundColor: '#161410' },
  row3: { borderColor: '#7a5030', backgroundColor: '#161208' },
  rowMe: { borderColor: '#c9a84c' },
  medal: { fontSize: 18, width: 36, textAlign: 'center' },
  info: { flex: 1 },
  name: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#e8dcc8' },
  nameMe: { color: '#c9a84c' },
  rankTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 11, color: '#6b5a3a' },
  exp: { fontFamily: 'Cinzel_400Regular', fontSize: 13, color: '#c9a84c' },
  disabledTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#6b5a3a' },
  empty: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#6b5a3a', textAlign: 'center', marginTop: 40 },
});
