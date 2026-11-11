# VoltTech: tienda de tecnología (demo)

Next.js 16 + TypeScript + Tailwind. Los datos se guardan en SQLite dentro del proyecto
(`data/tienda.db`) usando el módulo `node:sqlite` que ya viene con Node. No hay que
instalar ninguna base ni usar servicios en la nube.

## Requisitos

- Node.js 22.13 o superior (probado con 24.11).

## Cómo correrla

```bash
npm install
npm run build
npm start          # http://localhost:3000
```

Para desarrollo: `npm run dev`.

Al iniciar por primera vez se crea `data/tienda.db` con 12 productos de ejemplo.
Para volver a empezar de cero (borra usuarios, pedidos y productos cargados), **con el servidor apagado**:

```bash
npm run db:reset
```

Para abrirla desde el celular en la misma red Wi-Fi, usa la dirección "Network" que
muestra `npm start` (ej. `http://192.168.0.6:3000`).

## Qué incluye

| Ruta | Qué hace |
|---|---|
| `/` | Catálogo con búsqueda y filtro por categoría |
| `/producto/[id]` | Detalle, selector de cantidad y "Agregar al carrito" |
| `/carrito` | Carrito (se guarda en el navegador) y confirmación del pedido |
| `/registro`, `/login` | Cuentas con contraseña cifrada (scrypt) y sesión por cookie |
| `/pedido/[id]`, `/pedidos` | Confirmación e historial de pedidos del usuario |
| `/admin` | Formulario para cargar productos e inventario con stock |

La compra **no cobra**: registra el pedido y descuenta el stock en una sola transacción.
El precio y el stock se validan en el servidor, así que no se puede vender más de lo que hay.

## Pendiente antes de producción

- **`/admin` no tiene control de permisos**: cualquiera que abra la URL puede cargar productos.
  Para la demo es aceptable. Antes de publicarla hay que restringirla a administradores.
- Los textos de envío, garantía y cambios ("Envío gratis desde S/ 199", "12 meses de garantía"…) son de ejemplo.
- Node muestra el aviso `ExperimentalWarning: SQLite is an experimental feature`. Es informativo y no afecta el funcionamiento.
