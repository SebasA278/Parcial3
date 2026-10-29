import { grupoDeConexiones } from "../configuracion/baseDeDatos.js";
import { enviarRespuestaJson } from "../utilidades/respuestas.js";
export async function manejarDelete(ruta, respuesta) {
    if (!ruta.startsWith("/usuarios/")) {
        enviarRespuestaJson(respuesta, 404, { mensaje: "Ruta no encontrada" });
        return;
    }
    try {
        let partesDeRuta = ruta.split("/");
        let nickBuscado = partesDeRuta[2];
        let [resultado] = await grupoDeConexiones.query("DELETE FROM usuarios WHERE nick = ?", [nickBuscado]);
        let informacionDeResultado = resultado;
        if (informacionDeResultado.affectedRows === 0) {
            enviarRespuestaJson(respuesta, 404, { mensaje: "Usuario no encontrado para DELETE" });
        }
        else {
            enviarRespuestaJson(respuesta, 200, { mensaje: "Usuario borrado" });
        }
    }
    catch (errorDeBorrado) {
        console.error(errorDeBorrado);
        enviarRespuestaJson(respuesta, 500, { mensaje: "Error en DELETE" });
    }
}
