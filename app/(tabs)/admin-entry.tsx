// ─────────────────────────────────────────────────────────────
// app/(tabs)/admin-entry.tsx — Admin Tab Entry Point
// Redirects to /admin which is the full admin panel
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AdminEntryTab() {
  useEffect(() => {
    router.replace('/admin');
  }, []);

  return null;
}
