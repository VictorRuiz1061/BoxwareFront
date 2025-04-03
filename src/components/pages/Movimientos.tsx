import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";

type Movimiento = {
  key: React.Key;
  id_movimiento: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  usuario_movimiento_id: number;
  tipo_movimiento_id: number;
};

const Movimientos = () => {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Movimiento>>({});

  const columns: Column<Movimiento>[] = [
    { key: "id_movimiento", label: "ID" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    { key: "usuario_movimiento_id", label: "ID Usuario" },
    { key: "tipo_movimiento_id", label: "Tipo de Movimiento" },
    {
      key: "acciones",
      label: "Acciones",
      render: (movimiento) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(movimiento)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(movimiento.id_movimiento)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "usuario_movimiento_id", label: "ID Usuario", type: "number", required: true },
    { key: "tipo_movimiento_id", label: "Tipo de Movimiento", type: "number", required: true },
  ];

  // Fetch inicial de movimientos
  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await fetch("http://localhost:3002/movimientos");
        if (!response.ok) {
          throw new Error("Error al obtener los movimientos");
        }
        const data = await response.json();
        const movimientosWithKeys = data.map((movimiento: Movimiento) => ({
          ...movimiento,
          key: movimiento.id_movimiento || `temp-${Math.random()}`, // Genera una clave temporal si no existe
        }));
        setMovimientos(movimientosWithKeys);
      } catch (error) {
        console.error("Error al cargar los movimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientos();
  }, []);

  // Crear o actualizar movimiento
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/movimientos/actualizar/${editingId}`
        : "http://localhost:3002/movimientos/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el movimiento");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Movimiento ${message} con éxito`);

      // Refrescar la lista
      const updatedMovimientos = await fetch(
        "http://localhost:3002/movimientos"
      ).then((res) => res.json());
      
      const movimientosWithKeys = updatedMovimientos.map((movimiento: Movimiento) => ({
        ...movimiento,
        key: movimiento.id_movimiento || `temp-${Math.random()}`,
      }));
      
      setMovimientos(movimientosWithKeys);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el movimiento:", error);
    }
  };

  // Eliminar movimiento
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este movimiento?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3002/movimientos/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el movimiento");
      }

      alert("Movimiento eliminado con éxito");

      // Refrescar la lista
      setMovimientos(movimientos.filter((movimiento) => movimiento.id_movimiento !== id));
    } catch (error) {
      console.error("Error al eliminar el movimiento:", error);
    }
  };

  // Abrir modal para crear nuevo movimiento
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar movimiento existente
  const handleEdit = (movimiento: Movimiento) => {
    setFormData(movimiento);
    setEditingId(movimiento.id_movimiento);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Movimientos</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Movimiento
          </Boton>

          {/* Tabla de movimientos */}
          {loading ? (
            <p>Cargando movimientos...</p>
          ) : (
            <GlobalTable columns={columns} data={movimientos} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
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

export default Movimientos;
