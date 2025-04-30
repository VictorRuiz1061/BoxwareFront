import { useGetCategoriaElemento } from "@/api/categoriaElemento/getCategoriaElementos";
import { usePostCategoriaElemento } from "@/api/categoriaElemento/postCategoriaElemento";
import { usePutCategoriaElementos ,CategoriaElementos} from "@/api/categoriaElemento/putCategoriaElemento";
import { useDeletecategoriaElemento } from "@/api/categoriaElemento/deleteCategoriaElemento";
import { CategoriaElemento } from "@/types/categoriaElemento";


export function useMaterial() {
  const { data: materiales = [], isLoading: loading } = useGetCategoriaElemento();
  const post = usePostCategoriaElemento();
  const put = usePutCategoriaElementos();
  const del = useDeletecategoriaElemento();

  const crearMaterial = async (data: CategoriaElemento) => post.mutateAsync(data);
  const actualizarMaterial = async (id: number, data: CategoriaElementos) => put.mutateAsync({ ...data, id_categoria_elemento : id });
  const eliminarMaterial = async (id: number) => del.mutateAsync(id);

  return { materiales, loading, crearMaterial, actualizarMaterial, eliminarMaterial };
}
