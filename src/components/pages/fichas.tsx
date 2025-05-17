import React, { useState } from "react";

import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import Toggle from "../atomos/Toggle";
import AnimatedContainer from "../atomos/AnimatedContainer";
import AlertDialog from "../atomos/AlertDialog";
import { Alert } from "@heroui/react";
import { useGetFichas } from "@/hooks/fichas/useGetFichas";
import { usePostFicha } from "@/hooks/fichas/usePostFicha";
import { usePutFicha } from "@/hooks/fichas/usePutFicha";
import { useDeleteFicha } from "@/hooks/fichas/useDeleteFicha";
import { Ficha } from "@/types/ficha";
import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { useGetProgramas } from "@/hooks/programas/useGetProgramas";
import { fichaSchema } from "@/schemas/ficha.schema";

// Definimos los tipos necesarios para el componente

const Fichas = () => {
  const { fichas, loading } = useGetFichas();
  console.log('Fichas component data:', { fichas, loading });
  const { crearFicha } = usePostFicha();
  const { actualizarFicha } = usePutFicha();
  const { eliminarFicha } = useDeleteFicha();
  const { usuarios } = useGetUsuarios();
  const { programas } = useGetProgramas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Ficha>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmFn, setAlertConfirmFn] = useState<() => void>(() => {});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

  const columns: Column<Ficha>[] = [
    { key: "id_ficha", label: "ID Ficha", filterable: true },
    {
      key: "usuario_id",
      label: "Usuario",
      filterable: true,
      render: (ficha) => {
        const usuario = usuarios.find((u) => u.id_usuario === ficha.usuario_id);
        return usuario ? `${usuario.nombre} ${usuario.apellido}` : ficha.usuario_id;
      },
    },
    {
      key: "programa_id",
      label: "Programa",
      filterable: true,
      render: (ficha) => {
        const programa = programas.find((p) => p.id_programa === ficha.programa_id);
        return programa ? programa.nombre_programa : ficha.programa_id;
      },
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Última Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (ficha) => (
        <Toggle
          isOn={ficha.estado}
          onToggle={() => handleToggleEstado(ficha)}
        />
      ),
    },
    {
      key: "acciones", // Cambiado de "actions" a "acciones" para cumplir con el tipo esperado
      label: "Acciones",
      render: (ficha) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(ficha)}
            className="bg-yellow-500 text-white px-2 py-1"
          >vv5
            Editar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "id_ficha", label: "ID Ficha", type: "number", required: true },
    { 
      key: "usuario_id", 
      label: "Usuario", 
      type: "select", 
      required: true, 
      options: usuarios.map(u => ({ label: u.nombre ? `${u.nombre} ${u.apellido || ''}`.trim() : `Usuario ${u.id_usuario}`, value: u.id_usuario }))
    },
    { 
      key: "programa_id", 
      label: "Programa", 
      type: "select", 
      required: true, 
      options: programas.map(p => ({ label: p.nombre_programa || `Programa ${p.id_programa}`, value: p.id_programa }))
    },
    // Quitamos el campo de estado ya que ahora se maneja con el Toggle
  ];

  // Cambiar el estado (activo/inactivo) de una ficha
  const handleToggleEstado = async (ficha: Ficha) => {
    try {
      const nuevoEstado = !ficha.estado;
      
      // Crear un objeto Ficha completo con los datos mínimos necesarios
      // para la actualización, manteniendo los datos originales de la ficha
      const updateData: Ficha = {
        ...ficha,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };
      
      console.log(`Cambiando estado de ficha ${ficha.id_ficha} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      
      // Actualizar la ficha en el servidor
      await actualizarFicha(ficha.id_ficha, updateData);
      
      // Mostrar mensaje de éxito
      setSuccessAlertText(`La ficha fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlertTitle('Error');
      setAlertMessage(`Error al cambiar el estado de la ficha: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setAlertConfirmFn(() => () => setAlertOpen(false));
      setAlertOpen(true);
    }
  };

  // Crear o actualizar ficha
  const handleSubmit = async (values: Record<string, string>) => {
    console.log('Form submitted with values:', values);
    try {
      // Validar que id_ficha sea un número válido
      if (!values.id_ficha || isNaN(Number(values.id_ficha))) {
        console.error('ID Ficha inválido:', values.id_ficha);
        setAlertTitle('Error de validación');
        setAlertMessage('Por favor ingresa un ID de Ficha válido (número)');
        setAlertConfirmFn(() => () => setAlertOpen(false));
        setAlertOpen(true);
        return;
      }
      
      // Validar que usuario_id sea un número válido
      if (!values.usuario_id || isNaN(Number(values.usuario_id))) {
        console.error('ID Usuario inválido:', values.usuario_id);
        setAlertTitle('Error de validación');
        setAlertMessage('Por favor selecciona un usuario válido');
        setAlertConfirmFn(() => () => setAlertOpen(false));
        setAlertOpen(true);
        return;
      }
      
      // Validar que programa_id sea un número válido
      if (values.programa_id && isNaN(Number(values.programa_id))) {
        console.error('ID Programa inválido:', values.programa_id);
        setAlertTitle('Error de validación');
        setAlertMessage('Por favor selecciona un programa válido');
        setAlertConfirmFn(() => () => setAlertOpen(false));
        setAlertOpen(true);
        return;
      }
      
      const usuarioSeleccionado = usuarios.find(u => u.id_usuario === Number(values.usuario_id));
      console.log('Usuario seleccionado:', usuarioSeleccionado);
      
      const programaSeleccionado = values.programa_id ? programas.find(p => p.id_programa === Number(values.programa_id)) : null;
      console.log('Programa seleccionado:', programaSeleccionado);
      
      if (!usuarioSeleccionado) {
        console.error('Usuario no encontrado para ID:', values.usuario_id);
        setAlertTitle('Error de validación');
        setAlertMessage('Por favor selecciona un usuario válido');
        setAlertConfirmFn(() => () => setAlertOpen(false));
        setAlertOpen(true);
        return;
      }
      
      // Verificar que el token JWT esté presente para la autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token JWT disponible. La autenticación podría fallar.');
        setAlertTitle('Error de autenticación');
        setAlertMessage('No hay sesión activa. Por favor inicia sesión nuevamente.');
        setAlertConfirmFn(() => () => setAlertOpen(false));
        setAlertOpen(true);
        return;
      }
      
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        try {
          // Actualizar ficha existente
          const fichaActualizada: Ficha = {
            id_ficha: Number(values.id_ficha),
            usuario_id: Number(values.usuario_id),
            programa_id: Number(values.programa_id),
            estado: true, // Por defecto activo
            fecha_creacion: formData.fecha_creacion || new Date().toISOString(),
            fecha_modificacion: new Date().toISOString()
          };
          
          console.log('Actualizando ficha con datos:', fichaActualizada);
          
          await actualizarFicha(editingId, fichaActualizada);
          setSuccessAlertText('Ficha actualizada con éxito');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        } catch (error) {
          console.error('Error al actualizar ficha:', error);
          setAlertTitle('Error');
          setAlertMessage(`Error al actualizar la ficha: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          setAlertConfirmFn(() => () => setAlertOpen(false));
          setAlertOpen(true);
        }
      } else {
        try {
          // Para creación, incluimos un id_ficha que el backend necesita
          // Usar el valor del formulario si existe, o un valor temporal
          const fichaId = values.id_ficha ? Number(values.id_ficha) : 0;
          console.log('ID Ficha a crear:', fichaId);
          
          // Preparar los datos para enviar al backend
          const fichaData = {
            id_ficha: fichaId, // Incluir el ID de ficha para que el backend lo reciba
            usuario_id: usuarioSeleccionado.id_usuario,
            programa_id: programaSeleccionado ? programaSeleccionado.id_programa : null,
            estado: true, // Por defecto activo
            fecha_creacion: currentDate,
            fecha_modificacion: currentDate
          };
          
          console.log('Datos a enviar al backend:', fichaData);
          
          // Intentar crear la ficha
          const result = await crearFicha(fichaData);
          console.log('Resultado de creación:', result);
          
          // Mostrar alerta de éxito
          setSuccessAlertText("La ficha fue creada correctamente.");
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        } catch (error) {
          console.error('Error al crear ficha:', error);
          setAlertTitle('Error');
          setAlertMessage(`Error al crear la ficha: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          setAlertConfirmFn(() => () => setAlertOpen(false));
          setAlertOpen(true);
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar la ficha:', error);
    }
  };

  // Eliminar ficha - Mantenemos la función aunque esté comentada en la UI para uso futuro
  const handleDelete = async (id: number) => {
    // Utilizamos la función setAlert para mostrar el diálogo de confirmación
    // Mostrar diálogo de confirmación para eliminar
    setAlertTitle('Confirmar eliminación');
    setAlertMessage('¿Estás seguro de que deseas eliminar esta ficha?');
    setAlertConfirmFn(() => async () => {
        try {
          await eliminarFicha(id);
          setSuccessAlertText('Ficha eliminada con éxito');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          setAlertOpen(false);
        } catch (error) {
          console.error("Error al eliminar la ficha:", error);
          setAlertTitle('Error');
          setAlertMessage(`Error al eliminar la ficha: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          setAlertConfirmFn(() => () => setAlertOpen(false));
          setAlertOpen(true);
        }
    });
    setAlertOpen(true);
  };

  // Abrir modal para crear nueva ficha
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar ficha existente
  const handleEdit = (ficha: Ficha) => {
    setFormData(ficha);
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
          ) : fichas && fichas.length > 0 ? (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
              <GlobalTable
                columns={columns}
                data={fichas
                  .map((ficha) => ({ ...ficha, key: ficha.id_ficha }))
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
          ) : (
            <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700">No se encontraron fichas. Intenta crear una nueva.</p>
              </div>
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
                    {editingId ? "Editar Ficha" : "Crear Nueva Ficha"}
                  </h2>
                  <Form
                    fields={formFields}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                    initialValues={{
                      id_ficha: formData.id_ficha?.toString() || '',
                      usuario_id: formData.usuario_id ? String(formData.usuario_id) : '',
                      programa_id: formData.programa_id ? String(formData.programa_id) : ''
                    }}
                    schema={fichaSchema}
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
        isOpen={alertOpen}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertConfirmFn}
        onCancel={() => setAlertOpen(false)}
        confirmText="Aceptar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default React.memo(Fichas);
