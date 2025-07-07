import { useState, useEffect } from "react";
// Importaciones desde los barrel files de hooks
import { useGetCaracteristicas, usePostCaracteristica, usePutCaracteristica } from "@/hooks/caracteristicas";
import { useGetInventario, usePostInventario, usePutInventario } from "@/hooks/inventario";
import { useGetMateriales } from "@/hooks/material";
import { useGetSitios } from "@/hooks/sitio";

// Importación desde el barrel file de types
import type { Caracteristica, Inventario } from "@/types";

// Importaciones desde los barrel files de componentes
import { 
  AnimatedContainer, 
  Boton, 
  showSuccessToast, 
  showErrorToast 
} from "@/components/atomos";

import { 
  createEntityTable,
  Form 
} from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";

const StockPage = () => {
  const { caracteristicas, loading: loadingCaracteristicas } = useGetCaracteristicas();
  const { inventario, loading: loadingInventario } = useGetInventario();
  const { materiales } = useGetMateriales();
  const { sitios } = useGetSitios();
  const { crearCaracteristica } = usePostCaracteristica();
  const { actualizarCaracteristica } = usePutCaracteristica();
  const { crearInventario } = usePostInventario();
  const { actualizarInventario } = usePutInventario();
  
  // Estado para edición
  const [editingCaracteristicaId, setEditingCaracteristicaId] = useState<number | null>(null);
  const [editingInventarioId, setEditingInventarioId] = useState<number | null>(null);

  const [isModalCaracteristicaOpen, setModalCaracteristicaOpen] = useState(false);
  const [isModalInventarioOpen, setModalInventarioOpen] = useState(false);
  const [formCaracteristica, setFormCaracteristica] = useState<Record<string, any>>({});
  const [formInventario, setFormInventario] = useState<Record<string, any>>({});
  const [selectedMaterialCaracteristicas, setSelectedMaterialCaracteristicas] = useState<Caracteristica | null>(null);

  // Campos del formulario de características
  const fieldsCaracteristica: FormField[] = [
    {
      key: "material_id",
      label: "Material",
      type: "select",
      options: materiales?.map((material) => ({ value: material.id_material, label: material.nombre_material })) || [],
      required: true,
    },
    { key: "placa_sena", label: "¿Requiere Placa SENA?", type: "toggle", required: true },
    { key: "descripcion", label: "¿Requiere Descripción?", type: "toggle", required: true },
  ];

  // Efecto para actualizar los campos del inventario según el material seleccionado
  useEffect(() => {
    if (formInventario.material_id) {
      const materialCaracteristicas = caracteristicas?.find(
        (c) => c.material_id === parseInt(formInventario.material_id)
      );
      setSelectedMaterialCaracteristicas(materialCaracteristicas || null);
    } else {
      setSelectedMaterialCaracteristicas(null);
    }
  }, [formInventario.material_id, caracteristicas]);

  // Campos del formulario de inventario (se modifican según características)
  const getInventarioFields = (): FormField[] => {
    const baseFields: FormField[] = [
      {
        key: "material_id",
        label: "Material",
        type: "select",
        options: materiales?.map((material) => ({ value: material.id_material, label: material.nombre_material })) || [],
        required: true,
        onChange: (value) => {
          setFormInventario(prev => ({ ...prev, material_id: value }));
        }
      },
      {
        key: "sitio_id",
        label: "Sitio",
        type: "select",
        options: sitios?.map((sitio) => ({ value: sitio.id_sitio, label: sitio.nombre_sitio })) || [],
        required: true
      },
      { key: "stock", label: "Stock", type: "number", required: true },
    ];

    // Agregar campos según las características del material
    if (selectedMaterialCaracteristicas) {
      if (selectedMaterialCaracteristicas.placa_sena) {
        baseFields.push({
          key: "placa_sena",
          label: "Placa SENA",
          type: "text",
          required: true,
        });
      }
      if (selectedMaterialCaracteristicas.descripcion) {
        baseFields.push({
          key: "descripcion",
          label: "Descripción",
          type: "text",
          required: true,
        });
      }
    }

    return baseFields;
  };

  const handleCreateCaracteristica = () => {
    setFormCaracteristica({});
    setEditingCaracteristicaId(null);
    setModalCaracteristicaOpen(true);
  };

  const handleCreateInventario = () => {
    setFormInventario({});
    setEditingInventarioId(null);
    setSelectedMaterialCaracteristicas(null);
    setModalInventarioOpen(true);
  };

  const handleSubmitCaracteristica = async (values: Record<string, any>) => {
    try {
      if (editingCaracteristicaId) {
        // Actualizar característica existente
        const caracteristicaActualizada: Partial<Caracteristica> = {
          material_id: parseInt(values.material_id),
          placa_sena: values.placa_sena === true,
          descripcion: values.descripcion === true,
        };
        await actualizarCaracteristica(editingCaracteristicaId, caracteristicaActualizada);
        showSuccessToast("Característica actualizada con éxito");
        setEditingCaracteristicaId(null);
      } else {
        // Crear nueva característica
        const nuevaCaracteristica: Caracteristica = {
          id_caracteristica: 0,
          material_id: parseInt(values.material_id),
          placa_sena: values.placa_sena === true,
          descripcion: values.descripcion === true,
        };
        await crearCaracteristica(nuevaCaracteristica);
        showSuccessToast("Característica creada con éxito");
      }
      
      setModalCaracteristicaOpen(false);
    } catch (err) {
      console.error('Error al procesar la característica:', err);
      showErrorToast("Error al procesar la característica");
    }
  };

  const handleSubmitInventario = async (values: Record<string, any>) => {
    try {
      // Validar campos requeridos según características
      if (selectedMaterialCaracteristicas) {
        if (selectedMaterialCaracteristicas.placa_sena && !values.placa_sena) {
          showErrorToast("La placa SENA es requerida para este material");
          return;
        }
        if (selectedMaterialCaracteristicas.descripcion && !values.descripcion) {
          showErrorToast("La descripción es requerida para este material");
          return;
        }
      }

      if (editingInventarioId) {
        // Actualizar inventario existente
        const inventarioActualizado: Inventario = {
          id_inventario: editingInventarioId,
          material_id: parseInt(values.material_id),
          sitio_id: parseInt(values.sitio_id),
          stock: parseInt(values.stock),
          placa_sena: values.placa_sena,
          descripcion: values.descripcion,
        };
        await actualizarInventario(editingInventarioId, inventarioActualizado);
        showSuccessToast("Inventario actualizado con éxito");
        setEditingInventarioId(null);
      } else {
        // Crear nuevo inventario
        const nuevoInventario: Inventario = {
          id_inventario: 0,
          material_id: parseInt(values.material_id),
          sitio_id: parseInt(values.sitio_id),
          stock: parseInt(values.stock),
          placa_sena: values.placa_sena,
          descripcion: values.descripcion,
        };
        await crearInventario(nuevoInventario);
        showSuccessToast("Inventario creado con éxito");
      }
      setModalInventarioOpen(false);
    } catch (err) {
      showErrorToast("Error al procesar el inventario");
    }
  };

  const columnsCaracteristica: Column<any>[] = [
    {
      key: "material_id",
      label: "Material",
      filterable: true,
      render: (caracteristica) => {
        if (caracteristica.material) {
          return caracteristica.material.nombre_material;
        }
        return 'No disponible';
      }
    },
    { 
      key: "placa_sena", 
      label: "Placa SENA", 
      render: (row) => (row.placa_sena ? "Sí" : "No") 
    },
    { 
      key: "descripcion", 
      label: "Descripción", 
      render: (row) => (row.descripcion ? "Sí" : "No") 
    },
  ];

  const columnsInventario: Column<any>[] = [
    {
      key: "material_id",
      label: "Material",
      filterable: true,
      render: (item) => {
        if (item.material) {
          return item.material.nombre_material;
        }
        return 'No disponible';
      }
    },
    {
      key: "sitio_id",
      label: "Sitio",
      filterable: true,
      render: (item) => {
        if (item.sitio) {
          return item.sitio.nombre_sitio;
        }
        return 'No disponible';
      }
    },
    { key: "stock", label: "Stock" },
    { 
      key: "placa_sena", 
      label: "Placa SENA",
      render: (item) => item.placa_sena || '-'
    },
    { 
      key: "descripcion", 
      label: "Descripción",
      render: (item) => item.descripcion || '-'
    },
  ];

  return (
    <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400}>
        <h1 className="text-xl font-bold mb-4">Gestión de Características e Inventario</h1>
      </AnimatedContainer>

      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <div className="flex gap-4 mb-4">
          <Boton onClick={handleCreateCaracteristica} className="bg-blue-500 text-white px-4 py-2">
            Crear Característica
          </Boton>
          <Boton onClick={handleCreateInventario} className="bg-green-500 text-white px-4 py-2">
            Crear Inventario
          </Boton>
        </div>
      </AnimatedContainer>

      {loadingCaracteristicas || loadingInventario ? <p>Cargando...</p> : (
        <>
          <AnimatedContainer animation="slideUp" delay={200} duration={500}>
            <h2 className="text-lg font-semibold mb-2">Características</h2>
            {createEntityTable({
              columns: columnsCaracteristica,
              data: caracteristicas || [],
              idField: "id_caracteristica",
              handlers: {
                onEdit: function (item: any): void {
                  const id = item.id_caracteristica;
                  const caracteristica = caracteristicas?.find(c => c.id_caracteristica === id);
                  if (caracteristica) {
                    setFormCaracteristica({
                      material_id: caracteristica.material_id,
                      placa_sena: caracteristica.placa_sena,
                      descripcion: caracteristica.descripcion
                    });
                    setEditingCaracteristicaId(id);
                    setModalCaracteristicaOpen(true);
                  }
                },
                onToggleEstado: function (): void {
                }
              }
            })}
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={300} duration={500}>
            <h2 className="text-lg font-semibold mt-6 mb-2">Inventario</h2>
            {createEntityTable({
              columns: columnsInventario,
              data: inventario || [],
              idField: "id_inventario",
              handlers: {
                onEdit: function (item: any): void {
                  const id = item.id_inventario;
                  const inventarioItem = inventario?.find(i => i.id_inventario === id);
                  if (inventarioItem) {
                    setFormInventario({
                      material_id: inventarioItem.material_id,
                      sitio_id: inventarioItem.sitio_id,
                      stock: inventarioItem.stock,
                      placa_sena: inventarioItem.placa_sena,
                      descripcion: inventarioItem.descripcion
                    });
                    setEditingInventarioId(id);
                    setModalInventarioOpen(true);
                  }
                },
                onToggleEstado: function (): void {
                }
              }
            })}
          </AnimatedContainer>
        </>
      )}

      {/* Modal Característica */}
      {isModalCaracteristicaOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
              <button onClick={() => setModalCaracteristicaOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <h2 className="text-center font-bold text-lg mb-4">
                {editingCaracteristicaId ? "Editar Característica" : "Nueva Característica"}
              </h2>
              <Form
                fields={fieldsCaracteristica}
                onSubmit={handleSubmitCaracteristica}
                buttonText={editingCaracteristicaId ? "Actualizar" : "Crear"}
                initialValues={formCaracteristica}
              />
            </div>
          </AnimatedContainer>
        </div>
      )}

      {/* Modal Inventario */}
      {isModalInventarioOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
              <button onClick={() => setModalInventarioOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <span className="text-gray-800 font-bold">×</span>
              </button>
              <h2 className="text-center font-bold text-lg mb-4">
                {editingInventarioId ? "Editar Inventario" : "Nuevo Inventario"}
              </h2>
              <Form
                fields={getInventarioFields()}
                onSubmit={handleSubmitInventario}
                buttonText={editingInventarioId ? "Actualizar" : "Crear"}
                initialValues={formInventario}
              />
            </div>
          </AnimatedContainer>
        </div>
      )}
    </div>
  );
};

export default StockPage;
