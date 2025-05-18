// Este archivo sirve como puente para mantener compatibilidad con el código existente
// Reexporta las funciones desde la estructura organizada en carpetas
import { getSitios as getSitiosFn } from './sitio/getSitios';
import { postSitio } from './sitio/postSitio';
import { putSitio } from './sitio/putSitio';

// Exportamos las funciones con los nombres que espera el código existente
export const getSitios = getSitiosFn;
export const crearSitio = postSitio;
export const actualizarSitio = (id: number, data: any) => putSitio({ id, data });

// También exportamos los hooks para quienes quieran usarlos
export { useGetSitios } from './sitio/getSitios';
export { usePostSitio } from './sitio/postSitio';
export { usePutSitio } from './sitio/putSitio';
