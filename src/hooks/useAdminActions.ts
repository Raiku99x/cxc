import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminActions() {
  const [isBusy, setIsBusy] = useState(false);

  const toggleActive = async (type: 'lab' | 'quiz', id: string, current: boolean) => {
    setIsBusy(true);
    const table = type === 'lab' ? 'labs' : 'quizzes';
    await supabase.from(table).update({ active: !current }).eq('id', id);
    setIsBusy(false);
  };

  const deleteItem = async (type: 'lab' | 'quiz', id: string) => {
    setIsBusy(true);
    const table = type === 'lab' ? 'labs' : 'quizzes';
    await supabase.from(table).delete().eq('id', id);
    setIsBusy(false);
  };

  const setMaintenance = async (value: boolean) => {
    setIsBusy(true);
    await supabase.from('settings').upsert({ key: 'maintenance_mode', value });
    setIsBusy(false);
  };

  const setUserExp = async (userId: string, exp: number, rank: string) => {
    setIsBusy(true);
    await supabase.from('profiles').update({ exp, rank }).eq('id', userId);
    setIsBusy(false);
  };

  return { toggleActive, deleteItem, setMaintenance, setUserExp, isBusy };
}
