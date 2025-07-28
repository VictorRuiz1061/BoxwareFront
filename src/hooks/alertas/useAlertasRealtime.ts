import { useEffect, useRef } from 'react';
import { useGetAlertas } from './useGetAlertas';
import { Alerta, EstadoAlerta } from '@/types/alerta';

interface UseAlertasRealtimeProps {
  onNuevaAlerta?: (alerta: Alerta) => void;
  onAlertaLeida?: (alertaId: number) => void;
}

export function useAlertasRealtime({ onNuevaAlerta, onAlertaLeida }: UseAlertasRealtimeProps = {}) {
  const { alertas } = useGetAlertas();
  const alertasAnteriores = useRef<Alerta[]>([]);

  useEffect(() => {
    // Detectar nuevas alertas
    if (alertas.length > 0 && alertasAnteriores.current.length > 0) {
      const nuevasAlertas = alertas.filter(
        alerta => 
          alerta.estado === EstadoAlerta.PENDIENTE &&
          !alertasAnteriores.current.some(
            alertaAnterior => alertaAnterior.id_alerta === alerta.id_alerta
          )
      );

      nuevasAlertas.forEach(alerta => {
        if (onNuevaAlerta) {
          onNuevaAlerta(alerta);
        }
      });
    }

    // Detectar alertas marcadas como leídas
    if (alertasAnteriores.current.length > 0) {
      const alertasLeidas = alertasAnteriores.current.filter(
        alertaAnterior => 
          alertaAnterior.estado === EstadoAlerta.PENDIENTE &&
          alertas.some(
            alerta => 
              alerta.id_alerta === alertaAnterior.id_alerta && 
              alerta.estado === EstadoAlerta.LEIDA
          )
      );

      alertasLeidas.forEach(alerta => {
        if (onAlertaLeida) {
          onAlertaLeida(alerta.id_alerta);
        }
      });
    }

    alertasAnteriores.current = [...alertas];
  }, [alertas, onNuevaAlerta, onAlertaLeida]);

  return {
    alertas,
    alertasNoLeidas: alertas.filter(alerta => alerta.estado === EstadoAlerta.PENDIENTE)
  };
} 