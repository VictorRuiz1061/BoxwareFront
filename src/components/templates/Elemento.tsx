import { useState } from "react";
import { useGetCategoriasElementos, usePostCategoriaElemento, usePutCategoriaElemento } from '@/hooks/Elemento';
import type { CategoriaElemento } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import type { Column, FormField } from "@/components/organismos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import { categoriaElementoSchema } from '@/schemas/elementos.schemas';

interface ElementoProps {
  isInModal?: boolean;
  onCategoriaCreated?: () => void;
}

const Elemento = ({ isInModal, onCategoriaCreated }: ElementoProps) => {
  const { categorias, loading } = useGetCategoriasElementos();
  const { crearCategoriaElemento } = usePostCategoriaElemento();
  const { actualizarCategoriaElemento } = usePutCategoriaElemento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<CategoriaElemento & { key: number }>[] = [
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
          fecha_creacion: categoriaActual.fecha_creacion,
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
        showSuccessToast('Categoria creada con éxito');

        // Si estamos en modo modal y hay callback, lo llamamos
        if (isInModal && onCategoriaCreated) {
          onCategoriaCreated();
        }
      }

      if (!isInModal) {
        setIsModalOpen(false);
        setFormData({});
        setEditingId(null);
      }
    } catch (error) {
      showErrorToast('Error al guardar la categoría');
    }
  };

  const handleToggleEstado = async (categoria: CategoriaElemento) => {
    try {
      const nuevoEstado = !categoria.estado;
      const updateData: Partial<CategoriaElemento> = {
        ...categoria,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
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
    <AnimatedContainer>
      <div className="w-full">
        {!isInModal && (
          <>
            <h1 className="text-xl font-bold mb-4">Gestión de Elementos</h1>

            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nueva Categoría">
              {textoBoton}
            </Botton>

            {loading ? (
              <p>Cargando categorias...</p>
            ) : (
              <div className="w-full">
                {createEntityTable({
                  columns: columns as Column<any>[],
                  data: categorias,
                  idField: 'id_categoria_elemento',
                  handlers: {
                    onToggleEstado: handleToggleEstado,
                    onEdit: handleEdit
                  }
                })}
              </div>
            )}
          </>
        )}

        {/* Modal para crear/editar categoría usando el modal global */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }}
          title={editingId ? "Editar Categoría" : "Crear Nueva Categoría"}
        >
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
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Elemento;
