import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      host: true,
      port: parseInt(env.VITE_PORT || '', 10),
    },
    define: {
      // Asegurarse de que las variables de entorno estén disponibles
      __APP_ENV__: JSON.stringify(env.VITE_NODE_ENV || mode),
    },
  }
})