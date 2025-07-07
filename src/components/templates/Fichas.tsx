import { useState } from "react";
import { useGetUsuarios } from '@/hooks/usuario';
import { useGetProgramas } from '@/hooks/programas';
import { useGetFichas, usePostFicha, usePutFicha } from "@/hooks/fichas";
import type { Ficha } from "@/types";
import {  AnimatedContainer,  Boton,  showSuccessToast,  showErrorToast } from "@/components/atomos";
import {  createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { fichaSchema } from '@/schemas';

const Fichas = () => {
  const { fichas, loading } = useGetFichas();
  const { crearFicha } = usePostFicha();
  const { actualizarFicha } = usePutFicha();
  const { usuarios } = useGetUsuarios();
  const { programas } = useGetProgramas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const renderUsuario = (ficha: any) => {
    if (ficha.usuario) {
      return `${ficha.usuario.nombre} ${ficha.usuario.apellido}`;
    }
    return 'Usuario no disponible';
  };
  
  const renderPrograma = (ficha: any) => {
    if (ficha.programa) {
      return ficha.programa.nombre_programa;
    }
    return 'Programa no disponible';
  };

    const columns: Column<Ficha & { key: number }>[]= [
      { key: "id_ficha", label: "ID", filterable: true },
      {
        key: "usuario_id" as keyof (Ficha & { key: number }),
        label: "Usuario",
        filterable: true,
        render: ficha => renderUsuario(ficha)
      },
      {
        key: "programa_id" as keyof (Ficha & { key: number }),
        label: "Programa",
        filterable: true,
        render: ficha => renderPrograma(ficha)
      },
    ];
  
    const formFieldsCreate: FormField[] = [
    { key: "id_ficha", label: "ID", type: "number", required: true },
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ label: `${u.nombre} ${u.apellido}`, value: u.id_usuario }))
    },
    {
      key: "programa_id",
      label: "Programa",
      type: "select",
      required: true,
      options: programas.map(p => ({ label: p.nombre_programa, value: p.id_programa }))
    }
  ];
  const formFieldsEdit: FormField[] = [
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ label: `${u.nombre} ${u.apellido}`, value: u.id_usuario }))
    },
    {
      key: "programa_id",
      label: "Programa",
      type: "select",
      required: true,
      options: programas.map(p => ({ label: p.nombre_programa, value: p.id_programa }))
    }
  ];

    const handleSubmit = async (values: Record<string, string>) => {
      try {
        // Convertir IDs a números
        const usuario_id = parseInt(values.usuario_id);
        const programa_id = parseInt(values.programa_id);
        const id_ficha = values.id_ficha ? parseInt(values.id_ficha) : null;
        
        // Fecha actual para timestamps
        const currentDate = new Date().toISOString();
        
        if (editingId) {
          // Actualizar ficha existente
          const updatePayload: Partial<Ficha> = {
            id_ficha: editingId,
            usuario_id: usuario_id,
            programa_id: programa_id,
            estado: true,
            fecha_modificacion: currentDate,
          };
          
          await actualizarFicha(editingId, updatePayload);
          showSuccessToast('Ficha actualizada con éxito');
        } else {
          // Crear nueva ficha
          if (!id_ficha) {
            showErrorToast('El ID de la ficha es requerido');
            return;
          }
          
          const createPayload: Ficha = {
            id_ficha: id_ficha,
            usuario_id: usuario_id,
            programa_id: programa_id,
            estado: true,
            fecha_creacion: currentDate,
            fecha_modificacion: currentDate
          };

          await crearFicha(createPayload);
          showSuccessToast('Ficha creada con éxito');
        }
        setIsModalOpen(false);
        setFormData({});
        setEditingId(null);
      } catch (error) {
        showErrorToast('Error al guardar la ficha');
      }
    };
  
    const handleToggleEstado = async (ficha: Ficha) => {
      try {
        const nuevoEstado = !ficha.estado;
        const updateData: Partial<Ficha> = {
          id_ficha: ficha.id_ficha,
          estado: nuevoEstado,
          fecha_modificacion: new Date().toISOString()
        };
  
        await actualizarFicha(ficha.id_ficha, updateData);
        showSuccessToast(`La ficha fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      } catch (error) {
        showErrorToast("Error al cambiar el estado de la ficha.");
      }
    };
  
    const handleCreate = () => {
      setFormData({});
      setEditingId(null);
      setIsModalOpen(true);
    };
  
    const handleEdit = (ficha: any) => {
    
    // Extraer los IDs de los objetos anidados si existen
    const usuarioId = ficha.usuario ? ficha.usuario.id_usuario.toString() : ficha.usuario_id.toString();
    const programaId = ficha.programa ? ficha.programa.id_programa.toString() : ficha.programa_id.toString();
    
    const formValues = {
      id_ficha: ficha.id_ficha.toString(),
      usuario_id: usuarioId,
      programa_id: programaId
    };
    
    setFormData(formValues);
    setEditingId(ficha.id_ficha);
    setIsModalOpen(true);
  };

    return (
      <>
        <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Fichas</h1>
          </AnimatedContainer>
        
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Ficha
          </Boton>
        </AnimatedContainer>
  
          {loading ? (
            <p>Cargando fichas...</p>
          ) : (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: fichas,
              idField: 'id_ficha',
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
                    {editingId ? "Editar Ficha" : "Crear Nueva Ficha"}
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
                    schema={fichaSchema}
                  />
                </div>
              </AnimatedContainer>  
              </div> 
            )}
          </div>
      </>
    );
  };

export default Fichas;