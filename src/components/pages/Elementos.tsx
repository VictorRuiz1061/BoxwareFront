import React, { useState } from "react";
import { Alert } from "@heroui/react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import AnimatedContainer from "../atomos/AnimatedContainer";
import { useGetCategoriasElementos } from '../../hooks/Elemento/useGetCategoriasElementos';
import { CategoriaElemento } from '../../types/categoriaElemento';
import { usePostCategoriaElemento } from '../../hooks/Elemento/usePostCategoriaElemento';
import { usePutCategoriaElemento } from '../../hooks/Elemento/usePutCategoriaElemento';
import Toggle from "../atomos/Toggle";

const Elementos = () => {
  const { categorias, loading, fetchCategorias } = useGetCategoriasElementos();
  const { crearCategoriaElemento } = usePostCategoriaElemento();
  const { actualizarCategoriaElemento } = usePutCategoriaElemento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CategoriaElemento>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<CategoriaElemento>[] = [
    { key: "codigo_unpsc", label: "Código UNSPSC", filterable: true },
    { key: "nombre_categoria", label: "Nombre de la Categoría", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    { 
      key: "estado", 
      label: "Estado", 
      filterable: true,
      render: (categoria) => (
        <Toggle
          isOn={categoria.estado}
          onToggle={() => handleToggleEstado(categoria)}
        />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (categoria) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(categoria)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
          >
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    { key: "codigo_unpsc", label: "Código UNSPSC", type: "text", required: true },
    { key: "nombre_categoria", label: "Nombre de la Categoría", type: "text", required: true },
    // Quitamos el campo de estado ya que ahora se maneja con el Toggle
  ];
  if (editingId) {
    formFields.push({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
  } else {
    formFields.push({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
  }

  // Crear o actualizar categoría
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      if (editingId) {
        await actualizarCategoriaElemento(editingId, {
          codigo_unpsc: values.codigo_unpsc as string,
          nombre_categoria: values.nombre_categoria as string,
          estado: values.estado as boolean,
          fecha_modificacion: values.fecha_modificacion as string,
          fecha_creacion: formData.fecha_creacion as string || '',
        });
        setSuccessAlertText('Categoría actualizada con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearCategoriaElemento({
          codigo_unpsc: values.codigo_unpsc as string,
          nombre_categoria: values.nombre_categoria as string,
          fecha_creacion: values.fecha_creacion as string,
          fecha_modificacion: values.fecha_creacion as string,
          estado: values.estado as boolean,
        } as Omit<CategoriaElemento, 'id_categoria_elemento'>);
        setSuccessAlertText('Categoría creada con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      fetchCategorias();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      setShowSuccessAlert(true);
      setSuccessAlertText(`Error al guardar la categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Cambiar el estado (activo/inactivo) de una categoría
  const handleToggleEstado = async (categoria: CategoriaElemento) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !categoria.estado;
      const updateData: Partial<CategoriaElemento> = {
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Cambiando estado de categoría ${categoria.id_categoria_elemento} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      await actualizarCategoriaElemento(categoria.id_categoria_elemento, updateData);
      setSuccessAlertText(`La categoría fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchCategorias(); // Actualizar la lista de categorías
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setShowSuccessAlert(true);
      setSuccessAlertText(`Error al cambiar el estado de la categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // Abrir modal para crear nueva categoría
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar categoría existente
  const handleEdit = (categoria: CategoriaElemento) => {
    setFormData(categoria);
    setEditingId(categoria.id_categoria_elemento);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Categorías de Elementos</h1>
        </AnimatedContainer>

        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton  
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Categoría
          </Boton>
        </AnimatedContainer>

          {/* Tabla de categorías */}
          {loading ? (
            <p>Cargando categorías de elementos...</p>
          ) : (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
              <GlobalTable 
                columns={columns} 
                data={categorias
                  .map(categoria => ({ ...categoria, key: categoria.id_categoria_elemento }))
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
                    {editingId ? "Editar Categoría" : "Crear Nueva Categoría"}
                  </h2>
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={formData}
                  />
                  <div className="flex justify-end mt-4">
                    <Boton
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 mr-2"
                    >
                      Cancelar
                    </Boton>
                  </div>
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

export default React.memo(Elementos);
