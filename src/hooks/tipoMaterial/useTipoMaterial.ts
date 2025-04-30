import { useGetTipoMaterial } from "@/api/tipoMaterial/getTipoMateria";
import { usePostTipoMateriales } from "@/api/tipoMaterial/postTipoMateria";
import { usePutTipoMaterial , TipoMaterialUpdate} from "@/api/tipoMaterial/putTipoMateria";
import { useDeleteTipoMaterial } from "@/api/tipoMaterial/deleteTipoMaterial"; 
import TipoMaterial from "@/components/pages/TipoMaterial";


export function useTipoMaterial() {
  const { data: TipoMateriales = [], isLoading: loading } = useGetTipoMaterial();
  const post = usePostTipoMateriales();
  const put = usePutTipoMaterial();
  const del = useDeleteTipoMaterial();

  const crearTipoMaterial = async (data:TipoMaterial) => post.mutateAsync(data);
  const actualizarTipoMaterial = async (id: number, data: TipoMaterialUpdate) => put.mutateAsync({ ...data, id_tipo_material : id });
  const eliminarTipoMaterial = async (id: number) => del.mutateAsync(id);

  return { TipoMateriales, loading, crearTipoMaterial, actualizarTipoMaterial, eliminarTipoMaterial };
}
