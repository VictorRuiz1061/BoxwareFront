import { usePostInventario as useApiPostInventario } from '@/api/inventario';
import { Inventario } from '@/types/inventario';

export function usePostInventario() {
  const post = useApiPostInventario();
  const crearInventario = async (data: Inventario) => post.mutateAsync(data);
  return { crearInventario };
} 