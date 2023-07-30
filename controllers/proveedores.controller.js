import { Router } from "express";

import { Proveedores } from "../models/proveedores.model.js";

export const ProveedoresController = Router();

ProveedoresController.post('/proveedores/nuevo', async (req, res) => {
    const datos = req.body;

   try {
    const encontrado = await Proveedores.findOne({nombre: datos.nombre});

    if (encontrado) {
        res.status(400).json({msg: 'Ya existe ese nombre'});
        return;
    }

    const nuevo = await Proveedores.create({
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: datos.telefono,
    });

    res.status(201).json({msg: 'Proveedor creado'});
   } catch (error) {
    console.log(e);
    res.status(500).json({msg: 'Hubo un error'});   
   } 
});
ProveedoresController.get('/proveedores/listado', async (req, res) => {
    try {
        const catalogo = await Proveedores.find({});

        res.status(201).json({data: catalogo});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});  
    }
});
ProveedoresController.patch('/proveedores/editar/:id', async (req, res) => {
    const id = req.params.id;
    const datos = req.body;
    
    try {
        const encontrado = await Proveedores.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'Proveedor no encontrado'})
            return;
        }

        Object.assign(encontrado, datos);
        await encontrado.save();

        res.status(200).json({msg: 'Proveedor editado'});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});        
    }
});
ProveedoresController.delete('/proveedores/eliminar/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const encontrado = await Proveedores.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'Proveedor no encontrado'})
            return;
        }

        if (encontrado.nombre == "Sin proveedor") {
            res.status(403).json({msg: 'No se puede eliminar este proveedor'});
            return;
        }

        await encontrado.deleteOne();

        res.status(200).json({msg: 'Proveedor eliminado'});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});