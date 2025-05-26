import { useState } from "react";
import { Pencil } from 'lucide-react';
import { Alert } from '@heroui/react';
import { useGetPermisos } from '@/hooks/permisos/useGetPermisos';
import { usePostPermiso } from '@/hooks/permisos/usePostPermiso';
import { usePutPermiso } from '@/hooks/permisos/usePutPermiso';
import { useGetRoles } from '@/hooks/roles/useGetRoles';
import { useGetModulos } from '@/hooks/modulos/useGetModulos';
import { Permiso } from '@/types/permiso';
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { permisoSchema } from '@/schemas/permiso.schema';

const Permisos = () => {
  const { permisos, loading: loadingPermisos } = useGetPermisos();
  const { crearPermiso } = usePostPermiso();
  const { actualizarPermiso } = usePutPermiso();
  const { roles, loading: loadingRoles } = useGetRoles();
  const { modulos, loading: loadingModulos } = useGetModulos();
  const loading = loadingPermisos || loadingRoles || loadingModulos;
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Permiso>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');

  const columns: Column<Permiso & { key: number }>[] = [
    { key: "nombre", label: "Nombre", filterable: true},
    { key: "codigo_nombre", label: "Código Nombre", filterable: true},
    {
      key: "modulo_id",
      label: "Módulo",
      filterable: true,
      render: (permiso) =>{
        if (permiso.modulo){
          return permiso.modulo.descripcion_ruta;
        }
        if (permiso.modulo_id && (!loadingModulos && modulos.length > 0)){
          const modulo = modulos.find(m => m.id_modulo === permiso.modulo_id);
          return modulo ? modulo.descripcion_ruta : `ID: ${permiso.modulo_id}`;
        }
        return 'No disponible';
      }
    },
    {
      key: "rol_id",
      label: "Rol",
      filterable: true,
      render: (permiso) =>{
        if (permiso.rol){
          return permiso.rol.nombre_rol;
        }
        if (permiso.rol_id && (!loadingRoles && roles.length > 0)){
          const rol = roles.find(r => r.id_rol === permiso.rol_id);
          return rol ? rol.nombre_rol : `ID: ${permiso.rol_id}`;
        }
        return 'No disponible';
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (permiso) => (
        <div className="flex items-center justify-center">
          <Toggle
            isOn={permiso.estado === true || String(permiso.estado) === "true" || Number(permiso.estado) === 1}
            onToggle={() => handleToggleEstado(permiso)}
          />
        </div>
      )
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
        </div>
      ),
    },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "codigo_nombre", label: "Código Nombre", type: "text", required: true },
    { 
      key: "modulo_id", 
      label: "Módulo", 
      type: "select", 
      required: true, 
      options: modulos && modulos.length > 0 
        ? modulos.map(m => ({ label: String(m.descripcion_ruta), value: m.id_modulo }))
        : []
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true, 
      options: roles && roles.length > 0
        ? roles.map(r => ({ label: String(r.nombre_rol), value: r.id_rol }))
        : []
    },
  ];
  
  const formFieldsEdit: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "codigo_nombre", label: "Código Nombre", type: "text", required: true },
    { 
      key: "modulo_id", 
      label: "Módulo", 
      type: "select", 
      required: true, 
      options: modulos && modulos.length > 0 
        ? modulos.map(m => ({ label: String(m.descripcion_ruta), value: m.id_modulo }))
        : []
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true, 
      options: roles && roles.length > 0
        ? roles.map(r => ({ label: String(r.nombre_rol), value: r.id_rol }))
        : []
    },
  ];

  // Removed duplicate formFields as we're now using formFieldsCreate and formFieldsEdit

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Validar los datos con Zod
      const parsed = permisoSchema.safeParse(values);
      if (!parsed.success) {
        setErrorAlertText(parsed.error.errors.map((e) => e.message).join("\n"));
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3000);
        return;
      }

      // Verificar que los valores de módulo y rol existan
      const moduloId = Number(values.modulo_id);
      const rolId = Number(values.rol_id);
      
      // Solo verificamos si los arrays están cargados
      if (!loadingModulos && !loadingRoles && modulos.length > 0 && roles.length > 0) {
        const moduloExiste = modulos.some(m => m.id_modulo === moduloId);
        const rolExiste = roles.some(r => r.id_rol === rolId);
        
        if (!moduloExiste || !rolExiste) {
          setErrorAlertText("El módulo o rol seleccionado no existe");
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 3000);
          return;
        }
      }

      // Preparar los datos para enviar al servidor según la estructura esperada por la API
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Si estamos editando, solo enviamos los campos que queremos actualizar
      if (editingId) {
        const updateData = {
          id: editingId, // Usamos 'id' en lugar de 'id_permiso' para compatibilidad con la API
          nombre: String(values.nombre).trim(),
          codigo_nombre: String(values.codigo_nombre).trim(),
          modulo_id: moduloId,
          rol_id: rolId,
          estado: true
        };
        
        await actualizarPermiso(editingId, updateData);
        setSuccessAlertText("Permiso actualizado correctamente");
      } else {
        // Si estamos creando, enviamos un objeto completo según la interfaz Permiso
        const newPermiso: Permiso = {
          id_permiso: 0, // El backend ignorará este valor y asignará uno nuevo
          nombre: String(values.nombre).trim(),
          codigo_nombre: String(values.codigo_nombre).trim(),
          modulo_id: moduloId,
          rol_id: rolId,
          estado: true,
          fecha_creacion: currentDate
        };
        
        await crearPermiso(newPermiso);
        setSuccessAlertText("Permiso creado correctamente");
      }
      
      // Mostrar mensaje de éxito y cerrar el modal
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setIsModalOpen(false);
      return;

      // Este código ya no es necesario porque lo hemos movido arriba

      // Mostrar mensaje de éxito y cerrar el modal
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error al guardar el permiso:", error);
      
      // Intentar obtener un mensaje de error más específico
      const errorMessage = error.response?.data?.message
        ? Array.isArray(error.response.data.message)
          ? error.response.data.message.join('\n')
          : error.response.data.message
        : "Error al guardar el permiso";
      
      setErrorAlertText(errorMessage);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Cambiar el estado (activo/inactivo) de un permiso
  const handleToggleEstado = async (permiso: Permiso) => {
    try {
      const nuevoEstado = !permiso.estado;
      
      const updateData = {
        id: permiso.id_permiso, // Usamos 'id' en lugar de 'id_permiso' para compatibilidad con la API
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarPermiso(permiso.id_permiso, updateData);
      setSuccessAlertText(`El permiso fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      setErrorAlertText("Error al cambiar el estado del permiso.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const handleEdit = (permiso: Permiso) => {
    setFormData(permiso);
    setEditingId(permiso.id_permiso);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
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
              data={permisos
                .map((permiso) => {
                // Create a safe copy with all properties explicitly converted to appropriate types
                const safePermiso = {
                  ...permiso,
                  // Ensure all properties exist and are safe to render
                  id_permiso: permiso.id_permiso,
                  nombre: permiso.nombre || '',
                  codigo_nombre: permiso.codigo_nombre || '',
                  modulo_id: permiso.modulo_id,
                  rol_id: permiso.rol_id,
                  estado: permiso.estado === true || String(permiso.estado) === "true" || Number(permiso.estado) === 1,
                  fecha_creacion: permiso.fecha_creacion || '',
                  key: permiso.id_permiso
                };
                
                return safePermiso;
              })
              .sort((a, b) => {
                if (a.estado === b.estado) return 0;
                return a.estado ? -1 : 1;
              })}
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
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
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    nombre: formData?.nombre ?? '',
                    codigo_nombre: formData?.codigo_nombre ?? '',
                    modulo_id: formData?.modulo_id ? String(formData.modulo_id) : '',
                    rol_id: formData?.rol_id ? String(formData.rol_id) : '',
                  }}
                  schema={permisoSchema}
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
          
          {showErrorAlert && (
            <div className="fixed top-4 right-4 z-50">
              <Alert
                hideIconWrapper
                color="danger"
                description={errorAlertText}
                title="Error"
                variant="solid"
                onClose={() => setShowErrorAlert(false)}
              />
            </div>
          )}
        </div>
    </>
  );
};

export default Permisos;
