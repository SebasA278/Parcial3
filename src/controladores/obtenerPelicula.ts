import * as http from "http";
import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";

export async function manejarGet(ruta: string, respuesta: http.ServerResponse): Promise<void> {
    try {

        if (ruta === "/peliculas") {
            const [filas] = await grupoDeConexiones.query("SELECT * FROM peliculas");
            enviarRespuestaJson(respuesta, 200, filas);
            return;
        }

        if (ruta.startsWith("/peliculas/")) {
            const partesDeRuta = ruta.split("/");
            const idBuscado = partesDeRuta[2]; 

            if (!idBuscado) {
                enviarRespuestaJson(respuesta, 400, { mensaje: "Debe proporcionar un ID válido" });
                return;
            }

            const [filas] = await grupoDeConexiones.query("SELECT * FROM peliculas WHERE id = ?", [idBuscado]);
            const lista = filas as any[];

            if (lista.length === 0) {
                enviarRespuestaJson(respuesta, 404, { mensaje: "Película no encontrada" });
                return;
            } 
            
            enviarRespuestaJson(respuesta, 200, lista[0]);
            return;
        }

        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });

    } catch (error) {
        console.error("Error en la base de datos:", error);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error interno del servidor" });
    }
}