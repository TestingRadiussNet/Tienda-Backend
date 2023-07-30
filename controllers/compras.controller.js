import { Router, json } from "express";

import { Compras } from "../models/compras.model.js";
import { CompraDetalles } from "../models/compra-detalles.model.js";
import { Productos } from "../models/producto.model.js";

export const ComprasController = Router();

ComprasController.post('/compras/nueva', async (req, res) => {
    const {datosCompra} = req.body;

    try {
        const compra = await Compras.create({
            fecha: new Date(),
            total: 0,
        });

        let totalAcumulador = 0;

        for await (const detalles of datosCompra) {
            let importe = detalles.precioUnitario * detalles.cantidad;
            const nuevo = await CompraDetalles.create({
                compra: compra._id,
                proveedor: detalles.proveedor._id,
                producto: detalles.producto._id,
                precioUnitario: detalles.precioUnitario,
                cantidad: detalles.cantidad,
                importe: importe,
            });
            const productoEncontrado = await Productos.findById(detalles.producto._id);
            productoEncontrado.disponible = Number(productoEncontrado.disponible) + Number(detalles.cantidad),
            await productoEncontrado.save();
            totalAcumulador += importe;
        }

        compra.total = totalAcumulador;

        await compra.save();

        res.status(201).json({msg: 'Compra realizada correctamente'});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
ComprasController.get('/compras/listado', async (req, res) => {
    try {
        const catalogo = await Compras.find({});

        res.status(200).json({data: catalogo});
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});