import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getMaterialesBaja } from '@/api/informes/getInformes';
import { MaterialesBaja } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const MaterialesBajaReport: React.FC = () => {
  const [data, setData] = useState<MaterialesBaja[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getMaterialesBaja();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const columns: Column<MaterialesBaja>[] = [
    { header: 'ID Material', accessor: 'id_material' },
    { header: 'Nombre Material', accessor: 'nombre_material' },
    { header: 'Código SENA', accessor: 'codigo_sena' },
    { header: 'Fecha de Baja', accessor: 'fecha_baja' },
  ];

  return (
    <InformesTemplate
      title="Materiales Dados de Baja o Fuera de Servicio"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};