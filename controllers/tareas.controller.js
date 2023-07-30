import { Router } from "express";

import { ComprasUsuario } from "../models/compras-usuario.model.js";

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

});
TareasController.post('/tareas/programar-fecha-instalacion/:id', async (req, res) => {

});