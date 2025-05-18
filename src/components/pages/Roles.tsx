import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { usePostRol } from '@/hooks/roles/usePostRol';
import { usePutRol } from '@/hooks/roles/usePutRol';
import Boton from '@/components/atomos/Boton';
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import { rolSchema } from '@/schemas/rol.schema';
import { Alert } from "@heroui/react";
import Toggle from "@/components/atomos/Toggle";
import { Rol } from '@/types/rol';

const Roles = () => {
  const { roles, loading } = useGetRoles();
  const { crearRol } = usePostRol();
  const { actualizarRol } = usePutRol();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Rol>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<Rol & { key: number }>[] = [
    { key: "nombre_rol", label: "Nombre del Rol", filterable: true },
    { key: "descripcion", label: "Descripción", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { 
      key: "estado", 
      label: "Estado",
      filterable: true,
      render: (rol) => (
        <Toggle 
          isOn={rol.estado} 
          onToggle={() => handleToggleEstado(rol)}
        />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (rol) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(rol)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  // Campos base para ambos formularios
  const baseFields: FormField[] = [
    { key: "nombre_rol", label: "Nombre del Rol", type: "text", required: true },
    { key: "descripcion", label: "Descripción", type: "text", required: true },
  ];
  // Campos adicionales sólo para edición
  const editFields: FormField[] = [
    {
      key: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" }
      ]
    },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];
  // Selección dinámica de campos
  const formFields: FormField[] = editingId ? [...baseFields, ...editFields] : baseFields;

  // Crear o actualizar rol
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Estado: sólo se toma del form si es edición, si no siempre es 'Activo'
      const hoy = new Date().toISOString().split('T')[0];
      const estadoValue = editingId ? values.estado : 'Activo';
      const payload = {
        nombre_rol: values.nombre_rol.trim(),
        descripcion: values.descripcion.trim(),
        estado: estadoValue === "Activo",
        fecha_creacion: values.fecha_creacion,
        fecha_modificacion: editingId ? (values.fecha_modificacion || hoy) : hoy,
      };
      if (editingId) {
        await actualizarRol(editingId, { id: editingId, ...payload });
        setSuccessAlertText('Rol actualizado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearRol(payload);
        setSuccessAlertText('Rol creado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Cambiar el estado (activo/inactivo) de un rol
  const handleToggleEstado = async (rol: Rol) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !rol.estado;
      
      // Crear un objeto RolUpdate con los datos mínimos necesarios
      // para la actualización, incluyendo la propiedad 'id'
      const updateData = {
        id: rol.id_rol,
        nombre_rol: rol.nombre_rol,
        descripcion: rol.descripcion,
        estado: nuevoEstado,
        fecha_creacion: rol.fecha_creacion,
        fecha_modificacion: new Date().toISOString().split('T')[0],
      };
      
      console.log(`Cambiando estado de rol ${rol.id_rol} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      
      // Actualizar el rol en el servidor
      await actualizarRol(rol.id_rol, updateData);
      
      // Mostrar mensaje de éxito
      setSuccessAlertText(`El rol fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // La invalidación de la cache de React Query se maneja automáticamente 
      // en el hook usePutRol cuando se completa la mutación
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setSuccessAlertText(`Error al cambiar el estado del rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Abrir modal para crear nuevo rol
  const handleCreate = () => {
    // Inicializar con la fecha actual para fecha_creacion
    const today = new Date().toISOString().split('T')[0];
    setFormData({ fecha_creacion: today });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar rol existente
  const handleEdit = (rol: Rol) => {
    setFormData({
      ...rol,
      estado: rol.estado ? "Activo" : "Inactivo",
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
              onPress={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 mb-4 hover:bg-blue-700"
            >
              Crear Nuevo Rol
            </Boton>
          </AnimatedContainer>

          {/* Tabla de roles */}
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {loading ? (
              <p>Cargando roles...</p>
            ) : (
              <GlobalTable columns={columns} data={roles.map(rol => ({ ...rol, key: rol.id_rol }))} rowsPerPage={6} />
            )}
          </AnimatedContainer>

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
                  </h2>
                  <Form
                    fields={formFields}
                    initialValues={{
                      nombre_rol: formData.nombre_rol || '',
                      descripcion: formData.descripcion || '',
                      estado: typeof formData.estado === 'boolean' ? (formData.estado ? "Activo" : "Inactivo") : "Activo",
                      fecha_creacion: formData.fecha_creacion || ''
                    }}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    schema={rolSchema}
                  />
                  <div className="flex justify-end mt-4">
                    <Boton
                      onPress={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cerrar
                    </Boton>
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          )}

          {showSuccessAlert && (
            <div className="fixed top-4 right-4 z-50">
              <Alert
                hideIconWrapper
                color="success"
                description={successAlertText}
                title="¡Éxito!"
                variant="solid"
                onClose={() => setShowSuccessAlert(false)}
              />
            </div>
          )}
        </div>
    </>
  );
};

export default React.memo(Roles);
