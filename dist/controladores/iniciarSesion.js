import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
import { leerCuerpoDePeticion } from "../utilidades/lecturaCuerpo.js";
import { generarHashSha512 } from "../utilidades/seguridad.js";
import { generarTokenDeAcceso } from "../utilidades/token.js";
export async function manejarLoginPost(ruta, peticion, respuesta) {
    if (ruta !== "/login" && ruta !== "/login/") {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let textoDelCuerpo = await leerCuerpoDePeticion(peticion);
        let datosRecibidos = JSON.parse(textoDelCuerpo);
        let nickRecibido = datosRecibidos.nick;
        let claveRecibida = datosRecibidos.clave;
        if (!nickRecibido || !claveRecibida) {
            enviarRespuestaJson(respuesta, 400, { mensaje: "Faltan nick y clave" });
            return;
        }
        let claveConHash = generarHashSha512(claveRecibida);
        let [filas] = await grupoDeConexiones.query("SELECT nick, correo, nombres, rol, estado FROM usuarios WHERE nick = ? AND clave = ? AND estado = 'activo'", [nickRecibido, claveConHash]);
        let listaDeResultados = filas;
        if (listaDeResultados.length === 0) {
            enviarRespuestaJson(respuesta, 401, { mensaje: "Credenciales incorrectas" });
            return;
        }
        await grupoDeConexiones.query("UPDATE usuarios SET ultimo_acceso = NOW() WHERE nick = ?", [nickRecibido]);
        let usuarioAutenticado = listaDeResultados[0];
        let tokenGenerado = generarTokenDeAcceso(usuarioAutenticado);
        enviarRespuestaJson(respuesta, 200, { mensaje: "Login correcto", token: tokenGenerado, usuario: usuarioAutenticado });
    }
    catch (errorDeLogin) {
        console.error(errorDeLogin);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en el login" });
    }
}
