import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@heroui/react";

// Tipo genérico para cualquier estructura de datos
export type Column<T> = {
  key: keyof T | "acciones"; // Agregamos "acciones" para columnas personalizadas
  label: string;
  render?: (item: T) => React.ReactNode; // Función para renderizar contenido personalizado
};

type Props<T extends { key: React.Key }> = {
  columns: Column<T>[]; // Recibe las columnas
  data: T[]; // Recibe los datos
  rowsPerPage?: number; // Cantidad de filas por página (opcional)
};

const GlobalTable = <T extends { key: React.Key }>({ columns, data, rowsPerPage = 6 }: Props<T>) => {
  const [page, setPage] = useState(1);
  const [pagedData, setPagedData] = useState<T[]>([]);

  const pages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setPagedData(data.slice(start, end));
  }, [page, data, rowsPerPage]);

  return (
    <Table
      aria-label="Dynamic Table"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        </div>
      }
      classNames={{ wrapper: "min-h-[222px]" }}
    >
      <TableHeader>
        {columns.map((col) => (
          <TableColumn key={String(col.key)}>{col.label}</TableColumn>
        ))}
      </TableHeader>

      <TableBody items={pagedData}>
        {(item: T) => (
          <TableRow key={String(item.key)}>
            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                {col.render ? col.render(item) : String(item[col.key as keyof T])}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GlobalTable;

