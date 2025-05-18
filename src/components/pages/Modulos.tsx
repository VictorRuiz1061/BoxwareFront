import React, { useState } from "react";
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

const ModulosPage = () => {
  const { modulos, loading } = useGetModulos();
  const { crearModulo } = usePostModulo();
  const { actualizarModulo } = usePutModulo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Modulo>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

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
      const payload = {
        rutas: values.rutas,
        descripcion_ruta: values.descripcion_ruta,
        mensaje_cambio: values.mensaje_cambio,
        fecha_accion: values.fecha_accion,
        estado: true, // Por defecto activo
        fecha_creacion: new Date(values.fecha_creacion).toISOString()
      };

      if (editingId) {
        await actualizarModulo(editingId, { ...payload, id: editingId });
        setSuccessAlertText('El módulo fue actualizado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearModulo(payload);
        setSuccessAlertText('El módulo fue creado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el módulo:', error);
    }
  };

  const handleToggleEstado = async (modulo: Modulo) => {
    try {
      const nuevoEstado = !modulo.estado;
      await actualizarModulo(modulo.id_modulo, { 
        ...modulo, 
        estado: nuevoEstado,
        id: modulo.id_modulo // Añadir el campo id requerido por ModuloUpdate
      });
      setSuccessAlertText(`El módulo fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error al cambiar el estado del módulo:', error);
    }
  };

  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ 
      fecha_creacion: today,
      estado: true
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    setFormData({
      ...modulo,
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
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
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
                    ...formData,
                    id_modulo: formData.id_modulo?.toString(),
                    fecha_creacion: formData.fecha_creacion ?? new Date().toISOString().split('T')[0]
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
        </div>
    </>
  );
};

export default React.memo(ModulosPage);
