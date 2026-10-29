import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
export async function manejarGet(ruta, respuesta) {
    try {
        if (ruta === "/usuarios" || ruta === "/usuarios/") {
            let [filas] = await grupoDeConexiones.query("SELECT nick, correo, nombres, apellidos, telefono, fecha_nacimiento, rol, estado, fecha_registro, ultimo_acceso FROM usuarios");
            enviarRespuestaJson(respuesta, 200, filas);
            return;
        }
        if (ruta.startsWith("/usuarios/")) {
            let partesDeRuta = ruta.split("/");
            let nickBuscado = partesDeRuta[2];
            let [filas] = await grupoDeConexiones.query("SELECT nick, correo, nombres, apellidos, telefono, fecha_nacimiento, rol, estado, fecha_registro, ultimo_acceso FROM usuarios WHERE nick = ?", [nickBuscado]);
            let lista = filas;
            if (lista.length === 0) {
                enviarRespuestaJson(respuesta, 404, { mensaje: "Usuario no encontrado" });
            }
            else {
                await grupoDeConexiones.query("UPDATE usuarios SET ultimo_acceso = NOW() WHERE nick = ?", [nickBuscado]);
                enviarRespuestaJson(respuesta, 200, lista[0]);
            }
            return;
        }
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
    }
    catch (errorDeBaseDeDatos) {
        console.error(errorDeBaseDeDatos);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en base de datos" });
    }
}
