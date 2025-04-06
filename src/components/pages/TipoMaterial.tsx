import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type TipoMaterial = {
  id_tipo_material: number;
  tipo_elemento: string;
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string;
} & { key: React.Key };

const TipoMaterial = () => {
  const [tipoMateriales, setTipoMateriales] = useState<TipoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoMaterial>>({});

  const columns: Column<TipoMaterial>[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento" },
    { key: "estado", label: "Estado" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
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

  const formFields: FormField[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", type: "text", required: true },
    { key: "estado", label: "Estado", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  // Fetch inicial de tipos de material
  useEffect(() => {
    const fetchTipoMateriales = async () => {
      try {
        const response = await fetch("http://localhost:3002/tipoMaterial");
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de material");
        }
        const data = await response.json();
        setTipoMateriales(data);
      } catch (error) {
        console.error("Error al cargar los tipos de material:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipoMateriales();
  }, []);

  // Crear o actualizar tipo de material
  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/tipoMaterial/actualizar/${editingId}`
        : "http://localhost:3002/tipoMaterial/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el tipo de material");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Tipo de material ${message} con éxito`);

      // Refrescar la lista
      const updatedTipoMateriales = await fetch("http://localhost:3002/tipoMaterial").then((res) =>
        res.json()
      );
      setTipoMateriales(updatedTipoMateriales);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el tipo de material:", error);
    }
  };

  // Eliminar tipo de material
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este tipo de material?")) return;

    try {
      const response = await fetch(`http://localhost:3002/tipoMaterial/eliminar/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el tipo de material");
      }

      alert("Tipo de material eliminado con éxito");

      // Refrescar la lista
      setTipoMateriales(tipoMateriales.filter((tipoMaterial) => tipoMaterial.id_tipo_material !== id));
    } catch (error) {
      console.error("Error al eliminar el tipo de material:", error);
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
            <GlobalTable columns={columns} data={tipoMateriales} rowsPerPage={6} />
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
                  initialValues={Object.fromEntries(
                    Object.entries(formData)
                      .filter(([key]) => key !== "key")
                      .map(([key, value]) => [key, value as string | number | undefined])
                  )}
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