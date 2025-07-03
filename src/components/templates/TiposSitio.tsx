import { useState } from "react";
import { useGetTiposSitio, usePostTipoSitio, usePutTipoSitio } from '@/hooks/tipoSitio';
import type { TipoSitio } from '@/types';
import {  AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { tipoSitioSchema } from '@/schemas';

interface TiposSitioProps {
  isInModal?: boolean;
  onTipoSitioCreated?: () => void;
}

const TiposSitio = ({ isInModal = false, onTipoSitioCreated }: TiposSitioProps) => {
  const { tiposSitio, loading } = useGetTiposSitio();
  const { crearTipoSitio } = usePostTipoSitio();
  const { actualizarTipoSitio } = usePutTipoSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<TipoSitio>[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];


  const formFieldsCreate: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true }
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true }
  ];


  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        const updatePayload = {
          id_tipo_sitio: editingId,
          nombre_tipo_sitio: values.nombre_tipo_sitio,
          estado: true,
          fecha_creacion: values.fecha_creacion || currentDate,
          fecha_modificacion: currentDate,
        } as TipoSitio;
        
        await actualizarTipoSitio(editingId, updatePayload);
        showSuccessToast('Tipo de sitio actualizado con éxito');
      } else {
        const createPayload = {
          nombre_tipo_sitio: values.nombre_tipo_sitio,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
        } as TipoSitio;

        await crearTipoSitio(createPayload);
        showSuccessToast('Tipo de sitio creado con éxito');
        
        if (onTipoSitioCreated) {
          onTipoSitioCreated();
        } else {
          window.location.reload(); // Solo recargar si no estamos en modo modal
        }
      }

      if (!isInModal) {
        setIsModalOpen(false);
      }
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el tipo de sitio');
    }
  };

  const handleToggleEstado = async (tipoSitio: TipoSitio) => {
    try {
      const nuevoEstado = !tipoSitio.estado;
      const updateData = {
        id_tipo_sitio: tipoSitio.id_tipo_sitio,
        nombre_tipo_sitio: tipoSitio.nombre_tipo_sitio,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      } as TipoSitio;

      await actualizarTipoSitio(tipoSitio.id_tipo_sitio, updateData);
      showSuccessToast(`El tipo de sitio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del tipo de sitio.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipoSitio: TipoSitio) => {
    setFormData({
      nombre_tipo_sitio: tipoSitio.nombre_tipo_sitio,
    });
    setEditingId(tipoSitio.id_tipo_sitio);
    setIsModalOpen(true);
  };

  if (isInModal) {
    return (
      <div className="w-full">
        <Form
          fields={formFieldsCreate}
          onSubmit={async (values) => {
            try {
              const currentDate = new Date().toISOString();
              const createPayload = {
                nombre_tipo_sitio: values.nombre_tipo_sitio,
                estado: true,
                fecha_creacion: currentDate,
                fecha_modificacion: currentDate,
              } as TipoSitio;

              await crearTipoSitio(createPayload);
              showSuccessToast('Tipo de sitio creado con éxito');
              if (onTipoSitioCreated) {
                onTipoSitioCreated();
              }
            } catch (error) {
              showErrorToast('Error al crear el tipo de sitio');
            }
          }}
          buttonText="Crear"
          schema={tipoSitioSchema}
        />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Sitio</h1>
        </AnimatedContainer>
      
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Sitio
          </Boton>
        </AnimatedContainer>

        {loading ? (
          <p>Cargando tipos de sitio...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: tiposSitio,
            idField: 'id_tipo_sitio',
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
                  {editingId ? "Editar Tipo de Sitio" : "Crear Nuevo Tipo de Sitio"}
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
                  schema={tipoSitioSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default TiposSitio;
