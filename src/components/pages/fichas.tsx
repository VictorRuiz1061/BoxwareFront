import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Ficha = {
  key: React.Key;
  id_ficha: number;
  usuario_ficha_id: number;
  programa_id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
};

const Fichas = () => {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setFormData] = useState<Partial<Ficha>>({});

  const columns: Column<Ficha>[] = [
    { key: "id_ficha", label: "ID Ficha" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Última Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (ficha) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(ficha)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(ficha.id_ficha)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "id_ficha", label: "ID Ficha", type: "number", required: true },
    { key: "usuario_ficha_id", label: "ID del Usuario", type: "number", required: true },
    { key: "programa_id", label: "ID del Programa", type: "number", required: true },
  ];

  useEffect(() => {
    fetchFichas();
  }, []);

  const fetchFichas = async () => {
    try {
      const response = await fetch("http://localhost:3002/fichas");
      if (!response.ok) {
        throw new Error("Error al obtener las fichas");
      }
      const data = await response.json();
      const fichasWithKeys = data.datos.map((ficha: Ficha) => ({
        ...ficha,
        key: ficha.id_ficha || `temp-${Math.random()}`,
      }));
      setFichas(fichasWithKeys);
    } catch (error) {
      console.error("Error al cargar las fichas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/fichas/actualizar/${editingId}`
        : "http://localhost:3002/fichas/crear/";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la ficha");
      }

      const message = editingId ? "actualizada" : "creada";
      alert(`Ficha ${message} con éxito`);

      fetchFichas();
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ficha?")) return;

    try {
      const response = await fetch(
        `http://localhost:3002/fichas/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la ficha");
      }

      alert("Ficha eliminada con éxito");
      setFichas(fichas.filter((ficha) => ficha.id_ficha !== id));
    } catch (error) {
      console.error("Error al eliminar la ficha:", error);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ficha: Ficha) => {
    setFormData(ficha);
    setEditingId(ficha.id_ficha);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Fichas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Ficha
          </Boton>

          {loading ? (
            <p>Cargando fichas...</p>
          ) : (
            <GlobalTable columns={columns} data={fichas} rowsPerPage={6} />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Ficha" : "Crear Nueva Ficha"}
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

export default Fichas;