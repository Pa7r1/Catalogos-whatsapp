import { db } from "./mysql.js";
import bcrypt from "bcrypt";

const Usuario = {
  contarAdmins: async () => {
    const sql = `SELECT COUNT(*) AS count FROM usuarios WHERE rol = 'admin'`;
    const [result] = await db.execute(sql);
    return result[0].count;
  },

  crearAdmin: async () => {
    const username = process.env.USERNAME_ADMIN;
    const password = process.env.PASSWORD_ADMIN;
    const passwordHash = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO usuarios (username,password, rol) VALUES (?,?, 'admin')`;
    await db.execute(sql, [username, passwordHash]);
    console.log("administrador creado");
  },
};

export default Usuario;
