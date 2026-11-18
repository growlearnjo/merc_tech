# Sesión 5 — Subagentes: el que escribe no es el que revisa

> El PPT ya está armado: [`Ed5_sesion5.pptx`](Ed5_sesion5.pptx), 37 láminas
> sobre la plantilla de la sesión 4 —mismos diseños, colores y tipografías— y
> con las notas del docente en el panel de notas de 26 de ellas. Este documento
> es el guion del que salió: para preparar la clase, no para proyectarlo.
>
> El material del laboratorio está escrito desde el 16 de noviembre:
> [`Ed5_sesion5.md`](Ed5_sesion5.md) y [`PROMPTS_sesion5.md`](PROMPTS_sesion5.md).
> No se ha ejecutado todavía. Las láminas 30 a 34 ya dicen lo mismo que la
> spec.

Los datos técnicos están verificados contra la documentación oficial el
16 de noviembre de 2026. Las fuentes y la fecha están al final, como pide
`CONVENCIONES.md` §5.

---

## Los tres temas que esta sesión posee

De la tabla de dueños del temario, y no hay ninguno más:

| Tema | Dónde cae |
|---|---|
| ⭐ Subagentes: contexto aislado y trabajo en segundo plano | bloques 01, 02 y 03 · fase 5.1 |
| Cuándo delegar y cuándo conviene el contexto compartido | bloque 04 · fase 5.1 |
| Por qué el que genera el código no debe revisarlo | bloque 05 · fases 5.2 y 5.3 |

---

## Verificado hoy (16 nov 2026) — lo que cambia tu preparación

| Hallazgo | Consecuencia para la clase |
|---|---|
| Un subagente corre en su propia ventana de contexto, con su propio prompt, sus herramientas y permisos independientes. Sus peticiones cuentan para el mismo límite de uso que la conversación principal. | Es la lámina 8. La idea que sostiene la sesión es que vuelve un resumen, no lo que leyó. |
| Arranca sin la conversación, sin los archivos ya leídos y sin las Skills ya invocadas. Recibe el encargo que Claude escribe al delegar, el prompt de su archivo, toda la jerarquía de `CLAUDE.md` y una foto de `git status`. Explore y Plan arrancan sin `CLAUDE.md` y sin `git status`. | El revisor arranca sin la historia del autor y con el contrato, que es lo que la sesión necesita. Para lo contrario existe `omitClaudeMd: true`; se nombra en las notas y se deja. |
| Dónde vive, de más a menos prioridad: la organización, la bandera `--agents`, `.claude/agents/` del proyecto, `~/.claude/agents/` y el plugin. Si dos se llaman igual, gana el de más prioridad. | El alumno escribe el del proyecto, porque se commitea y el curso termina en un repositorio compartido. |
| Solo `name` y `description` son obligatorios. Si el `---` de apertura no está en la primera línea, el archivo se trata como documentación y se ignora sin avisar. Si tiene `name` pero no `description`, se salta con una línea en el log de depuración. | Es peor que en las Skills: una Skill mal escrita carga sin campos, y un subagente mal escrito no aparece. Va en la tabla de fallos. |
| Si se omite `tools`, hereda todas las herramientas disponibles para subagentes. Si se omite `model`, usa el de la conversación que lo lanza. | El revisor necesita `tools` escrito, sin `Edit` ni `Write`. El campo `model` enlaza con la sesión 3. |
| `/agents` ya no abre un asistente. En las versiones actuales imprime un recordatorio de pedírselo a Claude o editar la carpeta. El asistente con pestañas existía hasta la v2.1.197. | El subagente se escribe a mano o se le pide a Claude. Un tutorial viejo con pantallas de `/agents` confunde. |
| Si la conversación principal está en `bypassPermissions`, `acceptEdits` o auto, el subagente corre en ese mismo modo y el `permissionMode` de su archivo se ignora. | Lo que frena al revisor es su lista de `tools`. El modo que se eligió en la sesión 1 llega hasta aquí. |
| En primer plano, la conversación espera y los permisos los pide al usuario. En segundo plano, los permisos aparecen en la conversación principal con el nombre del subagente, `Esc` deniega esa llamada sin detenerlo, y el resultado llega como aviso en un turno posterior. `Ctrl+B` en la terminal, o "Run in background" en VS Code, manda a segundo plano. `/tasks` muestra lo que corre. | Lámina 17. |
| El modo fork está activo por defecto desde la v2.1.302, y en la terminal interactiva desde la v2.1.232. Con él, los subagentes que lanza Claude arrancan en segundo plano y Claude no puede quedarse esperando en la terminal, VS Code o el escritorio. Para que espere hay que poner `CLAUDE_CODE_FORK_SUBAGENT` en `0`. | En esta máquina la terminal tenía la v2.1.206 el 16 de noviembre, anterior a ese cambio, y VS Code tenía la v2.1.322 el 13 (no se volvió a comprobar). La misma demo puede salir distinta en los dos. |
| En segundo plano el subagente recibe un juego de herramientas menor, y la diferencia no se avisa. | Si algo falla solo en segundo plano, se mira aquí primero. |
| Un fork hereda la conversación entera: el mismo prompt de sistema, las mismas herramientas, el mismo modelo y el historial. Comparte la caché, se lanza a mano con `/subtask` y no puede lanzar otro fork. | Para revisar no sirve, porque hereda los supuestos del autor. Es la lámina 18. |
| La documentación tiene su propia lista de cuándo usar la conversación principal y cuándo un subagente. | Es la lámina 20, casi literal. La quinta fila de la derecha es la regla del plan del curso. |
| El ejemplo oficial de revisor lleva `tools: Read, Grep, Glob, Bash` y `model: inherit`, sin `Edit` ni `Write`. | Con `Bash` podría escribir un archivo con un comando de consola. Se dice en voz alta, porque es el gancho de la sesión 6. |
| Un subagente puede lanzar otros hasta tres niveles por debajo, y por defecto corren 20 a la vez como máximo. También puede tener memoria propia (`memory: project`) y trabajar en un worktree aparte (`isolation: worktree`). | Se nombra si alguien pregunta. No va en láminas. |

---

## Un hallazgo de la preparación: `tokens.py` no ve a los subagentes

No sale de la documentación: salió al comprobarla contra los archivos de esta
máquina. El mecanismo, paso a paso:

1. Claude Code guarda cada conversación en
   `~/.claude/projects/<proyecto>/<sesión>.jsonl`.
2. Cada subagente de esa conversación va a otro archivo, dentro de una
   subcarpeta: `~/.claude/projects/<proyecto>/<sesión>/subagents/agent-<id>.jsonl`.
3. `tokens.py` solo lee los `.jsonl` que están en la carpeta del proyecto
   (`sesion4/tokens.py`, línea 439) y no entra en las subcarpetas.

La comprobación, del 16 de noviembre de 2026: en 12 conversaciones con
subagentes guardadas en esta máquina, los subagentes de cada conversación
sumaban entre 8 y 129 respuestas, y ninguna aparecía en el archivo principal. Cero
identificadores de mensaje en común y cero líneas marcadas como de subagente.

La consecuencia es que, con `tokens.py` tal como está, una conversación con
subagente sale más barata de lo que fue. Y la decisión cerrada 11 de
`ESTADO_DEL_CURSO.md` dice que la columna de costo se mide siempre con
`tokens.py`.

Para la sesión 5 esto ya no bloquea nada: la spec decide que hoy no se mide
costo (hallazgo 13), y la Fase 5.1 usa el hueco para enseñar dónde queda lo que
no vuelve a la conversación. Sigue abierto para cualquier sesión posterior que
quiera medir una conversación con subagentes: o se corrige `tokens.py` para que
sume la carpeta `subagents/` (en una copia, por la decisión 8), o esa medición
se anota "sin el subagente". No se tocó `tokens.py`: es material del alumno y
la decisión es tuya. Las láminas 21 y 31 lo dicen.

---

## La pregunta de la sesión

Sale de un número que el alumno ya tiene: la columna de decisiones no pedidas
de su tabla de mediciones. En el ensayo de producción la tarea patrón tomó 13
sin reglas, y 13 también con el contrato puesto (`merc_tech3`,
`docs/MEDICIONES.md`, filas S1 y S2).

> Si el agente que escribió tu app tomó decisiones que nadie le pidió, y para
> él son correctas porque las tomó él, ¿quién las revisa?

La respuesta es la sesión: otro agente, con contexto aparte, que no tiene esa
historia y revisa con una rúbrica que sale del inventario de daños.

Hazlo con el número del alumno, no con el del ensayo. Es la lámina 23.

---

## Mapa de la presentación

Es el orden real del `.pptx`.

| Láminas | Contenido | Bloque |
|---|---|---|
| 1–3 | Portada · Presentación · Reglas de clase | — |
| 4 | Sesión 5 · Subagentes: el que escribe no es el que revisa | — |
| 5 | Agenda (6 bloques) | — |
| 6 | Dónde quedamos: cuatro sesiones, y la fila 4 de la tabla | recap |
| 7 | Divisor | 01 |
| 8–10 | Qué es un subagente · Qué recibe, y qué no · Lo que va, y lo que vuelve (diagrama) | 01 |
| 11 | Divisor | 02 |
| 12–15 | Dónde vive · El archivo, por dentro · Skill o subagente (dos columnas) · Lo que puede hacer lo decide `tools` | 02 |
| 16 | Divisor | 03 |
| 17–18 | Primer plano o segundo plano · Tres formas de delegar (tabla) | 03 |
| 19 | Divisor | 04 |
| 20–21 | Delegas, o no (dos columnas) · Lo que cuesta delegar | 04 |
| 22 | Divisor | 05 |
| 23–27 | Por qué el que escribe no revisa · La rúbrica sale de tu inventario · La rúbrica, por dentro (dos columnas) · Revisa, corrige y repite (diagrama) · Si encuentra menos que tú | 05 |
| 28 | Divisor | 06 |
| 29 | Tu tabla de decisión, con la fila 4 | 06 |
| 30–34 | El lab · Fases 5.1, 5.2 y 5.3 · Lo que te llevas | lab |
| 35 | La próxima sesión | — |
| 36–37 | ¡Gracias! · Modo de evaluación | — |

Reloj de 2 h, clase normal: recap 10 · 01 → 10 · 02 → 15 · 03 → 10 ·
04 → 15 · 05 → 15 · lab 40 · cierre 5. Suma 120.

Reloj real de esta clase, si se mantiene que el laboratorio de cada sesión se
corre en la clase siguiente: teoría 5 → 55 · laboratorio de la sesión 4 → 55 ·
cierre 10. El laboratorio de la sesión 5 se corre en la clase 6.

> Sin verificar: cómo salió la clase 4, si corrió el laboratorio de la 3, y si
> la clase 5 lleva el de la 4. Si cambió, este reloj cambia.

Si el reloj aprieta se recorta el bloque 03 a la lámina 17. Nunca el bloque
05, porque es el que sostiene el laboratorio.

---

## El lab, en detalle

El detalle completo está en la spec. Esto es lo que necesitas para darlo.

De dónde sale el diseño. El programa promete para esta sesión un laboratorio
con un "Tech Lead" que corrija malas prácticas en el código generado. En la Ed.
4 ese Tech Lead se hizo como Skill (`mercadotech-tech-lead`), así que corría en
la misma conversación que había escrito el código. En la Ed. 5 es un subagente,
y la corrección la hace la conversación principal. Se cumple lo que promete el
programa, con el revisor separado del autor, que es el tema de la sesión.

### Fase 5.1 — El revisor sin tu historia

El alumno no vuelve a correr la tarea patrón. Toma el commit de su corrida de
la Fase 2.3 y le encarga a un subagente `general-purpose` que liste las
decisiones no pedidas de ese cambio, sin leer `docs/`. Después compara esa
lista con la que el agente autor declaró de sí mismo al cerrar la corrida. Mira
con `/context` qué entró a su conversación, y con el servidor `conversaciones`
de la sesión 4 ve el archivo del subagente en `subagents/`, sin abrirlo. Llena
la fila 4 de `docs/DECISIONES.md`.

Dos cosas que hay que cuidar en clase:

1. En el ensayo, el commit de la Fase 2.3 también traía `docs/MEDICIONES.md`
   con la lista del autor, porque esa fase llena la fila en la misma
   conversación. El encargo pide verlo con
   `git show <commit> -- . ':(exclude)docs'`. Se probó en `merc_tech3` el 16
   de noviembre: con la exclusión, el cambio muestra solo `src/`.
2. Que el revisor no vea `docs/` depende de que obedezca. Dilo así, porque es
   el puente a la 5.2: allí el freno lo pone la herramienta.

### Fase 5.2 — Tu Tech Lead

El alumno escribe `.claude/agents/tech-lead.md` con `tools: Read, Grep, Glob`,
sin `Edit`, `Write` ni `Bash`. La rúbrica tiene una pregunta por cada defecto
que apareció en su inventario, con el marco del Tech Lead del ejemplar para
los defectos 1 y 2: responsabilidad única y valores ajustables en un solo
sitio. Antes de escribirla, el agente muestra una tabla de trazabilidad, como
en la Fase 2.1. El informe usa el formato del `code-reviewer` del ejemplar. En
`skills` carga la Skill de la sesión 4 si sirve para revisar, y en `model`
aplica la regla de `docs/COSTOS.md`.

Se prueba en un chat nuevo, porque Claude Code no vigila una carpeta
`.claude/agents/` que no existía al abrir la sesión. Las dos comprobaciones son
como las de la sesión 4: que audite un módulo con archivo y línea, y que si se
le pide corregir, no pueda. El primer informe queda en `docs/REVISION.md` §2.

### Fase 5.3 — Corregir y volver a revisar

La conversación principal corrige hasta tres hallazgos de los defectos 1 y 2,
`npm run build` tiene que pasar, y el alumno comprueba en el navegador que la
página se ve igual. Después el Tech Lead audita otra vez el mismo módulo. En
`docs/REVISION.md` §3 queda el antes y el después, y una tabla con cada defecto
del inventario y si el Tech Lead lo encontró sin que nadie le dijera dónde. Esa
tabla es la verificación que pide el plan. El inventario de `docs/00-ANTES.md`
no se toca, porque es la foto del antes.

### Lo que el plan exige y todavía no se ejecutó

`PLAN_ED5_SESIONES.md` pide, para dar la sesión por escrita, que el revisor
encuentre sobre la app del ensayo al menos dos de los cuatro defectos del
inventario, sin que se le digan. No se ha corrido. Lo que hay en el ensayo para
probarlo, según `merc_tech3/docs/00-ANTES.md` §5:

* El defecto 1 apareció solo en parte: ningún `.tsx` ejecuta SQL, pero
  `src/app/actions.ts` mezcla SQL de usuarios con validación y flujo, y las
  páginas de servidor obtienen datos y los muestran en el mismo archivo.
* El defecto 2 apareció: no hay carpeta de constantes, el límite de 120
  caracteres está en el formulario y en la acción, y el 99 en la acción y en el
  contador del carrito.
* El problema 6 de ese inventario, el esquema distinto al del encargo, quedó
  anotado como "material para el revisor de la sesión 5".

---

## La cantera

Se cita, no se copia. El ejemplar no tiene ningún subagente: su carpeta
`.claude/` tiene `skills/` y no tiene `agents/`. Por eso el plan dice que la
cantera es de contenido, no de mecánica.

| Pieza | Para qué se enseña |
|---|---|
| [`mercadotech-tech-lead`](../../mercadotech/.claude/skills/mercadotech-tech-lead/SKILL.md) | Es el Tech Lead que el programa promete para esta sesión, hecho como Skill en la Ed. 4. De su scorecard se toman dos dimensiones, responsabilidad única y valores ajustables centralizados, porque coinciden con los defectos 1 y 2. Dice en su propio texto que reporta y no edita. |
| [`mercadotech-code-reviewer`](../../mercadotech/.claude/skills/mercadotech-code-reviewer/SKILL.md) | La rúbrica: hallazgos por severidad (crítico, importante, sugerencia), cada uno con archivo y línea, un checklist que se responde leyendo el archivo, "ninguno" cuando no hay, y una nota que parte de 10 y baja. Dice en su propio texto que reporta y no edita. En el ejemplar es una Skill; en la sesión 5 el mismo contenido va a un subagente. Es la lámina 25. |
| El ejemplo `code-reviewer` de la documentación oficial | La mecánica: un archivo con `tools: Read, Grep, Glob, Bash`, sin `Edit` ni `Write`, y `model: inherit`. Con el aviso de `Bash` de la lámina 15. |
| [`merc_tech3/docs/00-ANTES.md`](../../merc_tech3/docs/00-ANTES.md) §5 | El inventario real del ensayo, para probar la rúbrica antes de dar la clase. |

---

## Si algo falla (tabla de apoyo para el docente)

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| El Tech Lead no aparece al escribir `@`, en el mismo chat donde se escribió | la carpeta `.claude/agents/` es nueva, y Claude Code solo vigila las que existían al abrir la sesión | cerrar el chat y abrir uno nuevo. Por eso la Fase 5.2 se prueba en otro chat |
| El subagente no aparece y Claude no lo usa | el `---` no está en la primera línea, o falta `name` | el archivo se ignora sin avisar: revisar la primera línea, y `claude --debug` para ver el log |
| Tiene `name` pero igual no aparece | le falta `description` | se salta con una línea en el log de depuración; agregarla |
| Claude no delega solo | la `description` no dice cuándo usarlo | reescribirla con el cuándo, o invocarlo explícito: "usa el subagente `<nombre>`", `@"<nombre> (agent)"` o `@agent-<nombre>` |
| El revisor corrigió código | se omitió `tools` y heredó todas, o escribió con `Bash` | poner `tools` sin `Edit` ni `Write`. Cerrar el paso por `Bash` es la sesión 6 |
| Se puso `permissionMode` y no cambia nada | la conversación está en auto, `acceptEdits` o `bypassPermissions` | es así por diseño: manda el modo de la conversación. El freno es `tools` |
| Claude sigue trabajando y el resultado llega después | los subagentes arrancan en segundo plano por defecto en esa versión | es normal. `/tasks` para verlos; `CLAUDE_CODE_FORK_SUBAGENT=0` para que Claude espere |
| La demo funciona en VS Code y no en la terminal, o al revés | dos instalaciones con versiones distintas | `claude --version` en los dos sitios |
| `/agents` no abre el asistente que sale en un tutorial | versión posterior a la v2.1.197 | se escribe el archivo, o se le pide a Claude |
| El revisor no encuentra nada | la rúbrica es genérica | la rúbrica sale del inventario de daños, no de buenas prácticas en general |
| El revisor encuentra menos que el alumno | falta una pregunta, o está mal escrita | se corrige la rúbrica, no el informe, y se vuelve a pasar |
| El costo de la sesión sale bajísimo | `tokens.py` no suma la carpeta `subagents/` | anotarlo como "sin el subagente" hasta que se corrija |
| Un fork "revisó" y no encontró nada raro | heredó la conversación, y con ella los supuestos | usar un subagente con nombre, no `/subtask` |

---

## Restricciones de la sesión

* El Tech Lead reporta y no edita. La corrección la decide el alumno y la hace
  su conversación.
* El Tech Lead no lleva `Bash`. Se nombra que con `Bash` podría escribir,
  porque es el gancho de la sesión 6.
* No se mide costo, y `docs/MEDICIONES.md` no se toca.
* No se corre la tarea patrón: se revisa el commit que ya existe.
* No se corrigen los defectos 3 y 4: sesiones 6 y 7. Se anotan.
* No se tocan permisos ni hooks: sesión 6.
* No se conecta ningún servidor MCP nuevo: se usa el de la sesión 4.
* No se empaqueta nada: el plugin es la sesión 8.
* Memoria propia del subagente, worktree aparte y subagentes anidados se nombran
  si alguien pregunta, y no se usan.
* Ninguna clave pasa por el chat ni por el repositorio (`CONVENCIONES.md` §6).

## Entregables de la sesión

1. `.claude/agents/tech-lead.md`, con `tools: Read, Grep, Glob`.
2. `docs/REVISION.md` con sus tres secciones: el autor contra el revisor, la
   primera auditoría, y el después.
3. La fila 4 de `docs/DECISIONES.md` con su caso.
4. Los defectos 1 y 2 corregidos en el módulo auditado, o escrito por qué no.
5. La entrada de la sesión 5 en `docs/BITACORA.md`.
6. Un commit por fase.

## Lo que falta antes de dar el laboratorio

1. Ensayar el laboratorio en `merc_tech3`. Ese proyecto va por la Fase 3.2, así
   que antes tiene que terminar los laboratorios 3 y 4: la 5.1 usa el servidor
   `conversaciones` y la tabla de decisión, y la 5.2 usa la Skill y la regla de
   costos.
2. En ese ensayo, la verificación del plan: el Tech Lead encuentra al menos dos
   de los cuatro defectos sin que se le digan. Es la tabla de `docs/REVISION.md`
   §3.
3. Comprobar en la versión de clase que el campo `skills` carga la Skill dentro
   del subagente. La documentación lo describe, pero no dice desde qué versión.
4. Comprobar en la máquina de clase la versión de Claude Code, y si los
   subagentes arrancan en segundo plano.

---

## Fuentes y fecha de consulta

Verificado el 16 de noviembre de 2026 contra la documentación oficial:

* Qué recibe un subagente, dónde vive y con qué prioridad, todos los campos del
  frontmatter, el orden de elección del modelo, los archivos que se ignoran sin
  avisar, `/agents` y la v2.1.197, primer y segundo plano, `Ctrl+B`, `/tasks`,
  el modo fork y sus versiones (v2.1.232 y v2.1.302),
  `CLAUDE_CODE_FORK_SUBAGENT`, `/subtask`, la caché compartida del fork, qué
  modo de permisos gana, la lista de cuándo usar la conversación principal y
  cuándo un subagente, el límite de 15.000 tokens de descripciones, la
  profundidad de 3 niveles, el máximo de 20 a la vez, la carpeta de
  transcripciones y el ejemplo `code-reviewer` —
  [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)

Los datos que no salen de la documentación:

* La v2.1.206 de la terminal es `claude --version` en esta máquina, el 16 de
  noviembre de 2026. La v2.1.322 de VS Code viene de `ESTADO_DEL_CURSO.md` §10,
  del 13 de noviembre, y no se volvió a comprobar.
* Que `tokens.py` no cuenta a los subagentes se comprobó en esta máquina el 16
  de noviembre de 2026, sobre 12 conversaciones con subagentes.
* Las 13 decisiones no pedidas salen de `merc_tech3/docs/MEDICIONES.md`, filas
  S1 y S2.
* El estado de los defectos 1 y 2 en el ensayo sale de
  `merc_tech3/docs/00-ANTES.md` §5, del 11 de noviembre de 2026.

> Regla de la Ed. 5: estos nombres de campos, comandos y versiones se mueven.
> Antes de dar la clase, vuelve a mirar la fecha de arriba, comprueba
> `claude --version` en el entorno donde vas a trabajar y lanza un subagente de
> prueba para ver si arranca en primer o en segundo plano.
