import React, { useEffect, useState } from 'react';
import { InformesTemplate } from '@/components/templates/informes/InformesTemplate';
import { getUsuariosConMasMateriales } from '@/api/informes/getInformes';
import { UsuariosConMasMateriales } from '@/types/informes';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

export const UsuariosConMasMaterialesReport: React.FC = () => {
  const [data, setData] = useState<UsuariosConMasMateriales[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // You might want to add a filter for limite here
  const limite = 10; // Default value

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getUsuariosConMasMateriales(limite);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [limite]);

  const columns: Column<UsuariosConMasMateriales>[] = [
    { header: 'ID Usuario', accessor: 'usuario_id_usuario' },
    { header: 'Nombre', accessor: 'usuario_nombre' },
    { header: 'Apellido', accessor: 'usuario_apellido' },
    { header: 'Total Materiales', accessor: 'total_materiales' },
  ];

  return (
    <InformesTemplate
      title="Usuarios con Mayor Cantidad de Materiales Asignados"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};