import { z } from 'zod';

export const caracteristicaSchema = z.object({
  placa_sena: z.boolean().optional(),
  descripcion: z.boolean().optional(),
  material_id: z.union([
    z.string().transform(val => parseInt(val, 10)),
    z.number(),
  ]),
});

export type CaracteristicaSchema = z.infer<typeof caracteristicaSchema>;