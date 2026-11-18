## Hipótesis antes de medir

Fecha: 2026-11-18

1. Creo que manda el modelo: pasar de Opus a Haiku moverá mi costo más que cambiar el effort, en las dos comparaciones.
2. Creo que el effort pesa más con Opus: es el que más aprovecha el margen para pensar, y Haiku hará casi lo mismo con margen o sin él.
3. Creo que B costará más de 10 veces lo que cueste E: el modelo cambia el precio de cada token, el effort cambia cuántos se gastan, y las dos cosas se multiplican.

**Resultado (2026-11-18, con la tabla de abajo):**

1. Se cumplió. Con el mismo effort, pasar de Opus a Haiku bajó el costo unas 25 veces (B→D: US$ 1.26 → 0.05; C→E: US$ 0.26 → 0.01). Con el mismo modelo, cambiar el effort lo bajó unas 5 veces (B→C; D→E). Pares B–D y C–E contra B–C y D–E.
2. Se desmintió. De effort max a low el costo bajó unas 5 veces en Opus (B→C: US$ 1.26 → 0.26) y también unas 5 veces en Haiku (D→E: US$ 0.05 → 0.01). Haiku no hizo casi lo mismo: con max escribió 54,634 tokens de salida contra 4,141 con low, y tardó 4 min contra 1. Pares B–C y D–E.
3. Se cumplió. B costó US$ 1.26 y E US$ 0.01: bastante más de 10 veces. Los dos efectos se multiplicaron: unas 25 veces por el modelo y unas 5 por el effort. Par B–E.

## Corridas de la Fase 3.2

| Corrida | Modelo | Effort | Resultado | Turnos | Estado de la página | Decisiones no pedidas | Costo | Duración |
|---|---|---|---|---|---|---|---|---|
| A | opus-5-5 | medium | ✅ a la primera | 0 | La URL (`?page=`), según el código | 13, de ellas 4 con ⚠️ | entrada 10 · caché esc 40,207 · caché lec 313,782 · salida 3,716 · US$ 0.34 | 1 min |
| B | opus-5-5 | max | ✅ a la primera | 0 | La URL (`?page=`), según el código | 10, de ellas 4 con ⚠️ | entrada 34 · caché esc 82,245 · caché lec 1,579,013 · salida 26,438 · US$ 1.26 | 5 min |
| C | opus-5-5 | low | ✅ a la primera | 0 | La URL (`?page=`), según el código | 14, de ellas 4 con ⚠️ | entrada 6 · caché esc 36,155 · caché lec 167,525 · salida 2,170 · US$ 0.26 | 1 min (medido; tú dijiste 6) |
| D | haiku-5-5 | max | ✅ a la primera | 0 | La URL (`?page=`), según el código | 9, de ellas 3 con ⚠️ | entrada 28 · caché esc 107,669 · caché lec 1,367,146 · salida 54,634 · US$ 0.05 (piso, ver nota) | 4 min (medido; tú dijiste 7) |
| E | haiku-5-5 | low | ✅ a la primera | 0 | La URL (`?page=`), comprobada en la app | 7, de ellas 2 con ⚠️ | entrada 10 · caché esc 43,991 · caché lec 314,551 · salida 4,141 · US$ 0.01 | 1 min |

Nota del 2026-11-18: D y E decían 1 turno de corrección, pero sus conversaciones (`0e2b75c9`, `3954107f`) no tienen ningún mensaje de corrección antes de la medición. En la E hubo un primer intento interrumpido antes de cambiar el modelo, sin costo (bloques 1 y 2). Se corrigieron a 0. La duración de la E sale de `tokens.py`, igual que en las otras corridas.

Nota sobre la D: su US$ 0.05 es un piso. 7 de sus 14 llamadas tuvieron un prompt de más de 100,000 tokens (de 119,771 a 137,098), y por encima de ese límite la tarifa de Haiku 5.5 sube; `tokens.py` las cobra a la tarifa base. La spec no da la tarifa de ese tramo, así que el costo real de la D no está medido. A tarifa base esas 7 llamadas valen US$ 0.02; para que la D costara lo mismo que la C, ese tramo tendría que valer unas 10 veces la tarifa base. La E no pasó del límite (su llamada más grande fue de 94,724 tokens).

Nota sobre el estado de la página: en la E se comprobó el 2026-11-18 corriendo la app con el código de su commit: el enlace de paginación lleva a `/?page=2`, y cargar `/?page=2` muestra los productos 7 a 12. En A–D el dato sale del código de cada commit (`src/app/page.tsx` lee `page` de `searchParams`); no quedó anotado que se viera en la barra de direcciones.

Nota sobre la duración: es el tiempo del bloque que da `tokens.py`, desde el enunciado hasta la última respuesta del agente. No es el reloj de pared hasta terminar el paso 5 de la verificación que pide `TAREA_PATRON.md` §3, y ese reloj no se tomó. Es el mismo criterio de las filas S1 y S2, así que las duraciones se comparan entre sí. En C y D quedó además el reloj del alumno (6 y 7 min).

## Tarifas usadas

Tarifas de lista de la API de Claude, **consultadas el 2026-11-11**, por millón de tokens (de `Ed5_sesion3.md`, §"Las tarifas"):

| Modelo | Entrada | Salida | Leído de caché |
|---|---|---|---|
| Opus 5.5 | $4 | $20 | $0,20 |
| Haiku 5.5 | $0,10 | $0,50 | $0,01 |

Escribir en caché cuesta **1,25×** la entrada con el reloj de 5 minutos (el que usa `tokens.py`) y **2×** con el de 1 hora. Los precios de Haiku 5.5 valen para prompts de hasta 100.000 tokens; por encima suben.

## La regla

Para tareas chicas y bien definidas como esta, uso Haiku con effort low, porque costó US$ 0.01 contra US$ 1.26 de Opus con effort max y las dos pasaron a la primera, sin turnos de corrección. Para lo que toque la base de datos, el dinero o la seguridad vuelvo a Opus: eso no lo medí, pero un error ahí me cuesta más que esa diferencia.
