import React, { useState } from "react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetAreas } from '../../hooks/areas/useGetAreas';
import { usePostArea } from '../../hooks/areas/usePostArea';
import { usePutArea } from '../../hooks/areas/usePutArea';
import { useDeleteArea } from '../../hooks/areas/useDeleteArea';
import { Area } from '../../types/area';
import { useGetSedes } from '../../hooks/sedes/useGetSedes';
import { areaSchema } from '@/schemas/area.schema';
 
const Areas = () => {
  const { areas, loading } = useGetAreas();
  const { crearArea } = usePostArea();
  const { actualizarArea } = usePutArea();
  const { eliminarArea } = useDeleteArea();
  const { sedes } = useGetSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Area>>({});

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
          <Boton
            onClick={() => handleDelete(area.id_area)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
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
        console.error('No hay token JWT disponible. La autenticación podría fallar.');
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        return;
      }
      
      // Validar con zod
      const parsed = areaSchema.safeParse(values);
      if (!parsed.success) {
        console.error('Errores de validación:', parsed.error.errors);
        alert(parsed.error.errors.map(e => e.message).join('\n'));
        return;
      }
      
      // Buscar la sede seleccionada por id
      const sedeId = Number(values.sede_id);
      if (isNaN(sedeId)) {
        console.error('ID de sede inválido:', values.sede_id);
        alert('Por favor selecciona una sede válida');
        return;
      }
      
      const sedeSeleccionada = sedes.find(s => s.id_sede === sedeId);
      if (!sedeSeleccionada) {
        console.error('Sede no encontrada para ID:', sedeId);
        alert('La sede seleccionada no existe');
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
        alert('Área actualizada con éxito');
      } else {
        console.log('Creando nueva área');
        await crearArea(payload);
        alert('Área creada con éxito');
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
      alert(`Error al guardar el área: ${error.message}`);
    }
  };

  // Eliminar área
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta área?")) return;
    try {
      await eliminarArea(id);
      alert("Área eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      alert("Error al eliminar el área");
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
          <h1 className="text-xl font-bold mb-4">Gestión de Áreas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Área
          </Boton>

          {loading || sedes.length === 0 ? (
            <p>Cargando áreas y sedes...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={areas.map((area) => ({ ...area, key: area.id_area }))}
              rowsPerPage={6}
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
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
              </div>
            </div>
          )}
        </div>
    </>
  );
};

export default React.memo(Areas);
