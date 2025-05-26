import { useState } from "react";
import { showSuccessToast, showErrorToast } from "@/components/atomos/Toast";
import { useGetMateriales } from "@/hooks/material/useGetMateriales";
import { usePostMaterial } from "@/hooks/material/usePostMaterial";
import { usePutMaterial } from "@/hooks/material/usePutMaterial";
import { useGetCategoriasElementos } from '@/hooks/Elemento/useGetCategoriasElementos';
import { useGetTipoMateriales } from "@/hooks/tipoMaterial/useGetTipoMateriales";
import { useGetSitios } from "@/hooks/sitio/useGetSitios";
import { Material } from '@/types/material';
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import Boton from "@/components/atomos/Boton";
import { Column, createEntityTable } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { materialSchema } from '@/schemas/material.schema';
import { TablaImagen } from "@/components/atomos/Imagen";
import ImageSelector from "@/components/moleculas/ImageSelector";

const Materiales = () => {
  const { materiales, loading } = useGetMateriales();
  const { crearMaterial } = usePostMaterial();
  const { actualizarMaterial } = usePutMaterial();
  const { categorias, loading: loadingCategoriasElementos } = useGetCategoriasElementos();
  const { tipoMateriales, loading: loadingTipoMateriales } = useGetTipoMateriales();
  const { sitios, loading: loadingSitios } = useGetSitios();
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
        // Asegurarnos de que la URL sea absoluta (con http/https)
        let imageUrl = material.imagen || '';
        
        // Si la imagen no tiene http/https y no es una ruta relativa con /, asumimos que es una URL incompleta
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `https://${imageUrl}`;
        }
        return (
          <TablaImagen 
            src={imageUrl} 
            alt={`Imagen de ${material.nombre_material}`} 
            size="lg" // Usar tamaño grande para que sea más visible
          />
        );
      }
    },
    { key: "nombre_material", label: "Nombre", filterable: true },
    { key: "descripcion_material", label: "Descripción", filterable: true },
    { key: "stock", label: "Stock", filterable: true },
    { key: "unidad_medida", label: "Unidad de Medida", filterable: true },
    {
      key: "categoria_id",
      label: "Categoría Elemento",
      filterable: true,
      render: (material) => {
        // Verificar si tenemos un objeto categoria con nombre
        if (material.categoria && typeof material.categoria === 'object') {
          // Si es un objeto con nombre_categoria
          if ('nombre_categoria' in material.categoria) {
            return material.categoria.nombre_categoria;
          }
        }
        
        // Si no tiene el objeto completo pero sí el ID, buscamos en la lista de categorías
        if (material.categoria_id && (!loadingCategoriasElementos && categorias.length > 0)) {
          // Extraer el ID numérico si categoria_id es un objeto
          let categoriaId = material.categoria_id;
          
          if (typeof material.categoria_id === 'object' && material.categoria_id !== null) {
            // Verificar si tiene la propiedad id_categoria_elemento
            if ('id_categoria_elemento' in material.categoria_id) {
              categoriaId = (material.categoria_id as any).id_categoria_elemento;
            }
          }
            
          const categoria = categorias.find(c => Number(c.id_categoria_elemento) === Number(categoriaId));
          return categoria ? categoria.nombre_categoria : `ID: ${categoriaId}`;
        }
        
        return 'No disponible';
      }
    },
    {
      key: "tipo_material_id",
      label: "Tipo Material",
      filterable: true,
      render: (material) => {
        // Verificar si tenemos un objeto tipo_material con nombre
        if (material.tipo_material && typeof material.tipo_material === 'object') {
          // Si es un objeto con tipo_elemento
          if ('tipo_elemento' in material.tipo_material) {
            return material.tipo_material.tipo_elemento;
          }
        }
        
        // Si no tiene el objeto completo pero sí el ID, buscamos en la lista de tipos de materiales
        if (material.tipo_material_id && (!loadingTipoMateriales && tipoMateriales.length > 0)) {
          // Extraer el ID numérico si tipo_material_id es un objeto
          let tipoMaterialId = material.tipo_material_id;
          
          if (typeof material.tipo_material_id === 'object' && material.tipo_material_id !== null) {
            // Verificar si tiene la propiedad id_tipo_material
            if ('id_tipo_material' in material.tipo_material_id) {
              tipoMaterialId = (material.tipo_material_id as any).id_tipo_material;
            }
          }
            
          const tipoMaterial = tipoMateriales.find(t => Number(t.id_tipo_material) === Number(tipoMaterialId));
          return tipoMaterial ? tipoMaterial.tipo_elemento : `ID: ${tipoMaterialId}`;
        }
        
        return 'No disponible';
      }
    },
    {
      key: "sitio_id",
      label: "Sitio",
      filterable: true,
      render: (material) => {
        // Verificar si tenemos un objeto sitio con nombre
        if (material.sitio && typeof material.sitio === 'object') {
          // Si es un objeto con nombre_sitio
          if ('nombre_sitio' in material.sitio) {
            return material.sitio.nombre_sitio;
          }
        }
        
        // Si no tiene el objeto completo pero sí el ID, buscamos en la lista de sitios
        if (material.sitio_id && (!loadingSitios && sitios.length > 0)) {
          // Extraer el ID numérico si sitio_id es un objeto
          let sitioId = material.sitio_id;
          
          if (typeof material.sitio_id === 'object' && material.sitio_id !== null) {
            // Verificar si tiene la propiedad id_sitio
            if ('id_sitio' in material.sitio_id) {
              sitioId = (material.sitio_id as any).id_sitio;
            }
          }
            
          const sitio = sitios.find(s => Number(s.id_sitio) === Number(sitioId));
          return sitio ? sitio.nombre_sitio : `ID: ${sitioId}`;
        }
        
        return 'No disponible';
      }
    }
  ];

  // Campos de formulario centralizados
  const formFieldsCreate: FormField[] = [
    { key: "codigo_sena", label: "Código SENA", type: "text", required: true },
    { key: "nombre_material", label: "Nombre", type: "text", required: true },
    { key: "descripcion_material", label: "Descripción", type: "text", required: true },
    { key: "stock", label: "Stock", type: "number", required: true },
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
    },
    {
      key: "sitio_id",
      label: "Sitio",
      type: "select",
      required: true,
      options: sitios.map(s => ({ label: s.nombre_sitio, value: s.id_sitio }))
    }
  ];


    const formFieldsEdit: FormField[] = [
      { key: "nombre_material", label: "Nombre", type: "text", required: true },
      { key: "descripcion_material", label: "Descripción", type: "text", required: true },
      { key: "stock", label: "Stock", type: "number", required: true },
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
      },
      {
        key: "sitio_id",
        label: "Sitio",
        type: "select",
        required: true,
        options: sitios.map(s => ({ label: s.nombre_sitio, value: s.id_sitio }))
      }
    ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir valores de string a los tipos correctos
      const categoria_id = parseInt(values.categoria_id);
      const tipo_material_id = parseInt(values.tipo_material_id);
      const sitio_id = parseInt(values.sitio_id);
      const stock = parseInt(values.stock);
      const producto_perecedero = values.producto_perecedero === 'true';
      
      // Obtener la imagen directamente del formData
      const imagenPath = formData.imagen || '';
      console.log('Imagen seleccionada:', imagenPath); // Para depuración

      // Fecha actual para timestamps
      const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      if (editingId) {
        // Actualizar material existente
        const updatePayload: Partial<Material> = {
          id_material: editingId, // Usar id_material en lugar de id
          nombre_material: values.nombre_material,
          descripcion_material: values.descripcion_material,
          stock: stock,
          unidad_medida: values.unidad_medida,
          imagen: imagenPath, // Usar directamente la imagen del formData
          producto_perecedero: producto_perecedero,
          fecha_vencimiento: values.fecha_vencimiento || currentDate,
          categoria_id: categoria_id,
          tipo_material_id: tipo_material_id,
          sitio_id: sitio_id,
          estado: true,
          fecha_modificacion: currentDate
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
          stock: stock,
          unidad_medida: values.unidad_medida,
          imagen: imagenPath, // Usar directamente la imagen del formData
          producto_perecedero: producto_perecedero,
          fecha_vencimiento: values.fecha_vencimiento || currentDate,
          categoria_id: categoria_id,
          tipo_material_id: tipo_material_id,
          sitio_id: sitio_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
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
      stock: material.stock.toString(),
      unidad_medida: material.unidad_medida,
      imagen: material.imagen || '' ,
      producto_perecedero: material.producto_perecedero.toString(),
      fecha_vencimiento: material.fecha_vencimiento,
      categoria_id: material.categoria_id.toString(),
      tipo_material_id: material.tipo_material_id.toString(),
      sitio_id: material.sitio_id.toString()
    });
    setEditingId(material.id_material);
    setIsModalOpen(true);
  };

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