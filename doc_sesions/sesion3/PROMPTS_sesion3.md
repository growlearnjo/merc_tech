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
| 1 | **Prompt 0** — verificar el terreno | chat nuevo |
| 2 | **Prompt 1** — leer la spec | chat nuevo |
| 3 | **Fase 3.1** — tu factura y la hipótesis | chat nuevo. Ahí mismo escribes `/usage` |
| 4 | **Fase 3.2, corrida A** | chat nuevo, con **dos pasos dentro** |
| 5 | **Fase 3.2, corrida B** | **otro** chat nuevo, con dos pasos dentro |
| 6 | **Fase 3.2, corrida C** | **otro** chat nuevo, con dos pasos dentro |
| 7 | **Fase 3.3** — `docs/COSTOS.md` y la regla | chat nuevo |
| 8 | **Cierre** — bitácora y push | chat nuevo |

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
| El costo de cada corrida | **tú**, con `python doc_sesions/sesion3/tokens.py`, en tokens y en dólares | el agente, cuando se lo dictas |
| Duración | **tú**, con el reloj | el agente |
| Turnos en que lo corregiste | **tú**, contándolos | el agente |
| Dónde quedó el estado | el agente, mirando su código; **tú lo confirmas en la barra de direcciones** | el agente |
| Decisiones no pedidas | el agente, si se las pides al cerrar cada corrida | el agente |

**Un solo instrumento para la tabla, y es `tokens.py`.** Las filas S1 y S2 se
midieron con él, así que las tres corridas de hoy también. Y se anotan **los
tokens y los dólares**, no solo los dólares: los precios cambian y los tokens
no, así que una tabla con tokens sigue sirviendo el año que viene.

**`/usage` no desaparece, pero no es el instrumento de la tabla.** Es la
pantalla de clase, y sirve para una cosa que `tokens.py` no puede: decir si la
caché está caliente en este momento. Se mira, se aprende de ella, y no se copia
a la tabla.

### Estado del repositorio al iniciar la sesión

* El repositorio en `<RUTA_PROYECTO>`, **sin cambios pendientes** y en
  `<COMMIT_ANTERIOR>`.
* `docs/00-ANTES.md` con su sección **FACTURA**.
* `docs/MEDICIONES.md` con la fila **S1** llena, la **S2** llena o la
  constancia de que falta, y al pie el enunciado de la tarea patrón.
* El `CLAUDE.md` escrito y auditado en la sesión 2.
* El **commit de la tarea patrón** aislado y reversible.
* **Claude Code 2.1.283 o superior.**

---

## Prompt 0 — Verificación del terreno

> **Chat nuevo.** No escribe nada: solo comprueba.

```text
[ROL] Actúa como ingeniero que revisa el instrumental antes de una medición.
Hoy vamos a comparar tres corridas entre sí y contra dos filas de semanas
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
   tal como están escritos. No los interpretes.
4. Que docs/MEDICIONES.md exista y dime cuántas filas están llenas: la S1, la
   S2, las dos, o ninguna. Si la S2 está vacía, dímelo claro, porque cambia
   con qué se compara hoy.
5. Cítame entre comillas el enunciado de la tarea patrón que está al pie de
   esa tabla. Es el que voy a repetir hoy tres veces sin cambiar una palabra.
6. Que el commit de la tarea patrón esté en el historial y sea reversible:
   encuéntralo con git log --oneline, dime su mensaje y qué archivos tocó con
   git show --stat.
7. Que exista mi CLAUDE.md en la raíz, y cuántas líneas tiene.
8. Que python pueda correr la herramienta de medición: comprueba que
   doc_sesions/sesion3/tokens.py existe y es legible. No la ejecutes: la corro yo.

[RESTRICCIONES]
- No escribas ni modifiques ningún archivo. Ni uno.
- No reviertas nada todavía: eso es la Fase 3.2.
- No cambies el modelo ni el effort: eso lo hago yo, en el chat.
- No corrijas ningún defecto del inventario.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.

[RAZONAMIENTO] Ejecuta las comprobaciones una a una y, si alguna falla,
diagnostica antes de pasar a la siguiente. Si falta un artefacto de una sesión
anterior, dime qué camino de repuesto da la spec en vez de improvisar uno.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado; (2) los
cuatro datos de la FACTURA, citados; (3) qué filas de la tabla están llenas;
(4) el enunciado de la tarea patrón entre comillas; (5) el commit de la tarea
con sus archivos; (6) veredicto en una línea: "terreno listo, adelante con la
lectura" o el bloqueo encontrado. Sin commit.
```

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
3. Qué cambia entre las corridas A, B y C, y qué tiene que quedar idéntico.
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
hoy, con su sesión; (3) qué cambia y qué no entre A, B y C; (4) para qué sirve
el revert; (5) las dos líneas del costo; (6) tus dudas, si hay. Sin commit.
```

---

## Prompt Fase 3.1 — Tu factura, y una hipótesis

> **Conversación nueva.** Y empieza con una cosa que haces tú, antes de pegar
> ningún prompt.

**Paso 1 — abre tu propia factura.** Está en la sección **FACTURA** de
`docs/00-ANTES.md`, y ya trae todo lo que esta fase necesita: lo que costó
generar la app, cuánto tardó, y los dos números de la caché —lo que costaron
los tokens leídos de caché y lo que habrían costado como entrada nueva—.
**Ese contraste es tuyo, no un ejemplo de clase.**

Si alguno de esos datos dice "sin medir", se recupera con el paso 2 de
`PROMPTS_sesion2.md`. No hace falta volver a medir nada aquí.

**Paso 2 — mira la pantalla.** Escribe esto en el chat:

```
/usage
```

Busca el bloque **Session**: trae el costo total, la duración, y el uso por
modelo separado en entrada, salida, lectura de caché y escritura de caché. Si
tu versión lo muestra, busca también la línea `Prompt cache (main)`: dice qué
porcentaje de la entrada se sirvió desde caché y si la caché está caliente.
**Esto sí se mira en vivo**, porque es lo único que el archivo no puede
decirte: si la caché está caliente ahora.

> **De dónde sale ese dólar, y hay que tenerlo claro antes de seguir:** lo
> calcula **tu máquina**, contando tus tokens a tarifa de lista. Si pagas con
> un plan de Claude, **no te están cobrando eso**: consumes cuota. El número
> sirve para comparar tareas entre sí, que es exactamente lo que vas a hacer
> hoy.

**Paso 3 — ahora sí, pega esto:**

```text
[ROL] Actúa como el analista que explica una factura a quien la va a pagar:
sin jerga, y sin suponer ningún número que no te haya dado yo.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 3.1 de
doc_sesions/sesion3/Ed5_sesion3.md y después la sección FACTURA de
docs/00-ANTES.md, que es de donde salen los números de abajo. Te los paso
copiados porque quiero que trabajes sobre los que yo verifiqué, no sobre una
medición nueva.

Mis números, copiados de la sección FACTURA:
- lo que costó generar la app y cuánto tardó: [PEGA AQUÍ esos dos datos]
- tokens leídos de caché, y lo que costaron: [PEGA AQUÍ la última línea de la
  herramienta]
- lo que habrían costado como entrada nueva: [EL OTRO NÚMERO de esa línea]

[OBJETIVO] Tres cosas.
1. Explícame en tres líneas qué parte de ese consumo es entrada nueva, qué
   parte es lectura de caché y qué parte es salida, usando MIS números.
2. Dime, en una línea y con la cuenta hecha, qué proporción de mi consumo
   entró por caché.
3. Ayúdame a escribir UNA hipótesis, en una sola línea, sobre qué palanca creo
   que explica mi número: el modelo, el effort, o la caché. Propónme dos o
   tres redacciones y las elijo yo. Después escríbela en docs/COSTOS.md, con
   la fecha de hoy, bajo el título "Hipótesis antes de medir".

[RESTRICCIONES]
- No estimes ni inventes ningún número. Usa solo los que te di. Si te falta
  uno, dímelo y pídemelo.
- No me digas todavía qué configuración me conviene: eso lo vamos a medir, y
  si me lo dices ahora contamino mi propia hipótesis.
- docs/COSTOS.md queda con la hipótesis y nada más. La tabla es de la fase 3.3.
- No toques docs/00-ANTES.md: es la fotografía de la sesión 1.
- No cambies el modelo ni el effort.

[EJEMPLOS] El tono de la hipótesis, que es lo único que se escribe hoy:
  "Creo que mi número lo explica la caché: casi todo mi consumo fue relectura,
  así que bajar el effort debería moverlo poco."
Una afirmación comprobable y arriesgada, no una descripción.

[FORMATO DE SALIDA] (1) el reparto de mi consumo en tres líneas; (2) la
proporción que entró por caché, con la cuenta; (3) las dos o tres redacciones
de hipótesis para que yo elija; (4) después de mi elección, docs/COSTOS.md
escrito; (5) commit propuesto: "docs: record the cost hypothesis for Fase 3.1".
```

### Verificación de la fase

1. `docs/COSTOS.md` existe y tiene la hipótesis en una línea, con fecha.
2. Los dos números de la caché están anotados, los tuyos.
3. `git status` no muestra cambios fuera de `docs/`.

---

## Prompt Fase 3.2 — Tres corridas, una tarea

> **Son TRES conversaciones**, una por corrida, y cada una tiene dos pasos
> dentro. Lo que cambia entre corridas lo cambias tú, en el chat, antes de
> empezar cada una.

| | Modelo | Effort | Qué mide |
|---|---|---|---|
| **A** | el de la sesión 2 | el de la sesión 2 | tu línea base de hoy |
| **B** | el mismo | **un nivel más abajo** | cuánto te paga el effort |
| **C** | **uno más barato** | el de A | cuánto te paga el modelo |

**Las cuatro reglas que hacen que esto mida algo.** Si se rompe una, la corrida
no sirve y hay que repetirla:

1. **Conversación nueva en cada corrida.** Cada conversación es una fila
   distinta en la herramienta, así que cada corrida tiene su propio costo
   limpio, y el agente llega sin la corrida anterior en contexto.
2. **`git revert` antes de cada corrida**, para volver al código de partida.
   **Es el error que arruina la medición**: si la corrida B arranca con la
   tarea ya hecha, sale baratísima y no mide nada.
3. **Enunciado idéntico**, el mismo de la sesión 1, copiado del pie de tu
   tabla. Ni una palabra distinta.
4. **Mide con `tokens.py` antes de cerrar** cada conversación, y anota tokens
   y dólares. Es el mismo instrumento con el que se midieron tus filas S1 y S2.

> **Un aviso honesto que conviene tener claro:** cada conversación nueva paga
> su propia escritura de caché. Está incluido en el precio de cada corrida, y
> es correcto que lo esté: es lo que cuesta hacer esa tarea desde cero.

### Antes de la corrida A

Comprueba que el repositorio está limpio y que la tarea está revertida:

```bash
git status --short
```

```bash
git log --oneline -3
```

Si la tarea patrón de la sesión 2 todavía está aplicada, revierte su commit
antes de empezar. Y **anota qué modelo y qué effort tienes puestos ahora**:
esa es la configuración de la corrida A.

### Antes de la corrida B

Revierte la corrida A, y **baja el effort un nivel**. El comando lo escribes tú
en el chat:

```
/effort
```

> En los modelos de la generación 5.5 y en Fable 5.1 o posterior, cambiar el
> effort **no** rompe la caché. En modelos más viejos sí, y Claude Code te
> avisa antes de hacerlo.

### Antes de la corrida C

Revierte la corrida B, **vuelve el effort al nivel de la corrida A**, y cambia
a un modelo más barato:

```
/model
```

**Si hay que recortar, la corrida C es la única prescindible** y puede quedar
para casa. La A y la B no.

### En cada corrida — Paso 1

1. Abre una **conversación nueva**.
2. **Anota la hora.**
3. Pega **solo el enunciado**, copiado del pie de tu `docs/MEDICIONES.md`, tal
   cual, sin una palabra más.
4. **Cuenta los turnos** en que tengas que corregirlo.

Cuando termine, **verifica los cinco pasos sin abrir ningún archivo**: arranca
la app · aplica el filtro, pasa de página o cambia el orden, **según el
enunciado que sea el tuyo** · **recarga con F5** · copia la URL en otra
pestaña · vuelve al estado inicial. Y mira la **barra de direcciones**.

**Antes de cerrar, mide la corrida.** En otra terminal, desde la raíz del
proyecto:

```bash
python doc_sesions/sesion3/tokens.py
```

La fila de esta corrida es **la última de la tabla**, la más reciente. Anota sus
cuatro contadores de tokens y los dólares. Y si quieres ver la caché en vivo,
escribe `/usage` en el chat antes de cerrarlo: eso se mira, no se copia a la
tabla.

### En cada corrida — Paso 2

En ese mismo chat, pega esto:

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. Acabas de hacer la tarea que te pedí.
Lee la Fase 3.2 de doc_sesions/sesion3/Ed5_sesion3.md y la sección 3 de
doc_sesions/sesion3/TAREA_PATRON.md. Esta es la corrida [A / B / C] de tres, y
la configuración de hoy es modelo [NOMBRE] con effort [NIVEL].

[OBJETIVO] Dos cosas.
1. Enumera lo que decidiste en esta tarea y que yo no te pedí, y marca las que
   yo habría querido aprobar antes de que las hicieras.
2. Agrega a docs/COSTOS.md una fila para esta corrida, en una tabla con estas
   columnas: corrida, modelo, effort, resultado, turnos, decisiones no
   pedidas, costo, duración. Si la tabla no existe, créala debajo de la
   hipótesis. Los datos que te doy yo:
   - resultado: [a la primera / tras corregir / no pasa / rompió algo]
   - turnos en que tuve que corregirte: [N]
   - costo: [PEGA AQUÍ la fila de esta corrida en tokens.py: los cuatro
     contadores de tokens y los dólares]
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
escrita; (3) commit propuesto: "feat: pattern task run [A/B/C] for Fase 3.2".
```

**Cierra la conversación** y pasa a la corrida siguiente.

### Verificación de la fase

1. `git log --oneline` → las corridas y sus reverts, en orden.
2. `git status --short` → sin salida.
3. `docs/COSTOS.md` tiene tres filas (o dos, si la C quedó para casa), cada
   una con su costo leído de la pantalla antes de cerrar.
4. Cada fila tiene sus datos, o "sin medir" donde corresponda.

---

## Prompt Fase 3.3 — `docs/COSTOS.md` y la regla

> **Conversación nueva.** No hace falta medir nada aquí: las tres corridas ya
> están medidas con `tokens.py` desde la fase 3.2, y sus números están en la
> tabla de `docs/COSTOS.md`. Esta fase solo elige y escribe.

```text
[ROL] Actúa como el ingeniero que cierra un experimento: escribe lo que los
números muestran, no lo que esperabas, y si no muestran nada lo dice.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 3.3 de
doc_sesions/sesion3/Ed5_sesion3.md y después docs/COSTOS.md completo, que ya
tiene mi hipótesis y la tabla de las corridas. Las tarifas de lista y su fecha
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
4. Vuelve a leer mi hipótesis del principio del archivo y escribe debajo, en
   una línea, si se cumplió o si se desmintió. Las dos cosas se escriben
   igual.
5. Dime cuál de las tres corridas me conviene como fila S3 de
   docs/MEDICIONES.md, y por qué. Yo la elijo. Cuando te diga cuál, rellena
   esa fila con los siete datos de TAREA_PATRON.md §3, **copiando el costo de
   la fila que esa corrida ya tiene en docs/COSTOS.md**, con sus tokens y sus
   dólares. No lo vuelvas a medir y no lo recalcules: tiene que ser el mismo
   número, para que la S3 se compare con la S1 y la S2.

[RESTRICCIONES]
- No inventes ninguna cifra de ahorro. Si las tres corridas salieron casi
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
4. Está escrito si tu hipótesis se cumplió o se desmintió.

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
regla, y mi CLAUDE.md de la sesión 2. El repositorio remoto es <TU_REPO>.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con los números que
medí y sin adjetivos. Si las tres corridas empataron, se dice que empataron.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 3, con estas cosas: qué
   hipótesis escribí y si se cumplió; qué tres configuraciones corrí y qué
   costó cada una; cuál elegí y por qué; qué dice mi regla; y qué queda
   pendiente para la sesión 4.
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
