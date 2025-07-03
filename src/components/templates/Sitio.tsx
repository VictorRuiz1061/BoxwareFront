import { useState } from "react";
import { useGetSitios, usePostSitio, usePutSitio } from '@/hooks/sitio';
import { useGetTiposSitio } from '@/hooks/tipoSitio';
import type { Sitio } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { sitioSchema } from '@/schemas';

const Sitios = () => {
  const { sitios, loading } = useGetSitios();
  const { crearSitio } = usePostSitio();
  const { actualizarSitio } = usePutSitio();
  const { tiposSitio } = useGetTiposSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const columns: Column<Sitio>[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", filterable: true },
    { key: "ubicacion", label: "Ubicación", filterable: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", filterable: true },
    { key: "tipo_sitio_id", label: "Tipo de Sitio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];


  const formFieldsCreate: FormField[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", type: "text", required: true },
    { key: "ubicacion", label: "Ubicación", type: "text", required: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", type: "text", required: true },
    { 
      key: "tipo_sitio_id", 
      label: "Tipo de Sitio", 
      type: "select", 
      required: true,
      options: tiposSitio.map(tipo => ({ label: tipo.nombre_tipo_sitio, value: tipo.id_tipo_sitio }))
    }
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", type: "text", required: true },
    { key: "ubicacion", label: "Ubicación", type: "text", required: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", type: "text", required: true },
    { 
      key: "tipo_sitio_id", 
      label: "Tipo de Sitio", 
      type: "select", 
      required: true,
      options: tiposSitio.map(tipo => ({ label: tipo.nombre_tipo_sitio, value: tipo.id_tipo_sitio }))
    }
  ];


  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      // Convertir tipo_sitio_id a número
      const tipo_sitio_id = parseInt(values.tipo_sitio_id);
      
      if (editingId) {
        // Actualizar sitio existente
        const updatePayload = {
          id_sitio: editingId,
          nombre_sitio: values.nombre_sitio,
          ubicacion: values.ubicacion,
          ficha_tecnica: values.ficha_tecnica,
          tipo_sitio_id: tipo_sitio_id,
          estado: true,
          fecha_modificacion: currentDate,
        } as Sitio;
        
        console.log('Actualizando sitio:', updatePayload);
        await actualizarSitio(editingId, updatePayload);
        showSuccessToast('Sitio actualizado con éxito');
      } else {
        // Crear nuevo sitio
        const createPayload = {
          nombre_sitio: values.nombre_sitio,
          ubicacion: values.ubicacion,
          ficha_tecnica: values.ficha_tecnica,
          tipo_sitio_id: tipo_sitio_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        } as Sitio;

        console.log('Creando sitio:', createPayload);
        await crearSitio(createPayload);
        showSuccessToast('Sitio creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Error al guardar el sitio');
    }
  };

  const handleToggleEstado = async (sitio: Sitio) => {
    try {
      const nuevoEstado = !sitio.estado;
      const updateData = {
        id_sitio: sitio.id_sitio,
        nombre_sitio: sitio.nombre_sitio,
        ubicacion: sitio.ubicacion,
        ficha_tecnica: sitio.ficha_tecnica,
        tipo_sitio_id: sitio.tipo_sitio_id,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      } as Sitio;

      await actualizarSitio(sitio.id_sitio, updateData);
      showSuccessToast(`El sitio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      console.error('Error:', error);
      showErrorToast("Error al cambiar el estado del sitio.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sitio: Sitio) => {
    setFormData({
      nombre_sitio: sitio.nombre_sitio,
      ubicacion: sitio.ubicacion,
      ficha_tecnica: sitio.ficha_tecnica,
      tipo_sitio_id: sitio.tipo_sitio_id.toString()
    });
    setEditingId(sitio.id_sitio);
    setIsModalOpen(true);
  };


  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Sitios</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Sitio
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando sitios...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: sitios,
            idField: 'id_sitio',
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
                  {editingId ? "Editar Sitio" : "Crear Nuevo Sitio"}
                </h2>
                <Form
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData}
                  schema={sitioSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Sitios;
