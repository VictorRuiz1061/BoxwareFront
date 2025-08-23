import { useState } from 'react';
import { showSuccessToast, showErrorToast } from '@/components/atomos';

export interface EntityConfig<T> {
  entityName: string;
  idField: keyof T;
  createFunction: (data: any) => Promise<any>;
  updateFunction: (id: number, data: any) => Promise<any>;
  getDataFunction: () => { data: T[]; loading: boolean };
  schema?: any;
  defaultValues?: Record<string, any>;
  transformCreateData?: (values: Record<string, string>) => any;
  transformUpdateData?: (values: Record<string, string>, editingId: number) => any;
  onSuccess?: (action: 'create' | 'update' | 'toggle', data?: any) => void;
}

export interface UseEntityManagerReturn<T> {
  // Estado
  isModalOpen: boolean;
  isSubModalOpen: boolean;
  editingId: number | null;
  formData: Record<string, string>;
  
  // Funciones
  handleSubmit: (values: Record<string, string>) => Promise<void>;
  handleToggleEstado: (entity: T) => Promise<void>;
  handleCreate: () => void;
  handleEdit: (entity: T) => void;
  handleCloseModal: () => void;
  handleOpenSubModal: () => void;
  handleCloseSubModal: () => void;
  setFormData: (data: Record<string, string>) => void;
}

export function useEntityManager<T extends Record<string, any>>(
  config: EntityConfig<T>
): UseEntityManagerReturn<T> {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();

      if (editingId) {
        // Actualizar entidad existente
        const updatePayload = config.transformUpdateData 
          ? config.transformUpdateData(values, editingId)
          : {
              [config.idField]: editingId,
              ...values,
              estado: true,
              fecha_modificacion: currentDate,
            };

        await config.updateFunction(editingId, updatePayload);
        showSuccessToast(`${config.entityName} actualizado con éxito`);
        config.onSuccess?.('update', updatePayload);
      } else {
        // Crear nueva entidad
        const createPayload = config.transformCreateData 
          ? config.transformCreateData(values)
          : {
              ...values,
              estado: true,
              fecha_creacion: currentDate,
              fecha_modificacion: currentDate,
            };

        await config.createFunction(createPayload);
        showSuccessToast(`${config.entityName} creado con éxito`);
        config.onSuccess?.('create', createPayload);
      }

      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast(`Error al guardar ${config.entityName.toLowerCase()}`);
    }
  };

  const handleToggleEstado = async (entity: T) => {
    try {
      const nuevoEstado = !entity.estado;
      const updateData = {
        [config.idField]: entity[config.idField],
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      await config.updateFunction(entity[config.idField] as number, updateData);
      showSuccessToast(`El ${config.entityName.toLowerCase()} fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      config.onSuccess?.('toggle', updateData);
    } catch (error) {
      showErrorToast(`Error al cambiar el estado del ${config.entityName.toLowerCase()}.`);
    }
  };

  const handleCreate = () => {
    setFormData(config.defaultValues || {});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entity: T) => {
    const editData: Record<string, string> = {};
    
    // Convertir todos los valores a string para el formulario
    Object.keys(entity).forEach(key => {
      const value = entity[key];
      if (value !== null && value !== undefined) {
        editData[key] = typeof value === 'object' ? value.toString() : String(value);
      }
    });

    setFormData(editData);
    setEditingId(entity[config.idField] as number);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleOpenSubModal = () => {
    setIsSubModalOpen(true);
  };

  const handleCloseSubModal = () => {
    setIsSubModalOpen(false);
  };

  return {
    isModalOpen,
    isSubModalOpen,
    editingId,
    formData,
    handleSubmit,
    handleToggleEstado,
    handleCreate,
    handleEdit,
    handleCloseModal,
    handleOpenSubModal,
    handleCloseSubModal,
    setFormData,
  };
} 