# 📦 Sistema de Catálogo y Pedidos para WhatsApp Web

Sistema local hecho con JavaScript, HTML y CSS  
Permite extraer, limpiar, comparar y gestionar catálogos desde **WhatsApp Web**

---

## ⚙️ Flujo de trabajo

### 1. 📥 Extracción desde WhatsApp Web

- Se ejecuta un **extractCatalogo.js** en la consola del navegador (DevTools)
- Recorre los productos del catálogo desde el chat de WhatsApp Web
- Obtiene nombre, descripción, precios, etc. (incluye datos no deseados)

### 2. 🧾 Descarga de datos

- Se ejecuta un **guardarJson.js** en la consola
- Descarga los datos obtenidos como un archivo `.json`
- Ese archivo es el "catálogo crudo"

---

## 🧹 Limpieza de Catálogo

- Sistema web con HTML + JS para limpiar el `.json` crudo
- Elimina frases como "precio mayorista", "envío gratis", etc.
- Guarda un nuevo `.json` limpio

---

## 💰 Aumento de Precios

- Otro sistema permite cargar el `.json` limpio
- Aplica un aumento de precio configurable (ej: +45%)
- También vuelve a limpiar por si hay residuos
- Guarda un segundo `.json` limpio con aumento

---

## 📊 Comparador de Catálogos

- Sistema 1: Compara el **catálogo limpio original**
- Sistema 2: Compara el **catálogo limpio con aumento**
- Permite ver diferencias entre el de fábrica y el del local
- Útil para revisar márgenes o cambios

---

## 📝 Gestión de Pedidos

### 🏭 Para Fábrica / Mayorista
- Usa el `.json` limpio sin aumento
- Permite seleccionar cliente, talle, color, cantidad
- Calcula total
- Exporta a `.xlsx`

### 🏬 Para el Local
- Usa el `.json` con aumento
- Permite mismas opciones (cliente, talle, etc.)
- Precio se carga automáticamente
- Exporta pedido como archivo `.xlsx`

---

## 🧱 Tecnologías usadas

- HTML
- CSS
- JavaScript
- SheetJS (`xlsx`) – para exportar a Excel

---
