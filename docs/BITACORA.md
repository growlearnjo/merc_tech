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

---

## Sesión 3 — 2026-11-18 — Cinco corridas y la regla de costo

### Qué se hizo, en orden

| Hora | Commit | Fase |
|---|---|---|
| 11-13 19:51 | `ff12c58` | Preparación · se revierte la tarea patrón S2 (`1389e03`) antes de la A |
| 10:22 | `b4e7a5c` | Paso 2 · se vuelven a medir la FACTURA, la S1 y la S2 con el `tokens.py` corregido |
| 10:50 | `04ebbf1` | 3.1 · las tres hipótesis, en `docs/COSTOS.md` |
| 11:02 | `0bd5a7f` · `e02de2b` | 3.2 · corrida A y su fila; revert `2574201` |
| 11:26 | `788a239` · `47b0720` | 3.2 · corrida B y su fila; revert `5ba826b` |
| 11:42 | `1e57ef2` · `d58f8e2` | 3.2 · corrida C y su fila; revert `5472c4b` |
| 12:04 | `aa1e362` · `6a8a5c8` · `e56275d` | 3.2 · corrida D y su fila; revert `1282fdc` |
| 12:34 | `9108dd6` · `7d97d0d` | 3.2 · corrida E y su fila (sin revert: su código queda en `main`) |
| — | ver `git log` | 3.3 · regla en `docs/COSTOS.md` y fila S3 en `docs/MEDICIONES.md` |

### Las cinco corridas

Detalle completo, tarifas con su fecha y la regla en `docs/COSTOS.md`.

| Corrida | Configuración | Resultado | Turnos | ~USD | Duración |
|---|---|---|---|---|---|
| A | opus-5-5 · medium (referencia: repite la S2) | ✅ a la primera | 0 | 0.34 | 1 min |
| B | opus-5-5 · max | ✅ a la primera | 0 | 1.26 | 5 min |
| C | opus-5-5 · low | ✅ a la primera | 0 | 0.26 | 1 min |
| D | haiku-5-5 · max | ✅ a la primera | 0 | 0.05 (piso) | 4 min |
| E | haiku-5-5 · low | ✅ a la primera | 0 | 0.01 | 1 min |

La A (US$ 0.34) es la referencia que repite la S2 (US$ 0.36), con las mismas
13 decisiones no pedidas y 4 ⚠️: el ruido entre días es chico al lado de las
diferencias entre configuraciones.

### Las hipótesis y si se cumplieron

1. "Manda el modelo, más que el effort, en las dos comparaciones." **Se
   cumplió.** Con el mismo effort, cambiar de modelo movió el costo unas 25
   veces (B–D, C–E); con el mismo modelo, cambiar el effort lo movió unas 5
   (B–C, D–E).
2. "El effort pesa más con Opus; Haiku hará casi lo mismo con margen o sin
   él." **Se desmintió.** De max a low el costo bajó unas 5 veces en los dos
   modelos (B–C y D–E). Haiku con max escribió 54,634 tokens de salida contra
   4,141 con low.
3. "B costará más de 10 veces lo que E." **Se cumplió.** US$ 1.26 contra
   US$ 0.01 (B–E).

### Corridas pendientes

Ninguna: las cinco corrieron y las cinco pasaron a la primera. Lo que quedó
sin medir dentro de ellas:

- El costo real de la D: US$ 0.05 es un piso (ver "Qué salió mal", punto 2).
- El reloj de pared hasta el paso 5 de la verificación, en las cinco.
- El estado de la página visto en la app, en A–D (sale del código).

### La fila S3 y por qué

La fila S3 de `docs/MEDICIONES.md` es la corrida E (haiku-5-5 · low). Es la
configuración que dicta la regla de abajo, la más barata de las cinco
(US$ 0.01) con el mismo resultado que las otras cuatro (✅, 0 turnos), y la
única cuyo estado de página se comprobó corriendo la app.

### La regla

Para tareas chicas y bien definidas como esta, uso Haiku con effort low,
porque costó US$ 0.01 contra US$ 1.26 de Opus con effort max y las dos pasaron
a la primera, sin turnos de corrección. Para lo que toque la base de datos, el
dinero o la seguridad vuelvo a Opus: eso no lo medí, pero un error ahí me
cuesta más que esa diferencia.

### Una regla del `CLAUDE.md` que estorba

Las cinco corridas de hoy paginaron en memoria (`slice` en
`src/app/page.tsx`), con los dos modelos y los tres niveles de effort, igual
que la S2. La S1, sin contrato, paginó en la base. Eso confirma lo anotado en
la sesión 2: la decisión la empuja la regla de la línea 16 ("no agregues
funciones que la tarea no pida"), no el modelo ni el effort. No se cambió:
la sesión prohíbe reescribir el `CLAUDE.md`.

### Las tres filas de `docs/MEDICIONES.md` a lo largo del curso

| | S1 · opus medium, sin reglas | S2 · opus medium, `CLAUDE.md` | S3 · haiku low, `CLAUDE.md` |
|---|---|---|---|
| Resultado | ✅ sin intervención | ✅ sin intervención | ✅ sin intervención |
| Turnos | 0 | 0 | 0 |
| Estado de la página | La URL (`/?page=2`) | La URL (`/?page=2`) | La URL (`/?page=2`) |
| Dónde se pagina | En la base | En memoria | En memoria |
| Decisiones no pedidas | 13, 4 ⚠️ | 13, 4 ⚠️ | 7, 2 ⚠️ |
| Salida (tokens) | 4,682 | 4,098 | 4,141 |
| Caché leída (tokens) | 610,325 | 385,561 | 314,551 |
| ~USD | 0.44 | 0.36 | 0.01 |
| Duración | 2 min | 1 min | 1 min |

- **Empataron en las tres filas:** resultado, turnos de corrección y estado
  de la página. Quiere decir que esta tarea no separa una configuración de
  otra por calidad: todas la resuelven igual a la primera. Lo único que la
  tarea distingue es el costo, y la regla no se puede extender a tareas
  más difíciles con estos datos.
- **Cambió el costo:** de US$ 0.44 a 0.36 a 0.01. La salida casi empató
  (4,682 · 4,098 · 4,141): la S3 no escribió menos que la S2, cada token
  costó menos. La bajada de la S2 a la S3 es el precio de Haiku, no un
  trabajo más corto.
- **Cambió dónde se pagina, a peor:** la S1 paginó en la base; la S2 y la S3,
  con contrato, en memoria. No es una mejora.
- **Decisiones no pedidas, 13 → 13 → 7:** la lista de la S3 la dio el propio
  agente al cerrar (bloque 4 de `3954107f`); la de la S1 y la S2 no dice cómo
  se armó. Con una corrida por fila y métodos que pueden ser distintos, la
  bajada no se atribuye al modelo. Dentro de la Fase 3.2, la C (opus · low)
  tuvo 14 y la D (haiku · max) 9.
- Cada fila es una sola corrida.

### Costo de la sesión 3

Sin medir como sesión: `tokens.py` se corrió por bloque sobre cada corrida,
no sobre todas las conversaciones de hoy.

### Qué salió mal

1. Las filas D y E se anotaron primero con 1 turno de corrección, y la E con
   "⚠️ tras corregir" y duración "sin medir". Sus conversaciones no tienen
   ningún mensaje de corrección: se corrigieron a 0 y ✅ en `7d97d0d`.
2. El costo de la D es un piso: 7 de sus 14 llamadas pasaron los 100,000
   tokens de prompt, donde la tarifa de Haiku 5.5 sube, y `tokens.py` las
   cobra a la tarifa base. La spec no da la tarifa de ese tramo.
3. `tokens.py` dice que las tarifas se consultaron el 2026-11-09 y la spec
   dice 2026-11-11. Los valores son los mismos; en `docs/COSTOS.md` se cita
   la fecha de la spec.
4. La duración de la tabla es el tiempo del bloque según `tokens.py`, no el
   reloj de pared hasta el paso 5 de la verificación. Nadie tomó ese reloj.
5. "Estado de la página" solo se comprobó en la app para la E. En A–D sale
   del código de cada commit.
6. El commit de la E llevaba `Co-Authored-By: Claude Opus 5.5` y la corrida
   fue con Haiku. Se reescribió (`9108dd6`, `7d97d0d`) con el mismo contenido.
7. Al comprobar la E, un `next start` viejo en el puerto 3123 servía el build
   de otra corrida y contestó primero. La comprobación se repitió con
   `next dev` sobre el código actual.

### Pendiente para la sesión 4

- [ ] Decidir las cuatro afirmaciones del `CLAUDE.md` que quedaron obsoletas
      en la sesión 2 (líneas 21, 23, 25 y 30). Siguen igual: la línea 30
      dice "La paginación hoy no existe", y desde la E vuelve a existir.
- [ ] Decidir si la regla de la línea 16 se reescribe (pasa por auditoría).
- [ ] Los avisos de la auditoría de la sesión 2 que quedaron fuera del
      contrato siguen abiertos.
- [ ] Decidir de dónde sale la fecha de las tarifas de `tokens.py`
      (2026-11-09) o si se iguala a la de la spec (2026-11-11).
- [ ] Dos precisiones de `docs/COSTOS.md` que salieron al revisar sus
      números en el cierre (no se cambiaron):
      - la nota de la D dice que la llamada más grande de la E fue de 94,724
        tokens; esa llamada es del bloque 4 (la lista de decisiones). Dentro
        de la corrida (bloque 3) la más grande fue de 74,938. La conclusión
        no cambia: ninguna pasó de 100,000;
      - "unas 25 veces" sale de dividir centavos redondeados (1.26 / 0.05 y
        0.26 / 0.01). Con los tokens de cada bloque y las tarifas de la tabla
        da 23 (B–D) y 24 (C–E); "unas 5" da 4.9 (B–C) y 5.1 (D–E).
- [x] Hacer el push y comprobar con `git status -sb` que no diga `ahead`.
      Hecho en el cierre: `0ad9804..462bc8c main -> main`, y `git status -sb`
      dice `## main...origin/main`.

---

## Sesión 4 — 2026-11-18 — Una regla pasa a Skill y un servidor MCP

### Qué se hizo, en orden

| Hora | Commit | Fase |
|---|---|---|
| 13:13 | (entra en `85f2927`) | Prompt 0 · `docs/VERIFICACION_S4.md`: versiones, reglas numeradas, terreno listo |
| 14:39 | `85f2927` | 4.1 · Skill `carrito-localstorage`; la regla sale del `CLAUDE.md` |
| 14:40–15:08 | — | 4.1 · pruebas de la Skill (sin commit) |
| 15:32 | `384e9c3` | 4.2 · servidor MCP `conversaciones` en `.mcp.json` |
| 15:37 | `5859386` | 4.3 · `docs/DECISIONES.md` |

### La regla que salió del contrato

- **Cuál:** la regla 7 de `VERIFICACION_S4.md`: «`localStorage` solo guarda
  el carrito (`CartProvider.tsx`); no hay tabla `cart_items`». Eran las
  líneas 31–33 del `CLAUDE.md`, con su verificación.
- **Por qué:** en `VERIFICACION_S4.md` quedó como "a veces": solo hace falta
  en tareas sobre el carrito o sobre qué se guarda, no en cada conversación.
  Por qué la 7 y no otra de las "a veces" no quedó escrito.
- **Antes de moverla se comprobó que se cumple:** `grep -rln localStorage src`
  devolvió solo `src/components/CartProvider.tsx`, y `cart_items` no aparece
  en `src/`. Por eso la Skill la escribe como regla vigente, sin "hoy no se
  cumple".
- **Salió entera.** El `CLAUDE.md` pasó de 39 a 36 líneas y ya no menciona
  `localStorage` ni `cart_items`.

### La descripción de la Skill

Archivo: `.claude/skills/carrito-localstorage/SKILL.md` (40 líneas). Nombre
elegido entre tres (`carrito-localstorage`, `persistencia-carrito`,
`regla-carrito`); descripción B de tres, con un ejemplo más que pedí: «guarda
el carrito en la base de datos», para cubrir la mitad de "no crear
`cart_items`". Quedó así (484 caracteres):

> Decide dónde se guarda un dato en esta tienda: en `localStorage` solo va el
> carrito (`CartProvider.tsx`) y no hay tabla `cart_items`. Úsala cuando la
> tarea quiera recordar algo entre recargas o entre dispositivos: «guarda mis
> productos favoritos en el navegador», «que el carrito no se pierda al
> cambiar de navegador», «recuerda lo último que agregué», «guarda el carrito
> en la base de datos». No cubre la sesión de login, los filtros del catálogo
> ni los datos de productos y pedidos.

El cuerpo trae la regla, cómo está hoy (`CartProvider.tsx:35` y `:46`,
sesión en cookie), tres pasos ("pregunta antes" sale de las reglas 3 y 7) y
la verificación copiada del contrato.

### Las dos peticiones de prueba

Cada una en chat nuevo, y cada una repetida una vez.

| Petición | Debía | Qué pasó |
|---|---|---|
| «Quiero que los favoritos se guarden aunque cierre el navegador» | activarla | **Se activó las dos veces** (llamada a `Skill` como primer paso). La primera vez (`fb200b68`) preguntó, porque la regla no deja poner favoritos en `localStorage`; elegí "Guardarlos en la base" y construyó la función entera: tabla `favorites` en `db.ts`, `src/lib/favorites.ts` nuevo, `toggleFavoriteAction` en `actions.ts` y un botón en la ficha. `typecheck` y `build` sin error; no se probó en el navegador. La segunda vez (`64401c1e`) encontró ese trabajo sin commit y no cambió nada. |
| «Cambia el texto del título del catálogo» | no activarla | **No se activó** ninguna de las dos veces (`6198fe91`, `64401c1e`). No cambió nada: preguntó qué título y qué texto, citando la regla del `CLAUDE.md` que prohíbe inventar textos comerciales. |

- El código de favoritos **no se subió y ya no existe**: estaba sin commit a
  las 15:07 y a las 15:22 el árbol solo tenía `?? .mcp.json`. Se descartó
  fuera de las conversaciones; no hay stash ni commit.
- `/skill-doctor` (en `6198fe91`) listó la Skill así:
  `carrito-localstorage  projectSettings  ~170  848.9k  1×  today`.

### El servidor MCP

- **Cuál:** `conversaciones`, `@modelcontextprotocol/server-filesystem` con
  `--read-only` y `--confine-roots`, apuntado a la carpeta donde Claude Code
  guarda las conversaciones de este proyecto
  (`C:\Users\jhono\.claude\projects\c--Users-jhono-OneDrive-Documents-datapath-esp-merc-tech3`).
- **El primer intento falló** (`7dddfd37`): sin `--confine-roots`,
  `list_allowed_directories` devolvió la carpeta **del proyecto**, y
  `list_directory_with_sizes` sobre la de conversaciones dio
  `Access denied - path outside allowed directories`. Se agregó
  `--confine-roots` a `.mcp.json`; ese cambio no está en ninguna
  conversación. Después (`ce19753b`) devolvió la carpeta de conversaciones.
- **Qué respondió** (`333950a4`):
  - `list_directory_with_sizes`: 48 `.jsonl`, 41.70 MB; el más grande,
    `b1471b87`, 4.93 MB (la generación de la app, 11-nov).
  - `get_file_info`, una llamada por archivo, para las fechas: las tres más
    recientes eran del 18-nov (la propia conversación, `ce19753b` y
    `7dddfd37`).
  - Escribir: el servidor no expone ninguna herramienta de escritura. La
    llamada a `write_file` respondió `No such tool available`, y
    `search_files` no encontró el archivo de prueba.
- **Lo que "antes no podía": no se cumplió.** Sin el servidor, `ls` con Bash
  leyó la misma carpeta en los dos intentos; el Prompt 1 lo había avisado
  antes de empezar. El servidor no da acceso nuevo: da un canal limitado a
  esa carpeta y sin escritura. Con Bash, la escritura ahí no está bloqueada
  (no se probó).

### La tabla de decisión

`docs/DECISIONES.md`, cinco filas:

| si necesitas | usas | mi caso |
|---|---|---|
| Una regla que vale siempre | `CLAUDE.md` | «`actions.ts` no ejecuta SQL: el acceso a `users` pasa por `auth.ts`» |
| Un procedimiento que vale a veces | Skill | `carrito-localstorage` |
| Datos o acciones de un sistema externo | MCP | `conversaciones`, en solo lectura |
| Trabajo largo que no debe ensuciar mi contexto | subagente | sesión 5 |
| Algo que se cumpla aunque el modelo no obedezca | hook | sesión 6 |

El criterio junta dos de las tres redacciones propuestas (B y C): «Me
pregunto cuándo lo necesito y quién lo hace cumplir, porque cada pieza la
pago distinto: el contrato en cada conversación, la Skill cuando la uso, el
MCP cuando consulto afuera, el subagente en otro contexto y el hook aunque el
modelo no quiera.»

La celda de la fila 3 la redactó el agente desde `.mcp.json`, no desde un
uso; lo avisó y no se cambió.

### Costo de la sesión 4

Sin medir. `tokens.py` se corrió solo en el Prompt 0, como comprobación.

### Qué salió mal

1. Correr `tokens.py` agrega su salida a `docs/SALIDA_TOKENS.txt`. En el
   Prompt 0 eso tocó un archivo que no tocaba; se revirtió con
   `git checkout`.
2. El Prompt 0 y el Prompt 1 se corrieron en el mismo chat; la guía pide uno
   nuevo para cada uno.
3. La primera prueba de la Skill terminó en una función completa que no
   estaba en el plan de la sesión, y se borró a mano sin dejar registro.
4. El `.mcp.json` inicial no apuntaba donde decía: el servidor usó la carpeta
   del proyecto hasta que se agregó `--confine-roots`.
5. La premisa de la 4.2 ("sin el servidor no la alcanzas") es falsa en esta
   máquina.
6. El `SKILL.md` dice «sale del CLAUDE.md, regla 7», y esa regla ya no está
   en el `CLAUDE.md`. No se cambió.

### Pendiente para la sesión 5

- [ ] Fila 4 de `docs/DECISIONES.md`: el subagente.
- [ ] Las cuatro afirmaciones obsoletas del `CLAUDE.md`, sin cambios desde la
      sesión 2. Siguen en las líneas 21 (`constants.ts` "todavía no
      existe"), 23 (`page.tsx:13`), 25 (`page.tsx:32`) y 30 ("La paginación
      hoy no existe").
- [ ] Decidir si la regla de la línea 16 se reescribe (pasa por auditoría).
- [ ] Decidir qué hacer con la referencia a "regla 7" del `SKILL.md` (punto 6
      de arriba).
- [ ] `.mcp.json`: la ruta lleva mi usuario de Windows y no sirve en otra
      máquina; `npx -y` baja la última versión del servidor cada vez.
      Decidir si se fija la versión.
- [ ] Los pendientes de la sesión 3 que no se tocaron hoy: avisos de la
      auditoría de la sesión 2, fecha de las tarifas de `tokens.py` y las dos
      precisiones de `docs/COSTOS.md`.
- [ ] Los defectos 1–4 del inventario siguen sin corregir (sesiones 5, 6 y 7).
- [ ] Si el push de este cierre quedó pendiente, hacerlo antes de empezar y
      comprobar con `git status -sb` que no diga `ahead`.

---

## Sesión 5 — 2026-11-18 y 2026-11-20 — Un revisor que no escribió el código

Todas las cifras de esta entrada salen de `docs/REVISION.md`. Lo que no está
ahí no se cuenta aquí.

### Qué se hizo, en orden

| Día | Commit | Fase |
|---|---|---|
| 2026-11-18 | `419b31f` | 5.1 · el autor contra un revisor nuevo (`docs/REVISION.md` §1) y fila 4 de `docs/DECISIONES.md` |
| 2026-11-18 | `4d7a5a2` | Prompt 0 · `docs/VERIFICACION_S5.md` |
| 2026-11-18 | `64ed041` | 5.2 · `.claude/agents/tech-lead.md` |
| 2026-11-18 | `4dd7cf8` | 5.2 · primera auditoría (`docs/REVISION.md` §2) |
| 2026-11-20 | `66b573d` | 5.3 · corrección de tres hallazgos y segunda auditoría (§3) |

### El autor contra el revisor (Fase 5.1)

Se revisó la corrida S2 de la tarea patrón, commit `1389e03`. El revisor fue
un subagente general-purpose nuevo que no vio `docs/`.

- **El autor declaró 13** decisiones no pedidas, **4 con ⚠️** («querría
  enterarse»).
- **El revisor encontró 14**, **5 con ⚠️** («querría aprobar antes»).
- **Coincidieron 12 de cada lado.** Solo las declaró el autor: 1 (A1, el panel
  de admin sigue sin paginar). Solo las encontró el revisor: 2 (R2, la
  navegación sin `flex-wrap` se desborda en el celular; R5, la cuadrícula de
  `lg:grid-cols-4` deja 4 + 2 en escritorio).
- **⚠️ sobre el mismo punto: 1** (A4 ↔ R4, la página fuera de rango se
  corrige en silencio). ⚠️ solo del autor: 3. ⚠️ solo del revisor: 4.
- Los dos no cortan el código en piezas del mismo tamaño: la A10 del autor son
  cuatro puntos del revisor. Por eso cada lado se cuenta sobre sus propios
  puntos, y los ⚠️ no significan lo mismo en las dos listas.
- Lo que solo vio el revisor son dos problemas de pantalla. El autor no los
  nombró.
- **Costo de delegar:** mi contexto pasó de 36.9k a 54.0k (17.1k más). La
  transcripción del subagente ocupa 360.91 KB y no se abrió. Con eso se llenó
  la fila 4 de `docs/DECISIONES.md`.

### El Tech Lead (Fase 5.2)

**La description.** Se propusieron tres redacciones y se eligió la que el
agente recomendó para la 5.3, porque nombra la segunda auditoría y dice qué
hacer si le piden corregir:

> Da una segunda mirada a código que escribió otra conversación: lo revisa con
> la rúbrica de la tienda y entrega hallazgos por severidad, con archivo, línea
> y nota. Úsalo cuando pidan «audita el módulo de admin», «dame una segunda
> opinión sobre la paginación» o «vuelve a auditar el módulo después de la
> corrección». No corrige: si le piden arreglar algo, responde que solo reporta.

**El resto del frontmatter:**

- `tools: Read, Grep, Glob`. Sin Edit, Write ni Bash, y sin `permissionMode`.
- **`skills`: vacío.** `carrito-localstorage` se podía cargar (no tiene
  `disable-model-invocation: true`), pero no sirve para revisar. Está escrita
  para quien hace el cambio, cubre una sola regla y cita rutas y líneas del
  inventario. Como `skills` carga la Skill entera, esas rutas le llegarían al
  revisor. Es lo mismo que ya decía `docs/VERIFICACION_S5.md`.
- **`model: inherit`.** Mi regla de costos habla de tareas chicas (Haiku) y
  de cambios que tocan base de datos, dinero o seguridad (Opus), pero no de
  revisar. El prompt decía que en ese caso va `inherit`. La conversación
  principal corría en Opus, así que el revisor usó Opus, y eso calza con la
  parte de seguridad de la regla, porque la R4 trata de permisos.

**La rúbrica:** cuatro preguntas, R1 a R4, una por cada defecto que apareció.
El problema 6 (sin `cart_items`) quedó fuera porque la Skill lo protege como
decisión.

**Un aviso que se dio al escribirlo y no se resolvió:** los subagentes reciben
el `CLAUDE.md`, y el mío cita rutas y líneas del inventario. Ver «Qué encontró
sin que nadie le dijera dónde».

### Qué respondió cuando le pedí corregir

Encargo: «Corrige el primer hallazgo de tu informe.» Respuesta completa:

> Solo reporto; la corrección la hace la conversación principal.
>
> No cambié ningún archivo. Para quien haga la corrección, el primer hallazgo
> es este: `src/app/admin/page.tsx:11` · R4 · `AdminPage` no llama a
> `getCurrentUser()` ni comprueba un rol antes de leer el inventario. Tampoco
> hay un middleware o proxy que proteja `/admin`.
>
> No basta con que la página exija una sesión. La tabla `users`
> (`src/lib/db.ts:13-19`) no tiene columna de rol, así que hoy no hay forma de
> saber si el usuario es administrador. Ese cambio de esquema hace falta
> primero.
>
> La regla de no agregar funciones ni dependencias que la tarea no pida está en
> `…\merc_tech\CLAUDE.md`. Según esa regla, la conversación principal tiene que
> confirmar con el usuario antes de agregar la columna de rol y la
> comprobación.

- Dijo la frase exacta que le pide su archivo y no cambió nada. Después,
  `git status --short` solo mostró `docs/REVISION.md`, que escribió la
  conversación principal.
- Que no edite lo garantizan sus `tools`. La frase sale de la orden 1 del
  cuerpo.
- Fue más allá de la frase: explicó qué haría falta y citó el `CLAUDE.md`. Eso
  prueba que lo leyó.

### Qué se corrigió y la nota

La §2 no tenía ningún hallazgo R1. Se corrigieron sus tres hallazgos R2, con
constantes nuevas en `src/lib/constants.ts`:

- **A** · el largo máximo del nombre `120`, que estaba duplicado →
  `PRODUCT_NAME_MAX_LENGTH`.
- **B** · el umbral de stock bajo `5`, que estaba duplicado →
  `LOW_STOCK_THRESHOLD`. Obligó a tocar `src/components/StockBadge.tsx`, que
  está fuera del módulo, y lo autoricé.
- **C** · el stock inicial `10`, que estaba en línea →
  `DEFAULT_NEW_PRODUCT_STOCK`.

`npm run build` terminó sin error y confirmé en el navegador que `/admin`, el
catálogo y la ficha se ven igual. No hay pruebas automáticas.

| | Críticos | Importantes | Sugerencias | Nota |
|---|---|---|---|---|
| Antes (§2) | 2 | 3 | 1 | **0,75** |
| Después (§3) | 3 | 1 | 1 | **−0,25** |

**La nota bajó aunque la corrección funcionó.** Los tres hallazgos corregidos
no volvieron a aparecer y valían 2,25. Pero el Tech Lead restó 3 por contar
aparte la columna de rol que falta, aunque `db.ts` no cambió, y 0,25 por el
`2` del largo mínimo, que ya estaba en la §2 y no reportó. La cuenta es
0,75 + 2,25 − 3 − 0,25 = −0,25. La nota mezcla lo corregido con un cambio de
criterio del revisor entre corridas: para comparar hay que leer la tabla
hallazgo por hallazgo de la §3, no la nota.

### Qué encontró sin que nadie le dijera dónde

El encargo solo nombró el módulo (`src/app/admin/`).

| Defecto | §2 / §3 | Por qué |
|---|---|---|
| 3 · Cero pruebas | Sí / Sí | |
| 4a · `/admin` abierta | Sí / Sí | |
| 4a · `createProductAction` acepta a cualquiera | Sí / Sí | La leyó porque el formulario la importa |
| 2 · `120` duplicado | Sí / corregido | |
| 2 · `defaultValue={10}` | Sí / corregido | |
| 1 · SQL de `users` en `actions.ts` | No / No | Está en el registro y el login, fuera del panel |
| 1 · `admin/page.tsx` obtiene datos y renderiza | No / No | La R1 lo excluye porque pasa por `listProducts()`. La rúbrica y el inventario no usan el mismo criterio |
| 2 · `99`, `100`, `SESSION_DAYS = 30`, los dos textos comerciales | No / No | Fuera del módulo |

**Encontró tres cosas que el inventario no tenía:** el umbral `5` duplicado,
la columna de rol como hallazgo aparte y el `2` del largo mínimo.

**Pero «sin que nadie le dijera dónde» no se cumplió del todo.** El
`CLAUDE.md`, que el subagente lee, nombra `admin/page.tsx:10`,
`actions.ts:107-123`, el `120` en `actions.ts:115` y `ProductForm.tsx:20`,
`ProductForm.tsx:34`, y que `users` no tiene columna de rol. De lo que
encontró dentro del módulo, lo único que el `CLAUDE.md` no nombra es el umbral
`5` y el `2`. El informe no dice si usó esas pistas. Lo que sí se sabe es que
leyó el `CLAUDE.md`, porque lo cita en su respuesta al pedido de corregir.

### Costo de la sesión 5

Sin medir: no se corrió `tokens.py`. Lo único medido es el contexto que
costó delegar en la 5.1 (17.1k).

### Qué salió mal

1. **La nota no sirve sola para comparar antes y después.** El revisor no
   aplicó el mismo criterio en las dos corridas: la columna de rol pasó de
   estar dentro de otro hallazgo a contarse como un crítico propio, y el `2`
   apareció la segunda vez.
2. **La R2 solo busca números de dos o más cifras**, y por eso el `2` no
   salió en la primera auditoría.
3. **La R1 y el inventario se contradicen** sobre la página que obtiene los
   datos y los renderiza. No está decidido cuál vale.
4. **El revisor no estaba a ciegas:** el `CLAUDE.md` le da rutas y líneas.
5. **Placeholders sin rellenar, otra vez.** El prompt de la 5.3 se pegó con
   `<RUTA_PROYECTO>` y `[MÓDULO]`, y el de este cierre con `<RUTA_PROYECTO>` y
   `<TU_REPO>`. Es el mismo problema de la sesión 1.
6. **El repositorio no tiene remoto.** En este cierre `git remote -v` sale
   vacío y `main` no sigue a ninguna rama remota, aunque en la sesión 3 se
   empujó a `origin`. No se sabe cuándo ni cómo se quitó. El push de este
   cierre no se hizo.
7. **El `CLAUDE.md` sigue con afirmaciones viejas** en «Valores ajustables»:
   dice que `src/lib/constants.ts` «todavía no existe», y lista como
   incrustados el `120` y `ProductForm.tsx:34`, que se corrigieron en la 5.3.
   No se cambió porque las dos reglas de los defectos 1 y 2 siguen sin pasar
   su comando de verificación (el de la regla del defecto 1 devuelve el SQL de
   `users`; el del defecto 2, el `99`, el `100` y los dos textos comerciales).

### Pendiente para la sesión 6

- [ ] **Configurar el remoto y hacer el push** de la sesión 5. Comprobar con
      `git status -sb` que diga `## main...origin/main` sin `ahead`.
- [ ] **Defecto 3, pruebas** (sesión 6). **Defecto 4, permisos** (sesiones 6
      y 7): `/admin`, `createProductAction` y la columna de rol en `users`.
- [ ] Fila 5 de `docs/DECISIONES.md`: el hook.
- [ ] Decidir el criterio de la R1 (el del inventario o el de la rúbrica) y
      escribirlo en `.claude/agents/tech-lead.md`.
- [ ] Decidir si se sacan las rutas y líneas del `CLAUDE.md` para que el Tech
      Lead revise a ciegas, o si se acepta que las vea.
- [ ] El `2` del largo mínimo del nombre: anotado y sin tocar.
- [ ] Defecto 1: el SQL de `users` sigue en `actions.ts`. La 5.3 no lo tocó
      porque el Tech Lead no lo reportó.
- [ ] Las afirmaciones viejas del `CLAUDE.md` en «Valores ajustables» (punto
      7 de arriba).
- [ ] Pendientes de sesiones anteriores que no se tocaron: la regla de no
      agregar funciones que empuja a paginar en memoria, la referencia a
      «regla 7» del `SKILL.md`, la versión del servidor en `.mcp.json`, la
      fecha de las tarifas de `tokens.py` y las precisiones de
      `docs/COSTOS.md`.
