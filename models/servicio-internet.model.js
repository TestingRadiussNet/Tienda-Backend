import { Schema, model } from "mongoose";

const schema = new Schema({
    nombre: String,
    gb: Number,
    velocidadDescargaMbps: Number,
    dispositivosSimultaneos: Number,
    precioMensual: Number,
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const ServiciosInternet = model('servicios-internet', schema);