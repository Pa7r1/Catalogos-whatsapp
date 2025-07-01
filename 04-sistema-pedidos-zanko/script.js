let productos = [];
let pedidos = [];

const colorMap = {
  Blanco: "#ffffff",
  Negro: "#000000",
  Rojo: "#ff0000",
  Azul: "#0000ff",
  Verde: "#00ff00",
  Amarillo: "#ffff00",
  Rosa: "#ffc0cb",
  Gris: "#808080",
  Multicolor: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)",
};

document.getElementById("inputJson").addEventListener("change", function (e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    try {
      productos = JSON.parse(e.target.result);
      productos.forEach((p) => {
        if (typeof p.precio === "string") {
          p.precio = parseFloat(
            p.precio.replace(",", ".").replace(/[^0-9.]/g, "")
          );
        }
      });
      productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      cargarProductos();
      showStatusMessage(`Archivo cargado: ${archivo.name}`, "success");
    } catch (error) {
      showStatusMessage(
        `Error al cargar el archivo: ${error.message}`,
        "error"
      );
    }
  };
  lector.readAsText(archivo);
});

function showStatusMessage(message, type) {
  const status = document.getElementById("statusMessage");
  status.textContent = message;
  status.className = `status-message ${type}`;
  setTimeout(() => {
    status.className = "status-message";
  }, 5000);
}

document.getElementById("color").addEventListener("input", function () {
  const preview = document.getElementById("colorPreview");
  const name = this.value.trim();
  preview.style.background =
    colorMap[name] || "#" + Math.floor(Math.random() * 16777215).toString(16);
});

function cargarProductos() {
  const select = document.getElementById("productoSelect");
  select.innerHTML = `<option value="" disabled selected>Selecciona un producto</option>`;
  productos.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.nombre;
    option.textContent = p.nombre;
    select.appendChild(option);
  });
}

function agregarPedido() {
  const nombre = document.getElementById("productoSelect").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const cliente = document.getElementById("cliente").value.trim();
  const talle = document.getElementById("talle").value.trim();
  const color = document.getElementById("color").value.trim();

  if (!nombre || !cantidad || cantidad <= 0 || !cliente || !talle || !color) {
    return showStatusMessage(
      "Todos los campos son obligatorios y válidos",
      "error"
    );
  }

  const producto = productos.find((p) => p.nombre === nombre);
  if (!producto || isNaN(producto.precio)) {
    return showStatusMessage(`Producto o precio inválido`, "error");
  }

  const fecha = new Date().toLocaleString("es-AR");

  const pedido = {
    fecha,
    cliente,
    talle,
    color,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    cantidad,
    total: parseFloat((producto.precio * cantidad).toFixed(3)),
  };

  pedidos.push(pedido);
  mostrarPedidos();
  showStatusMessage("Pedido agregado con éxito", "success");

  // Limpiar
  ["cantidad", "cliente", "talle", "color"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  document.getElementById("colorPreview").style.background = "#ddd";
}

function mostrarPedidos() {
  const tbody = document.querySelector("#tablaPedidos tbody");
  tbody.innerHTML = "";
  let totalGeneral = 0;

  pedidos.forEach((pedido, index) => {
    const colorCode =
      colorMap[pedido.color] ||
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    totalGeneral += pedido.total;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${pedido.fecha}</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.talle}</td>
      <td><div class="color-preview" style="background: ${colorCode}"></div> ${
      pedido.color
    }</td>
      <td>${pedido.nombre}</td>
      <td>${pedido.descripcion}</td>
      <td>$${pedido.precio.toFixed(3)}</td>
      <td>${pedido.cantidad}</td>
      <td>$${pedido.total.toFixed(3)}</td>
      <td>
        <button class="btn btn-warning" onclick="editarPedido(${index})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger" onclick="eliminarPedido(${index})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  document.getElementById(
    "totalGeneral"
  ).textContent = `$${totalGeneral.toFixed(3)}`;
}

function editarPedido(index) {
  const pedido = pedidos[index];
  const nuevaCantidad = prompt("Nueva cantidad:", pedido.cantidad);
  const nuevoTalle = prompt("Nuevo talle:", pedido.talle);

  if (nuevaCantidad && parseInt(nuevaCantidad) > 0 && nuevoTalle) {
    pedido.cantidad = parseInt(nuevaCantidad);
    pedido.talle = nuevoTalle.trim();
    pedido.total = parseFloat((pedido.precio * pedido.cantidad).toFixed(3));
    mostrarPedidos();
    showStatusMessage("Pedido actualizado", "success");
  } else {
    showStatusMessage("Valores inválidos o cancelados", "error");
  }
}

function eliminarPedido(index) {
  if (confirm("¿Eliminar este pedido?")) {
    pedidos.splice(index, 1);
    mostrarPedidos();
    showStatusMessage("Pedido eliminado", "success");
  }
}

function exportarExcel() {
  if (!pedidos.length) {
    return showStatusMessage("No hay pedidos para exportar", "error");
  }
  try {
    const ws = XLSX.utils.json_to_sheet(pedidos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    XLSX.writeFile(wb, "pedidos_zapatillas.xlsx");
    showStatusMessage("Exportado correctamente", "success");
  } catch (err) {
    showStatusMessage("Error al exportar: " + err.message, "error");
  }
}

document.getElementById("colorPreview").style.background = "#ddd";
