import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useLabsAndQuizzes() {
  const [labs, setLabs] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [{ data: l, error: le }, { data: q, error: qe }] = await Promise.all([
        supabase.from('labs').select('*').eq('active', true).order('created_at'),
        supabase.from('quizzes').select('*').eq('active', true).order('created_at'),
      ]);
      if (le) throw new Error(le.message);
      if (qe) throw new Error(qe.message);

      // Flatten data field like the original app.js does
      const labsData = (l || []).map((row: any) => ({ ...row, ...(row.data || {}) }));
      const quizzesData = (q || []).map((row: any) => ({ ...row, ...(row.data || {}) }));

      setLabs(labsData);
      setQuizzes(quizzesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  return { labs, quizzes, isLoading, error, reload };
}
