import { useState } from "react";
import { useGetPermisos, usePostPermiso, usePutPermiso } from '@/hooks/permisos';
import { useGetRoles } from '@/hooks/roles';
import { useGetModulos } from '@/hooks/modulos';
import type { Permiso, Modulo, Rol } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { permisoSchema } from '@/schemas';
import Roles from "./Roles";
import Modulos from "./Modulos";

const Permisos = () => {
  const { permisos, loading } = useGetPermisos();
  const { crearPermiso } = usePostPermiso();
  const { actualizarPermiso } = usePutPermiso();
  const { roles } = useGetRoles();
  const { modulos } = useGetModulos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRolModalOpen, setIsRolModalOpen] = useState(false);
  const [isModuloModalOpen, setIsModuloModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
    
  const renderModulo = (modulo_id: number | Modulo) => {
    if (typeof modulo_id === 'object' && modulo_id !== null) {
      return String(modulo_id.descripcion_ruta || '');
    }
  };

  const renderRol = (rol_id: number | Rol) => {
    if (typeof rol_id === 'object' && rol_id !== null) {
      return String(rol_id.nombre_rol || '');
    }
  };

  // Extendiendo el tipo para incluir los nuevos campos de permisos
  type PermisoWithKey = Permiso & { key: number };

  const columns: Column<PermisoWithKey>[] = [
    { key: "nombre", label: "Nombre", filterable: true},
    {
      key: "modulo_id",
      label: "Módulo",
      filterable: true,
      render: permiso => {
        return renderModulo(permiso.modulo_id);
      }
    },
    {
      key: "rol_id",
      label: "Rol",
      filterable: true,
      render: permiso => {
        return renderRol(permiso.rol_id);
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
  ];

  const formFields: FormField[] = [
    { 
      key: "nombre", 
      label: "Nombre", 
      type: "text", 
      required: true,
      className: "col-span-1" 
    },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      className: "col-span-1",
      options: roles.map(r => ({ label: r.nombre_rol, value: r.id_rol })),
      extraButton: {
        icon: "+",
        onClick: () => setIsRolModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "modulo_id",
      label: "Módulo",
      type: "select",
      required: true,
      className: "col-span-1",
      options: modulos.map(m => ({ label: m.descripcion_ruta, value: m.id_modulo })),
      extraButton: {
        icon: "+",
        onClick: () => setIsModuloModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    { 
      key: "puede_ver", 
      label: "Permiso para Ver", 
      type: "toggle", 
      required: false,
      className: "col-span-2",
      description: "Permite al usuario ver los registros"
    },
    { 
      key: "puede_crear", 
      label: "Permiso para Crear", 
      type: "toggle", 
      required: false,
      className: "col-span-2",
      description: "Permite al usuario crear nuevos registros"
    },
    { 
      key: "puede_actualizar", 
      label: "Permiso para Actualizar", 
      type: "toggle", 
      required: false,
      className: "col-span-2",
      description: "Permite al usuario actualizar registros existentes"
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // Convertir IDs a números
      const modulo_id = parseInt(values.modulo_id);
      const rol_id = parseInt(values.rol_id);
      
      // Fecha actual para timestamps - mantener el formato completo ISO
      const currentDate = new Date().toISOString();
      
      // Convertir valores de toggle a booleanos
      const puede_ver = Boolean(values.puede_ver);
      const puede_crear = Boolean(values.puede_crear);
      const puede_actualizar = Boolean(values.puede_actualizar);
      
      if (editingId) {
        // Buscar el permiso original para mantener los campos requeridos
        const permisoOriginal = permisos.find(p => p.id_permiso === editingId);
        if (!permisoOriginal) {
          throw new Error('Permiso no encontrado');
        }
        
        // Crear un objeto que cumpla con la estructura esperada por la API
        const updatePayload: Permiso = {
          id_permiso: editingId,
          nombre: values.nombre,
          modulo_id: modulo_id,
          rol_id: rol_id,
          estado: true,
          puede_ver,
          puede_crear,
          puede_actualizar,
          fecha_creacion: permisoOriginal.fecha_creacion || currentDate,
        };
        
        await actualizarPermiso(editingId, updatePayload);
        showSuccessToast('Permiso actualizado correctamente');
      } else {
        // Para crear un nuevo permiso, usamos un tipo que omite id_permiso
        // ya que este será generado por el backend
        const newPermiso: Omit<Permiso, 'id_permiso'> & { id_permiso?: never } = {
          nombre: values.nombre,
          modulo_id: modulo_id,
          rol_id: rol_id,
          estado: true,
          puede_ver,
          puede_crear,
          puede_actualizar,
          fecha_creacion: currentDate,
        };
        
        console.log('Enviando permiso:', newPermiso);
        // Usamos type assertion para satisfacer TypeScript
        await crearPermiso(newPermiso as any);
        showSuccessToast('Permiso creado correctamente');  
      }
      
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el permiso');
    }
  };

  const handleToggleEstado = async (permiso: Permiso) => {
    try {
      const nuevoEstado = !permiso.estado;
      const updateData = {
        ...permiso,
        estado: nuevoEstado,
      };

      await actualizarPermiso(permiso.id_permiso, updateData);
      showSuccessToast(`El permiso fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del permiso.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permiso: Permiso) => {
    setFormData({
      nombre: permiso.nombre,
      modulo_id: typeof permiso.modulo_id === 'object' ? permiso.modulo_id.id_modulo.toString() : permiso.modulo_id.toString(),
      rol_id: typeof permiso.rol_id === 'object' ? permiso.rol_id.id_rol.toString() : permiso.rol_id.toString(),
      puede_ver: permiso.puede_ver || false,
      puede_crear: permiso.puede_crear || false,
      puede_actualizar: permiso.puede_actualizar || false,
      puede_eliminar: permiso.puede_eliminar || false
    });
    setEditingId(permiso.id_permiso);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Permisos</h1>
        </AnimatedContainer>
      
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded-md"
          >
            Crear Nuevo Permiso
          </Boton>
        </AnimatedContainer>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando permisos...</p>
          </div>
        ) : (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: permisos,
              idField: 'id_permiso',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </AnimatedContainer>
        )}

        {/* Modal para crear/editar permiso */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-4xl">
              <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative bg-white dark:bg-gray-800">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Permiso" : "Crear Nuevo Permiso"}
                </h2>
                
                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={formData}
                    schema={permisoSchema}
                  />
                </div>
              </div>
            </AnimatedContainer>  
          </div> 
        )}

        {/* Modal para crear rol */}
        {isRolModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsRolModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <Roles isInModal={true} onRolCreated={() => {
                setIsRolModalOpen(false);
              }} />
            </div>
          </div>
        )}

        {/* Modal para crear módulo */}
        {isModuloModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsModuloModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <Modulos isInModal={true} onModuloCreated={() => {
                setIsModuloModalOpen(false);
              }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Permisos;
