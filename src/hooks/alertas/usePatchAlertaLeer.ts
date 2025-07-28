import { usePatchAlertaLeer as useApiPatchAlertaLeer } from "@/api/alertas/patchAlertaLeer";
    
export function usePatchAlertaLeer() {
  const patch = useApiPatchAlertaLeer();
  const actualizarAlerta = async (id: number) => patch.mutateAsync(id);
  return { actualizarAlerta };
}
