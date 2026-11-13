# Claude Code Ed. 5 — Prompts de la Sesión 2 (Memoria y contexto)

> **Estado del archivo:** completo. Prompt 0, lectura de la spec, las tres
> fases y el cierre.

Cada prompt está construido con los ítems de la rúbrica de prompt engineering
(Rol, Contexto, Objetivo, Público/tono, Restricciones, Formato, Ejemplos,
Razonamiento), incluyendo **solo los pertinentes para cada fase**.

Todos asumen que existe `doc_sesions/sesion2/Ed5_sesion2.md` (la spec). El prompt la
referencia SIEMPRE — la spec es la fuente de verdad; el prompt es el
disparador autocontenido.

| Fase | Rol | Contexto | Objetivo | Público/tono | Restricciones | Formato | Ejemplos | Razonamiento |
|---|---|---|---|---|---|---|---|---|
| 0 Terreno | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 1 Lectura de la spec | — | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 2.1 El `CLAUDE.md` | ✔ | ✔ | ✔ | — | ✔ | ✔ | ✔ | ✔ |
| 2.2 Volver al punto de partida | — | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 2.3 Auditoría y segunda corrida | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| Cierre | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

La Fase 2.1 es la única de la sesión con `[EJEMPLOS]`, y lo que da es **la
forma de una regla**, no un esqueleto para copiar. El contrato sale del
inventario del alumno; si sale de una plantilla, no mide nada.

---

## La ruta de hoy, en orden

**Lee esta tabla antes de nada.** Las secciones de este archivo están en este
mismo orden. Tres de los nueve pasos son **condicionales**: el Prompt 0 te dice
cuáles te tocan, y si no te toca uno, lo saltas y sigues.

| # | Paso | ¿A quién le toca? |
|---|---|---|
| 1 | **Prompt 0** — verificar el terreno | a todos. **Empieza aquí** |
| 2 | Recuperar el costo y la duración de la sesión 1 | **solo si** tu sección FACTURA quedó sin esos datos |
| 3 | Recuperar las decisiones no pedidas de la sesión 1 | **solo si** no quedaron escritas en ningún archivo |
| 4 | **Prompt 1** — leer la spec | a todos |
| 5 | Línea base nueva | **solo si** el commit de tu tarea patrón no se puede revertir |
| 6 | **Fase 2.1** — escribir tu `CLAUDE.md` | a todos |
| 7 | **Fase 2.2** — revertir la tarea patrón | a todos |
| 8 | **Fase 2.3** — auditar el contrato y repetir la tarea | a todos |
| 9 | **Cierre** — bitácora y push | a todos |

**Los pasos 2 y 3 van antes del 4, y el 5 antes del 6.** El orden no es
decorativo: los dos primeros rescatan datos de la semana pasada, y el 5 tiene
que ocurrir **antes** de que exista tu `CLAUDE.md`, porque mide cómo trabaja el
agente **sin** reglas.

**Si no te toca ninguno de los tres condicionales**, tu ruta son cinco pasos:
Prompt 0, Prompt 1, y las fases 2.1, 2.2 y 2.3, más el cierre.

---

## Cómo usar estos prompts

1. **Cada fase empieza en una conversación nueva**, en orden. Dos de ellas
   tienen más de un paso, y cada una lo explica:
   * La **2.1** es un chat con un segundo paso dentro, el de la comparación
     con `/init`.
   * La **2.3** son **dos chats**: uno audita el contrato y el otro corre la
     tarea. El segundo tiene a su vez dos pasos dentro. El corte no es
     estético: la corrida es una medición y tiene que empezar limpia.

   **Quién mide qué** (es lo mismo que en la sesión 1, y sigue siendo la causa
   de la mitad de las dudas):

   | Dato | Lo consigue | Lo escribe en el archivo |
   |---|---|---|
   | Tokens y costo de la conversación | **tú**, con `python doc_sesions/sesion2/tokens.py` | el agente, cuando se lo dictas |
   | Duración | **tú**, con el reloj | el agente |
   | Turnos en que lo corregiste | **tú**, contándolos | el agente |
   | Hallazgos de la auditoría y cuántos aceptaste | **tú**, leyendo el informe y decidiendo | el agente |
   | Dónde quedó el estado del filtro | el agente, mirando su código; **tú lo confirmas en la barra de direcciones** | el agente |
   | Decisiones no pedidas de la corrida | el agente, si se las pides al cerrar | el agente |

2. **Los comandos que empiezan con `/` los escribes tú en el chat, no el
   agente.** `/doctor prompt-audit`, `/context all`, `/init` y `/memory` son
   comandos de Claude Code: se escriben en la misma caja donde escribes tus
   mensajes, y el agente no los puede ejecutar por ti. Cuando un paso diga
   "escribe tú", es literal: lo escribes, lees lo que salió, y después pegas el
   prompt que te dice qué hacer con eso.
3. **No recortes el bloque `[CONTEXTO]`**, pero **rellena sus marcadores**.
   Son tres y se consiguen así:

   | Marcador | Qué es | Cómo lo consigues |
   |---|---|---|
   | `<RUTA_PROYECTO>` | La carpeta donde vive tu app | `pwd` en la terminal, desde la carpeta del proyecto |
   | `<COMMIT_ANTERIOR>` | El commit con el que cerraste la sesión 1 | `git log --oneline -1` al empezar hoy |
   | `<TU_REPO>` | Tu repositorio en GitHub | `git remote -v`, o la URL en el navegador |

   Un marcador sin rellenar hace que el agente persiga un estado que no
   existe.
4. **Corre la verificación de la fase antes del prompt siguiente.** Una fase
   sin verificar es una fase sin terminar.
5. **Commit por fase**: `docs:` para la 2.1, `revert:` para la 2.2, y en la
   2.3 dos commits, `docs:` para la auditoría y `feat:` para la corrida. El
   cierre lleva su propio `docs:`.
6. **Cierre**: el último prompt deja la bitácora escrita, el `CLAUDE.md` al día
   y todo subido. La sesión 3 arranca leyendo eso.

### Estado del repositorio al iniciar la sesión

* El repositorio del alumno en `<RUTA_PROYECTO>`, **sin cambios pendientes** y
  en `<COMMIT_ANTERIOR>`.
* `docs/00-ANTES.md` con su **INVENTARIO DE DAÑOS** y la lista de decisiones
  que el agente tomó sin que nadie se las pidiera.
* `docs/MEDICIONES.md` con la fila **"S1 · sin reglas"** llena, y al pie el
  enunciado de la tarea patrón que se usó en esa corrida.
* El **commit aislado de la tarea patrón** de la sesión 1 en el historial.
* **Ningún `CLAUDE.md`** todavía, ni en la raíz ni en `.claude/`.
* **Claude Code 2.1.283 o superior**: la Fase 2.3 usa `/doctor prompt-audit`,
  que no existe antes de esa versión.

---

## Prompt 0 — Verificación del terreno

```text
[ROL] Actúa como ingeniero que revisa el instrumental antes de una medición:
tu única misión es confirmar que se puede medir, y detenerte en la primera
sorpresa. Hoy vamos a comparar contra un número de la semana pasada, así que
un terreno distinto arruina la comparación.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y debería estar en
<COMMIT_ANTERIOR>. Lee doc_sesions/sesion2/Ed5_sesion2.md, secciones "Antes de empezar"
y "Estado de partida". La sesión 1 dejó escritos docs/00-ANTES.md y
docs/MEDICIONES.md, y un commit aislado con la tarea patrón.

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones, con su comando: claude (mínimo 2.1.283), node, npm, git. Si
   claude está por debajo del mínimo, dímelo y sigue verificando: hay un
   camino alternativo para la Fase 2.3, pero quiero saberlo ahora y no a mitad
   del laboratorio.
2. Que el repositorio esté limpio y en qué commit estoy: git status --short y
   git log --oneline -1.
3. Que docs/00-ANTES.md exista y tenga la sección INVENTARIO DE DAÑOS.
   Dime cuántos defectos marca como aparecidos, cuántos como no aparecidos, y
   si hay defectos extra fuera de la lista de cuatro. No los resumas: solo el
   conteo y el título de cada fila.
4. Que docs/00-ANTES.md tenga la sección FACTURA, y **dime cuáles de sus
   datos están vacíos, en cero o como "sin medir"**: el costo de generar la
   app, la duración, los turnos de corrección y las veces que me pediste
   aprobación. Cítalos tal como están escritos, sin interpretarlos. Si falta
   el costo o la duración, dímelo claro: se pueden recuperar hoy y hay un
   prompt para eso.
5. Que docs/MEDICIONES.md exista, que la fila "S1 · sin reglas" esté llena, y
   que al pie esté escrito el enunciado de la tarea patrón que usé. Cítame ese
   enunciado entre comillas: es el que tengo que repetir hoy sin cambiar una
   palabra.
6. En qué estado está el historial, porque de eso depende la Fase 2.2.
   Córrelo con git log --oneline y git status --short, y dime cuál de estos
   cuatro casos es el mío. No elijas el que te gustaría: elige el que la
   salida de los comandos sostiene.
   - CASO A: hay un commit con la app tal como se generó, y otro aparte con
     la tarea patrón. Dime el mensaje de los dos y qué archivos tocó el de la
     tarea, con git show --stat.
   - CASO B: hay un commit con la app, pero la tarea patrón quedó sin
     commitear. Dime qué archivos están modificados o sin seguimiento.
   - CASO C: no hay ningún commit mío, o hay uno solo que trae la app y la
     tarea patrón mezcladas en los mismos archivos. Dime qué archivos están
     sin seguimiento y cuáles modificados.
   - CASO D: hay commits pero el de la tarea patrón trae mezcladas otras
     cosas además de la tarea. Dime qué más trae.
7. Que NO exista ya un CLAUDE.md, ni en la raíz ni en .claude/.
8. Qué archivos de memoria existen en el disco y podrían estar pesando hoy.
   Busca estos y dime cuáles encontraste, con su ruta: un CLAUDE.md global
   mío en la carpeta de usuario, un CLAUDE.local.md en el proyecto, un
   CLAUDE.md dentro de alguna subcarpeta del código, y la carpeta de memoria
   automática del proyecto. Si encuentras alguno, NO lo borres y no me
   muestres su contenido completo: dime cuál es y en una línea qué podría
   estar aportando a lo que generes hoy. La decisión de dejarlo o apagarlo es
   mía.

[RESTRICCIONES]
- No escribas ni modifiques ningún archivo. Ni uno.
- No crees el CLAUDE.md: eso es la Fase 2.1.
- No reviertas nada: eso es la Fase 2.2.
- No corrijas ningún defecto del inventario.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.

[RAZONAMIENTO] Ejecuta las comprobaciones una a una y, si alguna falla,
diagnostica antes de pasar a la siguiente. Si falta un artefacto de la sesión
1, dime cuál es el camino de repuesto que da la spec en vez de improvisar uno.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado;
(2) el conteo del inventario y el enunciado de la tarea patrón entre comillas;
(3) **mi caso de historial (A, B, C o D), con la salida de git que lo
sostiene**, y en una línea qué va a tener que hacer la Fase 2.2 en ese caso;
(4) los archivos de memoria que encontraste en el disco, con su ruta;
(5) veredicto en una línea: "terreno listo, adelante con la lectura" o el
bloqueo encontrado. Sin commit.
```

**Y ahora lo compruebas tú, que es la otra mitad.** El agente te dijo qué
archivos de memoria *existen*; lo que de verdad está *cargado* solo lo dice
Claude Code. Escribe esto en el chat:

```
/context all
```

Busca la lista **Memory files**. **Lo que no aparece ahí, el agente no lo está
viendo**, aunque el archivo exista. Y al revés: si aparece algo que tú no
pusiste, es memoria global tuya o memoria automática, y hoy va a influir en lo
que el agente genere. No hace falta apagarla, pero sí anotarla en tu bitácora,
porque explica resultados que de otro modo parecen suerte.

---

## Paso 2 (condicional) — Si te falta el costo de la sesión 1, en la FACTURA o en la tabla

El Prompt 0 te dijo qué datos faltan en la sección FACTURA de
`docs/00-ANTES.md`. **Si falta el costo, la duración, o los dos, se pueden
recuperar hoy**, y conviene hacerlo antes del laboratorio.

**Por qué se puede.** `tokens.py` no mide en vivo: lee las conversaciones que
Claude Code ya guardó en el disco de tu máquina. Así que mientras no hayas
borrado las conversaciones de la sesión 1, el costo sigue ahí.

**Si ya borraste esas conversaciones**, no hay nada que recuperar. Deja la
celda en "sin medir", anótalo en tu bitácora, y pasa al Prompt 1. No es grave:
lo que la sesión 2 compara es la tarea patrón, no la generación.

Puedes pegarlo en el mismo chat del Prompt 0 o en uno nuevo. No es una
medición, así que el chat no importa.

```text
[ROL] Actúa como quien reconstruye un dato perdido con la evidencia que quedó:
si un número no se puede recuperar, lo dices en vez de estimarlo.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. En la sesión 1 generé esta app
y la sección FACTURA de docs/00-ANTES.md quedó incompleta, porque el material
de esa sesión no me decía con qué medir el costo. En la carpeta del curso hay
una herramienta que lo calcula leyendo las conversaciones guardadas en el
disco: doc_sesions/sesion2/tokens.py.

[OBJETIVO] Recupera cuatro datos de la sesión 1, leyendo las conversaciones que
quedaron guardadas en el disco.

1. El costo. Corre la herramienta desde la raíz del proyecto:
   python doc_sesions/sesion2/tokens.py
   Imprime una tabla con una fila por conversación. **La de la generación es la
   de más turnos y más tokens de salida**: no es la primera ni la última de la
   tabla, es la más grande. Identifícala y dime cuál elegiste y por qué, antes
   de escribir nada. De esa fila saco los cuatro contadores de tokens y el
   equivalente en dólares.

2. La duración. Intenta estas tres vías, **en este orden**, y dime cuál usaste:
   - La hora del primer mensaje de esa conversación y la hora del último turno
     antes de que yo pegara el bloque de cierre de la fase. Si el registro de
     la conversación trae marcas de tiempo, esta es la vía buena.
   - Las fechas de modificación de los archivos de la app: la del más antiguo
     y la del más reciente de esa generación.
   - Si ninguna de las dos sirve, "sin medir".

3. **El costo de la tarea patrón, que es el dato que de verdad se compara.** En
   esa misma tabla hay otra fila: la conversación en la que corrí la tarea
   patrón, en la fase 1.4. Es una conversación **corta**, muy posterior a la de
   la generación. Identifícala, dime cuál elegiste y por qué, y dame sus
   **cuatro contadores de tokens y el equivalente en dólares**. Si en esa
   corrida el agente no hizo nada porque la tarea ya estaba hecha, dilo: el
   número va a ser mínimo y es correcto que lo sea.

4. **El dato de la caché.** La herramienta termina imprimiendo una línea que
   dice cuánto costaron los tokens que se leyeron de caché y cuánto habrían
   costado como entrada nueva. Cópiame esos dos números tal cual, y la
   proporción de mi consumo que entró por caché, con la cuenta hecha. Es el
   dato que la sesión 3 va a usar y no está escrito en ninguna parte.

5. Cuando yo apruebe los números, escribe en dos sitios distintos:
   - En la **sección FACTURA de docs/00-ANTES.md**: el costo y la duración de
     la generación, y los dos números de la caché con su proporción. Eso es lo
     que costó construir la app, y es un hecho que no se repite.
   - En la **columna de costo de la fila "S1 · sin reglas" de
     docs/MEDICIONES.md**: el costo de la **tarea patrón**, con sus cuatro
     contadores de tokens y los dólares. Esa columna es la que se compara con
     las sesiones 2 y 3, y hoy está vacía.
   En los dos casos deja escrito al lado con qué los recuperaste y en qué
   fecha, porque se recuperaron después de los hechos y eso tiene que quedar
   visible.

6. Después comprueba si docs/BITACORA.md ya tiene esos números de la sesión 1.
   Si los tiene y no coinciden con los que acabas de calcular, dímelo y no
   toques nada: lo decido yo. Si coinciden, déjalo así.

[RESTRICCIONES]
- No estimes ninguno de los números. Si no se pueden recuperar, escribe "sin
  medir" y di por qué.
- De docs/MEDICIONES.md toca **solo la celda de costo de la fila S1**. Las
  otras celdas de esa fila y las filas S2 y S3 no se tocan.
- No toques el código de la app.
- No sumes todas las conversaciones del proyecto: quiero la de la generación
  sola.
- No escribas en el archivo hasta que yo apruebe los dos números.

[FORMATO DE SALIDA] (1) la tabla que imprimió la herramienta; (2) qué fila
elegiste para la generación y qué fila para la tarea patrón, y por qué cada
una; (3) la duración, con la vía que usaste; (4) los dos números de la caché y
la proporción; (5) después de mi aprobación, la sección FACTURA actualizada y
la celda de costo de la fila S1 llena; (6) si la bitácora discrepa, en qué;
(7) commit propuesto: "docs: recover the Sesión 1 cost figures".
```

**Dónde queda el dato, para que no haya dudas:** en la **sección FACTURA de
`docs/00-ANTES.md`**, que es donde nació incompleta. La tabla de
`docs/MEDICIONES.md` **no se toca aquí**: su columna de costo es la de la tarea
patrón, que es otra conversación y se mide en su propia fase.

## Paso 3 (condicional) — Las decisiones no pedidas: vuelve al chat de la Fase 1.2

Esto va **después** de recuperar el costo y la duración, y es el otro dato que
la sesión 1 dejó en el aire. En la Fase 1.2 el agente enumeró en el chat todo
lo que decidió sin que nadie se lo pidiera, pero ningún prompt le mandó
escribirlo en un archivo. Al cerrar esa conversación, la lista se fue con ella.

**Ese número es una columna de tu tabla de mediciones**, y es el que de verdad
compara: lo que un contrato cambia no es tanto si el agente acierta, sino
cuántas cosas decide por su cuenta. Sin él, la sesión 2 pierde su mejor dato.

**Y acá no vale abrir un chat nuevo.** Hay que volver **al chat de la Fase
1.2**, el mismo donde se generó la app, porque es el único que tiene la lista
en su contexto. Un chat nuevo tendría que deducirla leyendo el código, y lo que
saldría es otra cosa: las decisiones que **se ven** en el código, no las que el
agente **dijo** que tomó.

**Cómo:** busca en tu historial la conversación de la generación —es la más
larga de la sesión 1—, ábrela y escribe ahí. Sigue el hilo con todo su
contexto, no hace falta nada más.

Y pega esto:

```text
[CONTEXTO] Esta es la conversación en la que generaste mi app, en la Fase 1.2
de la sesión 1. Hoy es la sesión 2 y vuelvo acá por una sola cosa. Al terminar
esa fase me enumeraste en el chat todo lo que habías decidido sin que yo te lo
pidiera, pero no quedó escrito en ningún archivo. Lo necesito ahora, porque es
una columna de mi tabla de mediciones.

[OBJETIVO] Agrega a docs/BITACORA.md, dentro de la entrada de la sesión 1, una
sección titulada "Decisiones que tomé sin que me las pidieran", con esto:
1. La lista completa, tal como me la dijiste en su momento. No la rehagas
   leyendo el código ahora: quiero la que escribiste entonces.
2. El total, contado.
3. Cuáles de ellas yo habría querido aprobar antes de que las hicieras, y por
   qué en una línea cada una. Márcalas de forma visible.
4. La fecha de hoy y una línea diciendo que esta lista se recuperó de la
   conversación original en la sesión 2, no en el momento.

[RESTRICCIONES]
- **Si esa lista ya no está en tu contexto** —porque la conversación se
  compactó— dímelo y detente. No la reconstruyas leyendo el código y no la
  inventes: prefiero no tener el dato a tener uno que no es el de entonces.
- No cambies nada más de la bitácora.
- No toques el código de la app, ni docs/00-ANTES.md, ni docs/MEDICIONES.md.
- No corrijas ninguna de esas decisiones ahora. Hoy solo se registran.

[FORMATO DE SALIDA] (1) la lista, con el total; (2) cuáles habría querido
aprobar; (3) la sección escrita en la bitácora; (4) commit propuesto: "docs:
recover the unrequested decisions from Fase 1.2".
```

**Si el chat de la 1.2 ya no existe, o se compactó.** Entonces el número
original no se recupera. Abre un chat nuevo y pídele que liste las decisiones
que **se ven en el código** contra lo que pedía el encargo, y anótalo en la
bitácora **marcado como reconstruido**. Sirve para tener algo, pero **no es
comparable** con el número que te dará la sesión 2, porque uno sale de lo que
el agente dijo y el otro de lo que se ve. Déjalo escrito así en la tabla.

---

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion2/Ed5_sesion2.md y también
doc_sesions/sesion2/TAREA_PATRON.md, porque la Fase 2.3 repite esa misma tarea.
Devuélveme lo que entendiste:
1. Las 3 fases en orden, con qué entrega cada una.
2. Qué NO se hace hoy, y en qué sesión se hace cada una de esas cosas.
3. La diferencia entre lo que un CLAUDE.md pide y lo que un hook impone, en
   dos líneas. Quiero saber si entendiste que lo de hoy no garantiza nada.
4. Por qué la Fase 2.2 existe, o sea qué pasaría con la medición si nos la
   salteáramos.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.
- No propongas todavía ninguna regla para mi CLAUDE.md: eso es la Fase 2.1 y
  tiene que nacer leyendo mi inventario, no esta conversación.
- No toques docs/00-ANTES.md ni docs/MEDICIONES.md.
- No corrijas ningún defecto del inventario, aunque al leer la spec te quede
  claro cuál es y cómo se arregla.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora: corregirlo aquí es gratis y durante una fase cuesta. Y si la spec te
pide algo que tu versión de Claude Code no puede hacer, dímelo también.

[FORMATO DE SALIDA] (1) las 3 fases, una línea cada una; (2) la lista de lo
que NO se hace hoy, con su sesión; (3) pedir contra imponer, en dos líneas;
(4) para qué sirve la 2.2; (5) tus dudas, si hay. Sin commit.
```

---

## Paso 5 (condicional) — Si el commit de tu tarea patrón no se puede revertir

**El criterio es uno solo: ¿se puede revertir el commit de tu tarea patrón?**
No importa si la tarea se hizo ni si tu fila S1 tiene datos. Importa si hay un
commit que la aísle, porque de eso depende poder repetirla sobre el mismo
código.

| ¿Se puede revertir? | Qué haces | Qué pasa con tu fila S1 |
|---|---|---|
| **Sí** (caso A o D) | Nada especial. Sigues al Prompt 1 y en la Fase 2.2 lo reviertes. **Y en la 2.3 repites el MISMO enunciado que revertiste**, no otro | **Se conserva.** Tus datos de la semana pasada siguen siendo la línea base |
| **No** (caso B o C) | **Línea base nueva, hoy**, con el prompt de abajo | **Se reemplaza.** Los datos viejos se tachan y la línea base pasa a ser la de hoy |

**La regla que no se negocia:** el enunciado que uses en tu línea base es el de
**todas** tus corridas, hoy y en la sesión 3. Si revertiste, repites el que
revertiste. Si corres una línea base nueva, el nuevo pasa a ser el tuyo. **No
se mezclan.**

No intentamos separar código para rescatar un commit mezclado. Es laborioso,
el resultado es una reconstrucción que hay que explicar al pie de la tabla, y
la línea base nueva sale exacta en 15 minutos.

### Línea base nueva — tres pasos, y el primero es antes de pedir nada

**La línea base se corre AHORA, antes de escribir el `CLAUDE.md`.** Si la
corres después, ya no es una corrida sin reglas y no mide nada.

**Paso 1 — dejar el punto de partida commiteado.** Antes de pedirle la tarea,
pega esto:

```text
[OBJETIVO] Antes de pedirte nada más, deja el punto de partida guardado:
1. Crea un .gitignore adecuado al proyecto y comprueba que node_modules y
   .env*.local queden fuera. Muéstramelo antes de commitear.
2. Commitea TODO lo que hay ahora, tal como está, con el mensaje
   "chore: snapshot the app before the Sesión 2 baseline run".
3. Confirma con git status --short que no queda nada pendiente.

[RESTRICCIONES]
- No arregles nada. La app se commitea con sus defectos: son el material de
  las sesiones siguientes.
- No toques docs/00-ANTES.md ni docs/MEDICIONES.md, solo commitéalos.
- No me pidas claves ni las imprimas. Si encuentras una en un archivo que se
  va a commitear, detente y avísame.
```

**Paso 2 — la corrida, en conversación nueva.** Abre un chat nuevo y **anota la
hora**.

> **Ojo con el archivo.** En tu proyecto hay dos `TAREA_PATRON.md`: el de
> `curso-ed5/`, de la sesión 1, que trae **un** enunciado, y el de
> `doc_sesions/sesion2/`, que trae **tres**. **El de la sesión 2 es el que
> vale** y reemplaza al anterior. El viejo se queda ahí solo como registro de
> lo que tenías la semana pasada.

**Antes de pegar nada, elige tu enunciado.** Hay tres, y usas **el primero de
la lista que tu app NO tenga ya hecho**. Abre tu catálogo en el navegador y
míralo antes de decidir:

| Mira tu catálogo | Usas | Por qué |
|---|---|---|
| **No** se puede filtrar por categoría | el **1** | es el enunciado original del curso |
| Ya filtra por categoría, pero **no** pagina | el **2** | el filtro ya está hecho, no mediría nada |
| Ya filtra y ya pagina, pero **no** se puede ordenar por precio | el **3** | los dos primeros ya están hechos |
| Ya hace las tres cosas | ninguno | avisa al docente: te dará una tarea en clase, y queda anotado en tu tabla |

**Enunciado 1 — filtro por categoría**

```text
Agrega al catálogo un filtro por categoría. Que se pueda elegir una categoría
y el listado muestre solo los productos de esa categoría, y que el filtro
siga aplicado si recargo la página.
```

**Enunciado 2 — paginación**

```text
Muestra solo 6 productos por página, con enlaces para pasar de página, y que
si recargo siga en la página en la que estaba.
```

**Enunciado 3 — orden por precio**

```text
Agrega al catálogo una forma de ordenar los productos por precio, de menor a
mayor y de mayor a menor, y que el orden siga aplicado si recargo la página.
```

Pega **solo el enunciado que te toca**, tal cual, sin una palabra más. **El que
uses hoy es el de todas tus corridas**, hoy en la fase 2.3 y en la sesión 3, así
que anótalo al pie de tu tabla entre comillas y completo.

Mientras trabaja, **cuenta los turnos** en que tengas que corregirlo.

Cuando termine, **verifica tú mismo, sin abrir ningún archivo.** Los cinco
pasos son los mismos para los tres enunciados, cambiando qué eliges:

1. La app arranca sin errores en la consola del navegador.
2. Eliges la categoría, pasas a la página 2, o eliges el orden por precio → el
   listado cambia como pediste.
3. **Recargas con F5** → el estado sigue puesto.
4. Copias la URL y la abres en otra pestaña → ves lo mismo.
5. Vuelves al estado inicial → el catálogo queda como al principio.

**El paso 3 es el que separa las corridas** y el 4 es el que distingue si lo
guardó en el navegador o lo puso en la URL. Mira la **barra de direcciones**:
si dice algo como `?cat=laptops`, `?page=2` u `?orden=precio-asc`, el estado
quedó en la URL.

**Paso 3 — en ese mismo chat.** Primero mide lo que consumió la conversación.
En **otra terminal**, desde la raíz del proyecto:

```bash
python doc_sesions/sesion2/tokens.py
```

La fila de esta conversación es **la última de la tabla**, la de más turnos y
más tokens de salida. De ahí salen los tokens y el equivalente en dólares. El
agente no puede saber lo que costó su propia conversación: si se lo preguntas
sin dárselo, se lo inventa.

Y entonces pega esto, reemplazando lo que está entre corchetes:

```text
[OBJETIVO] Dos cosas, en este orden.
1. Commitea SOLO esta tarea, aislada, con el mensaje "feat: pattern task, S1
   baseline run without rules". Nada más entra en ese commit.
2. Rellena la fila "S1 · sin reglas" de docs/MEDICIONES.md. Los datos que te
   doy yo:
   - resultado: [a la primera / tras corregir / no pasa / rompió algo]
   - turnos en que tuve que corregirte: [N]
   - costo: [PEGA AQUÍ la fila de esta conversación en tokens.py: los cuatro
     contadores de tokens y los dólares]
   - duración: [N] minutos
   Los que pones tú: dónde quedó el estado de la página y en qué archivo, y
   cuántas decisiones no pedidas tomaste en esta tarea.

Y escribe al pie de la tabla, entre comillas y completo, el enunciado que usé,
más esta nota: que mi línea base se midió en la sesión 2 porque la de la
sesión 1 no quedó commiteada, y que la validación de las tres corridas se hace
sobre esta tarea.

[RESTRICCIONES]
- El commit lleva solo los archivos de la tarea. docs/MEDICIONES.md va en un
  commit aparte si hace falta.
- No cambies el comportamiento de la tarea para que la tabla luzca mejor.
- Las filas S2 y S3 quedan vacías.
- No estimes ningún dato de los que te di.
```

**Ciérralo.** Tu historial ya está en caso A: tienes el snapshot de la app y la
tarea patrón aislada. Sigue con la Fase 2.1 normalmente, y en la Fase 2.2 lo
que vas a revertir es **ese** commit.

> **Lo que ganas y lo que pierdes.** Ganas una línea base medida de verdad, con
> el mismo enunciado que vas a repetir en las fases 2.3 y en la sesión 3, y sin
> nada que aclarar al pie. Pierdes la comparación contra la semana pasada,
> porque tu "antes" es de hoy. Y le sumas unos 15 minutos al laboratorio: si el
> reloj aprieta, esta corrida es lo que puede quedar para casa.

---

## Prompt Fase 2.1 — Tu `CLAUDE.md`, escrito desde tu inventario

> **Conversación nueva.** El contrato tiene que nacer leyendo el inventario, no
> la conversación en la que se construyó o se auditó la app. Si se escribe en
> un chat que ya tiene el código en contexto, el agente describe lo que ve en
> vez de escribir reglas contra lo que se midió.
>
> **Si no tienes inventario de daños**, porque cerraste la sesión 1 sin
> completarlo, no te quedes fuera del laboratorio: escribe las dos reglas
> mínimas —el acceso a datos vive en un solo sitio, y los valores ajustables
> viven en un solo archivo— y sigue con la Fase 2.2. Anótalo en tu bitácora,
> porque explica por qué tu tabla va a comparar menos cosas que la de tus
> compañeros.

```text
[ROL] Actúa como el ingeniero que escribe el contrato de un proyecto: breve,
concreto, y sin afirmar nada que no sea cierto hoy. No eres el que escribió
esta app, así que no defiendas sus decisiones.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 2.1 de
doc_sesions/sesion2/Ed5_sesion2.md y después docs/00-ANTES.md completo, sobre
todo el INVENTARIO DE DAÑOS y la lista de decisiones que el agente tomó sin
que nadie se las pidiera. Ese archivo es la materia prima de hoy: vamos a
escribir las reglas que habrían evitado lo que ahí está medido. En este
proyecto todavía no hay ningún CLAUDE.md.

[OBJETIVO] Propón un CLAUDE.md para la raíz del proyecto, de MENOS DE 40
líneas, con estas secciones y ninguna más:

- Qué es esto: una línea, sin repetir el README.
- Comandos: solo los que existen de verdad en package.json.
- Reglas de arquitectura: una regla por cada defecto del inventario que SÍ
  apareció, y cada una con el comando que la comprueba.
- Valores ajustables: dónde viven, en un solo sitio.
- Estado de la interfaz: dónde vive el estado de filtros, búsqueda y
  paginación.
- Seguridad: qué se exige, aunque hoy no se cumpla.

[RESTRICCIONES]
- Cada regla apunta a una fila de mi inventario. Si una línea no corresponde
  a ninguna fila, bórrala antes de mostrármela.
- Un defecto que mi inventario marca como "no apareció" NO lleva regla.
- Un defecto que apareció en forma parcial lleva la regla escrita contra la
  forma que apareció, citando el archivo y la línea que dice mi inventario,
  y no contra la forma general que describía el encargo.
- Si mi inventario trae defectos extra, fuera de los cuatro de la lista,
  también llevan regla.
- No escribas lo que deduces leyendo el proyecto: ni el árbol de carpetas, ni
  la lista de dependencias, ni un resumen de la arquitectura, ni las
  particularidades del framework. Eso ya lo lees solo, y ocupa contrato.
- Lo que todavía no es verdad no se escribe como si lo fuera. Si hoy no hay
  pruebas, el archivo lo dice así y no promete una suite que no existe.
- No corrijas ningún defecto en el código. Hoy los defectos solo entran al
  contrato.
- No ejecutes /init. Lo vamos a usar después y en otro paso.

[EJEMPLOS] La forma de una regla, no su contenido: el contenido sale de mi
inventario. Una regla se lee así, con la verificación pegada:

  - Los componentes no consultan la base de datos. El acceso a datos vive en
    un solo sitio y los componentes reciben datos ya listos.
    Verificación: <el grep de mi inventario> debe devolver vacío.

Y una afirmación que hoy es falsa se escribe así, no se omite:

  - Pruebas: todavía no hay, y no hay script de pruebas. No digas que las
    pruebas pasaron.

[RAZONAMIENTO] Antes de escribir el archivo muéstrame el borrador y, al lado,
una tabla con una fila por cada regla: la regla, la fila del inventario a la
que apunta, y el comando que la comprueba. Si alguna regla no puede llenar
las tres columnas, sácala del borrador y dime por qué la ibas a poner.
Después espera a que yo te diga qué entra y qué sale.

[FORMATO DE SALIDA] (1) el borrador; (2) la tabla de regla x fila del
inventario x comprobación; (3) cuando yo lo apruebe, el archivo escrito y su
número de líneas, y si pasa de 40, qué tres líneas sacarías; (4) commit
propuesto: "docs: write the project contract for Fase 2.1".
```

### Segundo paso, en el mismo chat — la comparación con `/init`

Va **después** de que el archivo está escrito y commiteado, nunca antes. Es el
momento de la sesión donde se ve de qué tamaño es la diferencia entre un
contrato y una descripción.

**Primero asegúrate de tener el commit hecho**, y esto no es prolijidad: `/init`
puede escribir en tu `CLAUDE.md`. Con el commit hecho, cualquier cosa que
escriba la ves con `git diff` y la deshaces con `git checkout -- CLAUDE.md`. Sin
el commit, pierdes tu archivo.

```bash
git status --short
```

Tiene que salir vacío. Si sale algo, commitéalo antes de seguir.

**Después escríbelo tú en el chat**, porque es un comando de Claude Code y el
agente no lo puede correr por ti:

```
/init
```

Lee lo que propone. **No aceptes nada todavía.** Y entonces pega esto:

```text
[OBJETIVO] Compara lo que /init acaba de proponer con mi CLAUDE.md y dime tres
cosas:
1. Qué dice /init que yo no escribí.
2. Qué escribí yo que /init no encontró.
3. Cuáles de sus líneas son descripción del proyecto en vez de reglas que se
   puedan comprobar con un comando.

[RESTRICCIONES]
- No modifiques mi CLAUDE.md en este turno, ni para agregar ni para quitar.
- No opines sobre cuál de los dos es mejor: cuéntame las diferencias y yo
  decido.
```

**Si `/init` alcanzó a escribir en tu archivo**, compruébalo y deshazlo:

```bash
git diff CLAUDE.md
```

```bash
git checkout -- CLAUDE.md
```

**Lo que se espera que salga:** `/init` va a traer el árbol de carpetas, la
capa de datos, las particularidades del framework y cómo se maneja el dinero.
Casi nada de eso apunta a un defecto medido, y es justo lo que la regla de la
fase manda borrar. Lo que `/init` encuentra solo es, casi siempre, lo que no
hacía falta escribir.

### Verificación de la fase, antes de pasar a la 2.2

1. `wc -l CLAUDE.md` → menos de 40.
2. Cada regla del archivo aparece en la tabla de trazabilidad con su fila del
   inventario y su comando. Si una regla no tiene fila, sobra.
3. Ningún defecto que el inventario marcó como "no apareció" tiene regla.
4. El archivo no afirma nada falso hoy. En particular, no dice que haya
   pruebas si no las hay.
5. `/context all` → el `CLAUDE.md` aparece en la lista **Memory files**. Lo que
   no aparece ahí, el agente no lo está viendo.
6. `git status` no muestra cambios en archivos de la app.

---

## Prompt Fase 2.2 — Volver al punto de partida

> **Conversación nueva.** Y el Prompt 0 ya te dijo cuál de los cuatro casos de
> historial es el tuyo. De eso depende qué prompt usas:
>
> | Tu caso | Qué usas |
> |---|---|
> | **A** · hay commit de la app y commit de la tarea | el prompt principal, directo |
> | **B** · hay commit de la app, la tarea sin commitear | el prompt principal: su paso 1 commitea la tarea antes de revertirla |
> | **C** · no hay commits, o todo está mezclado | corriste la línea base nueva antes de la Fase 2.1, así que tu caso ya es **A**: usas el prompt principal y reviertes el commit de esa corrida |
> | **D** · el commit de la tarea trae otras cosas mezcladas | el prompt principal, y lee la nota del final |
>
> Esta fase **no produce ningún archivo nuevo**. Son cinco minutos de limpieza
> del instrumento, y es lo que hace que la fila de hoy se pueda comparar con la
> de la semana pasada.

```text
[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 2.2 de
doc_sesions/sesion2/Ed5_sesion2.md. El Prompt 0 clasificó mi historial como
caso [A / B / D]. En la sesión 1 le pedí una tarea chica —la tarea patrón— y
hoy tengo que deshacerla para que la corrida de hoy parta del mismo código
que la de la semana pasada. El enunciado de esa tarea está al pie de
docs/MEDICIONES.md.

[OBJETIVO] Deja la app en el estado anterior a la tarea patrón, con git.
1. Si mi caso es B, antes de nada: commitea la tarea patrón sola, con el
   mensaje "feat: pattern task, S1 run without rules", para que quede aislada
   y yo pueda revertirla. Si hay cambios en docs/ sin commitear, van en un
   commit aparte, no en ese.
2. Encuentra el commit de la tarea patrón con git log --oneline y muéstrame
   qué archivos tocó con git show --stat.
3. Revierte ese commit con git revert, y que el mensaje del commit de revert
   diga que es para la Fase 2.2.
4. Confirma que git status quedó limpio y muéstrame git log --oneline -3.

[RESTRICCIONES]
- Usa git revert. No borres archivos a mano, no uses git reset --hard y no
  reescribas el historial: el commit de la tarea patrón tiene que seguir
  existiendo, porque la sesión 3 vuelve a revertirlo.
- No uses /rewind: eso es la sesión 6.
- No toques docs/. El inventario y la tabla de mediciones se quedan como
  están.
- No toques el CLAUDE.md que acabo de escribir en la fase anterior.
- No corrijas ningún defecto del inventario, ni "de paso" ni por prolijidad.
- No agregues ni quites nada más en estos commits.
- Si el revert da conflicto, detente y muéstrame el conflicto. No lo
  resuelvas por tu cuenta.

[RAZONAMIENTO] Antes de ejecutar, muéstrame qué commit vas a revertir y qué
archivos vuelven atrás, y espera a que te confirme. Un revert del commit
equivocado me deja sin medición y sin saberlo.

[FORMATO DE SALIDA] (1) el commit que vas a revertir, con su mensaje y sus
archivos; (2) después de mi confirmación, la salida de git revert; (3) la
salida de git status --short y de git log --oneline -3; (4) una línea
diciendo si la app quedó en el estado anterior a la tarea.
```

**Nota para el caso D.** Si el commit de la tarea trae otras cosas mezcladas,
se revierte igual, y en la bitácora se anota qué más volvió atrás con él. Si
git responde `error: commit … is a merge`, el comando es
`git revert -m 1 <commit>`, y eso también se anota.

### Verificación de la fase, antes de pasar a la 2.3

1. `git log --oneline -3` → el commit de revert está arriba, y el commit de la
   tarea patrón sigue existiendo debajo.
2. `git status --short` → sin salida.
3. `npm run dev` y el catálogo en el navegador → el filtro ya no está. Si sigue
   apareciendo, recarga sin caché antes de concluir que el revert falló: la
   pantalla miente, `git log` no.
4. El `CLAUDE.md` de la fase 2.1 sigue en su lugar y sin cambios.

## Prompt Fase 2.3 — La auditoría y la segunda corrida

> **Son DOS chats, y el corte importa.** El primero audita el contrato. El
> segundo corre la tarea, y ese segundo tiene dos pasos dentro.
>
> La corrida va en un chat limpio porque es una **medición**: si se corre en el
> mismo chat donde acabas de discutir tu `CLAUDE.md` línea por línea, el agente
> llega con todo eso en contexto y la fila deja de ser comparable con la de la
> semana pasada.

### Chat 1 — Auditar el contrato

**Paso 1 — el comando lo escribes tú.** Es un comando de Claude Code, no algo
que el agente pueda correr por ti. Escríbelo en el chat:

```
/doctor prompt-audit
```

Lee el informe completo. **El comando solo reporta: no cambia nada hasta que
se lo pidas.** Cuenta cuántos hallazgos tuvo, porque ese número va a tu
bitácora.

**Si sale `Unknown command`**, tu versión de Claude Code es anterior a la
2.1.283. No te quedes sin la fase: salta al paso 2 y usa el prompt que está
abajo marcado como "sin el comando". La auditoría se hace igual, a mano, y se
anota que fue manual.

**Paso 2 — qué hacer con el informe.** Pega esto:

```text
[ROL] Actúa como el revisor que no escribió este contrato: tu trabajo es
encontrar lo que ya no es cierto, no defender lo que está escrito.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 2.3 de
doc_sesions/sesion2/Ed5_sesion2.md. Escribí mi CLAUDE.md en la fase 2.1 y
revertí la tarea patrón en la 2.2, así que hoy el código de la app no se ha
tocado. Acabo de correr /doctor prompt-audit y tienes su informe arriba, en
este mismo chat.

[OBJETIVO] Ayúdame a decidir qué hago con ese informe.
1. Por cada hallazgo, dime a qué línea de mi CLAUDE.md apunta y qué propone
   cambiar, en una línea cada uno.
2. Y aunque el comando no lo haya marcado, comprueba si alguna de mis reglas
   afirma algo que hoy es falso en mi proyecto: ejecuta el comando de
   verificación que la propia regla trae escrito y dime qué devolvió. Esto es
   lo que el audit no hace y es la lección de la sesión.
3. Espera a que yo te diga, hallazgo por hallazgo, cuáles acepto.
4. Aplica solo los que acepté y muéstrame el archivo resultante con su número
   de líneas.

[RESTRICCIONES]
- No cambies ni una línea del CLAUDE.md antes de que yo lo apruebe, hallazgo
  por hallazgo.
- No agregues reglas nuevas: hoy solo se corrigen o se borran las que hay.
- No toques el código de la app, ni docs/, ni la tabla de mediciones.

[FORMATO DE SALIDA] (1) la lista de hallazgos con la línea a la que apunta
cada uno; (2) qué reglas afirman algo falso, con la salida del comando que lo
comprueba; (3) después de mi decisión, el archivo corregido y su número de
líneas; (4) commit propuesto: "docs: audit the project contract for Fase 2.3".
```

**Sin el comando** —si te salió `Unknown command`— usa este en su lugar:

```text
[ROL] Actúa como el revisor que no escribió este contrato: tu trabajo es
encontrar lo que ya no es cierto, no defender lo que está escrito.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 2.3 de
doc_sesions/sesion2/Ed5_sesion2.md y después mi CLAUDE.md completo. Mi versión
de Claude Code no tiene el comando de auditoría, así que la hacemos a mano.

[OBJETIVO] Audita mi CLAUDE.md buscando exactamente cuatro cosas, y dime en
qué línea está cada hallazgo:
1. Instrucciones escritas para modelos o versiones que ya no existen.
2. Referencias a archivos, carpetas o comandos que no existen en mi proyecto.
3. Reglas que se contradicen entre sí.
4. Reglas que afirman algo que hoy es falso. Para cada una, ejecuta el comando
   de verificación que la regla trae escrito y dime qué devolvió.

Después espera a que yo te diga, hallazgo por hallazgo, cuáles acepto, y
aplica solo esos.

[RESTRICCIONES]
- No cambies ni una línea antes de que yo lo apruebe.
- No agregues reglas nuevas.
- No toques el código de la app, ni docs/, ni la tabla de mediciones.

[FORMATO DE SALIDA] (1) los hallazgos con su línea, agrupados por los cuatro
tipos; (2) la salida de cada comando de verificación; (3) después de mi
decisión, el archivo corregido y su número de líneas; (4) commit propuesto:
"docs: audit the project contract by hand for Fase 2.3".
```

**Anota en tu bitácora cuántos hallazgos tuvo y cuántos aceptaste**, y si la
auditoría fue con el comando o a mano. Esos números son parte del entregable
de la sesión. **Ciérralo.**

### Chat 2 — La misma tarea, otra vez

**Paso 1 — tú pegas el enunciado y lo envías.**

1. Abre una **conversación nueva**. Esta vez no es una recomendación.
2. Copia el enunciado del **pie de tu `docs/MEDICIONES.md`**, entre comillas,
   el que usaste en tu corrida 1. **El tuyo, no el del compañero**: si en tu
   corrida 1 te tocó el enunciado de repuesto, hoy va el de repuesto.
3. Pégalo **tal cual, sin una palabra más**, y envía. Si hoy explicas mejor la
   tarea, la comparación mide tu prosa y no tu contrato.
4. **Anota la hora** y **cuenta los turnos** en que tengas que corregirlo.

**Cuando termine, verifica tú mismo, sin abrir ningún archivo:** arranca la app
· aplica el filtro o pasa de página, según tu enunciado · **recarga con F5** ·
copia la URL en otra pestaña · vuelve al estado inicial.

Y mira la **barra de direcciones**, porque de ahí sale el dato que confirmas tú
y no el agente.

**Paso 2 — en ESE MISMO chat.** Primero mide la conversación, igual que la
semana pasada. En **otra terminal**, desde la raíz del proyecto:

```bash
python doc_sesions/sesion2/tokens.py
```

Toma **la última fila de la tabla**: es esta conversación. Y entonces pega
esto, reemplazando lo que está entre corchetes por tus datos:

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. Acabas de hacer la tarea que te pedí.
Lee la Fase 2.3 de doc_sesions/sesion2/Ed5_sesion2.md y la sección 3 de
doc_sesions/sesion2/TAREA_PATRON.md.

[OBJETIVO] Tres cosas, en este orden.
1. Enumera lo que decidiste en esta tarea y que yo no te pedí, y marca las que
   yo habría querido aprobar antes de que las hicieras.
2. Rellena la fila "S2 · con CLAUDE.md" de docs/MEDICIONES.md. Cuatro datos te
   los doy yo, porque los medí yo:
   - resultado: [a la primera / tras corregir / no pasa / rompió algo]
   - turnos en que tuve que corregirte: [N]
   - costo: [PEGA AQUÍ la fila de esta conversación en tokens.py: los cuatro
     contadores de tokens y los dólares]
   - duración: [N] minutos
   Los otros dos los pones tú: dónde quedó el estado y en qué archivo.
3. Dime en dos líneas qué regla de mi CLAUDE.md usaste en esta tarea, y si
   alguna te estorbó o te resultó ambigua.

[RESTRICCIONES]
- No cambies el comportamiento de lo que acabas de hacer para que la fila
  luzca mejor.
- La fila S1 no se toca. La S3 queda vacía.
- No estimes ninguno de los datos que te di. Si alguno viene vacío, escribe
  "sin medir".
- Si la fila te sale igual que la S1, escríbela igual. No la maquilles: un
  empate también es un resultado.

[FORMATO DE SALIDA] (1) tus decisiones no pedidas, en lista; (2) la fila S2
escrita; (3) qué regla usaste y si alguna estorbó; (4) commit propuesto:
"feat: rerun the pattern task with the contract for Fase 2.3".
```

**Ciérralo.**

> **Si la fila S2 sale idéntica a la S1, eso también es el resultado**, y la
> explicación suele ser una de dos. O tu `CLAUDE.md` no dice nada sobre lo que
> esta tarea mide, y entonces el contrato no tenía por qué cambiar nada. O ya
> lo decía y el agente ya lo hacía bien sin que nadie se lo pidiera, que es lo
> que pasó en la corrida de preparación. En el segundo caso, la columna que
> compara es la de **decisiones no pedidas**, no la del estado del filtro.

---

## Prompt de cierre — Bitácora y `CLAUDE.md` al día

> **Conversación nueva.** Es el prompt que deja la sesión documentada y subida,
> y es lo que la sesión 3 lee para arrancar.

```text
[ROL] Actúa como quien escribe la bitácora de un proyecto para que otra
persona —o yo mismo en tres semanas— entienda qué pasó sin tener que leer el
código.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y la sesión 2 terminó. Existen
docs/00-ANTES.md, docs/MEDICIONES.md con dos filas llenas, y mi CLAUDE.md ya
auditado. El repositorio remoto es <TU_REPO>.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con los números que
medí y sin adjetivos. Si algo salió mal o si las dos filas empataron, se dice
que empataron.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 2, con estas cosas: qué
   reglas escribí y a qué fila del inventario apunta cada una; cuántos
   hallazgos tuvo la auditoría y cuántos acepté; qué caso de historial me tocó
   en la fase 2.2 y qué hubo que hacer; cómo quedó la fila S2 al lado de la
   S1; y qué queda pendiente para la sesión 3.
2. Compara las dos filas y escribe qué cambió y qué no. Si empataron, dilo así
   y escribe qué dice mi CLAUDE.md sobre lo que esta tarea mide. No inventes
   una mejora que los números no muestran.
3. Revisa mi CLAUDE.md una última vez y comprueba que no afirme nada que hoy
   sea falso: corre el comando de verificación de cada regla y dime qué
   devolvió. Si una regla quedó obsoleta por lo que pasó hoy, dímelo y espera;
   no la cambies por tu cuenta.
4. Comprueba que .env*.local siga excluido y que no haya ninguna clave en lo
   que se va a subir. Si encuentras alguna, detente y avísame: no subas nada.
5. Sube todo al remoto.

[RESTRICCIONES]
- No corrijas ningún defecto del inventario. Siguen siendo material de las
  sesiones 5, 6 y 7.
- No agregues reglas nuevas al CLAUDE.md: lo de hoy ya se auditó, y una regla
  sin auditar es justo lo que la sesión enseña a no dejar.
- No escribas ninguna cifra que no hayamos medido hoy. Lo que no se midió dice
  "sin medir".
- No toques docs/00-ANTES.md: es la fotografía de la sesión 1 y no se reescribe.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) la entrada de la bitácora; (2) la comparación de las
dos filas, en tres líneas; (3) el resultado de verificar cada regla del
CLAUDE.md; (4) confirmación de que no hay claves en lo que se sube; (5) la
salida del push; (6) commit propuesto: "docs: close Sesión 2 with the contract
and the second measurement".
```
