# Bitácora

Una entrada por sesión. Horas en hora local (UTC−5). Cada número sale de un
comando o de un archivo; donde no hay medición dice "sin medir".

---

## Sesión 1 — 2026-11-11 — La línea base

### Qué se construyó

- **La app.** Tienda de tecnología en Next.js 16 + TypeScript + Tailwind 4,
  con SQLite en `data/tienda.db` vía `node:sqlite` (sin dependencia de base).
  Rutas: catálogo `/`, detalle `/producto/[id]`, carrito `/carrito`,
  `/registro`, `/login`, `/pedido/[id]`, `/pedidos`, `/admin`. Se siembran
  12 productos al arrancar. El checkout descuenta stock en una transacción y no
  cobra. Detalle en `README.md`.
- **`docs/00-ANTES.md`.** Entorno (Node 24.11.1, npm 11.6.2, Git 2.51, Claude
  Code 2.1.206, plan Max), modo de aprobación elegido (`auto`) con su riesgo,
  la factura de la generación y el inventario de daños con comando y salida
  por defecto.
- **`docs/MEDICIONES.md`.** Fila S1 de la tarea patrón: **no comparable**
  (ver "Qué salió mal", punto 1).
- **`.gitignore`** y esta bitácora (cierre).

### Qué decidió el agente sin que se lo pidiera

En la generación (Fase 1.2), el encargo no decía nada de esto:

| Decisión | Dónde | Consecuencia |
|---|---|---|
| Capa de datos en `src/lib/` (`db.ts`, `products.ts`, `orders.ts`, `auth.ts`); ningún `.tsx` ejecuta SQL | `src/lib/` | El defecto 1 aparece solo en forma parcial: `src/app/actions.ts` todavía tiene SQL de usuarios en línea |
| Contraseñas con `scrypt` + sal | `src/lib/auth.ts:14` | Las formas b del defecto 4 no aparecieron |
| Sesión por cookie `httpOnly` con token hasheado en una tabla `sessions` (30 días) | `src/lib/auth.ts` | La forma c del defecto 4 no apareció |
| **Filtro por categoría y búsqueda** en el catálogo, con el estado en la URL (`?cat=`, `?q=`) | `src/app/page.tsx`, `src/lib/products.ts` | **Dejó hecha la tarea patrón** antes de medirla |
| Carrito en `localStorage`, sin tabla `cart_items` | `src/components/CartProvider.tsx` | El esquema no es el de `ENCARGO_LITE.md` §2; el carrito no sigue al usuario entre dispositivos |
| Esquema propio: `users`, `sessions`, `products` (`name`, `price_cents`), `orders`, `order_items` | `src/lib/db.ts` | Columnas distintas de las del encargo (`title`, `price`) |
| Marca "VoltTech" en vez de "MercadoTech Lite" | `README.md`, UI | Cosmético; el nombre del curso no aparece en la app |
| Textos de ejemplo: "Envío gratis en Lima desde S/ 199", "12 meses de garantía" | `src/app/page.tsx:32`, `src/app/producto/[id]/page.tsx:61` | Forman parte del defecto 2 |
| Scripts `typecheck` y `db:reset`; `data/` fuera de git | `package.json`, `.gitignore` | La base no se sube; se recrea al arrancar |
| `typescript@5` en lugar de la 7 que trajo `npm install` | `package.json` | Instalación no pedida, aprobada por el clasificador del modo `auto` |
| Pruebas E2E con Chrome headless y servidor en el puerto 3100 | fuera del proyecto (carpeta temporal) | No queda ninguna prueba en el repo: el defecto 3 sigue intacto |

En el cierre (esta conversación), el agente además:

- Reescribió el `.gitignore` que había dejado la generación (ver "Cierre").
- Corrió `curso-ed5/tokens.py` para tener tokens medidos en vez de "sin dato".

### Decisiones que tomé sin que me las pidieran

> Recuperada el **2026-11-11 (sesión 2)** de la conversación original de la
> Fase 1.2 (`b1471b87`), no escrita en el momento. Es la lista que el agente
> dio en el chat al cerrar esa fase, copiada sin rehacerla desde el código.

Marca **⚠ APROBAR** = el agente cree que habrías querido aprobarla antes. Es una
propuesta con el criterio de `00-ANTES.md` §2 (datos, arquitectura, seguridad),
con el riesgo aceptado en §3 (instalaciones no pedidas) y con lo que ve el
cliente. La decisión final es tuya.

| # | Decisión (tal como se dijo entonces) | ¿Aprobar antes? |
|---|---|---|
| | **Estructura y datos** | |
| 1 | Usé `node:sqlite` (el SQLite que trae Node) en lugar de `better-sqlite3` o Prisma: sin módulos nativos ni nada que instalar, pero Node lo marca como experimental y exige Node ≥ 22.13. | **⚠ APROBAR**: elige el motor de datos y depende de un módulo experimental. |
| 2 | Separé la lógica de datos en `src/lib/` y la del servidor en un solo `actions.ts`; sin API REST, solo Server Actions. | **⚠ APROBAR**: es la arquitectura de toda la app. |
| 3 | La base no se sube a git (`data/` en `.gitignore`), se crea sola al arrancar; agregué `npm run db:reset`. | — |
| 4 | Precios guardados en céntimos (enteros), no decimales. | — |
| 5 | Bajé TypeScript de la 7 a la 5 por compatibilidad con Next.js. | **⚠ APROBAR**: una instalación no pedida, el riesgo exacto de §3. |
| 6 | Cambié el orden del catálogo para que empiece por las laptops, por cómo se ve. | — |
| | **Permisos de la base de datos** | |
| 7 | No hay ninguno: SQLite no tiene usuarios ni roles; la app lee y escribe todo con el mismo proceso y quien tenga la carpeta tiene el archivo completo. | **⚠ APROBAR**: es seguridad de los datos. |
| 8 | La base queda dentro de OneDrive; la sincronización podría bloquear el archivo o crear copias en conflicto. | **⚠ APROBAR**: riesgo de corromper o perder datos. |
| 9 | `/admin` y la acción que crea productos están abiertas a cualquiera (pedido así), y la acción se puede llamar sin abrir la página. | **⚠ APROBAR**: lo abierto llega más lejos que la página que pediste. |
| | **Reglas de negocio que inventé** | |
| 10 | Para comprar hay que haber iniciado sesión. | **⚠ APROBAR**: cambia el flujo que verá el cliente en la demo. |
| 11 | Cada pedido pide dirección y teléfono. | — |
| 12 | Cada usuario solo ve sus propios pedidos. | — |
| 13 | El servidor rechaza la sobreventa y toma el precio de la base, no del navegador. | — |
| 14 | Agregué la página "Mis pedidos", que no estaba en el pedido. | — |
| | **Contenido** | |
| 15 | El nombre de la tienda es "VoltTech" (no coincide con "MercadoTech Lite"). | **⚠ APROBAR**: es la marca que ve el cliente. |
| 16 | Textos de envío gratis, garantía y cambios inventados; en el carrito el envío siempre dice "Gratis". | **⚠ APROBAR**: son promesas comerciales a nombre del cliente. |
| 17 | Ilustración por categoría en lugar de fotos. | — |
| | **Pruebas** | |
| 18 | Escribí una prueba E2E con Chrome headless (31/31), pero el script quedó en la carpeta temporal: en el repo no hay pruebas ni `npm test`. | **⚠ APROBAR**: deja sin pruebas el repo y cambia lo que se mide. |
| | **Cosas débiles que no arreglé** (dichas en la misma lista) | |
| 19 | El login no limita los intentos. | **⚠ APROBAR**: es seguridad de las cuentas. |
| 20 | Las sesiones vencidas nunca se borran de la base. | — |
| 21 | Si un precio cambia, el carrito puede mostrar el precio viejo (se cobra el de la base). | — |

**Total: 21 puntos**: 18 decisiones y 3 debilidades que se nombraron en la
misma lista. **11 marcadas ⚠ APROBAR** (1, 2, 5, 7, 8, 9, 10, 15, 16, 18, 19).

### Qué costó

Plan Max: **US$ 0 cobrados.** La columna ~USD es el valor a tarifa pública
(`curso-ed5/tokens.py`, tarifas consultadas el 2026-11-09), útil solo para
comparar.

Salida de `python -I curso-ed5/tokens.py` (2026-11-11, 16:06), con la fase
asignada por el primer mensaje de cada conversación:

| Fase | Conversación | Inicio | Turnos | Entrada | Caché esc. | Caché lec. | Salida | Duración | ~USD |
|---|---|---|---|---|---|---|---|---|---|
| Prompt 0 · terreno | `b7543045` | 14:29 | 23 | 50 | 128,699 | 1,499,782 | 10,688 | 2 min | 1.16 |
| Prompt 1 · lectura de la spec | `d995c786` | 14:40 | 6 | 12 | 164,050 | 263,860 | 9,142 | 1 min | 1.06 |
| 1.1 · entorno y modo | `cd03a2c0` | 14:52 | 16 | 36 | 126,298 | 1,029,882 | 11,318 | 3 min | 1.06 |
| 1.2 · generar la app | `b1471b87` | 15:02 | 135 | 274 | 425,383 | 14,743,930 | 395,796 | 30 min | 12.99 |
| 1.3 · factura y daños | `d43a8b5b` | 15:43 | 38 | 80 | 169,045 | 3,105,608 | 28,893 | 5 min | 2.04 |
| 1.4 · tarea patrón | `3af62490` | 15:57 | 21 | 46 | 110,723 | 1,586,033 | 11,088 | 4 min | 1.09 |
| Cierre (parcial, al correr el script) | `b71d60b8` | 16:05 | 16 | 32 | 151,375 | 1,130,225 | 7,521 | 1 min | 1.13 |
| **Total** | | | **255** | **530** | **1,275,573** | **23,359,320** | **474,446** | | **20.54** |

- La generación se llevó el **63 %** del valor (12.99 de 20.54) y el **83 %**
  de la salida (395,796 de 474,446 tokens).
- Sin caché, los 23.4 M tokens leídos habrían valido US$ 93.44; costaron
  US$ 4.67.
- La fila del cierre no es final: el script se corrió a mitad de esta
  conversación.
- Aprobaciones pedidas en modo `auto`: **sin medir** (el agente no ve qué
  ventanas mostró el clasificador).
- Corrige dos "sin dato" anteriores: la factura de `00-ANTES.md` §4 no tenía
  tokens (ahora: fila 1.2), y `MEDICIONES.md` S1 tenía costo y duración "sin
  medir" (ahora: fila 1.4, 4 min, ~US$ 1.09). No se editaron esos archivos.

### Qué salió mal

1. **La tarea patrón ya estaba hecha.** La generación agregó el filtro por
   categoría sin que el encargo lo pidiera. La corrida S1 de la Fase 1.4 no
   construyó nada y su fila **no sirve como "antes"** para la sesión 2.
2. **El esquema no es el del encargo.** Falta `cart_items`; hay `sessions` y
   `order_items`; las columnas se llaman distinto.
3. **No hubo un commit por fase.** El proyecto no era un repositorio git hasta
   el cierre. La spec pide "un commit por fase"; queda un solo commit con todo,
   y no se puede reconstruir qué cambió en cada fase.
4. **Los greps de `ENCARGO_LITE.md` §3 no corren tal cual**: buscan `app/` y
   `components/` en la raíz y llamadas de Supabase. Fallan por la ruta
   (`No such file or directory`), no por el código. Hubo que adaptarlos.
5. **Placeholders sin rellenar.** El Prompt 1 y el de cierre se pegaron con
   `<RUTA_PROYECTO>` y `<TU_REPO>` literales. En el cierre eso bloqueó el push:
   el agente no tenía la URL del remoto.
6. `npm install typescript` trajo la versión 7 y hubo que bajar a la 5.

### Los cuatro defectos (sin corregir)

| # | Defecto | Estado | Se cierra en |
|---|---|---|---|
| 1 | Componentes que consultan la BD | Parcial: SQL en línea en `src/app/actions.ts` (líneas 33–49) | S2 / S5 |
| 2 | Valores incrustados | Apareció: `120` y `99` duplicados en dos archivos cada uno, sin `constants` | S2 / S5 |
| 3 | Cero pruebas | Apareció: ni archivos de prueba ni script `test` | S6 |
| 4 | Seguridad abierta | Apareció: `/admin` y `createProductAction` sin control de quién llama | S6 / S7 |

### Cierre

- `.gitignore`: se mantuvieron `node_modules/`, `.next/`, `out/`,
  `next-env.d.ts`, `*.tsbuildinfo`, `data/` y `.env*`; se agregaron una línea
  explícita `.env*.local`, logs de npm, `coverage/`, `.vercel/` y archivos del
  sistema. Comprobado con `git check-ignore -v`.
- Búsqueda de claves en los archivos a subir: ninguna (detalle en el mensaje
  del cierre).

### Pendiente para la sesión 2

- [ ] **Avisar al docente** del punto 1 de "Qué salió mal" y decidir cómo se
      mide la S1: la spec propone sacar el filtro de `src/app/page.tsx` y
      repetir la Fase 1.4 en conversación nueva con el reloj corriendo.
- [ ] Escribir el `CLAUDE.md` (centro de la sesión 2; hoy no se escribió).
- [ ] Correr la tarea patrón S2 con `CLAUDE.md` y llenar su fila en
      `docs/MEDICIONES.md`. Medir con `curso-ed5/tokens.py`, no a mano.
- [ ] Decidir si `cart_items` entra en el alcance o se acepta el carrito en el
      navegador (material del revisor de la sesión 5).
- [ ] Si el push del cierre quedó pendiente: hacerlo antes de empezar y
      confirmar con `git log --oneline -1` que local y remoto coinciden.

---

## Sesión 2 — 2026-11-13 — El contrato y la segunda medición

### Qué se hizo, en orden

| Hora | Commit | Fase |
|---|---|---|
| 11:27 | `3fa13ef` | 2.1 · se escribe `CLAUDE.md` |
| 11:52 | `f019eac` | 2.2 · se revierte la tarea patrón S1 (`f9f38ce`) |
| 12:09 | `50dc3bd` | 2.3 · auditoría del `CLAUDE.md` (4 líneas cambiadas) |
| 12:37 | `1389e03` | 2.3 · segunda corrida de la tarea patrón (S2) y su fila |

### Las reglas del `CLAUDE.md` y a qué fila del inventario apuntan

Inventario = `docs/00-ANTES.md` §5.

| Línea del `CLAUDE.md` | Regla | Fila del inventario |
|---|---|---|
| 8–10 | No hay pruebas; no decir que pasaron | Defecto 3 · cero pruebas |
| 13–15 | `actions.ts` no ejecuta SQL; `users` pasa por `auth.ts` | Defecto 1 · forma parcial (SQL en `actions.ts`) |
| 16–18 | No agregar funciones, páginas, dependencias ni versiones no pedidas | Ninguna fila de los cuatro defectos. Sale del problema 5 (la generación hizo el filtro sin que se pidiera) y del riesgo de §3 (TypeScript 7 → 5 sin pedirlo) |
| 21–23 | Los valores ajustables viven en `src/lib/constants.ts` | Defecto 2 · valores incrustados |
| 24–26 | Ni valores en línea ni textos comerciales inventados | Defecto 2 (fila del grep `S/ ` y `12 meses`) |
| 29–30 | Filtros, búsqueda y paginación viven en la URL | Problema 5 · el filtro ya estaba en la URL |
| 31–33 | `localStorage` solo para el carrito; no crear `cart_items` | Problema 6 · esquema sin `cart_items`, y defecto 4 forma c |
| 36–39 | `/admin` y `createProductAction` exigen admin; hoy no se cumple | Defecto 4 · forma a |

### La auditoría

- `/doctor prompt-audit` dio **12 hallazgos**; **5** apuntaban a mi contrato.
- Al ejecutar el comando de verificación de cada regla salieron **3 más**.
- **Acepté 5.** Están en `50dc3bd`: falta `src/app/page.tsx:13` en la lista de
  valores, ruta completa en `src/app/page.tsx:32`, el grep de valores excluye
  `money.ts` y dice qué no cubre (`10`, `30`, `80`), y la regla de la URL
  avisa que la paginación no existía.
- **El hallazgo que el comando no vio:** la regla de la URL afirmaba que el
  catálogo paginaba, y en ese momento no paginaba. Su grep la daba por buena
  porque solo busca `useState`: un grep vacío no prueba que lo que la regla
  describe exista.

### Fase 2.2: caso de historial

**Caso A.** Había un commit con la app y otro aparte con la tarea patrón
(`f9f38ce`, toca `src/app/page.tsx` y `src/lib/products.ts`). Se revirtió con
`git revert` (`f019eac`); el commit original sigue en el historial para la
sesión 3.

### La fila S2 al lado de la S1

| | S1 · sin reglas | S2 · con `CLAUDE.md` |
|---|---|---|
| Resultado | ✅ sin intervención | ✅ sin intervención |
| Turnos de corrección | 0 | 0 |
| Estado de la página | La URL (`?page=`) | La URL (`?page=`) |
| Decisiones no pedidas | 13, 4 con ⚠️ | 13, 4 con ⚠️ |
| Dónde vive el 6 | `PAGE_SIZE` en `src/lib/products.ts` | `PRODUCTS_PER_PAGE` en `src/lib/constants.ts` |
| Dónde se pagina | En la base (`LIMIT`/`OFFSET` + `COUNT`) | En memoria (`slice` en `page.tsx`) |
| Salida (tokens) | 4,682 | 4,098 |
| Caché leída (tokens) | 610,325 | 385,561 |
| ~USD | 0.44 | 0.36 |
| Duración | 2 min | 1 min |

Costo y duración: del bloque del enunciado de cada conversación, con
`tokens.py --patron` (detalle en `docs/MEDICIONES.md`). Una corrida por
columna: la diferencia de costo y tiempo no alcanza para atribuirla al
contrato.

### Qué cambió y qué no

- **Empataron** en resultado, turnos, dónde vive el estado y número de
  decisiones no pedidas (13 y 4 ⚠️ en las dos). Las cuatro ⚠️ son las mismas
  en las dos corridas: el admin sin paginar, la página fuera de rango, volver a
  la página 1 al filtrar y el contador con el total.
- **Lo que esta tarea mide, según mi `CLAUDE.md`:** la línea 29 dice que la
  paginación vive en la URL y no en `useState`. La S1 ya lo hacía sin reglas,
  así que esa regla no tenía nada que cambiar.
- **Lo que sí cambió:** el 6 pasó a `src/lib/constants.ts`, que es lo que pide
  la línea 21. Y la paginación pasó de la base a la memoria: la regla de la
  línea 16 ("no agregues funciones que la tarea no pida") es ambigua y empujó
  al agente a no tocar `products.ts`. **En esa decisión el contrato empeoró el
  resultado.** No se corrige hoy.

### Costo de la sesión 2

Sin medir: hoy no se corrió `tokens.py` sobre las conversaciones completas de
la sesión, solo sobre el bloque de la corrida S2.

### Qué salió mal

1. Un grep de verificación aprobó una regla falsa (ver "La auditoría").
2. La regla de la línea 16 produjo una decisión de arquitectura peor que la
   corrida sin reglas.
3. Al cierre, cuatro afirmaciones del `CLAUDE.md` quedaron falsas por lo que
   pasó hoy (ver Pendientes). No se cambiaron: esperan decisión.

### Pendiente para la sesión 3

- [ ] Decidir las cuatro afirmaciones del `CLAUDE.md` que la corrida S2 dejó
      obsoletas:
      - línea 21: `src/lib/constants.ts` "todavía no existe" → existe desde
        `1389e03`;
      - línea 23: `src/app/page.tsx:13` → el `80` está hoy en la línea 14;
      - línea 25: `src/app/page.tsx:32` → el texto de envío está hoy en la 44;
      - línea 30: "La paginación hoy no existe" → existe desde `1389e03`.
- [ ] Avisos de la auditoría que quedaron fuera del contrato:
      - los números de línea del contrato se moverán cuando se corrijan los
        defectos (ya pasó con dos, arriba);
      - posible tercer texto comercial en `src/app/layout.tsx:9`, sin volver
        a medir;
      - `AGENTS.md:7` choca con la regla de la línea 18 del `CLAUDE.md`.
- [ ] Decidir si la regla de la línea 16 se reescribe para que no empuje a
      paginar en memoria (es una regla nueva: pasa por auditoría).
- [ ] Correr la S3 y llenar su fila en `docs/MEDICIONES.md`.
- [ ] Si el push de este cierre quedó pendiente, hacerlo antes de empezar y
      comprobar con `git status -sb` que no diga `ahead`.
