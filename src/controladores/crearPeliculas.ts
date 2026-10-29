import * as http from "http";
import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
import { leerCuerpoDePeticion } from "../utilidades/lecturaCuerpo.js";

export async function manejarPost(ruta: string, peticion: http.IncomingMessage, respuesta: http.ServerResponse): Promise<void> {
    if (ruta !== "/peliculas") {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    
    try {
        let textoDelCuerpo = await leerCuerpoDePeticion(peticion);
        let datosRecibidos = JSON.parse(textoDelCuerpo);
        
        if (!datosRecibidos.titulo || !datosRecibidos.director) {
            enviarRespuestaJson(respuesta, 400, { mensaje: "Faltan datos obligatorios: titulo y director" });
            return;
        }
        
        await grupoDeConexiones.query(
            "INSERT INTO peliculas (titulo, director, genero, anio_estreno, duracion_min, calificacion, sinopsis) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [
                datosRecibidos.titulo, 
                datosRecibidos.director, 
                datosRecibidos.genero || null, 
                datosRecibidos.anio_estreno || null, 
                datosRecibidos.duracion_min || null, 
                datosRecibidos.calificacion || null, 
                datosRecibidos.sinopsis || null
            ]
        );
        
        enviarRespuestaJson(respuesta, 201, { mensaje: "Película creada exitosamente" });
    } catch (errorDeInsercion) {
        console.error(errorDeInsercion);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error interno al crear la película" });
    }
}