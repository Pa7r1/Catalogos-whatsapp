import express from "express";
import cors from "cors";
import { configureRoutes } from "./configureRoutes.js";
import { dbConnection } from "./modelos/mysql.js";
import ejecutarCrearAdmin from "./modelos/usuario.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

await configureRoutes(app, "controladores");

const iniciar = async () => {
  await dbConnection();
  await ejecutarCrearAdmin();
  console.log("recursos necesarios ejecutados con exito");

  app.listen(PORT, () => {
    console.log(`servidor levantado en el puerto: ${PORT}`);
  });
};

iniciar();
