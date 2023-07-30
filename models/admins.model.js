import { Schema, model } from "mongoose";

const schema = new Schema({
    correo: String,
    contrasena: String,
    token: String
})

export const Admins = model('admins', schema);