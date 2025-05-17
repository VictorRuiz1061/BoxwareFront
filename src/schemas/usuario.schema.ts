import { z } from 'zod';

export const usuarioSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 5 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  apellido: z.string()
    .min(3, 'El apellido debe tener al menos 5 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  edad: z.union([z.string(), z.number()])
    .refine(val => !isNaN(Number(val)), { message: 'La edad debe ser un número' })
    .refine(val => Number(val) >= 10 && Number(val) <= 120, { message: 'La edad debe estar entre 10 y 120 años' }),
  cedula: z.string()
    .min(5, 'La cédula debe tener al menos 5 caracteres')
    .max(20, 'La cédula no puede tener más de 20 caracteres'),
  email: z.string().email('Email inválido'),
  contrasena: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(32, 'La contraseña no puede tener más de 32 caracteres'),
  telefono: z.string()
    .min(7, 'El teléfono debe tener al menos 7 caracteres')
    .max(15, 'El teléfono no puede tener más de 15 caracteres'),
  rol_id: z.union([z.string(), z.number()]).refine(val => !isNaN(Number(val)), {
    message: 'Debe seleccionar un rol válido',
  }),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>; 