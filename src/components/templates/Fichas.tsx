import { useState } from "react";
import { useGetUsuarios } from '@/hooks/usuario';
import { useGetProgramas } from '@/hooks/programas';
import { useGetFichas, usePostFicha, usePutFicha } from "@/hooks/fichas";
import type { Ficha } from "@/types";
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { fichaSchema } from '@/schemas';
import Programas from './Programa';
import UsuarioForm from './UsuarioForm';

const Fichas = () => {
  const { fichas, loading } = useGetFichas();
  const { crearFicha } = usePostFicha();
  const { actualizarFicha } = usePutFicha();
  const { usuarios } = useGetUsuarios();
  const { programas } = useGetProgramas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProgramaModalOpen, setIsProgramaModalOpen] = useState(false);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

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

  const columns: Column<Ficha & { key: number }>[] = [
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
      options: usuarios.map(u => ({ label: `${u.nombre} ${u.apellido}`, value: u.id_usuario })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
      }
    },
    {
      key: "programa_id",
      label: "Programa",
      type: "select",
      required: true,
      options: programas.map(p => ({ label: p.nombre_programa, value: p.id_programa })),
      extraButton: {
        icon: "+",
        onClick: () => setIsProgramaModalOpen(true),
      }
    }
  ];
  const formFieldsEdit: FormField[] = [
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ label: `${u.nombre} ${u.apellido}`, value: u.id_usuario })),
      extraButton: {
        icon: "+",
        onClick: () => setIsUsuarioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
    {
      key: "programa_id",
      label: "Programa",
      type: "select",
      required: true,
      options: programas.map(p => ({ label: p.nombre_programa, value: p.id_programa })),
      extraButton: {
        icon: "+",
        onClick: () => setIsProgramaModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
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
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Fichas</h1>

        <Botton className="mb-4" onClick={handleCreate} texto="Crear Nueva Ficha">
          {textoBoton}
        </Botton>

        {loading ? (
          <p>Cargando fichas...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: fichas,
              idField: 'id_ficha',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar ficha usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Ficha" : "Crear Nueva Ficha"}
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
            schema={fichaSchema}
          />
        </Modal>

        {/* Modal para crear programa usando el modal global */}
        <Modal 
          isOpen={isProgramaModalOpen} 
          onClose={() => setIsProgramaModalOpen(false)} 
          title="Crear Nuevo Programa"
        >
          <Programas isInModal={true} onProgramaCreated={() => {
            setIsProgramaModalOpen(false);
          }} />
        </Modal>

        {/* Modal para crear usuario usando el modal global */}
        <Modal 
          isOpen={isUsuarioModalOpen} 
          onClose={() => setIsUsuarioModalOpen(false)} 
          title="Crear Nuevo Usuario"
        >
          <UsuarioForm onUsuarioCreated={() => {
            setIsUsuarioModalOpen(false);
          }} />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Fichas;