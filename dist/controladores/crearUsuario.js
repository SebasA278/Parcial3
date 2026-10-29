import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
import { leerCuerpoDePeticion } from "../utilidades/lecturaCuerpo.js";
import { generarHashSha512 } from "../utilidades/seguridad.js";
export async function manejarPost(ruta, peticion, respuesta) {
    if (ruta !== "/usuarios" && ruta !== "/usuarios/") {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let textoDelCuerpo = await leerCuerpoDePeticion(peticion);
        let datosRecibidos = JSON.parse(textoDelCuerpo);
        if (!datosRecibidos.nick || !datosRecibidos.clave || !datosRecibidos.correo) {
            enviarRespuestaJson(respuesta, 400, { mensaje: "Faltan nick, clave y correo obligatorios" });
            return;
        }
        let claveConHash = generarHashSha512(datosRecibidos.clave);
        await grupoDeConexiones.query("INSERT INTO usuarios (nick, clave, correo, nombres, apellidos, telefono, fecha_nacimiento, rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [datosRecibidos.nick, claveConHash, datosRecibidos.correo, datosRecibidos.nombres, datosRecibidos.apellidos, datosRecibidos.telefono || null, datosRecibidos.fecha_nacimiento || null, datosRecibidos.rol || "usuario", datosRecibidos.estado || "activo"]);
        enviarRespuestaJson(respuesta, 201, { mensaje: "Usuario creado" });
    }
    catch (errorDeInsercion) {
        console.error(errorDeInsercion);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error al crear, nick o correo ya existen" });
    }
}
