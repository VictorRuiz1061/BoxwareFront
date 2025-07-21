import { z } from 'zod';

export const caracteristicaSchema = z.object({
//   id_caracteristica: z.number(),
  placa_sena: z.boolean().optional(),
  descripcion: z.boolean().optional(),
  material_id: z.union([
    z.string().transform(val => parseInt(val)),
    z.number()
  ]).optional(),
});

export type CaracteristicaSchema = z.infer<typeof caracteristicaSchema>;