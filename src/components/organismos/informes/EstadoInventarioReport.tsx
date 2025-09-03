import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getEstadoInventario } from '@/api/informes/getInformes';
import { EstadoInventario } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const EstadoInventarioReport: React.FC = () => {
  const [data, setData] = useState<EstadoInventario[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getEstadoInventario();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const columns: Column<EstadoInventario>[] = [
    { header: 'Categoría', accessor: 'categoria' },
    { header: 'Cantidad', accessor: 'cantidad' },
    { header: 'Stock Total', accessor: 'stock_total' },
  ];

  return (
    <InformesTemplate
      title="Estado General del Inventario"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};