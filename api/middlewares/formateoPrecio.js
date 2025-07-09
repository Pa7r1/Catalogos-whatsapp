//funcion para formatear los precios
export function convertirPrecio(preciostr) {
  return parseFloat(
    preciostr
      .replace(/\s/g, "")
      .replace("$", "")
      .replace(".", "")
      .replace(",", ".")
  );
}
