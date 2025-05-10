import { useGetProgramas as useApiGetProgramas } from "@/api/programas/getProgramas";

export function useGetProgramas() {
  const { data: programas = [], isLoading: loading } = useApiGetProgramas();
  return { programas, loading };
} 