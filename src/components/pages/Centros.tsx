import { useState } from "react";
import { showSuccessToast, showErrorToast } from "@/components/atomos/Toast";
import { useGetMunicipios } from '@/hooks/municipios/useGetMunicipios';
import { useGetCentros } from '@/hooks/centros/useGetCentros';
import { usePostCentro } from '@/hooks/centros/usePostCentro';
import { usePutCentro } from '@/hooks/centros/usePutCentro';
import { Centro } from '@/types/centro';
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import Boton from "@/components/atomos/Boton";
import { Column, createEntityTable } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { centroSchema } from '@/schemas/centro.schema';

const Centros = () => {
  const { centros, loading } = useGetCentros();
  const { crearCentro } = usePostCentro();
  const { actualizarCentro } = usePutCentro();
  const { municipios, loading: loadingMunicipios } = useGetMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Centro & { key: number }>[]= [
    { key: "nombre_centro", label: "Nombre del Centro", filterable: true },
    {
      key: "municipio",
      label: "Municipio",
      filterable: true,
      render: (centro) => {
        if (centro.municipio) {
          return centro.municipio.nombre_municipio;
        }
        
        if (centro.id_municipio && (!loadingMunicipios && municipios.length > 0)) {
          const municipio = municipios.find(m => m.id_municipio === centro.id_municipio);
          return municipio ? municipio.nombre_municipio : `ID: ${centro.id_municipio}`;
        }
        
        return 'No disponible';
      }
    }
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { 
      key: "id_municipio", 
      label: "Municipio", 
      type: "select", 
      required: true, 
      options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })) 
    },
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { 
      key: "id_municipio", 
      label: "Municipio", 
      type: "select", 
      required: true, 
      options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })) 
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir id_municipio a número
      const municipio_id = parseInt(values.id_municipio);
      
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Actualizar centro existente
        const updatePayload = {
          id_centro: editingId,
          id_municipio: municipio_id,
          nombre_centro: values.nombre_centro,
          estado: true,
          fecha_modificacion: currentDate,
        };
        
        await actualizarCentro(editingId, updatePayload);
        // Usar el nuevo Toast en lugar de la alerta
        showSuccessToast('Centro actualizado con éxito');
      } else {
        const createPayload: Omit<Centro, 'id_centro' | 'municipio'> = {
          nombre_centro: values.nombre_centro,
          id_municipio: municipio_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearCentro(createPayload as any);
        showSuccessToast('Centro creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      // Reemplazar alert con nuestro nuevo Toast
      showErrorToast('Error al guardar el centro');
    }
  };

  const handleToggleEstado = async (centro: Centro) => {
    try {
      const nuevoEstado = !centro.estado;
      const updateData = {
        id_centro: centro.id_centro,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarCentro(centro.id_centro, updateData);
      // Usar el nuevo Toast en lugar de la alerta
      showSuccessToast(`El centro fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      // Usar el nuevo Toast para mostrar el error
      showErrorToast("Error al cambiar el estado del centro.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (centro: Centro) => {
    // Convertir los valores a string para el formulario
    setFormData({
      nombre_centro: centro.nombre_centro,
      id_municipio: centro.id_municipio ? centro.id_municipio.toString() : ''
    });
    setEditingId(centro.id_centro);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Centros</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Centro
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando centros...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: centros,
            idField: 'id_centro',
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
                  {editingId ? "Editar Centro" : "Crear Nuevo Centro"}
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
                  schema={centroSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Centros;
