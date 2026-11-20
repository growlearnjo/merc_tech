# REVISIÓN: tarea patrón

## 1. El autor contra el revisor

**Commit:** `1389e03` (`1389e035d79646479d84ff5fec8762452b99fb3d`), «feat: rerun the pattern task with the contract for Fase 2.3», la corrida S2. El revisor lo vio sin `docs/`, con `git show 1389e03 -- . ':(exclude)docs'`.

**Enunciado:**

> "Muestra solo 6 productos por página, con enlaces para pasar de página, y que
> si recargo siga en la página en la que estaba."

**Autor:** el agente que hizo la tarea. Su lista está en `docs/MEDICIONES.md`, sección «Decisiones no pedidas en la S2». Tiene 13 decisiones, 4 con ⚠️, y ⚠️ significa «algo de lo que un responsable del producto querría enterarse».

**Revisor:** un subagente general-purpose nuevo, que no vio `docs/`. Encontró 14 decisiones, 5 con ⚠️, y ⚠️ significa «algo que un responsable del producto querría aprobar antes».

### Las dos listas lado a lado

Cada fila empareja lo que dijo cada uno sobre el mismo punto del código. Cuando un punto de un lado cubre varios del otro, aparece en varias filas.

| Autor | ⚠️ | Revisor | ⚠️ |
|---|---|---|---|
| A1 · No tocar `listProducts` ni agregar una función nueva: el panel de admin sigue mostrando todos los productos, sin paginar | ⚠️ | — | |
| A2 · Crear `src/lib/constants.ts` con `PRODUCTS_PER_PAGE = 6` | | R13 · Archivo de constantes nuevo con `PRODUCTS_PER_PAGE`; lo exige el contrato, no el enunciado (`constants.ts:1-4`) | |
| A3 · Paginar recortando en memoria dentro de `page.tsx`, no con `LIMIT`/`OFFSET` | | R11 · Paginación en memoria con `slice`; `listProducts` trae todo (`page.tsx:15`, `:23-24`) | |
| A4 · Fuera de rango muestra la más cercana: `?page=99` la última, `?page=0` la primera | ⚠️ | R4 · URLs inválidas se corrigen en silencio: 99 → última, 0/negativo → 1, sin 404 ni redirección (`page.tsx:19-22`) | ⚠️ |
| A5 · `?page=abc` muestra la página 1 | | R4 · (el mismo punto: `abc` → 1, y `2abc` se acepta como 2) | ⚠️ |
| A6 · La página 1 no lleva `?page=1` | | R10 · Página en la URL como `page`; la 1 se omite; se puede compartir y suma entradas al historial (`page.tsx:11`, `:13`, `:30`) | |
| A7 · Cambiar de categoría o buscar vuelve a la página 1 | ⚠️ | R9 · Cambiar de categoría o buscar vuelve a la página 1; al paginar se conservan `q` y `cat` (`page.tsx:26`, `:34-35`, `:56-57`) | |
| A8 · El contador muestra el total encontrado, no los de la página | ⚠️ | R6 · El contador sigue mostrando el total, no «Mostrando 7–12 de N» (`page.tsx:97-99`) | |
| A9 · Los enlaces no aparecen si todo cabe en una página | | R8 · La navegación se oculta con una sola página y con cero resultados (`page.tsx:117`, `:102`) | |
| A10 · Diseño: «← Anterior», todos los números y «Siguiente →», extremos atenuados, estilo de los chips | | R1 · Formato: Anterior, Siguiente y un enlace numerado por página (`page.tsx:118-161`) | ⚠️ |
| A10 · (el mismo punto) | | R7 · Anterior/Siguiente en gris y no pulsables en los extremos (`page.tsx:126-130`, `:157-161`) | |
| A10 · (el mismo punto) | | R12 · Píldoras `rounded-full` slate, actual en negro, estilo de los chips (`page.tsx:118-158`) | |
| A10 · (el mismo punto, los textos «← Anterior» y «Siguiente →») | | R3 · Textos nuevos sin aprobar: «← Anterior», «Siguiente →», `aria-label="Paginación"` | ⚠️ |
| A11 · Accesibilidad: `aria-label` y `aria-current` | | R3 · (el mismo punto: nombra el `aria-label` como texto nuevo; no menciona `aria-current`) | ⚠️ |
| A12 · Reescribir `chipHref` sobre `catalogHref` | | R14 · Refactor no pedido: `chipHref` envuelve a `catalogHref` (`page.tsx:26-35`) | |
| A13 · Un comentario nuevo en español en `constants.ts` | | R13 · (el mismo punto: «un comentario que cita `CLAUDE.md`») | |
| — | | R2 · Sin límite de números visibles; `flex` sin `flex-wrap`, se desborda en el celular (`page.tsx:118`, `:131`) | ⚠️ |
| — | | R5 · La cuadrícula sigue en `lg:grid-cols-4`: 4 + 2 en escritorio (`page.tsx:111`) | ⚠️ |

### Conteo

Los dos parten el código en decisiones de tamaño distinto: la A10 del autor se reparte en cuatro puntos del revisor, y la R4 y la R13 del revisor juntan dos del autor cada una. Por eso cada lado se cuenta sobre sus propios puntos.

**Decisiones**

| | Autor (13) | Revisor (14) |
|---|---|---|
| Coinciden con algo del otro | 12 (A2–A13) | 12 (R1, R3, R4, R6–R14) |
| Solo las declaró ese lado | 1 (A1) | 2 (R2, R5) |

La A11 coincide solo en parte: el revisor nombra el `aria-label`, pero no el `aria-current`.

**Las marcadas con ⚠️**

| | Cantidad | Cuáles |
|---|---|---|
| ⚠️ de los dos sobre el mismo punto | 1 | A4 ↔ R4 |
| ⚠️ solo del autor | 3 | A1 (el revisor no la menciona), A7 (= R9, sin ⚠️), A8 (= R6, sin ⚠️) |
| ⚠️ solo del revisor | 4 | R1 y R3 (= A10/A11, sin ⚠️), R2 y R5 (el autor no las menciona) |

Los ⚠️ no significan exactamente lo mismo en cada lista. Para el autor es «querría enterarse»; para el revisor, «querría aprobar antes».

### Lo que costó delegar

- Contexto de mi conversación según `/context`: **36.9k** antes de delegar y **54.0k** cuando volvió el resultado, es decir, 17.1k más.
- Transcripción del subagente, en `subagents/` de la conversación `4568ff8c-e543-4f6b-9015-4084a5b4fc67`: **`agent-a65fdfdeb9a3de9c6.jsonl`, 369,571 bytes (360.91 KB)**. A su lado está `agent-a65fdfdeb9a3de9c6.meta.json`, de 324 B. No se abrió ninguno de los dos.

## 2. Primera auditoría

**Fecha:** 2026-11-18
**Módulo:** `src/app/admin/`
**Encargo al subagente `tech-lead`:** "Audita el panel de administración, en src/app/admin/. Usa tu rúbrica."

El informe va tal como lo devolvió el subagente:

# Informe del Tech Lead — panel de administración (`src/app/admin/page.tsx`, `src/app/admin/ProductForm.tsx` y la acción que usa, `createProductAction` en `src/app/actions.ts`)

## Crítico
- `src/app/admin/page.tsx:11` · R4 · `AdminPage` lista todo el inventario sin llamar a `getCurrentUser()` ni comprobar un rol. No hay `middleware`/`proxy` que proteja `/admin`, y la tabla `users` (`src/lib/db.ts:13-19`) no tiene columna de rol.
- `src/app/actions.ts:107` · R4 · `createProductAction` inserta productos sin obtener al usuario ni comprobar permiso: cualquiera, aunque no tenga sesión, puede escribir en el catálogo.

## Importante
- `src/app/admin/ProductForm.tsx:20` · R2 · El largo máximo del nombre (`120`) está duplicado: `maxLength={120}` aquí y `name.length > 120` en `src/app/actions.ts:115`. No está en `src/lib/constants.ts`.
- `src/app/admin/page.tsx:49` · R2 · El umbral de stock bajo (`p.stock <= 5`) está duplicado con `src/components/StockBadge.tsx:9` (`stock <= 5`). No está en `src/lib/constants.ts`.
- `package.json:8` · R3 · No hay archivos `*.test.*`/`*.spec.*` fuera de `node_modules/`, ni script `test`, ni dependencia de pruebas: nada prueba el panel ni `createProductAction`.

## Sugerencia
- `src/app/admin/ProductForm.tsx:34` · R2 · El stock inicial por defecto `defaultValue={10}` está escrito en línea en vez de vivir en `src/lib/constants.ts`.

## Nota
10 − 3 × 2 − 1 × 3 − 0,25 × 1 = 0,75

## 3. Después

**Fecha:** 2026-11-20
**Módulo:** `src/app/admin/`, el mismo de la sección 2.
**Encargo al subagente `tech-lead`:** "Audita el panel de administración, en src/app/admin/. Usa tu rúbrica.", el mismo texto de la sección 2, sin nada más.

**Lo que se corrigió antes de esta auditoría.** El alumno eligió los tres hallazgos de la sección 2 que caen en los defectos 1 y 2. Los tres son R2; la sección 2 no tenía ninguno R1. Las constantes nuevas van en `src/lib/constants.ts`, como pide `CLAUDE.md`:

- `PRODUCT_NAME_MAX_LENGTH = 120`, usada en `ProductForm.tsx` (`maxLength`) y en `actions.ts` (la validación y el mensaje de error).
- `LOW_STOCK_THRESHOLD = 5`, usada en `admin/page.tsx` (el color de la tabla) y en `components/StockBadge.tsx`. Este archivo está fuera del módulo, y el alumno autorizó tocarlo.
- `DEFAULT_NEW_PRODUCT_STOCK = 10`, usada en `ProductForm.tsx` (`defaultValue`).

`npm run build` terminó sin error, y el alumno confirmó en el navegador que `/admin`, el catálogo y la ficha de producto se ven igual. No hay pruebas automáticas.

El informe va tal como lo devolvió el subagente:

# Informe del Tech Lead — panel de administración (`src/app/admin/page.tsx`, `src/app/admin/ProductForm.tsx` y su acción `createProductAction` en `src/app/actions.ts`)

## Crítico
- `src/app/admin/page.tsx:12` · R4 · `AdminPage` lista el inventario y muestra el formulario de alta sin llamar a `getCurrentUser()` ni comprobar un rol. No existe `middleware`/`proxy` que proteja `/admin`. El comentario de la línea 11 lo reconoce: "página abierta, sin control de permisos".
- `src/app/actions.ts:108` · R4 · `createProductAction` escribe en `products` (`insertProduct`, línea 126) sin obtener el usuario actual ni comprobar permisos. Cualquiera puede crear productos sin iniciar sesión.
- `src/lib/db.ts:13` · R4 · La tabla `users` no tiene columna de rol (líneas 13-19). Hoy no hay forma de distinguir a un administrador, aunque la página o la acción quisieran comprobarlo.

## Importante
- `package.json:8` · R3 · No hay pruebas para el panel ni para `createProductAction`. No hay archivos `*.test.*` ni `*.spec.*` fuera de `node_modules/`, `scripts` no tiene `test` y no hay dependencia de pruebas.

## Sugerencia
- `src/app/actions.ts:116` · R2 · El largo mínimo del nombre (`2`) está en línea en la comparación y repetido a mano en el mensaje de la línea 117, mientras que el máximo ya vive en `src/lib/constants.ts`.

## Nota
10 − 3 × 3 − 1 × 1 − 0,25 × 1 = −0,25

### Hallazgo por hallazgo

Las líneas de `admin/page.tsx` y `actions.ts` se corrieron una posición hacia abajo por los `import` nuevos. Por eso `:11` pasa a `:12` y `:107` pasa a `:108`, pero el hallazgo es el mismo.

| # | Hallazgo | Defecto | Antes (§2) | Después (§3) | Qué pasó |
|---|---|---|---|---|---|
| 1 | `/admin` abierta, sin `getCurrentUser()` ni rol | 4 | Crítico · `admin/page.tsx:11` | Crítico · `admin/page.tsx:12` | No se tocó: es de las sesiones 6 y 7 |
| 2 | `createProductAction` sin comprobar usuario ni permiso | 4 | Crítico · `actions.ts:107` | Crítico · `actions.ts:108` | No se tocó: es de las sesiones 6 y 7 |
| 3 | `users` sin columna de rol | 4 | Dentro del texto del hallazgo 1, sin contarse aparte | Crítico · `db.ts:13` | No se tocó. En §3 el Tech Lead lo cuenta como hallazgo propio, y eso suma un crítico a la nota |
| 4 | Largo máximo del nombre `120` duplicado | 2 | Importante · `ProductForm.tsx:20` + `actions.ts:115` | — | **Corregido** (A) |
| 5 | Umbral de stock bajo `5` duplicado | 2 | Importante · `admin/page.tsx:49` + `StockBadge.tsx:9` | — | **Corregido** (B) |
| 6 | Sin pruebas | 3 | Importante · `package.json:8` | Importante · `package.json:8` | No se tocó: es de la sesión 6 |
| 7 | Stock inicial `10` en línea | 2 | Sugerencia · `ProductForm.tsx:34` | — | **Corregido** (C) |
| 8 | Largo mínimo del nombre `2` en línea y repetido en el mensaje | 2 | No se reportó (el `2` ya estaba en `actions.ts:115`) | Sugerencia · `actions.ts:116` | No se tocó: no estaba en la §2 y ya se corrigieron los tres permitidos. Queda anotado |

### Nota de antes y de después

| | Críticos | Importantes | Sugerencias | Nota |
|---|---|---|---|---|
| Antes (§2) | 2 | 3 | 1 | 10 − 3 × 2 − 1 × 3 − 0,25 × 1 = **0,75** |
| Después (§3) | 3 | 1 | 1 | 10 − 3 × 3 − 1 × 1 − 0,25 × 1 = **−0,25** |

Los tres hallazgos corregidos no volvieron a aparecer: valían 2 importantes y 1 sugerencia, o sea 2,25 puntos. Aun así la nota bajó 1 punto, por dos motivos que no salen de la corrección:

- La falta de columna de rol pasó de estar mencionada dentro de un crítico a ser un crítico propio. Eso resta 3 puntos, y el código de `db.ts` no cambió.
- El Tech Lead reportó el `2` del largo mínimo, que ya estaba en la §2 y no reportó. Eso resta 0,25. Probablemente lo vio porque ahora el máximo es una constante y el mínimo sigue en línea. La rúbrica R2 solo busca números de dos o más cifras, así que la primera vez no lo atrapó.

0,75 + 2,25 − 3 − 0,25 = −0,25. La diferencia entre las dos notas mezcla lo corregido con lo que cambió el criterio del revisor entre una corrida y otra. Por eso conviene leer la tabla de hallazgos, no solo la nota.

### El inventario de daños contra las dos auditorías

Hay una fila por cada aparición de un defecto en `docs/00-ANTES.md` §5. «Sin que nadie le dijera dónde» quiere decir que el encargo solo nombró el módulo (`src/app/admin/`), no el archivo ni la línea.

| Defecto del inventario | Dónde | ¿Lo encontró? (§2 / §3) | Por qué sí o por qué no |
|---|---|---|---|
| 1 · SQL de `users` dentro de `actions.ts` (parcial) | `actions.ts:33-34`, `:38`, `:48-49` (hoy `:34-35`, `:39`, `:49-50`) | No / No | El Tech Lead leyó `actions.ts` solo por `createProductAction`. El SQL está en el registro y el login, fuera del panel |
| 1 · Página de servidor que obtiene datos y renderiza en el mismo archivo (nota 1) | `admin/page.tsx:12` (y `src/app/page.tsx:14`, fuera del módulo) | No / No | La R1 lo excluye a propósito, porque la página pasa por `listProducts()`, que es la «función intermedia». El inventario lo cuenta como resto del defecto y la rúbrica no. **Lección de rúbrica:** hay que decidir cuál de los dos criterios vale y escribirlo en la R1 |
| 2 · `120` duplicado | `ProductForm.tsx:20` y `actions.ts:115` | Sí / — (corregido) | Lo encontró sin pista |
| 2 · `defaultValue={10}` en línea | `ProductForm.tsx:34` | Sí / — (corregido) | Lo encontró sin pista |
| 2 · `99` duplicado | `actions.ts:77` y `CartButton.tsx:21` | No / No | Fuera del módulo: es del carrito |
| 2 · `100` en línea | `actions.ts:72` | No / No | Fuera del módulo: es del carrito |
| 2 · `SESSION_DAYS = 30` | `auth.ts:8` | No / No | Fuera del módulo |
| 2 · «Envío gratis en Lima desde S/ 199» | `src/app/page.tsx:32` | No / No | Fuera del módulo: es el catálogo |
| 2 · «12 meses de garantía» | `producto/[id]/page.tsx:61` | No / No | Fuera del módulo: es la ficha de producto |
| 3 · Cero pruebas | `package.json` | Sí / Sí | Lo encontró sin pista |
| 4a · `/admin` no comprueba quién la usa | `admin/page.tsx:10-11` | Sí / Sí | Lo encontró sin pista |
| 4a · `createProductAction` acepta a cualquiera, y no hay middleware | `actions.ts:107-123` | Sí / Sí | Lo encontró sin pista. Leyó la acción porque el formulario del módulo la importa |

Lo que encontró el Tech Lead y el inventario no tenía:

- El umbral `5` duplicado (§2, corregido).
- La columna de rol que falta como hallazgo aparte (§3). `CLAUDE.md` sí la nombra.
- El `2` del largo mínimo (§3).

Los problemas 5 a 7 del inventario (la tarea patrón ya hecha, el esquema sin `cart_items` y que el proyecto no era repositorio git) no son preguntas de la rúbrica y no se cuentan aquí.

De lo que el inventario marcó dentro del módulo, lo encontró todo excepto el resto del defecto 1 en `admin/page.tsx`. Ese caso no lo encontró por cómo está escrita la R1, no porque no leyera el archivo. Todo lo demás que no encontró está fuera de `src/app/admin/`, y el encargo no le pedía mirarlo.
