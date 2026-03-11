// ─────────────────────────────────────────────────────────────
// app/auth/login.tsx — Login / Sign-up Screen
// Converted from: index.html #auth-overlay section
// Dark dungeon/parchment theme matching original CSS
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { loginWithEmail, signUpWithEmail } from '../../src/lib/authService';
import { ThemedText, Button } from '../../src/components';
import { AuthInput } from '../../src/components/Input';

type Mode = 'login' | 'signup';

export default function LoginScreen() {
  const [mode, setMode]         = useState<Mode>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await loginWithEmail(email, password);
        if (!result.success) setError(result.error || 'Login failed.');
      } else {
        const result = await signUpWithEmail(email, password, username);
        if (!result.success) {
          setError(result.error || 'Sign-up failed.');
        } else {
          setMessage(result.message || 'Check your inbox to verify your email.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Parchment bg texture overlay */}
      <View style={styles.bgOverlay} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Sigil / Logo ── */}
          <View style={styles.sigilWrap}>
            <View style={styles.outerRing} />
            <View style={styles.innerRing} />
            <View style={styles.sigilCenter}>
              <ThemedText style={styles.sigilRune}>⬡</ThemedText>
            </View>
          </View>

          {/* ── Title ── */}
          <ThemedText variant="display" size={26} color="#8a6318" style={styles.title}>
            Slytherin Classroom
          </ThemedText>
          <ThemedText variant="caption" color="#6b5c42" style={styles.subtitle}>
            BSCS — Python Practice Platform
          </ThemedText>

          {/* ── Card ── */}
          <View style={styles.card}>
            {/* Tab switcher */}
            <View style={styles.tabs}>
              {(['login', 'signup'] as Mode[]).map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => { setMode(m); setError(''); setMessage(''); }}
                  style={[styles.tab, mode === m && styles.tabActive]}
                >
                  <ThemedText
                    variant="label"
                    color={mode === m ? '#2c2218' : '#8a7a5e'}
                    style={styles.tabLabel}
                  >
                    {m === 'login' ? 'Enter' : 'Join'}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.form}>
              {mode === 'signup' && (
                <AuthInput
                  label="Username"
                  placeholder="Choose a username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}

              <AuthInput
                label="Gmail"
                placeholder="yourname@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <AuthInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {/* Error */}
              {error ? (
                <View style={styles.errorBox}>
                  <ThemedText variant="mono" size={11} color="#b02020">
                    {error}
                  </ThemedText>
                </View>
              ) : null}

              {/* Success message (signup) */}
              {message ? (
                <View style={styles.successBox}>
                  <ThemedText variant="mono" size={11} color="#0f5228">
                    {message}
                  </ThemedText>
                </View>
              ) : null}

              <Button
                label={mode === 'login' ? '✦ Enter the Hall' : '✦ Inscribe my Name'}
                onPress={handleSubmit}
                variant="gold"
                loading={isLoading}
                size="lg"
                style={styles.submitBtn}
              />
            </View>
          </View>

          {/* ── Footer note ── */}
          <ThemedText variant="caption" color="#8a7a5e" style={styles.footer}>
            Only @gmail.com addresses are permitted within these halls.
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#2c2014',
  },
  flex: { flex: 1 },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,14,6,0.55)',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  // ── Sigil ──
  sigilWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(160,120,40,0.35)',
  },
  innerRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(160,120,40,0.55)',
  },
  sigilCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#a07828',
    backgroundColor: 'rgba(138,99,24,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilRune: {
    fontSize: 24,
    color: '#a07828',
  },

  // ── Title ──
  title: {
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 32,
    opacity: 0.8,
  },

  // ── Card ──
  card: {
    backgroundColor: '#ede6d6',
    borderWidth: 1,
    borderColor: '#b8aa8c',
    borderRadius: 6,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },

  // ── Tabs ──
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#b8aa8c',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#a07828',
    backgroundColor: 'rgba(138,99,24,0.06)',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
  },

  // ── Form ──
  form: {
    padding: 24,
    gap: 4,
  },
  errorBox: {
    backgroundColor: 'rgba(176,32,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(176,32,32,0.3)',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  successBox: {
    backgroundColor: 'rgba(15,82,40,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(15,82,40,0.3)',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 8,
  },

  footer: {
    marginTop: 24,
    textAlign: 'center',
    opacity: 0.6,
    maxWidth: 300,
  },
});
