import { useState } from "react";
import { Pencil } from "lucide-react";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";
import { Alert } from "@heroui/react";
import { useGetFichas } from "@/hooks/fichas/useGetFichas";
import { usePostFicha } from "@/hooks/fichas/usePostFicha";
import { usePutFicha } from "@/hooks/fichas/usePutFicha";
import { Ficha } from "@/types/ficha";
import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { useGetProgramas } from "@/hooks/programas/useGetProgramas";
import { fichaSchema } from "@/schemas/ficha.schema";

const Fichas = () => {
  const { fichas, loading } = useGetFichas();
  const { crearFicha } = usePostFicha();
  const { actualizarFicha } = usePutFicha();
  const { usuarios } = useGetUsuarios();
  const { programas } = useGetProgramas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Ficha>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

const columns = [
  {
    key: "id_ficha",
    label: "ID",
    filterable: true,
  },
  {
    key: "usuario_id",
    label: "Usuario",
    filterable: true,
    render: (ficha) => {
      // Check if ficha has a nested usuario object
      if (ficha.usuario && ficha.usuario.nombre && ficha.usuario.apellido) {
        return (
          <div className="flex flex-col">
            <span className="font-medium text-blue-700">
              {ficha.usuario.nombre} {ficha.usuario.apellido}
            </span>
            <span className="text-xs text-gray-500">ID: {ficha.usuario.id_usuario}</span>
          </div>
        );
      }
      
      // Fallback to the previous approach
      const usuario = usuarios.find((u) => u.id_usuario === ficha.usuario_id);
      if (usuario && usuario.nombre && usuario.apellido) {
        return (
          <div className="flex flex-col">
            <span className="font-medium text-blue-700">
              {usuario.nombre} {usuario.apellido}
            </span>
            <span className="text-xs text-gray-500">ID: {ficha.usuario_id}</span>
          </div>
        );
      }
      
      return <span className="text-gray-500">ID: {ficha.usuario_id || 'No asignado'}</span>;
    },
  },
  {
    key: "programa_id",
    label: "Programa",
    filterable: true,
    render: (ficha) => {
      // Check if ficha has a nested programa object
      if (ficha.programa && ficha.programa.nombre_programa) {
        return (
          <div className="flex flex-col">
            <span className="font-medium text-green-700">{ficha.programa.nombre_programa}</span>
            <span className="text-xs text-gray-500">ID: {ficha.programa.id_programa}</span>
          </div>
        );
      }
      
      // Fallback to the previous approach
      const programa = programas.find((p) => p.id_programa === ficha.programa_id);
      if (programa && programa.nombre_programa) {
        return (
          <div className="flex flex-col">
            <span className="font-medium text-green-700">{programa.nombre_programa}</span>
            <span className="text-xs text-gray-500">ID: {ficha.programa_id}</span>
          </div>
        );
      }
      
      return <span className="text-gray-500">ID: {ficha.programa_id || 'No asignado'}</span>;
    },
  },
  {
    key: "estado",
    label: "Estado",
    filterable: true,
    render: (ficha) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          ficha.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {ficha.estado ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    key: "acciones",
    label: "Acciones",
    render: (ficha) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(ficha)}
          className="p-1 text-blue-600 hover:text-blue-800"
        >
          <Pencil size={18} />
        </button>
      </div>
    ),
  },
];

  // Form fields are now defined directly in the HTML form

  const handleSubmit = async (values: Record<string, any>) => {
    console.log('Form submitted with values:', values);
    try {
      const parsed = fichaSchema.safeParse(values);
      if (!parsed.success) {
        console.error('Validation failed:', parsed.error.errors);
        setSuccessAlertText(parsed.error.errors.map((e) => e.message).join("\n"));
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const usuario = Number(values.usuario_id);
      const usuarioSeleccionado = usuarios.find(u => u.id_usuario === usuario);
      if (!usuarioSeleccionado) {
        console.error('Usuario no encontrado:', usuario, 'Available usuarios:', usuarios);
        setSuccessAlertText('Por favor selecciona un usuario válido');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      if (!values.id_ficha || isNaN(Number(values.id_ficha))) {
        console.error('ID Ficha inválido:', values.id_ficha);
        setSuccessAlertText('Por favor ingresa un ID de Ficha válido (número)');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }

      const programaId = Number(values.programa_id);
      const programaSeleccionado = programas.find(p => p.id_programa === programaId);
      
      if (!programaSeleccionado) {
        console.error('Programa no encontrado:', programaId, 'Available programas:', programas);
        setSuccessAlertText('Por favor selecciona un programa válido');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      if (editingId) {
        console.log('Actualizando ficha con ID:', editingId);
        
        const fechaActual = new Date().toISOString().slice(0, 10);
        const payload = {
          id_ficha: editingId,
          usuario_id: usuario,
          programa: programaId, // Cambiado a 'programa' según el error del backend
          estado: true,
          fecha_creacion: fechaActual,
          fecha_modificacion: fechaActual
        };
        
        console.log('Payload para actualización (simplificado):', payload);
        
        try {
          const result = await actualizarFicha(editingId, payload);
          console.log('Resultado de actualización:', result);
          setSuccessAlertText('Ficha actualizada con éxito');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          setIsModalOpen(false);
          setFormData({});
          setEditingId(null);
        } catch (updateError: any) {
          console.error('Error al actualizar ficha:', updateError);
          if (updateError.response?.data) {
            console.error('Detalles del error:', JSON.stringify(updateError.response.data));
            // Mostrar mensaje de error más detallado si está disponible
            const errorMessage = updateError.response.data.message 
              ? (Array.isArray(updateError.response.data.message) 
                ? updateError.response.data.message.join(', ') 
                : updateError.response.data.message)
              : 'Error desconocido';
            setSuccessAlertText("Error al actualizar la ficha: " + errorMessage);
          } else {
            setSuccessAlertText("Error al actualizar la ficha: " + (updateError.message || 'Error desconocido'));
          }
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        }
      } else {
        console.log('Creando nueva ficha con ID:', values.id_ficha);
        
        const fechaActual = new Date().toISOString().slice(0, 10);
        const payload = {
          id_ficha: Number(values.id_ficha),
          usuario_id: usuario,
          programa: programaId, // Cambiado de programa_id a programa según el error
          estado: true,
          fecha_creacion: fechaActual,
          fecha_modificacion: fechaActual
        };
        
        console.log('Payload para creación (simplificado):', payload);
        
        try {
          
          const result = await crearFicha(payload);
          console.log('Resultado de creación:', result);
          setSuccessAlertText("La ficha fue creada correctamente.");
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
          setIsModalOpen(false);
          setFormData({});
          setEditingId(null);
        } catch (createError: any) {
          console.error('Error al crear ficha:', createError);
          if (createError.response?.data) {
            console.error('Detalles del error:', JSON.stringify(createError.response.data));
            // Mostrar mensaje de error más detallado si está disponible
            const errorMessage = createError.response.data.message 
              ? (Array.isArray(createError.response.data.message) 
                ? createError.response.data.message.join(', ') 
                : createError.response.data.message)
              : 'Error desconocido';
            setSuccessAlertText("Error al crear la ficha: " + errorMessage);
          } else {
            setSuccessAlertText("Error al crear la ficha: " + (createError.message || 'Error desconocido'));
          }
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        }
      }
    } catch (error: any) {
      console.error('Error general en handleSubmit:', error);
      setShowSuccessAlert(true);
      setSuccessAlertText("Error al procesar el formulario: " + (error.message || 'Error desconocido'));
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleToggleEstado = async (ficha: Ficha) => {
    try {
      console.log('Cambiando estado de ficha:', ficha);
      const nuevoEstado = !ficha.estado;

      const updateData = {
        id_ficha: ficha.id_ficha,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      console.log('Payload para toggle estado:', updateData);
      const result = await actualizarFicha(ficha.id_ficha, updateData);
      console.log('Resultado de toggle estado:', result);
      
      setSuccessAlertText(`La ficha fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      console.error('Detalles del error:', error.response?.data);
      setSuccessAlertText("Error al cambiar el estado de la ficha: " + (error.message || 'Error desconocido'));
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ficha: Ficha) => {
    setFormData(ficha);
    setEditingId(ficha.id_ficha);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Fichas</h1>
          <Boton onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Ficha
          </Boton>

          {loading ? (
            <p>Cargando fichas...</p>
          ) : (
              <GlobalTable
                columns={columns as Column<any> [] }
                data={fichas
                  .map((c => ({ ...c, key: c.id_ficha })))
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
                    {editingId ? "Editar Ficha" : "Crear Nueva Ficha"}
                  </h2>
                  
                  {/* Form using traditional HTML form for direct submission */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const values = {
                      id_ficha: formData.get('id_ficha'),
                      usuario_id: formData.get('usuario_id'),
                      programa_id: formData.get('programa_id')
                    };
                    console.log('Direct form submission with values:', values);
                    handleSubmit(values as Record<string, any>);
                  }} className="flex flex-col gap-4 p-4 border rounded-lg shadow-md bg-white">
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">ID Ficha</label>
                      <input 
                        type="number" 
                        name="id_ficha" 
                        required 
                        defaultValue={formData.id_ficha?.toString() || ''}
                        className="border p-2 rounded"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">Usuario</label>
                      <select 
                        name="usuario_id" 
                        required 
                        defaultValue={formData.usuario_id ? String(formData.usuario_id) : ''}
                        className="border p-2 rounded"
                      >
                        <option value="">Seleccione...</option>
                        {usuarios.map(u => (
                          <option key={u.id_usuario} value={u.id_usuario}>
                            {u.nombre} {u.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700">Programa</label>
                      <select 
                        name="programa_id" 
                        required 
                        defaultValue={formData.programa_id ? String(formData.programa_id) : ''}
                        className="border p-2 rounded"
                      >
                        <option value="">Seleccione...</option>
                        {programas.map(p => (
                          <option key={p.id_programa} value={p.id_programa}>
                            {p.nombre_programa}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        {editingId ? "Actualizar" : "Crear"}
                      </button>
                    </div>
                  </form>
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
    </>
  );
};

export default Fichas;
