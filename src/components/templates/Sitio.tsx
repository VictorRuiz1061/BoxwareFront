import { useState } from "react";
import { useGetSitios, usePostSitio, usePutSitio } from '@/hooks/sitio';
import { useGetTiposSitio } from '@/hooks/tipoSitio';
import type { Sitio as SitioType } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { sitioSchema } from '@/schemas';
import TiposSitio from './TiposSitio';

interface SitioProps {
  isInModal?: boolean;
  onSitioCreated?: () => void;
}

const Sitio = ({ isInModal = false, onSitioCreated }: SitioProps) => {
  const { sitios, loading } = useGetSitios();
  const { crearSitio } = usePostSitio();
  const { actualizarSitio } = usePutSitio();
  const { tiposSitio } = useGetTiposSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTipoSitioModalOpen, setIsTipoSitioModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const columns: Column<SitioType>[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", filterable: true },
    { key: "ubicacion", label: "Ubicación", filterable: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", filterable: true },
    { 
      key: "tipo_sitio_id", 
      label: "Tipo de Sitio", 
      filterable: true,
      render: (sitio) => {
        const tipoSitio = tiposSitio.find(t => t.id_tipo_sitio === sitio.tipo_sitio_id);
        return tipoSitio ? tipoSitio.nombre_tipo_sitio : `ID: ${sitio.tipo_sitio_id}`;
      }
    },
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
      options: tiposSitio.map(tipo => ({ label: tipo.nombre_tipo_sitio, value: tipo.id_tipo_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoSitioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    }
  ];

  const formFieldsEdit = formFieldsCreate;

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const currentDate = new Date().toISOString();
      const tipo_sitio_id = parseInt(values.tipo_sitio_id);
      
      if (editingId) {
        const sitioToUpdate = sitios.find(s => s.id_sitio === editingId);
        if (!sitioToUpdate) {
          throw new Error('No se encontró el sitio a actualizar');
        }

        const updatePayload: SitioType = {
          ...sitioToUpdate,
          nombre_sitio: values.nombre_sitio,
          ubicacion: values.ubicacion,
          ficha_tecnica: values.ficha_tecnica,
          tipo_sitio_id,
          fecha_modificacion: currentDate,
        };
        
        await actualizarSitio(editingId, updatePayload);
        showSuccessToast('Sitio actualizado con éxito');
      } else {
        const createPayload: SitioType = {
          id_sitio: 0, // El backend ignorará este valor
          nombre_sitio: values.nombre_sitio,
          ubicacion: values.ubicacion,
          ficha_tecnica: values.ficha_tecnica,
          tipo_sitio_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearSitio(createPayload);
        showSuccessToast('Sitio creado con éxito');
        if (onSitioCreated) {
          onSitioCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el sitio');
    }
  };

  const handleToggleEstado = async (sitio: SitioType) => {
    try {
      const updateData: SitioType = {
        ...sitio,
        estado: !sitio.estado,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarSitio(sitio.id_sitio, updateData);
      showSuccessToast(`El sitio fue ${!sitio.estado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del sitio.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sitio: SitioType) => {
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
    <div className="w-full">
      {!isInModal && (
        <>
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
        </>
      )}

      {loading ? (
        <p>Cargando sitios...</p>
      ) : (
        !isInModal && (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns,
              data: sitios,
              idField: 'id_sitio',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </AnimatedContainer>
        )
      )}

      {(isModalOpen || isInModal) && (
        <div className={isInModal ? "" : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"}>
          <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
            <div className={`p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative ${isInModal ? "" : "bg-white dark:bg-gray-800"}`}>
              {!isInModal && (
                <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <span className="text-gray-800 font-bold">×</span>
                </button>
              )}
              
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

      {/* Modal para crear tipo de sitio */}
      {isTipoSitioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => setIsTipoSitioModalOpen(false)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <span className="text-gray-800 font-bold">×</span>
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Crear Nuevo Tipo de Sitio</h2>
            <TiposSitio 
              isInModal={true} 
              onTipoSitioCreated={() => {
                setIsTipoSitioModalOpen(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sitio;
