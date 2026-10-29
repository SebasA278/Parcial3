import mysql from "mysql2/promise";

const configuracionBaseDeDatos = {
    host: "localhost",
    user: "root",
    password: "1230",
    database: "cinedb",
    port: 3306
};

export const grupoDeConexiones = mysql.createPool(configuracionBaseDeDatos);