import { z } from 'zod';

export const inventarioSchema = z.object({
//   id_inventario: z.number(),
  stock: z.number(),
  sitio_id: z.number(),
  material_id: z.number(),
  placa_sena: z.string().optional(),
  descripcion: z.string().optional(),
});

export type InventarioSchema = z.infer<typeof inventarioSchema>;