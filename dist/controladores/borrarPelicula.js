import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
export async function manejarDelete(ruta, respuesta) {
    if (!ruta.startsWith("/peliculas/")) {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let partesDeRuta = ruta.split("/");
        let idBuscado = partesDeRuta[2];
        let [resultado] = await grupoDeConexiones.query("DELETE FROM peliculas WHERE id = ?", [idBuscado]);
        let informacionDeResultado = resultado;
        if (informacionDeResultado.affectedRows === 0) {
            enviarRespuestaJson(respuesta, 404, { mensaje: "Pelicula no encontrada para DELETE" });
        }
        else {
            enviarRespuestaJson(respuesta, 200, { mensaje: "Pelicula borrada" });
        }
    }
    catch (errorDeBorrado) {
        console.error(errorDeBorrado);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en DELETE" });
    }
}
