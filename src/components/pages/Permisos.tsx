import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { usePermisos } from '../../hooks/usePermisos';
import { Permiso } from '../../api/permisos/getPermisos';
import { useModulos } from '../../hooks/useModulos';
import { useRoles } from '../../hooks/useRoles';
import { Pencil, Trash } from 'lucide-react';
import { Alert } from '@heroui/react';

const Permisos = () => {
  const { permisos, loading, crearPermiso, actualizarPermiso, eliminarPermiso } = usePermisos();
  const { modulos } = useModulos();
  const { roles } = useRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Permiso>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<Permiso & { key: number }>[] = [
    { key: "nombre", label: "Nombre", filterable: true },
    { key: "codigo_nombre", label: "Código Nombre", filterable: true },
    {
      key: "modulo_id",
      label: "Módulo",
      filterable: true,
      render: (permiso) => {
        const modulo = modulos.find(m => m.id_modulo === (permiso as any).modulo_id);
        return modulo ? modulo.descripcion_ruta : (permiso as any).modulo_id;
      }
    },
    {
      key: "rol_id",
      label: "Rol",
      filterable: true,
      render: (permiso) => {
        const rol = roles.find(r => r.id_rol === (permiso as any).rol_id);
        return rol ? rol.nombre_rol : (permiso as any).rol_id;
      }
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (permiso) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(permiso)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
          <Boton
            onPress={() => handleDelete((permiso as any).id_permiso || permiso.id)}
            className="bg-red-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Eliminar"
          >
            <Trash size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "codigo_nombre", label: "Código Nombre", type: "text", required: true },
    { key: "modulo_id", label: "Módulo", type: "select", required: true, options: modulos.map(m => m.descripcion_ruta) },
    { key: "rol_id", label: "Rol", type: "select", required: true, options: roles.map(r => r.nombre_rol) },
  ];

  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const moduloSeleccionado = modulos.find(m => m.descripcion_ruta === values.modulo_id);
      const rolSeleccionado = roles.find(r => r.nombre_rol === values.rol_id);
      if (!moduloSeleccionado || !rolSeleccionado) {
        alert("Por favor selecciona un módulo y un rol válidos.");
        return;
      }
      const payload = {
        nombre: values.nombre as string,
        codigo_nombre: values.codigo_nombre as string,
        modulo_id: moduloSeleccionado.id_modulo,
        rol_id: rolSeleccionado.id_rol
      };
      if (editingId) {
        await actualizarPermiso(editingId, { id: editingId, ...payload });
        setSuccessAlertText('Permiso actualizado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearPermiso(payload);
        setSuccessAlertText('Permiso creado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el permiso:', error);
      alert('Error al guardar el permiso');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este permiso?')) return;
    try {
      await eliminarPermiso(id);
      setSuccessAlertText('Permiso eliminado con éxito');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error al eliminar el permiso:', error);
      alert('Error al eliminar el permiso');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permiso: Permiso) => {
    setFormData(permiso);
    setEditingId(permiso.id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F1F8FF' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Permisos</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Permiso
          </Boton>

          {loading ? (
            <p>Cargando permisos...</p>
          ) : (
            <GlobalTable<Permiso & { key: number }>
              columns={columns}
              data={permisos.map((permiso) => ({
                ...permiso,
                id: (permiso as any).id ?? (permiso as any).id_permiso,
                key: (permiso as any).id ?? (permiso as any).id_permiso
              }))}
              rowsPerPage={6}
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Botón X para cerrar en la esquina superior derecha */}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Permiso" : "Crear Nuevo Permiso"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    nombre: formData.nombre || '',
                    codigo_nombre: formData.codigo_nombre || '',
                    modulo_id: modulos.find(m => m.id_modulo === formData.modulo_id)?.descripcion_ruta || '',
                    rol_id: roles.find(r => r.id_rol === formData.rol_id)?.nombre_rol || '',
                  }}
                />
              </div>
            </div>
          )}

          {showSuccessAlert && (
            <div className="fixed top-4 right-4 z-50">
              <Alert
                hideIconWrapper
                color="success"
                description={successAlertText}
                title="¡Éxito!"
                variant="solid"
                onClose={() => setShowSuccessAlert(false)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Permisos;