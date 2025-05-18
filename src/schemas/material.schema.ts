import { z } from 'zod';

export const materialSchema = z.object({
    codigo_sena: z.string().min(2, 'El código SENA es requerido'),
    nombre_material: z.string().min(1, 'El nombre del material es requerido'),
    descripcion_material: z.string().min(1, 'La descripción del material es requerida'),
    stock: z.number().min(1, 'El stock debe ser mayor o igual a 0'),
    unidad_medida: z.string().min(1, 'La unidad de medida es requerida'),
    imagen: z.string().min(1, 'La imagen es requerida'),
    estado: z.boolean().default(true),
    producto_perecedero: z.boolean().default(false),
    fecha_vencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),
    fecha_creacion: z.string().min(1, 'La fecha de creación es requerida'),
    fecha_modificacion: z.string().min(1, 'La fecha de modificación es requerida'),
    categoria_id: z.number().min(1, 'La categoría es requerida'),
    tipo_material_id: z.number().min(1, 'El tipo de material es requerido'),
    sitio_id: z.number().min(1, 'El sitio es requerido'),   
})

export type MaterialSchema = z.infer<typeof materialSchema>
