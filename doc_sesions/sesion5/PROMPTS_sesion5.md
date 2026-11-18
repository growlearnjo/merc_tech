# Claude Code Ed. 5 — Prompts de la Sesión 5 (Subagentes)

Cada prompt está escrito para pegarse **tal cual**, después de rellenar sus
marcadores. Están en el orden en que se usan, y cada uno dice en qué chat va.

La sesión de hoy no mide costo: `tokens.py` no cuenta lo que gastan los
subagentes, y la tabla de `docs/MEDICIONES.md` quedó cerrada en la sesión 3. Lo
que se mide hoy es otra cosa: qué encuentra un revisor que no vio la
conversación del autor.

---

## La ruta de hoy, y en qué chat va cada paso

| # | Paso | ¿Dónde? |
|---|---|---|
| 1 | **Prompt 0** — verificar el terreno | chat nuevo. Deja escrito `docs/VERIFICACION_S5.md`, y de ahí leen los demás |
| 2 | **Prompt 1** — leer la spec | chat nuevo |
| 3 | **Fase 5.1** — el revisor sin tu historia | chat nuevo, con **cuatro pasos dentro** |
| 4 | **Fase 5.2** — tu Tech Lead | un chat para escribirlo y **otro chat nuevo** para probarlo |
| 5 | **Fase 5.3** — corregir y volver a revisar | chat nuevo |
| 6 | **Cierre** — bitácora y push | chat nuevo |

**Por qué el Tech Lead se prueba en otro chat.** Claude Code solo vigila la
carpeta `.claude/agents/` si ya existía cuando abriste la sesión. Hoy la creas
por primera vez, así que en el chat donde la escribiste el Tech Lead no existe
todavía. En un chat nuevo, sí.

---

## Cómo usar estos prompts

1. **Cada fase empieza en una conversación nueva**, en orden.
2. **Los comandos que empiezan con `/` y las menciones con `@` las escribes tú**,
   en la misma caja donde escribes tus mensajes. `/context` y `/tasks` son
   comandos de Claude Code, y el agente no los puede ejecutar por ti.
3. **No recortes el bloque `[CONTEXTO]`**, pero **rellena sus marcadores**:

   | Marcador | Qué es | Cómo lo consigues |
   |---|---|---|
   | `<RUTA_PROYECTO>` | La carpeta donde vive tu app | `pwd` desde la carpeta del proyecto |
   | `<COMMIT_ANTERIOR>` | El commit con el que cerraste la sesión 4 | `git log --oneline -1` al empezar hoy |
   | `<TU_REPO>` | Tu repositorio en GitHub | `git remote -v` |

4. **Corre la verificación de la fase antes del prompt siguiente.**
5. **Commit por fase**: `docs:` para la 5.1, `feat:` para el Tech Lead,
   `refactor:` para la corrección y `docs:` para el cierre.

### Quién hace qué

| Cosa | La hace |
|---|---|
| Revisar el commit de tu tarea patrón | un subagente `general-purpose`, que no vio tu conversación |
| Comparar lo que dijo el autor con lo que vio el revisor | tu conversación, **después** de que el revisor vuelve |
| Escribir el Tech Lead | el agente, desde tu inventario. La rúbrica y la `description` las eliges tú |
| Auditar tu app | el Tech Lead, que no puede editar |
| Corregir lo que encontró | tu conversación principal |
| Revisar la corrección | el Tech Lead otra vez, nunca quien corrigió |

### Estado del repositorio al iniciar la sesión

* El repositorio en `<RUTA_PROYECTO>`, **sin cambios pendientes** y en
  `<COMMIT_ANTERIOR>`.
* Tu `CLAUDE.md`, `docs/00-ANTES.md` con su **INVENTARIO DE DAÑOS**,
  `docs/MEDICIONES.md` con la fila S2 y el enunciado al pie, y `docs/COSTOS.md`
  con tu regla.
* De la sesión 4: tu Skill en `.claude/skills/`, el servidor `conversaciones` en
  `.mcp.json` y `docs/DECISIONES.md`.
* **Claude Code 2.1.283 o superior.**

---

## Prompt 0 — Verificación del terreno

> **Chat nuevo.** Comprueba, y deja lo comprobado escrito en
> `docs/VERIFICACION_S5.md`. Es el único archivo que toca hoy.

```text
[ROL] Actúa como ingeniero que revisa el terreno antes de montar algo encima.
Hoy un revisor va a mirar mi código sin conocer mi historia, así que también
importa lo que NO debe quedar a su alcance. Detente en la primera sorpresa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y debería estar en
<COMMIT_ANTERIOR>. Lee doc_sesions/sesion5/Ed5_sesion5.md, secciones "Antes de
empezar", "Estado de partida" y "Decisiones tomadas". Las sesiones 1 a 4
dejaron mi CLAUDE.md, docs/00-ANTES.md, docs/MEDICIONES.md, docs/COSTOS.md,
docs/DECISIONES.md, una Skill en .claude/skills/ y el .mcp.json.

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones, con su comando: claude (mínimo 2.1.283), node, npm, git. Si
   claude está por debajo del mínimo, dímelo y sigue verificando.
2. Que el repositorio esté limpio y en qué commit estoy: git status --short y
   git log --oneline -1.
3. Que exista mi CLAUDE.md, y cuántas líneas tiene.
4. Que exista docs/00-ANTES.md con su INVENTARIO DE DAÑOS, y cítame los
   defectos que marcó como "apareció", solo por su nombre.
5. Encuentra en el historial el commit de la tarea patrón de la Fase 2.3, la
   corrida con mi CLAUDE.md puesto: su identificador, su mensaje y los
   archivos que cambió. Si hay más de un candidato, muéstramelos y espera a
   que yo elija. Si no hay ninguno, detente: la Fase 5.1 lo necesita.
6. Cítame entre comillas, completo, el enunciado de la tarea patrón que está
   al pie de la tabla de docs/MEDICIONES.md.
7. Dime si la fila S2 de docs/MEDICIONES.md tiene llena la celda de decisiones
   no pedidas, y si la lista de esas decisiones está escrita en algún archivo
   de docs/. Solo sí o no, y en qué archivo. NO copies su contenido ni el
   número a ningún lado.
8. Mi Skill de la sesión 4: su nombre, de qué trata en una línea, y si tiene
   disable-model-invocation: true. Dime si te parece útil para alguien que
   revisa código, y por qué. Es una propuesta: la decido yo en la Fase 5.2.
9. Que exista .mcp.json con un servidor llamado "conversaciones" y con
   --read-only entre sus argumentos.
10. Que exista docs/DECISIONES.md, y que su fila 4 diga "sesión 5".
11. Cítame la última línea de docs/COSTOS.md, la de mi regla.
12. Que no exista todavía .claude/agents/. Si existe, dime qué hay dentro.
13. Pregúntame en qué modo de aprobación trabajo. No lo adivines.
14. Escribe docs/VERIFICACION_S5.md con lo que acabas de comprobar, con la
    fecha arriba y estas secciones, en este orden:
    - Versiones, una línea cada una.
    - El commit en el que arranqué hoy, con su mensaje.
    - EL COMMIT DE LA TAREA PATRÓN, en su propia sección y con ese título:
      identificador, mensaje y archivos.
    - EL ENUNCIADO, en su propia sección y con ese título, entre comillas y
      completo.
    - Los defectos del inventario que aparecieron, solo por su nombre.
    - Mi Skill de la sesión 4 y tu propuesta.
    - Mi regla de costos, citada.
    - Mi modo de aprobación.
    - El veredicto final, en una línea.
    Nada más. Es un archivo para leer de un vistazo.

[RESTRICCIONES]
- El ÚNICO archivo que escribes es docs/VERIFICACION_S5.md.
- En docs/VERIFICACION_S5.md no va ninguna decisión no pedida ni su número: el
  revisor de la Fase 5.1 no debe poder llegar a ellas.
- No modifiques mi CLAUDE.md, ni docs/00-ANTES.md, ni ninguna tabla.
- No crees ningún subagente todavía.
- No instales nada.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.

[RAZONAMIENTO] En el punto 5, el commit que busco cambió código de la app y
lo hizo para cumplir el enunciado del punto 6. Si además cambió docs/ o mi
CLAUDE.md, dímelo y anótalo en la sección del commit: en la Fase 5.1 el
revisor lo va a ver sin docs/, y tiene que quedar claro por qué.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado; (2) el
commit de la tarea patrón; (3) el enunciado; (4) si la lista del autor está
escrita y dónde, sin copiarla; (5) mi Skill y tu propuesta; (6) veredicto en
una línea; (7) docs/VERIFICACION_S5.md escrito, y me dices cuántas líneas
tiene. Sin commit: ese archivo entra en el commit de la Fase 5.1.
```

---

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

> **Chat nuevo.** No escribe nada.

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion5/Ed5_sesion5.md. Devuélveme lo que
entendiste:
1. Las 3 fases en orden, con qué entrega cada una.
2. Qué NO se hace hoy, y en qué sesión se hace cada una de esas cosas.
3. Por qué el revisor de la Fase 5.1 no puede ver la lista del autor, y por qué
   la conversación principal tampoco la lee hasta que el revisor vuelve.
4. Qué diferencia hay, para esta sesión, entre un fork, un subagente
   general-purpose y Explore.
5. Por qué el Tech Lead lleva tools: Read, Grep, Glob, y qué lo frena si mi
   conversación está en modo auto.
6. Por qué hoy no se mide costo.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.
- No crees ningún subagente ni lances ninguno.
- No toques mi CLAUDE.md ni ningún archivo de docs/.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora: corregirlo aquí es gratis y durante una fase cuesta. Y si la spec pide
algo que mi versión de Claude Code no puede hacer, dímelo también.

[FORMATO DE SALIDA] (1) las 3 fases, una línea cada una; (2) lo que NO se hace
hoy, con su sesión; (3) por qué el revisor no ve la lista; (4) fork,
general-purpose y Explore; (5) qué frena al Tech Lead; (6) por qué no se mide
costo; (7) tus dudas, si hay. Sin commit.
```

---

## Prompt Fase 5.1 — El revisor sin tu historia

> **Conversación nueva.** Tiene cuatro pasos, todos en el mismo chat: miras tu
> contexto, encargas la revisión, vuelves a mirar tu contexto, y comparas.

### Paso 1 — tu contexto antes de delegar

Escribe tú, en el chat nuevo:

```
/context
```

Anota el total de tokens que marca. Es tu punto de partida.

### Paso 2 — el encargo

```text
[ROL] Actúa como quien organiza una revisión independiente: tu trabajo es
encargarla bien, no hacerla.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee SOLO
docs/VERIFICACION_S5.md: ahí están el commit de mi tarea patrón de la sesión 2
y el enunciado que usé. No leas nada más de docs/ en este paso.

[OBJETIVO] Lanza un subagente general-purpose —no un fork, no Explore— con un
encargo que lleve estas tres cosas, y ninguna más:
1. el identificador del commit, y la orden de verlo SIN docs/, con este
   comando exacto: git show <identificador> -- . ':(exclude)docs'
   Ese commit puede traer docs/MEDICIONES.md, y ahí está lo que no debe ver;
2. el enunciado, entre comillas;
3. qué es una decisión no pedida: algo que el código de ese commit hace o
   decide y que el enunciado no pidió.
Y pídele al subagente: una lista numerada, cada decisión con el archivo y la
línea donde se ve; que marque con ⚠️ las que un responsable del producto
querría aprobar antes; que no lea nada de docs/; y que no modifique ningún
archivo.
Cuando el resultado vuelva, muéstramelo tal cual, sin comentarlo ni
compararlo con nada.

[RESTRICCIONES]
- No leas docs/MEDICIONES.md, docs/COSTOS.md ni docs/BITACORA.md en este paso.
- No le digas al subagente cuántas decisiones esperas, ni le des ejemplos de
  mi proyecto.
- Tú no revises el commit: lo revisa el subagente.
- No modifiques ningún archivo.

[FORMATO DE SALIDA] (1) el encargo exacto que le pasaste; (2) el resultado
del subagente, tal cual.
```

> Si Claude te dice que el subagente quedó trabajando en segundo plano, es
> normal: el resultado llega solo, como un aviso. `/tasks` te muestra que sigue
> corriendo.

### Paso 3 — tu contexto después

Cuando el resultado ya esté en pantalla, escribe otra vez:

```
/context
```

Anota el total. La diferencia con el paso 1 es lo que entró a tu conversación:
el encargo y el resumen. Lo que el subagente leyó para llegar ahí no está.

### Paso 4 — ahora sí, comparas

```text
[CONTEXTO] El subagente ya volvió. Ahora sí puedes leer docs/MEDICIONES.md: la
fila S2 y, si existe, la lista de decisiones no pedidas de esa corrida, que
escribió el mismo agente que hizo la tarea. docs/VERIFICACION_S5.md dice si esa
lista está escrita y dónde. Además tienes conectado el servidor MCP
"conversaciones", en solo lectura, apuntado a la carpeta donde Claude Code
guarda las conversaciones de este proyecto. Mi /context marcaba [ANTES] antes
de delegar y [DESPUÉS] cuando volvió el resultado.

[OBJETIVO] Cuatro cosas, en este orden.
1. Compara las dos listas: cuántas decisiones coinciden, cuántas solo declaró
   el autor y cuántas solo encontró el revisor. Lo mismo para las marcadas con
   ⚠️. Si la lista del autor no está escrita en ningún archivo, compara contra
   el número de la celda y dilo.
2. Con el servidor "conversaciones", busca la carpeta subagents/ más reciente
   y dime qué archivos tiene, con su tamaño. No abras ninguno.
3. Escribe docs/REVISION.md con una sola sección, "1. El autor contra el
   revisor": el commit y el enunciado; las dos listas lado a lado; el conteo
   del punto 1; mis dos cifras de /context; y el nombre y el tamaño del archivo
   del subagente.
4. En docs/DECISIONES.md, la fila 4 dice "sesión 5" en "mi caso". Propónme dos
   o tres redacciones con lo que pasó hoy, y espera a que elija.

[RESTRICCIONES]
- Compara lo que dijo cada uno, no decidas quién tiene razón. Si el revisor
  encontró menos que el autor, se escribe igual.
- No abras el archivo del subagente.
- No toques docs/MEDICIONES.md ni docs/00-ANTES.md.
- No modifiques el código de la app.

[FORMATO DE SALIDA] (1) el conteo; (2) el archivo del subagente, con nombre y
tamaño; (3) las redacciones de la fila 4; (4) después de mi elección, los dos
archivos escritos; (5) commit propuesto: "docs: compare the author and a fresh
reviewer for Fase 5.1".
```

### Lo que acabas de ver

El archivo del subagente está en una subcarpeta `subagents/`, dentro de la
carpeta de tus conversaciones. Eso explica dos cosas:

1. **Por qué tu contexto casi no creció.** Lo que el subagente leyó está en
   ese archivo, no en tu conversación. A ti solo te llegó el resumen.
2. **Por qué hoy no se mide costo.** `tokens.py` lee los archivos de la carpeta
   de tus conversaciones, pero no entra en las subcarpetas. Lo que gastó el
   subagente no le aparece.

### Verificación de la fase

1. `docs/REVISION.md` tiene la sección 1, con las dos listas y el conteo.
2. Está anotado el archivo `agent-<id>.jsonl`, con su tamaño.
3. `docs/DECISIONES.md` tiene la fila 4 con tu caso.
4. `git status --short` → solo `docs/REVISION.md`, `docs/DECISIONES.md` y
   `docs/VERIFICACION_S5.md`.

---

## Prompt Fase 5.2 — Tu Tech Lead

> **Dos chats.** En el primero el agente escribe el Tech Lead. En el segundo,
> nuevo, lo pruebas tú.

### Paso 1 — lo escribe el agente

```text
[ROL] Actúa como tech lead que escribe la rúbrica con la que otro va a revisar
código que él no escribió. Lo que importa es que cada pregunta se pueda
contestar leyendo un archivo, y que el revisor no pueda tocar nada.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 5.2 de
doc_sesions/sesion5/Ed5_sesion5.md, después docs/VERIFICACION_S5.md, el
INVENTARIO DE DAÑOS de docs/00-ANTES.md, la regla de docs/COSTOS.md, mi
CLAUDE.md y el SKILL.md de mi Skill de la sesión 4.

[OBJETIVO] Escribe .claude/agents/tech-lead.md, y nada más.
1. Antes de escribir, muéstrame la tabla de trazabilidad: una fila por
   pregunta de la rúbrica, con la pregunta, la fila del inventario de la que
   sale, y cómo se comprueba con Read, Grep o Glob. Una pregunta por cada
   defecto que apareció. Para los defectos 1 y 2, usa el marco de la spec:
   responsabilidad única, y valores ajustables en un solo sitio. Si una
   pregunta no llena las tres columnas, sácala.
2. Propónme dos o tres redacciones de la description, y espera a que elija.
   Tiene que decir, en este orden: qué hace, CUÁNDO usarlo con dos o tres
   peticiones reales entre comillas, y que NO corrige.
3. Dime qué pondrías en skills y en model, y por qué. skills: mi Skill de la
   sesión 4, solo si sirve para revisar código y no tiene
   disable-model-invocation: true. model: lo que diga mi regla para una tarea
   de revisión; si mi regla no habla de revisar, inherit.
4. Con lo que yo elija, escribe el archivo. El --- de apertura va en la
   PRIMERA línea. tools: Read, Grep, Glob. El cuerpo lleva la rúbrica, el
   formato del informe tal como lo describe la spec, y estas tres órdenes:
   reporta y no edita; no lee nada de docs/; si una severidad no tiene
   hallazgos, escribe "ninguno".

[RESTRICCIONES]
- Ninguna ruta de archivo ni número de línea del inventario en el archivo: la
  rúbrica dice qué mirar, nunca dónde está.
- tools no lleva Edit, Write ni Bash.
- No pongas permissionMode.
- No toques mi CLAUDE.md, mi Skill, docs/ ni el código de la app.
- No lances el subagente en este chat: se prueba en otro.

[RAZONAMIENTO] Antes de la tabla, dime para cada defecto que apareció qué
tendría que ver alguien que no sabe dónde está para encontrarlo. Eso es la
pregunta de la rúbrica.

[FORMATO DE SALIDA] (1) la tabla de trazabilidad; (2) las redacciones de la
description; (3) skills y model, con su razón; (4) después de mi elección, el
archivo escrito y cuántas líneas tiene; (5) commit propuesto: "feat: add the
tech-lead subagent for Fase 5.2".
```

Haz el commit y **cierra este chat**.

### Paso 2 — lo pruebas tú, en un chat nuevo

Escribe `@` en la caja del chat. En el menú tiene que aparecer
`tech-lead (agent)`. Si no aparece, mira la tabla "Si algo falla" de la spec
antes de seguir.

Elige un **módulo** de tu app: una página o una carpeta donde tu inventario
marcó el defecto 1 o el 2. Tú sabes dónde está; el Tech Lead no tiene que
saberlo.

```text
[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Tengo un subagente tech-lead
en .claude/agents/, que revisa y no corrige.

[OBJETIVO] Tres cosas, en este orden.
1. Pásale a @"tech-lead (agent)" este encargo, y nada más: "Audita
   [MÓDULO]. Usa tu rúbrica." No le digas qué defectos espero ni dónde.
2. Cuando vuelva, copia su informe tal cual a docs/REVISION.md, en una
   sección nueva "2. Primera auditoría", con la fecha y el módulo. Sin
   resumirlo ni corregirlo.
3. Después pásale este otro encargo: "Corrige el primer hallazgo de tu
   informe." Muéstrame qué responde, y corre git status --short.

[RESTRICCIONES]
- Tú no corriges nada de lo que encuentre.
- No leas docs/00-ANTES.md en este chat.
- No toques la sección 1 de docs/REVISION.md.
- No toques el código de la app.

[FORMATO DE SALIDA] (1) el encargo exacto; (2) el informe, tal cual; (3) qué
respondió al pedido de corregir; (4) la salida de git status; (5) commit
propuesto: "docs: first tech-lead audit for Fase 5.2".
```

**Lo que tiene que pasar en el punto 3** es que no pueda: no tiene `Edit`,
`Write` ni `Bash`. Si `git status` muestra algún archivo de la app cambiado, el
`tools` del archivo está mal escrito: `git restore` y vuelve al paso 1.

### Verificación de la fase

1. `tech-lead (agent)` aparece en el menú de `@`.
2. `docs/REVISION.md` §2 tiene el informe con severidades, archivo y línea, y la
   nota.
3. El pedido de corregir no cambió ningún archivo de la app.
4. `head -1 .claude/agents/tech-lead.md` → `---`.

---

## Prompt Fase 5.3 — Corregir y volver a revisar

> **Conversación nueva.** Esta conversación corrige y no se revisa a sí misma:
> la segunda auditoría la hace el Tech Lead.

```text
[ROL] Actúa como quien corrige lo que encontró otro: no discutes el informe,
no corriges de más, y no te revisas a ti mismo.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 5.3 de
doc_sesions/sesion5/Ed5_sesion5.md, la sección 2 de docs/REVISION.md —el
informe del Tech Lead sobre [MÓDULO]— y mi CLAUDE.md.

[OBJETIVO] En este orden.
1. De los hallazgos de la sección 2, muéstrame los que caen en los defectos 1
   y 2 —responsabilidades mezcladas, o valores ajustables sueltos o
   repetidos—, críticos primero. Yo elijo hasta tres.
2. Corrige los que elija. Por cada uno: el plan en una línea, el cambio, y por
   qué no cambia lo que la app hace. Si hace falta un sitio nuevo para las
   constantes, mira primero si mi CLAUDE.md dice dónde; si no lo dice,
   propónmelo y espera.
3. Corre npm run build y muéstrame el final de la salida. Si falla,
   diagnostica antes de seguir.
4. Espera a que yo te confirme que la página se ve igual en el navegador.
5. Pásale a @"tech-lead (agent)" el mismo encargo de la sección 2, con el
   mismo módulo, y nada más.
6. Agrega a docs/REVISION.md una sección "3. Después" con: el informe nuevo
   tal cual; una tabla hallazgo por hallazgo con antes y después; la nota de
   antes y la de después; y una tabla con cada defecto que apareció en mi
   INVENTARIO DE DAÑOS de docs/00-ANTES.md y si el Tech Lead lo encontró en
   alguna de las dos auditorías, sin que nadie le dijera dónde.

[RESTRICCIONES]
- Solo los hallazgos que yo elija, y solo de los defectos 1 y 2. Los demás se
  anotan y no se tocan.
- Los defectos 3 y 4 no se tocan: son de las sesiones 6 y 7.
- No modifiques la sección 2 de docs/REVISION.md.
- No toques docs/00-ANTES.md ni docs/MEDICIONES.md.
- No revises tú la corrección: la segunda auditoría la hace el Tech Lead.

[RAZONAMIENTO] Antes de corregir, dime qué archivos vas a tocar y qué otra
parte de la app los usa. Si una corrección obliga a tocar algo fuera del
módulo, dímelo y espera.

[FORMATO DE SALIDA] (1) los hallazgos para elegir; (2) por cada corrección, el
cambio; (3) la salida de npm run build; (4) el informe nuevo; (5) la sección 3
escrita; (6) commit propuesto: "refactor: fix the tech-lead findings for Fase
5.3".
```

### Verificación de la fase

1. `npm run build` → sin errores.
2. `npm run dev` → la página del módulo se ve y se comporta igual que antes.
3. El informe nuevo ya no trae los hallazgos corregidos.
4. `docs/REVISION.md` §3 tiene la tabla del inventario, defecto por defecto.

> **Si el Tech Lead no encontró un defecto que tú sí viste en la sesión 1**, no
> es que la herramienta falle: falta una pregunta en la rúbrica, o está mal
> escrita. Anótalo en la sección 3. Se corrige la rúbrica, no el informe.

---

## Prompt de cierre — Bitácora y push

> **Conversación nueva.** Deja la sesión documentada y subida, y es lo que la
> sesión 6 lee para arrancar.

```text
[ROL] Actúa como quien escribe la bitácora de un proyecto para que otra
persona —o yo mismo en tres semanas— entienda qué pasó sin tener que leer el
código.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y la sesión 5 terminó. Existen
.claude/agents/tech-lead.md, docs/REVISION.md con sus tres secciones,
docs/DECISIONES.md con la fila 4 llena, y docs/VERIFICACION_S5.md. El
repositorio remoto es <TU_REPO>.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con lo que de verdad
pasó y sin adjetivos. Si algo no funcionó, se dice que no funcionó.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 5, con estas cosas:
   cuántas decisiones no pedidas declaró el autor y cuántas encontró el
   revisor, y cuántas coincidieron; cómo quedó la description del Tech Lead,
   y qué pusiste en skills y en model y por qué; qué respondió cuando le
   pedí corregir; qué se corrigió y la nota de antes y de después; qué
   defectos del inventario encontró sin que nadie le dijera dónde; y qué
   queda para la sesión 6.
2. Revisa mi CLAUDE.md: si alguna regla sobre los defectos 1 o 2 decía que
   hoy no se cumplía y ahora sí se cumple, compruébalo con el comando que la
   regla trae y actualiza solo esa línea. No agregues reglas nuevas.
3. Comprueba que .env*.local siga excluido y que no haya ninguna clave en lo
   que se va a subir. Si encuentras alguna, detente y avísame: no subas nada.
4. Sube todo al remoto.

[RESTRICCIONES]
- No corrijas nada más del código.
- No toques .claude/agents/tech-lead.md, docs/00-ANTES.md ni
  docs/MEDICIONES.md.
- No escribas ninguna cifra que no esté en docs/REVISION.md.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) la entrada de la bitácora; (2) qué cambió en el
CLAUDE.md, si algo, con el comando que lo comprueba; (3) confirmación de que
no hay claves en lo que se sube; (4) la salida del push; (5) commit propuesto:
"docs: close Sesión 5 with the tech-lead review".
```
