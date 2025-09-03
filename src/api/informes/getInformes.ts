import axiosInstance from "@/api/axiosConfig";

import { extractArrayData } from "@/utils/responseHandler";
import {
  MaterialesPorUsuario,
  MovimientosHistoricos,
  MaterialesStockMinimo,
  MaterialesMasUtilizados,
  UsuariosConMasMateriales,
  EstadoInventario,
  MaterialesBaja,
} from "@/types/informes";

// 1. Informe de materiales asignados por usuario
export async function getMaterialesPorUsuario(): Promise<MaterialesPorUsuario[]> {
  const response = await axiosInstance.get("/materiales-por-usuario");
  return extractArrayData<MaterialesPorUsuario>(response);
}



// 3. Movimientos históricos de materiales
export async function getMovimientosHistoricos(fechaInicio?: string, fechaFin?: string): Promise<MovimientosHistoricos[]> {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);
  const response = await axiosInstance.get(`/movimientos-historicos`, { params });
  return extractArrayData<MovimientosHistoricos>(response);
}

// 4. Materiales próximos a agotarse (stock mínimo)
export async function getMaterialesStockMinimo(stockMinimo?: number): Promise<MaterialesStockMinimo[]> {
  const params = new URLSearchParams();
  if (stockMinimo) params.append("stockMinimo", stockMinimo.toString());
  const response = await axiosInstance.get(`/materiales-stock-minimo`, { params });
  return extractArrayData<MaterialesStockMinimo>(response);
}

// 5. Materiales más utilizados o solicitados
export async function getMaterialesMasUtilizados(limite?: number): Promise<MaterialesMasUtilizados[]> {
  const params = new URLSearchParams();
  if (limite) params.append("limite", limite.toString());
  const response = await axiosInstance.get(`/materiales-mas-utilizados`, { params });
  return extractArrayData<MaterialesMasUtilizados>(response);
}

// 6. Usuarios con mayor cantidad de materiales asignados
export async function getUsuariosConMasMateriales(limite?: number): Promise<UsuariosConMasMateriales[]> {
  const params = new URLSearchParams();
  if (limite) params.append("limite", limite.toString());
  const response = await axiosInstance.get(`/usuarios-con-mas-materiales`, { params });
  return extractArrayData<UsuariosConMasMateriales>(response);
}

// 7. Estado general del inventario
export async function getEstadoInventario(): Promise<EstadoInventario[]> {
  const response = await axiosInstance.get("/estado-inventario");
  return extractArrayData<EstadoInventario>(response);
}







// 10. Materiales dados de baja o fuera de servicio
export async function getMaterialesBaja(): Promise<MaterialesBaja[]> {
  const response = await axiosInstance.get("/materiales-baja");
  return extractArrayData<MaterialesBaja>(response);
}




