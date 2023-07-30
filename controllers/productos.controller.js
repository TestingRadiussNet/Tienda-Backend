import { Router } from "express";
import slug from "slug";

import { Productos } from "../models/producto.model.js";
import { Categorias } from "../models/categorias.model.js";
export const ProductosController = Router();

ProductosController.post('/productos/nuevo', async (req, res) => {
    const datos = req.body;

    try {

        const categoriaEncontrada = await Categorias.findById(datos.categoria);
        if (!categoriaEncontrada) {
            res.status(404).json({msg: 'Categoría no encontrada'});
            return;
        }

        const milisegundosHoy = Date.now();
        const slugGenerado = slug(datos.nombre);

        const nuevo = await Productos.create({
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            categoria: datos.categoria,
            precioVenta: datos.precioVenta,
            disponible: datos.disponible,
            slug: `${milisegundosHoy}-${slugGenerado}`,
            imagenHandle: datos.imagenHandle,
            imagenUrl: datos.imagenUrl,
        });
        
        res.status(201).json({msg: 'Producto creado'});
    } catch(e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
ProductosController.patch('/productos/editar/:id', async (req, res) => {
    const id = req.params.id;
    const datos = req.body;
    try {

        const encontrado = await Productos.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'No encontrado'});
            return;
        }

        Object.assign(encontrado, datos);

        await encontrado.save();

        res.status(200).json({msg: 'Producto editado'});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
ProductosController.get('/productos/listado', async (req, res) => {
    try {
        const catalogo = await Productos.find({}).populate('categoria');

        res.status(200).json({data: catalogo});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
ProductosController.delete('/productos/inhabilitar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const encontrado = await Productos.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'No encontrado'});
            return;
        }

        encontrado.activo = false;

        await encontrado.save();

        res.status(200).json({msg: 'Producto inhabilitado'});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
ProductosController.put('/productos/habilitar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const encontrado = await Productos.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'No encontrado'});
            return;
        }

        encontrado.activo = true;

        await encontrado.save();

        res.status(200).json({msg: 'Producto habilitado'});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});
    }
});