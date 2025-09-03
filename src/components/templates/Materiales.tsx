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

import { uploadImage } from "@/api/materiales/uploadImage";
import { STATIC_URLS } from "@/config/apiConfig";

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
  console.log("Materiales component - categorias:", categorias);
  console.log("Materiales component - tipoMateriales:", tipoMateriales);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [isTipoMaterialModalOpen, setIsTipoMaterialModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string | File>>({});
  const [textoBoton] = useState();

  const columns: Column<Material & { key: number }>[] = [
    { key: "codigo_sena", label: "Código SENA", filterable: true },
    { 
      key: "imagen", 
      label: "Imagen", 
      filterable: false,
      render: (material) => {
        // Construir la URL correcta para la imagen del backend
        let imageUrl;
        
        if (material.imagen) {
          // Si la imagen ya es una URL completa, usarla directamente
          if (material.imagen.startsWith('http://') || material.imagen.startsWith('https://')) {
            imageUrl = material.imagen;
          } else {
            // Si no, construir la URL completa al backend
            imageUrl = `${STATIC_URLS.MATERIAL_IMAGES}/${material.imagen}`;
          }
        } else {
          // Si no hay imagen, usar la imagen por defecto del frontend
          imageUrl = STATIC_URLS.DEFAULT_IMAGE;
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
      let imageUrl = '';
      const imagenValue = formData.imagen;

      // Primero subimos la imagen si existe
      if (imagenValue instanceof File) {
        try {
          const response = await uploadImage(imagenValue);
          imageUrl = response.imageUrl;
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          showErrorToast('Error al subir la imagen. Inténtalo de nuevo.');
          return; // Detener el proceso si falla la subida de imagen
        }
      } else if (typeof imagenValue === 'string' && imagenValue) {
        imageUrl = imagenValue;
      }

      // Asegurarnos de que los tipos de datos sean correctos
      const categoria_id = Number(values.categoria_id);
      const tipo_material_id = Number(values.tipo_material_id);
      const producto_perecedero = values.producto_perecedero === 'true';
      const currentDate = new Date().toISOString().split('T')[0];
      const fechaVencimiento = values.fecha_vencimiento 
        ? new Date(values.fecha_vencimiento).toISOString().split('T')[0]
        : new Date(currentDate).toISOString().split('T')[0];

      if (editingId) {
        const updatePayload: Partial<Material> = {
          id_material: editingId,
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          unidad_medida: values.unidad_medida,
          producto_perecedero: producto_perecedero,
          fecha_vencimiento: fechaVencimiento,
          categoria_id: categoria_id,
          tipo_material_id: tipo_material_id,
          estado: true,
          imagen: imageUrl,
        };

        await actualizarMaterial(editingId, updatePayload);
        showSuccessToast('Material actualizado con éxito');
      } else {
        // Asegurarnos de que todos los campos requeridos estén presentes y con el formato correcto
        const createPayload: any = {
          codigo_sena: values.codigo_sena,
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          unidad_medida: values.unidad_medida,
          producto_perecedero: producto_perecedero,
          fecha_vencimiento: fechaVencimiento,
          categoria_id: Number(categoria_id),  // Asegurar que sea número
          tipo_material_id: Number(tipo_material_id),  // Asegurar que sea número
          estado: true
        };
        
        // Verificar que los IDs sean números válidos
        if (isNaN(createPayload.categoria_id) || isNaN(createPayload.tipo_material_id)) {
          showErrorToast('Error: Los IDs de categoría y tipo de material deben ser números válidos');
          return;
        }
        
        console.log('Payload final para crear material:', createPayload);
        
        // Solo incluir la imagen si existe
        if (imageUrl) {
          createPayload.imagen = imageUrl;
        }

        await crearMaterial(createPayload);
        showSuccessToast('Material creado con éxito');
        if (isInModal && onMaterialCreated) {
          onMaterialCreated();
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
    const categoriaId = typeof (material.categoria_id as any) === 'object'
      ? (material.categoria_id as any).id_categoria_elemento
      : material.categoria_id;

    const tipoMaterialId = typeof (material.tipo_material_id as any) === 'object'
      ? (material.tipo_material_id as any).id_tipo_material
      : material.tipo_material_id;

    setFormData({
      nombre_material: material.nombre_material,
      descripcion_material: material.descripcion_material,
      unidad_medida: material.unidad_medida,
      imagen: material.imagen || '',
      producto_perecedero: material.producto_perecedero.toString(),
      fecha_vencimiento: material.fecha_vencimiento || '',
      categoria_id: categoriaId?.toString() || '',
      tipo_material_id: tipoMaterialId?.toString() || ''
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
                  value={typeof formData.imagen === 'string' ? formData.imagen : ''}
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
                  value={typeof formData.imagen === 'string' ? formData.imagen : ''}
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