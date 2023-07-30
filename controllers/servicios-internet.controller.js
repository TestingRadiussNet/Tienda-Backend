import { Router } from "express";
import { ServiciosInternet } from "../models/servicio-internet.model.js";

export const ServiciosInternetController = Router();

ServiciosInternetController.post('/internet/nuevo', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await ServiciosInternet.findOne({
            nombre: {
                $regex: datos.nombre,
                $options: "i",
            }
        });

        if (encontrado) {
            res.status(400).json({msg: "Ya existe ese nombre"});
            return;
        }

        const nuevo = await ServiciosInternet.create({
            nombre: datos.nombre,
            gb: datos.gb,
            velocidadDescargaMbps: datos.velocidadDescargaMbps,
            dispositivosSimultaneos: datos.dispositivosSimultaneos,
            precioMensual: datos.precioMensual,
        });

        res.status(201).json({msg: "Servicio Creado"});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
ServiciosInternetController.get('/internet/listado', async (req, res) => {
    try {
        const catalogo = await ServiciosInternet.find({});

        res.status(200).json({data: catalogo});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
ServiciosInternetController.patch('/internet/editar/:id', async (req, res) => {
    const id = req.params.id;
    const datos = req.body;
    try {
        const encontrado = await ServiciosInternet.findById(id);
        if (!encontrado) {
            res.status(404).json({msg: "No encontrado"});
            return;
        }

        Object.assign(encontrado, datos);

        await encontrado.save();

        res.status(200).json({msg: "Servicio de Internet Actualizado"});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
ServiciosInternetController.patch('/internet/activar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const encontrado = await ServiciosInternet.findById(id);
        if (!encontrado) {
            res.status(404).json({msg: "No encontrado"});
            return;
        }

        encontrado.activo = true;

        await encontrado.save();

        res.status(200).json({msg: "Servicio de internet activado"});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
ServiciosInternetController.delete('/internet/desactivar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const encontrado = await ServiciosInternet.findById(id);
        if (!encontrado) {
            res.status(404).json({msg: "No encontrado"});
            return;
        }

        encontrado.activo = false;

        await encontrado.save();

        res.status(200).json({msg: "Servicio de internet desactivado"});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});