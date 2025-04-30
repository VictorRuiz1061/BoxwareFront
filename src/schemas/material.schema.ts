import { z } from 'zod';

export const materialSchema = z.object({
  id_material: z.number({ required_error: 'El id es requerido' }),

  codigo_sena: z.string().min(1, 'El código SENA es requerido'),

  nombre_material: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no puede tener más de 100 caracteres'),

  descripcion_material: z.string().min(3, 'La descripción es requerida'),

  stock: z.number({ required_error: 'El stock es requerido' }),

  unidad_medida: z.string().min(1, 'La unidad de medida es requerida'),

  fecha_vencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),

  producto_perecedero: z.boolean({ required_error: 'Debe indicar si es perecedero' }),

  fecha_creacion: z.string().min(1, 'La fecha de creación es requerida'),

  fecha_modificacion: z.string().min(1, 'La fecha de modificación es requerida'),

  categoria_id: z.number({ required_error: 'El id de categoría es requerido' }),

  tipo_material_id: z.number({ required_error: 'El id de tipo de material es requerido' }),
  
  sitio_id: z.number({ required_error: 'El id de sitio es requerido' }),
});

export type MaterialSchema = z.infer<typeof materialSchema>;
