import * as crypto from "crypto";
import { claveSecretaParaToken, tiempoDeExpiracionEnSegundos } from "../configuracion/secreto.js";
function codificarEnBase64Url(texto) {
    let textoEnBase64 = Buffer.from(texto).toString("base64");
    let textoCorregido = textoEnBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    return textoCorregido;
}
function decodificarDeBase64Url(textoEnBase64Url) {
    let textoCorregido = textoEnBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (textoCorregido.length % 4 !== 0) {
        textoCorregido = textoCorregido + "=";
    }
    return Buffer.from(textoCorregido, "base64").toString();
}
export function generarTokenDeAcceso(datosDelUsuario) {
    let encabezado = {
        algoritmo: "HS256",
        tipo: "JWT"
    };
    let ahoraEnSegundos = Math.floor(Date.now() / 1000);
    let contenido = {
        nick: datosDelUsuario.nick,
        rol: datosDelUsuario.rol,
        correo: datosDelUsuario.correo,
        fechaDeCreacion: ahoraEnSegundos,
        fechaDeExpiracion: ahoraEnSegundos + tiempoDeExpiracionEnSegundos
    };
    let encabezadoCodificado = codificarEnBase64Url(JSON.stringify(encabezado));
    let contenidoCodificado = codificarEnBase64Url(JSON.stringify(contenido));
    let datosParaFirmar = encabezadoCodificado + "." + contenidoCodificado;
    let firma = crypto.createHmac("sha256", claveSecretaParaToken).update(datosParaFirmar).digest("base64");
    let firmaEnBase64Url = firma.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    let tokenCompleto = datosParaFirmar + "." + firmaEnBase64Url;
    return tokenCompleto;
}
export function verificarTokenDeAcceso(tokenRecibido) {
    try {
        let partesDelToken = tokenRecibido.split(".");
        if (partesDelToken.length !== 3) {
            return null;
        }
        let encabezadoCodificado = partesDelToken[0];
        let contenidoCodificado = partesDelToken[1];
        let firmaRecibida = partesDelToken[2];
        let datosParaFirmar = encabezadoCodificado + "." + contenidoCodificado;
        let firmaEsperada = crypto.createHmac("sha256", claveSecretaParaToken).update(datosParaFirmar).digest("base64");
        let firmaEsperadaEnBase64Url = firmaEsperada.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        if (firmaEsperadaEnBase64Url !== firmaRecibida) {
            return null;
        }
        let contenidoEnTexto = decodificarDeBase64Url(contenidoCodificado);
        let contenidoComoObjeto = JSON.parse(contenidoEnTexto);
        let ahoraEnSegundos = Math.floor(Date.now() / 1000);
        if (contenidoComoObjeto.fechaDeExpiracion < ahoraEnSegundos) {
            return null;
        }
        return contenidoComoObjeto;
    }
    catch (errorDeVerificacion) {
        return null;
    }
}
