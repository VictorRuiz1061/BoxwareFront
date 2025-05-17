import React, { useState } from "react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import Toggle from "../atomos/Toggle";
import AnimatedContainer from "../atomos/AnimatedContainer";
import AlertDialog from "../atomos/AlertDialog";
import { Alert } from "@heroui/react";
import { useGetAreas } from '../../hooks/areas/useGetAreas';
import { usePostArea } from '../../hooks/areas/usePostArea';
import { usePutArea } from '../../hooks/areas/usePutArea';
import { Area } from '../../types/area';
import { useGetSedes } from '../../hooks/sedes/useGetSedes';
import { areaSchema } from '@/schemas/area.schema';
 
const Areas = () => {
  const { areas, loading } = useGetAreas();
  const { crearArea } = usePostArea();
  const { actualizarArea } = usePutArea();
  const { sedes } = useGetSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Area>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
  });

  const columns: Column<Area>[] = [
    { key: "nombre_area", label: "Nombre del Área", filterable: true },
    {
      key: "sede_id",
      label: "Sede",
      filterable: true,
      render: (area) => {
        const sede = sedes.find(s => s.id_sede === area.sede_id);
        return sede ? sede.nombre_sede : area.sede_id;
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Última Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (area) => (
        <Toggle 
          isOn={area.estado} 
          onToggle={() => handleToggleEstado(area)}
        />
      )
    },
    {
      key: "acciones",  
      label: "Acciones",
      render: (area) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(area)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
    { key: "sede_id", label: "Sede", type: "select", required: true, options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })) },
  ];

  // Crear o actualizar área
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      console.log('Form submitted with values:', values);
      
      // Verificar que el token JWT esté presente para la autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        setAlert({
          isOpen: true,
          title: "Error de autenticación",
          message: "No hay sesión activa. Por favor inicia sesión nuevamente.",
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      // Validar con zod
      const parsed = areaSchema.safeParse(values);
      if (!parsed.success) {
        console.error('Errores de validación:', parsed.error.errors);
        setAlert({
          isOpen: true,
          title: "Error de validación",
          message: parsed.error.errors.map(e => e.message).join('\n'),
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      // Buscar la sede seleccionada por id
      const sedeId = Number(values.sede_id);
      if (isNaN(sedeId)) {
        console.error('ID de sede inválido:', values.sede_id);
        setAlert({
          isOpen: true,
          title: "Error",
          message: "Por favor selecciona una sede válida",
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      const sedeSeleccionada = sedes.find(s => s.id_sede === sedeId);
      if (!sedeSeleccionada) {
        console.error('Sede no encontrada para ID:', sedeId);
        setAlert({
          isOpen: true,
          title: "Error",
          message: "La sede seleccionada no existe",
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      console.log('Sede seleccionada:', sedeSeleccionada);
      
      // Preparar el payload con todos los campos requeridos por la tabla SQL
      const currentDate = new Date().toISOString();
      const payload = {
        nombre_area: String(values.nombre_area),
        sede_id: sedeId,
        estado: true, // Por defecto activo
        fecha_creacion: editingId ? (values as any).fecha_creacion : currentDate,
        fecha_modificacion: currentDate,
        id_area: editingId || 0 // Usar 0 para nuevas áreas, el backend generará el ID real
      };
      
      console.log('Payload preparado:', payload);
      
      if (editingId) {
        console.log('Actualizando área existente con ID:', editingId);
        await actualizarArea(editingId, { ...payload, id_area: editingId });
        setSuccessAlertText("El área fue actualizada correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        console.log('Creando nueva área');
        await crearArea(payload);
        setSuccessAlertText("El área fue creada correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error: any) {
      console.error('Error detallado al guardar el área:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setAlert({
        isOpen: true,
        title: "Error",
        message: `Error al guardar el área: ${error.message}`,
        onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar estado de área (activo/inactivo)
  const handleToggleEstado = async (area: Area) => {
    try {
      const nuevoEstado = !area.estado;
      // Creamos un objeto con solo los campos que necesitamos actualizar
      await actualizarArea(area.id_area, { 
        id_area: area.id_area,
        nombre_area: area.nombre_area,
        sede_id: area.sede_id,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      });
      setSuccessAlertText(`El área fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error("Error al cambiar el estado del área:", error);
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Error al cambiar el estado del área",
        onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  // Abrir modal para crear nueva área
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar área existente
  const handleEdit = (area: Area) => {
    setFormData(area);
    setEditingId(area.id_area);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Áreas</h1>
        </AnimatedContainer>

        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Área
          </Boton>
        </AnimatedContainer>

          {loading || sedes.length === 0 ? (
            <p>Cargando áreas y sedes...</p>
          ) : (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
              <GlobalTable
                columns={columns}
                data={areas
                  .map((area) => ({ ...area, key: area.id_area }))
                  // Ordenar por estado: activos primero, inactivos después
                  .sort((a, b) => {
                    if (a.estado === b.estado) return 0;
                    return a.estado ? -1 : 1; // -1 pone a los activos primero
                  })
                }
                rowsPerPage={6}
                defaultSortColumn="estado"
                defaultSortDirection="desc"
              />
            </AnimatedContainer>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer
                animation="scaleIn"
                duration={300}
                className="w-full max-w-lg"
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {editingId ? "Editar Área" : "Crear Nueva Área"}
                  </h2>
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={{
                      ...formData,
                      id_area: formData.id_area?.toString(),
                      sede_id: formData.sede_id ? String(formData.sede_id) : ''
                    }}
                    schema={areaSchema}
                  />
                  <div className="flex justify-end mt-4">
                    <Boton
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 mr-2"
                    >
                      Cancelar
                    </Boton>
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          )}
        </div>

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

      <AlertDialog
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onConfirm}
        confirmText="Aceptar"
        cancelText=""
      />
    </>
  );
};

export default React.memo(Areas);
