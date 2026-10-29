/*npm install mysql2
npm install --save-dev typescript @types/node*/

import * as http from "http";
import * as url from "url";
import * as fs from "fs/promises";
import { enviarRespuestaJson } from "./utilidades/respuestas.js";
import { manejarGet } from "./controladores/obtenerPelicula.js";
import { manejarPost } from "./controladores/crearPeliculas.js";
import { manejarPut } from "./controladores/reemplazarPelicula.js";
import { manejarPatch } from "./controladores/actualizarParcial.js";
import { manejarDelete } from "./controladores/borrarPelicula.js";


const servidor = http.createServer(async function (peticion: http.IncomingMessage, respuesta: http.ServerResponse) {
    let direccionParseada = url.parse(peticion.url || "", true);
    let rutaActual = direccionParseada.pathname || "";
    let metodoActual = (peticion.method || "").toUpperCase();

    console.log("Peticion: " + metodoActual + " " + rutaActual);

    if (rutaActual === "/" && metodoActual === "GET") {
        try {
            const rutaHtml = url.fileURLToPath(new URL("../public/index.html", import.meta.url));
            const contenidoHtml = await fs.readFile(rutaHtml);
            respuesta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            respuesta.end(contenidoHtml);
        } catch (errorDeLectura) {
            console.error("No se pudo cargar la interfaz web:", errorDeLectura);
            respuesta.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            respuesta.end("No se pudo cargar la interfaz web");
        }
        return;
    }

    if (rutaActual === "/styles.css" && metodoActual === "GET") {
        try {
            const rutaCss = url.fileURLToPath(new URL("../public/styles.css", import.meta.url));
            const contenidoCss = await fs.readFile(rutaCss);
            respuesta.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
            respuesta.end(contenidoCss);
        } catch (errorDeLectura) {
            console.error("No se pudo cargar la hoja de estilos:", errorDeLectura);
            respuesta.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            respuesta.end("No se pudo cargar la hoja de estilos");
        }
        return;
    }

    if (rutaActual === "/peliculas" && metodoActual === "POST") {
        await manejarPost(rutaActual, peticion, respuesta);
        return;
    }

    if (metodoActual === "GET") {
        await manejarGet(rutaActual, respuesta);
    } else if (metodoActual === "PUT") {
        await manejarPut(rutaActual, peticion, respuesta);
    } else if (metodoActual === "PATCH") {
        await manejarPatch(rutaActual, peticion, respuesta);
    } else if (metodoActual === "DELETE") {
        await manejarDelete(rutaActual, respuesta);
    } else {
        enviarRespuestaJson(respuesta, 405, { mensaje: "Metodo no permitido" });
    }
});

const puerto = Number(process.env.PORT) || 3000;

servidor.listen(puerto, function () {
    console.log("API escuchando en http://localhost:" + puerto);
});