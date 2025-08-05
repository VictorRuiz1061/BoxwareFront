// Main API barrel file
// Export axios config
export { default as axiosInstance } from './axiosConfig';

// Export all API modules

export * from './areas';
export * from './auth';
export * from './centros';
export * from './Elemento';
export * from './fichas';
export * from './inventario';
export * from './materiales';
export * from './modulos';
export * from './movimiento';
export * from './municipios';
export * from './permisos';
export * from './programas';
export * from './rol';
export * from './sedes';
export * from './sitio';
export * from './tipoMaterial';
export * from './tipoMovimiento';
export * from './tipoSitio';
export * from './usuario';
export * from './upload/uploadImage';

// Export any standalone API files
// export * from './informes.api';
