import { useState, useEffect, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Select, SelectItem, Input } from "@heroui/react";
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { format } from 'date-fns';

// Tipo genérico para cualquier estructura de datos
export type Column<T> = {
  key: keyof T | "acciones";
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean; // Indica si la columna se puede ordenar
  filterable?: boolean; // Indica si la columna se puede filtrar
};

type Props<T extends { key: React.Key }> = {
  columns: Column<T>[];
  defaultFilterableColumns?: boolean;
  data: T[];
  rowsPerPage?: number;
  defaultSortColumn?: keyof T; // Columna por defecto para ordenar
  defaultSortDirection?: 'asc' | 'desc'; // Dirección de ordenamiento por defecto
};

type SortDirection = 'asc' | 'desc' | null;

const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];

const GlobalTable = <T extends { key: React.Key }>({ 
  columns, 
  data, 
  rowsPerPage: initialRowsPerPage = 10,
  defaultSortColumn,
  defaultSortDirection = 'asc'
}: Props<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [filterValue, setFilterValue] = useState("");
  const [pagedData, setPagedData] = useState<T[]>([]);
  
  // Función para ordenar datos
  const sortData = (data: T[], column: keyof T, direction: SortDirection): T[] => {
    if (!column || !direction) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  // Función para filtrar datos
  const filterData = (data: T[], value: string): T[] => {
    if (!value) return data;
    const searchValue = value.toLowerCase();
    return data.filter(item => 
      columns.some(column => {
        if (column.key === 'acciones' || !column.filterable) return false;
        const val = item[column.key as keyof T];
        if (val === undefined) return false;
        // Si es fecha ISO, comparar contra ISO y contra formateada
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val)) {
          const date = new Date(val);
          const formatted = format(date, 'dd/MM/yyyy');
          return val.toLowerCase().includes(searchValue) || formatted.includes(searchValue);
        }
        return String(val).toLowerCase().includes(searchValue);
      })
    );
  };

  // Procesar datos con ordenamiento y filtrado
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Aplicar filtro
    result = filterData(result, filterValue);
    
    // Aplicar ordenamiento
    if (sortColumn && sortDirection) {
      result = sortData(result, sortColumn, sortDirection);
    }
    
    return result;
  }, [data, filterValue, sortColumn, sortDirection]);

  const pages = Math.ceil(processedData.length / rowsPerPage);

  // Actualizar datos paginados
  useEffect(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setPagedData(processedData.slice(start, end));
  }, [page, processedData, rowsPerPage]);

  // Manejar cambio de ordenamiento
  const handleSortChange = (column: keyof T) => {
    if (!columns.find(col => col.key === column)?.sortable) return;
    
    setSortDirection(prev => {
      if (sortColumn !== column) return 'asc';
      if (prev === 'asc') return 'desc';
      if (prev === 'desc') return null;
      return 'asc';
    });
    setSortColumn(prev => prev === column && sortDirection === 'desc' ? null : column);
  };

  // Resetear página al cambiar filtro o filas por página
  useEffect(() => {
    setPage(1);
  }, [filterValue, rowsPerPage]);

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      <div className="flex justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar</span>
          <Select
            className="w-20"
            value={String(rowsPerPage)}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            aria-label="Rows per page">
          
            {rowsPerPageOptions.map((option) => (
              <SelectItem key={option}>
                {String(option)}
              </SelectItem>
            ))}
          </Select>
          <span className="text-sm text-gray-500">por página</span>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <Table
        aria-label="Dynamic Table"
        bottomContent={
          <div className="flex justify-between items-center px-4 py-2">
            <div className="text-sm text-gray-500">
              Mostrando {((page - 1) * rowsPerPage) + 1} a {Math.min(page * rowsPerPage, processedData.length)} de {processedData.length} registros
            </div>
            <Pagination
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
              className="text-blue-600 [&_button]:!bg-blue-600 [&_button.active]:!bg-blue-600 [&_button:hover]:!bg-blue-500"
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px] bg-white rounded-lg shadow-sm",
          th: "bg-gray-50/50",
          td: "py-3"
        }}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn 
              key={String(col.key)}
              className={col.sortable ? 'cursor-pointer select-none' : ''}
              onClick={() => col.sortable && handleSortChange(col.key as keyof T)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                {col.sortable && sortColumn === col.key && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody 
          items={pagedData}
          emptyContent={"No se encontraron registros"}
        >
          {(item: T) => (
            <TableRow key={String(item.key)}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render ? col.render(item) :
                    (() => {
                      const value = item[col.key as keyof T];
                      // Detectar si es una fecha ISO
                      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value)) {
                        const date = new Date(value);
                        return format(date, 'dd/MM/yyyy');
                      }
                      return String(value);
                    })()
                  }
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GlobalTable;
