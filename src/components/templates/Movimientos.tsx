import { useState } from "react";
import { useGetMovimientos, usePostMovimiento, usePutMovimiento } from '@/hooks/movimiento';
import { useGetUsuarios } from '@/hooks/usuario';
import { useGetMateriales } from '@/hooks/material';
import { useGetTiposMovimiento } from '@/hooks/tipoMovimiento';
import { useGetSitios } from '@/hooks/sitio';
import type { Movimiento } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { movimientoSchema } from '@/schemas';
import Materiales from "./Materiales";
import TipoMaterial from "./TipoMaterial";
import Sitio from "./Sitio";
import UsuarioForm from "./UsuarioForm";

const Movimientos = () => {
  const { movimientos, loading } = useGetMovimientos();
  const { crearMovimiento } = usePostMovimiento();
  const { actualizarMovimiento } = usePutMovimiento();
  const { usuarios } = useGetUsuarios();
  const { tiposMovimiento } = useGetTiposMovimiento();
  const { materiales } = useGetMateriales();
  const { sitios } = useGetSitios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isTipoMovimientoModalOpen, setIsTipoMovimientoModalOpen] = useState(false);
  const [isSitioModalOpen, setIsSitioModalOpen] = useState(false);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<Movimiento & { key: number }>[] = [
    { key: "cantidad", label: "Cantidad", filterable: true },
    {
      key: "usuario",
      label: "Usuario",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.usuario && movimiento.usuario.nombre) {
          return movimiento.usuario.nombre;
        }
        return 'No disponible';
      }
    },
    {
      key: "usuario_responsable_id",
      label: "Usuario Responsable",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.usuario && movimiento.usuario.nombre) {
          return movimiento.usuario.nombre;
        }
        return 'No disponible';
      }
    },
    {
      key: "tipo_movimiento_id_obj",
      label: "Tipo de Movimiento",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.tipo_movimiento_id && (movimiento.tipo_movimiento_id as any).tipo_movimiento) {
          return (movimiento.tipo_movimiento_id as any).tipo_movimiento;
        }
        return 'No disponible';
      }
    },
    {
      key: "material",
      label: "Material",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.material_id && (movimiento.material_id as any).nombre_material) {
          return (movimiento.material_id as any).nombre_material;
        }
        return 'No disponible';
      }
    },
    {
      key: "sitio_origen_id",
      label: "Sitio Origen",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.sitio_origen_id) {
          const sitio = sitios.find(s => s.id_sitio === movimiento.sitio_origen_id);
          return sitio ? sitio.nombre_sitio : 'No disponible';
        }
        return 'No disponible';
      }
    },
    {
      key: "sitio_destino_id",
      label: "Sitio Destino",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.sitio_destino_id) {
          const sitio = sitios.find(s => s.id_sitio === movimiento.sitio_destino_id);
          return sitio ? sitio.nombre_sitio : 'No disponible';
        }
        return 'No disponible';
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    {
      key: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true,
      className: "col-span-1"
    },
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      className: "col-span-1",
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
      }
    },
    {
      key: "usuario_responsable_id",
      label: "Usuario Responsable",
      type: "select",
      required: true,
      className: "col-span-1",
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
      }
    },
    {
      key: "sitio_origen_id",
      label: "Sitio Origen",
      type: "select",
      required: true,
      className: "col-span-1",
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSitioModalOpen(true),
      }
    },
    {
      key: "sitio_destino_id",
      label: "Sitio Destino",
      type: "select",
      required: true,
      className: "col-span-1",
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSitioModalOpen(true),
      }
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      className: "col-span-1",
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoMovimientoModalOpen(true),
      }
    },
    {
      key: "material_id",
      label: "Material",
      type: "select",
      required: true,
      className: "col-span-1",
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material })),
      extraButton: {
        icon: "+",
        onClick: () => setIsMaterialModalOpen(true),
      }
    },
  ];

  const formFieldsEdit: FormField[] = [
    {
      key: "cantidad",
      label: "Cantidad",
      type: "number",
      required: true,
      className: "col-span-1"
    },
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      className: "col-span-1",
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
      }
    },
    {
      key: "sitio_origen_id",
      label: "Sitio Origen",
      type: "select",
      required: true,
      className: "col-span-1",
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSitioModalOpen(true),
      }
    },
    {
      key: "sitio_destino_id",
      label: "Sitio Destino",
      type: "select",
      required: true,
      className: "col-span-1",
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSitioModalOpen(true),
      }
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      className: "col-span-1",
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoMovimientoModalOpen(true),
      }
    },
    {
      key: "material_id",
      label: "Material",
      type: "select",
      required: true,
      className: "col-span-1",
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material })),
      extraButton: {
        icon: "+",
        onClick: () => setIsMaterialModalOpen(true),
      }
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir ids a números
      const usuario_id = parseInt(values.usuario_id);
      const sitio_origen_id = parseInt(values.sitio_origen_id);
      const sitio_destino_id = parseInt(values.sitio_destino_id);
      const tipo_movimiento = parseInt(values.tipo_movimiento);
      const material_id = parseInt(values.material_id);
      const cantidad = parseInt(values.cantidad);

      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();

      if (editingId) {
        // Actualizar movimiento existente
        const original = movimientos.find(m => m.id_movimiento === editingId);
        if (!original) {
          throw new Error('No se encontró el movimiento original');
        }

        const updatePayload = {
          id_movimiento: editingId,
          usuario_id,
          sitio_origen_id,
          sitio_destino_id,
          sitio_id: sitio_origen_id, // Usar sitio_origen_id como sitio_id
          tipo_movimiento,
          material_id,
          cantidad,
          estado: original.estado,
          fecha_creacion: original.fecha_creacion || currentDate,
          fecha_modificacion: currentDate,
        } as Movimiento;

        await actualizarMovimiento(editingId, updatePayload);
        showSuccessToast('Movimiento actualizado con éxito');
      } else {
        // Crear nuevo movimiento
        const createPayload = {
          usuario_id,
          sitio_origen_id,
          sitio_destino_id,
          sitio_id: sitio_origen_id, // Usar sitio_origen_id como sitio_id
          tipo_movimiento,
          material_id,
          cantidad,
          estado: 1, // Cambiar a número 1 como espera el backend
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        } as Movimiento;
        
        await crearMovimiento(createPayload);
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
      const updateData = {
        id_movimiento: movimiento.id_movimiento,
        usuario_id: movimiento.usuario_id,
        sitio_origen_id: movimiento.sitio_origen_id,
        sitio_destino_id: movimiento.sitio_destino_id,
        sitio_id: movimiento.sitio_origen_id, // Usar sitio_origen_id como sitio_id
        tipo_movimiento: movimiento.tipo_movimiento,
        material_id: movimiento.material_id,
        cantidad: movimiento.cantidad,
        estado: movimiento.estado === true || movimiento.estado === 1 ? 0 : 1,
        fecha_modificacion: new Date().toISOString()
      } as Movimiento;

      if (movimiento.id_movimiento) {
        await actualizarMovimiento(movimiento.id_movimiento, updateData);
        showSuccessToast(`El movimiento fue ${movimiento.estado === true || movimiento.estado === 1 ? 'desactivado' : 'activado'} correctamente.`);
      }
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
    if (!movimiento.id_movimiento) return;

    const formValues = {
      usuario_id: movimiento.usuario_id?.toString() || '',
      sitio_origen_id: movimiento.sitio_origen_id?.toString() || '',
      sitio_destino_id: movimiento.sitio_destino_id?.toString() || '',
      tipo_movimiento: movimiento.tipo_movimiento?.toString() || '',
      material_id: movimiento.material_id?.toString() || '',
      cantidad: movimiento.cantidad.toString(),
    };

    setFormData(formValues);
    setEditingId(movimiento.id_movimiento);
    setIsModalOpen(true);
  };

  return (
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Movimientos</h1>

        <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Movimiento">
          {textoBoton}
        </Botton>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando movimientos...</p>
          </div>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: movimientos,
              idField: 'id_movimiento',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal principal para crear/editar movimiento usando el modal global */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }}
          title={editingId ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
        >
          <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
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
        </Modal>

        {/* Modal para crear material usando el modal global */}
        <Modal
          isOpen={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          title="Crear Nuevo Material"
        >
          <Materiales isInModal={true} onMaterialCreated={() => {
            setIsMaterialModalOpen(false);
          }} />
        </Modal>

        {/* Modal para crear tipo de movimiento usando el modal global */}
        <Modal
          isOpen={isTipoMovimientoModalOpen}
          onClose={() => setIsTipoMovimientoModalOpen(false)}
          title="Crear Nuevo Tipo de Movimiento"
        >
          <TipoMaterial isInModal={true} onTipoMaterialCreated={() => {
            setIsTipoMovimientoModalOpen(false);
          }} />
        </Modal>

        {/* Modal para crear sitio usando el modal global */}
        <Modal
          isOpen={isSitioModalOpen}
          onClose={() => setIsSitioModalOpen(false)}
          title="Crear Nuevo Sitio"
        >
          <Sitio
            isInModal={true}
            onSitioCreated={() => {
              setIsSitioModalOpen(false);
            }}
          />
        </Modal>

        {/* Modal para crear usuario usando el modal global */}
        <Modal
          isOpen={isUsuarioModalOpen}
          onClose={() => setIsUsuarioModalOpen(false)}
          title="Crear Nuevo Usuario"
        >
          <UsuarioForm onUsuarioCreated={() => {
            setIsUsuarioModalOpen(false);
          }} />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Movimientos;
