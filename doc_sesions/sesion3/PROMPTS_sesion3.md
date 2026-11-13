# Claude Code Ed. 5 — Prompts de la Sesión 3 (Costos medidos)

Cada prompt está construido con los ítems de la rúbrica de prompt engineering
(Rol, Contexto, Objetivo, Público/tono, Restricciones, Formato, Ejemplos,
Razonamiento), incluyendo **solo los pertinentes para cada fase**.

Todos asumen que existe `doc_sesions/sesion3/Ed5_sesion3.md` (la spec). El prompt la
referencia SIEMPRE — la spec es la fuente de verdad; el prompt es el
disparador autocontenido.

| Fase | Rol | Contexto | Objetivo | Público/tono | Restricciones | Formato | Ejemplos | Razonamiento |
|---|---|---|---|---|---|---|---|---|
| 0 Terreno | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 1 Lectura de la spec | — | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 3.1 Tu factura | ✔ | ✔ | ✔ | — | ✔ | ✔ | ✔ | — |
| 3.2 Tres corridas | — | ✔ | ✔ | — | ✔ | ✔ | — | — |
| 3.3 `docs/COSTOS.md` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — |
| Cierre | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

La Fase 3.2 no lleva rol ni razonamiento, y es a propósito: en esa fase el
agente **no tiene que pensar nada**, tiene que hacer la misma tarea tres veces
igual. Lo que cambia entre corridas lo cambias tú, fuera del prompt.

---

## La ruta de hoy, y en qué chat va cada paso

**La regla es simple: todo va en conversación nueva.** Lo único que se pega en
el mismo chat es el segundo paso de cada corrida, y cada uno lo dice en su
lugar.

| # | Paso | ¿Dónde? |
|---|---|---|
| 1 | **Prompt 0** — verificar el terreno | chat nuevo. Deja escrito `docs/VERIFICACION_S3.md`, y de ahí leen los demás |
| 2 | **Paso 2 de la ruta (condicional)** — volver a medir los costos de las sesiones 1 y 2 | dos comandos **en la terminal** y un prompt en chat nuevo. Solo si el Prompt 0 lo pidió |
| 3 | **Prompt 1** — leer la spec | chat nuevo |
| 4 | **Fase 3.1** — tu factura y tus hipótesis | chat nuevo |
| 5 | **Fase 3.2** — las cinco corridas | **diez** chats: por cada corrida, uno corto para el revert y el de la corrida, con dos pasos dentro |
| 6 | **Fase 3.3** — `docs/COSTOS.md` y la regla | chat nuevo |
| 7 | **Cierre** — bitácora y push | chat nuevo |

**Por qué cada corrida en su propio chat, y no es prolijidad:** cada
conversación es una fila distinta en la herramienta de medición, así que cada
corrida tiene su propio costo limpio. Si dos corridas comparten chat, sus
tokens se suman en una sola fila y no hay forma de separarlas. Y además el
agente llegaría a la segunda con la primera en contexto, que es lo que arruina
cualquier comparación.

**Entre corrida y corrida, fuera del chat**, haces dos cosas en la terminal:
revertir la corrida anterior y cambiar el modelo o el effort. Cada corrida dice
cuál le toca.

---

## Cómo usar estos prompts

1. **Cada fase empieza en una conversación nueva**, en orden. La **3.2** son
   **tres conversaciones**, una por corrida, y cada una tiene dos pasos dentro.
2. **Los comandos que empiezan con `/` los escribes tú en el chat, no el
   agente.** `/usage`, `/clear`, `/model` y `/effort` son comandos de Claude
   Code: se escriben en la misma caja donde escribes tus mensajes, y el agente
   no los puede ejecutar por ti. Cuando un paso diga "escribe tú", es literal.
3. **No recortes el bloque `[CONTEXTO]`**, pero **rellena sus marcadores**:

   | Marcador | Qué es | Cómo lo consigues |
   |---|---|---|
   | `<RUTA_PROYECTO>` | La carpeta donde vive tu app | `pwd` desde la carpeta del proyecto |
   | `<COMMIT_ANTERIOR>` | El commit con el que cerraste la sesión 2 | `git log --oneline -1` al empezar hoy |
   | `<TU_REPO>` | Tu repositorio en GitHub | `git remote -v` |

4. **Corre la verificación de la fase antes del prompt siguiente.**
5. **Commit por fase**: `docs:` para la 3.1, `feat:` para cada corrida de la
   3.2, `docs:` para la 3.3 y para el cierre.
6. **Cierre**: el último prompt deja la bitácora escrita y todo subido.

### Quién mide qué

| Dato | Lo consigue | Lo escribe en el archivo |
|---|---|---|
| El costo de cada corrida | **tú**, corriendo `python doc_sesions/sesion3/tokens.py`. La salida se guarda sola en `docs/SALIDA_TOKENS.txt` | el agente, leyendo de ese archivo **la fila del bloque de tu enunciado** |
| Duración | **tú**, con el reloj | el agente |
| Turnos en que lo corregiste | **tú**, contándolos | el agente |
| Dónde quedó el estado | el agente, mirando su código; **tú lo confirmas en la barra de direcciones** | el agente |
| Decisiones no pedidas | el agente, si se las pides al cerrar cada corrida | el agente |

**Un solo instrumento para la tabla, y es `tokens.py`.** Las filas S1 y S2 se
midieron con él, así que las cinco corridas de hoy también. Y se anotan **los
tokens y los dólares**, no solo los dólares: los precios cambian y los tokens
no, así que una tabla con tokens sigue sirviendo el año que viene.

**Y se anota el bloque, no la conversación.** `tokens.py` te da una fila por
conversación y, debajo, una por bloque: tu mensaje y todas las respuestas que
vinieron después, hasta tu mensaje siguiente. El costo de la tarea es el del
bloque. Si el chat de la corrida lleva solo la tarea, los dos números coinciden
y no hay nada que elegir; si además le pediste otra cosa en ese mismo chat, la
fila de la conversación ya no es el costo de la tarea.

**`/usage` no es el instrumento de la tabla, y tampoco sirve en un chat recién
abierto**, porque su bloque Session se reinicia con cada conversación nueva.
Por eso se mira al cerrar una corrida de la Fase 3.2, no al empezar la 3.1. Es la
pantalla de clase, y sirve para una cosa que `tokens.py` no puede: decir si la
caché está caliente en este momento. Se mira, se aprende de ella, y no se copia
a la tabla.

### Estado del repositorio al iniciar la sesión

* El repositorio en `<RUTA_PROYECTO>`, **sin cambios pendientes** y en
  `<COMMIT_ANTERIOR>`.
* `docs/00-ANTES.md` con su sección **FACTURA**.
* `docs/MEDICIONES.md` con la fila **S1** llena, la **S2** llena o la
  constancia de que falta, y al pie el enunciado de la tarea patrón.
* **Los tres costos viejos medidos por bloque y con el `tokens.py` corregido**:
  el consumo de la FACTURA, la fila S1 y la fila S2. Si alguno no lo está, se
  vuelve a medir en el Paso 2 de la ruta, que va **antes** de leer la spec.
* El `CLAUDE.md` escrito y auditado en la sesión 2.
* El **commit de la tarea patrón** aislado y reversible.
* **Claude Code 2.1.283 o superior.**

---

## Prompt 0 — Verificación del terreno

> **Chat nuevo.** Comprueba, y deja lo comprobado escrito en un archivo:
> `docs/VERIFICACION_S3.md`. Es el único archivo que toca hoy, y es de donde
> los prompts siguientes sacan el enunciado, el commit del patrón y los datos
> de tu factura. Así no tienes que copiar nada a mano ni volver a este chat.

```text
[ROL] Actúa como ingeniero que revisa el instrumental antes de una medición.
Hoy vamos a comparar cinco corridas entre sí y contra dos filas de semanas
anteriores, así que cualquier cosa fuera de sitio arruina la comparación.
Detente en la primera sorpresa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y debería estar en
<COMMIT_ANTERIOR>. Lee doc_sesions/sesion3/Ed5_sesion3.md, secciones "Antes de
empezar" y "Estado de partida". Las sesiones 1 y 2 dejaron docs/00-ANTES.md,
docs/MEDICIONES.md, mi CLAUDE.md y un commit aislado con la tarea patrón.

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones, con su comando: claude (mínimo 2.1.283), node, npm, git, python.
   Si claude está por debajo del mínimo, dímelo y sigue verificando.
2. Que el repositorio esté limpio y en qué commit estoy: git status --short y
   git log --oneline -1.
3. Que docs/00-ANTES.md tenga la sección FACTURA, y cítame sus cuatro datos
   tal como están escritos. No los interpretes. Dime además si el consumo que
   ahí aparece dice de qué BLOQUE de conversación salió y que se midió con
   tokens.py ya corregido, o si dice "sin dato". De esa sección sale la
   hipótesis de hoy, así que un número viejo ahí contamina la sesión entera.
4. Que docs/MEDICIONES.md exista y dime cuántas filas están llenas: la S1, la
   S2, las dos, o ninguna. Si la S2 está vacía, dímelo claro, porque cambia
   con qué se compara hoy.
5. Lo mismo con la celda de costo de las filas S1 y S2 de docs/MEDICIONES.md:
   dime si al pie de la tabla queda escrito de qué bloque salió cada una y con
   qué script se midió. Si alguno de los tres datos —el de la FACTURA, la S1 o
   la S2— no lo dice, avísame: ese número puede venir inflado, y hay que volver
   a medirlo con el Paso 2 de la ruta antes de comparar nada. No lo midas tú.
6. Cítame entre comillas el enunciado de la tarea patrón que está al pie de
   esa tabla. Es el que voy a repetir hoy tres veces sin cambiar una palabra.
7. Que el commit de la tarea patrón esté en el historial y sea reversible:
   encuéntralo con git log --oneline, dime su mensaje y qué archivos tocó con
   git show --stat.
8. Que exista mi CLAUDE.md en la raíz, y cuántas líneas tiene.
9. Que python pueda correr la herramienta de medición: comprueba que
   doc_sesions/sesion3/tokens.py existe y es legible, y que contiene la palabra
   "vistos", que es la marca de la versión corregida. No la ejecutes: la corro yo.
10. Escribe docs/VERIFICACION_S3.md con lo que acabas de comprobar, para que
   los prompts de hoy lo lean de ahí y yo no tenga que copiar nada. Con la
   fecha arriba y estas secciones, en este orden:
   - Versiones, una línea cada una.
   - El commit en el que arranqué hoy, con su mensaje.
   - Los cuatro datos de la FACTURA, citados tal como están escritos.
   - Qué filas de docs/MEDICIONES.md están llenas.
   - Si el consumo de la FACTURA, la fila S1 y la fila S2 dicen de qué bloque
     salieron: una línea por dato, y el veredicto de si hay que volver a medir.
   - EL ENUNCIADO DE LA TAREA PATRÓN, entre comillas y completo, en su propia
     sección y con ese título. Es lo que más se va a leer de este archivo.
   - El commit de la tarea patrón: su identificador, su mensaje y sus archivos.
   - El veredicto final, en una línea.
   Nada más. Es un archivo para leer de un vistazo, no un informe.

[RESTRICCIONES]
- El ÚNICO archivo que escribes es docs/VERIFICACION_S3.md. Ningún otro.
- No modifiques docs/00-ANTES.md, docs/MEDICIONES.md ni mi CLAUDE.md.
- No reviertas nada todavía: eso es la Fase 3.2.
- No cambies el modelo ni el effort: eso lo hago yo, en el chat.
- No corrijas ningún defecto del inventario.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.

[RAZONAMIENTO] Ejecuta las comprobaciones una a una y, si alguna falla,
diagnostica antes de pasar a la siguiente. Si falta un artefacto de una sesión
anterior, dime qué camino de repuesto da la spec en vez de improvisar uno.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado; (2) los
cuatro datos de la FACTURA, citados; (3) qué filas de la tabla están llenas;
(4) si el consumo de la FACTURA, el de la S1 y el de la S2 dicen de qué bloque
salieron, una línea por dato; (5) el enunciado de la tarea patrón entre
comillas; (6) el commit de la tarea con sus archivos; (7) veredicto en una
línea: "terreno listo, adelante con la lectura", "hay que volver a medir con el
Paso 2 de la ruta, y va antes de todo lo demás", o el bloqueo encontrado;
(8) docs/VERIFICACION_S3.md escrito, y me dices cuántas líneas tiene. Sin
commit: ese archivo entra en el commit de la Fase 3.1.
```

---

## Paso 2 de la ruta (condicional) — Volver a medir los costos de las sesiones 1 y 2

> **En la terminal, no en el chat.** Y solo si te toca: lo dice el veredicto de
> `docs/VERIFICACION_S3.md`, que acaba de escribir el Prompt 0. Si ahí dice que
> los tres costos dicen de qué bloque salieron, sáltate este paso entero.
>
> **Va aquí, antes de leer la spec, y no más adelante.** Todo lo que viene
> después se apoya en estos números: la hipótesis de la Fase 3.1 nace de tu
> FACTURA, y la comparación de la Fase 3.3 nace de las filas S1 y S2. Corregir
> el instrumento después de haber medido con él no sirve de nada.

**Qué pasaba.** La versión anterior de `tokens.py` daba el número mal, por dos
motivos a la vez:

| El problema | Qué salía |
|---|---|
| Contaba cada respuesta tantas veces como pedazos tiene en el disco | El gasto inflado, entre **1,9 y 4,2 veces** el real |
| Sumaba la conversación completa | El costo de todo lo que hiciste en ese chat, no el de la tarea |

Claude Code guarda una misma respuesta en varias líneas —una por el texto y una
por cada comando que corrió—, y repite el mismo contador en todas. El script
sumaba cada línea.

**Y el error no se arregla dividiendo**, porque no es parejo: una respuesta que
corre seis comandos se cuenta siete veces y una que solo escribe, una. Así que
infla más las corridas en las que el agente investigó más. Eso es exactamente
lo que esta sesión compara.

**Qué cambió.** El `tokens.py` de esta carpeta cuenta cada respuesta una sola
vez y te da el gasto **por bloque**. Un bloque es cada cosa que pediste: tu
mensaje y todas las respuestas que vinieron después, hasta tu mensaje siguiente.

### Qué hay que volver a medir, y en este orden

Son tres datos, y los tres se corrigen con el mismo comando. **El primero es el
de la FACTURA**, porque es el que usa la fase siguiente.

| Dato | Dónde vive | Quién lo usa hoy |
|---|---|---|
| El consumo de la generación de tu app | `docs/00-ANTES.md`, sección FACTURA | la **Fase 3.1**: tu hipótesis sale de ahí |
| Los dos números de la caché | la misma sección FACTURA | la **Fase 3.1** |
| La fila **S1** y la fila **S2** | `docs/MEDICIONES.md` | la **Fase 3.3**: la comparación con las corridas de hoy |

Si alguno dice "sin medir" o "sin dato", no hay nada que corregir: hay que
medirlo por primera vez, con los mismos comandos de abajo.

### Primero la FACTURA, porque es la que usa la fase siguiente

Desde la raíz del proyecto, sin argumentos:

```bash
python doc_sesions/sesion3/tokens.py
```

**Los dos números de la caché** son las dos últimas líneas de la salida: lo que
costaron los tokens que se leyeron de caché, y lo que habrían costado como
entrada nueva. Van a la FACTURA tal cual, y son de todo el proyecto, no de una
conversación.

**El consumo de la generación** es otra cosa: es el bloque en el que pegaste el
encargo, dentro de la conversación de la Fase 1.2. Para dar con ella: es la de
más turnos de la tabla, y su duración se parece a la que tu FACTURA ya tiene
anotada. Cuando la tengas:

```bash
python doc_sesions/sesion3/tokens.py --bloques <esa conversación>
```

**No copies nada todavía.** La salida queda guardada sola en
`docs/SALIDA_TOKENS.txt`, y el prompt del final de este paso es el que escribe
los números en la FACTURA. Lo único que tienes que saber es **cuál de las
conversaciones es la de la generación**, porque eso te lo va a preguntar.

### Después, las filas S1 y S2: busca tus corridas

```bash
python doc_sesions/sesion3/tokens.py --patron
```

Busca, en todas tus conversaciones guardadas, los bloques que empiezan con el
enunciado de la tarea patrón, y te los muestra en orden. No tienes que acordarte
de qué chat fue cada corrida.

### Y qué hacer según lo que salga

| Lo que ves | Qué haces |
|---|---|
| Aparecen tus dos corridas | Listo: el prompt del final escribe las dos filas. La más antigua es la S1 y la siguiente la S2 |
| Aparece una sola | Se escribe esa. La otra fila se queda como esté: no se repite un laboratorio por una celda |
| Aparecen con **dos enunciados distintos** | Se usa solo el grupo del enunciado que tienes anotado al pie de tu tabla. El prompt te dice cuál dejó fuera |
| **No aparece ninguna** | Esas conversaciones ya no están en tu disco. Pasa al apartado de abajo |

Abrir un chat nuevo no borra el anterior: el archivo se queda en el disco. Así
que lo último solo pasa si borraste las sesiones a propósito.

### Y ahora el prompt que escribe los datos

> **Chat nuevo.** Tú corriste la herramienta; el agente escribe. Los dos
> comandos de arriba dejaron su salida en `docs/SALIDA_TOKENS.txt`, así que no
> tienes que pegar ninguna fila: el agente la lee de ahí.

```text
[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Acabo de correr la herramienta
de medición dos veces, y las dos salidas quedaron guardadas en
docs/SALIDA_TOKENS.txt, la de más abajo es la más reciente. Lee ese archivo, y
también docs/VERIFICACION_S3.md, que dice cuáles de mis datos viejos hay que
reemplazar y cuáles están bien.

[OBJETIVO] Reemplaza SOLO los datos que la verificación marcó como pendientes,
copiando los números del archivo de salida.
1. En docs/00-ANTES.md, sección FACTURA: el consumo de la generación —los
   cuatro contadores de tokens y los dólares del bloque en el que pegué el
   encargo— y los dos números de la caché, que son las dos últimas líneas de
   la corrida sin argumentos. Antes de escribir nada, dime qué conversación y
   qué bloque vas a tomar como la generación, y espera a que te lo confirme.
2. En docs/MEDICIONES.md, las filas S1 y S2: el costo y la duración del bloque
   de cada corrida, que están en la salida de --patron. La más antigua es la
   S1 y la siguiente la S2. Si aparecen con dos enunciados distintos, usa solo
   el grupo del enunciado que está al pie de la tabla, y dime cuál dejaste
   fuera.
3. Al pie de cada uno de los dos archivos, una línea: de qué conversación y de
   qué bloque salió el dato, que se midió con tokens.py ya corregido, y la
   fecha de hoy.

[RESTRICCIONES]
- No toques ningún dato que la verificación no haya marcado como pendiente.
- No estimes, no redondees y no recalcules: los números van copiados tal cual
  del archivo de salida.
- Si un dato no aparece ahí, escribe "sin medir" y dímelo. No lo inventes y no
  vuelvas a medir por tu cuenta: la herramienta la corro yo.
- No toques la fila S3: es la de hoy y queda vacía.
- No toques el código de la app, ni mi CLAUDE.md, ni las tablas de decisiones
  no pedidas.

[RAZONAMIENTO] La conversación de la generación es la de más turnos del
proyecto, y su duración se parece a la que la FACTURA ya tiene anotada. Si hay
dos candidatas, dímelo y no elijas tú.

[FORMATO DE SALIDA] (1) qué conversación y qué bloque tomaste como la
generación, antes de escribir; (2) después de mi confirmación, qué celdas
cambiaste, una línea por celda, con el valor viejo y el nuevo; (3) las dos
notas al pie; (4) commit propuesto: "docs: re-measure the old costs with the
fixed tokens.py".
```

### Solo si no apareció ninguna — repetir el laboratorio 2

**Solo si no apareció ninguna corrida.** Es más largo, pero no rompe nada: el
enunciado es el mismo y los datos viejos se reemplazan, no se mezclan.

1. **Revierte todos los commits del laboratorio 2, en orden inverso**: el más
   reciente primero. Con `git revert`, nunca con `reset --hard`, que reescribe
   la historia.

   ```bash
   git log --oneline
   ```

   Uno de esos commits es el que creó tu `CLAUDE.md`, así que al revertirlo el
   contrato se va con él. Y eso es justo lo que la S1 necesita: medirse **sin
   reglas**. Si revirtieras solo el commit de la tarea patrón, el `CLAUDE.md`
   se quedaría puesto y esa corrida ya no sería una S1.

2. **Comprueba que el `CLAUDE.md` ya no está.** Un archivo que nunca se
   commiteó no se va con ningún `revert`, así que si sigue ahí, renómbralo a
   `CLAUDE.md.guardado` y lo devuelves a su sitio en el punto 4.

   ```bash
   git status --short
   ```

3. **Corre la corrida sin reglas**, que es tu S1: conversación nueva, el mismo
   enunciado del pie de tu tabla, y lo mides con el comando de más arriba.

4. **Corre el laboratorio 2 completo**, desde su Fase 2.1, que es la que vuelve
   a escribir el `CLAUDE.md`. Su Fase 2.3 es tu S2, y la mides igual. Sigue
   hasta el prompt de cierre del laboratorio 2.

5. **Vuelve aquí** y sigue con la Fase 3.1.

### Y queda anotado

Al pie de `docs/MEDICIONES.md`, una línea: que esas filas se volvieron a medir,
en qué fecha, porque las conversaciones originales no estaban en el disco. Es lo
que te deja explicar, dentro de tres semanas, por qué la S1 se midió después de
la S2.

### Antes de seguir

Que los tres datos digan de qué bloque salieron y con qué script se midieron:
el consumo de la FACTURA, la fila S1 y la fila S2. Si uno queda sin medir, se
escribe "sin medir" y se sigue; lo que no vale es dejarlo con el número viejo
sin decir de dónde salió.

---

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

> **Chat nuevo.** Tampoco escribe nada.

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion3/Ed5_sesion3.md y también
doc_sesions/sesion3/TAREA_PATRON.md, porque la Fase 3.2 repite esa misma tarea
tres veces. Devuélveme lo que entendiste:
1. Las 3 fases en orden, con qué entrega cada una.
2. Qué NO se hace hoy, y en qué sesión se hace cada una de esas cosas.
3. Qué cambia entre las cinco corridas, y qué tiene que quedar idéntico.
4. Por qué hay que revertir entre corrida y corrida, o sea qué pasaría con la
   medición si no lo hiciéramos.
5. En dos líneas: por qué recortar mi prompt casi no cambia el costo, y qué sí
   lo cambia.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.
- No corras todavía ninguna corrida ni ninguna medición.
- No cambies el modelo ni el effort.
- No toques docs/00-ANTES.md, docs/MEDICIONES.md ni mi CLAUDE.md.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora: corregirlo aquí es gratis y durante una fase cuesta. Y si la spec pide
algo que mi versión de Claude Code no puede hacer, dímelo también.

[FORMATO DE SALIDA] (1) las 3 fases, una línea cada una; (2) lo que NO se hace
hoy, con su sesión; (3) qué cambia y qué no entre las cinco corridas; (4) para qué sirve
el revert; (5) las dos líneas del costo; (6) tus dudas, si hay. Sin commit.
```

---

## Prompt Fase 3.1 — Tu factura, y tres hipótesis

> **Conversación nueva.** Y empieza con una cosa que haces tú, antes de pegar
> ningún prompt.

**Paso 1 — abre tu propia factura.** Está en la sección **FACTURA** de
`docs/00-ANTES.md`, y ya trae todo lo que esta fase necesita: lo que costó
generar la app, cuánto tardó, y los dos números de la caché —lo que costaron
los tokens leídos de caché y lo que habrían costado como entrada nueva—.
**Ese contraste es tuyo, no un ejemplo de clase.**

Si alguno de esos datos falta, o no dice de qué bloque salió, **no se arregla
aquí**: se arregla en el Paso 2 de la ruta, que ya pasó. Si llegaste hasta acá
sin hacerlo, vuelve: una hipótesis escrita sobre un número inflado no se puede
comprobar ni desmentir, y esta fase entera deja de servir.

> **De dónde sale ese dólar, y hay que tenerlo claro antes de seguir:** lo
> calcula **tu máquina**, contando tus tokens a tarifa de lista. Si pagas con
> un plan de Claude, **no te están cobrando eso**: consumes cuota. El número
> sirve para comparar tareas entre sí, que es exactamente lo que vas a hacer
> hoy.

**Paso 2 — ahora sí, pega esto:**

```text
[ROL] Actúa como el analista que explica una factura a quien la va a pagar:
sin jerga, y sin suponer ningún número que no te haya dado yo.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 3.1 de
doc_sesions/sesion3/Ed5_sesion3.md y después docs/VERIFICACION_S3.md, que
escribió el Prompt 0 de hoy: ahí están los cuatro datos de mi FACTURA, ya
citados y verificados. Trabaja sobre esos, no sobre una medición nueva.

Los que necesitas de ese archivo son tres: lo que costó generar la app y
cuánto tardó, los tokens leídos de caché con lo que costaron, y lo que habrían
costado como entrada nueva. Si alguno dice "sin dato", dímelo y seguimos con
los que haya.

[OBJETIVO] Tres cosas.
1. Explícame en tres líneas qué parte de ese consumo es entrada nueva, qué
   parte es lectura de caché y qué parte es salida, usando MIS números.
2. Dime, en una línea y con la cuenta hecha, qué proporción de mi consumo
   entró por caché.
3. Ayúdame a escribir mis hipótesis: TRES, una línea cada una, y las tres
   sobre cosas que las cinco corridas de hoy pueden confirmar o desmentir.
   Una por cada pregunta:
   - ¿Qué palanca mueve más mi costo, el modelo o el effort?
   - ¿El effort paga lo mismo con el modelo caro que con el barato? Esta solo
     se puede responder porque hoy se corre la cuadrícula completa.
   - ¿Cuánto hay entre mi configuración más cara y la más barata? Aquí va un
     número, o un orden de magnitud.
   Propónme dos o tres redacciones de cada una y las elijo yo. Después
   escríbelas en docs/COSTOS.md, con la fecha de hoy, bajo el título
   "Hipótesis antes de medir", numeradas 1, 2 y 3.

[RESTRICCIONES]
- No estimes ni inventes ningún número. Usa solo los de
  docs/VERIFICACION_S3.md, y no vuelvas a medir nada para completarlos.
- No modifiques docs/VERIFICACION_S3.md: hoy ese archivo solo se lee.
- No me digas todavía qué configuración me conviene: eso lo vamos a medir, y
  si me lo dices ahora contamino mis propias hipótesis.
- docs/COSTOS.md queda con las tres hipótesis y nada más. La tabla de las
  corridas la empieza la fase 3.2 y la cierra la 3.3.
- No toques docs/00-ANTES.md: es la fotografía de la sesión 1.
- No cambies el modelo ni el effort.

[EJEMPLOS] El tono de las hipótesis, que es lo único que se escribe hoy:
  1. "Creo que manda el modelo: casi todo mi consumo fue relectura de caché,
     así que bajar el effort debería moverlo poco."
  2. "Creo que el effort paga más con el modelo caro, porque es el que más
     razona antes de responder."
  3. "Creo que entre mi configuración más cara y la más barata hay menos de la
     mitad del costo."
Afirmaciones comprobables y arriesgadas, no descripciones de lo que ya veo.

[FORMATO DE SALIDA] (1) el reparto de mi consumo en tres líneas; (2) la
proporción que entró por caché, con la cuenta; (3) las redacciones de las tres
hipótesis para que yo elija, agrupadas por pregunta; (4) después de mi
elección, docs/COSTOS.md escrito con las tres numeradas; (5) commit propuesto:
"docs: record the cost hypotheses for Fase 3.1".
```

### Verificación de la fase

1. `docs/COSTOS.md` existe y tiene las **tres hipótesis**, una línea cada una,
   numeradas y con fecha.
2. Los dos números de la caché están anotados, los tuyos.
3. `git status` no muestra cambios fuera de `docs/`.

---

## Prompt Fase 3.2 — Cinco corridas, una tarea

> **Son cinco corridas, y cada una lleva dos chats**: uno corto donde el agente
> revierte la corrida anterior, y el de la corrida, que tiene dos pasos dentro.
> Diez chats en total, y ninguno se reutiliza.
>
> El modelo y el effort los cambias tú, en el chat de la corrida y antes de
> pegar el enunciado.

| | Modelo | Effort | Qué es |
|---|---|---|---|
| **A** | el de la sesión 2 | el de la sesión 2 | la referencia: repite tu fila S2 |
| **B** | el más capaz | el más alto | el techo |
| **C** | el más capaz | el más bajo | |
| **D** | el más barato | el más alto | |
| **E** | el más barato | el más bajo | el piso |

De la B a la E son las cuatro combinaciones de dos palancas: dos modelos por
dos niveles de effort. Por eso cada palanca se mide **dos veces**, una con cada
ajuste de la otra.

| Comparas | Te dice |
|---|---|
| **B con C** | cuánto paga el effort, con el modelo caro |
| **D con E** | cuánto paga el effort, con el modelo barato |
| **B con D** | cuánto paga el modelo, con el effort alto |
| **C con E** | cuánto paga el modelo, con el effort bajo |
| **B con E** | el rango completo: lo más caro contra lo más barato |
| **A con tu fila S2** | cuánto varía sola la misma configuración, de una semana a otra |

**Las dos primeras filas son el hallazgo que tres corridas no podían dar.** Si
el effort paga mucho con el modelo caro y casi nada con el barato, lo ves. Con
una sola medición por palanca tenías que suponer que se portan igual en
cualquier combinación.

**Y la última fila es ruido medido.** La A repite la configuración de la
sesión 2, así que lo que la separe de tu fila S2 no es ninguna palanca: es la
variación natural del agente entre dos días. Te dice cuánta diferencia entre
las otras corridas es señal y cuánta es ruido.

> **De dónde sacas la configuración de la sesión 2.** No hace falta que la
> recuerdes: está guardada en la conversación de esa corrida. Corre
> `python doc_sesions/sesion3/tokens.py --patron` y mira la columna
> **configuración** de la fila de tu S2: trae el modelo y el effort con los que
> se corrió.
>
> La fila S2 de `docs/MEDICIONES.md` no se toca ni se reemplaza: sigue
> sirviendo para lo suyo, comparar con contrato y sin contrato.

**Las cuatro reglas que hacen que esto mida algo.** Si se rompe una, la corrida
no sirve y hay que repetirla:

1. **Conversación nueva en cada corrida.** Cada conversación es una fila
   distinta en la herramienta, así que cada corrida tiene su propio costo
   limpio, y el agente llega sin la corrida anterior en contexto.
2. **`git revert` antes de cada corrida**, para volver al código de partida.
   Lo hace el agente, con su prompt y en su propio chat. **Es el error que
   arruina la medición**: si la corrida B arranca con la tarea ya hecha, sale
   baratísima y no mide nada.
3. **Enunciado idéntico**, el mismo de la sesión 1, copiado del pie de tu
   tabla. Ni una palabra distinta.
4. **Mide con `tokens.py` antes de cerrar** cada conversación, y anota tokens
   y dólares **del bloque del enunciado**. Es el mismo instrumento con el que
   se midieron tus filas S1 y S2. Si el chat lleva solo la tarea, el bloque y
   la conversación dan el mismo número, que es lo que buscamos.

> **Un aviso honesto que conviene tener claro:** cada conversación nueva paga
> su propia escritura de caché. Está incluido en el precio de cada corrida, y
> es correcto que lo esté: es lo que cuesta hacer esa tarea desde cero.

### El revert, antes de cada corrida — y va en su propio chat

Son **tres reverts**: uno antes de cada corrida. Los hace el agente, con este
prompt, y siempre en un **chat corto aparte**.

> **No lo pegues en el chat de la corrida.** Ese chat lleva solo la tarea: si
> antes le pides que deshaga la corrida anterior, el agente llega sabiendo qué
> le vas a pedir, y la medición deja de ser comparable con las otras dos.

```text
[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Estoy en la Fase 3.2 de
doc_sesions/sesion3/Ed5_sesion3.md, y voy a empezar una corrida de la tarea
patrón. Antes, la app tiene que volver al estado anterior a la corrida que
acabo de terminar.

[OBJETIVO]
1. Muéstrame git log --oneline -5 y dime cuál es el commit que hay que
   revertir:
   - si ya corrí alguna corrida de hoy, es la última, y su mensaje empieza
     por "feat: pattern task run";
   - si todavía no corrí ninguna, es el de la tarea patrón de la sesión 2, y
     lo tienes identificado en docs/VERIFICACION_S3.md.
2. Espera a que yo te lo confirme. No reviertas nada antes.
3. Revierte ese commit con git revert --no-edit, y deja en el mensaje del
   revert para qué corrida de la Fase 3.2 lo hiciste.
4. Comprueba con git status --short que el árbol quedó limpio y muéstrame
   git log --oneline -3.

[RESTRICCIONES]
- Usa git revert. No borres archivos a mano, no uses git reset --hard y no
  reescribas el historial: los commits de las corridas tienen que seguir
  existiendo, porque la Fase 3.3 los cita.
- No toques docs/: ni la tabla de mediciones, ni el inventario, ni COSTOS.md.
- No toques mi CLAUDE.md.
- Si el revert da conflicto, detente y muéstramelo. No lo resuelvas tú.
- No me adelantes nada de la tarea que voy a pedir después, ni la nombres.

[RAZONAMIENTO] Un revert del commit equivocado me deja con la tarea ya hecha
al empezar la corrida, y esa corrida sale baratísima sin medir nada. Por eso
me muestras el commit antes y esperas.

[FORMATO DE SALIDA] (1) el commit que vas a revertir, con su mensaje; (2) tras
mi confirmación, la salida de git revert; (3) git status --short y
git log --oneline -3; (4) una línea diciendo si la app quedó en el punto de
partida.
```

**Cierra ese chat** y abre el de la corrida.

### Y lo que cambias tú, fuera del prompt

| Antes de | Qué pones, con `/model` y `/effort` |
|---|---|
| **A** | El modelo y el effort de tu sesión 2. Los lees de la columna "configuración" de `tokens.py --patron` |
| **B** | El modelo más capaz que tengas, y el effort más alto |
| **C** | El mismo modelo, y el effort más bajo |
| **D** | El modelo más barato, y el effort más alto |
| **E** | El modelo más barato, y el effort más bajo |

Los dos comandos con barra los escribes tú, en el chat de la corrida y antes de
pegar el enunciado. El agente no los puede correr por ti.

**Comprueba que quedaron puestos antes de pegar el enunciado.** Una corrida con
la configuración de la anterior no mide lo que dice medir, y eso no se nota
hasta la Fase 3.3, cuando dos filas salen iguales sin motivo.

> En los modelos de la generación 5.5 y en Fable 5.1 o posterior, cambiar el
> effort **no** rompe la caché. En modelos más viejos sí, y Claude Code te
> avisa antes de hacerlo.

**Si el reloj aprieta, el orden en que se sacrifican es este:** primero la
**A**, que es la referencia y la puedes reemplazar por tu fila S2 aceptando que
se midió otro día; después la **C** o la **D**, que te deja la cuadrícula coja
pero conserva el techo y el piso. **La B y la E no se tocan**: sin ellas pierdes
el rango, que es el número que te vas a llevar.

Las que no corras hoy quedan para casa, y se anotan como pendientes.

### En cada corrida — Paso 1

1. Abre una **conversación nueva**.
2. Si a esta corrida le toca cambiar el effort o el modelo, **cámbialo ahora**,
   antes de pegar nada.
3. **Arranca el reloj**: anota la hora exacta, con minutos.
4. Pega **solo el enunciado**, tal cual, sin una palabra más. Está citado
   completo en `docs/VERIFICACION_S3.md`, en su propia sección, y también al
   pie de tu `docs/MEDICIONES.md`. Si los dos no coinciden, manda el de la
   tabla y avisa al docente.
5. **Cuenta los turnos** en que tengas que corregirlo.

Cuando termine, **verifica los cinco pasos sin abrir ningún archivo**: arranca
la app · aplica el filtro, pasa de página o cambia el orden, **según el
enunciado que sea el tuyo** · **recarga con F5** · copia la URL en otra
pestaña · vuelve al estado inicial. Y mira la **barra de direcciones**.

**El reloj se para aquí**, cuando termina el paso 5 de la verificación, no
cuando el agente deja de escribir. Esa resta —de pegar el enunciado a terminar
de verificar— es la duración que va a la tabla, y se mide igual en las cinco
corridas.

**Antes de cerrar, mide la corrida.** En otra terminal, desde la raíz del
proyecto:

```bash
python doc_sesions/sesion3/tokens.py
```

Debajo de la tabla sale el desglose de esta conversación, que es la más
reciente, y **la salida entera se guarda sola en `docs/SALIDA_TOKENS.txt`**.
No tienes que copiar nada: el prompt del paso 2 lo lee de ahí. Mírala para
comprobar que el bloque del enunciado aparece, que si hiciste bien la corrida
es el único que hay. Y si quieres ver la caché en vivo, escribe `/usage` en el chat antes de
cerrarlo: eso se mira, no se copia a la tabla.

### En cada corrida — Paso 2

En ese mismo chat, pega esto:

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. Acabas de hacer la tarea que te pedí.
Lee la Fase 3.2 de doc_sesions/sesion3/Ed5_sesion3.md y la sección 3 de
doc_sesions/sesion3/TAREA_PATRON.md. Esta es la corrida [A / B / C / D / E] de
cinco. Con qué modelo y qué effort corrió no me lo preguntes: está en
docs/SALIDA_TOKENS.txt, en la columna "configuración" del bloque de esta
corrida.

[OBJETIVO] Dos cosas.
1. Enumera lo que decidiste en esta tarea y que yo no te pedí, y marca las que
   yo habría querido aprobar antes de que las hicieras.
2. Agrega a docs/COSTOS.md una fila para esta corrida, en una tabla con estas
   columnas: corrida, modelo, effort, resultado, turnos, decisiones no
   pedidas, costo, duración. Si la tabla no existe, créala debajo de las
   hipótesis.
   El modelo y el effort los copias de la columna "configuración" de ese
   mismo bloque, no de lo que yo te diga: así la fila dice con qué corrió de
   verdad. Si no coincide con la configuración que esta corrida debía tener,
   PÁRATE y avísame: esa corrida no sirve y hay que repetirla.
   Los datos que te doy yo:
   - resultado: [a la primera / tras corregir / no pasa / rompió algo]
   - turnos en que tuve que corregirte: [N]
   - costo: no me lo pidas, léelo de docs/SALIDA_TOKENS.txt, que es donde
     quedó guardada la medición que acabo de correr. Toma la corrida MÁS
     RECIENTE del archivo y, dentro de ella, la fila del BLOQUE del enunciado:
     no la de la conversación. Si en este chat hubo algo más que la tarea, la
     fila de la conversación mide de más. Dime cuál tomaste antes de escribirla
   - duración: [N] minutos

[RESTRICCIONES]
- No cambies el comportamiento de lo que acabas de hacer para que la fila
  luzca mejor.
- No toques las filas de las otras corridas.
- No toques docs/MEDICIONES.md: esa fila se escribe en la fase 3.3, una vez,
  con la configuración que yo elija.
- No estimes ningún dato de los que te di. Si alguno viene vacío, escribe
  "sin medir".
- No me recomiendes todavía qué configuración usar.

[FORMATO DE SALIDA] (1) tus decisiones no pedidas, en lista; (2) la fila
escrita; (3) la configuración que leíste del archivo, y si coincide con la que esta
corrida debía tener; (4) commit propuesto: "feat: pattern task run
[A/B/C/D/E] for Fase 3.2".
```

**Cierra la conversación** y pasa a la corrida siguiente.

### Verificación de la fase

1. `git log --oneline` → las corridas y sus reverts, en orden.
2. `git status --short` → sin salida.
3. `docs/COSTOS.md` tiene una fila por corrida —cinco, o las que hayas
   alcanzado—, cada una con su configuración y su costo.
4. Cada fila tiene sus datos, o "sin medir" donde corresponda.

---

## Prompt Fase 3.3 — `docs/COSTOS.md` y la regla

> **Conversación nueva.** No hace falta medir nada aquí: las cinco corridas ya
> están medidas con `tokens.py` desde la fase 3.2, y sus números están en la
> tabla de `docs/COSTOS.md`. Esta fase solo elige y escribe.

```text
[ROL] Actúa como el ingeniero que cierra un experimento: escribe lo que los
números muestran, no lo que esperabas, y si no muestran nada lo dice.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 3.3 de
doc_sesions/sesion3/Ed5_sesion3.md y después docs/COSTOS.md completo, que ya
tiene mis tres hipótesis y la tabla de las corridas. Las tarifas de lista y su
fecha
de consulta están en la sección "Las tarifas" de la spec.

[PÚBLICO Y TONO] Para mí dentro de tres semanas, y para mi jefe. Directo, con
los números que medí y sin adjetivos.

[OBJETIVO] Deja docs/COSTOS.md terminado, con tres cosas y nada más:
1. La tabla de las corridas, ya está: revísala y dime si alguna celda quedó
   vacía o estimada.
2. Las tarifas de lista que se usaron para esos dólares, **con la fecha en que
   se consultaron**, copiadas de la spec.
3. La regla. Una frase mía con la forma "para tareas así uso esto, y para
   estas otras, aquello". Propónme dos o tres redacciones basadas en MIS
   números y la elijo yo.

Y además:
4. Vuelve a leer mis tres hipótesis del principio del archivo y escribe
   debajo, una línea cada una, si se cumplió o si se desmintió, y con qué par
   de corridas lo compruebas. Las dos cosas se escriben igual. Si alguna no se
   puede responder porque esa corrida quedó pendiente, dilo y no la fuerces.
5. Dime cuál de las cinco corridas me conviene como fila S3 de
   docs/MEDICIONES.md, y por qué. Yo la elijo. Cuando te diga cuál, rellena
   esa fila con los siete datos de TAREA_PATRON.md §3, **copiando el costo de
   la fila que esa corrida ya tiene en docs/COSTOS.md**, con sus tokens y sus
   dólares. No lo vuelvas a medir y no lo recalcules: tiene que ser el mismo
   número, para que la S3 se compare con la S1 y la S2.

[RESTRICCIONES]
- No inventes ninguna cifra de ahorro. Si las corridas salieron casi
  iguales, escribe que salieron casi iguales: eso también es una regla, y
  significa que para esta tarea la configuración cara no aporta nada.
- Si la corrida del modelo más barato salió MÁS cara, no lo maquilles: es el
  resultado, y la explicación son los turnos de corrección.
- No toques las filas S1 ni S2 de docs/MEDICIONES.md.
- No reescribas mi CLAUDE.md. Si alguna corrida mostró que una regla estorba,
  dímelo y lo anoto, pero no la cambies.
- Ningún precio sin su fecha de consulta.

[EJEMPLOS] El tono de la regla, que es el producto de la sesión:
  "Para tareas chicas y acotadas como esta uso el modelo más barato con effort
  bajo, porque me costó la mitad y pasó a la primera. Para cualquier cosa que
  toque la base de datos o el dinero vuelvo al modelo caro, porque un error
  ahí me cuesta más que la diferencia."
Una decisión, con el número que la respalda detrás.

[FORMATO DE SALIDA] (1) qué celdas quedaron vacías o estimadas, si hay;
(2) las tarifas con su fecha; (3) dos o tres redacciones de la regla para que
yo elija; (4) si la hipótesis se cumplió o no; (5) tu recomendación de cuál
corrida va como fila S3, para que yo decida; (6) después de mis decisiones, el
archivo terminado y la fila S3 escrita; (7) commit propuesto: "docs: write the
cost rule and close the measurement table for Fase 3.3".
```

### Verificación de la fase

1. `docs/COSTOS.md` termina con **la regla escrita por ti**. Si no está esa
   frase, la fase no está hecha.
2. El archivo dice qué precios usó y en qué fecha se consultaron.
3. `docs/MEDICIONES.md` → la fila S3 está llena con los siete datos, y las
   filas S1 y S2 siguen como estaban.
4. Está escrito si cada una de tus tres hipótesis se cumplió o se desmintió,
   con el par de corridas que lo demuestra.

---

## Prompt de cierre — Bitácora y tabla al día

> **Conversación nueva.** Deja la sesión documentada y subida, y es lo que la
> sesión 4 lee para arrancar.

```text
[ROL] Actúa como quien escribe la bitácora de un proyecto para que otra
persona —o yo mismo en tres semanas— entienda qué pasó sin tener que leer el
código.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y la sesión 3 terminó. Existen
docs/00-ANTES.md, docs/MEDICIONES.md con sus tres filas, docs/COSTOS.md con la
regla, mi CLAUDE.md de la sesión 2, y los dos archivos que dejó el día:
docs/VERIFICACION_S3.md y docs/SALIDA_TOKENS.txt. El repositorio remoto es
<TU_REPO>.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con los números que
medí y sin adjetivos. Si las corridas empataron, se dice que empataron.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 3, con estas cosas: qué
   hipótesis escribí y si se cumplió; qué configuraciones corrí y qué costó
   cada una; si alguna corrida quedó pendiente y cuál; cuál elegí como fila
   S3 y por qué; qué dice mi regla; y qué queda para la sesión 4.
2. Lee las tres filas de docs/MEDICIONES.md y escribe en la bitácora qué
   cambió a lo largo del curso y qué no. Si alguna columna empató en las tres
   filas, dilo y di qué significa. No inventes una mejora que los números no
   muestran.
3. Comprueba que ningún número de docs/COSTOS.md ni de docs/MEDICIONES.md esté
   estimado: todos salen de una medición o dicen "sin medir". Dime cuáles
   revisaste.
4. Comprueba que .env*.local siga excluido y que no haya ninguna clave en lo
   que se va a subir. Si encuentras alguna, detente y avísame: no subas nada.
5. Sube todo al remoto.

[RESTRICCIONES]
- No corrijas ningún defecto del inventario: siguen siendo material de las
  sesiones 5, 6 y 7.
- No reescribas mi CLAUDE.md ni le agregues reglas.
- No escribas ninguna cifra que no hayamos medido hoy.
- No toques docs/00-ANTES.md.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) la entrada de la bitácora; (2) la comparación de las
tres filas, en tres líneas; (3) qué números revisaste y el resultado;
(4) confirmación de que no hay claves en lo que se sube; (5) la salida del
push; (6) commit propuesto: "docs: close Sesión 3 with the cost rule".
```
