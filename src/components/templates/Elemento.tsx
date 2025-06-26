import { useState } from "react";
import { useGetCategoriasElementos, usePostCategoriaElemento, usePutCategoriaElemento } from '@/hooks/Elemento';
import type { CategoriaElemento } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import type { Column, FormField,  } from "@/components/organismos";
import { createEntityTable, Form } from "@/components/organismos";
import { categoriaElementoSchema } from '@/schemas/elementos.schemas';

const Elementos = () => {
  const { categorias, loading } = useGetCategoriasElementos();
  const { crearCategoriaElemento } = usePostCategoriaElemento();
  const { actualizarCategoriaElemento } = usePutCategoriaElemento();;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<CategoriaElemento & { key: number }>[]= [
    { key: "codigo_unpsc", label: "Código UNPSC", filterable: true },
    { key: "nombre_categoria", label: "Nombre Categoria", filterable: true },

  ];

  const formFieldsCreate: FormField[] = [
    { key: "codigo_unpsc", label: "Código UNPSC", type: "text", required: true },
    { key: "nombre_categoria", label: "Nombre Categoria", type: "text", required: true },
  ];
  const formFieldsEdit: FormField[] = [
    { key: "codigo_unpsc", label: "Código UNPSC", type: "text", required: true },
    { key: "nombre_categoria", label: "Nombre Categoria", type: "text", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Buscar la categoría actual para obtener la fecha de creación original
        const categoriaActual = categorias.find(cat => cat.id_categoria_elemento === editingId);
        
        if (!categoriaActual) {
          throw new Error('Categoría no encontrada');
        }
        
        const updatePayload = {
          id_categoria_elemento: editingId,
          nombre_categoria: values.nombre_categoria,
          codigo_unpsc: values.codigo_unpsc,
          estado: true,
          fecha_creacion: categoriaActual.fecha_creacion, // Mantener la fecha de creación original
          fecha_modificacion: currentDate,
        };
        
        await actualizarCategoriaElemento(editingId, updatePayload);
        showSuccessToast('Categoria actualizada con éxito');
      } else {
        const createPayload: Omit<CategoriaElemento, 'id_categoria_elemento' | 'municipio'> = {
          nombre_categoria: values.nombre_categoria,
          codigo_unpsc: values.codigo_unpsc,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearCategoriaElemento(createPayload as any);
        showSuccessToast('Categoria creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      // Reemplazar alert con nuestro nuevo Toast
      showErrorToast('Error al guardar la categoría');
    }
  };

  const handleToggleEstado = async (categoria: CategoriaElemento) => {
    try {
      const nuevoEstado = !categoria.estado;
      const updateData: Partial<CategoriaElemento> = {
        id_categoria_elemento: categoria.id_categoria_elemento,
        codigo_unpsc: categoria.codigo_unpsc,
        nombre_categoria: categoria.nombre_categoria,
        estado: nuevoEstado,
        fecha_creacion: categoria.fecha_creacion,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarCategoriaElemento(categoria.id_categoria_elemento, updateData as CategoriaElemento);
      showSuccessToast(`La categoría fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado de la categoría.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (categoria: CategoriaElemento) => {
    setFormData({
      nombre_categoria: categoria.nombre_categoria,
      codigo_unpsc: categoria.codigo_unpsc
    });
    setEditingId(categoria.id_categoria_elemento);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Elementos</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nueva Categoria
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando categorias...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: categorias,
            idField: 'id_categoria_elemento',
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
                  {editingId ? "Editar Categoría" : "Crear Nueva Categoría"}
                </h2>
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
                  schema={categoriaElementoSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Elementos;
