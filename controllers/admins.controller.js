import { Router } from "express";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

import { Admins } from "../models/admins.model.js";
import { generarJWT, validarJWT } from "../security/security.js";
import { EnviarCorreo } from "../services/email.service.js";
import { urlFrontend } from "../global/urls.js";

export const AdminController = Router();

AdminController.post('/admin/crear-cuenta', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await Admins.findOne({
            correo: datos.correo
        });

        if (encontrado) {
            res.status(400).json({msg: 'Correo en uso'});
            return;
        }

        const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);

        const nuevo = await Admins.create({
            correo: datos.correo,
            contrasena: contrasenaHasheada,
        });

        res.status(200).json({msg: 'Cuenta admin creada'});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});     
    }
});
AdminController.post('/admin/login', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await Admins.findOne({
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
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
AdminController.get('/admin/datos', validarJWT, async (req, res) => {
    const {id} = req.user;

    try {
        const encontrado = await Admins.findById(id);

        if (!encontrado) {
            res.status(404).json({msg: 'Admin no encontrado'});
            return;
        }

        res.status(200).json({data: encontrado});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});

/**RECUPERACIÓN DE CUENTA */
AdminController.post('/admin/recuperar', async (req, res) => {
    const datos = req.body;

    try {
        const encontrado = await Admins.findOne({correo: datos.correo});

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
            <p>Ingrese el siguiente Token en la pantalla de recuperación</p>
            <p>${token}</p>
        `)

        res.status(200).json({msg: "Recuperación"});
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
AdminController.get('/admin/recuperar/:token', async (req, res) => {
    const token = req.params.token;

    try {
        const encontrado = await Admins.findOne({token: token});

        if (!encontrado) {
            res.status(404).json({msg: 'Token no encontrado'});
            return;
        }

        res.status(200).json({msg: 'Ok'})
    } catch (error) {
        console.log(e);
        res.status(500).json({msg: 'Hubo un error'});   
    }
});
AdminController.post('/admin/nueva-contrasena/:token', async (req, res) => {
    const token = req.params.token
    const datos = req.body

    if (!token) return res.status(400).json({msg: 'Sin token'})

    try {
        const encontrado = await Admins.findOne({
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