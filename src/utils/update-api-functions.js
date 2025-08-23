// Script para actualizar automáticamente las funciones API que obtienen datos del backend
// para manejar los diferentes formatos de respuesta (directo, envuelto simple, doblemente envuelto)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Obtener el directorio actual del módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio raíz de la API
const API_DIR = path.join(__dirname, 'src', 'api');

// Patrón para identificar funciones get que devuelven datos
const GET_FUNCTION_PATTERN = /export\s+async\s+function\s+get(\w+)\s*\(\s*[^)]*\s*\)\s*:\s*Promise\s*<\s*([^>]+)\s*>\s*{\s*const\s+response\s*=\s*await\s*axiosInstance\.get\([^)]+\);\s*return\s+response\.data;\s*}/g;

// Importación que necesitamos añadir
const IMPORT_STATEMENT = "import { extractArrayData } from \"@/utils/responseHandler\";";

// Función para verificar si un archivo ya tiene la importación
async function hasImport(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return content.includes(IMPORT_STATEMENT) || content.includes("extractArrayData");
  } catch (error) {
    return false;
  }
}

// Función para actualizar un archivo
async function updateFile(filePath) {
  try {
    // Leer el contenido del archivo
    let content = await readFile(filePath, 'utf8');
    
    // Verificar si ya tiene la importación
    if (!await hasImport(filePath)) {
      // Añadir la importación después de las importaciones existentes
      const importRegex = /import.*?;(\r?\n|\r)/g;
      let lastImportIndex = 0;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        lastImportIndex = match.index + match[0].length;
      }
      
      if (lastImportIndex > 0) {
        content = content.slice(0, lastImportIndex) + IMPORT_STATEMENT + '\n' + content.slice(lastImportIndex);
      }
    }
    
    // Reemplazar las funciones get que devuelven directamente response.data
    content = content.replace(GET_FUNCTION_PATTERN, (match, functionName, returnType) => {
      // Extraer el nombre de la función y la URL del endpoint
      const urlMatch = match.match(/axiosInstance\.get\(\s*["']([^"']+)["']\s*\)/);
      const url = urlMatch ? urlMatch[1] : '/unknown';
      
      // Crear la nueva función que usa extractArrayData
      return `export async function get${functionName}(): Promise<${returnType}> {
  const response = await axiosInstance.get("${url}");
  return extractArrayData<${returnType.replace('[]', '')}>(response, 'get${functionName}');
}`;
    });
    
    // Guardar los cambios
    await writeFile(filePath, content, 'utf8');
    return true;
  } catch (error) {
    return false;
  }
}

// Función para recorrer recursivamente los directorios
async function processDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name.startsWith('get')) {
        await updateFile(fullPath);
      }
    }
  } catch (error) {
    return false;
  }
}

// Función principal
async function main() {
  await processDirectory(API_DIR);
}

// Ejecutar el script
main().catch(() => {});
