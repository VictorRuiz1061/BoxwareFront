import { useState } from "react";
import { useGetMateriales, usePostMaterial, usePutMaterial } from "@/hooks/material";
import { useGetCategoriasElementos } from '@/hooks/Elemento';
import { useGetTipoMateriales } from "@/hooks/tipoMaterial";
import { Material } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast, TablaImagen } from "@/components/atomos";
import { ImageSelector } from "@/components/moleculas";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { materialSchema } from '@/schemas';
import Elemento from "./Elemento";
import TipoMaterial from "./TipoMaterial";

interface MaterialesProps {
  isInModal?: boolean;
  onMaterialCreated?: () => void;
}

const Materiales = ({ isInModal, onMaterialCreated }: MaterialesProps) => {
  const { materiales, loading } = useGetMateriales();
  const { crearMaterial } = usePostMaterial();
  const { actualizarMaterial } = usePutMaterial();
  const { categorias } = useGetCategoriasElementos();
  const { tipoMateriales } = useGetTipoMateriales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [isTipoMaterialModalOpen, setIsTipoMaterialModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<Material & { key: number }>[] = [
    { key: "codigo_sena", label: "Código SENA", filterable: true },
    { 
      key: "imagen", 
      label: "Imagen", 
      filterable: false,
      render: (material) => {
        let imageUrl = material.imagen || '';
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `https://${imageUrl}`;
        }
        return (
          <TablaImagen 
            src={imageUrl} 
            alt={`Imagen de ${material.nombre_material}`} 
            size="lg"
          />
        );
      }
    },
    { key: "nombre_material", label: "Nombre", filterable: true },
    { key: "descripcion_material", label: "Descripción", filterable: true },
    { key: "unidad_medida", label: "Unidad de Medida", filterable: true },
    {
      key: "categoria_id",
      label: "Categoría Elemento",
      filterable: true,
      render: (material) => {
        const categoriaId = material.categoria_id as any;
        if (categoriaId && typeof categoriaId === 'object' && categoriaId.nombre_categoria) {
          return categoriaId.nombre_categoria;
        }
        if (material.categoria && material.categoria.nombre_categoria) {
          return material.categoria.nombre_categoria;
        }
        return 'No disponible';
      }
    },{
      key: "tipo_material_id",
      label: "Tipo Material",
      filterable: true,
      render: (material) => {
        const tipoMaterialId = material.tipo_material_id as any;
        if (tipoMaterialId && typeof tipoMaterialId === 'object' && tipoMaterialId.tipo_elemento) {
          return tipoMaterialId.tipo_elemento;
        }
        if (material.tipo_material && material.tipo_material.tipo_elemento) {
          return material.tipo_material.tipo_elemento;
        }
        return 'No disponible';
      }
    }
  ];

  // Campos de formulario centralizados con layout de dos columnas
  const formFieldsCreate: FormField[] = [
    { 
      key: "codigo_sena", 
      label: "Código SENA", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "nombre_material", 
      label: "Nombre", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "descripcion_material", 
      label: "Descripción", 
      type: "text", 
      required: true,
      className: "col-span-2"
    },
    { 
      key: "unidad_medida", 
      label: "Unidad de Medida", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "producto_perecedero", 
      label: "Producto Perecedero", 
      type: "select", 
      required: true,
      className: "col-span-1",
      options: [
        { label: "Sí", value: "true" },
        { label: "No", value: "false" }
      ]
    },
    { 
      key: "fecha_vencimiento", 
      label: "Fecha de Vencimiento", 
      type: "date", 
      required: true,
      className: "col-span-2"
    },
    {
      key: "categoria_id",
      label: "Categoría",
      type: "select",
      required: true,
      className: "col-span-1",
      options: categorias.map(c => ({ label: c.nombre_categoria, value: c.id_categoria_elemento })),
      extraButton: {
        icon: "+",
        onClick: () => setIsCategoriaModalOpen(true),
      }
    },
    {
      key: "tipo_material_id",
      label: "Tipo de Material",
      type: "select",
      required: true,
      className: "col-span-1",
      options: tipoMateriales.map(t => ({ label: t.tipo_elemento, value: t.id_tipo_material })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoMaterialModalOpen(true),
      }
    }
  ];

  const formFieldsEdit: FormField[] = [
    { 
      key: "nombre_material", 
      label: "Nombre", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "descripcion_material", 
      label: "Descripción", 
      type: "text", 
      required: true,
      className: "col-span-2"
    },
    { 
      key: "unidad_medida", 
      label: "Unidad de Medida", 
      type: "text", 
      required: true,
      className: "col-span-1"
    },
    { 
      key: "producto_perecedero", 
      label: "Producto Perecedero", 
      type: "select", 
      required: true,
      className: "col-span-1",
      options: [
        { label: "Sí", value: "true" },
        { label: "No", value: "false" }
      ]
    },
    { 
      key: "fecha_vencimiento", 
      label: "Fecha de Vencimiento", 
      type: "date", 
      required: true,
      className: "col-span-2"
    },
    {
      key: "categoria_id",
      label: "Categoría",
      type: "select",
      required: true,
      className: "col-span-1",
      options: categorias.map(c => ({ label: c.nombre_categoria, value: c.id_categoria_elemento })),
      extraButton: {
        icon: "+",
        onClick: () => setIsCategoriaModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "tipo_material_id",
      label: "Tipo de Material",
      type: "select",
      required: true,
      className: "col-span-1",
      options: tipoMateriales.map(t => ({ label: t.tipo_elemento, value: t.id_tipo_material })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoMaterialModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir valores de string a los tipos correctos
      const categoria_id = parseInt(values.categoria_id);
      const tipo_material_id = parseInt(values.tipo_material_id);
      const producto_perecedero = values.producto_perecedero === 'true';
      
      // Obtener la imagen directamente del formData
      const imagenPath = formData.imagen || '';

      // Fecha actual para timestamps
      const currentDate = new Date().toISOString().split('T')[0];
      
      if (editingId) {
        // Actualizar material existente
        const updatePayload: Partial<Material> = {
          id_material: editingId,
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          unidad_medida: values.unidad_medida,
          imagen: imagenPath,
          producto_perecedero: producto_perecedero,
          fecha_vencimiento: values.fecha_vencimiento || currentDate,
          categoria_id: categoria_id,
          tipo_material_id: tipo_material_id,
          estado: true,
        };
        
        try {
          await actualizarMaterial(editingId, updatePayload);
          showSuccessToast('Material actualizado con éxito');
        } catch (updateError) {
          showErrorToast('Error al actualizar el material');
          return;
        }
      } else {
        // Crear nuevo material
        const createPayload: Material = {
          codigo_sena: values.codigo_sena,
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          unidad_medida: values.unidad_medida,
          imagen: imagenPath,
          producto_perecedero: producto_perecedero,
          fecha_vencimiento: values.fecha_vencimiento || currentDate,
          categoria_id: categoria_id,
          tipo_material_id: tipo_material_id,
          estado: true,
          id_material: 0
        }

        try {
          await crearMaterial(createPayload);
          showSuccessToast('Material creado con éxito');
          
          // Si estamos en modo modal y hay callback, lo llamamos
          if (isInModal && onMaterialCreated) {
            onMaterialCreated();
          }
        } catch (createError) {
          showErrorToast('Error al crear el material');
          return;
        }
      }
      
      if (!isInModal) {
        setIsModalOpen(false);
        setFormData({});
        setEditingId(null);
      }
    } catch (error) {
      showErrorToast('Error al procesar el formulario');
    }
  };

  const handleToggleEstado = async (material: Material) => {
    try {
      const nuevoEstado = !material.estado;
      const updateData = {
        id_material: material.id_material,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarMaterial(material.id_material, updateData);
      showSuccessToast(`El material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del material.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setFormData({
      nombre_material: material.nombre_material,
      descripcion_material: material.descripcion_material,
      unidad_medida: material.unidad_medida,
      imagen: material.imagen || '',
      producto_perecedero: material.producto_perecedero.toString(),
      fecha_vencimiento: material.fecha_vencimiento || '',
      categoria_id: material.categoria_id?.toString() || '',
      tipo_material_id: material.tipo_material_id?.toString() || ''
    });
    setEditingId(material.id_material);
    setIsModalOpen(true);
  };

  return (
    <AnimatedContainer>
      <div className="w-full">
        {!isInModal && (
          <>
              <h1 className="text-xl font-bold mb-4">Gestión de Materiales</h1>
          
            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Material">
              {textoBoton}
            </Botton>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Cargando materiales...</p>
              </div>
            ) : (
              <div className="w-full">
                {createEntityTable({
                  columns: columns as Column<any>[],
                  data: materiales,
                  idField: 'id_material',
                  handlers: {
                    onToggleEstado: handleToggleEstado,
                    onEdit: handleEdit
                  }
                })}
              </div>
            )}
          </>
        )}

        {/* En modo modal, mostramos directamente el formulario */}
        {isInModal ? (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Crear Nuevo Material</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1 flex flex-col items-center justify-start bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                <ImageSelector
                  label="Imagen del Material"
                  value={formData.imagen || ''}
                  onChange={(imagePath) => {
                    setFormData(prev => ({ ...prev, imagen: imagePath }));
                  }}
                />
              </div>
              
              <div className="col-span-1 bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                <Form
                  fields={formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText="Crear"
                  initialValues={{
                    ...formData,
                    fecha_creacion: new Date().toISOString().split('T')[0]
                  }}
                  schema={materialSchema}
                />
              </div>
            </div>
          </div>
        ) : (
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setFormData({});
              setEditingId(null);
            }} 
            title={editingId ? "Editar Material" : "Crear Nuevo Material"}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center justify-start bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                <ImageSelector
                  label="Imagen del Material"
                  value={formData.imagen || ''}
                  onChange={(imagePath) => {
                    setFormData(prev => ({ ...prev, imagen: imagePath }));
                  }}
                />
              </div>
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
                  schema={materialSchema}
                />
              </div>
            </div>
          </Modal>
        )}

        {/* Modal para crear categoría usando el modal global */}
        <Modal 
          isOpen={isCategoriaModalOpen} 
          onClose={() => setIsCategoriaModalOpen(false)} 
          title="Crear Nueva Categoría"
        >
          <Elemento isInModal={true} onCategoriaCreated={() => {
            setIsCategoriaModalOpen(false);
          }} />
        </Modal>

        {/* Modal para crear tipo de material usando el modal global */}
        <Modal 
          isOpen={isTipoMaterialModalOpen} 
          onClose={() => setIsTipoMaterialModalOpen(false)} 
          title="Crear Nuevo Tipo de Material"
        >
          <TipoMaterial isInModal={true} onTipoMaterialCreated={() => {
            setIsTipoMaterialModalOpen(false);
          }} />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Materiales;