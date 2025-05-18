 import { useState } from "react";
import { Alert } from "@heroui/react";
import { Pencil } from "lucide-react";
import { materialSchema } from "@/schemas/material.schema";
import { useGetMateriales } from "@/hooks/material/useGetMateriales";
import { usePostMaterial } from "@/hooks/material/usePostMaterial";
import { usePutMaterial } from "@/hooks/material/usePutMaterial";
import { useGetTipoMateriales } from "@/hooks/tipoMaterial/useGetTipoMateriales";
import { useGetSitios } from "@/hooks/sitio/useGetSitios";
import { Material } from "@/types/material";
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import { useGetCategoriasElementos } from "@/hooks/Elemento/useGetCategoriasElementos";
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Toggle from "@/components/atomos/Toggle";

const Materiales = () => {
  const { materiales, loading } = useGetMateriales();
  const { crearMaterial } = usePostMaterial();
  const { actualizarMaterial } = usePutMaterial();
  const { categorias } = useGetCategoriasElementos();
  const { tipoMateriales } = useGetTipoMateriales();
  const { sitios } = useGetSitios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Material>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

  // Funciones para renderizar datos relacionados
  const renderCategoria = (categoria_id: number) => {
    const categoria = categorias.find(c => c.id_categoria_elemento === categoria_id);
    return categoria ? categoria.nombre_categoria || categoria_id : categoria_id;
  };

  const renderTipoMaterial = (tipo_id: number) => {
    const tipo = tipoMateriales.find(t => t.id_tipo_material === tipo_id);
    return tipo ? tipo.tipo_elemento || tipo_id : tipo_id;
  };

  const renderSitio = (sitio_id: number) => {
    const sitio = sitios.find(s => s.id_sitio === sitio_id);
    return sitio ? sitio.nombre_sitio || sitio_id : sitio_id;
  };

  const renderAcciones = (material: Material) => (
    <div className="flex gap-2">
      <Boton
        onPress={() => openModal(material)}
        className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
        aria-label="Editar"
      >
        <Pencil size={18} />
      </Boton>
    </div>
  );

  // Columnas centralizadas y limpias
  const columns: Column<Material>[] = [
    { key: "codigo_sena", label: "Código SENA", filterable: true },
    { key: "nombre_material", label: "Nombre", filterable: true },
    { key: "descripcion_material", label: "Descripción", filterable: true },
    { key: "stock", label: "Stock", filterable: true },
    { key: "unidad_medida", label: "Unidad de Medida", filterable: true },
    { 
      key: "categoria_id", 
      label: "Categoría", 
      filterable: true,
      render: material => renderCategoria(material.categoria_id)
    },
    { 
      key: "tipo_material_id", 
      label: "Tipo Material", 
      filterable: true,
      render: material => renderTipoMaterial(material.tipo_material_id)
    },
    { 
      key: "sitio_id", 
      label: "Sitio", 
      filterable: true,
      render: material => renderSitio(material.sitio_id)
    },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: material => (
        <Toggle isOn={material.estado} onToggle={() => handleToggleEstado(material)} />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: material => renderAcciones(material)
    }
  ];

  // Campos de formulario centralizados
  const formFields: FormField[] = [
    { key: "codigo_sena", label: "Código SENA", type: "text", required: true },
    { key: "nombre_material", label: "Nombre", type: "text", required: true },
    { key: "descripcion_material", label: "Descripción", type: "text", required: true },
    { key: "stock", label: "Stock", type: "number", required: true },
    { key: "unidad_medida", label: "Unidad de Medida", type: "text", required: true },
    { key: "imagen", label: "URL de Imagen", type: "text", required: true },
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
      options: categorias.map(c => ({ label: c.nombre_categoria || `Categoría ${c.id_categoria_elemento}`, value: c.id_categoria_elemento }))
    },
    {
      key: "tipo_material_id",
      label: "Tipo de Material",
      type: "select",
      required: true,
      options: tipoMateriales.map(t => ({ label: t.tipo_elemento || `Tipo ${t.id_tipo_material}`, value: t.id_tipo_material }))
    },
    {
      key: "sitio_id",
      label: "Sitio",
      type: "select",
      required: true,
      options: sitios.map(s => ({ label: s.nombre_sitio || `Sitio ${s.id_sitio}`, value: s.id_sitio }))
    }
  ];

  // Modal genérico para crear/editar material
  const openModal = (material?: Material) => {
    setFormData(material || {});
    setEditingId(material ? material.id_material : null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  // Función auxiliar para mostrar alertas de validación
  const showValidationAlert = (_title: string, message: string) => {
    setShowSuccessAlert(true);
    setSuccessAlertText(message);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  // Función auxiliar para preparar datos de material
  const buildMaterialPayload = (values: Record<string, string | number | boolean>, id?: number): Material => ({
    id_material: id ?? 0,
    codigo_sena: String(values.codigo_sena),
    nombre_material: String(values.nombre_material),
    descripcion_material: String(values.descripcion_material),
    stock: Number(values.stock),
    unidad_medida: String(values.unidad_medida),
    imagen: String(values.imagen),
    estado: values.estado !== undefined ? Boolean(values.estado) : true,
    producto_perecedero: Boolean(values.producto_perecedero),
    fecha_vencimiento: typeof values.fecha_vencimiento === 'string' ? values.fecha_vencimiento : String(values.fecha_vencimiento),
    fecha_creacion: values.fecha_creacion ? String(values.fecha_creacion) : new Date().toISOString().split('T')[0],
    fecha_modificacion: new Date().toISOString().split('T')[0],
    categoria_id: Number(values.categoria_id),
    tipo_material_id: Number(values.tipo_material_id),
    sitio_id: Number(values.sitio_id)
  });

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      // Validación con zod
      const parsed = materialSchema.safeParse(values);
      if (!parsed.success) {
        showValidationAlert("Error de validación", parsed.error.errors.map((e) => e.message).join("\n"));
        return;
      }
      
      // Validación de campos requeridos
      const requiredFields = [
        "codigo_sena", "nombre_material", "descripcion_material", "stock", 
        "unidad_medida", "imagen", "producto_perecedero", "fecha_vencimiento", 
        "categoria_id", "tipo_material_id", "sitio_id"
      ];
      
      const missing = requiredFields.find(
        field => values[field] === undefined || values[field] === null || (typeof values[field] === "string" && values[field] === "")
      );
      
      if (missing) {
        showValidationAlert("Campo requerido", `El campo '${missing}' es obligatorio.`);
        return;
      }
      
      // Validar categoría
      if (!categorias.some(c => c.id_categoria_elemento === Number(values.categoria_id))) {
        showValidationAlert("Categoría inválida", "Por favor selecciona una categoría válida.");
        return;
      }
      
      // Validar tipo de material
      if (!tipoMateriales.some(t => t.id_tipo_material === Number(values.tipo_material_id))) {
        showValidationAlert("Tipo de material inválido", "Por favor selecciona un tipo de material válido.");
        return;
      }
      
      // Validar sitio
      if (!sitios.some(s => s.id_sitio === Number(values.sitio_id))) {
        showValidationAlert("Sitio inválido", "Por favor selecciona un sitio válido.");
        return;
      }
      
      // Crear o actualizar
      if (editingId) {
        await actualizarMaterial(Number(editingId), buildMaterialPayload(values, Number(editingId)));
        setSuccessAlertText("El material fue actualizado correctamente.");
      } else {
        await crearMaterial(buildMaterialPayload(values));
        setSuccessAlertText("El material fue creado correctamente.");
      }
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      closeModal();
    } catch (error: any) {
      console.error("Error al guardar el material:", error);
      setShowSuccessAlert(true);
      setSuccessAlertText(error?.message || "Ocurrió un error al guardar el material.");
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Cambiar estado de material
  const handleToggleEstado = async (material: Material) => {
    try {
      const nuevoEstado = !material.estado;
      await actualizarMaterial(material.id_material, { ...material, estado: nuevoEstado });
      setSuccessAlertText(`El material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error: any) {
      setShowSuccessAlert(true);
      setSuccessAlertText(`Error al cambiar el estado del material: ${error?.message || 'Error desconocido'}`);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Abrir modal para crear nuevo material
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="w-full">
        <AnimatedContainer
          animation="fadeIn"
          duration={400}
          className="w-full"
        >
          <h1 className="text-xl font-bold mb-4">Gestión de Materiales</h1>
        </AnimatedContainer>

        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onPress={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 mb-4 hover:bg-blue-700"
          >
            Crear Nuevo Material
          </Boton>
        </AnimatedContainer>

        {/* Tabla de materiales */}
        <AnimatedContainer
          animation="slideUp"
          delay={200}
          duration={500}
          className="w-full"
        >
          {loading ? (
            <p>Cargando materiales...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={materiales
                .map((material) => ({
                  ...material,
                  key: material.id_material,
                }))
                // Ordenar por estado: activos primero, inactivos después
                .sort((a, b) => {
                  if (a.estado === b.estado) return 0;
                  return a.estado ? -1 : 1; // -1 pone a los activos primero
                })
              }
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
          )}
        </AnimatedContainer>

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
                {categorias.length === 0 || tipoMateriales.length === 0 || sitios.length === 0 ? (
                  <div className="text-center py-8">Cargando datos necesarios...</div>
                ) : (
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={{
                      ...formData,
                      categoria_id: formData.categoria_id ?? "",
                      tipo_material_id: formData.tipo_material_id ?? "",
                      sitio_id: formData.sitio_id ?? "",
                      producto_perecedero: formData.producto_perecedero ?? false,
                    }}
                    schema={materialSchema}
                  />
                )}
                <div className="flex justify-end mt-4"></div>
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

export default Materiales;