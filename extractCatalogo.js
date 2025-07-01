// Versión mejorada del script de extracción
const productos = Array.from(document.querySelectorAll("div._ak8l"));

const resultado = productos.map((producto) => {
  const nombre =
    producto.querySelector("span[title]")?.title || "Nombre no encontrado";

  // Extraer texto estructurado
  const textos = Array.from(producto.querySelectorAll('span[dir="auto"]'))
    .map((span) => span.innerText)
    .filter((txt) => txt !== nombre);

  // Identificar precio usando lógica más precisa
  const precioNode = [...producto.querySelectorAll("*")].find((el) =>
    /(\$|ARS|USD|EUR)\s*[\d.,]+/.test(el.textContent)
  );

  const precio =
    precioNode?.textContent.match(/(\$|ARS|USD|EUR)\s*[\d.,]+/)?.[0] ||
    "Sin precio";

  // Limpiar descripción
  const descripcion = textos
    .join("\n")
    .replace(precio, "")
    .replace(/(?:\*{2}.*?\*{2}|\*{1,2})/g, "") // Remover texto entre **
    .trim();

  return { nombre, descripcion, precio };
});

console.log(resultado);
