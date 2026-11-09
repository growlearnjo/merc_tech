# La tarea patrón

Una sola tarea, chica y verificable, que el alumno le pide al agente **tres
veces a lo largo del curso**: en la sesión 1 (sin reglas), en la sesión 2 (con
su `CLAUDE.md` puesto) y en la sesión 3 (con la configuración de modelo, effort
y caché que haya elegido).

Tres veces la misma tarea es lo que convierte una impresión —"ahora va
mejor"— en una tabla con números.

---

## 1. El enunciado (texto literal)

El alumno pega esto, igual las tres veces, en una **conversación nueva**:

```text
Agrega al catálogo un filtro por categoría. Que se pueda elegir una categoría
y el listado muestre solo los productos de esa categoría, y que el filtro
siga aplicado si recargo la página.
```

**No se cambia ni una palabra entre las tres corridas.** Si la segunda vez el
alumno explica mejor la tarea, la comparación mide su prosa, no su
configuración.

### Por qué esta tarea

| Requisito del plan | Cómo lo cumple |
|---|---|
| Toca 2–3 archivos | El listado, el control del filtro y la consulta de datos. |
| Se verifica sin leer código | Se elige una categoría, se recarga, y el filtro sigue puesto o no. |
| Menos de 10 minutos | Es una feature chica sobre código que ya existe. |
| No está en el encargo | El encargo de la sesión 1 no menciona categorías a propósito. |
| Revela la arquitectura | "Que siga aplicado al recargar" obliga a decidir **dónde vive el estado**. Sin reglas, el agente usa `useState` y el filtro se pierde; con un `CLAUDE.md` que diga que los filtros viven en la URL, se resuelve bien a la primera. Esa diferencia es exactamente lo que el curso enseña. |

---

## 2. Cómo se verifica (igual las tres veces)

Sin abrir un archivo:

1. `npm run dev` arranca sin errores en la consola del navegador.
2. En el catálogo, elegir una categoría → el listado muestra **solo** esos
   productos.
3. **Recargar la página (F5)** → el filtro sigue aplicado.
4. Copiar la URL, abrirla en otra pestaña → se ve el mismo listado filtrado.
5. Volver a "todas las categorías" → reaparecen los 12 productos.

**El paso 3 es el que separa las corridas.** El 4 es el que distingue "lo
guardó en el navegador" de "lo puso en la URL".

| Resultado | Cómo se registra |
|---|---|
| Pasan los 5 pasos a la primera | ✅ sin intervención |
| Pasan tras pedirle correcciones | ⚠️ y se anota **cuántos turnos** de corrección hicieron falta |
| El 3 o el 4 no pasan y el alumno lo deja así | ❌ y se anota qué falló |
| Rompió algo que antes funcionaba | 🔥 y se anota qué (esto cuenta aparte) |

---

## 3. Qué se anota cada vez

Una fila por corrida, siempre los mismos seis datos. El alumno la llena en su
propio `docs/MEDICIONES.md`, que nace en la sesión 1.

| Dato | Cómo se obtiene |
|---|---|
| Sesión y configuración | "S1 · sin reglas" · "S2 · con CLAUDE.md" · "S3 · <modelo + effort>" |
| Resultado | ✅ / ⚠️ / ❌ / 🔥 de la tabla anterior |
| Turnos de corrección | Cuántas veces hubo que volver a pedirle algo |
| Dónde quedó el estado del filtro | `useState` · almacenamiento del navegador · la URL — se mira la URL de la pestaña, no el código |
| Costo | Lo que informe la herramienta al cerrar la conversación |
| Duración | Reloj de pared, de pegar el enunciado a terminar el paso 5 |

### La tabla que el alumno habrá llenado al terminar la sesión 3

| Corrida | Resultado | Turnos | Estado del filtro | Costo | Duración |
|---|---|---|---|---|---|
| S1 · sin reglas | | | | | |
| S2 · con `CLAUDE.md` | | | | | |
| S3 · configuración elegida | | | | | |

> **Sobre la fila de la sesión 3.** En esa sesión la tarea se corre **tres
> veces**, con tres configuraciones distintas de modelo, effort y caché. La fila
> de aquí es la **configuración elegida**; la comparación de las tres vive en el
> `docs/COSTOS.md` que nace en esa misma sesión. Así esta tabla sigue teniendo
> tres filas comparables entre sí.

**Esa tabla es el producto del curso que el alumno va a enseñarle a su jefe.**
No el plugin: la tabla.

---

## 4. Reglas de la medición

* **Conversación nueva cada vez.** Si la segunda corrida ocurre en el mismo
  hilo que la primera, el agente ya tiene el contexto y la comparación miente.
* **Se mide sobre el mismo código de partida.** La corrida de la sesión 2 parte
  del estado de la app **antes** del filtro: si la sesión 1 ya lo dejó hecho, se
  revierte ese cambio (y con la sesión 6 en la mano, se revierte con
  `/rewind`). El cómo revertir se explica en la spec de cada sesión.
* **No se cambia el enunciado** (ya está dicho, y es el error más fácil).
* **No se compara contra el ejemplar.** MercadoTech resuelve este filtro bien
  porque tuvo ocho sesiones; comparar la app de dos horas del alumno contra eso
  no enseña nada. La comparación es **consigo misma**, tres veces.
* **Lo que no se midió se declara sin medir.** Si el alumno olvidó el reloj,
  la celda va vacía, no estimada.

---

## 5. Verificación de este documento (Fase P.2)

1. Ejecutar la tarea patrón sobre una de las dos apps generadas en la
   verificación de [`ENCARGO_LITE.md`](ENCARGO_LITE.md) §5 → termina en menos
   de 10 minutos y los 5 pasos de §2 se pueden recorrer sin abrir un archivo.
2. Comprobar que la app recién generada **no** traía ya el filtro.
3. Anotar la primera corrida real en
   `BITACORA_PRODUCCION.md` (documento del docente, no se reparte): es el dato de referencia
   con el que el docente sabrá, en clase, si un alumno va bien o mal de tiempo.
