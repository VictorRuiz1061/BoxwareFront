import React, { useState } from "react";
import { Alert } from "@heroui/react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetTipoMateriales } from '../../hooks/tipoMaterial/useGetTipoMateriales';
import { usePostTipoMaterial } from '../../hooks/tipoMaterial/usePostTipoMaterial';
import { usePutTipoMaterial } from '../../hooks/tipoMaterial/usePutTipoMaterial';
import { useDeleteTipoMaterial } from '../../hooks/tipoMaterial/useDeleteTipoMaterial';
import type { TipoMaterial } from '../../types/tipoMaterial';
import ToggleEstadoBoton from "@/components/atomos/Toggle";
import AlertDialog from '@/components/atomos/AlertDialog';

const TipoMaterial = () => {
  const { tipoMateriales, loading, fetchTipoMateriales } = useGetTipoMateriales();
  const { crearTipoMaterial } = usePostTipoMaterial();
  const { actualizarTipoMaterial } = usePutTipoMaterial();
  const { eliminarTipoMaterial } = useDeleteTipoMaterial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoMaterial>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');


  const columns: Column<TipoMaterial>[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (tipoMaterial) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          tipoMaterial.estado 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {tipoMaterial.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoMaterial) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(tipoMaterial)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
          >
            Editar
          </Boton>
          <ToggleEstadoBoton
            estado={Boolean(tipoMaterial.estado)}
            onToggle={() => handleToggleEstado(tipoMaterial)}
            size={18}
          />
          <Boton
            onClick={() => handleDelete(tipoMaterial.id_tipo_material)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", type: "text", required: true },
    { key: "estado", label: "Estado", type: "select", required: true, options: ["Activo", "Inactivo"] },
  ];
  if (editingId) {
    formFields.push({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
  } else {
    formFields.push({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
  }



  // Crear o actualizar tipo de material
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const estadoBool = values.estado === true || values.estado === "true" || values.estado === "Activo";
      if (editingId) {
        await actualizarTipoMaterial(editingId, {
          tipo_elemento: values.tipo_elemento as string,
          estado: estadoBool,
          fecha_modificacion: values.fecha_modificacion as string,
          fecha_creacion: formData.fecha_creacion as string || '',
        });
        setSuccessAlertText('Tipo de material actualizado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearTipoMaterial({
          tipo_elemento: values.tipo_elemento as string,
          estado: estadoBool,
          fecha_creacion: values.fecha_creacion as string,
          fecha_modificacion: values.fecha_creacion as string,
        });
        setSuccessAlertText('Tipo de material creado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      fetchTipoMateriales();
    } catch (error) {
      console.error('Error al guardar el tipo de material:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al guardar el tipo de material: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };


  // Cambiar el estado (activo/inactivo) de un tipo de material
  const handleToggleEstado = async (tipoMaterial: TipoMaterial) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !tipoMaterial.estado;
      const updateData: Partial<TipoMaterial> = {
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Cambiando estado de tipo de material ${tipoMaterial.id_tipo_material} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      await actualizarTipoMaterial(tipoMaterial.id_tipo_material, updateData);
      setSuccessAlertText(`El tipo de material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchTipoMateriales(); // Actualizar la lista de tipos de material
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del tipo de material: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Eliminar tipo de material
  const handleDelete = async (id: number) => {
    setAlert({
      isOpen: true,
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este tipo de material?',
      onConfirm: async () => {
        try {
          await eliminarTipoMaterial(id);
          setSuccessAlertText('Tipo de material eliminado con éxito');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          fetchTipoMateriales();
          setAlert(a => ({ ...a, isOpen: false }));
        } catch (error) {
          console.error('Error al eliminar el tipo de material:', error);
          setAlert({
            isOpen: true,
            title: 'Error',
            message: `Error al eliminar el tipo de material: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
          });
        }
      },
    });
  };


  // Abrir modal para crear nuevo tipo de material
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar tipo de material existente
  const handleEdit = (tipoMaterial: TipoMaterial) => {
    setFormData(tipoMaterial);
    setEditingId(tipoMaterial.id_tipo_material);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Material</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Material
          </Boton>

          {/* Tabla de tipos de material */}
          {loading ? (
            <p>Cargando tipos de material...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={tipoMateriales.map(tm => ({ ...tm, key: tm.id_tipo_material }))} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Tipo de Material" : "Crear Nuevo Tipo de Material"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    estado: typeof formData.estado === 'boolean'
                      ? (formData.estado ? "Activo" : "Inactivo")
                      : (formData.estado === "true" ? "Activo" : "Inactivo")
                  }}
                />
                <div className="flex justify-end mt-4">
                  <Boton
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cerrar
                  </Boton>
                </div>
              </div>
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
        onCancel={() => setAlert(a => ({ ...a, isOpen: false }))}
        confirmText="Aceptar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default React.memo(TipoMaterial);
