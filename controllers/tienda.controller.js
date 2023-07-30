import { Router } from "express";

import { Productos } from "../models/producto.model.js";
import { ServiciosInternet } from "../models/servicio-internet.model.js";

export const TiendaController = Router();

TiendaController.get('/tienda/productos', async (req, res) => {
    try {
        const catalogo = await Productos.find({
            activo: true
        }).populate('categoria');

        res.status(200).json({data: catalogo});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
TiendaController.get('/tienda/producto/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        const encontrado = await Productos.findOne({slug: slug}).populate('categoria');

        if (!encontrado) {
            res.status(404).json({msg: 'Producto no encontrado'});
            return;
        }

        res.status(200).json({data: encontrado});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
TiendaController.get('/tienda/servicios', async (req, res) => {
    try {
        const catalogo = await ServiciosInternet.find({
            activo: true,
        });

        res.status(200).json({data: catalogo});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
TiendaController.get('/tienda/servicio/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const encontrado = await ServiciosInternet.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'No encontrado'});
            return;
        }

        res.status(200).json({data: encontrado});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});