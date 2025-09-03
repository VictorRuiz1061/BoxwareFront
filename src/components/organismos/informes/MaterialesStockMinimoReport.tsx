import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getMaterialesStockMinimo } from '@/api/informes/getInformes';
import { MaterialesStockMinimo } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const MaterialesStockMinimoReport: React.FC = () => {
  const [data, setData] = useState<MaterialesStockMinimo[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // You might want to add a filter for stockMinimo here
  const stockMinimo = 10; // Default value

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getMaterialesStockMinimo(stockMinimo);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [stockMinimo]);

  const columns: Column<MaterialesStockMinimo>[] = [
    { header: 'ID Material', accessor: 'material_id_material' },
    { header: 'Nombre Material', accessor: 'material_nombre_material' },
    { header: 'Código SENA', accessor: 'material_codigo_sena' },
    { header: 'Stock', accessor: 'inventario_stock' },
  ];

  return (
    <InformesTemplate
      title="Materiales Próximos a Agotarse (Stock Mínimo)"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};