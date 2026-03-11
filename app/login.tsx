import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Image, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (!email || !password || (mode === 'signup' && !username)) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true);
    if (mode === 'login') {
      const { error: e } = await signIn(email, password);
      if (e) setError(e);
      else router.replace('/(tabs)/home');
    } else {
      const { error: e } = await signUp(email, password, username);
      if (e) setError(e);
      else setSuccess('Account created! Check your Gmail to verify before logging in.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.card}>
        <Image source={require('../src/assets/images/logo.png')} style={s.logo} />
        <Text style={s.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</Text>
        <Text style={s.sub}>Slytherin Classroom</Text>

        {mode === 'signup' && (
          <View style={s.field}>
            <Text style={s.label}>USERNAME</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. alex or maryjane"
              placeholderTextColor="#4a3a2a"
              value={username}
              onChangeText={t => setUsername(t.toLowerCase().replace(/[^a-z]/g, ''))}
              autoCapitalize="none"
            />
            <Text style={s.hint}>Your first name only — lowercase, no spaces</Text>
          </View>
        )}

        <View style={s.field}>
          <Text style={s.label}>EMAIL</Text>
          <TextInput
            style={s.input}
            placeholder="you@gmail.com"
            placeholderTextColor="#4a3a2a"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>PASSWORD</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••"
            placeholderTextColor="#4a3a2a"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}
        {success ? <Text style={s.successTxt}>{success}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#c9a84c" />
            : <Text style={s.btnTxt}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}>
          <Text style={s.switch}>
            {mode === 'login' ? 'No account yet? ' : 'Already have an account? '}
            <Text style={s.switchLink}>{mode === 'login' ? 'Sign Up' : 'Log In'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0803', padding: 20 },
  card: { backgroundColor: '#1a1208', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 8, padding: 32, width: '100%', maxWidth: 380 },
  logo: { width: 64, height: 64, borderRadius: 32, alignSelf: 'center', marginBottom: 12 },
  title: { fontFamily: 'Cinzel_700Bold', fontSize: 18, color: '#c9a84c', textAlign: 'center', letterSpacing: 2 },
  sub: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#6b5a3a', textAlign: 'center', marginBottom: 24 },
  field: { marginBottom: 14 },
  label: { fontFamily: 'CrimsonPro_400Regular', fontSize: 10, color: '#6b5a3a', letterSpacing: 2, marginBottom: 5 },
  input: { backgroundColor: '#120d05', borderWidth: 1, borderColor: '#3d2e0e', borderRadius: 4, padding: 12, fontFamily: 'CrimsonPro_400Regular', fontSize: 14, color: '#e8dcc8' },
  hint: { fontFamily: 'CrimsonPro_400Regular', fontSize: 10, color: '#4a3a2a', marginTop: 4 },
  error: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#c84b4b', marginBottom: 10, textAlign: 'center' },
  successTxt: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#4a9e6a', marginBottom: 10, textAlign: 'center' },
  btn: { backgroundColor: '#1f1608', borderWidth: 1, borderColor: '#c9a84c', borderRadius: 4, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnTxt: { fontFamily: 'Cinzel_700Bold', fontSize: 12, color: '#c9a84c', letterSpacing: 2 },
  switch: { fontFamily: 'CrimsonPro_400Regular', fontSize: 12, color: '#6b5a3a', textAlign: 'center' },
  switchLink: { color: '#c9a84c', textDecorationLine: 'underline' },
});
