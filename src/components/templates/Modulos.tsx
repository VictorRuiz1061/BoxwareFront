import { useState } from "react";
import { useGetModulos, usePostModulo, usePutModulo } from '@/hooks/modulos';
import { Modulo } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { moduloSchema } from '@/schemas';

interface ModulosProps {
  isInModal?: boolean;
  onModuloCreated?: () => void;
}

const Modulos = ({ isInModal = false, onModuloCreated }: ModulosProps) => {
  const { modulos, loading } = useGetModulos();
  const { crearModulo } = usePostModulo();
  const { actualizarModulo } = usePutModulo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Modulo & { key: number }>[] = [    
    {key: "id_modulo", label: "ID", filterable: true},
    { key: 'imagen', label: 'Icono', filterable: true },
    { key: 'rutas', label: 'Ruta', filterable: true },
    { key: 'descripcion_ruta', label: 'Descripción', filterable: true },
    { key: 'mensaje_cambio', label: 'Mensaje', filterable: true },
    { 
      key: 'es_submenu', 
      label: 'Tipo', 
      filterable: true,
      render: modulo => (
        <span className={`px-2 py-1 rounded-full text-xs ${modulo.es_submenu ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
          {modulo.es_submenu ? 'Submódulo' : 'Módulo Principal'}
        </span>
      )
    },
    { 
      key: 'modulo_padre_id', 
      label: 'Pertenece a', 
      filterable: true,
      render: modulo => {
        if (!modulo.es_submenu || !modulo.modulo_padre_id) return '-';
        const moduloPadre = modulos.find(m => m.id_modulo === modulo.modulo_padre_id);
        return moduloPadre ? moduloPadre.descripcion_ruta : `ID: ${modulo.modulo_padre_id}`;
      }
    }
  ];

  // Campos de formulario centralizados
  const formFields: FormField[] = [
    { 
      key: 'imagen', 
      label: 'Icono', 
      type: 'text', 
      required: true,
      className: "col-span-1"
    },
    { 
      key: 'rutas', 
      label: 'Ruta', 
      type: 'text', 
      required: true,
      className: "col-span-1"
    },
    { 
      key: 'descripcion_ruta', 
      label: 'Descripción', 
      type: 'text', 
      required: true,
      className: "col-span-2"
    },
    { 
      key: 'mensaje_cambio', 
      label: 'Mensaje', 
      type: 'text', 
      required: true,
      className: "col-span-2"
    },
    { 
      key: 'es_submenu', 
      label: 'Es submódulo', 
      type: 'select', 
      options: [
        { value: 'false', label: 'No (Módulo principal)' },
        { value: 'true', label: 'Sí (Submódulo)' }
      ],
      required: true,
      className: "col-span-1"
    },
    { 
      key: 'modulo_padre_id', 
      label: 'Pertenece al módulo', 
      type: 'select', 
      options: modulos
        .filter(m => !m.es_submenu && (!editingId || m.id_modulo !== editingId)) // Evitar que se seleccione a sí mismo
        .map(m => ({ 
          value: m.id_modulo.toString(), 
          label: m.descripcion_ruta 
        })),
      required: false,
      conditional: (values) => values.es_submenu === 'true',
      className: "col-span-1"
    }
  ];

  const handleSubmit = async (formValues: any) => {
    try {
      // Obtener la fecha actual en formato YYYY-MM-DD
      const fechaActual = new Date().toISOString().split('T')[0];
      
      const imagenPath = formData.imagen || '';
      // Los valores ya serán convertidos por el esquema Zod
      // pero mantenemos la lógica aquí para mayor claridad
      const esSubmenu = typeof formValues.es_submenu === 'boolean' 
        ? formValues.es_submenu 
        : formValues.es_submenu === 'true';
        
      const moduloPadreId = esSubmenu 
        ? (typeof formValues.modulo_padre_id === 'number' 
          ? formValues.modulo_padre_id 
          : formValues.modulo_padre_id ? parseInt(formValues.modulo_padre_id) : undefined)
        : undefined;

      if (editingId) {
        // Para actualización, solo enviamos los campos que han cambiado
        const updatePayload = {
          imagen: imagenPath || '', // Usar string vacía en lugar de null para cumplir con el tipo
          rutas: formValues.rutas,
          descripcion_ruta: formValues.descripcion_ruta,
          mensaje_cambio: formValues.mensaje_cambio,
          es_submenu: esSubmenu,
          modulo_padre_id: moduloPadreId,
          fecha_modificacion: fechaActual
        } as Partial<Modulo>;
        
        await actualizarModulo(editingId, updatePayload);
        showSuccessToast("Módulo actualizado correctamente");
      } else {
        // Para creación, aseguramos que todos los campos requeridos estén presentes
        const createPayload: Partial<Modulo> = {
          imagen: imagenPath || '', // Usar string vacía en lugar de null para cumplir con el tipo
          rutas: formValues.rutas,
          descripcion_ruta: formValues.descripcion_ruta,
          mensaje_cambio: formValues.mensaje_cambio,
          es_submenu: esSubmenu,
          ...(moduloPadreId !== undefined && { modulo_padre_id: moduloPadreId }),
          fecha_creacion: formValues.fecha_creacion || fechaActual,
          estado: true,
          fecha_accion: fechaActual
        };

        await crearModulo(createPayload as Modulo); 
        showSuccessToast("Modulo creado correctamente");
        
        // Si estamos en modo modal y hay callback, lo llamamos
        if (isInModal && onModuloCreated) {
          onModuloCreated();
        }
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Error al procesar el modulo");
    }
  };

  const handleToggleEstado = async (modulo: Modulo) => {
    try {
      const nuevoEstado = !modulo.estado;
      const updateData = {
        id_modulo: modulo.id_modulo,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarModulo(modulo.id_modulo, updateData);
      // Usar el nuevo Toast en lugar de la alerta
      showSuccessToast(`El modulo fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      // Usar el nuevo Toast para mostrar el error
      showErrorToast("Error al cambiar el estado del modulo.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    // Convertir los valores a string para el formulario
    setFormData({
      rutas: modulo.rutas,
      descripcion_ruta: modulo.descripcion_ruta,
      mensaje_cambio: modulo.mensaje_cambio,
      fecha_accion: modulo.fecha_accion,
      fecha_creacion: modulo.fecha_creacion,
      es_submenu: modulo.es_submenu ? 'true' : 'false',
      modulo_padre_id: modulo.modulo_padre_id ? modulo.modulo_padre_id.toString() : '',
      imagen: modulo.imagen
    });
    setEditingId(modulo.id_modulo);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="w-full">
        {!isInModal && (
          <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
            <h1 className="text-xl font-bold mb-4">Gestión de Módulos</h1>
          </AnimatedContainer>
        )}
      
        {!isInModal && (
          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
            <Boton
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded-md"
            >
              Crear Nuevo Módulo
            </Boton>
          </AnimatedContainer>
        )}

        {!isInModal && loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando módulos...</p>
          </div>
        ) : !isInModal ? (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: modulos,
              idField: 'id_modulo',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </AnimatedContainer>
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Crear Nuevo Módulo</h2>
            <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                buttonText="Crear"
                schema={moduloSchema}
              />
            </div>
          </div>
        )}

        {/* Modal para crear/editar módulo */}
        {!isInModal && isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-4xl">
              <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative bg-white dark:bg-gray-800">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Módulo" : "Crear Nuevo Módulo"}
                </h2>
                
                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={formData}
                    schema={moduloSchema}
                  />
                </div>
              </div>
            </AnimatedContainer>  
          </div> 
        )}
      </div>
    </>
  );
};

export default Modulos;
