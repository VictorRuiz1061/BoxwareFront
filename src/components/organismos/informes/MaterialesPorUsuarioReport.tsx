import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getMaterialesPorUsuario } from '@/api/informes/getInformes';
import { MaterialesPorUsuario } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const MaterialesPorUsuarioReport: React.FC = () => {
  const [data, setData] = useState<MaterialesPorUsuario[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getMaterialesPorUsuario();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const columns: Column<MaterialesPorUsuario>[] = [
    { header: 'Usuario', accessor: 'usuario_nombre' },
    { header: 'Material', accessor: 'material_nombre_material' },
    { header: 'Tipo Movimiento', accessor: 'tipo_movimiento_tipo_movimiento' },
    { header: 'Cantidad Total', accessor: 'total_cantidad' },
    { header: 'Última Fecha', accessor: 'ultima_fecha' },
  ];

  return (
    <InformesTemplate
      title="Informe de Materiales Asignados por Usuario"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};