// ─────────────────────────────────────────────────────────────
// src/lib/authService.ts
// Converted from: auth.js — login/signup/logout logic
// ─────────────────────────────────────────────────────────────

import { sbClient } from './supabase';

const ERRORS = {
  notOnList: [
    "That's not your full first name — lowercase, no spaces. e.g. alex or maryjane",
    "Name not recognized. Enter your first name exactly, lowercase, no spaces.",
    "Check your spelling — use your full first name, lowercase, no spaces.",
  ],
  alreadyTaken: [
    "That username is already taken.",
    "Someone already claimed that name. Are you sure that's yours?",
  ],
  emptyFields: [
    "Please fill in all fields.",
    "Don't leave anything blank!",
  ],
};

function randomError(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Login ──────────────────────────────────────────────────────
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || !password) {
    return { success: false, error: randomError(ERRORS.emptyFields) };
  }

  const { error } = await sbClient.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ── Sign Up ────────────────────────────────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const trimmedUsername = username.trim().toLowerCase();

  if (!email || !password || !trimmedUsername) {
    return { success: false, error: randomError(ERRORS.emptyFields) };
  }

  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return {
      success: false,
      error: 'Please use your Gmail address (@gmail.com) to sign up.',
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters.',
    };
  }

  // Check if username is on the allowed list
  const { data: allowed, error: rpcError } = await sbClient.rpc(
    'check_username_allowed',
    { input_username: trimmedUsername }
  );

  if (rpcError || !allowed) {
    return { success: false, error: randomError(ERRORS.notOnList) };
  }

  // Check if username is already taken
  const { data: existing } = await sbClient
    .from('profiles')
    .select('id')
    .eq('username', trimmedUsername)
    .maybeSingle();

  if (existing) {
    return { success: false, error: randomError(ERRORS.alreadyTaken) };
  }

  const { error: signUpError } = await sbClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: trimmedUsername } },
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  return {
    success: true,
    message: 'Account created! Check your Gmail to verify before logging in.',
  };
}

// ── Logout ─────────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  await sbClient.auth.signOut();
}
