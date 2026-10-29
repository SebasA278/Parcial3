import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
import { leerCuerpoDePeticion } from "../utilidades/lecturaCuerpo.js";
export async function manejarPut(ruta, peticion, respuesta) {
    if (!ruta.startsWith("/peliculas/")) {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let partesDeRuta = ruta.split("/");
        let idBuscado = partesDeRuta[2];
        let textoDelCuerpo = await leerCuerpoDePeticion(peticion);
        let datosRecibidos = JSON.parse(textoDelCuerpo);
        if (!datosRecibidos.titulo || !datosRecibidos.director) {
            enviarRespuestaJson(respuesta, 400, { mensaje: "Faltan datos obligatorios: titulo o director" });
            return;
        }
        let [resultado] = await grupoDeConexiones.query("UPDATE peliculas SET titulo = ?, director = ?, genero = ?, anio_estreno = ?, duracion_min = ?, calificacion = ?, sinopsis = ? WHERE id = ?", [
            datosRecibidos.titulo,
            datosRecibidos.director,
            datosRecibidos.genero || null,
            datosRecibidos.anio_estreno || null,
            datosRecibidos.duracion_min || null,
            datosRecibidos.calificacion || null,
            datosRecibidos.sinopsis || null,
            idBuscado
        ]);
        let informacionDeResultado = resultado;
        if (informacionDeResultado.affectedRows === 0) {
            enviarRespuestaJson(respuesta, 404, { mensaje: "Pelicula no encontrada para PUT" });
        }
        else {
            enviarRespuestaJson(respuesta, 200, { mensaje: "Pelicula reemplazada por completo con PUT" });
        }
    }
    catch (errorDeActualizacion) {
        console.error(errorDeActualizacion);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en PUT" });
    }
}
