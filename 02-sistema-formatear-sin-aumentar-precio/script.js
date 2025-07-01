let productos = [];

document
  .getElementById("archivoJson")
  .addEventListener("change", function (event) {
    const archivo = event.target.files[0];
    const lector = new FileReader();

    lector.onload = function (e) {
      try {
        productos = JSON.parse(e.target.result);
        alert("Archivo cargado correctamente.");
      } catch (error) {
        alert("Error al leer el JSON.");
      }
    };

    lector.readAsText(archivo);
  });

document.getElementById("procesar").addEventListener("click", () => {
  if (productos.length === 0) {
    alert("Primero debes cargar un archivo JSON.");
    return;
  }

  const productosFinales = productos
    .map((producto) => {
      if (
        !producto.precio ||
        producto.precio.toLowerCase().includes("sin precio")
      )
        return null;

      // Obtener número del campo precio
      const precioTexto = producto.precio.replace(/[^\d,\.]/g, "");
      let valorNumerico = NaN;

      // Detectar si el número está en formato tipo "19.700,00" (europeo) o "19,700.00" (americano)
      if (precioTexto.includes(",") && precioTexto.includes(".")) {
        // Detectar el formato: si la coma está después del punto, es formato europeo
        if (precioTexto.indexOf(",") > precioTexto.indexOf(".")) {
          valorNumerico = parseFloat(
            precioTexto.replace(/\./g, "").replace(",", ".")
          );
        } else {
          valorNumerico = parseFloat(precioTexto.replace(/,/g, ""));
        }
      } else if (precioTexto.includes(",")) {
        const partes = precioTexto.split(",");
        if (partes[1]?.length === 2) {
          valorNumerico = parseFloat(
            precioTexto.replace(/\./g, "").replace(",", ".")
          );
        } else {
          valorNumerico = parseFloat(precioTexto.replace(/,/g, ""));
        }
      } else {
        valorNumerico = parseFloat(precioTexto.replace(/\./g, ""));
      }

      if (isNaN(valorNumerico) || valorNumerico < 100) return null;

      const precioFormateado = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }).format(valorNumerico);

      // LIMPIEZA DE DESCRIPCIÓN: mantener desde "Talle:" o "Talles:"
      const descripcionCruda = producto.descripcion || "";
      const regexTalle = /(Talle?s?:.*)/i;
      const descripcionLimpia =
        descripcionCruda.match(regexTalle)?.[1]?.trim() ||
        descripcionCruda.trim();

      return {
        nombre: producto.nombre?.trim() || "Nombre no disponible",
        descripcion: descripcionLimpia,
        precio: precioFormateado,
      };
    })
    .filter((p) => p !== null);

  const data = JSON.stringify(productosFinales, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "catalogo_limpio.json";
  link.click();
});
