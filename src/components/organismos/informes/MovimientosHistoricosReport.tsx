import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getMovimientosHistoricos } from '@/api/informes/getInformes';
import { MovimientosHistoricos } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const MovimientosHistoricosReport: React.FC = () => {
  const [data, setData] = useState<MovimientosHistoricos[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // You might want to add filters for fechaInicio and fechaFin here
  const fechaInicio = undefined; // Example: new Date().toISOString().split('T')[0];
  const fechaFin = undefined;   // Example: new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getMovimientosHistoricos(fechaInicio, fechaFin);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [fechaInicio, fechaFin]);

  const columns: Column<MovimientosHistoricos>[] = [
    { header: 'ID Movimiento', accessor: 'movimiento_id_movimiento' },
    { header: 'Cantidad', accessor: 'movimiento_cantidad' },
    { header: 'Fecha Creación', accessor: 'movimiento_fecha_creacion' },
    { header: 'Código SENA', accessor: 'material_codigo_sena' },
    { header: 'Material', accessor: 'material_nombre_material' },
    { header: 'Tipo Movimiento', accessor: 'tipo_movimiento_tipo_movimiento' },
    { header: 'Nombre Usuario', accessor: 'nombre_usuario' },
    { header: 'Apellido Usuario', accessor: 'apellido_usuario' },
    { header: 'Ubicación', accessor: 'ubicacion' },
  ];

  return (
    <InformesTemplate
      title="Movimientos Históricos de Materiales"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};