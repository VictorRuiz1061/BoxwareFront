import { Alert } from "@heroui/react";
import { useState } from "react";
import { Pencil } from 'lucide-react';
import { useGetAreas } from '@/hooks/areas/useGetAreas';
import { usePostArea } from '@/hooks/areas/usePostArea';
import { usePutArea } from '@/hooks/areas/usePutArea';
import { Area } from '@/types/area';
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { areaSchema } from '@/schemas/area.schema';
import { useGetSedes } from '@/hooks/sedes/useGetSedes';

const Areas = () => {
  const { areas, loading } = useGetAreas();
  const { crearArea } = usePostArea();
  const { actualizarArea } = usePutArea();
  const { sedes, loading: loadingSedes } = useGetSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState("");

  const columns: Column<Area & { key: number }>[]= [
    { key: "nombre_area", label: "Nombre del Área", filterable: true },
    {
      key: "sede_id",
      label: "Sede",
      filterable: true,
      render: (area) => {
        if (loadingSedes || sedes.length === 0) {
          return 'Cargando...';
        }
        
        const sede = sedes.find(s => s.id_sede === area.sede_id);
        return sede ? sede.nombre_sede : `ID: ${area.sede_id}`;
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (area) => (
        <div className="flex items-center justify-center">
          <Toggle
            isOn={area.estado}
            onToggle={() => handleToggleEstado(area)}
          />
        </div>
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (area) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(area)}
            className="bg-yellow-500 text-white">
            <Pencil size={18} />  
          </Boton>
        </div>
      ),
    },
  ];

  const getFormFields = (): FormField[] => {
    const baseFields: FormField[] = [
      { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
      { 
        key: "sede_id", 
        label: "Sede", 
        type: "select", 
        required: true, 
        options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede.toString() })) 
      },
    ];
    
    if (editingId) {
      baseFields.push({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
    } else {
      baseFields.push({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
    }
    
    return baseFields;
  };

  const handleToggleEstado = async (area: Area) => {
    try {
      const nuevoEstado = !area.estado;
      const updateData = {
        id_area: area.id_area,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarArea(area.id_area, updateData);
      setSuccessAlertText(`El área fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      alert('Error al cambiar el estado del área');
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const parsed = areaSchema.safeParse(values);
      if (!parsed.success) {
        setErrorAlertText(parsed.error.errors.map((e) => e.message).join("\n"));
        setShowErrorAlert(true);
        return;
      }
      
      const sedeId = Number(values.sede_id);
      const sedeSeleccionada = sedes.find(s => s.id_sede === sedeId);
      if (!sedeSeleccionada) {
        setErrorAlertText("Sede no encontrada");
        setShowErrorAlert(true);
        return;
      }

      // Convert estado to boolean
      const estadoValue = editingId
        ? values.estado === 'Activo'
        : true;

      const basePayload = {
        nombre_area: values.nombre_area,
        sede_id: sedeId,
        estado: estadoValue,
      };
      
      if (editingId) {
        const updatePayload = {
          id_area: editingId,
          ...basePayload,
          fecha_modificacion: values.fecha_modificacion 
            ? new Date(values.fecha_modificacion).toISOString() 
            : new Date().toISOString()
        };
        
        await actualizarArea(editingId, updatePayload);
        setSuccessAlertText('Área actualizada con éxito');
      } else {
        const currentDate = new Date().toISOString();
        const createPayload = {
          ...basePayload,
          fecha_creacion: values.fecha_creacion 
            ? new Date(values.fecha_creacion).toISOString() 
            : currentDate,
          fecha_modificacion: currentDate
        };
        
        await crearArea(createPayload);
        setSuccessAlertText('Área creada con éxito');
      }
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      alert('Error al guardar el área');
    }
  };

  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      nombre_area: '',
      sede_id: '',
      fecha_creacion: today,
      fecha_modificacion: today,
      estado: "Activo"
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (area: Area) => {
    setFormData({
      nombre_area: area.nombre_area,
      sede_id: area.sede_id ? area.sede_id.toString() : '',
      estado: area.estado ? "Activo" : "Inactivo",
      fecha_creacion: area.fecha_creacion.split('T')[0],
      fecha_modificacion: new Date().toISOString().split('T')[0]
    });
    setEditingId(area.id_area);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Áreas</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Área
          </Boton>

          {loading ? (
            <p>Cargando áreas...</p>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error al cargar áreas</p>
              <p>Hubo un problema al conectar con el servidor. Por favor, intente más tarde.</p>
              <p className="text-sm mt-2">Puede crear nuevas áreas usando el botón "Crear Nueva Área".</p>
            </div>
          ) : (
            <GlobalTable
              columns={columns}
              data={areas
                .map(area => ({ ...area, key: area.id_area }))
                .sort((a, b) => {
                  if (a.estado === b.estado) return 0;
                  return a.estado ? -1 : 1;
                })
              }
              rowsPerPage={6}
              defaultSortColumn="estado"
              defaultSortDirection="desc"
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Área" : "Crear Nueva Área"}
                </h2>
                <Form
                  fields={getFormFields()}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    ...(editingId ? {} : { estado: "Activo" }),
                    ...(editingId 
                      ? { fecha_modificacion: formData.fecha_modificacion ?? new Date().toISOString().split('T')[0] }
                      : { fecha_creacion: formData.fecha_creacion ?? new Date().toISOString().split('T')[0] })
                  }}
                  schema={areaSchema}
                />
              </div>
            </div>
          )}

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

          {showErrorAlert && (
            <div className="fixed top-4 right-4 z-50">
              <Alert
                hideIconWrapper
                color="danger"
                description={errorAlertText}
                title="Error"
                variant="solid"
                onClose={() => setShowErrorAlert(false)}
              />
            </div>
          )}
        </div>
    </>
  );
};

export default Areas;
