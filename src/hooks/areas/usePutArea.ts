import { usePutArea as useApiPutArea } from "@/api/areas";
import { Area } from "@/types/area";

export function usePutArea() {
  const put = useApiPutArea();
  const actualizarArea = async (id: number, data: Area) => put.mutateAsync({ ...data, id });
  return { actualizarArea };
}
