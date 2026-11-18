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

### Si la app YA trae el filtro: los enunciados de repuesto

Pasa, y pasó en los dos ensayos: el encargo de la sesión 1 no menciona
categorías, pero el agente agrega el filtro por su cuenta. Si al pegar el
enunciado el agente responde que eso ya está hecho, **no se insiste y no se
inventa una variante**: se usa el siguiente de la lista.

**Se usa el primero que la app NO tenga ya hecho.** El alumno abre su catálogo
en el navegador y lo mira antes de decidir:

| Mira el catálogo | Usa el enunciado |
|---|---|
| **No** se puede filtrar por categoría | el **1**, el original |
| Ya filtra por categoría, pero **no** pagina | el **2** |
| Ya filtra y ya pagina, pero **no** se puede ordenar por precio | el **3** |
| Ya hace las tres cosas | ninguno: **avisa al docente**, que le dará una tarea en clase, y queda anotado en la tabla |

**Enunciado 2 — paginación**

```text
Muestra solo 6 productos por página, con enlaces para pasar de página, y que
si recargo siga en la página en la que estaba.
```

Mide una cosa más que el original: si el "6 por página" queda como número
suelto o como constante con nombre, que es el defecto 2 del inventario.

**Enunciado 3 — orden por precio**

```text
Agrega al catálogo una forma de ordenar los productos por precio, de menor a
mayor y de mayor a menor, y que el orden siga aplicado si recargo la página.
```

Con 12 productos de ejemplo el cambio de orden siempre se ve, así que la
verificación no depende de los datos que haya cargados.

Los tres cumplen lo mismo: no están en el encargo, tocan dos o tres archivos,
se verifican sin abrir código, y obligan a decidir **dónde vive el estado**.
Los 5 pasos de §2 sirven para los tres, cambiando qué se elige en el paso 2.

> **La regla que hace que esto no rompa la medición:** el enunciado que se use
> en la **corrida 1** es el de las **tres** corridas. No se mezcla uno en la S1
> y otro en la S2. Se anota al pie de la tabla cuál se usó, con el texto
> completo entre comillas, porque dentro de tres semanas nadie se acuerda.
>
> **Y si hubo que cambiar de enunciado**, porque el commit de la corrida
> anterior no se podía revertir, el nuevo pasa a ser el de todas las corridas
> y **los datos de la corrida vieja se reemplazan**, no se mezclan con los
> nuevos.

### Por qué esta tarea

| Requisito del plan | Cómo lo cumple |
|---|---|
| Toca 2–3 archivos | El listado, el control del filtro y la consulta de datos. |
| Se verifica sin leer código | Se elige una categoría, se recarga, y el filtro sigue puesto o no. |
| Menos de 10 minutos | Es una feature chica sobre código que ya existe. |
| No está en el encargo | El encargo de la sesión 1 no menciona categorías a propósito. |
| Revela la arquitectura | "Que siga aplicado al recargar" obliga a decidir **dónde vive el estado**. Sin reglas, el agente puede usar `useState` y el filtro se pierde; con un `CLAUDE.md` que diga que los filtros viven en la URL, se resuelve bien a la primera. |
| Revela el gobierno | **El segundo dato, y el que no empata.** Un agente moderno suele acertar con el estado aunque nadie se lo pida — en el ensayo lo puso en la URL a la primera, sin reglas. Lo que un contrato sí cambia es **cuántas cosas decide por su cuenta**: en la sesión 1 fueron 26, siete de ellas de las que un responsable del producto habría querido enterarse. Si el contrato baja ese número, el papel sirvió. |

---

## 2. Cómo se verifica (igual las tres veces)

Sin abrir un archivo. Los cinco pasos son los mismos para los tres enunciados;
lo único que cambia es qué se elige en el paso 2.

1. `npm run dev` arranca sin errores en la consola del navegador.
2. En el catálogo, **elegir una categoría**, **pasar a la página 2** o
   **elegir el orden por precio**, según el enunciado que te tocó → el listado
   cambia como lo pediste.
3. **Recargar la página (F5)** → el estado sigue aplicado.
4. Copiar la URL, abrirla en otra pestaña → se ve lo mismo.
5. Volver al estado inicial → el catálogo queda como al principio, con los 12
   productos.

**El paso 3 es el que separa las corridas.** El 4 es el que distingue "lo
guardó en el navegador" de "lo puso en la URL". Y se mira la **barra de
direcciones**: algo como `?cat=…`, `?page=…` u `?orden=…` significa que el
estado quedó en la URL.

| Resultado | Cómo se registra |
|---|---|
| Pasan los 5 pasos a la primera | ✅ sin intervención |
| Pasan tras pedirle correcciones | ⚠️ y se anota **cuántos turnos** de corrección hicieron falta |
| El 3 o el 4 no pasan y el alumno lo deja así | ❌ y se anota qué falló |
| Rompió algo que antes funcionaba | 🔥 y se anota qué (esto cuenta aparte) |

---

## 3. Qué se anota cada vez

Una fila por corrida, siempre los mismos siete datos. El alumno la llena en su
propio `docs/MEDICIONES.md`, que nace en la sesión 1.

| Dato | Cómo se obtiene |
|---|---|
| Sesión y configuración | "S1 · sin reglas" · "S2 · con CLAUDE.md" · "S3 · <modelo + effort>" |
| Resultado | ✅ / ⚠️ / ❌ / 🔥 de la tabla anterior |
| Turnos de corrección | Cuántas veces hubo que volver a pedirle algo |
| Dónde quedó el estado del filtro | `useState` · almacenamiento del navegador · la URL — se mira la URL de la pestaña, no el código |
| **Decisiones no pedidas** | Cuántas cosas decidió el agente que el enunciado no pedía, y cuántas de ellas marcarías con ⚠️. Se las pides al cerrar la conversación: *"enumera lo que decidiste y que yo no te pedí"* |
| Costo | `tokens.py` de la carpeta de la sesión, **la fila del bloque del enunciado**: los cuatro contadores de tokens y el equivalente en dólares. Un bloque es tu mensaje con las respuestas que vinieron después, hasta tu mensaje siguiente; si el chat lleva solo la tarea, coincide con la fila de la conversación. Con `--patron` el script busca esas corridas por el texto del enunciado |
| Duración | Reloj de pared, de pegar el enunciado a terminar el paso 5 |

### La tabla que el alumno habrá llenado al terminar la sesión 3

| Corrida | Resultado | Turnos | Estado del filtro | Decisiones no pedidas | Costo | Duración |
|---|---|---|---|---|---|---|
| S1 · sin reglas | | | | | | |
| S2 · con `CLAUDE.md` | | | | | | |
| S3 · configuración elegida | | | | | | |

> **Sobre la fila de la sesión 3.** En esa sesión la tarea se corre **cinco
> veces**: una repite la configuración de la sesión 2, y las otras cuatro son
> las combinaciones de dos modelos por dos niveles de effort. La fila
> de aquí es la **configuración elegida**; la comparación de las cinco vive en el
> `docs/COSTOS.md` que nace en esa misma sesión. Así esta tabla sigue teniendo
> tres filas comparables entre sí.

**Esa tabla es el producto del curso que el alumno va a enseñarle a su jefe.**
No el plugin: la tabla.

---

## 4. Reglas de la medición

* **Conversación nueva cada vez.** Si la segunda corrida ocurre en el mismo
  hilo que la primera, el agente ya tiene el contexto y la comparación miente.
* **Se mide sobre el mismo código de partida.** La corrida de la sesión 2 parte
  del estado de la app **antes** de la tarea: se revierte el commit de la
  corrida anterior (y con la sesión 6 en la mano, se revierte con `/rewind`).
  El cómo revertir se explica en la spec de cada sesión. Por eso la tarea
  patrón va **en su propio commit**, sin mezclarse con nada más.
* **No se cambia el enunciado** (ya está dicho, y es el error más fácil). Y si
  hubo que recurrir a uno de los repuestos de §1, ese es el enunciado de las
  tres corridas: tampoco se vuelve al original a mitad de camino.
* **Se puede cambiar de enunciado una sola vez, y por un solo motivo:** que el
  commit de la corrida anterior no se pueda revertir, así que no haya forma de
  volver al código de partida. En ese caso la corrida nueva pasa a ser la
  línea base y **los datos de la corrida vieja se reemplazan**, no se mezclan.
  Queda anotado al pie de la tabla.
* **Cada alumno compara contra sí mismo, no contra el grupo.** Si a uno le
  tocó el repuesto y a otro el original, sus tablas no son comparables entre
  ellas — y no hace falta que lo sean.
* **No se compara contra el ejemplar.** MercadoTech resuelve este filtro bien
  porque tuvo ocho sesiones; comparar la app de dos horas del alumno contra eso
  no enseña nada. La comparación es **consigo misma**, tres veces.
* **Lo que no se midió se declara sin medir.** Si el alumno olvidó el reloj,
  la celda va vacía, no estimada.
* **El chat de la corrida lleva solo la corrida.** Se pega el enunciado, se
  verifican los cinco pasos, se mide y se cierra. Si en ese mismo chat se le
  pide algo más, el costo de la tarea deja de ser la fila de la conversación y
  hay que ir a buscar su bloque.
* **El mismo instrumento, y la misma versión, en las tres filas.** El costo se
  mide siempre con el `tokens.py` de la carpeta de la sesión, que cuenta cada
  respuesta una sola vez y reporta por bloque. Tres filas medidas con dos
  versiones distintas del script no se comparan: la versión vieja inflaba el
  gasto, y con un factor distinto en cada conversación.
* **Si una fila hay que volver a medirla, se mide de la conversación guardada,
  no repitiendo la tarea.** Las conversaciones se quedan en el disco, así que
  el dato sigue ahí semanas después. Repetir la corrida solo se justifica si
  esa conversación ya no existe, y entonces hay que reponer también las
  condiciones: una S1 se mide **sin** `CLAUDE.md` en la raíz. Queda anotado al
  pie de la tabla con la fecha.

---

## 5. Verificación de este documento (Fase P.2)

1. Ejecutar la tarea patrón sobre una de las dos apps generadas en la
   verificación de [`ENCARGO_LITE.md`](ENCARGO_LITE.md) §5 → termina en menos
   de 10 minutos y los 5 pasos de §2 se pueden recorrer sin abrir un archivo.
2. Comprobar que la app recién generada **no** traía ya el filtro.
3. Anotar la primera corrida real en
   `BITACORA_PRODUCCION.md` (documento del docente, no se reparte): es el dato de referencia
   con el que el docente sabrá, en clase, si un alumno va bien o mal de tiempo.
