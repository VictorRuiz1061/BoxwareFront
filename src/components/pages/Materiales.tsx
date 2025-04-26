import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useMateriales } from '../../hooks/useMateriales';
import { Material } from '../../types/material';
import { useCategoriaElementos } from '../../hooks/useCategoriaElementos';
import { useTipoMateriales } from '../../hooks/useTipoMateriales';
import { useSitios } from '../../hooks/useSitios';

const Materiales = () => {
  const { materiales, loading, crearMaterial, actualizarMaterial, eliminarMaterial } = useMateriales();
  const { categorias } = useCategoriaElementos();
  const { tipoMateriales } = useTipoMateriales();
  const { sitios } = useSitios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Material>>({});

  const columns: Column<Material>[] = [
    { key: "codigo_sena", label: "Codigo sena", filterable: true },
    { key: "nombre_material", label: "Nombre", filterable: true },
    { key: "descripcion_material", label: "Descripción", filterable: true },
    { key: "stock", label: "Stock", filterable: true },
    { key: "unidad_medida", label: "Unidad de Medida", filterable: true },
    {
      key: "categoria_id",
      label: "Categoría",
      filterable: true,
      render: (material) => {
        const categoria = categorias.find(c => c.id_categoria_elemento === material.categoria_id);
        return categoria ? categoria.nombre_categoria : material.categoria_id;
      }
    },
    {
      key: "tipo_material_id",
      label: "Tipo de Material",
      filterable: true,
      render: (material) => {
        const tipo = tipoMateriales.find(t => t.id_tipo_material === material.tipo_material_id);
        return tipo ? tipo.tipo_elemento : material.tipo_material_id;
      }
    },
    {
      key: "sitio_id",
      label: "Sitio",
      filterable: true,
      render: (material) => {
        const sitio = sitios.find(s => s.id_sitio === material.sitio_id);
        return sitio ? sitio.nombre_sitio : material.sitio_id;
      }
    },
    { key: "fecha_vencimiento", label: "Fecha de Vencimiento", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (material) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(material)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(material.id_material)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
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
    { key: "categoria_id", label: "Categoría", type: "select", required: true, options: categorias.map(c => c.nombre_categoria) },
    { key: "tipo_material_id", label: "Tipo de Material", type: "select", required: true, options: tipoMateriales.map(t => t.tipo_elemento) },
    { key: "sitio_id", label: "Sitio", type: "select", required: true, options: sitios.map(s => s.nombre_sitio) },
    { key: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date", required: true },
  ];

  // Crear o actualizar material
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const categoriaSeleccionada = categorias.find(c => c.nombre_categoria === values.categoria_id);
      const tipoMaterialSeleccionado = tipoMateriales.find(t => t.tipo_elemento === values.tipo_material_id);
      const sitioSeleccionado = sitios.find(s => s.nombre_sitio === values.sitio_id);
      if (!categoriaSeleccionada || !tipoMaterialSeleccionado || !sitioSeleccionado) {
        alert('Por favor selecciona una categoría, tipo de material y sitio válidos.');
        return;
      }
      const materialData = {
        ...values,
        categoria_id: categoriaSeleccionada.id_categoria_elemento,
        tipo_material_id: tipoMaterialSeleccionado.id_tipo_material,
        sitio_id: sitioSeleccionado.id_sitio,
      };
      if (editingId) {
        await actualizarMaterial(editingId, materialData);
        alert('Material actualizado con éxito');
      } else {
        await crearMaterial(materialData as Omit<Material, 'id_material'>);
        alert('Material creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el material:', error);
    }
  };

  // Eliminar material
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este material?")) return;
    try {
      await eliminarMaterial(id);
      alert("Material eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el material:", error);
    }
  };

  // Abrir modal para crear nuevo material
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Materiales</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Material
          </Boton>

          {/* Tabla de materiales */}
          {loading ? (
            <p>Cargando materiales...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={materiales.map((material) => ({ ...material, key: material.id_material }))}
              rowsPerPage={6}
            />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Materiales;
