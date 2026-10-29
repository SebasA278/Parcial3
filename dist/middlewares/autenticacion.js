import { verificarTokenDeAcceso } from "../utilidades/token.js";
export function verificarAutenticacion(peticion) {
    let encabezadoDeAutorizacion = peticion.headers["authorization"];
    if (!encabezadoDeAutorizacion) {
        return null;
    }
    let partesDelEncabezado = encabezadoDeAutorizacion.split(" ");
    if (partesDelEncabezado.length !== 2) {
        return null;
    }
    if (partesDelEncabezado[0] !== "Bearer") {
        return null;
    }
    let tokenRecibido = partesDelEncabezado[1];
    let datosDelToken = verificarTokenDeAcceso(tokenRecibido);
    return datosDelToken;
}
