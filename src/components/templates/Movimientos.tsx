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
        if (movimiento.usuario && movimiento.usuario.nombre) {
          return movimiento.usuario.nombre;
        }
        return 'No disponible';
      }
    },
    {
      key: "tipo_movimiento_id",
      label: "Tipo de Movimiento",
      filterable: true,
      render: (movimiento) => {
        if (movimiento.tipo_movimiento_id && movimiento.tipo_movimiento_id.tipo_movimiento) {
          return movimiento.tipo_movimiento_id.tipo_movimiento;
        }
        return 'No disponible';
      }
    },
    {
      key: "material",
      label: "Material",
      filterable: true,
      render: (movimiento) => {
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
      required: true,
      className: "col-span-1"
    },
    {
      key: "usuario",
      label: "Usuario",
      type: "select",
      required: true,
      className: "col-span-1",
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "sitio",
      label: "Sitio",
      type: "select",
      required: true,
      className: "col-span-1",
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSitioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      required: true,
      className: "col-span-1",
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material })),
      extraButton: {
        icon: "+",
        onClick: () => setIsMaterialModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
      key: "usuario",
      label: "Usuario",
      type: "select",
      required: true,
      className: "col-span-1",
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "sitio",
      label: "Sitio",
      type: "select",
      required: true,
      className: "col-span-1",
      options: sitios.map(s => ({ value: s.id_sitio, label: s.nombre_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSitioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "material",
      label: "Material",
      type: "select",
      required: true,
      className: "col-span-1",
      options: materiales.map(m => ({ value: m.id_material, label: m.nombre_material })),
      extraButton: {
        icon: "+",
        onClick: () => setIsMaterialModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir ids a números
      const usuario_id = parseInt(values.usuario);
      const sitio_id = parseInt(values.sitio);
      const tipo_movimiento = parseInt(values.tipo_movimiento);
      const material_id = parseInt(values.material);
      const cantidad = values.cantidad;
      
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
          sitio_id,
          tipo_movimiento,
          material_id,
          cantidad: parseInt(cantidad),
          estado: true,
          fecha_creacion: original.fecha_creacion || currentDate,
          fecha_modificacion: currentDate,
        } as Movimiento;
        
        await actualizarMovimiento(editingId, updatePayload);
        showSuccessToast('Movimiento actualizado con éxito');
      } else {
        // Crear nuevo movimiento
        const createPayload = {
          usuario_id,
          sitio_id,
          tipo_movimiento,
          material_id,
          cantidad: parseInt(cantidad),
          estado: true,
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
        sitio_id: movimiento.sitio_id,
        tipo_movimiento: movimiento.tipo_movimiento,
        material_id: movimiento.material_id,
        cantidad: movimiento.cantidad,
        estado: !movimiento.estado,
        fecha_modificacion: new Date().toISOString()
      } as Movimiento;

      if (movimiento.id_movimiento) {
        await actualizarMovimiento(movimiento.id_movimiento, updateData);
        showSuccessToast(`El movimiento fue ${!movimiento.estado ? 'activado' : 'desactivado'} correctamente.`);
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
      usuario: movimiento.usuario_id.toString(),
      sitio: movimiento.sitio_id.toString(),
      tipo_movimiento: movimiento.tipo_movimiento.toString(),
      material: movimiento.material_id.toString(),
      cantidad: movimiento.cantidad.toString()
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-4 rounded-md"
          >
            Crear Nuevo Movimiento
          </Boton>
        </AnimatedContainer>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando movimientos...</p>
          </div>
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
          </AnimatedContainer>
        )}

        {/* Modal principal para crear/editar movimiento */}
        {isModalOpen && (
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
                  {editingId ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
                </h2>
                
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
              </div>
            </AnimatedContainer>  
          </div> 
        )}

        {/* Modal para crear material */}
        {isMaterialModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
              <button 
                onClick={() => setIsMaterialModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <Materiales isInModal={true} onMaterialCreated={() => {
                setIsMaterialModalOpen(false);
              }} />
            </div>
          </div>
        )}

        {/* Modal para crear tipo de movimiento */}
        {isTipoMovimientoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsTipoMovimientoModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <TipoMaterial isInModal={true} onTipoMaterialCreated={() => {
                setIsTipoMovimientoModalOpen(false);
              }} />
            </div>
          </div>
        )}

        {/* Modal para crear sitio */}
        {isSitioModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsSitioModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <Sitio 
                isInModal={true} 
                onSitioCreated={() => {
                  setIsSitioModalOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Modal para crear usuario */}
        {isUsuarioModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
              <button 
                onClick={() => setIsUsuarioModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <UsuarioForm onUsuarioCreated={() => {
                setIsUsuarioModalOpen(false);
              }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Movimientos;
