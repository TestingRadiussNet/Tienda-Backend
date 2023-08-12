import { Router } from "express";
import *  as bcrypt from "bcrypt";
import { Usuarios } from "../models/usuarios.model.js";
import {ServiciosInternet} from "../models/servicio-internet.model.js";
import { Contrataciones } from "../models/contrataciones.model.js";
import { EnviarCorreo } from "../services/email.service.js";
import { Tarjetas } from "../models/tarjetas.model.js";
import { InstalacionesInternet } from "../models/instalaciones-internet.model.js";

export const ContratacionesController = Router();

ContratacionesController.get('/contrataciones/listado/:usuario', async (req, res) => {
    const usuarioID = req.params.usuario;

    try {
       const lista = await Contrataciones.find({usuario: usuarioID}).populate('servicio').populate('tarjeta');

       res.status(200).json({msg: 'Mis contrataciones', data: lista});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
ContratacionesController.post('/contrataciones/:usuario/:servicio/nueva', async (req, res) => {
    const usuarioID = req.params.usuario;
    const servicioID = req.params.servicio;
    const datos = req.body;
    
    try {
        const usuario = await Usuarios.findById(usuarioID);
        const servicio = await ServiciosInternet.findById(servicioID);
        const tarjeta = await Tarjetas.findById(datos.tarjeta);

        const esValida = await bcrypt.compare(datos.cvv, tarjeta.cvv);

        if (!esValida) {
            res.status(403).json({msg: "La clave es inválida"});
            return;
        }

        const contratacionEncontrada = await Contrataciones.findOne({
            usuario: usuarioID,
            servicio: servicioID,
        });


        if (contratacionEncontrada && contratacionEncontrada.activo) {
            res.status(403).json({msg: 'Ya tiene una contratación realizada activa'});
            return;
        }

        const contratacion = await Contrataciones.create({
            usuario: usuarioID,
            servicio: servicioID,
            tarjeta: datos.tarjeta,
            precioMensual: servicio.precioMensual,
            mesesContratados: datos.meses,
            total: servicio.precioMensual * datos.meses,
            fecha: new Date(),
        });

        await EnviarCorreo(usuario.correo, 'Contratación hecha', 
        `
            <p>Querido ${usuario.nombre}</p>
            <p>Usted ha contratado el servicio ${servicio.nombre} por ${datos.meses} meses.</p>
            <p>El costo total fue de $${contratacion.total} MXN en la fecha de envío de este correo.</p>
            <p>La instalación le será avisada por este medio, le solicitamos paciencia.</p>
        `
        );

        res.status(201).json({msg: 'Contratación hecha, revise su correo electrónico.'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'}); 
    }
});
ContratacionesController.get("/contrataciones/listado", async (req, res) => {
    try {
        const listado = await Contrataciones.find().populate('usuario').populate('servicio');

        res.status(200).json({msg: "Listado de contrataciones", data: listado});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});
ContratacionesController.put('/contrataciones/programar-instalacion/:id', async (req, res) => {
    const contratacionID = req.params.id;
    const datos = req.body;

    try {
        const contratacionFound = await Contrataciones.findById(contratacionID).populate("usuario").populate('servicio');

        if (!contratacionFound) {
            res.status(404).json({msg: "Contratación no encontrada"});
            return;
        }

        const instalacionInternet = await InstalacionesInternet.create({
            contratacion: contratacionID,
            fecha: new Date(datos.fecha),
            trabajador: datos.trabajador,
        });

        contratacionFound.instalacionPendiente = false;

        await contratacionFound.save();

        await EnviarCorreo(contratacionFound.usuario.correo, 'Fecha de instalación establecida', 
        `
            <p>Querido ${contratacionFound.usuario.nombre}</p>
            <p>ID de la contratación: <strong>${contratacionFound.id}</strong></p>
            <p>La instalación del servicio "${contratacionFound.servicio.nombre}" se programará para ${new Date(datos.fecha)}</p>
            <p>El empleado a cargo será ${datos.trabajador}</p>
        `
        );

        res.status(201).json({
            msg: "Fecha definida!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});