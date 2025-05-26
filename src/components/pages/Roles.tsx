import { useState } from 'react';
import { showSuccessToast, showErrorToast } from "@/components/atomos/Toast";
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { usePostRol } from '@/hooks/roles/usePostRol';
import { usePutRol } from '@/hooks/roles/usePutRol';
import { Rol } from '@/types/rol';
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import Boton from "@/components/atomos/Boton";
import { Column, createEntityTable } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { rolSchema } from '@/schemas/rol.schema';

const Roles = () => {
  const { roles, loading } = useGetRoles();
  const { crearRol } = usePostRol();
  const { actualizarRol } = usePutRol();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Rol & { key: number }>[] = [
    { key: "nombre_rol", label: "Nombre del Rol", filterable: true },
    { key: "descripcion", label: "Descripción", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación" },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_rol", label: "Nombre del Rol", type: "text", required: true },
    { 
      key: "descripcion", 
      label: "Descripción", 
      type: "text", 
      required: true, 
    },
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_rol", label: "Nombre del Rol", type: "text", required: true },
    { 
      key: "descripcion", 
      label: "Descripción", 
      type: "text", 
      required: true, 
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      console.log('Form submitted with values:', values);
      
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Actualizar rol existente
        const updatePayload = {
          id_rol: editingId,
          nombre_rol: values.nombre_rol,
          descripcion: values.descripcion,
          estado: true,
          fecha_modificacion: currentDate,
        };
        
        console.log('Updating rol with payload:', updatePayload);
        await actualizarRol(editingId, updatePayload);
        console.log('Rol updated successfully');
        // Usar el nuevo Toast en lugar de la alerta
        showSuccessToast('Rol actualizado con éxito');
      } else {
        const createPayload: Omit<Rol, 'id_rol'> = {
          nombre_rol: values.nombre_rol,
          descripcion: values.descripcion,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        console.log('Creating rol with payload:', createPayload);
        await crearRol(createPayload as any);
        console.log('Rol created successfully');
        showSuccessToast('Rol creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      // Log the error for debugging
      console.error('Error saving rol:', error);
      // Reemplazar alert con nuestro nuevo Toast
      showErrorToast('Error al guardar el rol');
    }
  };

  const handleToggleEstado = async (rol: Rol) => {
    try {
      const nuevoEstado = !rol.estado;
      const updateData = {
        id_rol: rol.id_rol,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarRol(rol.id_rol, updateData);
      // Usar el nuevo Toast en lugar de la alerta
      showSuccessToast(`El rol fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      // Usar el nuevo Toast para mostrar el error
      showErrorToast("Error al cambiar el estado del rol.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rol: Rol) => {
    // Convertir los valores a string para el formulario
    setFormData({
      nombre_rol: rol.nombre_rol,
      descripcion: rol.descripcion,
    });
    setEditingId(rol.id_rol);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Roles</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Rol
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando roles...</p>
        ) : (
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
        </AnimatedContainer>)}

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  
                  <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
                </h2>
                <Form
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    ...(editingId 
                      ? { fecha_modificacion: new Date().toISOString().split('T')[0] }
                      : { fecha_creacion: new Date().toISOString().split('T')[0] })
                  }}
                  schema={rolSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Roles;
