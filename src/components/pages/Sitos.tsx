import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Sitio = {
  key: React.Key; // Add this property to satisfy the constraint
  id_sitio: number;
  nombre_sitio: string;
  ubicacion: string;
  fecha_creacion: string;
  ficha_tecnica: string;
  fecha_modificacion: string;
  persona_encargada_id: number;
  tipo_sitio_id: number;
};

const Sitios = () => {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Sitio>>({});

  const columns: Column<Sitio>[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio" },
    { key: "ubicacion", label: "Ubicación" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (sitio) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(sitio)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(sitio.id_sitio)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", type: "text", required: true },
    { key: "ubicacion", label: "Ubicación", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", type: "text", required: true },
    { key: "persona_encargada_id", label: "ID Persona Encargada", type: "number", required: true },
    { key: "tipo_sitio_id", label: "ID Tipo Sitio", type: "number", required: true },
  ];

  // Fetch inicial de sitios
  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const response = await fetch("http://localhost:3002/sitios");
        if (!response.ok) {
          throw new Error("Error al obtener los sitios");
        }
        const data = await response.json();
        setSitios(data);
      } catch (error) {
        console.error("Error al cargar los sitios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitios();
  }, []);

  // Crear o actualizar sitio
  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/sitios/actualizar/${editingId}`
        : "http://localhost:3002/sitios/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el sitio");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Sitio ${message} con éxito`);

      // Refrescar la lista
      const updatedSitios = await fetch("http://localhost:3002/sitios").then((res) =>
        res.json()
      );
      setSitios(updatedSitios);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el sitio:", error);
    }
  };

  // Eliminar sitio
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este sitio?")) return;

    try {
      const response = await fetch(`http://localhost:3002/sitios/eliminar/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el sitio");
      }

      alert("Sitio eliminado con éxito");

      // Refrescar la lista
      setSitios(sitios.filter((sitio) => sitio.id_sitio !== id));
    } catch (error) {
      console.error("Error al eliminar el sitio:", error);
    }
  };

  // Abrir modal para crear nuevo sitio
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar sitio existente
  const handleEdit = (sitio: Sitio) => {
    setFormData(sitio);
    setEditingId(sitio.id_sitio);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Sitios</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Sitio
          </Boton>

          {/* Tabla de sitios */}
          {loading ? (
            <p>Cargando sitios...</p>
          ) : (
            <GlobalTable columns={columns} data={sitios} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Sitio" : "Crear Nuevo Sitio"}
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

export default Sitios;
