import { Router } from "express";

import { Categorias } from "../models/categorias.model.js";
import { Productos } from "../models/producto.model.js";

export const CategoriasController = Router();

CategoriasController.post('/categorias/nuevo', async (req, res) => {
    const datos = req.body;

    try {
    const encontrado = await Categorias.findOne({nombre: datos.nombre});

    if (encontrado) {
        res.status(400).json({msg: 'Ya existe ese nombre'});
        return;
    }

    const nuevo = await Categorias.create({
        nombre: datos.nombre,
    });

    res.status(201).json({msg: 'Categoria creada'});
   } catch (error) {
    console.log(e);
    res.status(500).json({msg: 'Hubo un error'});   
   } 
});
CategoriasController.get('/categorias/listado', async (req, res) => {
    try {
        const catalogo = await Categorias.find({});

        res.status(201).json({data: catalogo});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});  
    }
});
CategoriasController.patch('/categorias/editar/:id', async (req, res) => {
    const id = req.params.id;
    const datos = req.body;
    
    try {
        const encontrado = await Categorias.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'Categoría no encontrada'})
            return;
        }

        Object.assign(encontrado, datos);
        await encontrado.save();

        res.status(200).json({msg: 'Categoría editada'});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});        
    }
});
CategoriasController.delete('/categorias/eliminar/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const encontrado = await Categorias.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'Categoría no encontrada'})
            return;
        }

        if (encontrado.nombre == "Sin categoria" || encontrado.nombre == "Otros") {
            res.status(403).json({msg: 'No se puede eliminar esta categoría'});
            return;
        }

        const productosConLaMismaCategoria = await Productos.find({
            categoria: id
        });

        if (productosConLaMismaCategoria.length) {
            res.status(403).json({msg: 'Existen productos con esta categoría'});
            return;
        }

        await encontrado.deleteOne();

        res.status(200).json({msg: 'Categoría eliminada'});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});