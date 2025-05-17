import React, { useState } from "react";
import { Alert } from "@heroui/react";

import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetSitios } from '../../hooks/sitio/useGetSitios';
import { usePostSitio } from '../../hooks/sitio/usePostSitio';
import { usePutSitio } from '../../hooks/sitio/usePutSitio';
import { Sitio } from '../../types/sitio';
import { useGetUsuarios } from '../../hooks/usuario/useGetUsuarios';
import { useGetTiposSitio } from '../../hooks/tipoSitio/useGetTiposSitio';
import Toggle from "../atomos/Toggle";
import AlertDialog from "../atomos/AlertDialog";



const Sitios = () => {
  const { sitios, loading } = useGetSitios();
  const { crearSitio } = usePostSitio();
  const { actualizarSitio } = usePutSitio();
  const { usuarios } = useGetUsuarios();
  const { tiposSitio } = useGetTiposSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Sitio>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

  const columns: Column<Sitio>[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", filterable: true },
    { key: "ubicacion", label: "Ubicación", filterable: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (sitio) => (
        <Toggle 
          isOn={sitio.estado} 
          onToggle={() => handleToggleEstado(sitio)}
        />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (sitio) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(sitio)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", type: "text", required: true },
    { key: "ubicacion", label: "Ubicación", type: "text", required: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", type: "text", required: true },
    { key: "tipo_sitio_id", label: "Tipo de Sitio", type: "select", required: true, options: tiposSitio.map(t => t.nombre_tipo_sitio) },
    { key: "persona_encargada_id", label: "Persona Encargada", type: "select", required: false, options: usuarios.map(u => u.nombre) },
  ];
  if (editingId) {
    formFields.push({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
  } else {
    formFields.push({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
  }



  // Crear o actualizar sitio
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const usuarioSeleccionado = usuarios.find(u => u.nombre === values.persona_encargada_id);
      const tipoSitioSeleccionado = tiposSitio.find(t => t.nombre_tipo_sitio === values.tipo_sitio_id);
      if (!tipoSitioSeleccionado) {
        setAlert({
          isOpen: true,
          title: 'Error',
          message: "Por favor selecciona un tipo de sitio válido.",
          onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      // Determinar el estado del sitio (activo/inactivo)
      const estado = typeof values.estado === 'boolean' ? values.estado : Boolean(values.estado);
      
      const sitioData = {
        nombre_sitio: String(values.nombre_sitio),
        ubicacion: String(values.ubicacion),
        ficha_tecnica: String(values.ficha_tecnica),
        estado: estado,
        tipo_sitio_id: tipoSitioSeleccionado.id_tipo_sitio,
        fecha_modificacion: editingId
          ? String(values.fecha_modificacion)
          : String(values.fecha_creacion),
        fecha_creacion: editingId
          ? String(formData.fecha_creacion || "")
          : String(values.fecha_creacion),
        persona_encargada_id: usuarioSeleccionado?.id_usuario,
        sede_id: 1
      };
      
      if (editingId) {
        await actualizarSitio(editingId, sitioData);
        setSuccessAlertText('Sitio actualizado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearSitio(sitioData);
        setSuccessAlertText('Sitio creado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el sitio:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al guardar el sitio: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar el estado (activo/inactivo) de un sitio
  const handleToggleEstado = async (sitio: Sitio) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !sitio.estado;
      
      // Crear un objeto para la actualización con los datos necesarios
      const updateData = {
        nombre_sitio: sitio.nombre_sitio,
        ubicacion: sitio.ubicacion,
        ficha_tecnica: sitio.ficha_tecnica,
        estado: nuevoEstado,
        tipo_sitio_id: sitio.tipo_sitio_id,
        fecha_creacion: sitio.fecha_creacion,
        fecha_modificacion: new Date().toISOString().split('T')[0],
        persona_encargada_id: sitio.persona_encargada_id,
        sede_id: sitio.sede_id,
      };
      
      console.log(`Cambiando estado de sitio ${sitio.id_sitio} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      
      // Actualizar el sitio en el servidor
      await actualizarSitio(sitio.id_sitio, updateData);
      
      // Mostrar mensaje de éxito
      setSuccessAlertText(`El sitio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del sitio: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Abrir modal para crear nuevo sitio
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar sitio existente
  const handleEdit = (sitio: Sitio) => {
    setFormData(sitio);
    setEditingId(sitio.id_sitio);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Sitios</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Sitio
          </Boton>

          {/* Tabla de sitios */}
          {loading ? (
            <p>Cargando sitios...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={sitios.map(s => ({ ...s, key: s.id_sitio }))} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Sitio" : "Crear Nuevo Sitio"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...Object.fromEntries(
                      Object.entries(formData).map(([key, value]) => [key, value?.toString() || ""])
                    ),
                    persona_encargada_id: usuarios.find(u => u.id_usuario === formData.persona_encargada_id)?.nombre || '',
                    tipo_sitio_id: tiposSitio.find(t => t.id_tipo_sitio === formData.tipo_sitio_id)?.nombre_tipo_sitio || '',
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
        onCancel={alert.onConfirm}
        confirmText="Aceptar"
        cancelText=""
      />
    </>
  );
};

export default React.memo(Sitios);
