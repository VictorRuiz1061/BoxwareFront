import { Bell, Settings } from "lucide-react";
import Image from "@/components/atomos/Imagen";
import ThemeToggle from "@/components/atomos/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useGetRoles } from "@/hooks/roles";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { AnimatedContainer } from "../atomos";

const Header = () => {
  const { darkMode } = useTheme();
  const { roles } = useGetRoles();
  const { authState } = useAuthContext();


  const [rolNombre, setRolNombre] = useState<string>("");

  // Obtener el usuario del contexto de autenticación
  const usuarioActual = authState.user;

  useEffect(() => {
    // Si hay un usuario autenticado, buscar su rol
    if (usuarioActual) {
      
      // Obtener el ID del rol del usuario (puede estar en rol o rol_id)
      // @ts-ignore - Ignorar error de TypeScript ya que sabemos que puede tener la propiedad rol
      const rolId = usuarioActual.rol !== undefined ? usuarioActual.rol : usuarioActual.rol_id;
      
      if (rolId !== undefined) {
        // Buscar el rol por id_rol o id (para manejar diferentes formatos)
        const rol = roles.find((r) => {
          const roleId = typeof rolId === 'string' ? parseInt(rolId) : rolId;
          return r.id_rol === roleId || r.id === roleId;
        });
        
        if (rol) {
          setRolNombre(rol.nombre_rol || rol.nombre || '');
        } else {
          const roleIdNum = typeof rolId === 'string' ? parseInt(rolId) : rolId;
          setRolNombre(roleIdNum === 1 ? "Administrador" : roleIdNum === 2 ? "Vendedor" : "Usuario");
        }
      } else {
        setRolNombre("Usuario");
      }
    } else {
      setRolNombre("");
    }
  }, [usuarioActual, roles]);

  // Obtener el nombre completo del usuario
  const displayName = usuarioActual
    ? `${usuarioActual.nombre || ''} ${usuarioActual.apellido || ''}`.trim()
    : "Usuario";

  // Obtener la imagen del usuario con fallback a imagen por defecto
  // Verificar diferentes propiedades posibles para la imagen
  // @ts-ignore - Ignorar error de TypeScript ya que sabemos que puede tener diferentes propiedades para la imagen
  const userImage = usuarioActual?.imagen || 
                   // @ts-ignore
                   usuarioActual?.avatar || 
                   // @ts-ignore
                   usuarioActual?.foto || 
                   "/assets/default.jpg";
  
  // Usar la imagen del usuario
  const finalUserImage = userImage;
                   

  return (
    <AnimatedContainer animation="fadeIn" duration={1200} className="w-full">
      <header className={`${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-lg h-16 relative z-10 transition-colors duration-300`}>
        <div className={`flex items-center justify-end h-full px-6 ${darkMode ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700' : 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600'} transition-colors duration-300`}>
          <div className="flex items-center space-x-6">
            {/* Toggle de tema */}
              <ThemeToggle />

        
            {/* Configuración */}
              <Link to="/configuraciones" className={`p-2 text-white ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-500'} rounded-lg transition-all duration-300 group`}>
                <Settings size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </Link>

            {/* Separador */}
              <div className={`h-8 w-px ${darkMode ? 'bg-emerald-300/30' : 'bg-blue-300/50'}`}></div>

            {/* Perfil del usuario */}
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md transition-all duration-300">
                  <Image
                    src={finalUserImage}
                    alt={displayName}
                    isAvatar
                    size="sm"
                    radius="lg"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">{displayName}</span>
                  <span className="text-white text-xs">{rolNombre}</span>
                </div>
              </div>
          </div>
        </div>
      </header>
    </AnimatedContainer>
  );
};

export default Header;
