import { useState } from "react";
import { useGetModulos, usePostModulo, usePutModulo } from '@/hooks/modulos';
import { Modulo } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
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
  const [textoBoton] = useState();

  const columns: Column<Modulo & { key: number }>[] = [
    { key: "id_modulo", label: "ID", filterable: true },
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
    <AnimatedContainer>
      <div className="w-full">
        {!isInModal && (
          <h1 className="text-xl font-bold mb-4">Gestión de Módulos</h1>
        )}

        {!isInModal && (
          <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Módulo">
            {textoBoton}
          </Botton>
        )}

        {!isInModal && loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando módulos...</p>
          </div>
        ) : !isInModal ? (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: modulos,
              idField: 'id_modulo',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
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

        {/* Modal para crear/editar módulo usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Módulo" : "Crear Nuevo Módulo"}
        >
          <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
            <Form
              fields={formFields}
              onSubmit={handleSubmit}
              buttonText={editingId ? "Actualizar" : "Crear"}
              initialValues={formData}
              schema={moduloSchema}
            />
          </div>
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Modulos;
