import { useGetMateriales } from "@/api/material/getMateriales";

export function useMaterialGet() {
  const { data: materiales = [], isLoading: loading } = useGetMateriales();
  return { materiales, loading };
}