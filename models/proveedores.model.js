import { Schema, model } from "mongoose";

const schema = new Schema({
    nombre: String,
    telefono: String,
    correo: String,
});

export const Proveedores = model('proveedores', schema);