import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Municipio = {
  id_Municipio: number;
  nombre_Municipio: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};

const Municipios = () => {
  const [Municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setFormData] = useState<Partial<Municipio>>({});

  const columns: Column<Municipio>[] = [
    { key: "nombre_Municipio", label: "Nombre del Municipio" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (Municipio) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(Municipio)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(Municipio.id_Municipio)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_Municipio", label: "Nombre del Municipio", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await fetch("http://localhost:3002/Municipios");
        if (!response.ok) {
          throw new Error("Error al obtener los Municipios");
        }
        const data = await response.json();
        setMunicipios(data);
      } catch (error) {
        console.error("Error al cargar los Municipios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipios();
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/Municipios/actualizar/${editingId}`
        : "http://localhost:3002/Municipios/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el Municipio");
      }

      alert(`Municipio ${editingId ? "actualizado" : "creado"} con éxito`);

      const updatedMunicipios = await fetch("http://localhost:3002/Municipios").then((res) => res.json());
      setMunicipios(updatedMunicipios);

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el Municipio:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este Municipio?")) return;

    try {
      const response = await fetch(`http://localhost:3002/Municipios/eliminar/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el Municipio");
      }

      alert("Municipio eliminado con éxito");
      setMunicipios(Municipios.filter((Municipio) => Municipio.id_Municipio !== id));
    } catch (error) {
      console.error("Error al eliminar el Municipio:", error);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (Municipio: Municipio) => {
    setFormData(Municipio);
    setEditingId(Municipio.id_Municipio);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Municipios</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Municipio
          </Boton>

          {loading ? (
            <p>Cargando Municipios...</p>
          ) : (
            <GlobalTable columns={columns} data={Municipios.map(m => ({ ...m, key: m.id_Municipio }))} rowsPerPage={6} />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Municipio" : "Crear Nuevo Municipio"}
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

export default Municipios;
