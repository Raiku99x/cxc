// ─────────────────────────────────────────────────────────────
// src/components/Input.tsx — AuthInput component
// Used by app/auth/login.tsx
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from './index';

interface AuthInputProps extends TextInputProps {
  label: string;
}

export function AuthInput({ label, secureTextEntry, style, ...props }: AuthInputProps) {
  const [show, setShow] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.wrap}>
      <ThemedText variant="label" color="#6b5c42" style={styles.label}>
        {label.toUpperCase()}
      </ThemedText>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#a89878"
          secureTextEntry={isPassword && !show}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShow(v => !v)}
            style={styles.eye}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ThemedText variant="mono" size={12} color="#8a7a5e">
              {show ? 'HIDE' : 'SHOW'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 9,
    letterSpacing: 1.4,
    marginBottom: 5,
    color: '#6b5c42',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b8aa8c',
    borderRadius: 4,
    backgroundColor: '#f5f0e6',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: 'System',
    fontSize: 14,
    color: '#2c2218',
  },
  eye: {
    paddingHorizontal: 10,
  },
});
