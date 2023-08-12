import { Router } from "express";

import { ComprasUsuario } from "../models/compras-usuario.model.js";

import { Entregas } from "../models/entregas.model.js";

import { EnviarCorreo } from "../services/email.service.js";
import { Instalaciones } from "../models/instalaciones.model.js";

export const TareasController = Router();

TareasController.get('/tareas/entregas-pendientes', async (req, res) => {
    try {
        const lista = ComprasUsuario.find({
            entregaPendiente: true,
        });

        res.status(200).json({data: lista});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
TareasController.get('/tareas/instalaciones-pendientes', async (req, res) => {
    try {
        const lista = ComprasUsuario.find({
            entregaPendiente: false,
            requiereInstalacion: true,
        });

        res.status(200).json({data: lista});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
TareasController.post('/tareas/programar-fecha-entrega/:id', async (req, res) => {
    const idCompra = req.params.id;
    const datos = req.body;

    try {
        const compra = await ComprasUsuario.findById(idCompra).populate('usuario');

        const entrega = await Entregas.create({
            compra: compra._id,
            fecha: datos.fecha,
        });
        
        compra.entregaPendiente = false;

        await compra.save();

        await EnviarCorreo(compra.usuario.correo, 'Fecha de Entrega', 
        `
            <p>Su compra con id ${compra._id} será entregada en la siguiente fecha:</p>
            <p>${datos.fecha}</p>
        `
        );

        res.status(200).json({msg: 'Entrega programada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
TareasController.post('/tareas/programar-fecha-instalacion/:id', async (req, res) => {
    const datos = req.body;
    const idCompra = req.params.id;

    try {
        const compra = await ComprasUsuario.findById(idCompra).populate('usuario');

        const instalacion = await Instalaciones.findOne({
            compra: compra._id,
        });

        instalacion.fecha = datos.fecha;
        instalacion.trabajador = datos.trabajador;

        await instalacion.save();

        await EnviarCorreo(compra.usuario.correo, 'Fecha de instalación', 
        `
            <p>Su compra con id ${compra._id} será instalada en la siguiente fecha: ${datos.fecha}</p>
            <p>Trabajador a cargo de la instalación: ${datos.trabajador}</p>
        `
        );

        res.status(200).json({msg: 'Instalación programada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});