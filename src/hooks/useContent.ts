import { useEffect, useState } from 'react';
import { sbClient } from '../lib/supabase';

export function useContent() {
  const [labs, setLabs] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [{ data: labData, error: labErr }, { data: quizData, error: quizErr }] =
          await Promise.all([
            sbClient.from('labs').select('data').eq('active', true).order('created_at'),
            sbClient.rpc('get_quizzes_safe'),
          ]);

        if (labErr) throw new Error(labErr.message);
        if (quizErr) throw new Error(quizErr.message);

        setLabs((labData || []).map((l: any) => l.data));
        setQuizzes(quizData || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { labs, quizzes, loading, error };
}
