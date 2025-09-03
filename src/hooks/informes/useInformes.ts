import { useQuery } from "@tanstack/react-query";
import {
  getMaterialesPorUsuario,
  getMovimientosHistoricos,
  getMaterialesStockMinimo,
  getMaterialesMasUtilizados,
  getUsuariosConMasMateriales,
  getEstadoInventario,
  getMaterialesBaja,
} from "@/api/informes/getInformes";

export function useGetMaterialesPorUsuario() {
  return useQuery({
    queryKey: ["materiales-por-usuario"],
    queryFn: getMaterialesPorUsuario,
  });
}

export function useGetMovimientosHistoricos(fechaInicio?: string, fechaFin?: string) {
  return useQuery({
    queryKey: ["movimientos-historicos", fechaInicio, fechaFin],
    queryFn: () => getMovimientosHistoricos(fechaInicio, fechaFin),
  });
}

export function useGetMaterialesStockMinimo(stockMinimo?: number) {
  return useQuery({
    queryKey: ["materiales-stock-minimo", stockMinimo],
    queryFn: () => getMaterialesStockMinimo(stockMinimo),
  });
}

export function useGetMaterialesMasUtilizados(limite?: number) {
  return useQuery({
    queryKey: ["materiales-mas-utilizados", limite],
    queryFn: () => getMaterialesMasUtilizados(limite),
  });
}

export function useGetUsuariosConMasMateriales(limite?: number) {
  return useQuery({
    queryKey: ["usuarios-con-mas-materiales", limite],
    queryFn: () => getUsuariosConMasMateriales(limite),
  });
}

export function useGetEstadoInventario() {
  return useQuery({
    queryKey: ["estado-inventario"],
    queryFn: getEstadoInventario,
  });
}

export function useGetMaterialesBaja() {
  return useQuery({
    queryKey: ["materiales-baja"],
    queryFn: getMaterialesBaja,
  });
}