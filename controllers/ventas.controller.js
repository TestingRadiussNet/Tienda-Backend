import { Router, json } from "express";

import { ComprasUsuario } from "../models/compras-usuario.model.js";
import { ComprasUsuarioDetalles } from "../models/compras-usuario-detalles.model.js";

export const VentasController = Router();

VentasController.get('/ventas/listado', async (req, res) => {
    try {
        const catalogo = await ComprasUsuario.find({}).sort({ _id: -1 }).populate('usuario');

        res.status(200).json({data: catalogo});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
VentasController.get('/ventas/detalles/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const compra = await ComprasUsuario.findById(id);
        if (!compra) return res.status(404).json({msg: 'No encontrado'});
        const detalles = await ComprasUsuarioDetalles.find({compra: id}).populate('producto');

        res.status(200).json({data: detalles});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});