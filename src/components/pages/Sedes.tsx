import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetSedes } from '../../hooks/sedes/useGetSedes';
import { usePostSede } from '../../hooks/sedes/usePostSede';
import { usePutSede } from '../../hooks/sedes/usePutSede';
import { useDeleteSede } from '../../hooks/sedes/useDeleteSede';
import { useGetCentros } from '../../hooks/centros/useGetCentros';
import { sedeSchema } from '@/schemas/sede.schema';
import { Sede } from "@/types/sede";

const Sedes = () => {
  const { sedes, loading } = useGetSedes();
  const { crearSede } = usePostSede();
  const { actualizarSede } = usePutSede();
  const { eliminarSede } = useDeleteSede();
  const { centros } = useGetCentros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // Usamos string para todos los campos del formulario para evitar errores de tipo
  type SedeFormValues = {
    nombre_sede: string;
    direccion_sede: string;
    centro_id: string;
    fecha_creacion: string;
    fecha_modificacion?: string;
    estado?: string; // 'Activo' | 'Inactivo'
  };
  const [formData, setFormData] = useState<Partial<SedeFormValues>>({});

  const columns: Column<Sede & { key: number }>[]= [
    { key: "nombre_sede", label: "Nombre de la Sede", filterable: true },
    { key: "direccion_sede", label: "Dirección de la sede", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (sede) => (
        <span className={sede.estado ? "text-green-600" : "text-red-600"}>
          {sede.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      key: "centro_id",
      label: "Centro",
      filterable: true,
      render: (sede) => {
        const centro = centros.find(c => c.id_centro === sede.centro_id);
        return centro ? centro.nombre_centro : sede.centro_id;
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

  // Campos base para ambos formularios
  const baseFields: FormField[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la sede", type: "text", required: true },
    { key: "centro_id", label: "Centro", type: "select", required: true, options: centros.map(c => ({ label: c.nombre_centro, value: c.id_centro.toString() })) },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];
  // Campos adicionales sólo para edición
  const editFields: FormField[] = [
    {
      key: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" }
      ]
    },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];
  // Selección dinámica de campos
  const formFields: FormField[] = editingId ? [...baseFields, ...editFields] : baseFields;

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Validar con zod
      const parsed = sedeSchema.safeParse(values);
      if (!parsed.success) {
        alert(parsed.error.errors.map(e => e.message).join('\n'));
        return;
      }
      // Validar que todos los campos requeridos estén presentes
      if (!values.nombre_sede || !values.direccion_sede || !values.centro_id || !values.fecha_creacion) {
        alert('Todos los campos son requeridos');
        return;
      }
      const hoy = new Date().toISOString().split('T')[0];
      // Estado: sólo se toma del form si es edición, si no siempre es 'Activo'
      const estadoValue = editingId ? values.estado : 'Activo';
      // Preparar los datos
      const sedeData = {
        nombre_sede: values.nombre_sede.trim(),
        direccion_sede: values.direccion_sede.trim(),
        fecha_creacion: values.fecha_creacion,
        fecha_modificacion: editingId ? (values.fecha_modificacion || hoy) : hoy,
        centro_sede_id: Number(values.centro_id), // Map centro_id to centro_sede_id
        estado: estadoValue === 'Activo', // true para 'Activo', false para 'Inactivo'
      };
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
      // Manejo seguro del error
      let errorMessage = 'Error desconocido';
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          errorMessage = (error.response.data as any).message;
        } else if ('message' in error) {
          errorMessage = (error as any).message;
        }
      }
      console.error('Error detallado al guardar la sede:', error);
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
      nombre_sede: '',
      direccion_sede: '',
      centro_id: '',
      fecha_creacion: hoy,
      estado: 'Activo', // Valor por defecto para creación
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    setFormData({
      nombre_sede: sede.nombre_sede,
      direccion_sede: sede.direccion_sede,
      centro_id: String(sede.centro_id),
      fecha_creacion: sede.fecha_creacion?.split('T')[0],
      fecha_modificacion: sede.fecha_modificacion?.split('T')[0],
      estado: sede.estado ? 'Activo' : 'Inactivo',
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
                    centro_id: formData.centro_id || '',
                    fecha_creacion: formData.fecha_creacion || '',
                    // Solo pasamos fecha_modificacion y estado si es edición
                    ...(editingId ? { fecha_modificacion: formData.fecha_modificacion || '', estado: formData.estado || 'Activo' } : {}),
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
