import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Permiso = {
  id_permiso: number;
  nombre: string;
  tipo_permiso_id: number;
  codigo_nombre: string;
};

const Permisos = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Permiso>>({});

  const columns: Column<Permiso>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "tipo_permiso_id", label: "Tipo de Permiso" },
    { key: "codigo_nombre", label: "Código Nombre" },
    {
      key: "acciones",
      label: "Acciones",
      render: (permiso) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(permiso)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(permiso.id_permiso)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "tipo_permiso_id", label: "Tipo de Permiso ID", type: "number", required: true },
    { key: "codigo_nombre", label: "Código Nombre", type: "text", required: true },
  ];

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await fetch("http://localhost:3002/permisos");
        if (!response.ok) {
          throw new Error("Error al obtener los permisos");
        }
        const data = await response.json();
        setPermisos(data);
      } catch (error) {
        console.error("Error al cargar los permisos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermisos();
  }, []);

  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/permisos/actualizar/${editingId}`
        : "http://localhost:3002/permisos/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el permiso");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Permiso ${message} con éxito`);

      const updatedPermisos = await fetch("http://localhost:3002/permisos").then((res) =>
        res.json()
      );
      setPermisos(updatedPermisos);

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el permiso:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este permiso?")) return;

    try {
      const response = await fetch(`http://localhost:3002/permisos/eliminar/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el permiso");
      }

      alert("Permiso eliminado con éxito");
      setPermisos(permisos.filter((permiso) => permiso.id_permiso !== id));
    } catch (error) {
      console.error("Error al eliminar el permiso:", error);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permiso: Permiso) => {
    setFormData(permiso);
    setEditingId(permiso.id_permiso);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Permisos</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Permiso
          </Boton>

          {loading ? (
            <p>Cargando permisos...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={permisos.map((permiso) => ({ ...permiso, key: permiso.id_permiso }))}
              rowsPerPage={6}
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Permiso" : "Crear Nuevo Permiso"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData}
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

export default Permisos;