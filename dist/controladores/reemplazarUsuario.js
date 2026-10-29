import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
import { leerCuerpoDePeticion } from "../utilidades/lecturaCuerpo.js";
import { generarHashSha512 } from "../utilidades/seguridad.js";
export async function manejarPut(ruta, peticion, respuesta) {
    if (!ruta.startsWith("/usuarios/")) {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let partesDeRuta = ruta.split("/");
        let nickBuscado = partesDeRuta[2];
        let textoDelCuerpo = await leerCuerpoDePeticion(peticion);
        let datosRecibidos = JSON.parse(textoDelCuerpo);
        let claveConHash = generarHashSha512(datosRecibidos.clave);
        let [resultado] = await grupoDeConexiones.query("UPDATE usuarios SET clave = ?, correo = ?, nombres = ?, apellidos = ?, telefono = ?, fecha_nacimiento = ?, rol = ?, estado = ? WHERE nick = ?", [claveConHash, datosRecibidos.correo, datosRecibidos.nombres, datosRecibidos.apellidos, datosRecibidos.telefono || null, datosRecibidos.fecha_nacimiento || null, datosRecibidos.rol, datosRecibidos.estado, nickBuscado]);
        let informacionDeResultado = resultado;
        if (informacionDeResultado.affectedRows === 0) {
            enviarRespuestaJson(respuesta, 404, { mensaje: "Usuario no encontrado para PUT" });
        }
        else {
            enviarRespuestaJson(respuesta, 200, { mensaje: "Usuario reemplazado por completo con PUT" });
        }
    }
    catch (errorDeActualizacion) {
        console.error(errorDeActualizacion);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en PUT" });
    }
}
