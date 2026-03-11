// ─────────────────────────────────────────────────────────────
// src/lib/supabase.ts — Supabase client singleton
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oikumdcokfhrzuvgmxku.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pa3VtZGNva2Zocnp1dmdteGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzA2NTYsImV4cCI6MjA4ODQ0NjY1Nn0.X_PzXZswIFPKZddV24rcSql6PbVoR0vmuKdn3Xh_qAQ';

export const sbClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
