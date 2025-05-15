import React, { useState } from "react";

import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetSitios } from '../../hooks/sitio/useGetSitios';
import { usePostSitio } from '../../hooks/sitio/usePostSitio';
import { usePutSitio } from '../../hooks/sitio/usePutSitio';
import { useDeleteSitio } from '../../hooks/sitio/useDeleteSitio';
import { Sitio } from '../../types/sitio';
import { useGetUsuarios } from '../../hooks/usuario/useGetUsuarios';
import { useGetTiposSitio } from '../../hooks/tipoSitio/useGetTiposSitio';



const Sitios = () => {
  const { sitios, loading } = useGetSitios();
  const { crearSitio } = usePostSitio();
  const { actualizarSitio } = usePutSitio();
  const { eliminarSitio } = useDeleteSitio();
  const { usuarios } = useGetUsuarios();
  const { tiposSitio } = useGetTiposSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Sitio>>({});

  const columns: Column<Sitio>[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", filterable: true },
    { key: "ubicacion", label: "Ubicación", filterable: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (sitio) => (
        <span className={sitio.estado ? "text-green-600" : "text-red-600"}>
          {sitio.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
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
          <Boton
            onClick={() => handleDelete(sitio.id_sitio)}
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
        alert("Por favor selecciona un tipo de sitio válido.");
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
        alert('Sitio actualizado con éxito');
      } else {
        await crearSitio(sitioData);
        alert('Sitio creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el sitio:', error);
      alert('Error al guardar el sitio');
    }
  };

  // Eliminar sitio
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este sitio?')) return;
    try {
      await eliminarSitio(id);
      alert('Sitio eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el sitio:', error);
      alert('Error al eliminar el sitio');
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
    </>
  );
};

export default React.memo(Sitios);
