import React, { useState } from "react";
import { Alert } from "@heroui/react";
import { Pencil } from 'lucide-react';
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetSedes } from '../../hooks/sedes/useGetSedes';
import { usePostSede } from '../../hooks/sedes/usePostSede';
import { usePutSede } from '../../hooks/sedes/usePutSede';
import { useGetCentros } from '../../hooks/centros/useGetCentros';
import { sedeSchema } from '@/schemas/sede.schema';
import { Sede } from '@/types/sede';
import { NuevaSede } from "@/api/sedes/postSede";
import Toggle from "@/components/atomos/Toggle";

const Sedes = () => {
  const { sedes, loading, fetchSedes } = useGetSedes();
  const { crearSede } = usePostSede();
  const { actualizarSede } = usePutSede();
  const { centros, loading: loadingCentros } = useGetCentros();
  
  React.useEffect(() => {
    console.log('Centros cargados:', centros);
  }, [centros]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');
  const [formData, setFormData] = useState<Partial<Sede>>({});

  const columns: Column<Sede & { key: number }>[]= [
    { key: "nombre_sede", label: "Nombre de la Sede", filterable: true },
    { key: "direccion_sede", label: "Dirección de la sede", filterable: true },
    {
      key: "centro_id",
      label: "Centro",
      filterable: true,
      render: (sede) => {
        if (sede.centro) {
          return sede.centro.nombre_centro;
        }
        
        if (sede.id_centro && (!loadingCentros && centros.length > 0)) {
          const centro = centros.find(c => c.id_centro === sede.id_centro);
          return centro ? centro.nombre_centro : `ID: ${sede.id_centro}`;
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
      render: (sede) => (
        <Toggle 
          isOn={sede.estado} 
          onToggle={() => handleToggleEstado(sede)}
        />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (sede) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => {
              console.log('Botón editar clickeado para sede:', sede.id_sede);
              handleEdit(sede);
            }}
            className="bg-yellow-500 text-white"
            type="button"
          >
            <Pencil size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const baseFields: FormField[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la sede", type: "text", required: true },
    { 
      key: "centro_id", 
      label: "Centro", 
      type: "select", 
      required: true, 
      options: centros && centros.length > 0 
        ? centros.map(c => ({ 
            label: c.nombre_centro, 
            value: c.id_centro.toString() 
          })) 
        : [{ label: 'Cargando centros...', value: '' }]
    }
  ];
  
  const formFields: FormField[] = baseFields;

  const handleSubmit = async (values: Record<string, any>) => {
    console.log('Formulario enviado con valores:', values);
    try {
      const parsed = sedeSchema.safeParse(values);
      if (!parsed.success) {
        console.error('Error de validación:', parsed.error.errors);
        setSuccessAlertText(parsed.error.errors.map(e => e.message).join('\n'));
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const centro_id = parseInt(values.centro_id);
      if (isNaN(centro_id)) {
        console.error('Error: centro_id no es un número válido:', values.centro_id);
        setSuccessAlertText('El ID del centro no es válido');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const hoy = new Date().toISOString().split('T')[0];
      
      if (editingId) {
        const sedeActual = sedes.find(s => s.id_sede === editingId);
        
        if (sedeActual) {
          const updateData: NuevaSede = {
            nombre_sede: values.nombre_sede,
            direccion_sede: values.direccion_sede,
            centro_id: centro_id,
            fecha_creacion: sedeActual.fecha_creacion,
            fecha_modificacion: hoy,
            estado: sedeActual.estado
          };
          
          await actualizarSede(editingId, updateData);
          setSuccessAlertText('Sede actualizada con éxito');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        }
      } else {
        const sedeData: NuevaSede = {
          nombre_sede: values.nombre_sede,
          direccion_sede: values.direccion_sede,
          centro_id: centro_id,
          fecha_creacion: hoy,
          fecha_modificacion: hoy,
          estado: true
        };
        
        await crearSede(sedeData);
        setSuccessAlertText('Sede creada con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      
      await fetchSedes();
    } catch (error: any) {
      console.error('Error al guardar la sede:', error);
      setSuccessAlertText(`Ocurrió un error al guardar la sede: ${error.message || 'Error desconocido'}`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleToggleEstado = async (sede: Sede) => {
    try {
      const nuevoEstado = !sede.estado;
      const updateData: NuevaSede = {
        centro_id: sede.centro_id,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      await actualizarSede(sede.id_sede, updateData);
      setSuccessAlertText(`La sede fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchSedes();
    } catch (error) {
      setSuccessAlertText(`Error al cambiar el estado de la sede: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({
      nombre_sede: '',
      direccion_sede: '',
      centro_id: 0
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    console.log('Editando sede:', sede);
  
    const formValues = {
      nombre_sede: sede.nombre_sede || '',
      direccion_sede: sede.direccion_sede || '',
      centro_id: sede.centro_id ?? 0
    };

    setFormData(formValues);
    setEditingId(sede.id_sede);
    setIsModalOpen(true);
  };

  return (
    <>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Sedes</h1>

      <Boton
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Crear Nueva Sede
      </Boton>

      {loading ? (
        <p>Cargando sedes...</p>
      ) : (
        <GlobalTable 
        columns={columns as Column<any>[]} 
        data={sedes
          .map(c => ({ ...c, key: c.id_sede }))
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
          <div className="p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                console.log('Cerrando modal');
                setIsModalOpen(false);
              }} 
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <span className="text-gray-800 font-bold">×</span>
            </button>
            
            <h2 className="text-lg font-bold mb-4 text-center">
              {editingId ? "Editar Sede" : "Crear Nueva Sede"}
            </h2>
            
            {loadingCentros ? (
              <p className="text-center py-4">Cargando centros...</p>
            ) : centros.length === 0 ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                <p>No hay centros disponibles. Por favor, cree centros primero.</p>
              </div>
            ) : (
              <Form
                fields={formFields}
                onSubmit={handleSubmit}
                buttonText={editingId ? "Actualizar" : "Crear"}
                initialValues={formData}
                schema={sedeSchema}
              />
            )}
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
    </div>
    </>
  );
};
export default Sedes;
