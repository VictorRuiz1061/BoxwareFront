import { z } from 'zod';

export const tipoMaterialSchema = z.object({ 

  id_tipo_material: z.number({ required_error: 'El id es requerido' }),

  tipo_elemento: z.string().min(3, 'El tipo de elemento es requerido'),

  estado: z.string().min(1, 'El estado es requerido'),

  fecha_creacion: z.string().min(1, 'La fecha de creación es requerida'),
  
  fecha_modificacion: z.string().min(1, 'La fecha de modificación es requerida'),
});

export type TipoMaterialSchema = z.infer<typeof tipoMaterialSchema>;
