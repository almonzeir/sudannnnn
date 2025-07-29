import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Medication } from '@/types';

const fetchMedications = async (): Promise<Medication[]> => {
  const { data, error } = await supabase.from('medications').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const useMedications = () => {
  return useQuery<Medication[], Error>({
    queryKey: ['medications'],
    queryFn: fetchMedications,
    // Consider medication data fresh for 5 minutes to avoid unnecessary refetches.
    staleTime: 1000 * 60 * 5,
    // Keep data in the cache for 30 minutes.
    gcTime: 1000 * 60 * 30,
  });
};