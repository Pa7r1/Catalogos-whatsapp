let catalogoUsuario = [];
let catalogoProveedor = [];
let productosComunes = [];

function normalizarNombre(nombre) {
  return nombre?.toString().toLowerCase().replace(/\s+/g, " ").trim() || "";
}

function cargarArchivoJson(input, callback) {
  const archivo = input.files[0];
  const lector = new FileReader();

  lector.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      callback(data);
    } catch (error) {
      alert("Error al procesar el archivo JSON: " + error.message);
      document.getElementById("comparar").disabled = true;
    }
  };

  lector.onerror = () => {
    alert("Error al leer el archivo");
    document.getElementById("comparar").disabled = true;
  };

  lector.readAsText(archivo);
}

function mostrarNombresArchivos() {
  const inputUsuario = document.getElementById("archivoUsuario");
  const inputProveedor = document.getElementById("archivoProveedor");
  const nombreUsuario = document.getElementById("nombreUsuario");
  const nombreProveedor = document.getElementById("nombreProveedor");
  const compararBtn = document.getElementById("comparar");

  if (inputUsuario.files.length > 0) {
    nombreUsuario.textContent = inputUsuario.files[0].name;
  } else {
    nombreUsuario.textContent = "No se ha seleccionado ningún archivo";
  }

  if (inputProveedor.files.length > 0) {
    nombreProveedor.textContent = inputProveedor.files[0].name;
  } else {
    nombreProveedor.textContent = "No se ha seleccionado ningún archivo";
  }

  // Habilitar botón solo si ambos archivos están seleccionados
  compararBtn.disabled = !(
    inputUsuario.files.length > 0 && inputProveedor.files.length > 0
  );
}

document
  .getElementById("archivoUsuario")
  .addEventListener("change", mostrarNombresArchivos);
document
  .getElementById("archivoProveedor")
  .addEventListener("change", mostrarNombresArchivos);

document.getElementById("comparar").addEventListener("click", () => {
  const inputUsuario = document.getElementById("archivoUsuario");
  const inputProveedor = document.getElementById("archivoProveedor");

  if (!inputUsuario.files.length || !inputProveedor.files.length) {
    alert("Por favor, carga ambos archivos JSON antes de comparar.");
    return;
  }

  // Mostrar spinner de carga
  const cargando = document.getElementById("cargando");
  cargando.style.display = "block";
  const compararBtn = document.getElementById("comparar");
  compararBtn.disabled = true;
  compararBtn.textContent = "Procesando...";

  // Usar setTimeout para permitir que la UI se actualice
  setTimeout(() => {
    try {
      cargarArchivoJson(inputUsuario, (jsonUsuario) => {
        cargarArchivoJson(inputProveedor, (jsonProveedor) => {
          // Normalizar solo los nombres
          catalogoUsuario = jsonUsuario.map((p) => normalizarNombre(p.nombre));
          catalogoProveedor = jsonProveedor.map((p) =>
            normalizarNombre(p.nombre)
          );

          // Actualizar estadísticas
          document.getElementById("totalUsuario").textContent =
            catalogoUsuario.length;
          document.getElementById("totalProveedor").textContent =
            catalogoProveedor.length;

          // Crear Sets para búsquedas rápidas
          const setUsuario = new Set(catalogoUsuario);
          const setProveedor = new Set(catalogoProveedor);

          // Encontrar productos comunes
          productosComunes = catalogoUsuario.filter((nombre) =>
            setProveedor.has(nombre)
          );
          document.getElementById("totalComunes").textContent =
            productosComunes.length;

          // Encontrar productos exclusivos
          const soloUsuario = catalogoUsuario.filter(
            (nombre) => !setProveedor.has(nombre)
          );
          const soloProveedor = catalogoProveedor.filter(
            (nombre) => !setUsuario.has(nombre)
          );

          // Actualizar contadores
          document.getElementById(
            "contadorUsuario"
          ).textContent = `${soloUsuario.length} productos`;
          document.getElementById(
            "contadorProveedor"
          ).textContent = `${soloProveedor.length} productos`;

          // Calcular porcentajes
          const porcentajeUsuario =
            catalogoUsuario.length > 0
              ? ((soloUsuario.length / catalogoUsuario.length) * 100).toFixed(1)
              : 0;

          const porcentajeProveedor =
            catalogoProveedor.length > 0
              ? (
                  (soloProveedor.length / catalogoProveedor.length) *
                  100
                ).toFixed(1)
              : 0;

          document.getElementById(
            "porcentajeUsuario"
          ).textContent = `${porcentajeUsuario}% de tu catálogo`;
          document.getElementById(
            "porcentajeProveedor"
          ).textContent = `${porcentajeProveedor}% del proveedor`;

          // Renderizar resultados en lotes para mejorar rendimiento
          function renderizarLista(elementoId, datos) {
            const elemento = document.getElementById(elementoId);
            elemento.innerHTML = "";

            if (datos.length === 0) {
              elemento.innerHTML =
                '<li class="empty">No se encontraron productos</li>';
              return;
            }

            // Renderizar en lotes para mejor rendimiento
            const batchSize = 100;
            let index = 0;

            function procesarLote() {
              const fin = Math.min(index + batchSize, datos.length);

              for (; index < fin; index++) {
                const li = document.createElement("li");
                li.textContent = datos[index];
                elemento.appendChild(li);
              }

              if (index < datos.length) {
                setTimeout(procesarLote, 1);
              }
            }

            procesarLote();
          }

          renderizarLista("soloUsuario", soloUsuario);
          renderizarLista("soloProveedor", soloProveedor);

          // Ocultar spinner
          cargando.style.display = "none";
          compararBtn.disabled = false;
          compararBtn.textContent = "Comparar catálogos";
        });
      });
    } catch (error) {
      alert("Ocurrió un error durante la comparación: " + error.message);
      cargando.style.display = "none";
      compararBtn.disabled = false;
      compararBtn.textContent = "Comparar catálogos";
    }
  }, 100);
});
