import React, { useState, useEffect } from "react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import Toggle from "../atomos/Toggle";
import { Alert } from "@heroui/react";
import { useGetProgramas } from '../../hooks/programas/useGetProgramas';
import { usePostPrograma } from '../../hooks/programas/usePostPrograma';
import { usePutPrograma } from '../../hooks/programas/usePutPrograma';
import { Programa } from '../../types/programa';
import { useGetAreas } from '../../hooks/areas/useGetAreas';
import { programaSchema } from '@/schemas/programa.schema';

const Programas = () => {
  const { programas, loading } = useGetProgramas();
  // Estado para controlar el toggle visual sin depender de la recarga de datos
  const [toggleStates, setToggleStates] = useState<{[key: number]: boolean}>({});
  
  // Inicializar los estados de los toggles cuando los programas se cargan
  useEffect(() => {
    if (programas && programas.length > 0) {
      setToggleStates(prev => {
        const newStates = {...prev};
        programas.forEach(programa => {
          // Solo inicializar si no existe ya en toggleStates
          if (!(programa.id_programa in newStates)) {
            newStates[programa.id_programa] = programa.estado === "true";
          }
        });
        return newStates;
      });
    }
  }, [programas]);
  // Eliminar console.log innecesario
  const { crearPrograma } = usePostPrograma();
  const { actualizarPrograma } = usePutPrograma();
  const { areas } = useGetAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Programa>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<Programa>[] = [
    { key: "nombre_programa", label: "Nombre del Programa", filterable: true },
    {
      key: "area_id",
      label: "Área",
      filterable: true,
      render: (programa) => {
        const area = areas.find(a => a.id_area === programa.area_id);
        return area ? area.nombre_area : String(programa.area_id);
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Última Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (programa) => {
        // Usar el ID específico como clave para este toggle
        const programaId = programa.id_programa;
        const isActive = toggleStates[programaId] ?? (programa.estado === "true");
        
        return (
          <div className="flex items-center justify-center">
            <Toggle
              key={`toggle-${programaId}`} // Clave única para React
              isOn={isActive}
              onToggle={() => handleToggleEstado(programa)}
            />
          </div>
        );
      }
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (programa) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(programa)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_programa", label: "Nombre del Programa", type: "text", required: true },
    { key: "area_id", label: "Área", type: "select", required: true, options: areas.map(a => ({ label: a.nombre_area, value: a.id_area })) },
    { key: "estado", label: "Estado", type: "select", required: true, options: [
      { label: "Activo", value: "true" },
      { label: "Inactivo", value: "false" }
    ]},
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const areaSeleccionada = areas.find(a => a.id_area === Number(values.area_id));
      if (!areaSeleccionada) {
        alert("Por favor selecciona un área válida.");
        return;
      }
      
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Get the existing program to preserve fecha_creacion
        const existingPrograma = programas.find(p => p.id_programa === editingId);
        
        await actualizarPrograma(editingId, {
          id_programa: editingId,
          nombre_programa: values.nombre_programa as string,
          area_id: areaSeleccionada.id_area,
          fecha_creacion: existingPrograma?.fecha_creacion || currentDate, // Preserve existing fecha_creacion
          fecha_modificacion: currentDate,
          estado: values.estado === "true" ? "true" : "false"
        });
        alert('Programa actualizado con éxito');
      } else {
        // Para creación, incluimos un id_programa temporal que el backend puede usar o ignorar
        await crearPrograma({
          id_programa: 0, // El backend generará el ID real
          nombre_programa: values.nombre_programa as string,
          area_id: areaSeleccionada.id_area,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
          estado: values.estado === "true" ? "true" : "false"
        });
        alert('Programa creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el programa:', error);
      alert('Error al guardar el programa');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Cambiar el estado (activo/inactivo) de un programa
  // Cambiar el estado (activo/inactivo) de un programa específico
  const handleToggleEstado = async (programa: Programa) => {
    try {
      // Obtener el ID específico del programa que estamos modificando
      const programaId = programa.id_programa;
      
      // Determinar el estado actual y el nuevo estado
      const estadoActual = toggleStates[programaId] ?? (programa.estado === "true");
      const nuevoEstado = !estadoActual;
      
      // Actualizar SOLO el estado de este programa específico
      setToggleStates(prev => {
        const newState = {...prev};
        newState[programaId] = nuevoEstado;
        return newState;
      });
      
      // Mostrar mensaje de éxito
      setSuccessAlertText(`El programa fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
      // Crear el objeto de actualización para el backend (debe ser un Programa completo)
      const updateData: Programa = {
        id_programa: programaId,
        nombre_programa: programa.nombre_programa,
        area_id: programa.area_id,
        fecha_creacion: programa.fecha_creacion,
        fecha_modificacion: new Date().toISOString(),
        estado: nuevoEstado ? "true" : "false"
      };
      
      // Enviar la actualización al servidor
      await actualizarPrograma(programaId, updateData);
      
      console.log(`Toggle actualizado para programa ${programaId}: ${nuevoEstado}`);
      
    } catch (error) {
      console.error(`Error al cambiar el estado del programa ${programa.id_programa}:`, error);
      
      // Si hay un error, revertir SOLO el cambio de este programa específico
      const programaId = programa.id_programa;
      setToggleStates(prev => {
        const newState = {...prev};
        newState[programaId] = programa.estado === "true";
        return newState;
      });
      
      alert('Error al cambiar el estado del programa');
    }
  };



  const handleEdit = (programa: Programa) => {
    setFormData(programa);
    setEditingId(programa.id_programa);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Programas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Programa
          </Boton>

          {loading ? (
            <p>Cargando programas...</p>
          ) : programas && programas.length > 0 ? (
            <GlobalTable 
              columns={columns as Column<any>[]} 
              data={programas
                .map(programa => {
                  // Asegurarse de que cada programa tenga un ID único
                  const programaId = programa.id_programa;
                  
                  // Crear un objeto nuevo para cada programa
                  return {
                    ...programa,
                    key: programaId, // Clave única para React
                    // NO modificar el estado original aquí, solo usarlo para ordenar
                    _estadoVisual: toggleStates[programaId] ?? (programa.estado === "true")
                  };
                })
                // Ordenar por estado: activos primero, inactivos después
                .sort((a, b) => {
                  // Usar toggleStates para reflejar el estado actual, incluso si acaba de cambiar
                  const aActive = toggleStates[a.id_programa] ?? (a.estado === "true");
                  const bActive = toggleStates[b.id_programa] ?? (b.estado === "true");
                  
                  // Si los estados son diferentes, ordenar por estado
                  if (aActive !== bActive) {
                    return aActive ? -1 : 1; // -1 pone a los activos primero
                  }
                  
                  // Si los estados son iguales, ordenar alfabéticamente por nombre
                  return a.nombre_programa.localeCompare(b.nombre_programa);
                })
              } 
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">No se encontraron programas. Intenta crear uno nuevo.</p>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                {/* Botón X para cerrar en la esquina superior derecha */}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Programa" : "Crear Nuevo Programa"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    nombre_programa: formData.nombre_programa || '',
                    area_id: formData.area_id ? String(formData.area_id) : '',
                    estado: formData.estado ? String(formData.estado) : 'true'
                  }}
                  schema={programaSchema}
                />
              </div>
            </div>
          )}
        </div>

        {/* Alerta de éxito */}
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

export default React.memo(Programas);
