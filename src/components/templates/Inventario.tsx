import { useState } from "react";
import { useGetInventarios, usePostInventario, usePutInventario } from '@/hooks/inventario';
import { useGetSitios } from '@/hooks/sitio';
import { useGetMateriales } from '@/hooks/material';
import type { Inventario } from '@/types/inventario';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { inventarioSchema } from '@/schemas';

const Inventario = () => {
  const { inventarios, loading: inventariosLoading } = useGetInventarios();
  const { sitios, loading: sitiosLoading } = useGetSitios();
  const { materiales, loading: materialesLoading } = useGetMateriales();
  const { crearInventario } = usePostInventario();
  const { actualizarInventario } = usePutInventario();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<Inventario>[] = [
    { key: "stock", label: "Stock", filterable: true },
    { key: "sitio", label: "Sitio", filterable: true, render: (item) => item.sitio?.nombre_sitio || 'N/A' },
    { key: "material_id", label: "Material", filterable: true, render: (item) => {
      const material = materiales?.find(m => m.id_material === item.material_id);
      return material?.nombre_material || `ID: ${item.material_id}`;
    }},
    { key: "placa_sena", label: "Placa SENA", filterable: true },
    { key: "descripcion", label: "Descripción", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "stock", label: "Stock", type: "number", required: true },
    { 
      key: "sitio_id", 
      label: "Sitio", 
      type: "select", 
      required: true,
      options: sitios?.map(sitio => ({ value: sitio.id_sitio.toString(), label: sitio.nombre_sitio })) || []
    },
    { 
      key: "material_id", 
      label: "Material", 
      type: "select", 
      required: true,
      options: materiales?.map(material => ({ value: material.id_material.toString(), label: material.nombre_material })) || []
    },
    { key: "placa_sena", label: "Placa SENA", type: "text", required: false },
    { key: "descripcion", label: "Descripción", type: "text", required: false },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "stock", label: "Stock", type: "number", required: true },
    { 
      key: "sitio_id", 
      label: "Sitio", 
      type: "select", 
      required: true,
      options: sitios?.map(sitio => ({ value: sitio.id_sitio.toString(), label: sitio.nombre_sitio })) || []
    },
    { 
      key: "material_id", 
      label: "Material", 
      type: "select", 
      required: true,
      options: materiales?.map(material => ({ value: material.id_material.toString(), label: material.nombre_material })) || []
    },
    { key: "placa_sena", label: "Placa SENA", type: "text", required: false },
    { key: "descripcion", label: "Descripción", type: "text", required: false },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (editingId) {
        const original = inventarios.find(i => i.id_inventario === editingId);
        if (!original) {
          throw new Error('No se encontró el inventario original');
        }
        
        const updatePayload = {
          id_inventario: editingId,
          stock: parseInt(values.stock),
          sitio_id: parseInt(values.sitio_id),
          material_id: parseInt(values.material_id),
          placa_sena: values.placa_sena || undefined,
          descripcion: values.descripcion || undefined,
        } as Inventario;
        
        await actualizarInventario(editingId, updatePayload);
        showSuccessToast('Inventario actualizado con éxito');
      } else {
        const createPayload = {
          id_inventario: 0, // Este valor será reemplazado por el backend
          stock: parseInt(values.stock),
          sitio_id: parseInt(values.sitio_id),
          material_id: parseInt(values.material_id),
          placa_sena: values.placa_sena || undefined,
          descripcion: values.descripcion || undefined,
        } as Inventario;

        await crearInventario(createPayload);
        showSuccessToast('Inventario creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el inventario');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (inventario: Inventario) => {
    setFormData({
      stock: inventario.stock.toString(),
      sitio_id: inventario.sitio_id.toString(),
      material_id: inventario.material_id.toString(),
      placa_sena: inventario.placa_sena || '',
      descripcion: inventario.descripcion || '',
    });
    setEditingId(inventario.id_inventario);
    setIsModalOpen(true);
  };

  const handleToggleEstado = async () => {
    // Función dummy ya que el inventario no tiene estado
    showErrorToast("El inventario no tiene funcionalidad de estado");
  };



  return (
    <AnimatedContainer>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Inventario</h1>
      
            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Inventario">
              {textoBoton}
            </Botton>

        {inventariosLoading || sitiosLoading || materialesLoading ? (
          <p>Cargando inventario...</p>
        ) : (
          <div className="w-full">
            {inventarios && inventarios.length > 0 ? (
              <div>
                {createEntityTable({
                  columns: columns as Column<any>[],
                  data: inventarios,
                  idField: 'id_inventario',
                  handlers: {
                    onToggleEstado: handleToggleEstado,
                    onEdit: handleEdit
                  },
                  options: {
                    includeEstado: false,
                    includeAcciones: true
                  }
                })}
              </div>
            ) : (
              <p>No hay datos de inventario disponibles</p>
            )}
          </div>
        )}

        {/* Modal para crear/editar inventario usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Inventario" : "Crear Nuevo Inventario"}
        >
          <Form
            fields={editingId ? formFieldsEdit : formFieldsCreate}
            onSubmit={handleSubmit}
            buttonText={editingId ? "Actualizar" : "Crear"}
            initialValues={formData}
            schema={inventarioSchema}
          />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Inventario;
