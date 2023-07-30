import { Schema, model } from "mongoose";

const schema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
    },
    propietario: String,
    mesExpiracion: String,
    anioExpiracion: String,
    numeroTarjeta: String,
    cvv: String,
});

export const Tarjetas = model('tarjetas', schema);