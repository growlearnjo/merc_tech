# MEDICIONES: tarea patrón (Fase 1.4)

Enunciado (`curso-ed5/TAREA_PATRON.md` §1), pegado tal cual en una conversación nueva:

> Agrega al catálogo un filtro por categoría. Que se pueda elegir una categoría
> y el listado muestre solo los productos de esa categoría, y que el filtro
> siga aplicado si recargo la página.

| Corrida | Resultado | Turnos | Estado del filtro | Costo | Duración |
|---|---|---|---|---|---|
| S1 · sin reglas | **No comparable** (ver nota) | 0 | La URL (`/?cat=Audio`) | sin medir | sin medir |
| S2 · con `CLAUDE.md` | | | | | |
| S3 · configuración elegida | | | | | |

## Nota sobre la fila S1

**En esta corrida el agente no construyó el filtro.** Ya venía hecho desde la
generación (Fase 1.2) y estaba anotado como problema #5 en `docs/00-ANTES.md`.
El agente revisó el código, vio que el filtro existía y no cambió ningún
archivo. Por eso ningún resultado de `TAREA_PATRON.md` §2 (✅ / ⚠️ / ❌ / 🔥)
describe lo que pasó, y la fila no sirve como "antes" para comparar con la
sesión 2.

- **Resultado:** el filtro existente cumple lo que pide el enunciado. Eso dice
  cómo salió la Fase 1.2, no esta corrida.
- **Turnos de corrección:** 0. No hubo que corregir al agente.
- **Estado del filtro:** en la URL, como parámetro `cat`. La página lo lee de
  `searchParams` y los botones de categoría son enlaces que lo agregan
  (`src/app/page.tsx`, líneas 8-23 y 59-76). No usa `useState` ni el
  almacenamiento del navegador.
- **Costo:** sin medir. El agente no ve su propio consumo.
- **Duración:** sin medir. Nadie tomó la hora al pegar el enunciado.

### Pasos de §2 comprobados

El agente los comprobó con peticiones HTTP a `next start` en el puerto 3107, no
en el navegador:

| Paso | Resultado |
|---|---|
| 1 · Arranca sin errores en la consola del navegador | sin medir (no se abrió un navegador) |
| 2 · Elegir categoría → solo esos productos | `/?cat=Audio` → 2 productos · `/?cat=Laptops` → 2 |
| 3 · Recargar (F5) → el filtro sigue | Pasa: pedir de nuevo la misma URL devuelve el mismo listado filtrado |
| 4 · Abrir la URL en otra pestaña → mismo listado | Pasa: el filtro solo depende de la URL |
| 5 · Volver a "Todos" → 12 productos | `/` → 12 productos |

### Qué falta para tener una S1 válida

Hay que avisar al docente (`Ed5_sesion1.md`, verificación de la 1.2, punto 5).
Para medir la S1 de verdad, primero se saca el filtro de `src/app/page.tsx` y
luego se repite la tarea en una conversación nueva, con el reloj corriendo.
