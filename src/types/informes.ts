

export interface MaterialesPorUsuario {
  material_nombre_material: string;
  usuario_nombre: string;
  tipo_movimiento_tipo_movimiento: string;
  total_cantidad: number;
  ultima_fecha: string;
}



export interface MovimientosHistoricos {
  movimiento_id_movimiento: number;
  movimiento_cantidad: number;
  movimiento_fecha_creacion: string;
  material_codigo_sena: string;
  material_nombre_material: string;
  tipo_movimiento_tipo_movimiento: string;
  nombre_usuario: string;
  apellido_usuario: string;
  ubicacion: string;
}

export interface MaterialesStockMinimo {
  inventario_stock: number;
  material_id_material: number;
  material_codigo_sena: string;
  material_nombre_material: string;
}

export interface MaterialesMasUtilizados {
  material_id_material: number;
  material_nombre_material: string;
  material_codigo_sena: string;
  total_movimientos: string;
}

export interface UsuariosConMasMateriales {
  usuario_id_usuario: number;
  usuario_nombre: string;
  usuario_apellido: string;
  total_materiales: number;
}

export interface EstadoInventario {
  categoria: string;
  cantidad: number;
  stock_total: number;
}







export interface MaterialesBaja {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  fecha_baja: string;
}



