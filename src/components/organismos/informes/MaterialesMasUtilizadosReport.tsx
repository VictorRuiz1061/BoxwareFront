import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getMaterialesMasUtilizados } from '@/api/informes/getInformes';
import { MaterialesMasUtilizados } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const MaterialesMasUtilizadosReport: React.FC = () => {
  const [data, setData] = useState<MaterialesMasUtilizados[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // You might want to add a filter for limite here
  const limite = 10; // Default value

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getMaterialesMasUtilizados(limite);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [limite]);

  const columns: Column<MaterialesMasUtilizados>[] = [
    { header: 'ID Material', accessor: 'material_id_material' },
    { header: 'Nombre Material', accessor: 'material_nombre_material' },
    { header: 'Código SENA', accessor: 'material_codigo_sena' },
    { header: 'Total Movimientos', accessor: 'total_movimientos' },
  ];

  return (
    <InformesTemplate
      title="Materiales Más Utilizados o Solicitados"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};