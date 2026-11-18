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
