import React, { useState } from "react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetMateriales } from '../../hooks/material/useGetMateriales';
import { usePostMaterial } from '../../hooks/material/usePostMaterial';
import { usePutMaterial } from '../../hooks/material/usePutMaterial';
import { useDeleteMaterial } from '../../hooks/material/useDeleteMaterial';
import { Material } from '../../types/material';
import { useGetCategoriasElementos } from '../../hooks/Elemento/useGetCategoriasElementos';
import { useGetTipoMateriales } from '../../hooks/tipoMaterial/useGetTipoMateriales';
import { useGetSitios } from '../../hooks/sitio/useGetSitios';
import Toggle from "../atomos/Toggle";
import AlertDialog from '../atomos/AlertDialog';
import AnimatedContainer from "../atomos/AnimatedContainer";

const Materiales = () => {
  const { materiales, loading, fetchMateriales } = useGetMateriales();
  const { crearMaterial } = usePostMaterial();
  const { actualizarMaterial } = usePutMaterial();
  const {  } = useDeleteMaterial();
  const { categorias } = useGetCategoriasElementos();
  const { tipoMateriales } = useGetTipoMateriales();
  const { sitios } = useGetSitios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Material>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  // Extender el tipo Material para incluir propiedades adicionales para la tabla
  type ExtendedMaterial = Material & {
    acciones?: React.ReactNode;
    categoria_nombre?: string;
    tipo_material_nombre?: string;
    sitio_nombre?: string;
    key?: React.Key;
    // Permitir que estos campos puedan ser string o number para manejar la serialización
    categoria_id: number | string;
    tipo_material_id: number | string;
    sitio_id: number | string;
    // Permitir que las fechas puedan ser string
    fecha_creacion: string;
    fecha_modificacion: string;
    fecha_vencimiento: string;
  };

  const columns: Column<ExtendedMaterial>[] = [
    { key: "codigo_sena", label: "Codigo sena", filterable: true },
    { key: "nombre_material", label: "Nombre", filterable: true },
    { key: "descripcion_material", label: "Descripción", filterable: true },
    { key: "stock", label: "Stock", filterable: true },
    { key: "unidad_medida", label: "Unidad de Medida", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    { key: "producto_perecedero", label: "Producto Perecedero", filterable: true },
    { key: "fecha_vencimiento", label: "Fecha de Vencimiento", filterable: true },
    {
      key: "categoria_nombre",
      label: "Categoría",
      filterable: true,
      render: (material) => {
        // Buscar por ambos campos: categoria_id e id_categoria
        const categoriaId = material.categoria_id || material.id_categoria;
        const categoria = categorias.find(c => c.id_categoria_elemento === categoriaId);
        return categoria ? categoria.nombre_categoria : categoriaId;
      }
    },
    {
      key: "tipo_material_nombre",
      label: "Tipo de Material",
      filterable: true,
      render: (material) => {
        // Buscar por ambos campos: tipo_material_id e id_tipo_material
        const tipoId = material.tipo_material_id || material.id_tipo_material;
        const tipo = tipoMateriales.find(t => t.id_tipo_material === tipoId);
        return tipo ? tipo.tipo_elemento : tipoId;
      }
    },
    {
      key: "sitio_nombre",
      label: "Sitio",
      filterable: true,
      render: (material) => {
        // Buscar por ambos campos: sitio_id e id_sitio
        const sitioId = material.sitio_id || material.id_sitio;
        const sitio = sitios.find(s => s.id_sitio === sitioId);
        return sitio ? sitio.nombre_sitio : sitioId;
      }
    },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (material) => (
        <Toggle
          isOn={Boolean(material.estado)}
          onToggle={() => handleToggleEstado(material)}
        />
      ),
    },
    {
      key: "acciones", // Cambiado de "actions" a "acciones" para cumplir con el tipo esperado
      label: "Acciones",
      render: (material) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(material)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    { key: "codigo_sena", label: "Codigo sena ", type: "text", required: true },
    { key: "nombre_material", label: "Nombre", type: "text", required: true },
    { key: "descripcion_material", label: "Descripción", type: "text", required: true },
    { key: "stock", label: "Stock", type: "number", required: true },
    { key: "unidad_medida", label: "Unidad de Medida", type: "text", required: true },
    { key: "producto_perecedero", label: "Producto Perecedero", type: "checkbox", required: false },
    { key: "estado", label: "Estado", type: "select", required: true, options: ['Activo', 'Inactivo'] },
    { key: "categoria_id", label: "Categoría", type: "select", required: true, options: categorias.map(c => c.nombre_categoria || '') },
    { key: "tipo_material_id", label: "Tipo de Material", type: "select", required: true, options: tipoMateriales.map(t => t.tipo_elemento || '') },
    { key: "sitio_id", label: "Sitio", type: "select", required: true, options: sitios.map(s => s.nombre_sitio || '') },
    { key: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date", required: true },
  ];

  // Crear o actualizar material
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      console.log('Valores del formulario:', values);
      
      // Buscar categoría, tipo de material y sitio seleccionados
      // Si no se encuentran, usar valores predeterminados para evitar errores
      const categoriaSeleccionada = categorias.find(c => c.nombre_categoria === values.categoria_id) || { id_categoria_elemento: 1 };
      const tipoMaterialSeleccionado = tipoMateriales.find(t => t.tipo_elemento === values.tipo_material_id) || { id_tipo_material: 1 };
      const sitioSeleccionado = sitios.find(s => s.nombre_sitio === values.sitio_id) || { id_sitio: 1 };
      
      console.log('Categoría seleccionada:', categoriaSeleccionada);
      console.log('Tipo de material seleccionado:', tipoMaterialSeleccionado);
      console.log('Sitio seleccionado:', sitioSeleccionado);
      
      // Adaptar los datos al formato que espera el backend
      const materialData = {
        codigo_sena: String(values.codigo_sena),
        nombre_material: String(values.nombre_material),
        descripcion_material: String(values.descripcion_material),
        stock: typeof values.stock === 'string' ? parseInt(values.stock) : Number(values.stock),
        unidad_medida: String(values.unidad_medida),
        producto_perecedero: Boolean(values.producto_perecedero || false),
        fecha_vencimiento: typeof values.fecha_vencimiento === 'string' ? values.fecha_vencimiento : new Date().toISOString(),
        // Usar los nombres de campos que espera el backend
        id_categoria: categoriaSeleccionada.id_categoria_elemento,
        id_tipo_material: tipoMaterialSeleccionado.id_tipo_material,
        id_sitio: sitioSeleccionado.id_sitio,
        // Estado como booleano (true = Activo)
        estado: values.estado === 'Activo' ? true : values.estado === 'Inactivo' ? false : true,
        // Usar 'imagen' en lugar de 'img'
        imagen: 'tornillo.jpg',
        fecha_creacion: new Date().toISOString(),
        fecha_modificacion: new Date().toISOString()
      };
      
      console.log('Datos formateados para enviar:', materialData);
      
      if (editingId) {
        await actualizarMaterial(editingId, materialData);
        setSuccessAlertText('Material actualizado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearMaterial(materialData as Omit<Material, 'id_material'>);
        setSuccessAlertText('Material creado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el material:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al guardar el material: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar el estado (activo/inactivo) de un material
  const handleToggleEstado = async (material: Material) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !material.estado;
      
      // Crear un objeto Material completo con los datos mínimos necesarios
      // para la actualización, manteniendo los datos originales del material
      const updateData: Material = {
        ...material,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };
      
      console.log(`Cambiando estado de material ${material.id_material} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      
      // Actualizar el material en el servidor
      await actualizarMaterial(material.id_material, updateData);
      
      // Mostrar mensaje de éxito
      setSuccessAlertText(`El material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // Actualizar la lista de materiales
      fetchMateriales();
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del material: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };



  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar material existente
  const handleEdit = (material: Material) => {
    setFormData(material);
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
            className="bg-blue-500 text-white px-4 py-2 mb-4 hover:bg-blue-600"
          >
            Crear Nuevo Material
          </Boton>
        </AnimatedContainer>

          {/* Tabla de materiales */}
          {loading ? (
            <p>Cargando materiales...</p>
          ) : (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
              <GlobalTable
              columns={columns}
              data={materiales.map((material) => {
                // Crear un objeto con valores seguros para renderizar
                const safeData: any = {
                  ...material,
                  key: material.id_material,
                  // Manejar tanto los campos antiguos como los nuevos
                  categoria_id: material.categoria_id || material.id_categoria,
                   tipo_material_id: material.tipo_material_id || material.id_tipo_material,
                  sitio_id: material.sitio_id || material.id_sitio,
                  // Manejar el campo estado que puede ser string o boolean
                  estado: typeof material.estado === 'boolean' ? (material.estado ? 'Activo' : 'Inactivo') : material.estado,
                  // Manejar el campo imagen/img
                  img: material.img || material.imagen,
                  // Asegurar que las fechas sean strings
                  fecha_creacion: String(material.fecha_creacion || ''),
                  fecha_modificacion: String(material.fecha_modificacion || ''),
                  fecha_vencimiento: String(material.fecha_vencimiento || '')
                };
                
                // Asegurarse de que los valores de categoría, tipo y sitio sean strings
                if (typeof safeData.categoria_id === 'object' && safeData.categoria_id !== null) {
                  safeData.categoria_id = String(safeData.categoria_id.id_categoria_elemento || '');
                } else {
                  // Si no es un objeto o es nulo, asegurar que sea un string
                  safeData.categoria_id = String(safeData.categoria_id || safeData.id_categoria || '');
                }
                
                if (typeof safeData.tipo_material_id === 'object' && safeData.tipo_material_id !== null) {
                  safeData.tipo_material_id = String(safeData.tipo_material_id.id_tipo_material || '');
                } else {
                  // Si no es un objeto o es nulo, asegurar que sea un string
                  safeData.tipo_material_id = String(safeData.tipo_material_id || safeData.id_tipo_material || '');
                }
                
                if (typeof safeData.sitio_id === 'object' && safeData.sitio_id !== null) {
                  safeData.sitio_id = String(safeData.sitio_id.id_sitio || '');
                } else {
                  // Si no es un objeto o es nulo, asegurar que sea un string
                  safeData.sitio_id = String(safeData.sitio_id || safeData.id_sitio || '');
                }
                
                return safeData;
              })}
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
            </AnimatedContainer>
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer
                animation="scaleIn"
                duration={300}
                className="w-full max-w-lg"
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Material" : "Crear Nuevo Material"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    categoria_id: categorias.find(c => c.id_categoria_elemento === formData.categoria_id)?.nombre_categoria || '',
                    tipo_material_id: tipoMateriales.find(t => t.id_tipo_material === formData.tipo_material_id)?.tipo_elemento || '',
                    sitio_id: sitios.find(s => s.id_sitio === formData.sitio_id)?.nombre_sitio || '',
                  }}
                />
                <div className="flex justify-end mt-4">
                  <Boton
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cerrar
                  </Boton>
                </div>  
                </div>
              
              </AnimatedContainer>
            </div>
          )}
        </div>
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50">
          <AnimatedContainer animation="fadeIn" duration={300}>
            <div className="bg-green-500 text-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">¡Éxito!</h3>
                <button onClick={() => setShowSuccessAlert(false)} className="text-white hover:bg-green-600 rounded-full w-6 h-6 flex items-center justify-center">
                  ×
                </button>
              </div>
              <p>{successAlertText}</p>
            </div>
          </AnimatedContainer>
        </div>
      )}
      <AlertDialog
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onConfirm}
        confirmText="Aceptar"
        cancelText=""
      />
      
    </>
  );
};

export default React.memo(Materiales);
