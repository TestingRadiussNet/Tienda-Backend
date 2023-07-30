import { Schema, model } from "mongoose";

const schema = new Schema({
    nombre: String
});

export const Categorias = model('categorias', schema);