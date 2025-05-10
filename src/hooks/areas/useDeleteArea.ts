import { useDeleteArea as useApiDeleteArea } from "@/api/areas/deleteArea";

export function useDeleteArea() {
  const del = useApiDeleteArea();
  const eliminarArea = async (id_area: number) => del.mutateAsync(id_area);
  return { eliminarArea };
} 