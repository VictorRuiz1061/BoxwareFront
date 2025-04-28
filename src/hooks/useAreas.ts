import { useGetAreas } from "@/hooks/areas/useGetAreas";
import { usePostArea } from "@/hooks/areas/usePostArea";
import { usePutArea } from "@/hooks/areas/usePutArea";
import { useDeleteArea } from "@/hooks/areas/useDeleteArea";
import { Area } from "@/types/area";
import { NuevaArea } from "@/api/areas/postArea";
import { AreaUpdate } from "@/api/areas/putArea";

export function useAreas() {
  const { data: areas = [], isLoading: loading } = useGetAreas();
  const post = usePostArea();
  const put = usePutArea();
  const del = useDeleteArea();

  const crearArea = async (data: NuevaArea) => post.mutateAsync(data);
  const actualizarArea = async (id_area: number, data: AreaUpdate) => put.mutateAsync({ ...data, id_area });
  const eliminarArea = async (id_area: number) => del.mutateAsync(id_area);

  return { areas, loading, crearArea, actualizarArea, eliminarArea };
}
