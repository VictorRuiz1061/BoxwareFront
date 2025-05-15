import React, { useState } from "react";

import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useGetFichas } from "@/hooks/fichas/useGetFichas";
import { usePostFicha } from "@/hooks/fichas/usePostFicha";
import { usePutFicha } from "@/hooks/fichas/usePutFicha";
import { useDeleteFicha } from "@/hooks/fichas/useDeleteFicha";
import { Ficha } from "@/types/ficha";
import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { useGetProgramas } from "@/hooks/programas/useGetProgramas";
import { fichaSchema } from "@/schemas/ficha.schema";

type Alert = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

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
  const [, setAlert] = useState<Alert>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

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
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (ficha) => (ficha.estado ? "Activo" : "Inactivo"),
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Última Modificación", filterable: true },
    {
      key: "acciones", // Cambiado de "actions" a "acciones" para cumplir con el tipo esperado
      label: "Acciones",
      render: (ficha) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(ficha)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(ficha.id_ficha)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
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
    { key: "estado", label: "Estado", type: "select", required: true, options: [
      { label: "Activo", value: "true" },
      { label: "Inactivo", value: "false" }
    ]},
  ];

  // Crear o actualizar ficha
  const handleSubmit = async (values: Record<string, string>) => {
    console.log('Form submitted with values:', values);
    try {
      // Validar que id_ficha sea un número válido
      if (!values.id_ficha || isNaN(Number(values.id_ficha))) {
        console.error('ID Ficha inválido:', values.id_ficha);
        alert('Por favor ingresa un ID de Ficha válido (número)');
        return;
      }
      
      // Validar que usuario_id sea un número válido
      if (!values.usuario_id || isNaN(Number(values.usuario_id))) {
        console.error('ID Usuario inválido:', values.usuario_id);
        alert('Por favor selecciona un usuario válido');
        return;
      }
      
      // Validar que programa_id sea un número válido
      if (values.programa_id && isNaN(Number(values.programa_id))) {
        console.error('ID Programa inválido:', values.programa_id);
        alert('Por favor selecciona un programa válido');
        return;
      }
      
      const usuarioSeleccionado = usuarios.find(u => u.id_usuario === Number(values.usuario_id));
      console.log('Usuario seleccionado:', usuarioSeleccionado);
      
      const programaSeleccionado = values.programa_id ? programas.find(p => p.id_programa === Number(values.programa_id)) : null;
      console.log('Programa seleccionado:', programaSeleccionado);
      
      if (!usuarioSeleccionado) {
        console.error('Usuario no encontrado para ID:', values.usuario_id);
        alert('Por favor selecciona un usuario válido.');
        return;
      }
      
      // Verificar que el token JWT esté presente para la autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token JWT disponible. La autenticación podría fallar.');
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        // Podríamos redirigir al login aquí
        return;
      }
      
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        await actualizarFicha(editingId, {
          id_ficha: editingId,
          usuario_id: usuarioSeleccionado.id_usuario,
          programa_id: programaSeleccionado ? programaSeleccionado.id_programa : null,
          estado: values.estado === "true",
          fecha_modificacion: currentDate
        });
        setAlert({
          isOpen: true,
          title: 'Éxito',
          message: 'Ficha actualizada con éxito',
          onConfirm: () => setAlert(a => ({ ...a, isOpen: false }))
        });
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
            estado: values.estado === "true",
            fecha_creacion: currentDate,
            fecha_modificacion: currentDate
          };
          
          console.log('Datos a enviar al backend:', fichaData);
          
          // Intentar crear la ficha
          const result = await crearFicha(fichaData);
          console.log('Resultado de creación:', result);
          
          // Mostrar alerta de éxito
          alert('Ficha creada con éxito');
        } catch (error) {
          console.error('Error al crear ficha:', error);
          alert('Error al crear la ficha. Revisa la consola para más detalles.');
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar la ficha:', error);
    }
  };

  // Eliminar ficha
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ficha?")) return;
    try {
      await eliminarFicha(id);
      setAlert({
        isOpen: true,
        title: 'Éxito',
        message: 'Ficha eliminada con éxito',
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false }))
      });
    } catch (error) {
      console.error("Error al eliminar la ficha:", error);
    }
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
          <h1 className="text-xl font-bold mb-4">Gestión de Fichas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Ficha
          </Boton>

          {loading ? (
            <p>Cargando fichas...</p>
          ) : fichas && fichas.length > 0 ? (
            <GlobalTable
              columns={columns}
              data={fichas.map((ficha) => ({ ...ficha, key: ficha.id_ficha }))}
              rowsPerPage={6}
            />
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">No se encontraron fichas. Intenta crear una nueva.</p>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
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
                    programa_id: formData.programa_id ? String(formData.programa_id) : '',
                    estado: formData.estado !== undefined ? String(formData.estado) : 'true'
                  }}
                  schema={fichaSchema}
                />
                <div className="flex justify-end mt-4">
                  <Boton
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cerrar
                  </Boton>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
};

export default React.memo(Fichas);
