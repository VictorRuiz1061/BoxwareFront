import { useGetProgramas as useApiGetProgramas } from "@/api/programas";

export function useGetProgramas() {
  const { data: programas = [], isLoading: loading } = useApiGetProgramas();
  return { programas, loading };
} 