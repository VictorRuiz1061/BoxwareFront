import { useState, useEffect } from 'react';
import { Alerta } from '@/types/alerta';
import { useAlertasRealtime } from '@/hooks/alertas/useAlertasRealtime';
import { usePatchAlertaLeer } from '@/hooks/alertas';
import AlertaToast from '@/components/atomos/AlertaToast';

const AlertasToastContainer = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; alerta: Alerta }>>([]);
  const { actualizarAlerta } = usePatchAlertaLeer();

  useAlertasRealtime({
    onNuevaAlerta: (alerta) => {
      const toastId = `toast-${alerta.id_alerta}-${Date.now()}`;
      setToasts(prev => [...prev, { id: toastId, alerta }]);
    }
  });

  const handleCloseToast = (toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  const handleMarcarLeida = async (alertaId: number) => {
    try {
      await actualizarAlerta(alertaId);
    } catch (error) {
    }
  };

  // Limpiar toasts automáticamente después de un tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setToasts(prev => prev.filter(toast => {
        const toastTime = parseInt(toast.id.split('-')[2]);
        return Date.now() - toastTime < 10000; // 10 segundos
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map(({ id, alerta }) => (
        <AlertaToast
          key={id}
          alerta={alerta}
          onClose={() => handleCloseToast(id)}
          onMarcarLeida={handleMarcarLeida}
          duration={8000}
        />
      ))}
    </div>
  );
};

export default AlertasToastContainer; 