import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import axios from 'axios';

type Administrador = {
  id_administrador: number;
  fecha_accion: string;
  rutas: string;
  descripcion_ruta: string;
  bandera_accion: boolean;
  mensaje_cambio: string;
  tipo_permiso: string;
  usuario_id: number;
};

const AdministradorPage = () => {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Administrador>>({
    fecha_accion: new Date().toISOString().split('T')[0],
    rutas: '',
    descripcion_ruta: '',
    bandera_accion: false,
    mensaje_cambio: '',
    tipo_permiso: '',
    usuario_id: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const loadAdministradores = async () => {
    try {
      const response = await axios.get('http://localhost:3002/administrador');
      const data = response.data;
      setAdministradores(data);
    } catch (error) {
      console.error('Error al cargar administradores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdministradores();
  }, []);

  const formFields: FormField[] = [
    { key: "fecha_accion", label: "Fecha", type: "date", required: true },
    { key: "rutas", label: "Ruta", type: "text", required: true },
    { key: "descripcion_ruta", label: "Descripción", type: "text", required: true },
    { key: "bandera_accion", label: "Estado", type: "checkbox", required: false },
    { key: "mensaje_cambio", label: "Mensaje", type: "text", required: true },
    { key: "tipo_permiso", label: "Tipo de Permiso", type: "text", required: true },
    { key: "usuario_id", label: "ID Usuario", type: "number", required: true }
  ];
 
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/administrador/${editingId}`
        : "http://localhost:3002/administrador";

      const response = await axios({
        method,
        url,
        data: values,
        headers: { "Content-Type": "application/json" }
      });

      if (response.status !== 200) {
        throw new Error("Error al guardar el administrador");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Administrador ${message} con éxito`);

      // Refrescar la lista
      const updatedData = await axios.get("http://localhost:3002/administrador");
      setAdministradores(updatedData.data);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el administrador:", error);
      alert("Error al guardar el administrador");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;

    try {
      const response = await axios.delete(`http://localhost:3002/administrador/${id}`);
      
      if (response.status !== 200) {
        throw new Error("Error al eliminar el administrador");
      }

      alert("Administrador eliminado con éxito");
      setAdministradores(administradores.filter(admin => admin.id_administrador !== id));
    } catch (error) {
      console.error("Error al eliminar el administrador:", error);
      alert("Error al eliminar el administrador");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Administrador) => {
    setFormData(admin);
    setEditingId(admin.id_administrador);
    setIsModalOpen(true);
  };





  const columns: Column<Administrador>[] = [
    { key: 'id_administrador', label: 'ID' },
    { key: 'fecha_accion', label: 'Fecha' },
    { key: 'rutas', label: 'Ruta' },
    { key: 'descripcion_ruta', label: 'Descripción' },
    { key: 'bandera_accion', label: 'Estado' },
    { key: 'mensaje_cambio', label: 'Mensaje' },
    { key: 'tipo_permiso', label: 'Permiso' },
    { key: 'usuario_id', label: 'Usuario ID' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row: Administrador) => (
        <div className="flex gap-2">
          <Boton onClick={() => handleEdit(row)} className="bg-yellow-500 text-white px-2 py-1">
            Editar
          </Boton>
          <Boton onClick={() => handleDelete(row.id_administrador)} className="bg-red-500 text-white px-2 py-1">
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Administradores</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Administrador
          </Boton>

          {/* Tabla de administradores */}
          {loading ? (
            <p>Cargando administradores...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={administradores.map((admin) => ({ ...admin, key: admin.id_administrador }))}
              rowsPerPage={6}
            />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Administrador" : "Crear Nuevo Administrador"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    bandera_accion: formData.bandera_accion ? "true" : "false",
                  }}
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

export default AdministradorPage;
