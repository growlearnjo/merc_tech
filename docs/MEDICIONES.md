# MEDICIONES: tarea patrón

| Corrida | Resultado | Turnos | Estado de la página | Decisiones no pedidas | Costo | Duración |
|---|---|---|---|---|---|---|
| S1 · sin reglas | ✅ sin intervención | 0 | La URL (`/?page=2`). La lee `src/app/page.tsx` de `searchParams`; la consulta vive en `src/lib/products.ts` (`listProductsPage`, `PAGE_SIZE = 6`) | 13, de ellas 4 con ⚠️ (ver abajo) | entrada 18 · caché esc 44,089 · caché lec 610,325 · salida 4,682 · US$ 0.44 | 2 min |
| S2 · con `CLAUDE.md` | | | | | | |
| S3 · configuración elegida | | | | | | |

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
