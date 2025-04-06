import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";

type TipoSitio = {
  key: React.Key;
  id_tipo_sitio: number;
  nombre_tipo_sitio: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};

const TiposSitio = () => {
  const navigate = useNavigate();
  const [tiposSitio, setTiposSitio] = useState<TipoSitio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoSitio>>({});

  const columns: Column<TipoSitio>[] = [
    { key: "id_tipo_sitio", label: "ID" },
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoSitio) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(tipoSitio)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(tipoSitio.id_tipo_sitio)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  // Fetch inicial de tipos de sitio
  useEffect(() => {
    const fetchTiposSitio = async () => {
      try {
        const response = await fetch("http://localhost:3002/tipos-sitio");
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de sitio");
        }
        const data = await response.json();
        const tiposSitioWithKeys = data.map((tipoSitio: TipoSitio) => ({
          ...tipoSitio,
          key: tipoSitio.id_tipo_sitio || `temp-${Math.random()}`, // Genera una clave temporal si no existe
        }));
        setTiposSitio(tiposSitioWithKeys);
      } catch (error) {
        console.error("Error al cargar los tipos de sitio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiposSitio();
  }, []);

  // Crear o actualizar tipo de sitio
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/tipos-sitio/actualizar/${editingId}`
        : "http://localhost:3002/tipos-sitio/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el tipo de sitio");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Tipo de sitio ${message} con éxito`);

      // Refrescar la lista
      const updatedTiposSitio = await fetch(
        "http://localhost:3002/tipos-sitio"
      ).then((res) => res.json());
      
      const tiposSitioWithKeys = updatedTiposSitio.map((tipoSitio: TipoSitio) => ({
        ...tipoSitio,
        key: tipoSitio.id_tipo_sitio || `temp-${Math.random()}`,
      }));
      
      setTiposSitio(tiposSitioWithKeys);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el tipo de sitio:", error);
    }
  };

  // Eliminar tipo de sitio
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este tipo de sitio?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3002/tipos-sitio/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el tipo de sitio");
      }

      alert("Tipo de sitio eliminado con éxito");

      // Refrescar la lista
      setTiposSitio(tiposSitio.filter((tipoSitio) => tipoSitio.id_tipo_sitio !== id));
    } catch (error) {
      console.error("Error al eliminar el tipo de sitio:", error);
    }
  };

  // Abrir modal para crear nuevo tipo de sitio
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar tipo de sitio existente
  const handleEdit = (tipoSitio: TipoSitio) => {
    setFormData(tipoSitio);
    setEditingId(tipoSitio.id_tipo_sitio);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Sitio</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Sitio
          </Boton>

          {/* Tabla de tipos de sitio */}
          {loading ? (
            <p>Cargando tipos de sitio...</p>
          ) : (
            <GlobalTable columns={columns} data={tiposSitio} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Tipo de Sitio" : "Crear Nuevo Tipo de Sitio"}
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

export default TiposSitio;
