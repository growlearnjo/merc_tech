# VERIFICACIÓN S3: terreno antes de medir

Fecha: 2026-11-18

Actualizado el 2026-11-18, después del Paso 2 (re-medición con `tokens.py` corregido): FACTURA, su línea en "¿De qué bloque salió cada costo?" y veredicto.

## Versiones

- claude: 2.1.327 (Claude Code), mínimo 2.1.283 ✅
- node: v24.11.1
- npm: 11.6.2
- git: 2.51.0.windows.1
- python: 3.14.0

## Commit de partida

`667fa85 docs: update Sesion 3 to five runs, add Sesion 4 and 5 material`. `git status --short` sale vacío.

## FACTURA (`docs/00-ANTES.md` §4), citada tal cual

- Costo en dinero: **S/ 0 / US$ 0 extra**. "Plan Max (sección 2): no se paga por token."
- Consumo del plan (tokens / % de la ventana): **entrada 72 · caché esc 116,281 · caché lec 3,970,633 · salida 62,414 · US$ 2.62** (tarifa de API; el plan Max no lo cobra) · % de la ventana: **sin medir**. "`tokens.py --bloques b1471b87`, bloque 1 (el del encargo). Caché del proyecto entero, corrida sin argumentos: "esos 28,917,471 tokens leídos costaron US$ 5.78" · "Sin caché, como entrada nueva, habrían costado US$ 115.67"."
- Duración del trabajo: **≈ 12 min** (15:03:57 → 15:15:55). "Desde que se creó `package.json` hasta el último build (`.next/BUILD_ID`). No incluye el tiempo de lectura previo ni este informe."
- Aprobaciones pedidas: **sin dato exacto**. "En modo `auto` decide el clasificador y el agente no ve qué le mostró al usuario. Lo seguro: el agente no hizo ninguna pregunta directa (0 `AskUserQuestion`) y no le rechazaron ninguna llamada. Las ventanas de permiso que hayas visto, cuéntalas tú."

## Filas de `docs/MEDICIONES.md`

S1 y S2 llenas. S3 vacía.

## ¿De qué bloque salió cada costo?

- FACTURA: sí. Viene de `b1471b87`, bloque 1 (el del encargo), y se midió con `tokens.py` ya corregido (`--bloques b1471b87`). Los dos números de la caché son del proyecto entero (corrida sin argumentos).
- S1: sí. Viene de `b498fb0d`, bloque 1, y se midió con `tokens.py` ya corregido.
- S2: sí. Viene de `6fd44299`, bloque 1, y se midió con el mismo `tokens.py` (`--patron`).
- Volver a medir: **solo la FACTURA**, con el Paso 2 de la ruta.

## EL ENUNCIADO DE LA TAREA PATRÓN

"Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

## Commit de la tarea patrón

- `1389e03 feat: rerun the pattern task with the contract for Fase 2.3`. Tocó `docs/MEDICIONES.md`, `src/app/page.tsx` y `src/lib/constants.ts`.
- **Ya está revertido** por `ff12c58 revert: undo the pattern task (1389e03) before Fase 3.2 run A`, que tocó `src/app/page.tsx` y `src/lib/constants.ts`. Decisión: ese es el revert previo a la corrida A. La Fase 3.2 no lo repite y arranca directo en la A. El código de `src` es idéntico al de antes de la S1 y al de antes de la S2.

## Veredicto

Terreno listo, adelante con la lectura.
