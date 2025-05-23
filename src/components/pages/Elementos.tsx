import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useCategoriaElementos } from '../../hooks/useCategoriaElementos';
import { CategoriaElemento } from '../../types/categoriaElemento';

const Elementos = () => {
  const { categorias, loading, crearCategoriaElemento, actualizarCategoriaElemento, eliminarCategoriaElemento } = useCategoriaElementos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CategoriaElemento>>({});

  const columns: Column<CategoriaElemento>[] = [
    { key: "codigo_unpsc", label: "Código UNSPSC", filterable: true },
    { key: "nombre_categoria", label: "Nombre de la Categoría", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (categoria) => (
        <div className="flex gap-2">
          <Boton color="primary" variant="shadow" type="submit"
            onClick={() => handleEdit(categoria)}
            className="bg-yellow-500 text-white"
          >
            Editar
          </Boton>
          <Boton color="primary" variant="shadow" type="submit"
            onClick={() => handleDelete(categoria.id_categoria_elemento)}
            className="bg-red-500 text-white"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    { key: "codigo_unpsc", label: "Código UNSPSC", type: "text", required: true },
    { key: "nombre_categoria", label: "Nombre de la Categoría", type: "text", required: true },
  ];
  if (editingId) {
    formFields.push({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
  } else {
    formFields.push({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
  }

  // Crear o actualizar categoría
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      if (editingId) {
        await actualizarCategoriaElemento(editingId, {
          codigo_unpsc: values.codigo_unpsc as string,
          nombre_categoria: values.nombre_categoria as string,
          fecha_modificacion: values.fecha_modificacion as string,
          fecha_creacion: formData.fecha_creacion as string || '',
        });
        alert('Categoría actualizada con éxito');
      } else {
        await crearCategoriaElemento({
          codigo_unpsc: values.codigo_unpsc as string,
          nombre_categoria: values.nombre_categoria as string,
          fecha_creacion: values.fecha_creacion as string,
          fecha_modificacion: values.fecha_creacion as string,
        } as Omit<CategoriaElemento, 'id_categoria_elemento'>);
        alert('Categoría creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  // Eliminar categoría
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;
    try {
      await eliminarCategoriaElemento(id);
      alert("Categoría eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  // Abrir modal para crear nueva categoría
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar categoría existente
  const handleEdit = (categoria: CategoriaElemento) => {
    setFormData(categoria);
    setEditingId(categoria.id_categoria_elemento);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Categorías de Elementos</h1>

          <Boton  
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Categoría
          </Boton>

          {/* Tabla de categorías */}
          {loading ? (
            <p>Cargando categorías de elementos...</p>
          ) : (
            <GlobalTable columns={columns} data={categorias.map(categoria => ({ ...categoria, key: categoria.id_categoria_elemento }))} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-lg font-bold mb-4">
                  {editingId ? "Editar Categoría" : "Crear Nueva Categoría"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData}
                />
                <Boton
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2"
                >
                  Cerrar
                </Boton>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Elementos;
