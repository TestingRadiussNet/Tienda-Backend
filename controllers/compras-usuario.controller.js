import { Router } from "express";

import * as bcrypt from "bcrypt";

import { ComprasUsuario } from "../models/compras-usuario.model.js";
import { ComprasUsuarioDetalles } from "../models/compras-usuario-detalles.model.js";
import { Productos } from "../models/producto.model.js";
import { Usuarios } from "../models/usuarios.model.js";
import { Instalaciones } from "../models/instalaciones.model.js";

import { EnviarCorreo } from "../services/email.service.js";
import { urlFrontend } from "../global/urls.js";
import { Tarjetas } from "../models/tarjetas.model.js";

export const ComprasUsuarioController = Router();

ComprasUsuarioController.post('/compras/:usuario/nueva', async (req, res) => {
    const usuarioID = req.params.usuario;
    const {datosCompra, requiereInstalacion, tarjeta, cvv} = req.body;

    try {
        const usuario = await Usuarios.findById(usuarioID);

        if (!usuario) {
            res.status(200).json({msg: 'Usuario no encontrado'});
            return;
        }

        for (const dc of datosCompra) {
            const producto = await Productos.findById(dc.producto._id);
            if (producto.disponible < dc.cantidad) {
                const nombre = producto.nombre;
                res.status(403).json({msg: `La cantidad de ${nombre} supera el stock disponible`});
                return;
            }
        }

        const tarjetaEncontrada = await Tarjetas.findById(tarjeta);

        if (!tarjetaEncontrada) {
            res.status(404).json({msg: 'No se ha encontrado una tarjeta'});
            return;
        }

        const esValida = await bcrypt.compare(cvv, tarjetaEncontrada.cvv);

        if (!esValida) {
            res.status(403).json({msg: 'La clave es inválida'});
            return;
        }

        const compra = await ComprasUsuario.create({
            usuario: usuarioID,
            fecha: new Date(),
            fechaEntrega: null,
            entregaPendiente: true,
            requiereInstalacion: requiereInstalacion ? true : false,
            total: 0
        });

        let totalAcumulador = 0;

        for await (const detalles of datosCompra) {
            let importe = detalles.producto.precioVenta * detalles.cantidad;
            const nuevo = await ComprasUsuarioDetalles.create({
                compra: compra._id,
                producto: detalles.producto._id,
                precioUnitario: detalles.producto.precioVenta,
                cantidad: detalles.cantidad,
                importe: importe,
            });
            const productoEncontrado = await Productos.findById(detalles.producto._id);
            productoEncontrado.disponible = Number(productoEncontrado.disponible) - Number(nuevo.cantidad);
            await productoEncontrado.save();

            totalAcumulador += importe;
        }

        compra.total = totalAcumulador;

        await compra.save();

        if (requiereInstalacion) {
            const instalacion = await Instalaciones.create({
                usuario: usuarioID,
                fecha: null,
                trabajador: null,
                estado: "solicitada",
            });

            await EnviarCorreo(usuario.correo, 'Compra Realizada', 
            `
                <h1>Compra realizada</h1>
                <p>Querido ${usuario.nombre}</p>
                <p>Su compra ha sido completada con éxito.</p>
                <p>Espere a que un trabajador programe la fecha de entrega</p>
                <p>Espere a que un trabajador programe la fecha de instalación</p>
                <a href="${urlFrontend}/mis-compras/${compra._id}">Visite aquí para ver la información de su compra, o acceda desde el apartado "Mis Compras" en la aplicación</a>
            `
            );
            res.status(201).json({msg: 'Compra realizada correctamente'});
        } else{
            await EnviarCorreo(usuario.correo, 'Compra Realizada', 
            `
                <h1>Compra realizada</h1>
                <p>Querido ${usuario.nombre}</p>
                <p>Su compra ha sido completada con éxito.</p>
                <p>Espere a que un trabajador programe la fecha de entrega</p>
                <a href="${urlFrontend}/mis-compras/${compra._id}">Visite aquí para ver la información de su compra, o acceda desde el apartado "Mis Compras" en la aplicación</a>
            `
            );
            res.status(201).json({msg: 'Compra realizada correctamente'});
        }
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});