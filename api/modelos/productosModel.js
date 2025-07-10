import { db } from "./mysql";

const crearProducto = async (
  idProveedor,
  nombre,
  descripcion,
  precioProveedor,
  precioMiLocal
) => {
  const sql = "CALL SP_CrearProducto(?,?,?,?,?)";
  const [result] = await db.execute(sql, [
    idProveedor,
    nombre,
    descripcion,
    precioProveedor,
    precioMiLocal,
  ]);
  return result;
};

const actualizarProducto = async (
  idProducto,
  nombre,
  descripcion,
  precioProveedor,
  precioMiLocal
) => {
  const sql = `CALL SP_ActualizarProducto(?,?,?,?,?)`;
  const [result] = await db.execute(sql, [
    idProducto,
    nombre,
    descripcion,
    precioProveedor,
    precioMiLocal,
  ]);
  return result;
};

const eliminarProducto = async (idProducto) => {
  const sql = "CALL SP_EliminarProducto(?)";
  const [result] = await db.execute(sql, idProducto);
  return result;
};

const listarPorProveedor = async (idProveedor) => {
  const sql = `CALL SP_ListarProductosPorProveedor(?)`;
  const [result] = await db.execute(sql, idProveedor);
  return result;
};

const buscarPorNombre = async (nombre) => {
  const sql = `CALL SP_BuscarProductosPorNombre(?)`;
  const [result] = await db.execute(sql, nombre);
  return result;
};

const productosModelo = {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  listarPorProveedor,
  buscarPorNombre,
};
