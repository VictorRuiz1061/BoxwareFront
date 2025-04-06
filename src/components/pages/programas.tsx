import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Programa = {
  key: React.Key;
  id_programa: number;
  nombre_programa: string;
  area_id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
};

const Programas = () => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setFormData] = useState<Partial<Programa>>({});

  const columns: Column<Programa>[] = [
    { key: "nombre_programa", label: "Nombre del Programa" },
    { key: "area_id", label: "ID del Área" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Última Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (programa) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(programa)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(programa.id_programa)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_programa", label: "Nombre del Programa", type: "text", required: true },
    { key: "area_id", label: "ID del Área", type: "number", required: true },
  ];

  useEffect(() => {
    fetchProgramas();
  }, []);

  const fetchProgramas = async () => {
    try {
      const response = await fetch("http://localhost:3002/programas"); // Cambiar a /programas
      if (!response.ok) {
        throw new Error("Error al obtener los programas");
      }
      const data = await response.json();
      
      // Acceder a data.datos ya que el controlador devuelve { mensaje, datos }
      if (data.datos && Array.isArray(data.datos)) {
        const programasWithKeys = data.datos.map((programa: Programa) => ({
          ...programa,
          key: programa.id_programa || `temp-${Math.random()}`,
        }));
        setProgramas(programasWithKeys);
      } else {
        console.error("Formato de respuesta incorrecto:", data);
        setProgramas([]);
      }
    } catch (error) {
      console.error("Error al cargar los programas:", error);
      setProgramas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/programas/actualizar/${editingId}` // Cambiar ruta
        : "http://localhost:3002/programas/crear"; // Cambiar ruta

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al guardar el programa");
      }

      const data = await response.json();
      const message = editingId ? "actualizado" : "creado"; 
      alert(`Programa ${message} con éxito`);

      // Recargar la lista de programas
      fetchProgramas();

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el programa:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocurrió un error desconocido");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este programa?")) return;

    try {
      const response = await fetch(
        `http://localhost:3002/programas/${id}`, // Cambiar ruta
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al eliminar el programa");
      }

      const data = await response.json();
      alert(data.mensaje || "Programa eliminado con éxito");
      
      // Actualizar el estado local
      setProgramas(programas.filter((programa) => programa.id_programa !== id));
    } catch (error) {
      console.error("Error al eliminar el programa:", error);
      alert(error.message);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (programa: Programa) => {
    setFormData(programa);
    setEditingId(programa.id_programa);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Programas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Programa
          </Boton>

          {loading ? (
            <p>Cargando programas...</p>
          ) : (
            <GlobalTable columns={columns} data={programas} rowsPerPage={6} />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Programa" : "Crear Nuevo Programa"}
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

export default Programas;