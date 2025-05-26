import { useState } from "react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import Toggle from "../atomos/Toggle";
import { useGetModulos } from '../../hooks/modulos/useGetModulos';
import { usePostModulo } from '../../hooks/modulos/usePostModulo';
import { usePutModulo } from '../../hooks/modulos/usePutModulo';
import { Modulo } from '@/types/modulo';
import { Pencil } from 'lucide-react';
import { Alert } from '@heroui/react';
import { moduloSchema } from '@/schemas/modulo.schema';
import AnimatedContainer from "../atomos/AnimatedContainer";

const Modulos = () => {
  const { modulos, loading } = useGetModulos();
  const { crearModulo } = usePostModulo();
  const { actualizarModulo } = usePutModulo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Modulo>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');

  const columns: Column<Modulo & { key: number }>[] = [
    { key: 'rutas', label: 'Ruta', filterable: true },
    { key: 'descripcion_ruta', label: 'Descripción', filterable: true },
    { key: 'mensaje_cambio', label: 'Mensaje', filterable: true },
    { key: 'fecha_accion', label: 'Fecha', filterable: true },
    { key: 'fecha_creacion', label: 'Fecha de Creación' },
    {
      key: 'estado',
      label: 'Estado',
      render: (modulo) => (
        <Toggle 
          isOn={modulo.estado} 
          onToggle={() => handleToggleEstado(modulo)}
        />
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (modulo) => (
        <div className="flex gap-2">
          <Boton onPress={() => handleEdit(modulo)} className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center" aria-label="Editar">
            <Pencil size={18} />
          </Boton>
        </div>
      )
    }
  ];

  const formFields: FormField[] = [
    { key: 'rutas', label: 'Ruta', type: 'text', required: true },
    { key: 'descripcion_ruta', label: 'Descripción', type: 'text', required: true },
    { key: 'mensaje_cambio', label: 'Mensaje', type: 'text', required: true },
    { key: 'fecha_accion', label: 'Fecha', type: 'date', required: true },
    { key: 'fecha_creacion', label: 'Fecha de Creación', type: 'date', required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Validar con el schema
      const parsed = moduloSchema.safeParse(values);
      if (!parsed.success) {
        setErrorAlertText(parsed.error.errors.map((e) => e.message).join("\n"));
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3000);
        return;
      }

      // Preparar los datos para crear/actualizar
      const payload = {
        rutas: values.rutas,
        descripcion_ruta: values.descripcion_ruta,
        mensaje_cambio: values.mensaje_cambio,
        fecha_accion: values.fecha_accion,
        estado: true, // Por defecto activo para nuevos módulos
        fecha_creacion: values.fecha_creacion
      };

      if (editingId) {
        // Actualizar módulo existente
        const updateData = {
          ...payload,
          id_modulo: editingId,
          estado: formData.estado // Mantener el estado actual
        };
        
        await actualizarModulo(editingId, updateData);
        setSuccessAlertText('El módulo fue actualizado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        // Crear nuevo módulo
        await crearModulo(payload);
        setSuccessAlertText('El módulo fue creado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      setErrorAlertText("Error al guardar el módulo");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const handleToggleEstado = async (modulo: Modulo) => {
    try {
      const nuevoEstado = !modulo.estado;
      
      const updateData = {
        id_modulo: modulo.id_modulo,
        estado: nuevoEstado,
        // Incluir solo los campos necesarios para la actualización
        rutas: modulo.rutas,
        descripcion_ruta: modulo.descripcion_ruta,
        mensaje_cambio: modulo.mensaje_cambio,
        fecha_accion: modulo.fecha_accion,
        fecha_creacion: modulo.fecha_creacion
      };
      
      await actualizarModulo(modulo.id_modulo, updateData);
      setSuccessAlertText(`El módulo fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      setErrorAlertText("Error al cambiar el estado del módulo");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ 
      fecha_creacion: today,
      fecha_accion: today,
      estado: true
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    // Convertir fechas a formato YYYY-MM-DD si es necesario
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      try {
        return new Date(dateString).toISOString().split('T')[0];
      } catch (e) {
        return dateString;
      }
    };
    
    setFormData({
      ...modulo,
      fecha_accion: formatDate(modulo.fecha_accion),
      fecha_creacion: formatDate(modulo.fecha_creacion),
      estado: modulo.estado
    });
    setEditingId(modulo.id_modulo);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Módulos</h1>
        </AnimatedContainer>

        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Módulo
          </Boton>
        </AnimatedContainer>

          {/* Tabla de administradores */}
          {loading ? (
            <p>Cargando módulos...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={modulos
                .map((modulo) => ({ ...modulo, key: modulo.id_modulo }))
                // Ordenar por estado: activos primero, inactivos después
                .sort((a, b) => {
                  if (a.estado === b.estado) return 0;
                  return a.estado ? -1 : 1; // -1 pone a los activos primero
                })
              }
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
          )}

          {/* Modal para crear/editar */}
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
                  {editingId ? "Editar Módulo" : "Crear Nuevo Módulo"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...Object.entries(formData).reduce((acc, [key, value]) => {
                      acc[key] = value !== undefined ? String(value) : '';
                      return acc;
                    }, {} as Record<string, string>),
                    id_modulo: formData.id_modulo?.toString() || '',
                    fecha_creacion: formData.fecha_creacion || new Date().toISOString().split('T')[0],
                    fecha_accion: formData.fecha_accion || new Date().toISOString().split('T')[0]
                  }}
                  schema={moduloSchema}
                />
                <div className="flex justify-end mt-4"></div>
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

export default Modulos;