import { format } from "date-fns";

export const isISODate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value);

export const formatCellValue = (value: any) => {
  if (typeof value === "string" && isISODate(value)) {
    return format(new Date(value), "dd/MM/yyyy");
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return value ?? "";
};

export const sortData = <T,>(
  data: T[],
  column: keyof T,
  direction: "asc" | "desc" | null
): T[] => {
  if (!column || !direction) return data;

  return [...data].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    const compare = (val1: any, val2: any) => {
      if (typeof val1 === "string" && typeof val2 === "string") {
        return val1.localeCompare(val2);
      }
      if (val1 instanceof Date && val2 instanceof Date) {
        return val1.getTime() - val2.getTime();
      }
      return String(val1).localeCompare(String(val2));
    };

    return direction === "asc"
      ? compare(aValue, bValue)
      : compare(bValue, aValue);
  });
};

export const filterData = <T,>(
  data: T[],
  value: string,
  columns: { key: keyof T; filterable?: boolean }[]
): T[] => {
  if (!value) return data;
  const searchValue = value.toLowerCase();

  return data.filter((item) =>
    columns.some((column) => {
      if (!column.filterable) return false;
      const val = item[column.key];
      if (val === undefined) return false;

      if (typeof val === "string" && isISODate(val)) {
        const date = new Date(val);
        return (
          val.toLowerCase().includes(searchValue) ||
          format(date, "dd/MM/yyyy").includes(searchValue)
        );
      }
      return String(val).toLowerCase().includes(searchValue);
    })
  );
};
