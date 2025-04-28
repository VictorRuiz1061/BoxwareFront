import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useFichas } from '../../hooks/useFichas';
import { Ficha } from '../../types/ficha';
import { useUsuarios } from '../../hooks/useUsuarios';
import { useProgramas } from '../../hooks/useProgramas';
import { fichaSchema } from '@/schemas/ficha.schema';

const Fichas = () => {
  const { fichas, loading, crearFicha, actualizarFicha, eliminarFicha } = useFichas();
  const { usuarios } = useUsuarios();
  const { programas } = useProgramas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Ficha>>({});

  const columns: Column<Ficha>[] = [
    { key: "id_ficha", label: "ID Ficha", filterable: true },
    {
      key: "usuario_ficha_id",
      label: "Usuario",
      filterable: true,
      render: (ficha) => {
        const usuario = usuarios.find(u => u.id_usuario === ficha.usuario_ficha_id);
        return usuario ? usuario.nombre : ficha.usuario_ficha_id;
      }
    },
    {
      key: "programa_id",
      label: "Programa",
      filterable: true,
      render: (ficha) => {
        const programa = programas.find(p => p.id_programa === ficha.programa_id);
        return programa ? programa.nombre_programa : ficha.programa_id;
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Última Modificación", filterable: true },
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
    { key: "usuario_ficha_id", label: "Usuario", type: "select", required: true, options: usuarios.map(u => ({ label: u.nombre, value: u.id_usuario })) },
    { key: "programa_id", label: "Programa", type: "select", required: true, options: programas.map(p => ({ label: p.nombre_programa, value: p.id_programa })) },
  ];

  // Crear o actualizar ficha
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const usuarioSeleccionado = usuarios.find(u => u.id_usuario === Number(values.usuario_ficha_id));
      const programaSeleccionado = programas.find(p => p.id_programa === Number(values.programa_id));
      if (!usuarioSeleccionado || !programaSeleccionado) {
        alert("Por favor selecciona un usuario y un programa válidos.");
        return;
      }
      if (editingId) {
        await actualizarFicha(editingId, {
          ...values,
          usuario_ficha_id: usuarioSeleccionado.id_usuario,
          programa_id: programaSeleccionado.id_programa,
        });
        alert('Ficha actualizada con éxito');
      } else {
        await crearFicha({
          id_ficha: Number(values.id_ficha),
          usuario_ficha_id: usuarioSeleccionado.id_usuario,
          programa_id: programaSeleccionado.id_programa,
          fecha_creacion: values.fecha_creacion,
          fecha_modificacion: values.fecha_modificacion,
        });
        alert('Ficha creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar la ficha:', error);
    }
  };

  // Eliminar ficha
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ficha?")) return;
    try {
      await eliminarFicha(id);
      alert("Ficha eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la ficha:", error);
    }
  };

  // Abrir modal para crear nueva ficha
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar ficha existente
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
            <GlobalTable
              columns={columns}
              data={fichas.map((ficha) => ({ ...ficha, key: ficha.id_ficha }))}
              rowsPerPage={6}
            />
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
                  initialValues={{
                    ...Object.fromEntries(
                      Object.entries(formData).map(([key, value]) => [key, value?.toString() || ""])
                    ),
                    usuario_ficha_id: formData.usuario_ficha_id ? String(formData.usuario_ficha_id) : '',
                    programa_id: formData.programa_id ? String(formData.programa_id) : '',
                  }}
                  schema={fichaSchema}
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