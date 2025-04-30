import { useGetMateriales } from "@/api/material/getMateriales";
import { usePostMaterial } from "@/api/material/postMaterial";
import { usePutMaterial } from "@/api/material/putMaterial";
import { useDeleteMaterial } from "@/api/material/deleteMaterial";
import { MaterialUpdate } from "@/api/material/putMaterial";
import { Material } from "@/types/material";


export function useMaterial() {
  const { data: materiales = [], isLoading: loading } = useGetMateriales();
  const post = usePostMaterial();
  const put = usePutMaterial();
  const del = useDeleteMaterial();

  const crearMaterial = async (data: Material) => post.mutateAsync(data);
  const actualizarMaterial = async (id: number, data: MaterialUpdate) => put.mutateAsync({ ...data, id_material : id });
  const eliminarMaterial = async (id: number) => del.mutateAsync(id);

  return { materiales, loading, crearMaterial, actualizarMaterial, eliminarMaterial };
}
