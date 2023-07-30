import { Schema, model } from "mongoose";

const schema = new Schema({
    nombre: String,
    descripcion: String,
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias'
    },
    precioVenta: Number,
    disponible: Number,
    slug: String,
    imagenHandle: String,
    imagenUrl: String,
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
})

export const Productos = model('productos', schema);