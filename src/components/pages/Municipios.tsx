import { useState } from "react";
import { Alert } from "@heroui/react";
import { useGetMunicipios } from '@/hooks/municipios/useGetMunicipios';
import { usePostMunicipio } from '@/hooks/municipios/usePostMunicipio';
import { usePutMunicipio } from '@/hooks/municipios/usePutMunicipio';
import { Municipio } from '@/types/municipio';
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import Boton from "@/components/atomos/Boton";
import { Column, createEntityTable } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { municipioSchema } from '@/schemas/municipio.schema';

const Municipios = () => {
  const { municipios, loading } = useGetMunicipios();
  const { crearMunicipio } = usePostMunicipio();
  const { actualizarMunicipio } = usePutMunicipio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

  const columns: Column<Municipio & { key: number }>[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFields: FormField[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", type: "text", required: true },
  ];
    
  const handleSubmit = async (values: Record<string, string>) => {
    try {      
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Actualizar municipio existente
        const updatePayload = {
          id_municipio: editingId,
          nombre_municipio: values.nombre_municipio,
          estado: true,
          fecha_modificacion: currentDate,
        };
        
        await actualizarMunicipio(editingId, updatePayload);
        setSuccessAlertText('Municipio actualizado con éxito');
      } else {
        // Crear nuevo municipio
        // No incluimos id_municipio ya que el backend lo generará automáticamente
        const createPayload: Omit<Municipio, 'id_municipio'> = {
          nombre_municipio: values.nombre_municipio,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };
        
        await crearMunicipio(createPayload as any);
        setSuccessAlertText('Municipio creado con éxito');
      }
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el municipio:', error);
      alert('Error al guardar el municipio');
    }
  };

  const handleToggleEstado = async (municipio: Municipio) => {
    try {
      const nuevoEstado = !municipio.estado;
      const updateData = {
        ...municipio,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString(),
      };
      
      await actualizarMunicipio(municipio.id_municipio, updateData);
      setSuccessAlertText(`El municipio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      setSuccessAlertText("Error al cambiar el estado del municipio.");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

    const handleEdit = (municipio: Municipio) => {
    // Asegurarse de que todos los campos necesarios estén presentes
    setFormData({
      nombre_municipio: municipio.nombre_municipio,
    });
    setEditingId(municipio.id_municipio);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Municipios</h1>
        </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Municipio
        </Boton>
      </AnimatedContainer>

      {loading ? (
          <p>Cargando municipios...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: municipios,
            idField: 'id_municipio',
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
                  {editingId ? "Editar Municipio" : "Crear Nuevo Municipio"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    ...(editingId 
                      ? { fecha_modificacion: formData.fecha_modificacion ?? new Date().toISOString().split('T')[0] }
                      : { fecha_creacion: formData.fecha_creacion ?? new Date().toISOString().split('T')[0] })
                  }}
                  schema={municipioSchema}
                />
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

export default (Municipios);
