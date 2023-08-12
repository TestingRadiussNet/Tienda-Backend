import { Router } from "express";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

import { Usuarios } from "../models/usuarios.model.js";
import { generarJWT, validarJWT } from "../security/security.js";
import { EnviarCorreo } from "../services/email.service.js";
import { urlFrontend } from "../global/urls.js";

export const AutenticacionController = Router();

AutenticacionController.post('/autenticacion/crear-cuenta', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await Usuarios.findOne({
            $or: [
                {correo: datos.correo},
                {telefono: datos.telefono},
            ]
        });

        if (encontrado) {
            res.status(400).json({msg: 'Correo o teléfono en uso'});
            return;
        }

        const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);

        const nuevo = await Usuarios.create({
            ...datos,
            contrasena: contrasenaHasheada,
        });

        res.status(200).json({msg: 'Cuenta creada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});     
    }
});
AutenticacionController.post('/autenticacion/login', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await Usuarios.findOne({
            correo: {
                $regex: datos.correo,
                $options: 'i',
            }
        });

        if (!encontrado) {
            res.status(401).json({msg: 'Credenciales inválidas'});
            return;
        }

        const valido = await bcrypt.compare(datos.contrasena, encontrado.contrasena);

        if (!valido) {
            res.status(401).json({msg: 'Credenciales inválidas'});
            return;
        }

        const jwt = await generarJWT({id: encontrado._id});

        res.status(200).json({
            msg: 'Éxito',
            data: {jwt}
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
AutenticacionController.get('/autenticacion/datos', validarJWT, async (req, res) => {
    const {id} = req.user;

    try {
        const encontrado = await Usuarios.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'Usuario no encontrado'});
            return;
        }

        res.status(200).json({data: encontrado});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});

/**RECUPERACIÓN DE CUENTA */
AutenticacionController.post('/autenticacion/recuperar', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await Usuarios.findOne({correo: datos.correo});

        if (!encontrado) {
            res.status(404).json({msg: 'Correo no encontrado'});
            return;
        }

        const token = crypto.randomBytes(20).toString('hex');

        encontrado.token = token;

        await encontrado.save();

        await EnviarCorreo(datos.correo, 'Recuperar Cuenta',
        `
            <h1>Recuperar Cuenta</h1>
            <p>Ingrese al siguiente link para recuperar la cuenta:</p>
            <a href="${urlFrontend}/recuperar/${token}">${urlFrontend}/recuperar/${token}</a>
        `)

        res.status(200).json({msg: "Revise su correo electrónico"});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
AutenticacionController.get('/autenticacion/recuperar/:token', async (req, res) => {
    const token = req.params.token;

    try {
        const encontrado = await Usuarios.findOne({token: token});

        if (!encontrado) {
            res.status(404).json({msg: 'Token no encontrado'});
            return;
        }

        res.status(200).json({msg: 'Ok'})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
AutenticacionController.post('/autenticacion/nueva-contrasena/:token', async (req, res) => {
    const token = req.params.token
    const datos = req.body

    if (!token) return res.status(400).json({msg: 'Sin token'})

    try {
        const encontrado = await Usuarios.findOne({
            token: token
        })

        if (!encontrado) {
            res.status(404).json({msg: 'Token no encontrado'});
            return;
        }

        const hashed = await bcrypt.hash(datos.contrasena, 10)

        encontrado.token = null
        encontrado.contrasena = hashed

        await encontrado.save()

        res.status(200).json({msg: 'Contraseña actualizada'})
    } catch (e) {
        console.log(e)
        res.status(500).json({msg: 'Hubo un error'});  
    }
})
AutenticacionController.patch('/autenticacion/actualizar-datos', validarJWT, async (req, res) => {
    const {id} = req.user;
    const datos = req.body;
    try {
        const encontrado = await Usuarios.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'No encontrado'});
            return;
        }

        Object.assign(encontrado, datos);

        await encontrado.save();

        res.status(200).json({msg: 'Información actualizada correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
});