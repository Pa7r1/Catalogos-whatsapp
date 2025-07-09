import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection, db } from "./mysql.js";
import { convertirPrecio } from "../middlewares/formateoPrecio.js";

const cargaProductos = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const rutaCatalogo = path.join(
    __dirname,
    "../catalogos/fabrica/catalogo_final.json"
  );
  const rutaImagenes = path.join(__dirname, "../catalogos/imagenes-catalogo");
  const provedorId = 1;
  const margen = 1.45;

  await dbConnection();
  const data = JSON.parse(fs.readFileSync(rutaCatalogo, "utf8"));

  for (const prod of data) {
    const nombre = prod.nombre.trim();
    const descripcion = prod.descripcion || "";
    const precioProvedor = convertirPrecio(prod.precio);
    const precioMio = Math.round(precioProvedor * margen * 100) / 100;

    const sqlCrearProducto = `CALL SP_CrearProducto(?,?,?,?,?)`;
    const [productosResult] = await db.execute(sqlCrearProducto, [
      provedorId,
      nombre,
      descripcion,
      precioProvedor,
      precioMio,
    ]);

    const idProducto =
      productosResult[0][0].id_producto || productosResult.insertId;

    const slug = nombre
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const dirImagen = path.join(rutaImagenes, slug);

    if (fs.existsSync(dirImagen)) {
      const archivos = fs.readdirSync(dirImagen);
      const sqlInsertImg = `INSERT INTO imagenes_producto (id_producto, url) VALUES(?,?)`;
      for (const archivo of archivos) {
        const rutaRelativa = path.join("imagenes-catalogo", slug, archivo);
        await db.execute(sqlInsertImg, [idProducto, rutaRelativa]);
      }
    } else {
      console.warn(`No se encontraron imagenes para: ${nombre}`);
    }
  }

  console.log("carga de producto e imagenes completada");
};

cargaProductos();
