import { z } from 'zod';

export const rolSchema = z.object({
  nombre_rol: z.string()
    .min(5, 'El nombre del rol debe tener al menos 5 caracteres')
    .max(50, 'El nombre del rol no puede tener más de 50 caracteres'),
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(200, 'La descripción no puede tener más de 200 caracteres'),
  estado: z.enum(['Activo', 'Inactivo'], {
    errorMap: () => ({ message: 'Debe seleccionar un estado válido' })
  }),
  fecha_creacion: z.string().min(4, 'Debe ingresar una fecha de creación'),
});

export type RolSchema = z.infer<typeof rolSchema>;
