import { Schema, model } from "mongoose";

const schema = new Schema({
    contratacion: {
        type: Schema.Types.ObjectId,
        ref: 'contrataciones',
    },
    fecha: Date,
    trabajador: String,
});

export const InstalacionesInternet = model('instalaciones-internet', schema);