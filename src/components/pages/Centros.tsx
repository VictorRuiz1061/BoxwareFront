import { useState } from "react";
import { Pencil } from 'lucide-react';
import { Alert } from "@heroui/react";
import { useGetMunicipios } from '@/hooks/municipios/useGetMunicipios';
import { useGetCentros } from '@/hooks/centros/useGetCentros';
import { usePostCentro } from '@/hooks/centros/usePostCentro';
import { usePutCentro } from '@/hooks/centros/usePutCentro';
import { Centro } from '@/types/centro';
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { centroSchema } from '@/schemas/centro.schema';

const Centros = () => {
  const { centros, loading } = useGetCentros();
  const { crearCentro } = usePostCentro();
  const { actualizarCentro } = usePutCentro();
  const { municipios, loading: loadingMunicipios } = useGetMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Centro>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText] = useState("");

  const columns: Column<Centro & { key: number }>[]= [
    { key: "nombre_centro", label: "Nombre del Centro", filterable: true },
    {
      key: "municipio",
      label: "Municipio",
      filterable: true,
      render: (centro) => {
        if (centro.municipio) {
          return centro.municipio.nombre_municipio;
        }
        
        if (centro.id_municipio && (!loadingMunicipios && municipios.length > 0)) {
          const municipio = municipios.find(m => m.id_municipio === centro.id_municipio);
          return municipio ? municipio.nombre_municipio : `ID: ${centro.id_municipio}`;
        }
        
        return 'No disponible';
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true, 
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
            className="bg-yellow-500 text-white">
            <Pencil size={18} />  
          </Boton>
        </div>
      ),
    },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { 
      key: "id_municipio", 
      label: "Municipio", 
      type: "select", 
      required: true, 
      options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })) 
    },
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { 
      key: "id_municipio", 
      label: "Municipio", 
      type: "select", 
      required: true, 
      options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })) 
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const parsed = centroSchema.safeParse(values);
      if (!parsed.success) {
        setSuccessAlertText(parsed.error.errors.map((e) => e.message).join("\n"));
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      const municipio = Number(values.id_municipio);
      const municipioSeleccionado = municipios.find(m => m.id_municipio === municipio);
      if (!municipioSeleccionado) {
        setSuccessAlertText("Municipio no encontrado");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      const hoy = new Date().toISOString().slice(0, 10);
      if (editingId) {
        const payload = {
          id_centro: editingId,
          nombre_centro: values.nombre_centro,
          id_municipio: municipio,
          codigo_centro: values.codigo_centro,
          estado: true,
          fecha_modificacion: hoy
        };
        await actualizarCentro(editingId, payload);
        setSuccessAlertText("El centro fue actualizado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        const payload = {
          nombre_centro: values.nombre_centro,
          id_municipio: municipio,
          codigo_centro: values.codigo_centro,
          estado: true,
          fecha_creacion: hoy,
          fecha_modificacion: hoy,
        };
        await crearCentro(payload);
        setSuccessAlertText("El centro fue creado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      setSuccessAlertText("Ocurrió un error al guardar el centro.");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleToggleEstado = async (centro: Centro) => {
    try {
      const nuevoEstado = !centro.estado;
      
      const updateData = {
        id_centro: centro.id_centro,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarCentro(centro.id_centro, updateData);
      setSuccessAlertText(`El centro fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      setSuccessAlertText("Error al cambiar el estado del centro.");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (centro: Centro) => {
    setFormData(centro);
    setEditingId(centro.id_centro);
    setIsModalOpen(true);
  };


  return (
    <>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Centros</h1>

        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Centro
        </Boton>

        {loading ? (
          <p>Cargando centros...</p>
        ) : (
          <GlobalTable 
            columns={columns as Column<any>[]} 
            data={centros
              .map(c => ({ ...c, key: c.id_centro }))
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
                  fields={editingId ? formFieldsEdit : formFieldsCreate}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...Object.entries(formData).reduce((acc, [key, value]) => {
                      acc[key] = value !== undefined ? String(value) : '';
                      return acc;
                    }, {} as Record<string, string>),
                  }}
                  schema={centroSchema}
                />
              </div>
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

    </>
  );
};

export default (Centros);

