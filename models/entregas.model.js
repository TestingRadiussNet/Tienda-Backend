import { Schema, model } from "mongoose";

const schema = new Schema({
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'compras-usuario',
    },
    fecha: Date,
});

export const Entregas = model('entregas', schema);