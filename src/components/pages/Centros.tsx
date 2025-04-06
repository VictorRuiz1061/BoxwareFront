import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Centro = {
  id_centro: number;
  nombre_centro: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  municipio_id: number;
};

const Centros = () => {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setFormData] = useState<Partial<Centro>>({});

  const columns: Column<Centro>[] = [
    { key: "nombre_centro", label: "Nombre del Centro" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    { key: "municipio_id", label: "Municipio ID" },
    {
      key: "acciones",
      label: "Acciones",
      render: (centro) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(centro)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(centro.id_centro)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "municipio_id", label: "Municipio ID", type: "text", required: true },
  ];

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        const response = await fetch("http://localhost:3002/centros");
        if (!response.ok) {
          throw new Error("Error al obtener los centros");
        }
        const data = await response.json();
        setCentros(data);
      } catch (error) {
        console.error("Error al cargar los centros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCentros();
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/centros/actualizar/${editingId}`
        : "http://localhost:3002/centros/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el centro");
      }

      alert(`Centro ${editingId ? "actualizado" : "creado"} con éxito`);

      const updatedCentros = await fetch("http://localhost:3002/centros").then((res) => res.json());
      setCentros(updatedCentros);

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el centro:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este centro?")) return;

    try {
      const response = await fetch(`http://localhost:3002/centros/eliminar/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el centro");
      }

      alert("Centro eliminado con éxito");
      setCentros(centros.filter((centro) => centro.id_centro !== id));
    } catch (error) {
      console.error("Error al eliminar el centro:", error);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (centro: Centro) => {
    setFormData(centro);
    setEditingId(centro.id_centro);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Centros</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Centro
          </Boton>

          {loading ? (
            <p>Cargando centros...</p>
          ) : (
            <GlobalTable columns={columns} data={centros} rowsPerPage={6} />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Centro" : "Crear Nuevo Centro"}
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

export default Centros;
