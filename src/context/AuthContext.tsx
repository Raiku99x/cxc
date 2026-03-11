import React, { createContext, useContext, useEffect, useState } from 'react';
import { sbClient } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sbClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = sbClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await sbClient.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return { error: 'Please use your Gmail address (@gmail.com) to sign up.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    const { data: allowed, error: allowErr } = await sbClient.rpc('check_username_allowed', {
      input_username: username,
    });
    if (allowErr || !allowed) {
      return { error: 'Name not recognized. Enter your first name exactly, lowercase, no spaces.' };
    }

    const { data: existing } = await sbClient
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (existing) return { error: 'That username is already taken.' };

    const { error } = await sbClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: username } },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await sbClient.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
