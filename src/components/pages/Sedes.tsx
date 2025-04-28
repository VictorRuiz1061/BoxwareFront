import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useSedes } from '../../hooks/useSedes';
import { Sede } from '../../types/sede';
import { useCentros } from '../../hooks/useCentros';
import { sedeSchema } from '@/schemas/sede.schema';

const Sedes = () => {
  const { sedes, loading, crearSede, actualizarSede, eliminarSede } = useSedes();
  const { centros } = useCentros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Sede>>({});

  const columns: Column<Sede>[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", filterable: true },
    { key: "direccion_sede", label: "Dirección de la sede", filterable: true },
    {
      key: "centro_sede_id",
      label: "Centro",
      filterable: true,
      render: (sede) => {
        const centro = centros.find(c => c.id_centro === sede.centro_sede_id);
        return centro ? centro.nombre_centro : sede.centro_sede_id;
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (sede) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(sede)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(sede.id_sede)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la sede", type: "text", required: true },
    { 
      key: "centro_sede_id", 
      label: "Centro", 
      type: "select", 
      required: true, 
      options: centros.map(c => ({ label: c.nombre_centro, value: c.id_centro.toString() })) 
    },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Validar con zod
      const parsed = sedeSchema.safeParse(values);
      if (!parsed.success) {
        alert(parsed.error.errors.map(e => e.message).join('\n'));
        return;
      }

      // Validar que todos los campos requeridos estén presentes
      if (!values.nombre_sede || !values.direccion_sede || !values.centro_sede_id || !values.fecha_creacion || !values.fecha_modificacion) {
        alert('Todos los campos son requeridos');
        return;
      }

      // Verificar los valores de los centros
      console.log('Centros disponibles:', centros);
      console.log('Valor seleccionado para centro_sede_id:', values.centro_sede_id);

      // Buscar el centro por id
      const centroSeleccionado = centros.find(c => c.id_centro === Number(values.centro_sede_id));
      if (!centroSeleccionado) {
        throw new Error('Centro no encontrado');
      }

      // Preparar los datos
      const sedeData = {
        nombre_sede: values.nombre_sede.trim(),
        direccion_sede: values.direccion_sede.trim(),
        fecha_creacion: new Date(values.fecha_creacion).toISOString(),
        fecha_modificacion: new Date(values.fecha_modificacion).toISOString(),
        centro_sede_id: centroSeleccionado.id_centro
      };

      console.log('Datos preparados para enviar:', sedeData);

      if (editingId) {
        await actualizarSede(editingId, sedeData);
        alert('Sede actualizada con éxito');
      } else {
        await crearSede(sedeData);
        alert('Sede creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error: any) {
      console.error('Error detallado al guardar la sede:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`Error al guardar la sede: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sede?')) return;
    try {
      await eliminarSede(id);
      alert('Sede eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la sede:', error);
      alert('Error al eliminar la sede');
    }
  };

  const handleCreate = () => {
    const hoy = new Date().toISOString().split('T')[0];
    setFormData({
      fecha_creacion: hoy,
      fecha_modificacion: hoy
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    setFormData({
      nombre_sede: sede.nombre_sede,
      direccion_sede: sede.direccion_sede,
      fecha_creacion: sede.fecha_creacion,
      fecha_modificacion: sede.fecha_modificacion,
      centro_sede_id: sede.centro_sede_id
    });
    setEditingId(sede.id_sede);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Sedes</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Sede
          </Boton>

          {loading ? (
            <p>Cargando sedes...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={sedes.map(sede => ({ ...sede, key: sede.id_sede }))} rowsPerPage={6} />
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
                  {editingId ? "Editar Sede" : "Crear Nueva Sede"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    nombre_sede: formData.nombre_sede || '',
                    direccion_sede: formData.direccion_sede || '',
                    fecha_creacion: formData.fecha_creacion || '',
                    fecha_modificacion: formData.fecha_modificacion || '',
                    centro_sede_id: formData.centro_sede_id?.toString() || ''
                  }}
                  schema={sedeSchema}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sedes;
