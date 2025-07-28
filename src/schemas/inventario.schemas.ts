import { z } from 'zod';

export const inventarioSchema = z.object({
  stock: z.string().min(1, 'Debe ingresar un stock'),
  sitio_id: z.string().min(1, 'Debe seleccionar un sitio'),
  material_id: z.string().min(1, 'Debe seleccionar un material'),
  placa_sena: z.string().optional(),
  descripcion: z.string().optional(),
});

export type InventarioSchema = z.infer<typeof inventarioSchema>;