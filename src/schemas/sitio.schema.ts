import { z } from 'zod';

export const sitioSchema = z.object({
  sede_id: z.number({ required_error: 'El id de sede es requerido' }),
  id_sitio: z.number({ required_error: 'El id de sitio es requerido' }),
  nombre_sitio: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre no puede tener más de 100 caracteres'),
  ubicacion: z.string().min(3, 'La ubicación es requerida'),
  fecha_creacion: z.string().min(1, 'La fecha de creación es requerida'),
  fecha_modificacion: z.string().min(1, 'La fecha de modificación es requerida'),
  ficha_tecnica: z.string().min(1, 'La ficha técnica es requerida'),
  persona_encargada_id: z.number({ required_error: 'El id de persona encargada es requerido' }),
  tipo_sitio_id: z.number({ required_error: 'El id de tipo de sitio es requerido' }),
});

export type SitioSchema = z.infer<typeof sitioSchema>;
