import { useState } from "react";
import { Alert } from "@heroui/react";
import AlertDialog from '@/components/atomos/AlertDialog';
import { Pencil, Trash, Eye } from 'lucide-react'; // Importar iconos de lucide-react
import { useUsuarios } from '../../hooks/useUsuarios';
import { Usuario } from '../../types/usuario';
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import AnimatedContainer from "../atomos/AnimatedContainer";
import { useNavigate } from "react-router-dom";
import { useRoles } from '@/hooks/useRoles';

const Usuarios = () => {
  const navigate = useNavigate();
  const { usuarios, loading, crearUsuario, actualizarUsuario, eliminarUsuario } = useUsuarios();
  const { roles } = useRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, id: number | null }>({ open: false, id: null });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<Usuario>[] = [
    { key: "nombre", label: "Nombre", filterable: true },
    { key: "apellido", label: "Apellido", filterable: true },
    { key: "edad", label: "Edad", filterable: true },
    { key: "cedula", label: "Cédula", filterable: true },
    { key: "email", label: "Email", filterable: true },
    { key: "telefono", label: "Teléfono", filterable: true },
    {
      key: "rol_id",
      label: "Rol",
      filterable: true,
      render: (usuario) => {
        const rol = roles.find(r => r.id === usuario.rol_id);
        return rol ? rol.nombre : usuario.rol_id;
      }
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (usuario) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(usuario)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
          <Boton
            onPress={() => handleDeleteClick(usuario.id_usuario)}
            className="bg-red-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Eliminar"
          >
            <Trash size={18} />
          </Boton>
          <Boton
            onPress={() => handleViewDetails(usuario.id_usuario)}
            className="bg-blue-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Detalles"
          >
            <Eye size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "contrasena", label: "Contraseña", type: "password", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    { key: "rol_id", label: "Rol", type: "number", required: true}
  ];


  // Crear o actualizar usuario
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      // Buscar el rol seleccionado por id
      const rolSeleccionado = roles.find(r => r.id === Number(values.rol_id));
      const payload = {
        ...values,
        rol_id: rolSeleccionado ? rolSeleccionado.id : undefined,
        fecha_registro: new Date().toISOString(),
      };
      if (editingId) {
        await actualizarUsuario(editingId, { ...payload, id: editingId });
        setSuccessAlertText('El usuario fue actualizado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearUsuario(payload as Omit<Usuario, 'id_usuario'>);
        setSuccessAlertText('El usuario fue creado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Ocurrió un error al guardar el usuario.',
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Eliminar usuario con confirmación personalizada
  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await eliminarUsuario(deleteConfirm.id);
      setSuccessAlertText('El usuario fue eliminado correctamente.');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setAlert({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    } catch (error) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Ocurrió un error al eliminar el usuario.',
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  // Abrir modal para crear nuevo usuario
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar usuario existente
  const handleEdit = (usuario: Usuario) => {
    setFormData(usuario);
    setEditingId(usuario.id_usuario);
    setIsModalOpen(true);
  };

  // Ver detalles de usuario
  const handleViewDetails = (id: number) => {
    navigate(`/detalle-usuario/${id}`);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#ECF5FF' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
            <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
            <Boton
              onPress={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 mb-4 hover:bg-blue-700"
            >
              Crear Nuevo Usuario
            </Boton>
            <Boton
              onPress={() => navigate('/detalle-usuario')}
              className="bg-green-500 text-white px-4 py-2"
            >
              Generar Informe de Usuario
            </Boton>
          </AnimatedContainer>

          {/* Tabla de usuarios */}
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <GlobalTable
                columns={columns}
                data={usuarios.map((usuario) => ({ ...usuario, key: usuario.id_usuario }))}
                rowsPerPage={6}
              />
            )}
          </AnimatedContainer>

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                  </h2>
                  {roles.length === 0 ? (
                    <div className="text-center py-8">Cargando roles...</div>
                  ) : (
                    <Form
                      fields={formFields}
                      onSubmit={handleSubmit}
                      buttonText={editingId ? "Actualizar" : "Crear"}
                      initialValues={{
                        ...formData,
                        rol_id: formData.rol_id ?? '',
                      }}
                    />
                  )}
                  <div className="flex justify-end mt-4">
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          )}
        </main>
      </div>
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
      <AlertDialog
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onConfirm}
        confirmText="Aceptar"
        cancelText=""
      />
      <AlertDialog
        isOpen={deleteConfirm.open}
        title="¿Eliminar usuario?"
        message="¿Estás seguro de que deseas eliminar este usuario?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Usuarios;