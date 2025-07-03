import { useState } from "react";
import { useGetUsuarios, usePostUsuario, usePostCargarUsuarios, usePutUsuario } from "@/hooks/usuario";
import { useGetRoles } from "@/hooks/roles";
import { Usuario } from "@/types";
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast, TablaImagen } from "@/components/atomos";
import { ImageSelector } from "@/components/moleculas";
import { Column, createEntityTable, Form, FormField } from "@/components/organismos";
import { usuarioSchema, usuarioEditSchema } from "@/schemas";
import Roles from "./Roles";

const Usuarios = () => {
  const { usuarios, loading } = useGetUsuarios();
  const { crearUsuario } = usePostUsuario();
  const { actualizarUsuario } = usePutUsuario();
  const { roles } = useGetRoles();
  const cargaMasivaMutation = usePostCargarUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRolModalOpen, setIsRolModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Estado para carga masiva
  const [archivoExcel, setArchivoExcel] = useState<File | null>(null);
  const [resultadoCarga, setResultadoCarga] = useState<any | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const handleCargaExcel = async () => {
    if (!archivoExcel) {
      showErrorToast("Por favor selecciona un archivo Excel");
      return;
    }

    // Validar que sea un archivo Excel
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = archivoExcel.name.toLowerCase();
    const isValidFile = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidFile) {
      showErrorToast("Por favor selecciona un archivo Excel válido (.xlsx o .xls)");
      return;
    }

    // Validar que el archivo tenga contenido
    if (archivoExcel.size === 0) {
      showErrorToast("El archivo está vacío");
      return;
    }

    console.log('Enviando archivo:', {
      name: archivoExcel.name,
      size: archivoExcel.size,
      type: archivoExcel.type
    });

    try {
      const resultado = await cargaMasivaMutation.mutateAsync({
        archivo: archivoExcel,
        rol_id: 2, // Fijar el rol_id a 2 siempre
      });
      
      
      // Acceder a los datos correctamente según la estructura de respuesta
      const dataResult = resultado.data?.data || resultado.data || resultado;
      const resumen = dataResult.resumen;
      
      setResultadoCarga(dataResult);
      setMostrarResultados(true);
      setArchivoExcel(null);
      
      // Limpiar el input de archivo
      const fileInput = document.getElementById('archivo-excel') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      showSuccessToast(`Carga exitosa: ${resumen.creados} usuarios creados, ${resumen.fallidos} fallidos`);
    } catch (err: any) {
      setResultadoCarga(null);
      setMostrarResultados(false);
      
      let mensaje = "Error al cargar el archivo. Verifica el formato y que los datos sean correctos.";
      
      if (err?.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err?.message) {
        mensaje = err.message;
      }
      
      showErrorToast(mensaje);
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArchivoExcel(file);
    
    // Limpiar resultados previos cuando se selecciona un nuevo archivo
    if (file) {
      setResultadoCarga(null);
      setMostrarResultados(false);
    }
  };

  const cerrarResultados = () => {
    setMostrarResultados(false);
    setResultadoCarga(null);
  };

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

  // Campos de formulario centralizados con layout de dos columnas
  const formFieldsCreate: FormField[] = [
    { 
      key: "nombre", 
      label: "Nombre", 
      type: "text", 
      required: true,
      className: "col-span-1" // Clase para grid
    },
    { 
      key: "apellido", 
      label: "Apellido", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "edad", 
      label: "Edad", 
      type: "number", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "cedula", 
      label: "Cédula", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "email", 
      label: "Email", 
      type: "email", 
      required: true,
      className: "col-span-2" // Email ocupa todo el ancho
    },
    { 
      key: "contrasena", 
      label: "Contraseña", 
      type: "password", 
      required: true,
      className: "col-span-2"
    },
    { 
      key: "telefono", 
      label: "Teléfono", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      className: "col-span-1",
      options: roles.map(r => ({ label: r.nombre_rol, value: r.id_rol })),
      extraButton: {
        icon: "+",
        onClick: () => setIsRolModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    }
  ];

  const formFieldsEdit: FormField[] = [
    {  key: "nombre", label: "Nombre", type: "text", required: true, className: "col-span-1" },
    { key: "apellido", label: "Apellido", type: "text", required: true, className: "col-span-1"},
    { 
      key: "edad", 
      label: "Edad", 
      type: "number", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "cedula", 
      label: "Cédula", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "email", 
      label: "Email", 
      type: "email", 
      required: true,
      className: "col-span-2"
    },
    { 
      key: "contrasena", 
      label: "Contraseña", 
      type: "password", 
      required: false,
      className: "col-span-2"
    },
    { 
      key: "telefono", 
      label: "Teléfono", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      className: "col-span-1",
      options: roles.map(r => ({ label: r.nombre_rol, value: r.id_rol })),
      extraButton: {
        icon: "+",
        onClick: () => setIsRolModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const rol_id = parseInt(values.rol_id);
      if (isNaN(rol_id)) {
        throw new Error("El rol seleccionado no es válido");
      }
      
      const imagenPath = formData.imagen || '';

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
      showErrorToast('Error al guardar el usuario');
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
      showSuccessToast(`El usuario fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del usuario.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      edad: usuario.edad ? usuario.edad.toString() : '',
      cedula: usuario.cedula,
      email: usuario.email,
      telefono: usuario.telefono,
      contrasena: usuario.contrasena,
      rol_id: usuario.rol_id ? usuario.rol_id.toString() : '',
      imagen: usuario.imagen || '',
      fecha_registro: usuario.fecha_registro,
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

        {/* Sección de Carga Masiva */}
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Carga Masiva de Usuarios</h2>
            <div className="flex items-center gap-3 mb-3">
              <input
                id="archivo-excel"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleArchivoChange}
                className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <Boton
                onClick={handleCargaExcel}
                disabled={!archivoExcel || cargaMasivaMutation.isPending}
                className={`px-4 py-2 rounded-md font-medium ${
                  !archivoExcel || cargaMasivaMutation.isPending
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {cargaMasivaMutation.isPending ? 'Cargando...' : 'Cargar Excel'}
              </Boton>
            </div>
            
            {archivoExcel && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Archivo seleccionado: <span className="font-medium">{archivoExcel.name}</span>
              </p>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <p>• El archivo debe contener las columnas: nombre, apellido, cedula</p>
              <p>• Columnas opcionales: edad, email, telefono</p>
              <p>• Formatos permitidos: .xlsx, .xls</p>
            </div>
          </div>
        </AnimatedContainer>

        {/* Resultados de la carga masiva */}
        {mostrarResultados && resultadoCarga && (
          <AnimatedContainer animation="slideUp" delay={200} duration={400}>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Resultados de la Carga</h3>
                <button
                  onClick={cerrarResultados}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {resultadoCarga.resumen?.total || 0}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Procesados</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {resultadoCarga.resumen?.creados || 0}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Creados</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {resultadoCarga.resumen?.fallidos || 0}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Fallidos</div>
                </div>
              </div>

              {resultadoCarga.usuarios && resultadoCarga.usuarios.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left text-gray-700 dark:text-gray-200">Cédula</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left text-gray-700 dark:text-gray-200">Nombre</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left text-gray-700 dark:text-gray-200">Apellido</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left text-gray-700 dark:text-gray-200">Email</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left text-gray-700 dark:text-gray-200">Estado</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left text-gray-700 dark:text-gray-200">Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadoCarga.usuarios.map((usuario: any, index: number) => (
                        <tr 
                          key={index} 
                          className={usuario.status === 'error' 
                            ? 'bg-red-50 dark:bg-red-900/20' 
                            : 'bg-green-50 dark:bg-green-900/20'
                          }
                        >
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{usuario.cedula}</td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{usuario.nombre || '-'}</td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{usuario.apellido || '-'}</td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{usuario.email || '-'}</td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              usuario.status === 'creado' 
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' 
                                : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                            }`}>
                              {usuario.status === 'creado' ? 'Creado' : 'Error'}
                            </span>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-xs text-gray-800 dark:text-gray-200">
                            {usuario.mensaje || (usuario.status === 'creado' ? 'Usuario creado exitosamente' : '-')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AnimatedContainer>
        )}

        {/* Botón para crear usuario individual */}
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded-md"
          >
            Crear Nuevo Usuario
          </Boton>
        </AnimatedContainer>

        {/* Tabla de usuarios */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando usuarios...</p>
          </div>
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
          </AnimatedContainer>
        )}

        {/* Modal para crear/editar usuario */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-4xl">
              <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative  bg-white dark:bg-gray-800">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Componente para seleccionar imágenes */}
                  <div className="col-span-1 flex flex-col items-center justify-start bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                    <ImageSelector
                      label="Imagen del Usuario"
                      value={formData.imagen || ''}
                      onChange={(imagePath: string) => {
                        setFormData(prev => ({ ...prev, imagen: imagePath }));
                      }}
                    />
                  </div>
                  
                  <div className="col-span-1 bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
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
                </div>
              </div>
            </AnimatedContainer>  
          </div> 
        )}

        {/* Modal para crear rol */}
        {isRolModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsRolModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <Roles isInModal={true} onRolCreated={() => {
                setIsRolModalOpen(false);
                // Aquí deberías actualizar la lista de roles
              }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Usuarios;