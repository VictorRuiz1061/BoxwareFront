import { useState } from "react";
import { useGetMovimientos, usePostMovimiento, usePutMovimiento } from '@/hooks/movimiento';
import { useGetUsuarios } from '@/hooks/usuario';
import { useGetMateriales } from '@/hooks/material';
import { useGetTiposMovimiento } from '@/hooks/tipoMovimiento';
import { useGetSitios } from '@/hooks/sitio';
import type { Movimiento } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { movimientoSchema } from '@/schemas';

const Movimientos = () => {
  const { movimientos, loading } = useGetMovimientos();
  const { crearMovimiento } = usePostMovimiento();
  const { actualizarMovimiento } = usePutMovimiento();
  const { usuarios } = useGetUsuarios();
  const { tiposMovimiento } = useGetTiposMovimiento();
  const { materiales } = useGetMateriales();
  const { sitios } = useGetSitios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Log the first movimiento object to see its structure
  if (movimientos && movimientos.length > 0) {
  }

  const columns: Column<Movimiento & { key: number }>[] = [
    { key: "cantidad", label: "Cantidad", filterable: true },
    {
      key: "usuario",
      label: "Usuario",
      filterable: true,
      render: (movimiento) => {
        // Verificar si usuario_id es un objeto con nombre
        const usuarioId = movimiento.usuario_id as any;
        if (usuarioId && typeof usuarioId === 'object' && usuarioId.nombre) {
          return usuarioId.nombre;
        }
        // Verificar si el objeto usuario existe y tiene la propiedad nombre
        if (movimiento.usuario && movimiento.usuario.nombre) {
          return movimiento.usuario.nombre;
        }
        return 'No disponible';
      }
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      filterable: true,
      render: (movimiento) => {
        // Verificar si tipo_movimiento_id es un objeto con tipo_movimiento
        const tipoMovimientoId = movimiento.tipo_movimiento_id as any;
        if (tipoMovimientoId && typeof tipoMovimientoId === 'object' && tipoMovimientoId.tipo_movimiento) {
          return tipoMovimientoId.tipo_movimiento;
        }
        // Verificar si el objeto tipo_movimiento existe y tiene la propiedad tipo_movimiento
        if (movimiento.tipo_movimiento && movimiento.tipo_movimiento.tipo_movimiento) {
          return movimiento.tipo_movimiento.tipo_movimiento;
        }
        return 'No disponible';
      }
    },
    {
      key: "material",
      label: "Material",
      filterable: true,
      render: (movimiento) => {
        // Verificar si material_id es un objeto con nombre_material
        const materialId = movimiento.material_id as any;
        if (materialId && typeof materialId === 'object' && materialId.nombre_material) {
          return materialId.nombre_material;
        }
        // Verificar si el objeto material existe y tiene la propiedad nombre_material
        if (movimiento.material && movimiento.material.nombre_material) {
          return movimiento.material.nombre_material;
        }
        return 'No disponible';
      }
    },
    {
      key: "sitio",
      label: "Sitio",
      filterable: true,
      render: (movimiento) => {
        // Verificar si sitio_id es un objeto con nombre_sitio
        const sitioId = movimiento.sitio_id as any;
        if (sitioId && typeof sitioId === 'object' && sitioId.nombre_sitio) {
          return sitioId.nombre_sitio;
        }
        // Verificar si el objeto sitio existe y tiene la propiedad nombre_sitio
        if (movimiento.sitio && movimiento.sitio.nombre_sitio) {
          return movimiento.sitio.nombre_sitio;
        }
        return 'No disponible';
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    {
      key: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true
    },
    {
      key: "usuario",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` }))
    },
    {
      key: "sitio",
      label: "Sitio",
      type: "select",
      required: true,
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio }))
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento }))
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      required: true,
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material }))
    },
  ];

  const formFieldsEdit: FormField[] = [
    {
      key: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true
    },
    {
      key: "usuario",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` }))
    },
    {
      key: "sitio",
      label: "Sitio",
      type: "select",
      required: true,
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio }))
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento }))
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      required: true,
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material }))
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir ids a números
      const usuario_id = parseInt(values.usuario);
      const sitio_id = parseInt(values.sitio);
      const tipo_movimiento_id = parseInt(values.tipo_movimiento);
      const material_id = parseInt(values.material);
      const cantidad = parseInt(values.cantidad);
      
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Actualizar movimiento existente
        const updatePayload = {
          id_movimiento: editingId,
          usuario_id,
          sitio_id,
          tipo_movimiento_id,
          material_id,
          cantidad,
          estado: true,
          fecha_creacion: movimientos.find(m => m.id_movimiento === editingId)?.fecha_creacion || currentDate,
          fecha_modificacion: currentDate,
        };
        
        await actualizarMovimiento(editingId, updatePayload);
        showSuccessToast('Movimiento actualizado con éxito');
      } else {
        // Crear nuevo movimiento
        const createPayload = {
          usuario_id,
          sitio_id,
          tipo_movimiento_id,
          material_id,
          cantidad,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearMovimiento(createPayload as unknown as Movimiento);
        showSuccessToast('Movimiento creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el movimiento');
    }
  };

  const handleToggleEstado = async (movimiento: Movimiento) => {
    try {
      const nuevoEstado = !movimiento.estado;
      const updateData: Partial<Movimiento> = {
        id_movimiento: movimiento.id_movimiento,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarMovimiento(movimiento.id_movimiento, updateData as unknown as Movimiento);
      showSuccessToast(`El movimiento fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del movimiento.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (movimiento: Movimiento) => {
    // Función para extraer el ID correcto según el tipo de campo
    const extractId = (field: any, idProperty: string): string => {
      if (!field) return '';
      
      // Si es un objeto con la propiedad ID específica
      if (typeof field === 'object' && field[idProperty]) {
        return field[idProperty].toString();
      }
      
      // Si es un objeto pero no tiene la propiedad ID específica
      if (typeof field === 'object') {
        // Buscar cualquier propiedad que comience con 'id_'
        for (const key in field) {
          if (key.startsWith('id_')) {
            return field[key].toString();
          }
        }
      }
      
      // Si es un valor primitivo
      return field.toString();
    };
    
    // Extraer los valores correctos para el formulario
    const formValues = {
      usuario: extractId(movimiento.usuario_id || movimiento.usuario, 'id_usuario'),
      sitio: extractId(movimiento.sitio_id || movimiento.sitio, 'id_sitio'),
      tipo_movimiento: extractId(movimiento.tipo_movimiento_id, 'id_tipo_movimiento'),
      material: extractId(movimiento.material_id, 'id_material'),
      cantidad: movimiento.cantidad ? movimiento.cantidad.toString() : ''
    };
    
    setFormData(formValues);
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

        {loading ? (
          <p>Cargando movimientos...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: movimientos,
            idField: 'id_movimiento',
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
                  {editingId ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
                </h2>
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
                  schema={movimientoSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Movimientos;
