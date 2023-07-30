import { Schema, model } from "mongoose";

const schema = new Schema({
    total: Number,
    fecha: Date,
});

export const Compras = model('compras', schema);