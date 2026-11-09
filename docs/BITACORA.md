# Bitácora

Una entrada por sesión. Los números son los medidos; donde no hubo medición
dice "sin medir". El detalle de cada medición está en `docs/00-ANTES.md` y
`docs/MEDICIONES.md`; aquí va el resumen y lo que no está en ningún otro sitio.

---

## Sesión 1 · 2026-11-09 · App generada sin reglas

### Qué se construyó

- **MercadoTech Lite** (Fase 1.2): tienda en Next.js 16.4.5 + React 19.3 +
  TypeScript + Tailwind 4, con datos en SQLite (`node:sqlite`, sin
  dependencias) en `data/tienda.db`, que se crea con 12 productos al arrancar.
  Páginas: catálogo con búsqueda y filtro por categoría, detalle, carrito,
  compra (registra el pedido y descuenta stock; no cobra), pedidos, registro,
  login y `/admin` para dar de alta productos.
  Tamaño: commit `b45dc7c`, 31 archivos, +1833 / −124 líneas.
- **`docs/00-ANTES.md`** (Fases 1.1 y 1.3): entorno, cómo pago, modo de
  aprobación (`auto`, con el riesgo aceptado), criterio de modelo, factura de
  la generación e inventario de daños.
- **Primera corrida de la tarea patrón** (Fase 1.4): paginación del catálogo,
  6 productos por página, con la página en la URL (`?page=N`). Commit
  `2af3196`. Resultado en `docs/MEDICIONES.md`.
- **Cierre**: esta bitácora y el `.gitignore` revisado.

### Qué decidió el agente sin que se lo pidiera

En la generación (Fase 1.2), visto en el código:

- Separar las lecturas en `src/lib/data.ts` y la conexión en `src/lib/db.ts`.
  Las páginas no tocan la base. Las escrituras sí quedaron con SQL dentro de
  `src/app/actions.ts` (9 `.prepare(`).
- Contraseñas con `scrypt` de `node:crypto` y sal aleatoria; sesión en el
  servidor (tabla `sessions`, token hasheado con SHA-256, cookie `httpOnly`).
- Carrito en una cookie de 14 días; precio y stock se releen siempre de la base.
- Precios en céntimos enteros; formato `es-PE` / `PEN` centralizado en
  `src/lib/money.ts`; zona `America/Lima`.
- La compra corre en una transacción: si falta stock de un producto, no se
  registra nada.
- Reescribió el `README.md` y añadió `/data/` al `.gitignore`.

En la auditoría (Fase 1.3): los greps del encargo apuntaban a `app/` y
`components/` y a Supabase; se reescribieron para `src/` y SQLite. Los dos
juegos de comandos están en `00-ANTES.md`.

En la tarea patrón (Fase 1.4): constante `PER_PAGE = 6` en `src/app/page.tsx`;
si `?page=` se pasa del final se muestra la última página; cambiar de
categoría vuelve a la página 1; la paginación conserva búsqueda y categoría.

En este cierre:

- Dos commits en vez de uno: `2af3196` solo con la tarea patrón, para que la
  sesión 2 la revierta con `git revert 2af3196` sin tocar nada más.
- Al `.gitignore` le añadí `.env*.local` explícito (ya lo cubría `.env*`),
  `*.db`, `*.db-shm`, `*.db-wal`, `*.sqlite`, `*.sqlite3`, `Thumbs.db`,
  `Desktop.ini` y `*.swp`.
- `doc_sesions/` (material del curso) se sube al repositorio público junto con
  el resto.

Reportadas por el agente en el chat de la Fase 1.2 y recuperadas al cierre
del ensayo (ese chat se cerró antes de que quedaran escritas). Con ⚠️, las que
un responsable del producto habría querido aprobar antes:

- ⚠️ Eligió `node:sqlite`, una API que Node marca como **experimental**, en vez
  de un paquete estable como `better-sqlite3`.
- ⚠️ Actualizó `@types/node` de la versión 20 a la 24 por su cuenta.
- Usó la plantilla de `create-next-app` con carpeta `src/`, App Router, Tailwind
  y ESLint. Esa plantilla además inicializó un repositorio git en la carpeta.
- Decidió que no hubiera API REST: los formularios llaman directamente a
  Server Actions.
- Cada lectura de la base espera la petición real del visitante
  (`connection()`); sin eso, Next.js habría consultado al compilar y el stock y
  los precios habrían quedado congelados.
- ⚠️ Agregó funcionalidades que el encargo **no** pedía: buscador, filtro por
  categoría, página "Mis pedidos", pantalla de confirmación de compra y una
  página 404 propia.
- ⚠️ Inventó texto de publicidad que nadie escribió: "Envío gratis" y tres
  sellos de envío, garantía y cambios.
- ⚠️ Inventó los nombres y las descripciones de los 12 productos de ejemplo.
- ⚠️ Decidió que hace falta iniciar sesión para comprar. No se lo pidieron.
- ⚠️ Dejó `/admin` sin ningún control de acceso y no creó el concepto de
  administrador. En esa página solo se pueden crear productos, no editarlos ni
  borrarlos.
- Quitó el modo oscuro que traía la plantilla y dejó tema claro fijo.
- Los productos no llevan fotos: fondo degradado con un emoji por categoría.
- Fijó la duración de las sesiones en 30 días.
- La redirección posterior al login solo acepta rutas internas.
- Un pedido solo lo ve su dueño.
- Escribió un script de prueba de punta a punta **fuera** del repositorio, lo
  ejecutó una vez y borró la base de datos que había generado.
- No probó la tienda en un celular ni en un navegador visual.

**Total: 26 decisiones no pedidas registradas en esta sección**, de las cuales
7 están marcadas con ⚠️. Ninguna es un error; varias son buenas. El punto es
que son decisiones del producto y las tomó el agente, sin avisar.

### Qué costó

| Tramo | Uso del plan (`/cost`, % semanal) | Duración | Turnos de corrección |
|---|---|---|---|
| Fase 1.2 · generación | 26 % → 26 % (por debajo de la resolución) | 12 min | 0 |
| Fase 1.4 · tarea patrón | sin resolución para una tarea | 4 min | 0 |
| Fases 1.1, 1.3 y cierre | sin medir | sin medir | sin medir |

En dólares: sin medir. Pago plan de suscripción, no saldo de API. Al empezar,
el uso semanal estaba en 26 %; se reinicia el 2026-11-14.

### Qué salió mal

- **`/admin` sin control de acceso** (defecto 4a): cualquiera, sin cuenta,
  crea productos. El enlace "Administrar" se muestra a todos. No existe el
  concepto de administrador.
- **Valores incrustados** (defecto 2): no hay carpeta de constantes; el mínimo
  de 8 caracteres de la contraseña está duplicado en `actions.ts:135` y
  `AuthCard.tsx:28`.
- **Cero pruebas** (defecto 3): `npm test` → `Missing script: "test"`.
- **Reglas de negocio y SQL mezclados** en `src/app/actions.ts` (forma parcial
  del defecto 1).
- **La tarea patrón ya estaba hecha.** La app de la 1.2 ya filtraba por
  categoría con `?cat=`, así que la 1.4 se corrió con el enunciado alterno de
  paginación. La fila S1 de `MEDICIONES.md` no mide el enunciado original de
  `TAREA_PATRON.md` §1.
- **El instrumento de auditoría no encajaba con la app**: los greps del
  encargo fallaron con `No such file or directory` (exit 2) hasta
  reescribirlos.
- **No hay un commit por fase**, como pide la spec: las Fases 1.1 y 1.3 no
  tienen commit propio; su trabajo quedó en `2d65943` y `b45dc7c`.
- **El plan tiene dos nombres**: `/cost` dice `Claude Ultra` y
  `claude auth status` dice `subscriptionType: max`.
- **Sin medir**: el costo de las Fases 1.1, 1.3 y de este cierre, y los avisos
  de permiso del modo `auto` durante la generación.

### Pendiente para la sesión 2

1. Revertir la tarea patrón antes de la corrida S2: `git revert 2af3196`.
2. Decidir con el docente qué enunciado se usa en S2 y S3 (el original, que ya
   está hecho, o el de paginación), y avisarle de que el filtro ya existía.
3. Escribir el `CLAUDE.md` (no se hizo hoy a propósito).
4. Correr la tarea patrón en una conversación nueva y llenar la fila S2 de
   `MEDICIONES.md`, con el costo medido al cerrar la conversación.
5. Los defectos del inventario siguen abiertos: no se corrigió ninguno. Se
   cierran entre las sesiones 2 y 7, según la columna "Se cierra en" de
   `00-ANTES.md`.
