import express from "express";

import cors from "cors";
import cookies from "cookie-parser";

import fileUpload from "express-fileupload";

import { conectarBaseDatos } from "./services/db.service.js";

import { AdminController } from "./controllers/admins.controller.js";
import { ProveedoresController } from "./controllers/proveedores.controller.js";
import { CategoriasController } from "./controllers/categorias.controller.js";
import { ArchivosController } from "./controllers/archivos.controller.js";
import { ProductosController } from "./controllers/productos.controller.js";
import { ServiciosInternetController } from "./controllers/servicios-internet.controller.js";
import { ComprasController } from "./controllers/compras.controller.js";
import { AutenticacionController } from "./controllers/autenticacion.controller.js";
import { TiendaController } from "./controllers/tienda.controller.js";
import { TarjetasController } from "./controllers/tarjetas.controller.js";
import { ComprasUsuarioController } from "./controllers/compras-usuario.controller.js";
import { TareasController } from "./controllers/tareas.controller.js";
import { ContratacionesController } from "./controllers/contrataciones.controller.js";
import { VentasController } from "./controllers/ventas.controller.js";

const server = express();

const iniciar = async () => {
    const database = await conectarBaseDatos();

    server.use(express.urlencoded({extended: true}));
    server.use(express.json());

    server.use(cookies());
    server.use(cors());

    server.use(fileUpload({
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
        tempFileDir: `./public/files/temp`,
    }));

    server.get('/', (req, res) => res.status(200).json({msg: 'RadiussNet'}));

    server.use('/', AdminController);
    server.use('/', AutenticacionController);
    server.use('/', ProveedoresController);
    server.use('/', CategoriasController);
    server.use('/', ArchivosController);
    server.use('/', ProductosController);
    server.use('/', ServiciosInternetController);
    server.use('/', ComprasController);
    server.use('/', TiendaController);
    server.use('/', TarjetasController);
    server.use('/', ComprasUsuarioController);
    server.use('/', TareasController);
    server.use('/', ContratacionesController);
    server.use('/', VentasController);

    server.use('*', (req, res) => {
        res.status(404).json({msg: 'Not found'});
    });

    server.listen(3000, '0.0.0.0', () => {
        console.log('RADIUSSNET API: ', new Date().toLocaleString());
    });
}
iniciar();