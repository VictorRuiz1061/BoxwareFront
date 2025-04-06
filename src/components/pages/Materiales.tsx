import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Material = {
  key: React.Key; // Add this property
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  stock: number;
  unidad_medida: string;
  fecha_vencimiento: string;
  producto_perecedero: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  categoria_id: number;
  tipo_material_id: number;
  sitio_id: number;
};

const Materiales = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setFormData] = useState<Partial<Material>>({});

  const columns: Column<Material>[] = [
    { key: "codigo_sena", label: "Código SENA" },
    { key: "nombre_material", label: "Nombre" },
    { key: "descripcion_material", label: "Descripción" },
    { key: "stock", label: "Stock" },
    { key: "unidad_medida", label: "Unidad de Medida" },
    { key: "fecha_vencimiento", label: "Fecha de Vencimiento" },
    {
      key: "acciones",
      label: "Acciones",
      render: (material) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(material)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(material.id_material)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "codigo_sena", label: "Codigo sena ", type: "text", required: true },
    { key: "nombre_material", label: "Nombre", type: "text", required: true },
    {
      key: "descripcion_material",
      label: "Descripción",
      type: "text",
      required: true,
    },
    { key: "stock", label: "Stock", type: "number", required: true },
    {
      key: "unidad_medida",
      label: "Unidad de Medida",
      type: "text",
      required: true,
    },
    {
      key: "fecha_vencimiento",
      label: "Fecha de Vencimiento",
      type: "date",
      required: true,
    },
    {
      key: "categoria_id",
      label: "ID Categoría",
      type: "number",
      required: true,
    },
    {
      key: "tipo_material_id",
      label: "ID Tipo Material",
      type: "number",
      required: true,
    },
    { key: "sitio_id", label: "ID Sitio", type: "number", required: true },
  ];

  // Fetch inicial de materiales
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("http://localhost:3002/materiales");
        if (!response.ok) {
          throw new Error("Error al obtener los materiales");
        }
        const data = await response.json();
        const materialsWithKeys = data.map((material: Material) => ({
          ...material,
          id_material: material.id_material || `temp-${Math.random()}`, // Genera una clave temporal si no existe
        }));
        setMaterials(materialsWithKeys);
      } catch (error) {
        console.error("Error al cargar los materiales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Crear o actualizar material
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/materiales/actualizar/${editingId}`
        : "http://localhost:3002/materiales/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el material");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Material ${message} con éxito`);

      // Refrescar la lista
      const updatedMaterials = await fetch(
        "http://localhost:3002/materiales"
      ).then((res) => res.json());
      setMaterials(updatedMaterials);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el material:", error);
    }
  };

  // Eliminar material
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este material?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3002/materiales/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el material");
      }

      alert("Material eliminado con éxito");

      // Refrescar la lista
      setMaterials(materials.filter((material) => material.id_material !== id));
    } catch (error) {
      console.error("Error al eliminar el material:", error);
    }
  };

  // Abrir modal para crear nuevo material
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar material existente
  const handleEdit = (material: Material) => {
    setFormData(material);
    setEditingId(material.id_material);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Materiales</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Material
          </Boton>

          {/* Tabla de materiales */}
          {loading ? (
            <p>Cargando materiales...</p>
          ) : (
            <GlobalTable columns={columns} data={materials} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Material" : "Crear Nuevo Material"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
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

export default Materiales;
