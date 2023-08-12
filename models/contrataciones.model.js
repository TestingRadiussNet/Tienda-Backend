import { Schema, model } from "mongoose";

const schema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'servicios-internet',
    },
    tarjeta: {
        type: Schema.Types.ObjectId,
        ref: 'tarjetas',
    },
    activo: {
        type: Boolean,
        default: true,
    },
    precioMensual: Number,
    mesesContratados: Number,
    total: Number,
    fecha: Date,
    instalacionPendiente: {
        type: Boolean,
        default: true,
    }
});

export const Contrataciones = model('contrataciones', schema);