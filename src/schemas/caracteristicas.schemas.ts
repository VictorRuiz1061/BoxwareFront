import { z } from 'zod';

export const caracteristicaSchema = z.object({
//   id_caracteristica: z.number(),
  material_id: z.union([
    z.string().transform(val => parseInt(val)),
    z.number()
  ]).refine((val) => val > 0, {
    message: "El ID del material debe ser un número positivo"
  }),
  placa_sena: z.boolean().optional().default(false),
  descripcion: z.boolean().optional().default(false),
});

export type CaracteristicaSchema = z.infer<typeof caracteristicaSchema>;