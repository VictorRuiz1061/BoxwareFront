import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Alert } from "@heroui/react";
import { useGetMateriales } from '@/hooks/material/useGetMateriales';
import { useGetTiposMovimiento } from '@/hooks/tipoMovimiento/useGetTiposMovimiento';
import { useGetMovimientos } from '@/hooks/movimiento/useGetMovimientos';
import { usePostMovimiento } from '@/hooks/movimiento/usePostMovimiento';
import { usePutMovimiento } from '@/hooks/movimiento/usePutMovimiento';
import { Movimiento } from '@/types/movimiento';
import { useGetUsuarios } from '@/hooks/usuario/useGetUsuarios';
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { movimientoSchema } from '@/schemas/movimiento.schema';

const Movimientos = () => {
  const { movimientos, loading } = useGetMovimientos();
  const { crearMovimiento } = usePostMovimiento();
  const { actualizarMovimiento } = usePutMovimiento();
  const { usuarios } = useGetUsuarios();
  const { tiposMovimiento } = useGetTiposMovimiento();
  const { materiales } = useGetMateriales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Movimiento>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

  const columns: Column<Movimiento & { key: number }>[] = [
    { key: "id_movimiento", label: "ID", filterable: true },
    { key: "cantidad", label: "Cantidad", filterable: true },
    {
      key: "usuario_id",
      label: "Usuario",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.usuario_id && (!loading && usuarios.length > 0)) {
          const usuario = usuarios.find(u => u.id_usuario === movimiento.usuario_id);
          return usuario ? `${usuario.nombre} ${usuario.apellido}` : `ID: ${movimiento.usuario_id}`;
        }
        return 'No disponible';
      }
    },
    {
      key: "material_id",
      label: "Material",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.material_id && (!loading && materiales.length > 0)) {
          const material = materiales.find(m => m.id_material === movimiento.material_id);
          return material ? material.nombre_material : `ID: ${movimiento.material_id}`;
        }
        return 'No disponible';
      }
    },
    {
      key: "tipo_movimiento_id",
      label: "Tipo de Movimiento",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.tipo_movimiento_id && (!loading && tiposMovimiento.length > 0)) {
          const tipoMovimiento = tiposMovimiento.find(tm => tm.id_tipo_movimiento === movimiento.tipo_movimiento_id);
          return tipoMovimiento ? tipoMovimiento.tipo_movimiento : `ID: ${movimiento.tipo_movimiento_id}`;
        }
        return 'No disponible';
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (movimiento) => (
        <Toggle
          isOn={movimiento.estado}
          onToggle={() => handleToggleEstado(movimiento)}
        />
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (movimiento) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(movimiento)}
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
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` }))
    },
    {
      key: "tipo_movimiento_id",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento }))
    },
    {
      key: "material_id",
      label: "Material",
      type: "select",
      required: true,
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material }))
    },
    {
      key: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true
    }
  ];

  const formFieldsEdit: FormField[] = [
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` }))
    },
    {
      key: "tipo_movimiento_id",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento }))
    },
    {
      key: "material_id",
      label: "Material",
      type: "select",
      required: true,
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material }))
    },
    {
      key: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true
    }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const parsed = movimientoSchema.safeParse(values);
      if (!parsed.success) {
        setSuccessAlertText(parsed.error.errors.map((e) => e.message).join("\n"));
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      const usuario = Number(values.usuario_id);
      const usuarioSeleccionado = usuarios.find(u => u.id_usuario === usuario);
      if (!usuarioSeleccionado) {
        setSuccessAlertText("Usuario no encontrado");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const tipoMovimiento = Number(values.tipo_movimiento_id);
      const tipoMovimientoSeleccionado = tiposMovimiento.find(tm => tm.id_tipo_movimiento === tipoMovimiento);
      if (!tipoMovimientoSeleccionado) {
        setSuccessAlertText("Tipo de movimiento no encontrado");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const material = Number(values.material_id);
      const materialSeleccionado = materiales.find(m => m.id_material === material);
      if (!materialSeleccionado) {
        setSuccessAlertText("Material no encontrado");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const hoy = new Date().toISOString().slice(0, 10);
      
      if (editingId) {
        const payload = {
          id_movimiento: editingId,
          usuario_id: usuario,
          tipo_movimiento_id: tipoMovimiento,
          material_id: material,
          cantidad: Number(values.cantidad),
          estado: true,
          fecha_modificacion: hoy,
        };
        
        await actualizarMovimiento(editingId, payload);
        setSuccessAlertText("El movimiento fue actualizado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        const payload = {
          usuario_id: usuario,
          tipo_movimiento_id: tipoMovimiento,
          material_id: material,
          cantidad: Number(values.cantidad),
          estado: true,
          fecha_creacion: hoy,
          fecha_modificacion: hoy,
        };
        
        await crearMovimiento(payload);
        setSuccessAlertText('El movimiento fue creado correctamente.');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      setSuccessAlertText("Ocurrió un error al guardar el movimiento.");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleToggleEstado = async (movimiento: Movimiento) => {
    try {
      const nuevoEstado = !movimiento.estado;
      
      const updateData = {
        id_movimiento: movimiento.id_movimiento,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      await actualizarMovimiento(movimiento.id_movimiento, updateData);
      setSuccessAlertText(`El movimiento fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);      
    } catch (error) {
      setSuccessAlertText("Error al cambiar el estado del movimiento.");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (movimiento: Movimiento) => {
    setFormData(movimiento);
    setEditingId(movimiento.id_movimiento);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Movimientos</h1>
        </AnimatedContainer>

        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Movimiento
          </Boton>
        </AnimatedContainer>

          {/* Tabla de movimientos */}
          {loading ? (
            <p>Cargando movimientos...</p>
          ) : (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            <GlobalTable 
              columns={columns as Column<any>[]} 
              data={movimientos
                .map(m => ({ ...m, key: m.id_movimiento }))
                .sort((a, b) => {
                  if (a.estado === b.estado) return 0;
                  return a.estado ? -1 : 1;
                })
              }
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
            </AnimatedContainer>
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  
                  <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
                </h2>
                <Form
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...Object.entries(formData).reduce((acc, [key, value]) => {
                      acc[key] = value !== undefined ? String(value) : '';
                      return acc;
                    }, {} as Record<string, string>),
                  }}
                  schema={movimientoSchema}
                />
                </div>
              </AnimatedContainer>
            </div>
          )}
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
    </>
  );
};

export default Movimientos;
