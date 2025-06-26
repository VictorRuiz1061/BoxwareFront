import { useState } from "react";
import { useGetMateriales, usePostMaterial, usePutMaterial } from "@/hooks/material";
import { useGetCategoriasElementos } from '@/hooks/Elemento';
import { useGetTipoMateriales } from "@/hooks/tipoMaterial";
import { Material } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast, TablaImagen } from "@/components/atomos";
import { ImageSelector } from "@/components/moleculas";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { materialSchema } from '@/schemas';

const Materiales = () => {
  const { materiales, loading } = useGetMateriales();
  const { crearMaterial } = usePostMaterial();
  const { actualizarMaterial } = usePutMaterial();
  const { categorias } = useGetCategoriasElementos();
  const { tipoMateriales } = useGetTipoMateriales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

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
        // Verificar si categoria_id es un objeto con nombre_categoria
        const categoriaId = material.categoria_id as any;
        if (categoriaId && typeof categoriaId === 'object' && categoriaId.nombre_categoria) {
          return categoriaId.nombre_categoria;
        }
        // Verificar si el objeto categoria existe y tiene la propiedad nombre_categoria
        if (material.categoria && material.categoria.nombre_categoria) {
          return material.categoria.nombre_categoria;
        }
        // Si todo falla, mostrar un texto genérico
        return 'No disponible';
      }
    },{
      key: "tipo_material_id",
      label: "Tipo Material",
      filterable: true,
      render: (material) => {
        // Verificar si tipo_material_id es un objeto con tipo_elemento
        const tipoMaterialId = material.tipo_material_id as any;
        if (tipoMaterialId && typeof tipoMaterialId === 'object' && tipoMaterialId.tipo_elemento) {
          return tipoMaterialId.tipo_elemento;
        }
        // Verificar si el objeto tipo_material existe y tiene la propiedad tipo_elemento
        if (material.tipo_material && material.tipo_material.tipo_elemento) {
          return material.tipo_material.tipo_elemento;
        }
        // Si todo falla, mostrar un texto genérico
        return 'No disponible';
      }
    }
  ];

  // Campos de formulario centralizados
  const formFieldsCreate: FormField[] = [
    { key: "codigo_sena", label: "Código SENA", type: "text", required: true },
    { key: "nombre_material", label: "Nombre", type: "text", required: true },
    { key: "descripcion_material", label: "Descripción", type: "text", required: true },
    { key: "unidad_medida", label: "Unidad de Medida", type: "text", required: true },
    { 
      key: "producto_perecedero", 
      label: "Producto Perecedero", 
      type: "select", 
      required: true,
      options: [
        { label: "Sí", value: "true" },
        { label: "No", value: "false" }
      ]
    },
    { 
      key: "fecha_vencimiento", 
      label: "Fecha de Vencimiento", 
      type: "date", 
      required: true 
    },
    {
      key: "categoria_id",
      label: "Categoría",
      type: "select",
      required: true,
      options: categorias.map(c => ({ label: c.nombre_categoria, value: c.id_categoria_elemento }))
    },
    {
      key: "tipo_material_id",
      label: "Tipo de Material",
      type: "select",
      required: true,
      options: tipoMateriales.map(t => ({ label: t.tipo_elemento, value: t.id_tipo_material }))
    }
  ];


    const formFieldsEdit: FormField[] = [
      { key: "nombre_material", label: "Nombre", type: "text", required: true },
      { key: "descripcion_material", label: "Descripción", type: "text", required: true },
      { key: "unidad_medida", label: "Unidad de Medida", type: "text", required: true },
      { 
        key: "producto_perecedero", 
        label: "Producto Perecedero", 
        type: "select", 
        required: true,
        options: [
          { label: "Sí", value: "true" },
          { label: "No", value: "false" }
        ]
      },
      { 
        key: "fecha_vencimiento", 
        label: "Fecha de Vencimiento", 
        type: "date", 
        required: true 
      },
      {
        key: "categoria_id",
        label: "Categoría",
        type: "select",
        required: true,
        options: categorias.map(c => ({ label: c.nombre_categoria, value: c.id_categoria_elemento }))
      },
      {
        key: "tipo_material_id",
        label: "Tipo de Material",
        type: "select",
        required: true,
        options: tipoMateriales.map(t => ({ label: t.tipo_elemento, value: t.id_tipo_material }))
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
      const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      if (editingId) {
        // Actualizar material existente
        const updatePayload: Partial<Material> = {
          id_material: editingId, // Usar id_material en lugar de id
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          unidad_medida: values.unidad_medida,
          imagen: imagenPath, // Usar directamente la imagen del formData
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
          return; // Salir temprano para no cerrar el modal
        }
      } else {
        // Crear nuevo material
        const createPayload: Material = {
          codigo_sena: values.codigo_sena,
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          unidad_medida: values.unidad_medida,
          imagen: imagenPath, // Usar directamente la imagen del formData
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
        } catch (createError) {
          showErrorToast('Error al crear el material');
          return; // Salir temprano para no cerrar el modal
        }
      }
      
      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
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
        // Usar el nuevo Toast en lugar de la alerta
        showSuccessToast(`El material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      } catch (error) {
        // Usar el nuevo Toast para mostrar el error
        showErrorToast("Error al cambiar el estado del material.");
      }
    };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    // Convertir los valores a string para el formulario
    setFormData({
      nombre_material: material.nombre_material,
      descripcion_material: material.descripcion_material,
      unidad_medida: material.unidad_medida,
      imagen: material.imagen || '' ,
      producto_perecedero: material.producto_perecedero.toString(),
      fecha_vencimiento: material.fecha_vencimiento,
      categoria_id: material.categoria_id.toString(),
      tipo_material_id: material.tipo_material_id.toString()
    });
    setEditingId(material.id_material);
    setIsModalOpen(true);
  };

  // Mostrar datos completos de la base de datos
  console.log('Datos crudos de la base de datos:', materiales);
  
  // Examinar la estructura de los primeros materiales para diagnosticar el problema
  if (materiales && materiales.length > 0) {
    const primerMaterial = materiales[0];
    console.log('Estructura del primer material:', JSON.stringify(primerMaterial, null, 2));
    console.log('Tipo de categoria_id:', typeof primerMaterial.categoria_id);
    console.log('Valor de categoria_id:', primerMaterial.categoria_id);
    console.log('Objeto categoria:', primerMaterial.categoria);
    console.log('Tipo de tipo_material_id:', typeof primerMaterial.tipo_material_id);
    console.log('Valor de tipo_material_id:', primerMaterial.tipo_material_id);
    console.log('Objeto tipo_material:', primerMaterial.tipo_material);
  }

  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Materiales</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Material
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando materiales...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: materiales,
            idField: 'id_material',
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
                  {editingId ? "Editar Material" : "Crear Nuevo Material"}
                </h2>
                {/* Componente para seleccionar imágenes */}
                <ImageSelector
                  label="Imagen del Material"
                  value={formData.imagen || ''}
                  onChange={(imagePath) => {
                    setFormData(prev => ({ ...prev, imagen: imagePath }));
                  }}
                />
                
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
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Materiales;