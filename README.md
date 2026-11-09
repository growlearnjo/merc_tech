# MercadoTech Lite

Tienda web de tecnología: catálogo, detalle, carrito, compra (sin cobro: registra
el pedido y descuenta stock), registro / inicio de sesión y página para cargar
productos. Next.js 16 + TypeScript + Tailwind, datos en SQLite dentro del proyecto.

## Requisitos

Node 22.13 o superior (usa `node:sqlite`, que viene con Node; no hay que
instalar ninguna base de datos).

## Arrancar

```bash
npm install
npm run dev        # desarrollo: http://localhost:3000
# o, para la demo:
npm run build && npm start
```

La primera vez se crea `data/tienda.db` con 12 productos de ejemplo.
Para volver al estado inicial, detén el servidor y borra la carpeta `data/`.

## Páginas

| Ruta | Qué hace |
|---|---|
| `/` | Catálogo con búsqueda y filtro por categoría |
| `/productos/[id]` | Detalle y "Agregar al carrito" |
| `/carrito` | Cantidades, total y "Finalizar compra" (pide sesión) |
| `/pedidos` | Pedidos del usuario |
| `/login`, `/registro` | Cuentas |
| `/admin` | Alta de productos — **sin control de acceso** (decisión para la demo) |

## Notas

- Precios guardados en céntimos (enteros) y mostrados en soles (`S/`).
- El carrito vive en una cookie; precio y stock siempre se leen de la base.
- La compra corre en una transacción: si falta stock de algún producto, no se
  registra nada.
- Node muestra `ExperimentalWarning: SQLite is an experimental feature`: es
  esperado y no afecta el funcionamiento.
