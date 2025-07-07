/**
 * Utility to extract data from different API response formats
 * Handles both direct arrays and nested response structures from different backend implementations
 */

/**
 * Extrae datos de array desde varios formatos de respuesta:
 * - Respuesta directa de array
 * - Respuesta con un nivel de envoltura { data: [...], statusCode, message, timestamp }
 * - Respuesta con doble envoltura { data: { data: [...], statusCode, message }, statusCode, message }
 * 
 * @param response La respuesta de la API
 * @param endpoint El nombre del endpoint (para propósitos de logging)
 * @returns El array de datos extraído o un array vacío si no se encontraron datos válidos
 */
export function extractArrayData<T>(response: any): T[] {
  // Caso 1: Respuesta directa (formato original de BoxWare-Nest)
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  // Caso 2: Respuesta con un nivel de envoltura { data: [...], statusCode, message, timestamp }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    // Verificar si data es un array directamente
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Caso 3: Respuesta con doble envoltura { data: { data: [...], statusCode, message }, statusCode, message }
    if (typeof response.data.data === 'object' && 'data' in response.data.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    }
  }
  
  // Si no es ninguno de los formatos esperados, devolver un array vacío
  return [];
}

/**
 * Extrae un objeto único desde varios formatos de respuesta:
 * - Respuesta directa de objeto
 * - Respuesta con un nivel de envoltura { data: {...}, statusCode, message, timestamp }
 * - Respuesta con doble envoltura { data: { data: {...}, statusCode, message }, statusCode, message }
 * 
 * @param response La respuesta de la API
 * @param endpoint El nombre del endpoint (para propósitos de logging)
 * @returns El objeto extraído o null si no se encontraron datos válidos
 */
export function extractObjectData<T>(response: any): T | null {
  // Caso 1: Respuesta directa (formato original)
  if (response.data && typeof response.data === 'object' && !('data' in response.data) && !Array.isArray(response.data)) {
    return response.data;
  }
  
  // Caso 2: Respuesta con un nivel de envoltura { data: {...}, statusCode, message, timestamp }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    if (typeof response.data.data === 'object' && !Array.isArray(response.data.data) && !('data' in response.data.data)) {
      return response.data.data;
    }
    
    // Caso 3: Respuesta con doble envoltura { data: { data: {...}, statusCode, message }, statusCode, message }
    if (typeof response.data.data === 'object' && 'data' in response.data.data && 
        typeof response.data.data.data === 'object' && !Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    }
  }
  
  // Si no es ninguno de los formatos esperados, devolver null
    return null;
}
