import { useGetMateriales as useApiGetMateriales } from '@/api/materiales';

export function useGetMateriales() {
  const { data: materiales = [], isLoading: loading } = useApiGetMateriales();
  return { materiales, loading };
}
