const API_BASE = "/api/productos";
const GENERIC_PRODUCT_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#081323"/>
      <stop offset="50%" stop-color="#0f2f46"/>
      <stop offset="100%" stop-color="#04111a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0%" stop-color="#42efff"/>
      <stop offset="100%" stop-color="#bef264"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" rx="36" fill="url(#bg)"/>
  <circle cx="510" cy="96" r="70" fill="#42efff" opacity="0.09"/>
  <circle cx="118" cy="102" r="54" fill="#bef264" opacity="0.08"/>
  <rect x="158" y="104" width="324" height="184" rx="28" fill="#0c1d30" stroke="url(#accent)" stroke-width="8"/>
  <rect x="188" y="132" width="264" height="128" rx="18" fill="#091624"/>
  <path d="M208 228c34-48 70-71 108-71 30 0 54 11 76 35 13 14 27 22 42 22h18v24H188v-18l20 8Z" fill="#42efff" opacity="0.92"/>
  <path d="M276 318h88l18 38H258l18-38Z" fill="#13304e" stroke="#42efff" stroke-width="5"/>
  <rect x="244" y="356" width="152" height="18" rx="9" fill="#bef264" opacity="0.86"/>
  <g transform="translate(118 286)">
    <rect x="0" y="20" width="124" height="74" rx="34" fill="#0d1f33" stroke="#42efff" stroke-width="6"/>
    <circle cx="42" cy="56" r="14" fill="#42efff"/>
    <circle cx="82" cy="48" r="10" fill="#bef264"/>
    <circle cx="98" cy="68" r="10" fill="#fb923c"/>
    <rect x="26" y="50" width="32" height="10" rx="5" fill="#dffcff" opacity="0.9"/>
    <rect x="37" y="39" width="10" height="32" rx="5" fill="#dffcff" opacity="0.9"/>
  </g>
  <text x="50%" y="434" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#dffcff">Producto gamer</text>
</svg>
`)}`;

let editandoId = null;

const tbody = document.getElementById("tbodyProductos");
const btnCargar = document.getElementById("btnCargar");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const formTitle = document.getElementById("formTitle");
const statusDiv = document.getElementById("status");
const cardsContainer = document.getElementById("cardsProductos");
const catalogStatusDiv = document.getElementById("catalogStatus");
const btnRecargarCards = document.getElementById("btnRecargarCards");

const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");

function setStatus(element, mensaje, tipo = "ok") {
  if (!element) return;
  element.textContent = mensaje;
  element.className = `status ${tipo}`;
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getStockMeta(stock) {
  if (stock <= 0) {
    return { label: "Sin stock", className: "out" };
  }
  if (stock <= 10) {
    return { label: `Ultimas ${stock} unidades`, className: "low" };
  }
  return { label: `${stock} unidades disponibles`, className: "high" };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function obtenerProductos() {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error("Error al cargar productos");
  }
  return res.json();
}

async function cargarProductosAdmin() {
  try {
    const data = await obtenerProductos();
    renderTabla(data);
    setStatus(statusDiv, "Productos cargados correctamente.", "ok");
  } catch (err) {
    console.error(err);
    setStatus(statusDiv, "No se pudieron cargar los productos. Verifica el backend.", "error");
  }
}

async function cargarProductosCatalogo() {
  try {
    const data = await obtenerProductos();
    renderCards(data);
    setStatus(catalogStatusDiv, "Catalogo actualizado.", "ok");
  } catch (err) {
    console.error(err);
    renderCards([]);
    setStatus(catalogStatusDiv, "No se pudo cargar el catalogo. Verifica el backend.", "error");
  }
}

function renderCards(productos) {
  if (!cardsContainer) return;

  if (!productos.length) {
    cardsContainer.innerHTML = '<article class="empty-state">No hay productos disponibles en este momento.</article>';
    return;
  }

  cardsContainer.innerHTML = productos
    .map((producto) => {
      const stockMeta = getStockMeta(Number(producto.stock));
      return `
        <article class="product-card">
          <img class="product-image" src="${GENERIC_PRODUCT_IMAGE}" alt="Imagen generica del producto ${escapeHtml(producto.nombre)}" />
          <div class="product-body">
            <div class="product-meta">
              <span class="product-id">Producto #${producto.id}</span>
              <span class="stock-pill ${stockMeta.className}">${stockMeta.label}</span>
            </div>
            <div>
              <h3>${escapeHtml(producto.nombre)}</h3>
              <p>${escapeHtml(producto.descripcion || "Equipamiento pensado para gamers que buscan mejor rendimiento y estilo.")}</p>
            </div>
            <div class="product-footer">
              <div class="product-price">
                <span class="stock-label">Precio</span>
                <strong class="price-value">${formatPrice(producto.precio)}</strong>
              </div>
              <a class="nav-link" href="/admin.html">Gestionar</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTabla(productos) {
  if (!tbody) return;

  if (!productos.length) {
    tbody.innerHTML = '<tr><td colspan="6">No hay productos registrados.</td></tr>';
    return;
  }

  tbody.innerHTML = productos
    .map(
      (producto) => `
        <tr>
          <td>${producto.id}</td>
          <td>${escapeHtml(producto.nombre)}</td>
          <td>${escapeHtml(producto.descripcion || "")}</td>
          <td>${formatPrice(producto.precio)}</td>
          <td>${producto.stock}</td>
          <td>
            <div class="table-actions">
              <button data-id="${producto.id}" class="table-btn btn-editar" type="button">Editar</button>
              <button data-id="${producto.id}" class="table-btn danger btn-eliminar" type="button">Eliminar</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function limpiarFormulario() {
  editandoId = null;
  if (formTitle) formTitle.textContent = "Nuevo producto";
  if (inputNombre) inputNombre.value = "";
  if (inputDescripcion) inputDescripcion.value = "";
  if (inputPrecio) inputPrecio.value = "";
  if (inputStock) inputStock.value = "";
}

function obtenerDatosFormulario() {
  return {
    nombre: inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    precio: parseFloat(inputPrecio.value),
    stock: parseInt(inputStock.value, 10),
  };
}

function validarProducto(producto) {
  if (!producto.nombre) return "El nombre es obligatorio.";
  if (Number.isNaN(producto.precio) || producto.precio < 0) return "El precio debe ser un numero mayor o igual a 0.";
  if (Number.isNaN(producto.stock) || producto.stock < 0) return "El stock debe ser un numero mayor o igual a 0.";
  return null;
}

async function guardarProducto() {
  const producto = obtenerDatosFormulario();
  const error = validarProducto(producto);

  if (error) {
    setStatus(statusDiv, error, "error");
    return;
  }

  const estabaEditando = Boolean(editandoId);

  try {
    let res;

    if (editandoId) {
      res = await fetch(`${API_BASE}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
    } else {
      res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Error al guardar el producto");
    }

    limpiarFormulario();
    await cargarProductosAdmin();
    setStatus(statusDiv, estabaEditando ? "Producto actualizado correctamente." : "Producto creado correctamente.", "ok");
  } catch (err) {
    console.error(err);
    setStatus(statusDiv, "Ocurrio un error al guardar el producto.", "error");
  }
}

async function editarProducto(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el producto");

    const producto = await res.json();
    editandoId = producto.id;
    formTitle.textContent = `Editar producto #${producto.id}`;
    inputNombre.value = producto.nombre;
    inputDescripcion.value = producto.descripcion || "";
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;
    setStatus(statusDiv, "Editando producto.", "info");
  } catch (err) {
    console.error(err);
    setStatus(statusDiv, "No se pudo cargar el producto para editarlo.", "error");
  }
}

async function eliminarProducto(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto");

    await cargarProductosAdmin();
    setStatus(statusDiv, "Producto eliminado correctamente.", "ok");
  } catch (err) {
    console.error(err);
    setStatus(statusDiv, "No se pudo eliminar el producto.", "error");
  }
}

if (tbody) {
  tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.getAttribute("data-id");
    if (!id) return;

    if (target.classList.contains("btn-editar")) {
      editarProducto(id);
      return;
    }

    if (target.classList.contains("btn-eliminar") && window.confirm("Seguro que deseas eliminar este producto?")) {
      eliminarProducto(id);
    }
  });
}

if (btnCargar) {
  btnCargar.addEventListener("click", cargarProductosAdmin);
}

if (btnGuardar) {
  btnGuardar.addEventListener("click", guardarProducto);
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", () => {
    limpiarFormulario();
    setStatus(statusDiv, "Edicion cancelada.", "info");
  });
}

if (btnRecargarCards) {
  btnRecargarCards.addEventListener("click", cargarProductosCatalogo);
}

if (cardsContainer) {
  cargarProductosCatalogo();
}

if (tbody) {
  cargarProductosAdmin();
}
