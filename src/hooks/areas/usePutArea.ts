import { usePutArea as useApiPutArea } from "@/api/areas/putArea";
import { AreaUpdate } from "@/api/areas/putArea";

export function usePutArea() {
  const put = useApiPutArea();
  const actualizarArea = async (id_area: number, data: AreaUpdate) => put.mutateAsync({ ...data, id_area });
  return { actualizarArea };
} 