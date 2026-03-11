import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useProfile } from '../../src/hooks/useProfile';
import { getRank, getNextRank } from '../../src/utils/constants';

const RANK_IMAGES: Record<string, any> = {
  'bronze.png':   require('../../src/assets/images/bronze.png'),
  'silver.png':   require('../../src/assets/images/silver.png'),
  'gold.png':     require('../../src/assets/images/gold.png'),
  'platinum.png': require('../../src/assets/images/platinum.png'),
  'diamond.png':  require('../../src/assets/images/diamond.png'),
  'crimson.png':  require('../../src/assets/images/crimson.png'),
  'astral.png':   require('../../src/assets/images/astral.png'),
  'sysadmin.png': require('../../src/assets/images/sysadmin.png'),
};

export default function Home() {
  const { user, signOut } = useAuth();
  const { exp, loading } = useProfile();
  const router = useRouter();

  const rank = getRank(exp);
  const next = getNextRank(exp);
  const pct = next ? Math.round((exp - rank.exp) / (next.exp - rank.exp) * 100) : 100;
  const username = user?.user_metadata?.full_name || '?';

  return (
    <ScrollView style={s.container}>
      {/* HERO */}
      <View style={s.hero}>
        <Image source={RANK_IMAGES[rank.img]} style={s.rankImg} />
        <Text style={s.rankName}>{rank.name}</Text>
        <Text style={s.expTxt}>{exp} {next ? `/ ${next.exp} EXP` : 'EXP — MAX'}</Text>
        <View style={s.barWrap}>
          <View style={[s.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={s.username}>{username}</Text>
      </View>

      {/* QUICK ACTIONS */}
      <View style={s.actions}>
        <TouchableOpacity style={s.actionBtn} onPress={() => router.push('/(tabs)/labs')}>
          <Text style={s.actionIco}>📜</Text>
          <Text style={s.actionTxt}>Labs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => router.push('/(tabs)/quizzes')}>
          <Text style={s.actionIco}>🧙</Text>
          <Text style={s.actionTxt}>Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => router.push('/(tabs)/leaderboard')}>
          <Text style={s.actionIco}>⬡</Text>
          <Text style={s.actionTxt}>Rankings</Text>
        </TouchableOpacity>
      </View>

      {/* SIGN OUT */}
      <TouchableOpacity style={s.signOut} onPress={signOut}>
        <Text style={s.signOutTxt}>↩ Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0803' },
  hero: { alignItems: 'center', padding: 32, borderBottomWidth: 1, borderBottomColor: '#3d2e0e' },
  rankImg: { width: 80, height: 80, objectFit: 'contain', marginBottom: 12 },
  rankName: { fontFamily: 'Cinzel_700Bold', fontSize: 18, color: '#c9a84c', letterSpacing: 2 },
  expTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#6b5a3a', marginTop: 4 },
  barWrap: { width: '80%', height: 4, backgroundColor: '#3d2e0e', borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#c9a84c', borderRadius: 4 },
  username: { fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: '#e8dcc8', marginTop: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', padding: 24 },
  actionBtn: { alignItems: 'center', backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 8, padding: 20, width: '28%' },
  actionIco: { fontSize: 24, marginBottom: 6 },
  actionTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#c9a84c' },
  signOut: { margin: 24, borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 4, padding: 12, alignItems: 'center' },
  signOutTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 13, color: '#8b1c1c' },
});
