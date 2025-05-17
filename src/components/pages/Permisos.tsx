import React, { useState, useEffect } from "react";
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
  const { permisos, loading } = useGetPermisos();
  // Estado para controlar el toggle visual sin depender de la recarga de datos
  const [toggleStates, setToggleStates] = useState<{[key: number]: boolean}>({});
  
  // Inicializar los estados de los toggles cuando los permisos se cargan
  useEffect(() => {
    if (permisos && permisos.length > 0) {
      const initialStates: {[key: number]: boolean} = {};
      permisos.forEach(permiso => {
        // Convertir correctamente el estado a booleano
        // Si es string "false" o false o 0 o null o undefined, debe ser false
        const estado = permiso.estado;
        initialStates[permiso.id_permiso] = estado === true || String(estado) === "true" || Number(estado) === 1;
      });
      setToggleStates(initialStates);
    }
  }, [permisos]);
  const { crearPermiso } = usePostPermiso();
  const { actualizarPermiso } = usePutPermiso();
  const { roles } = useGetRoles();
  const { modulos } = useGetModulos();
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Permiso>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  // Define a safe render function to handle any type of value
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value instanceof Date) return value.toLocaleDateString();
    // If it's an object, try to extract a meaningful name or description
    if (typeof value === 'object') {
      // For modules, use the description_ruta if available
      if (value.descripcion_ruta) return value.descripcion_ruta;
      // For roles, use the nombre_rol if available
      if (value.nombre_rol) return value.nombre_rol;
      // Otherwise convert to a simple string
      return '[Objeto]';
    }
    return String(value);
  };

  const columns: Column<Permiso & { key: number }>[] = [
    { 
      key: "nombre", 
      label: "Nombre", 
      filterable: true,
      render: (permiso) => String(permiso.nombre || '')
    },
    { 
      key: "codigo_nombre", 
      label: "Código Nombre", 
      filterable: true,
      render: (permiso) => String(permiso.codigo_nombre || '')
    },
    {
      key: "modulo_id",
      label: "Módulo",
      filterable: true,
      render: (permiso) => {
        // Find the module by ID and display only its description
        const modulo = modulos.find(m => m.id_modulo === permiso.modulo_id);
        if (modulo) {
          return modulo.descripcion_ruta;
        }
        // If module not found, just show the ID without prefix
        return String(permiso.modulo_id);
      }
    },
    {
      key: "rol_id",
      label: "Rol",
      filterable: true,
      render: (permiso) => {
        // Find the role by ID and display only its name
        const rol = roles.find(r => r.id_rol === permiso.rol_id);
        if (rol) {
          return rol.nombre_rol;
        }
        // If role not found, just show the ID without prefix
        return String(permiso.rol_id);
      }
    },
    { 
      key: "fecha_creacion", 
      label: "Fecha de Creación",
      render: (permiso) => {
        if (typeof permiso.fecha_creacion === 'string') {
          try {
            const date = new Date(permiso.fecha_creacion);
            return date.toLocaleDateString();
          } catch (e) {
            return String(permiso.fecha_creacion);
          }
        }
        return String(permiso.fecha_creacion || '');
      }
    },
    {
      key: "estado",
      label: "Estado",
      render: (permiso) => (
        <div className="flex items-center justify-center">
          <Toggle
            isOn={toggleStates[permiso.id_permiso] ?? (permiso.estado === true || String(permiso.estado) === "true" || Number(permiso.estado) === 1)}
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

  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "codigo_nombre", label: "Código Nombre", type: "text", required: true },
    { 
      key: "modulo_id", 
      label: "Módulo", 
      type: "select", 
      required: true, 
      options: modulos?.map(m => ({ label: m.descripcion_ruta, value: String(m.id_modulo) })) ?? [] 
    },
    { 
      key: "rol_id", 
      label: "Rol", 
      type: "select", 
      required: true, 
      options: roles?.map(r => ({ label: r.nombre_rol, value: String(r.id_rol) })) ?? [] 
    },
    { key: "estado", label: "Estado", type: "select", required: true, options: [{ label: "Activo", value: "Activo" }, { label: "Inactivo", value: "Inactivo" }] },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];

  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const moduloId = Number(values.modulo_id);
      const rolId = Number(values.rol_id);

      const moduloSeleccionado = modulos.find(m => m.id_modulo === moduloId);
      const rolSeleccionado = roles.find(r => r.id_rol === rolId);

      if (!moduloSeleccionado || !rolSeleccionado) {
        alert("Por favor selecciona un módulo y un rol válidos.");
        return;
      }

      const payload = {
        nombre: values.nombre as string,
        codigo_nombre: values.codigo_nombre as string,
        modulo_id: moduloId,
        rol_id: rolId,
        estado: values.estado === "Activo",
        fecha_creacion: new Date(values.fecha_creacion as string).toISOString()
      };

      if (editingId) {
        await actualizarPermiso(editingId, { id: editingId, ...payload });
        setSuccessAlertText('Permiso actualizado con éxito');
      } else {
        await crearPermiso(payload);
        setSuccessAlertText('Permiso creado con éxito');
      }
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el permiso:', error);
      alert('Error al guardar el permiso');
    }
  };

  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ fecha_creacion: today });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Cambiar el estado (activo/inactivo) de un permiso
  const handleToggleEstado = async (permiso: Permiso) => {
    try {
      // Preparar los datos para actualizar solo el estado
      // Determinar el estado actual correctamente
      const estado = permiso.estado;
      const estadoActual = toggleStates[permiso.id_permiso] ?? (estado === true || String(estado) === "true" || Number(estado) === 1);
      const nuevoEstado = !estadoActual;
      
      // Actualizar el estado visual del toggle inmediatamente
      setToggleStates(prev => ({
        ...prev,
        [permiso.id_permiso]: nuevoEstado
      }));
      
      // Mostrar mensaje de éxito inmediatamente
      setSuccessAlertText(`El permiso fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // Crear un objeto Permiso para la actualización en el servidor
      // Importante: Enviar el estado en el formato que espera el backend (false, no "false")
      const updateData = {
        id: permiso.id_permiso,
        estado: nuevoEstado // Enviar como booleano
      };
      
      console.log('Enviando actualización al servidor:', { id: permiso.id_permiso, estado: nuevoEstado });
      
      // Actualizar el permiso en el servidor
      await actualizarPermiso(permiso.id_permiso, updateData);
      
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      alert('Error al cambiar el estado del permiso');
      
      // Si hay un error, revertir el cambio visual
      setToggleStates(prev => ({
        ...prev,
        [permiso.id_permiso]: toggleStates[permiso.id_permiso] ?? (permiso.estado === true || String(permiso.estado) === "true" || Number(permiso.estado) === 1)
      }));
    }
  };

  const handleEdit = (permiso: Permiso) => {
    setFormData({
      ...permiso,
      estado: permiso.estado
    });
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
                
                // Convert any remaining object properties to strings to prevent rendering errors
                Object.keys(safePermiso).forEach(key => {
                  const value = safePermiso[key as keyof typeof safePermiso];
                  if (typeof value === 'object' && value !== null) {
                    (safePermiso as any)[key] = safeRender(value);
                  }
                });
                
                return safePermiso;
              })
              // Ordenar por estado: activos primero, inactivos después
              .sort((a, b) => {
                // Usar toggleStates para reflejar el estado actual, incluso si acaba de cambiar
                const aActive = toggleStates[a.id_permiso] ?? (a.estado === true || String(a.estado) === "true" || Number(a.estado) === 1);
                const bActive = toggleStates[b.id_permiso] ?? (b.estado === true || String(b.estado) === "true" || Number(b.estado) === 1);
                
                // Si los estados son diferentes, ordenar por estado
                if (aActive !== bActive) {
                  return aActive ? -1 : 1; // -1 pone a los activos primero
                }
                
                // Si los estados son iguales, ordenar alfabéticamente por nombre
                return (a.nombre || '').localeCompare(b.nombre || '');
              })}
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
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
                    nombre: formData?.nombre ?? '',
                    codigo_nombre: formData?.codigo_nombre ?? '',
                    modulo_id: formData?.modulo_id ? String(formData.modulo_id) : '',
                    rol_id: formData?.rol_id ? String(formData.rol_id) : '',
                    estado: formData?.estado ? "Activo" : "Inactivo",
                    fecha_creacion: formData?.fecha_creacion ?? new Date().toISOString().split('T')[0]
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
        </div>
    </>
  );
};

export default React.memo(Permisos);
