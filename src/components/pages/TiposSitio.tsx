import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { tipoSitioSchema } from '@/schemas/tipoSitio.schema';
import { useGetTiposSitio } from '@/hooks/tipoSitio/useGetTiposSitio';
import { usePostTipoSitio } from '@/hooks/tipoSitio/usePostTipoSitio';
import { usePutTipoSitio } from '@/hooks/tipoSitio/usePutTipoSitio';
import { TipoSitio } from '@/types/tipoSitio';
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";

import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";

const TiposSitio = () => {
  const { tiposSitio, loading, refetch } = useGetTiposSitio();
  const { crearTipoSitio } = usePostTipoSitio();
  const { actualizarTipoSitio } = usePutTipoSitio();
  const fetchTiposSitio = () => refetch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoSitio>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<TipoSitio & { key: any }>[] = [
    { key: "id_tipo_sitio", label: "ID", filterable: true },
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (tipoSitio) => (
        <Toggle 
          isOn={tipoSitio.estado || false} 
          onToggle={() => handleToggleEstado(tipoSitio)}
        />
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoSitio) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(tipoSitio)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  // Crear o actualizar tipo de sitio
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      // Validar con zod
      const parsed = tipoSitioSchema.safeParse(values);
      if (!parsed.success) {
        setSuccessAlertText(parsed.error.errors.map(e => e.message).join('\n'));
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      // Asegurarse de que el campo estado sea booleano
      const estado = typeof values.estado === 'boolean' ? values.estado : Boolean(values.estado);
      
      try {
        if (editingId) {
          // Para actualización, preparar los datos necesarios
          const updateData: Partial<TipoSitio> = {
            nombre_tipo_sitio: String(values.nombre_tipo_sitio),
            fecha_modificacion: new Date().toISOString().split('T')[0],
            estado: estado
          };
          
          console.log('Actualizando tipo de sitio:', editingId, updateData);
          await actualizarTipoSitio(editingId, updateData);
          setSuccessAlertText('El tipo de sitio fue actualizado correctamente.');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          fetchTiposSitio(); // Actualizar la lista de tipos de sitio
        } else {
          // Para creación, preparar todos los datos necesarios
          const createData: Omit<TipoSitio, 'id_tipo_sitio'> = {
            nombre_tipo_sitio: String(values.nombre_tipo_sitio),
            fecha_creacion: String(values.fecha_creacion),
            fecha_modificacion: new Date().toISOString().split('T')[0],
            estado: estado
          };
          
          console.log('Creando nuevo tipo de sitio:', createData);
          await crearTipoSitio(createData);
          setSuccessAlertText('El tipo de sitio fue creado correctamente.');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          fetchTiposSitio(); // Actualizar la lista de tipos de sitio
        }
      } catch (error) {
        console.error('Error al guardar:', error);
        setSuccessAlertText(`Error al ${editingId ? 'actualizar' : 'crear'} el tipo de sitio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el tipo de sitio:", error);
      setSuccessAlertText('Ocurrió un error al guardar el tipo de sitio.');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Cambiar el estado (activo/inactivo) de un tipo de sitio
  const handleToggleEstado = async (tipoSitio: TipoSitio) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !tipoSitio.estado;
      const updateData: Partial<TipoSitio> = {
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Cambiando estado de tipo de sitio ${tipoSitio.id_tipo_sitio} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      await actualizarTipoSitio(tipoSitio.id_tipo_sitio, updateData);
      setSuccessAlertText(`El tipo de sitio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchTiposSitio(); // Actualizar la lista de tipos de sitio
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setSuccessAlertText(`Error al cambiar el estado del tipo de sitio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Abrir modal para crear nuevo tipo de sitio
  const handleCreate = () => {
    // Inicializar con fechas actuales
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      fecha_creacion: today,
      fecha_modificacion: today,
      estado: true
    });
    setEditingId(null);
    setIsModalOpen(true); 
  };

  // Abrir modal para editar tipo de sitio existente
  const handleEdit = (tipoSitio: TipoSitio) => {
    // Convertir fechas a formato string para los inputs date
    const formattedTipoSitio = {
      ...tipoSitio,
      fecha_creacion: tipoSitio.fecha_creacion ? tipoSitio.fecha_creacion.split('T')[0] : '',
      fecha_modificacion: new Date().toISOString().split('T')[0],
    };
    setFormData(formattedTipoSitio);
    setEditingId(tipoSitio.id_tipo_sitio);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
          {/* Alerta de éxito */}
          {showSuccessAlert && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
              {successAlertText}
            </div>
          )}

          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Sitio</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Sitio
          </Boton>

          {/* Tabla de tipos de sitio */}
          {loading ? (
            <p>Cargando tipos de sitio...</p>
          ) : (
            <GlobalTable 
              columns={columns} 
              data={tiposSitio.map((ts: TipoSitio) => ({ ...ts, key: ts.id_tipo_sitio }))} 
              rowsPerPage={6} 
            />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Tipo de Sitio" : "Crear Nuevo Tipo de Sitio"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    nombre_tipo_sitio: formData.nombre_tipo_sitio || '',
                    estado: formData.estado
                  }}
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
            </div>
          )}
        </div>
    </>
  );
};

export default React.memo(TiposSitio);
