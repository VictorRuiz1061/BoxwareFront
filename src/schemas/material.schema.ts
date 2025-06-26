import { z } from 'zod';

// Schema base para validación de campos comunes
const baseSchema = {
    nombre_material: z.string().min(1, 'El nombre del material es requerido'),
    descripcion_material: z.string().min(1, 'La descripción del material es requerida'),
    unidad_medida: z.string().min(1, 'La unidad de medida es requerida'),
    imagen: z.string().optional(),
    producto_perecedero: z.string().optional(),
    fecha_vencimiento: z.string().optional(),
    categoria_id: z.string().min(1, 'La categoría es requerida'),
    tipo_material_id: z.string().min(1, 'El tipo de material es requerido')
};

// Schema para creación (incluye código SENA)
export const materialCreateSchema = z.object({
    ...baseSchema,
    codigo_sena: z.string().min(2, 'El código SENA es requerido'),
});

// Schema para edición (no requiere código SENA)
export const materialEditSchema = z.object({
    ...baseSchema
});

// Schema general que puede usarse para ambos casos
export const materialSchema = z.object({
    ...baseSchema,
    codigo_sena: z.string().optional(),
    estado: z.boolean().optional()
})

export type MaterialSchema = z.infer<typeof materialSchema>
