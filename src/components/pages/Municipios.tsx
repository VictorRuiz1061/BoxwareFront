import { useState } from "react";
import { Pencil, Trash } from 'lucide-react';
import { Alert } from '@heroui/react';
import { useGetMunicipios } from '@/hooks/municipios/useGetMunicipios';
import { usePostMunicipio } from '@/hooks/municipios/usePostMunicipio';
import { usePutMunicipio } from '@/hooks/municipios/usePutMunicipio';
import { useDeleteMunicipio } from '@/hooks/municipios/useDeleteMunicipio';
import { Municipio } from '@/types/municipio';
import Boton from "@/components/atomos/Boton";
import Sidebar from "@/components/organismos/Sidebar";
import Header from "@/components/organismos/Header";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { municipioSchema } from '@/schemas/municipio.schema';

const Municipios = () => {
  const { municipios, loading } = useGetMunicipios();
  const { crearMunicipio } = usePostMunicipio();
  const { actualizarMunicipio } = usePutMunicipio();
  const { eliminarMunicipio } = useDeleteMunicipio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<Municipio & { key: number }>[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (municipio) => (
        <span className={municipio.estado ? "text-green-600" : "text-red-600"}>
          {municipio.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (municipio) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(municipio)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
          <Boton
            onPress={() => handleDelete(municipio.id_municipio)}
            className="bg-red-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Eliminar"
          >
            <Trash size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", type: "text", required: true },
    { 
      key: "estado", 
      label: "Estado", 
      type: "select", 
      required: true, 
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" }
      ] 
    },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const fechaCreacion = values.fecha_creacion ? new Date(values.fecha_creacion).toISOString() : new Date().toISOString();
      const fechaModificacion = values.fecha_modificacion ? new Date(values.fecha_modificacion).toISOString() : new Date().toISOString();

      console.log('Valores del formulario:', values);
      console.log('Estado seleccionado:', values.estado);

      const payload = {
        nombre_municipio: values.nombre_municipio,
        estado: values.estado === "true",
        fecha_creacion: fechaCreacion,
        fecha_modificacion: fechaModificacion
      };

      console.log('Datos a enviar:', payload);

      if (editingId) {
        await actualizarMunicipio(editingId, payload);
        setSuccessAlertText('Municipio actualizado con éxito');
      } else {
        await crearMunicipio(payload);
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este municipio?')) return;
    try {
      await eliminarMunicipio(id);
      setSuccessAlertText('Municipio eliminado con éxito');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error al eliminar el municipio:', error);
      alert('Error al eliminar el municipio');
    }
  };

  const handleCreate = () => {
    const today = new Date().toISOString();
    setFormData({
      fecha_creacion: today.split('T')[0],
      fecha_modificacion: today.split('T')[0],
      estado: "true"
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (municipio: Municipio) => {
    console.log('Datos del municipio a editar:', municipio);
    setFormData({
      nombre_municipio: municipio.nombre_municipio,
      estado: municipio.estado ? "true" : "false",
      fecha_creacion: municipio.fecha_creacion.split('T')[0],
      fecha_modificacion: new Date().toISOString().split('T')[0]
    });
    setEditingId(municipio.id_municipio);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F1F8FF' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Municipios</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Municipio
          </Boton>

          {loading ? (
            <p>Cargando municipios...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={municipios.map((municipio) => ({ ...municipio, key: municipio.id_municipio }))}
              rowsPerPage={6}
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
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
                    estado: formData.estado ?? "Activo",
                    fecha_creacion: formData.fecha_creacion ?? new Date().toISOString().split('T')[0],
                    fecha_modificacion: formData.fecha_modificacion ?? new Date().toISOString().split('T')[0]
                  }}
                  schema={municipioSchema}
                />
              </div>
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
        </main>
      </div>
    </div>
  );
};

export default Municipios;
