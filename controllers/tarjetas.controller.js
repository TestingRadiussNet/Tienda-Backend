import { Router } from "express";

import * as bcrypt from "bcrypt";

import { Tarjetas } from "../models/tarjetas.model.js";
import { Usuarios } from "../models/usuarios.model.js";
import mongoose from "mongoose";

export const TarjetasController = Router();

TarjetasController.post('/tarjetas/:usuario/nueva', async (req, res) => {
    const usuarioID = req.params.usuario;
    const datos = req.body;
    
    try {
        const usuarioEncontrado = await Usuarios.findById(usuarioID);

        if (!usuarioEncontrado) {
            res.status(404).json({msg: "Usuario no encontrado"});
            return;
        }
        
        const encontrado = await Tarjetas.findOne({
            numeroTarjeta: datos.numeroTarjeta,
        });

        console.log(encontrado); 

        if (encontrado) {
            res.status(400).json({msg: "Ya tienes una tarjeta con datos similares"});
            return;
        }

        const cvvHasheado = await bcrypt.hash(datos.cvv, 10);

        const nuevo = await Tarjetas.create({
            usuario: usuarioEncontrado._id,
            propietario: datos.propietario,
            mesExpiracion: datos.mesExpiracion,
            anioExpiracion: datos.anioExpiracion,
            numeroTarjeta: datos.numeroTarjeta,
            cvv: cvvHasheado,
        });

        res.status(201).json({msg: "Tarjeta agregada"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }
});
TarjetasController.get('/tarjetas/:usuario/listado', async (req, res) => {
    const usuarioID = req.params.usuario;

    try {
        const usuarioEncontrado = await Usuarios.findById(usuarioID);

        if (!usuarioEncontrado) {
            res.status(404).json({msg: "Usuario no encontrado"});
            return;
        }
        const lista = await Tarjetas.find({usuario: usuarioEncontrado.id});

        res.status(200).json({data: lista});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }
});
TarjetasController.delete('/tarjetas/eliminar/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const encontrado = await Tarjetas.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: "No encontrado"});
        }

        await encontrado.deleteOne();

        res.status(200).json({msg: "Tarjeta eliminada"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }
});
TarjetasController.patch('/tarjetas/editar/:id', async (req, res) => {
    const id = req.params.id;
    const datos = req.body;

    try {
        const encontrado = await Tarjetas.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: "Tarjeta no encontrada"});
            return;
        }

        let cvv = encontrado.cvv;

        if (datos.cvv) {
            const nuevoCvv = await bcrypt.hash(datos.cvv, 10);
            cvv = nuevoCvv;
        }

        Object.assign(encontrado, {...datos, cvv: cvv});

        await encontrado.save();

        res.status(200).json({msg: "Tarjeta editada correctamente"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }
});