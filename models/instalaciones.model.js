import { Schema, model } from "mongoose";

const schema = new Schema({
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'compras',
    },
    fecha: Date,
    trabajador: String,
});

export const Instalaciones = model('instalaciones', schema);