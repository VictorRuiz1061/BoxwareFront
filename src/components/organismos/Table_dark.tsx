import { useState, useEffect, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Select, SelectItem, Input } from "@heroui/react";
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from "../../context/ThemeContext";

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
  const { darkMode } = useTheme();
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
    if (sortColumn === column) {
      // Si ya estamos ordenando por esta columna, cambiar dirección
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es una columna diferente, establecer como nueva columna de ordenamiento
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`w-full ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* Controles superiores */}
      <div className={`flex justify-between items-center gap-4 p-4 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Mostrar</span>
          <Select
            className={`w-20 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            value={String(rowsPerPage)}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            aria-label="Rows per page">
          
            {rowsPerPageOptions.map((option) => (
              <SelectItem key={option} className={darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}>
                {String(option)}
              </SelectItem>
            ))}
          </Select>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>por página</span>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={18} />
            <Input
              className={`pl-10 ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'}`}
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
          <div className={`flex justify-between items-center px-4 py-2 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Mostrando {((page - 1) * rowsPerPage) + 1} a {Math.min(page * rowsPerPage, processedData.length)} de {processedData.length} registros
            </div>
            <Pagination
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
              className={`${darkMode ? 'text-blue-400 [&_button]:!bg-gray-700 [&_button.active]:!bg-blue-600 [&_button:hover]:!bg-gray-600' : 'text-blue-600 [&_button]:!bg-blue-600 [&_button.active]:!bg-blue-600 [&_button:hover]:!bg-blue-500'}`}
            />
          </div>
        }
        classNames={{
          wrapper: `min-h-[222px] rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`,
          th: darkMode ? 'bg-gray-700 text-gray-200 border-b border-gray-600' : 'bg-gray-50/50 text-gray-700 border-b border-gray-200',
          td: `py-3 ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-800'}`
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
          emptyContent={<div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No se encontraron registros</div>}
        >
          {(item: T) => (
            <TableRow key={String(item.key)} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
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
                      // Manejar objetos para evitar el error "Objects are not valid as React child"
                      if (typeof value === 'object' && value !== null) {
                        return JSON.stringify(value);
                      }
                      return value !== undefined && value !== null ? String(value) : '';
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
