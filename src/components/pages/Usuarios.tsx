import { useState } from "react";
import { showSuccessToast, showErrorToast } from "@/components/atomos/Toast";
import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { usePostUsuario } from "@/hooks/usuario/usePostUsuario";
import { usePutUsuario } from "@/hooks/usuario/usePutUsuario";
import { useGetRoles } from "@/hooks/roles/useGetRoles";
import { Usuario } from "@/types/usuario";
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import Boton from "@/components/atomos/Boton";
import { Column, createEntityTable } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { TablaImagen } from "@/components/atomos/Imagen";
import ImageSelector from "@/components/moleculas/ImageSelector";
import { usuarioSchema, usuarioEditSchema } from "@/schemas/usuario.schema";

const Usuarios = () => {
  const { usuarios, loading } = useGetUsuarios();
  const { crearUsuario } = usePostUsuario();
  const { actualizarUsuario } = usePutUsuario();
  const { roles } = useGetRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});



  const renderRol = (rol_id: number) => {
    const rol = roles.find(r => r.id_rol === rol_id);
    return rol ? rol.nombre_rol : rol_id;
  };

  // Columnas centralizadas y limpias
  const columns: Column<Usuario>[] = [
    {
      key: "imagen",
      label: "Imagen",
      filterable: false,
      render: usuario => {
        // Validar url y mostrar fallback si es necesario
        let imageUrl = usuario.imagen || '';
        
        // Si la imagen no tiene http/https y no es una ruta relativa con /, asumimos que es una URL incompleta
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `https://${imageUrl}`;
        }
        
        return (
          <TablaImagen
            src={imageUrl}
            alt={`Avatar de ${usuario.nombre} ${usuario.apellido}`}
            size="md"
          />
        );
      }
    },
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
      render: usuario => renderRol(usuario.rol_id)
    },
  ];

  // Campos de formulario centralizados
  const formFieldsCreate: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "contrasena", label: "Contraseña", type: "password", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      options: roles.map(r => ({ label: r.nombre_rol, value: r.id_rol }))
    }
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "contrasena", label: "Contraseña", type: "password", required: false },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      options: roles.map(r => ({ label: r.nombre_rol, value: r.id_rol }))
    }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const rol_id = parseInt(values.rol_id);
      if (isNaN(rol_id)) {
        throw new Error("El rol seleccionado no es válido");
      }
      
      const imagenPath = formData.imagen || '';
      console.log('Imagen seleccionada:', imagenPath); 

      const userData = {
        nombre: values.nombre,
        apellido: values.apellido,
        edad: parseInt(values.edad),
        cedula: values.cedula,
        email: values.email,
        telefono: values.telefono,
        rol_id: rol_id,
        imagen: imagenPath || null
      };

      if (editingId) {
        const updatePayload: Record<string, any> = {
          ...userData
        };
        
        if (values.contrasena && values.contrasena.trim() !== '') {
          updatePayload.contrasena = values.contrasena;
        }
        
        await actualizarUsuario(editingId, updatePayload);
        showSuccessToast("Usuario actualizado correctamente");
      } else {
        if (!values.contrasena || values.contrasena.trim() === '') {
          throw new Error("La contraseña es obligatoria para crear un nuevo usuario");
        }

        const createPayload = {
          ...userData,
          contrasena: values.contrasena,
          estado: true,
          fecha_registro: new Date().toISOString().split('T')[0]
        };

        await crearUsuario(createPayload as any); 
        showSuccessToast("Usuario creado correctamente");
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error("Error al procesar el usuario:", error);
      showErrorToast(error instanceof Error ? error.message : "Error al procesar el usuario");
    }
  };

  const handleToggleEstado = async (usuario: Usuario) => {
    try {
      const nuevoEstado = !usuario.estado;
      const updateData = {
        id_usuario: usuario.id_usuario,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarUsuario(usuario.id_usuario, updateData);
      // Usar el nuevo Toast en lugar de la alerta
      showSuccessToast(`El usuario fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      // Usar el nuevo Toast para mostrar el error
      showErrorToast("Error al cambiar el estado del usuario.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    console.log('Editando usuario:', usuario); // Para depuración
    // Convertir los valores a string para el formulario
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      edad: usuario.edad ? usuario.edad.toString() : '',
      cedula: usuario.cedula,
      email: usuario.email,
      telefono: usuario.telefono,
      rol_id: usuario.rol_id ? usuario.rol_id.toString() : '',
      imagen: usuario.imagen || '',
      fecha_registro: usuario.fecha_registro,
      // No incluimos contraseña en el formData al editar
      // ya que es opcional y se maneja en el formulario
    });
    setEditingId(usuario.id_usuario);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Usuario
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: usuarios,
            idField: 'id_usuario',
            handlers: {
              onToggleEstado: handleToggleEstado,
              onEdit: handleEdit
            }
          })}
        </AnimatedContainer>)}

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  
                  <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </h2>
                {/* Componente para seleccionar imágenes */}
                <ImageSelector
                  label="Imagen del Usuario"
                  value={formData.imagen || ''}
                  onChange={(imagePath: string) => {
                    setFormData(prev => ({ ...prev, imagen: imagePath }));
                  }}
                />
                <Form
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    ...(editingId 
                      ? { fecha_modificacion: new Date().toISOString().split('T')[0] }
                      : { fecha_creacion: new Date().toISOString().split('T')[0] })
                  }}
                  schema={editingId ? usuarioEditSchema : usuarioSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Usuarios;
