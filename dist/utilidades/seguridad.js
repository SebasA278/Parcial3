import * as crypto from "crypto";
export function generarHashSha512(textoPlano) {
    let objetoHash = crypto.createHash("sha512");
    objetoHash.update(textoPlano);
    return objetoHash.digest("hex");
}
