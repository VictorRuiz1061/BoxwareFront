import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface InformesTemplateProps<T> {
  title: string;
  data: T[] | undefined;
  columns: Column<T>[];
  isLoading: boolean;
  error: Error | null;
  children?: React.ReactNode; // For filters or other controls
}

export function InformesTemplate<T extends object>({
  title,
  data,
  columns,
  isLoading,
  error,
  children,
}: InformesTemplateProps<T>) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Visualización del informe.
          </p>
        </div>
      </div>

      {children && <div className="my-4">{children}</div>}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading && <p>Cargando...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {!isLoading && !error && data && (
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.header}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-0"
                        >
                          {String(row[col.accessor] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
             {!isLoading && !error && (!data || data.length === 0) && (
                <p className="text-center py-4">No hay datos para mostrar.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}