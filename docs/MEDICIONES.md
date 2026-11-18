# MEDICIONES: tarea patrón

| Corrida | Resultado | Turnos | Estado de la página | Decisiones no pedidas | Costo | Duración |
|---|---|---|---|---|---|---|
| S1 · sin reglas | ✅ sin intervención | 0 | La URL (`/?page=2`). La lee `src/app/page.tsx` de `searchParams`; la consulta vive en `src/lib/products.ts` (`listProductsPage`, `PAGE_SIZE = 6`) | 13, de ellas 4 con ⚠️ (ver abajo) | entrada 18 · caché esc 44,089 · caché lec 610,325 · salida 4,682 · US$ 0.44 | 2 min |
| S2 · con `CLAUDE.md` | ✅ sin intervención | 0 | La URL (`/?page=2`). La lee `src/app/page.tsx` de `searchParams` y recorta en memoria la lista de `listProducts`; el 6 vive en `src/lib/constants.ts` (`PRODUCTS_PER_PAGE`) | 13, de ellas 4 con ⚠️ (ver abajo) | entrada 12 · caché esc 41,025 · caché lec 385,561 · salida 4,098 · US$ 0.36 | 1 min |
| S3 · haiku-5-5 + effort low | ✅ sin intervención | 0 | La URL (`/?page=2`). La lee `src/app/page.tsx` de `searchParams` y recorta en memoria la lista de `listProducts`; el 6 vive en `src/lib/constants.ts` (`PRODUCTS_PER_PAGE`) | 7, de ellas 2 con ⚠️ (ver abajo) | entrada 10 · caché esc 43,991 · caché lec 314,551 · salida 4,141 · US$ 0.01 | 1 min |

Enunciado usado en las tres corridas (enunciado 2 de `TAREA_PATRON.md` §1, paginación):

> "Muestra solo 6 productos por página, con enlaces para pasar de página, y que
> si recargo siga en la página en la que estaba."

**Nota:** esta línea base se midió en la sesión 2 porque la de la sesión 1 no
quedó commiteada. La validación de las tres corridas se hace sobre esta tarea.
Los datos de la corrida anterior (enunciado 1, filtro por categoría, que la app
ya traía hecho) se reemplazaron, no se mezclan con estos.

**Costo y duración de la S1:** son del bloque del enunciado dentro de esa
conversación (`b498fb0d`, bloque 1), no de la conversación completa, porque
ese chat siguió con otros trabajos después. Se midieron con `tokens.py` ya
corregido para no contar dos veces cada respuesta.

**Costo y duración de la S2:** son del bloque del enunciado dentro de esa
conversación (`6fd44299`, bloque 1), no de la conversación completa, porque
ese chat siguió con otros trabajos después. Se midieron con el mismo
`tokens.py` que la S1 (`--patron`).

**Costo y duración de la S3:** son los de la corrida E de la Fase 3.2, copiados de
`docs/COSTOS.md`: bloque 3 de la conversación `3954107f` (los bloques 1 y 2 son un
intento interrumpido antes de cambiar el modelo, sin costo). Se midieron con el
mismo `tokens.py` que la S1 y la S2 (`--bloques`). La comparación de las cinco
corridas está en `docs/COSTOS.md`.

## Decisiones no pedidas en la S1

Lo que el agente decidió y el enunciado no pedía. ⚠️ = algo de lo que un
responsable del producto querría enterarse.

| # | Decisión | ⚠️ |
|---|---|---|
| 1 | Crear una función nueva (`listProductsPage`) en vez de cambiar `listProducts`: el panel de admin sigue mostrando todos los productos, sin paginar | ⚠️ |
| 2 | Poner el 6 como constante con nombre (`PAGE_SIZE`) exportada en `src/lib/products.ts`, no en un archivo de constantes aparte | |
| 3 | Sacar el armado del `WHERE` a una función auxiliar (`buildWhere`), tocando código del filtro que ya funcionaba | |
| 4 | Paginar en la base (`LIMIT`/`OFFSET` más un `COUNT` aparte), no recortando la lista en memoria | |
| 5 | Una página que no existe (`?page=99`) muestra la última, en vez de dar error o una lista vacía | ⚠️ |
| 6 | Un valor inválido (`?page=abc`, `?page=0`) muestra la página 1 | |
| 7 | La página 1 no lleva `?page=1` en la URL | |
| 8 | Cambiar de categoría o buscar vuelve a la página 1 | ⚠️ |
| 9 | El contador "N productos" pasa a mostrar el total encontrado, no los de la página | ⚠️ |
| 10 | Los enlaces de página no aparecen si todo cabe en una página | |
| 11 | El diseño: "← Anterior", todos los números de página y "Siguiente →", con los extremos atenuados y el estilo de los chips de categoría | |
| 12 | Accesibilidad: `aria-label`, `aria-current` y `rel="prev"`/`rel="next"` | |
| 13 | Comentarios nuevos en español dentro del código | |

## Decisiones no pedidas en la S2

Lo que el agente decidió y el enunciado no pedía. ⚠️ = algo de lo que un
responsable del producto querría enterarse.

| # | Decisión | ⚠️ |
|---|---|---|
| 1 | No tocar `listProducts` ni agregar una función nueva: el panel de admin sigue mostrando todos los productos, sin paginar | ⚠️ |
| 2 | Crear `src/lib/constants.ts` (el archivo que el contrato nombra y que no existía) con `PRODUCTS_PER_PAGE = 6` | |
| 3 | Paginar recortando la lista en memoria dentro de `page.tsx`, no en la base con `LIMIT`/`OFFSET` | |
| 4 | Una página fuera de rango muestra la más cercana: `?page=99` muestra la última y `?page=0` la primera, en vez de dar error o una lista vacía | ⚠️ |
| 5 | Un valor no numérico (`?page=abc`) muestra la página 1 | |
| 6 | La página 1 no lleva `?page=1` en la URL | |
| 7 | Cambiar de categoría o buscar vuelve a la página 1 | ⚠️ |
| 8 | El contador "N productos" muestra el total encontrado, no los de la página | ⚠️ |
| 9 | Los enlaces de página no aparecen si todo cabe en una página | |
| 10 | El diseño: "← Anterior", todos los números de página y "Siguiente →", con los extremos atenuados y el estilo de los chips de categoría | |
| 11 | Accesibilidad: `aria-label` y `aria-current` (sin `rel="prev"`/`rel="next"`) | |
| 12 | Reescribir `chipHref` sobre una función común (`catalogHref`), tocando código del filtro que ya funcionaba | |
| 13 | Un comentario nuevo en español en `constants.ts` | |

Verificado el 2026-11-18: S1 (`b498fb0d`, bloque 1) y S2 (`6fd44299`, bloque 1) coinciden con `tokens.py --patron` (ya corregido) del 2026-11-16 16:25; no se cambió ningún valor.

## Decisiones no pedidas en la S3

Lo que el agente decidió y el enunciado no pedía, según su propia lista al
cerrar la corrida E (conversación `3954107f`, bloque 4). ⚠️ = algo de lo que un
responsable del producto querría enterarse.

| # | Decisión | ⚠️ |
|---|---|---|
| 1 | Crear `src/lib/constants.ts`, un archivo nuevo, para `PRODUCTS_PER_PAGE = 6` | ⚠️ |
| 2 | El diseño de la barra: "← Anterior", "Siguiente →", "Página X de Y", los extremos deshabilitados y un `aria-label` | |
| 3 | La paginación no aparece si todo cabe en una página | |
| 4 | Un número de página inválido o fuera de rango lleva a una página válida, en vez de dar error o una lista vacía | |
| 5 | El contador "N productos" muestra el total encontrado, no los de la página | ⚠️ |
| 6 | Buscar o cambiar de categoría vuelve a la página 1 | |
| 7 | Los enlaces de página conservan `q` y `cat` | |
