import { Schema, model } from "mongoose";

const schema = new Schema({
    nombre: String,
    paterno: String,
    materno: String,
    correo: String,
    telefono: String,
    contrasena: String,
    token: String,
});

export const Usuarios = model('usuarios', schema);