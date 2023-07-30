import { Schema, model } from "mongoose";

const schema = new Schema({
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'compras-usuario',
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'productos',
    },
    precioUnitario: Number,
    cantidad: Number,
    importe: Number,
});

export const ComprasUsuarioDetalles = model('compras-usuario-detalles', schema);