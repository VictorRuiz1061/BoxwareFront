import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Area = {
  key: React.Key;
  id_area: number;
  nombre_area: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};

const Areas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setFormData] = useState<Partial<Area>>({});

  const columns: Column<Area>[] = [
    { key: "nombre_area", label: "Nombre del Área" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Última Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (area) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(area)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(area.id_area)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
  ];

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch("http://localhost:3002/areas");
        if (!response.ok) {
          throw new Error("Error al obtener las áreas");
        }
        const data = await response.json();
        const areasWithKeys = data.map((area: Area) => ({
          ...area,
          key: area.id_area || `temp-${Math.random()}`,
        }));
        setAreas(areasWithKeys);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/areas/${editingId}`
        : "http://localhost:3002/areas";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el área");
      }

      const message = editingId ? "actualizada" : "creada";
      alert(`Área ${message} con éxito`);

      const updatedAreas = await fetch("http://localhost:3002/areas").then((res) =>
        res.json()
      );
      setAreas(updatedAreas);

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el área:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta área?")) return;

    try {
      const response = await fetch(
        `http://localhost:3002/areas/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el área");
      }

      alert("Área eliminada con éxito");
      setAreas(areas.filter((area) => area.id_area !== id));
    } catch (error) {
      console.error("Error al eliminar el área:", error);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (area: Area) => {
    setFormData(area);
    setEditingId(area.id_area);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Áreas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Área
          </Boton>

          {loading ? (
            <p>Cargando áreas...</p>
          ) : (
            <GlobalTable columns={columns} data={areas} rowsPerPage={6} />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Área" : "Crear Nueva Área"}
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

export default Areas;