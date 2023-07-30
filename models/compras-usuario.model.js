import { Schema, model } from "mongoose";

const schema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
    },
    total: Number,
    fecha: Date,
    fechaEntrega: Date,
    entregaPendiente: {
        type: Boolean,
        default: true,
    },
    requiereInstalacion: {
        type: Boolean,
        default: false,
    },
});

export const ComprasUsuario = model('compras-usuario', schema);