import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminData() {
  const [labs, setLabs] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    totalUsers: users.length,
    totalSubmissions: submissions.length,
    totalAttempts: attempts.length,
    activeLabs: labs.filter(l => l.active).length,
    activeQuizzes: quizzes.filter(q => q.active).length,
  };

  const reload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        { data: l },
        { data: q },
        { data: s },
        { data: a },
        { data: p },
        { data: m },
      ] = await Promise.all([
        supabase.from('labs').select('*').order('created_at', { ascending: false }),
        supabase.from('quizzes').select('*').order('created_at', { ascending: false }),
        supabase.from('lab_submissions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('quiz_attempts').select('*').order('attempted_at', { ascending: false }),
        supabase.from('profiles').select('*').order('exp', { ascending: false }),
        supabase.from('settings').select('value').eq('key', 'maintenance_mode').single(),
      ]);

      setLabs(l || []);
      setQuizzes(q || []);
      setSubmissions(s || []);
      setAttempts(a || []);
      setUsers(p || []);
      setMaintenanceModeState(m?.value ?? false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return {
    labs, quizzes, submissions, attempts, users, stats,
    maintenanceMode, isLoading, error, reload,
  };
}
