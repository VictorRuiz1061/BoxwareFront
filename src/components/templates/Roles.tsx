import { useState } from 'react';
import { useGetRoles, usePostRol, usePutRol } from '@/hooks/roles';
import { Rol } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { rolSchema } from '@/schemas';

interface RolesProps {
  isInModal?: boolean;
  onRolCreated?: () => void;
}

const Roles = ({ isInModal = false, onRolCreated }: RolesProps) => {
  const { roles, loading } = useGetRoles();
  const { crearRol } = usePostRol();
  const { actualizarRol } = usePutRol();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Rol>[] = [
    { key: "nombre_rol", label: "Nombre", filterable: true },
    { key: "descripcion", label: "Descripción", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true }
  ];

  const formFields: FormField[] = [
    { 
      key: "nombre_rol", 
      label: "Nombre", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "descripcion", 
      label: "Descripción", 
      type: "text", 
      required: true,
      className: "col-span-1"
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const fechaActual = new Date().toISOString().split('T')[0];

      if (editingId) {
        const updatePayload = {
          nombre_rol: values.nombre_rol,
          descripcion: values.descripcion,
          fecha_modificacion: fechaActual
        };

        await actualizarRol(editingId, updatePayload);
        showSuccessToast("Rol actualizado correctamente");
      } else {
        const createPayload: Omit<Rol, 'id_rol' | 'fecha_modificacion'> = {
          nombre_rol: values.nombre_rol,
          descripcion: values.descripcion,
          fecha_creacion: fechaActual,
          estado: true
        };

        await crearRol(createPayload as any);
        showSuccessToast("Rol creado correctamente");
        
        // Si estamos en modo modal y hay callback, lo llamamos
        if (isInModal && onRolCreated) {
          onRolCreated();
        }
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      showErrorToast('Error al guardar el rol');
    }
  };

  const handleToggleEstado = async (rol: Rol) => {
    try {
      const nuevoEstado = !rol.estado;
      const updateData = {
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarRol(rol.id_rol, updateData);
      showSuccessToast(`El rol fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del rol.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rol: Rol) => {
    setFormData({
      nombre_rol: rol.nombre_rol,
      descripcion: rol.descripcion
    });
    setEditingId(rol.id_rol);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        {!isInModal && (
          <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
            <h1 className="text-xl font-bold mb-4">Gestión de Roles</h1>
          </AnimatedContainer>
        )}
      
        {!isInModal && (
          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
            <Boton
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded-md"
            >
              Crear Nuevo Rol
            </Boton>
          </AnimatedContainer>
        )}

        {!isInModal && loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando roles...</p>
          </div>
        ) : !isInModal ? (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: roles,
              idField: 'id_rol',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </AnimatedContainer>
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Crear Nuevo Rol</h2>
            <Form
              fields={formFields}
              onSubmit={handleSubmit}
              buttonText="Crear"
              schema={rolSchema}
            />
          </div>
        )}

        {/* Modal para crear/editar rol (solo se muestra cuando no estamos en modo modal) */}
        {!isInModal && isModalOpen && (
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
                  {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
                </h2>
                
                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={formData}
                    schema={rolSchema}
                  />
                </div>
              </div>
            </AnimatedContainer>  
          </div> 
        )}
      </div>
    </>
  );
};

export default Roles;
