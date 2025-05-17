import React, { useState } from "react";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import Toggle from "../atomos/Toggle";
import AnimatedContainer from "../atomos/AnimatedContainer";
import AlertDialog from "../atomos/AlertDialog";
import { Alert } from "@heroui/react";
import { useGetCentros } from '../../hooks/centros/useGetCentros';
import { usePostCentro } from '../../hooks/centros/usePostCentro';
import { usePutCentro } from '../../hooks/centros/usePutCentro';
import { useGetMunicipios } from '../../hooks/municipios/useGetMunicipios';
import { Centro } from '../../types/centro';
import { centroSchema } from '@/schemas/centro.schema';

const Centros = () => {
  const { centros, loading } = useGetCentros();
  const { crearCentro } = usePostCentro();
  const { actualizarCentro } = usePutCentro();
  const { municipios } = useGetMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // Usamos string para todos los campos del formulario para evitar errores de tipo
  type CentroFormValues = {
    nombre_centro: string;
    municipio_id: string;
    fecha_creacion: string;
    fecha_modificacion?: string;
    estado?: string; // 'Activo' | 'Inactivo'
    codigo_centro?: string;
  };
  const [formData, setFormData] = useState<Partial<CentroFormValues>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
  });

  const columns: Column<Centro & { key: number }>[]= [
    { key: "nombre_centro", label: "Nombre del Centro", filterable: true },
    {
      key: "municipio_id",
      label: "Municipio",
      filterable: true,
      render: (centro) => {
        const municipio = municipios.find(m => m.id_municipio === centro.municipio_id);
        return municipio ? municipio.nombre_municipio : centro.municipio_id;
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (centro) => (
        <Toggle 
          isOn={centro.estado} 
          onToggle={() => handleToggleEstado(centro)}
        />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (centro) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(centro)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  // Campos base para ambos formularios
  const baseFields: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { key: "municipio_id", label: "Municipio", type: "select", required: true, options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })) },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];

  // Campos adicionales sólo para edición
  const editFields: FormField[] = [
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  // Selección dinámica de campos
  const formFields: FormField[] = editingId ? [...baseFields, ...editFields] : baseFields;

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Validar con zod
      const parsed = centroSchema.safeParse(values);
      if (!parsed.success) {
        setAlert({
          isOpen: true,
          title: "Error de validación",
          message: parsed.error.errors.map((e) => e.message).join("\n"),
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      const municipioSeleccionado = municipios.find(m => m.id_municipio === Number(values.municipio_id));
      if (!municipioSeleccionado) {
        setAlert({
          isOpen: true,
          title: "Error",
          message: "Municipio no encontrado",
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      const hoy = new Date().toISOString().slice(0, 10);
      const payload = {
        id_centro: editingId ?? undefined,
        nombre_centro: values.nombre_centro,
        municipio_id: municipioSeleccionado.id_municipio,
        estado: true, // Por defecto activo
        fecha_creacion: values.fecha_creacion || hoy,
        fecha_modificacion: editingId ? (values.fecha_modificacion || hoy) : hoy
      } as Centro;

      if (editingId) {
        await actualizarCentro(editingId, payload);
        setSuccessAlertText("El centro fue actualizado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearCentro(payload);
        setSuccessAlertText("El centro fue creado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el centro:", error);
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Ocurrió un error al guardar el centro.",
        onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar estado de centro (activo/inactivo)
  const handleToggleEstado = async (centro: Centro) => {
    try {
      const nuevoEstado = !centro.estado;
      await actualizarCentro(centro.id_centro, { 
        ...centro,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      });
      setSuccessAlertText(`El centro fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error("Error al cambiar el estado del centro:", error);
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Error al cambiar el estado del centro.",
        onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  const handleCreate = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    setFormData({
      nombre_centro: '',
      municipio_id: '',
      fecha_creacion: hoy,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (centro: Centro) => {
    setFormData({
      nombre_centro: centro.nombre_centro,
      municipio_id: String(centro.municipio_id),
      fecha_creacion: centro.fecha_creacion?.split('T')[0],
      fecha_modificacion: centro.fecha_modificacion?.split('T')[0],
      codigo_centro: centro.codigo_centro,
    });
    setEditingId(centro.id_centro);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Centros</h1>
        </AnimatedContainer>

        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Centro
          </Boton>
        </AnimatedContainer>

          {loading ? (
            <p>Cargando centros...</p>
          ) : (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
              <GlobalTable 
                columns={columns as Column<any>[]} 
                data={centros
                  .map(c => ({ ...c, key: c.id_centro }))
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
                    {editingId ? "Editar Centro" : "Crear Nuevo Centro"}
                  </h2>
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={{
                      ...formData,
                      municipio_id: formData.municipio_id || '',
                      fecha_creacion: formData.fecha_creacion || '',
                      // Solo pasamos fecha_modificacion si es edición
                      ...(editingId ? { fecha_modificacion: formData.fecha_modificacion || '' } : {}),
                    }}
                    schema={centroSchema}
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

export default React.memo(Centros);
