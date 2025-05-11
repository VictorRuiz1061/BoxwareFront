import { usePutSede as useApiPutSede } from "@/api/sedes/putSede";
import { NuevaSede } from "@/api/sedes/postSede";

export function usePutSede() {
  const put = useApiPutSede();
  const actualizarSede = async (id_sede: number, data: NuevaSede) => 
    put.mutateAsync({
      ...data, id_sede,
      estado: false,
      centro_id: 0
    });
  return { actualizarSede };
} 