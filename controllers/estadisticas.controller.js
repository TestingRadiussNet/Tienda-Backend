import { Router } from "express";

import { Categorias } from "../models/categorias.model.js";
import { ComprasUsuario } from "../models/compras-usuario.model.js";
import { ComprasUsuarioDetalles} from "../models/compras-usuario-detalles.model.js";
import { Compras } from "../models/compras.model.js";
import { CompraDetalles } from "../models/compra-detalles.model.js";
import { Proveedores } from "../models/proveedores.model.js";
import { ServiciosInternet } from "../models/servicio-internet.model.js";
import { Contrataciones } from "../models/contrataciones.model.js";

export const EstadisticasController = Router();

EstadisticasController.get('/stats/servicios-mas-solicitados', async (req, res) => {
    try {
        const servicios = await ServiciosInternet.find({});
        const contrataciones = await Contrataciones.find({});

        let data = {};
        for (const servicio of servicios) {
            data[servicio.nombre] = 0;
            for (const contrato of contrataciones) {
                if (contrato.servicio.equals(servicio._id)) {
                    data[servicio.nombre]++;
                }
            }
        }

        res.status(200).json({msg: "Servicios más solicitados", data});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
EstadisticasController.get('/stats/ganancias-servicios', async (req, res) => {
    try {
        const servicios = await ServiciosInternet.find({});
        const contrataciones = await Contrataciones.find({});

        let data = {};
        for (const servicio of servicios) {
            data[servicio.nombre] = 0;
            for (const contrato of contrataciones) {
                if (contrato.servicio.equals(servicio._id)) {
                    data[servicio.nombre] += contrato.total;
                }
            }
        }

        res.status(200).json({msg: "Ganancias por servicio", data});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
EstadisticasController.get("/stats/proveedores", async (req, res) => {
    try {
        const proveedores = await Proveedores.find({});
        const compras = await CompraDetalles.find({})

        let data = {};
        for (const prov of proveedores) {
            data[prov.nombre] = 0;
            for (const detalle of compras) {
                if (detalle.proveedor.equals(prov._id)) {
                    data[prov.nombre] += detalle.importe;
                }
            }
        }

        res.status(200).json({msg: "Gastos hechos por proveedor", data});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
EstadisticasController.get("/stats/gastos-categoria", async (req, res) => {
    try {
        const categorias = await Categorias.find({});
        const compras = await CompraDetalles.find({})
            .populate("producto")
            // .populate({
            //     path: "producto",
            //     populate: {
            //         path: "categoria",
            //         model: "Categorias",
            //     }
            // });
        let data = {};
        for (const cat of categorias) {
            data[cat.nombre] = 0;
            for (const detalle of compras) {
                if (detalle.producto.categoria.equals(cat._id)) {
                    data[cat.nombre] += detalle.importe;
                }
            }
        }

        res.status(200).json({msg: "Gastos por categoría", data});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
EstadisticasController.get("/stats/ganancias-categoria", async (req, res) => {
    try {
        const categorias = await Categorias.find({});
        const ventas = await ComprasUsuarioDetalles.find({})
            .populate("producto")
            // .populate({
            //     path: "producto",
            //     populate: {
            //         path: "categoria",
            //         model: "Categorias",
            //     }
            // });
        let data = {};
        for (const cat of categorias) {
            data[cat.nombre] = 0;
            for (const detalle of ventas) {
                if (detalle.producto.categoria.equals(cat._id)) {
                    data[cat.nombre] += detalle.importe;
                }
            }
        }

        res.status(200).json({msg: "Ganancias por categoría", data});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
EstadisticasController.get("/stats/gastos-ganancias", async (req, res) => {
    try {
        const ventas = await ComprasUsuario.find({});
        const compras = await Compras.find({});

        let acumuladorVentas = 0;
        ventas.forEach((venta) => {
            acumuladorVentas += venta.total;
        });

        let acumuladorCompras = 0;
        compras.forEach((compra) => {
            acumuladorCompras += compra.total;
        });

        res.status(200).json({msg: "Compras/Ventas", data: {
            compras: acumuladorCompras,
            ventas: acumuladorVentas 
        }});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});