# Claude Code Ed. 5 — Prompts de la Sesión 4 (Skills y MCP)

Cada prompt está escrito para pegarse **tal cual**, después de rellenar sus
marcadores. Están en el orden en que se usan, y cada uno dice en qué chat va.

La sesión de hoy no mide nada: la tabla de `docs/MEDICIONES.md` se cerró en la
sesión 3 y no se toca. Lo que se construye hoy son tres cosas que te vas a
llevar al resto del curso.

---

## La ruta de hoy, y en qué chat va cada paso

| # | Paso | ¿Dónde? |
|---|---|---|
| 1 | **Prompt 0** — verificar el terreno | chat nuevo. Deja escrito `docs/VERIFICACION_S4.md`, y de ahí leen los demás |
| 2 | **Prompt 1** — leer la spec | chat nuevo |
| 3 | **Fase 4.1** — tu primera Skill | chat nuevo, con **tres pasos dentro** |
| 4 | **Fase 4.2** — conectar el servidor | dos comandos **en la terminal** y un chat nuevo |
| 5 | **Fase 4.3** — tu tabla de decisión | chat nuevo |
| 6 | **Cierre** — bitácora y push | chat nuevo |

**Por qué cada fase en su propio chat.** La 4.1 termina con dos comprobaciones
que miden si el agente carga tu Skill **solo**, sin que se la nombres. Si esa
comprobación ocurre en el chat donde acabas de escribir la Skill, el agente ya
la tiene delante y la comprobación no prueba nada.

---

## Cómo usar estos prompts

1. **Cada fase empieza en una conversación nueva**, en orden.
2. **Los comandos que empiezan con `/` los escribes tú en el chat, no el
   agente.** `/skills`, `/skill-doctor`, `/mcp` y `/reload-skills` son comandos
   de Claude Code: se escriben en la misma caja donde escribes tus mensajes, y
   el agente no los puede ejecutar por ti.
3. **No recortes el bloque `[CONTEXTO]`**, pero **rellena sus marcadores**:

   | Marcador | Qué es | Cómo lo consigues |
   |---|---|---|
   | `<RUTA_PROYECTO>` | La carpeta donde vive tu app | `pwd` desde la carpeta del proyecto |
   | `<COMMIT_ANTERIOR>` | El commit con el que cerraste la sesión 3 | `git log --oneline -1` al empezar hoy |
   | `<TU_REPO>` | Tu repositorio en GitHub | `git remote -v` |

4. **Corre la verificación de la fase antes del prompt siguiente.**
5. **Commit por fase**: `feat:` para la Skill, `chore:` para el servidor,
   `docs:` para la tabla y para el cierre.

### Quién hace qué

| Cosa | La hace |
|---|---|
| Escribir el `SKILL.md` | el agente, desde tu inventario |
| Comprobar que la Skill se activa y que no se activa | **tú**, con dos peticiones en un chat nuevo |
| Conectar el servidor MCP | **tú**, con un comando en la terminal |
| Preguntarle algo al servidor | el agente, cuando se lo pides |
| Escribir la tabla de decisión | el agente, con los casos que tú le dices |

### Estado del repositorio al iniciar la sesión

* El repositorio en `<RUTA_PROYECTO>`, **sin cambios pendientes** y en
  `<COMMIT_ANTERIOR>`.
* El `CLAUDE.md` de la sesión 2, auditado.
* `docs/00-ANTES.md` con su **INVENTARIO DE DAÑOS**.
* `docs/MEDICIONES.md` con sus tres filas y `docs/COSTOS.md` con tu regla.
* **Claude Code 2.1.283 o superior**, y `npx` funcionando.

---

## Prompt 0 — Verificación del terreno

> **Chat nuevo.** Comprueba, y deja lo comprobado escrito en
> `docs/VERIFICACION_S4.md`. Es el único archivo que toca hoy, y de ahí sacan
> los prompts siguientes las reglas de tu contrato y la ruta de tus
> conversaciones.

```text
[ROL] Actúa como ingeniero que revisa el terreno antes de montar algo encima.
Hoy vamos a sacar una regla de mi contrato y a conectar un sistema externo, así
que lo que importa es qué hay y qué no. Detente en la primera sorpresa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y debería estar en
<COMMIT_ANTERIOR>. Lee doc_sesions/sesion4/Ed5_sesion4.md, secciones "Antes de
empezar" y "Estado de partida". Las sesiones 1 a 3 dejaron docs/00-ANTES.md,
docs/MEDICIONES.md, docs/COSTOS.md y mi CLAUDE.md.

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones, con su comando: claude (mínimo 2.1.283), node, npm, npx, git,
   python. Si claude está por debajo del mínimo, dímelo y sigue verificando.
2. Que el repositorio esté limpio y en qué commit estoy: git status --short y
   git log --oneline -1.
3. Que exista mi CLAUDE.md, cuántas líneas tiene, y enumérame sus reglas: una
   línea por regla, con el número de línea donde empieza.
4. De esas reglas, dime cuáles valen SIEMPRE y cuáles solo hacen falta A
   VECES, y por qué lo dices. No decidas nada: es una propuesta, la elijo yo
   en la fase siguiente.
5. Que exista docs/00-ANTES.md con su INVENTARIO DE DAÑOS, y cítame los
   defectos que marcó como "apareció".
6. Que no exista todavía ninguna carpeta .claude/skills/ ni ningún .mcp.json.
   Si existen, dime qué hay dentro: puede ser de otro curso o de otra prueba.
7. Corre python doc_sesions/sesion4/tokens.py y cítame la línea que empieza
   por "Conversaciones en:". Esa ruta es la que voy a usar en la fase 4.2.
   No interpretes el resto de la salida: hoy no medimos nada.
8. Escribe docs/VERIFICACION_S4.md con lo que acabas de comprobar, para que
   los prompts de hoy lo lean de ahí y yo no tenga que copiar nada. Con la
   fecha arriba y estas secciones, en este orden:
   - Versiones, una línea cada una.
   - El commit en el que arranqué hoy, con su mensaje.
   - Las reglas de mi CLAUDE.md, numeradas, y tu propuesta de cuáles valen
     siempre y cuáles solo a veces.
   - Los defectos del inventario que aparecieron.
   - LA CARPETA DE MIS CONVERSACIONES, en su propia sección y con ese título,
     con la ruta completa y tal cual la imprimió la herramienta.
   - El veredicto final, en una línea.
   Nada más. Es un archivo para leer de un vistazo, no un informe.

[RESTRICCIONES]
- El ÚNICO archivo que escribes es docs/VERIFICACION_S4.md. Ningún otro.
- No modifiques mi CLAUDE.md, ni docs/00-ANTES.md, ni ninguna tabla.
- No crees todavía ninguna Skill ni conectes ningún servidor.
- No instales nada.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.

[RAZONAMIENTO] En el punto 4, el criterio es uno solo: ¿esta regla hace falta
en CADA conversación, o solo cuando la tarea es de cierto tipo? Si es lo
segundo, dime de qué tipo de tarea se trata, porque eso es lo que va a ir en
la descripción de mi Skill.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado; (2) mis
reglas numeradas, con tu propuesta de siempre / a veces; (3) los defectos que
aparecieron; (4) la ruta de mis conversaciones, citada; (5) si ya había
.claude/skills o .mcp.json, qué había; (6) veredicto en una línea;
(7) docs/VERIFICACION_S4.md escrito, y me dices cuántas líneas tiene. Sin
commit: ese archivo entra en el commit de la Fase 4.1.
```

---

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

> **Chat nuevo.** No escribe nada.

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion4/Ed5_sesion4.md. Devuélveme lo que
entendiste:
1. Las 3 fases en orden, con qué entrega cada una.
2. Qué NO se hace hoy, y en qué sesión se hace cada una de esas cosas.
3. En dos líneas: qué diferencia una Skill de una regla del CLAUDE.md, y cuál
   es el criterio para decidir dónde va una regla.
4. Por qué la descripción de una Skill decide si sirve o no.
5. Qué significa que el servidor MCP se conecte en solo lectura, y quién lo
   impone.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.
- No crees todavía ninguna Skill ni conectes ningún servidor.
- No toques mi CLAUDE.md ni ningún archivo de docs/.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora: corregirlo aquí es gratis y durante una fase cuesta. Y si la spec pide
algo que mi versión de Claude Code no puede hacer, dímelo también.

[FORMATO DE SALIDA] (1) las 3 fases, una línea cada una; (2) lo que NO se hace
hoy, con su sesión; (3) Skill contra CLAUDE.md, con el criterio; (4) para qué
sirve la descripción; (5) qué es el modo de solo lectura; (6) tus dudas, si
hay. Sin commit.
```

---

## Prompt Fase 4.1 — Tu primera Skill

> **Conversación nueva.** Tiene tres pasos: eliges, el agente escribe, y
> después compruebas en **otro** chat.

### Paso 1 — eliges qué regla se va

Abre `docs/VERIFICACION_S4.md` y mira la lista de reglas con la propuesta de
"siempre" o "a veces". **La decisión es tuya**, y el criterio es uno:

> ¿Esta regla hace falta en **cada** conversación, o solo cuando la tarea es de
> cierto tipo?

Si es lo segundo, esa es tu Skill. Anota de qué tipo de tarea se trata, porque
eso es exactamente lo que va a ir en la descripción.

**Si ninguna de tus reglas es "a veces"**, no te quedes fuera del laboratorio:
escribe una Skill que **audite tu contrato**, o sea que corra los comandos de
verificación de cada regla y te diga cuáles no se cumplen hoy. Solo hace falta
cuando vas a cerrar una tarea, nunca en medio, y sale del mismo inventario.

### Paso 2 — pegas esto

```text
[ROL] Actúa como quien escribe una herramienta para que la use otro: lo que
importa no es lo que hace por dentro, es que se dispare en el momento correcto
y no en los demás.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 4.1 de
doc_sesions/sesion4/Ed5_sesion4.md, después docs/VERIFICACION_S4.md —que tiene
mis reglas numeradas— y después mi CLAUDE.md completo. La regla que quiero
sacar del contrato y convertir en Skill es: [NÚMERO O NOMBRE DE LA REGLA].

[OBJETIVO] Escribe .claude/skills/<nombre>/SKILL.md, y nada más.
1. Antes de escribir, propónme dos o tres nombres de carpeta y dos o tres
   redacciones de la description, y espera a que yo elija. La description
   tiene que decir, en este orden: qué hace, CUÁNDO usarla con dos o tres
   peticiones reales entre comillas, y qué NO cubre.
2. Con lo que yo elija, escribe el archivo. El --- de apertura va en la
   PRIMERA línea. El cuerpo lleva los pasos concretos, y los comandos de
   verificación que la regla ya trae escritos en mi CLAUDE.md, copiados tal
   cual.
3. Si la regla se va entera del contrato, bórrala del CLAUDE.md y dime cuántas
   líneas quedó. Si se queda una parte, dime exactamente qué parte y por qué.
4. Dime qué quedaría mejor en un archivo de apoyo o en scripts/, si algo. No
   lo crees todavía: solo dímelo.

[RESTRICCIONES]
- No inventes reglas nuevas. Hoy se mueve una que ya existe.
- No escribas en el SKILL.md nada que no esté respaldado por el inventario de
  docs/00-ANTES.md o por una regla de mi CLAUDE.md.
- No afirmes nada que hoy sea falso en mi proyecto. Si la regla dice que algo
  se cumple y no se cumple, escríbelo como lo escribe mi contrato: la regla, y
  después que hoy no se cumple.
- No toques docs/, ni el código de la app.
- No corras /skills ni ningún comando con barra: esos los escribo yo.

[RAZONAMIENTO] Antes de proponerme las redacciones, dime con qué petición mía
se activaría cada una y con cuál no. Una descripción que no puedas usar para
contestar eso no sirve.

[FORMATO DE SALIDA] (1) los nombres y las redacciones para que yo elija, cada
una con la petición que la activaría y la que no; (2) después de mi elección,
el SKILL.md escrito y cuántas líneas tiene; (3) qué cambió en el CLAUDE.md;
(4) qué pondrías en archivos de apoyo; (5) commit propuesto: "feat: add the
<nombre> skill from the project contract".
```

### Paso 3 — las dos comprobaciones, en un chat nuevo

**Cierra el chat anterior.** Esto no se puede comprobar donde acabas de
escribir la Skill: el agente ya la tiene delante.

Abre un chat nuevo y escribe:

```
/skills
```

Tu Skill tiene que aparecer en la lista. Si no aparece, el problema es la
carpeta o el nombre del archivo, no la descripción.

Después, **las dos peticiones**. Escríbelas tal cual, sin nombrar la Skill:

| | Qué escribes | Qué tiene que pasar |
|---|---|---|
| **1** | Una petición que coincide con tu descripción | La Skill **se carga sola** |
| **2** | Una petición que no tiene nada que ver | La Skill **no se carga** |

**Las dos, no solo la primera.** Una descripción amplísima también se activa en
la primera, y falla en la segunda. Si la segunda se activa, vuelve a la
descripción y agrégale qué **no** cubre.

Y para saber lo que te cuesta:

```
/skill-doctor
```

Te dice cuánto ocupa cada Skill en contexto y cuáles no se invocan nunca.

> **Anota las dos peticiones que usaste y qué pasó con cada una.** Van a la
> bitácora en el cierre, y son el criterio de aceptación de la fase.

---

## Prompt Fase 4.2 — Conectar un servidor que ya existe

> **Primero dos comandos en la terminal, y después un chat nuevo.** Hoy no se
> construye ningún servidor: se conecta uno que ya existe.

### Paso 1 — qué vas a conectar, y por qué ese

El agente solo puede leer dentro de la carpeta de tu proyecto. Tus
conversaciones guardadas **no están ahí**: viven en otra carpeta de tu máquina,
la que `tokens.py` imprime cada vez que lo corres y la que quedó anotada en
`docs/VERIFICACION_S4.md`.

Eso es lo que hace MCP: **una puerta controlada a un sistema que el agente no
alcanza**. Y hoy la abres en una sola dirección, de lectura.

### Paso 2 — lo conectas tú, en la terminal

Copia la ruta de la sección "La carpeta de mis conversaciones" de
`docs/VERIFICACION_S4.md` y pégala al final de este comando, entre comillas:

```bash
claude mcp add --scope project conversaciones -- npx -y @modelcontextprotocol/server-filesystem --read-only "<CARPETA_DE_CONVERSACIONES>"
```

Tres cosas de ese comando, que son la lección de la fase:

| Parte | Qué hace |
|---|---|
| `--scope project` | Lo escribe en `.mcp.json`, en la raíz, y se commitea: el equipo lo tiene al clonar |
| `--read-only` | El servidor registra **solo** sus herramientas de lectura. Las de escribir no existen para el agente |
| La ruta, al final | Es la única carpeta que el servidor puede tocar. Apuntar más arriba sería darle acceso a lo que no es tuyo |

Comprueba que quedó:

```bash
claude mcp list
```

Y en el chat, escribe tú:

```
/mcp
```

Tiene que decir `Connected`. La primera vez tarda, porque `npx` está
descargando el servidor.

> Si dice `Failed to connect`, mira la ruta: es el fallo más común, y casi
> siempre es una barra invertida o un espacio sin comillas. `claude mcp get
> conversaciones` te dice qué quedó configurado.

### Paso 3 — la consulta, en un chat nuevo

```text
[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Acabo de conectar un servidor
MCP llamado "conversaciones", en solo lectura, apuntado a la carpeta donde
Claude Code guarda las conversaciones de este proyecto. Esa carpeta está fuera
de mi proyecto, así que sin el servidor no la alcanzas.

[OBJETIVO] Tres cosas, en este orden.
1. Sin usar el servidor, dime si puedes leer esa carpeta. Inténtalo y cuéntame
   qué pasó. Quiero ver la diferencia, no que me la expliques.
2. Ahora con el servidor: dime cuántas conversaciones tiene este proyecto,
   cuál es la más grande, y de qué fecha es cada una de las tres más
   recientes. Dime qué herramienta del servidor usaste para cada dato.
3. Intenta escribir un archivo en esa carpeta. Quiero ver qué te responde.

[RESTRICCIONES]
- No abras ninguna conversación entera: pesan megas y no cabe en tu contexto.
  Si necesitas mirar dentro de una, dímelo antes y te digo cuál.
- No copies esas conversaciones a mi proyecto, ni entera ni en pedazos.
- No instales nada ni cambies la configuración del servidor.
- No escribas ningún archivo en mi proyecto en este turno.

[RAZONAMIENTO] El punto 3 no es un error que haya que resolver: es la
comprobación de que el modo de solo lectura hace lo que dice. Si consigues
escribir, eso sí es un problema y hay que parar.

[FORMATO DE SALIDA] (1) qué pasó sin el servidor; (2) los datos, con la
herramienta que usaste para cada uno; (3) qué te respondió al intentar
escribir; (4) una línea: qué puedes hacer ahora que antes no podías;
(5) commit propuesto: "chore: connect the conversations MCP server, read-only".
```

### Lo que cuesta, y conviene verlo

Antes de cerrar este chat, escribe:

```
/context all
```

Las definiciones de las herramientas del servidor **ya están en tu contexto**,
desde que abriste la conversación, y se pagan en cada turno. Mira cuánto ocupan.

Y si quieres ver el tope en acción, pídele que abra una conversación entera:
se va a cortar. El límite por respuesta son **25.000 tokens** por defecto, y
esa salida entra al contexto como entrada.

Es la sesión 3 otra vez: cada herramienta que conectas tiene precio.

---

## Prompt Fase 4.3 — Tu tabla de decisión

> **Conversación nueva.** Es el producto de la sesión, y lo que las sesiones 5
> y 6 van a citar.

```text
[ROL] Actúa como quien escribe una tabla para decidir rápido, no para
documentar: si no se lee de un vistazo, no se usa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Hoy saqué una regla de mi
CLAUDE.md y la convertí en una Skill, y conecté un servidor MCP en solo
lectura. Lee mi CLAUDE.md, el SKILL.md que escribimos y el .mcp.json.

[OBJETIVO] Escribe docs/DECISIONES.md con una tabla de CINCO filas, y nada
más. Las columnas son: "si necesitas", "usas" y "mi caso".
1. Una regla que vale siempre → CLAUDE.md. En "mi caso", una regla concreta de
   mi contrato, citada.
2. Un procedimiento que vale a veces → Skill. En "mi caso", la que escribí hoy,
   con su nombre.
3. Datos o acciones de un sistema externo → MCP. En "mi caso", el servidor que
   conecté y para qué me sirvió.
4. Trabajo largo que no debe ensuciar mi contexto → subagente. En "mi caso",
   "sesión 5", y nada más.
5. Algo que se cumpla aunque el modelo no obedezca → hook. En "mi caso",
   "sesión 6", y nada más.
Debajo de la tabla, UNA línea con el criterio, escrita por mí: propónme dos o
tres redacciones y la elijo yo.

[RESTRICCIONES]
- Cinco filas. Ni una más, aunque se te ocurran otras.
- Las filas 4 y 5 no se completan hoy: se reserva el sitio.
- Nada de ejemplos genéricos en "mi caso": si no es de mi proyecto, no va.
- No toques mi CLAUDE.md, ni el SKILL.md, ni el .mcp.json.

[EJEMPLOS] El tono del criterio de abajo, que es lo único mío del archivo:
  "Lo que necesito en cada conversación va al contrato y lo pago siempre; lo
  que necesito de vez en cuando va a una Skill y lo pago cuando lo uso."

[FORMATO DE SALIDA] (1) la tabla; (2) las dos o tres redacciones del criterio
para que yo elija; (3) después de mi elección, el archivo escrito;
(4) commit propuesto: "docs: write the decision table for Fase 4.3".
```

### Verificación de la fase

1. `docs/DECISIONES.md` existe y tiene **cinco** filas.
2. Las tres primeras nombran algo tuyo: una regla, tu Skill, tu servidor.
3. Las dos últimas dicen en qué sesión se hacen.
4. Cabe en media pantalla sin desplazarse.

---

## Prompt de cierre — Bitácora y push

> **Conversación nueva.** Deja la sesión documentada y subida, y es lo que la
> sesión 5 lee para arrancar.

```text
[ROL] Actúa como quien escribe la bitácora de un proyecto para que otra
persona —o yo mismo en tres semanas— entienda qué pasó sin tener que leer el
código.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y la sesión 4 terminó. Existen
mi CLAUDE.md, .claude/skills/ con la Skill de hoy, .mcp.json con el servidor,
docs/DECISIONES.md con la tabla, y docs/VERIFICACION_S4.md. El repositorio
remoto es <TU_REPO>.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con lo que de verdad
pasó y sin adjetivos. Si algo no funcionó, se dice que no funcionó.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 4, con estas cosas: qué
   regla saqué del contrato y por qué; cómo quedó la descripción de mi Skill;
   las dos peticiones con las que la probé y qué pasó con cada una; qué
   servidor conecté y qué me respondió que antes no podía; qué dice mi tabla
   de decisión; y qué queda pendiente para la sesión 5.
2. Dime cuántas líneas tiene hoy mi CLAUDE.md y cuántas tenía al empezar, y si
   la regla que se movió quedó en los dos sitios. Si quedó en los dos,
   avísame: hay que borrarla de uno.
3. Comprueba que .env*.local siga excluido y que no haya ninguna clave en lo
   que se va a subir, incluido el .mcp.json. Si encuentras alguna, detente y
   avísame: no subas nada.
4. Sube todo al remoto.

[RESTRICCIONES]
- No corrijas ningún defecto del inventario: siguen siendo material de las
  sesiones 5, 6 y 7.
- No agregues reglas al CLAUDE.md ni a la Skill.
- No escribas ninguna cifra que no hayamos comprobado hoy.
- No toques docs/00-ANTES.md, docs/MEDICIONES.md ni docs/COSTOS.md.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) la entrada de la bitácora; (2) el antes y el después
de mi CLAUDE.md, en líneas; (3) confirmación de que no hay claves en lo que se
sube; (4) la salida del push; (5) commit propuesto: "docs: close Sesión 4 with
the decision table".
```
