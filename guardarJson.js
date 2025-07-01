const data = JSON.stringify(resultado, null, 2);
const blob = new Blob([data], { type: "application/json" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "catalogo_whatsapp.json";
link.click();
