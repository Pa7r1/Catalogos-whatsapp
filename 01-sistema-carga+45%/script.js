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

      // ----------- EXTRACCIÓN DEL PRECIO NUMÉRICO ------------------
      const precioTexto = producto.precio.replace(/[^\d.,]/g, "");
      let valorNumerico = NaN;

      if (precioTexto.includes(",") && precioTexto.includes(".")) {
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

      // ----------- AUMENTO DEL 45% Y FORMATEO ------------------
      const precioAumentado = valorNumerico * 1.45;
      const precioFormateado = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(precioAumentado);

      // ----------- LIMPIEZA DE LA DESCRIPCIÓN ------------------
      let descripcion = producto.descripcion || "";

      // Quitar "(precio mayorista)" o similares entre paréntesis
      descripcion = descripcion.replace(/\(.*?precio mayorista.*?\)/gi, "");

      // Quitar precios en formato ARS 23,500.00 o $23.500, etc.
      descripcion = descripcion.replace(
        /ARS\s?\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?/gi,
        ""
      );
      descripcion = descripcion.replace(
        /\$\s?\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?/g,
        ""
      );

      // Eliminar dobles espacios, líneas vacías, y dejar limpio
      descripcion = descripcion
        .split("\n")
        .map((linea) => linea.trim())
        .filter((linea) => linea !== "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        nombre: producto.nombre?.trim() || "Nombre no disponible",
        descripcion: descripcion,
        precio: precioFormateado,
      };
    })
    .filter((p) => p !== null);

  const data = JSON.stringify(productosFinales, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "catalogo_final.json";
  link.click();
});
