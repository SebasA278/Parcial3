import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
import { leerCuerpoDePeticion } from "../utilidades/lecturaCuerpo.js";
export async function manejarPatch(ruta, peticion, respuesta) {
    if (!ruta.startsWith("/peliculas/")) {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let partesDeRuta = ruta.split("/");
        let idBuscado = partesDeRuta[2];
        let textoDelCuerpo = await leerCuerpoDePeticion(peticion);
        let cambiosParciales = JSON.parse(textoDelCuerpo);
        let camposParaActualizar = [];
        let valoresParaActualizar = [];
        if (cambiosParciales.titulo !== undefined) {
            camposParaActualizar.push("titulo = ?");
            valoresParaActualizar.push(cambiosParciales.titulo);
        }
        if (cambiosParciales.director !== undefined) {
            camposParaActualizar.push("director = ?");
            valoresParaActualizar.push(cambiosParciales.director);
        }
        if (cambiosParciales.genero !== undefined) {
            camposParaActualizar.push("genero = ?");
            valoresParaActualizar.push(cambiosParciales.genero);
        }
        if (cambiosParciales.anio_estreno !== undefined) {
            camposParaActualizar.push("anio_estreno = ?");
            valoresParaActualizar.push(cambiosParciales.anio_estreno);
        }
        if (cambiosParciales.duracion_min !== undefined) {
            camposParaActualizar.push("duracion_min = ?");
            valoresParaActualizar.push(cambiosParciales.duracion_min);
        }
        if (cambiosParciales.calificacion !== undefined) {
            camposParaActualizar.push("calificacion = ?");
            valoresParaActualizar.push(cambiosParciales.calificacion);
        }
        if (cambiosParciales.sinopsis !== undefined) {
            camposParaActualizar.push("sinopsis = ?");
            valoresParaActualizar.push(cambiosParciales.sinopsis);
        }
        if (camposParaActualizar.length === 0) {
            enviarRespuestaJson(respuesta, 400, { mensaje: "PATCH sin campos válidos para actualizar" });
            return;
        }
        let consultaSql = "UPDATE peliculas SET " + camposParaActualizar.join(", ") + " WHERE id = ?";
        valoresParaActualizar.push(idBuscado);
        let [resultado] = await grupoDeConexiones.query(consultaSql, valoresParaActualizar);
        let informacionDeResultado = resultado;
        if (informacionDeResultado.affectedRows === 0) {
            enviarRespuestaJson(respuesta, 404, { mensaje: "Pelicula no encontrada para PATCH" });
        }
        else {
            enviarRespuestaJson(respuesta, 200, { mensaje: "Pelicula actualizada parcialmente con PATCH" });
        }
    }
    catch (errorDeParche) {
        console.error(errorDeParche);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en PATCH" });
    }
}
