import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useTipoMateriales } from '../../hooks/useTipoMateriales';
import type { TipoMaterial } from '../../types/tipoMaterial';

const TipoMaterial = () => {
  const { tipoMateriales, loading, crearTipoMaterial, actualizarTipoMaterial, eliminarTipoMaterial } = useTipoMateriales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoMaterial>>({});


  const columns: Column<TipoMaterial>[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (tipoMaterial) => (
        <span className={String(tipoMaterial.estado) === "true" ? "text-green-600" : "text-red-600"}>
          {String(tipoMaterial.estado) === "true" ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoMaterial) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(tipoMaterial)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(tipoMaterial.id_tipo_material)}
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
    { key: "tipo_elemento", label: "Tipo de Elemento", type: "text", required: true },
    { key: "estado", label: "Estado", type: "select", required: true, options: ["Activo", "Inactivo"] },
  ];
  if (editingId) {
    formFields.push({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
  } else {
    formFields.push({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
  }



  // Crear o actualizar tipo de material
  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const estadoBool = values.estado === "Activo" || values.estado === "true";
      if (editingId) {
        await actualizarTipoMaterial(editingId, {
          tipo_elemento: values.tipo_elemento as string,
          estado: String(estadoBool),
          fecha_modificacion: values.fecha_modificacion as string,
          fecha_creacion: formData.fecha_creacion as string || '',
        });
        alert('Tipo de material actualizado con éxito');
      } else {
        await crearTipoMaterial({
          tipo_elemento: values.tipo_elemento as string,
          estado: String(estadoBool),
          fecha_creacion: values.fecha_creacion as string,
          fecha_modificacion: values.fecha_creacion as string,
        });
        alert('Tipo de material creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el tipo de material:', error);
    }
  };


  // Eliminar tipo de material
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este tipo de material?")) return;
    try {
      await eliminarTipoMaterial(id);
      alert('Tipo de material eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el tipo de material:', error);
    }
  };


  // Abrir modal para crear nuevo tipo de material
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar tipo de material existente
  const handleEdit = (tipoMaterial: TipoMaterial) => {
    setFormData(tipoMaterial);
    setEditingId(tipoMaterial.id_tipo_material);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Material</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Material
          </Boton>

          {/* Tabla de tipos de material */}
          {loading ? (
            <p>Cargando tipos de material...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={tipoMateriales.map(tm => ({ ...tm, key: tm.id_tipo_material }))} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Tipo de Material" : "Crear Nuevo Tipo de Material"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    estado: typeof formData.estado === 'boolean'
                      ? (formData.estado ? "Activo" : "Inactivo")
                      : (formData.estado === "true" ? "Activo" : "Inactivo")
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
        </main>
      </div>
    </div>
  );
};

export default TipoMaterial;