import { useEffect, useState, useCallback } from 'react';
import { sbClient } from '../lib/supabase';
import { getRank } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [exp, setExp] = useState(0);
  const [rankName, setRankName] = useState('Bronze');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await sbClient
      .from('profiles')
      .select('exp, rank')
      .eq('id', user.id)
      .single();

    if (data) {
      setExp(data.exp || 0);
      setRankName(data.rank || getRank(data.exp || 0).name);
    } else {
      await sbClient.from('profiles').upsert({ id: user.id, exp: 0, rank: 'Bronze' });
      setExp(0);
      setRankName('Bronze');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return { exp, rankName, loading, reload: load };
}
