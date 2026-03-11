import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { RANKS } from '../utils/constants';

function getRank(exp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (exp >= r.exp) rank = r; }
  return rank;
}

export function useLabSubmission() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRankUp, setPendingRankUp] = useState<{ name: string; img: string } | null>(null);

  const clearRankUp = () => setPendingRankUp(null);

  const submitSolution = async (code: string, problem: any, lab: any) => {
    if (!code.trim()) { setError('Code is empty!'); return; }
    setIsRunning(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const user = session.user;
      const username = user.user_metadata?.full_name || 'unknown';

      // Simple pass: mark all test cases passed (Python execution not available in RN)
      const testCases = problem.testCases || [];
      const score = problem.points || 0;
      const maxScore = problem.points || 0;
      const passed = true;
      const tcPassed = testCases.length;
      const tcTotal = testCases.length;

      await supabase.from('lab_submissions').insert({
        user_id: user.id,
        username,
        problem_id: problem.id,
        problem_title: problem.title,
        lab_title: lab.title || 'Unknown',
        score,
        max_score: maxScore,
        passed,
        tc_passed: tcPassed,
        tc_total: tcTotal,
      });

      // Add EXP
      await supabase.rpc('add_exp', { amount: score });

      // Get updated profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('exp, rank')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newRank = getRank(profile.exp || 0);
        const oldRank = profile.rank;
        if (newRank.name !== oldRank) {
          await supabase.from('profiles').update({ rank: newRank.name }).eq('id', user.id);
          setPendingRankUp(newRank);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return { isRunning, error, pendingRankUp, clearRankUp, submitSolution };
}
