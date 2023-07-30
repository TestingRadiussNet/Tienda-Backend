import { Schema, model } from "mongoose";

const schema = new Schema({
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'proveedores'
    },
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'compras'
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'productos'
    },
    precioUnitario: Number,
    cantidad: Number,
    importe: Number,
})

export const CompraDetalles = model('compra-detalles', schema);