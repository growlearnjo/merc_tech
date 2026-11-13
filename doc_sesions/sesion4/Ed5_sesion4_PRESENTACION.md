# Sesión 4 — Skills y MCP para tu forma de trabajar

> **El PPT ya está armado**: [`Ed5_sesion4.pptx`](Ed5_sesion4.pptx), 36 láminas
> sobre la plantilla de la sesión 3 —mismos layouts, colores y tipografías— y con
> las notas del docente en el panel de notas de 25 de ellas. Este documento es el
> guion del que salió: para preparar la clase, no para proyectarlo.
>
> **El material del laboratorio no está escrito.** Lo que aquí se dice de las
> tres fases viene de `PLAN_ED5_SESIONES.md` Fase S.4, no de una ejecución.

Los datos técnicos están verificados contra la documentación oficial el
**13 de noviembre de 2026**. Las fuentes y la fecha están al final, como pide
`CONVENCIONES.md` §5.

---

## Los tres temas que esta sesión posee

De la tabla de dueños del temario, y no hay ninguno más:

| Tema | Dónde cae |
|---|---|
| Skills: la carpeta, las instrucciones, los scripts, la carga bajo demanda | bloques 01, 02 y 03 · fase 4.1 |
| Conectar servidores MCP que ya existen | bloques 04 y 05 · fase 4.2 |
| ⭐ Tabla de decisión: Skill, MCP, subagente o hook | bloque 06 · fase 4.3 |

---

## Verificado hoy (13 nov 2026) — lo que cambia tu preparación

| Hallazgo | Consecuencia para la clase |
|---|---|
| **Una Skill y un comando con barra son la misma cosa.** `.claude/commands/<nombre>.md` sigue funcionando, pero es el formato legado y acepta el mismo frontmatter salvo `name` y `paths`. Una Skill se invoca con `/nombre` por defecto. | No se enseñan como dos temas. Se enseña uno: la carpeta `.claude/skills/<nombre>/SKILL.md`. |
| **Todos los campos del frontmatter son opcionales.** Solo `description` se recomienda. Si falta, Claude Code usa la primera línea no vacía del contenido. | Refuerza la lección de la sesión: la `description` es el disparador, y dejarla al azar es dejar al azar si la Skill se carga. |
| **`description` y `when_to_use` se truncan a 1.536 caracteres juntos** en el listado que el modelo ve. | El caso de uso va **primero**. Es una lámina. |
| **Editar una Skill se aplica en vivo.** Solo hace falta `/reload-skills` si creaste una carpeta de Skills de nivel superior a mitad de sesión. | Contrasta con el `CLAUDE.md`, que **no** se aplica hasta el siguiente `/clear`. Cierra el cabo que dejó la sesión 2. |
| **Los scripts de una Skill no se cargan: se ejecutan.** Se referencian con `${CLAUDE_SKILL_DIR}` para que funcionen desde cualquier carpeta. | Es la diferencia entre "instrucciones que ocupan contexto" y "código que no ocupa nada hasta que corre". |
| La documentación recomienda **menos de 500 líneas** en `SKILL.md`, y los archivos de apoyo se cargan solo cuando la Skill los nombra. | Es la carga bajo demanda del temario, con un número. |
| **`/skills` lista las cargadas. `/skill-doctor` dice cuánto cuesta cada una en contexto y cuáles nunca se invocan.** | Ese es el instrumento de verificación de la fase 4.1, y enlaza con la sesión 3. |
| **`disable-model-invocation: true` saca la `description` del contexto**: la Skill queda solo para `/nombre`. | Es una palanca de costo de contexto, medible con lo que aprendieron en la sesión 3. |
| **Una Skill puede correr en un subagente**, con `context: fork` y `agent`. | Se **nombra** y se deja: los subagentes son la sesión 5. Va en la tabla de decisión. |
| **MCP no tiene modo de solo lectura.** La documentación oficial no describe ninguno: para la base de datos recomienda un **usuario de solo lectura en la cadena de conexión**. | Corrige la regla del plan. "Modo lectura" se implementa en la base, no con una bandera del agente. Es una lámina obligatoria. |
| **Tres ámbitos al conectar un servidor**, y cada uno escribe en otro sitio: local → `~/.claude.json`; proyecto → `.mcp.json` en la raíz, que se commitea; usuario → `~/.claude.json`. | El alumno usa **proyecto**, porque el curso termina en un repositorio que se comparte. |
| **Los servidores de `.mcp.json` piden aprobación** la primera vez, y la elección se reinicia con `claude mcp reset-project-choices`. | Explica por qué al compañero no le arrancó el servidor al clonar. |
| **`MAX_MCP_OUTPUT_TOKENS` vale 25.000 por defecto.** La salida de una herramienta MCP entra al contexto y se paga. | Enlaza directo con la sesión 3: conectar un MCP mueve la factura. |
| Los nombres de herramienta son `mcp__<servidor>__<herramienta>`, y se usan en reglas de permisos, en `allowed-tools` y en los hooks. | Se nombra, porque es la sesión 6. |
| **Aviso de seguridad de la documentación:** un servidor que trae contenido externo te expone a inyección de prompt. | Se dice en clase y se deja: es la fase 7.3. |

---

## La tabla de decisión — el producto de la sesión

Es lo que el alumno se lleva, y lo que las sesiones 5 y 6 van a citar. **Tiene
que caber en media pantalla**, así que son cinco filas y ninguna más.

| Si necesitas | Usas | Por qué |
|---|---|---|
| Una regla que vale **siempre** | `CLAUDE.md` | Se lee en cada conversación, y por eso no puede crecer |
| Un procedimiento que vale **a veces** | **Skill** | Se carga cuando la tarea coincide con su descripción |
| Datos o acciones de un **sistema externo** | **MCP** | El agente no puede inventarlos ni deducirlos del código |
| Trabajo largo que **no debe ensuciar tu contexto** | **Subagente** · sesión 5 | Corre en contexto aparte y devuelve el resultado |
| Algo que se cumpla **aunque el modelo no obedezca** | **Hook** · sesión 6 | No depende de que el modelo quiera |

---

## El número con el que se abre la clase

Es suyo, y lo midieron la semana pasada.

El `CLAUDE.md` que escribieron en la sesión 2 ocupa contexto **en todas las
conversaciones**. En el ensayo de producción, un contrato de 39 líneas pesaba
**1,2k tokens** en cada conversación nueva, y se comprueba con `/context all`,
en la lista **Memory files**.

De ahí sale la pregunta de la sesión:

> Si cada regla que agregas al contrato la pagas en cada conversación del resto
> del curso, ¿dónde pones las reglas que solo hacen falta a veces?

Y de ahí sale la respuesta, que es el tema del día: en una Skill, cuya
`description` es lo único que ocupa contexto hasta que la tarea coincide.

**Hazlo con el número del alumno, no con el del ejemplar.** Que abra
`/context all` en clase y mire su propia línea.

---

## Mapa de la presentación

Es el orden real del `.pptx`.

| Láminas | Contenido | Bloque |
|---|---|---|
| 1–3 | Portada · Presentación · Reglas de clase | — |
| 4 | Sesión 4 · Skills y MCP para tu forma de trabajar | — |
| 5 | Agenda (6 bloques) | — |
| 6 | Dónde quedamos: tres sesiones, y lo que no cabe en el contrato | recap |
| 7 | Divisor | 01 |
| 8–10 | Qué es una Skill · Dónde vive · También es un comando con barra | 01 |
| 11 | Divisor | 02 |
| 12–15 | La `description` es el disparador · **Una que se activa y una que no** (dos columnas) · El caso de uso va primero · Cómo compruebas que funciona | 02 |
| 16 | Divisor | 03 |
| 17–19 | La carpeta por dentro · **Qué se carga y cuándo** (diagrama) · Skill o `CLAUDE.md`: el criterio, con tu número | 03 |
| 20 | Divisor | 04 |
| 21 | Qué es MCP, y qué no es | 04 |
| 22 | Divisor | 05 |
| 23–26 | **Los tres ámbitos** (tabla) · Conectar uno en tres comandos · **Solo lectura se hace en la base** · Lo que cuesta conectar un MCP | 05 |
| 27 | Divisor | 06 |
| 28 | **La tabla de decisión** (dos columnas) | 06 |
| 29–33 | El lab · Fases 4.1, 4.2 y 4.3 · Lo que te llevas | lab |
| 34 | La próxima sesión | — |
| 35–36 | ¡Gracias! · Modo de evaluación | — |

**Reloj de 2 h, clase normal:** recap 10 · 01 → 15 · 02 → 15 · 03 → 10 ·
04 → 10 · 05 → 20 · **lab 35** · cierre 5. Suma 120.

**Reloj real de esta clase.** Por la decisión del docente, el laboratorio de
cada sesión se corre en la clase siguiente. Así que esta clase lleva **la
teoría de la 4 más el laboratorio pendiente de la 3**, y el reloj queda:
teoría 4 → 55 · **lab de la sesión 3 → 55** · cierre 10. El laboratorio de la
sesión 4 se corre en la clase 5.

Si el reloj aprieta se recorta el bloque 03 a conectar un solo servidor,
**nunca la tabla de decisión**: es lo que las dos sesiones siguientes citan.

---

## El lab, en detalle

**Pendiente: el material no está escrito.** Esto es lo que el plan decidió para
las tres fases, y sirve para preparar la clase, no para darla.

### Fase 4.1 — Tu primera Skill

El alumno convierte en Skill una convención de su proyecto que no merece estar
en el `CLAUDE.md` porque solo hace falta a veces. Sale de su propio inventario
de daños, igual que las reglas del contrato.

Se verifica con **dos** comprobaciones, no una: que la Skill **se active sola**
ante una petición que coincide con su descripción, y que **no se active** ante
una que no. La segunda es la que enseña: una descripción vaga no se carga nunca,
y el alumno concluye que las Skills no funcionan.

### Fase 4.2 — Conectar un servidor MCP que ya existe

**Solo conectar, nunca construir.** Construir un servidor es *AI Agentic
Engineer*, y la spec lo dirá en sus restricciones.

Si usa el de la base de datos, va con un usuario de solo lectura en la cadena
de conexión, porque el agente no tiene ningún modo de lectura que se le pueda
poner. Y la clave no pasa por el chat: `CONVENCIONES.md` §6.

### Fase 4.3 — La tabla de decisión

El alumno escribe la tabla con sus propios casos: una regla suya que va al
contrato, un procedimiento suyo que va a una Skill, un sistema suyo que necesita
MCP. Las dos últimas filas se dejan nombradas para las sesiones 5 y 6.

---

## La cantera

Se cita, no se copia. Son Skills reales del ejemplar:

| Pieza | Para qué se enseña |
|---|---|
| [`mercadotech-architecture-enforcer`](../../mercadotech/.claude/skills/mercadotech-architecture-enforcer/SKILL.md) | El ejemplar de Skill de convenciones. Su `description` dice **cuándo** activarse con seis peticiones reales entre comillas, y además dice **cuándo no**, nombrando las otras dos Skills. Esa descripción es la lámina del bloque 02. |
| [`planificacion-por-fases`](../../mercadotech/.claude/skills/planificacion-por-fases/SKILL.md) | El caso extremo: una Skill que escribió las especificaciones de un proyecto entero. Sirve para mostrar el techo, no para copiarla. |
| [`.mcp.json` del ejemplar](../../mercadotech/.mcp.json) | Cuatro líneas. Es todo lo que hace falta para que un servidor de proyecto arranque, y se ve de un vistazo. |

Una cosa que conviene decir del `architecture-enforcer`: **reporta, no edita**.
Esa línea está dentro de la propia Skill, y es un ejemplo de regla que vale a
veces —antes de crear un archivo— y que habría engordado el `CLAUDE.md` sin
razón.

---

## Si algo falla (tabla de apoyo para el docente)

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| La Skill no aparece en `/skills` | la carpeta o el archivo están mal nombrados | tiene que ser `.claude/skills/<nombre>/SKILL.md`, y el `---` de apertura en la **primera** línea del archivo |
| La Skill aparece pero nunca se activa sola | la `description` no dice **cuándo** usarla | reescribirla con peticiones reales entre comillas, el caso de uso primero |
| La Skill se activa cuando no debe | la `description` es demasiado amplia | agregarle qué **no** cubre, como hace el `architecture-enforcer` |
| Se editó la Skill y no cambió nada | se creó una carpeta de Skills nueva a mitad de sesión | `/reload-skills`. Si solo se editó una Skill que ya existía, se aplica en vivo y el problema es otro |
| El YAML no se parsea | comillas o indentación | la Skill **carga igual, sin ningún campo puesto**, así que parece que la descripción no sirve cuando el problema es el formato |
| `/mcp` dice `Needs authentication` | servidor OAuth sin login | `/mcp` y seguir el navegador, o `claude mcp login <nombre>` |
| `/mcp` dice `Failed to connect` | comando, ruta o cabecera mal | `claude mcp get <nombre>`. Si el servidor rechaza una cabecera `Authorization` configurada, Claude Code reporta fallo de conexión y **no** prueba OAuth: hay que quitar la cabecera |
| Al compañero no le arranca el servidor del `.mcp.json` | no lo aprobó | los servidores de proyecto piden aprobación la primera vez; `claude mcp reset-project-choices` para volver a preguntar |
| La respuesta del MCP se corta | `MAX_MCP_OUTPUT_TOKENS`, 25.000 por defecto | es el límite, y es una lámina del bloque 03: esa salida entra al contexto y se paga |
| El alumno quiere construir su propio servidor | entusiasmo | hoy no. Es *AI Agentic Engineer*, y está en las restricciones |

---

## Restricciones de la sesión

* **MCP: solo conectar, nunca construir.** Construir un servidor es
  *AI Agentic Engineer*.
* **Si se usa el MCP de la base de datos, con un usuario de solo lectura.** El
  agente no tiene modo de lectura.
* **No se crean subagentes**: sesión 5. Se nombran, porque la tabla de decisión
  los necesita.
* **No se tocan permisos ni hooks**: sesión 6. Se nombran igual.
* **No se empaqueta nada**: el plugin es la sesión 8.
* **No se corrigen los defectos del inventario**: sesiones 5, 6 y 7.
* **Ninguna clave pasa por el chat ni por el repositorio** (`CONVENCIONES.md` §6).

## Entregables de la sesión

1. Una Skill del alumno en `.claude/skills/`, con las dos comprobaciones hechas:
   se activa cuando debe y no se activa cuando no debe.
2. Un servidor MCP conectado y respondiendo a una consulta real sobre su app.
3. La tabla de decisión escrita con sus propios casos.
4. Un commit por fase.

---

## Fuentes y fecha de consulta

Verificado el **13 de noviembre de 2026** contra la documentación oficial:

* Ubicaciones de las Skills, estructura del `SKILL.md`, todos los campos del
  frontmatter, cómo se activan, archivos de apoyo y scripts,
  `${CLAUDE_SKILL_DIR}`, el límite de 1.536 caracteres, `/skills`,
  `/reload-skills`, `/skill-doctor` y `context: fork` —
  [Agent Skills](https://code.claude.com/docs/en/skills)
* `claude mcp add` y sus transportes, los tres ámbitos y sus archivos, `/mcp`,
  `claude mcp list` / `get` / `remove` / `login` / `logout` /
  `reset-project-choices`, los nombres `mcp__<servidor>__<herramienta>`,
  `MAX_MCP_OUTPUT_TOKENS`, la recomendación de usuario de solo lectura para
  PostgreSQL y el aviso de inyección de prompt —
  [Model Context Protocol](https://code.claude.com/docs/en/mcp)

El número de 1,2k tokens del `CLAUDE.md` de 39 líneas sale del ensayo de
producción en `merc_tech3`, medido con `/context all` el 13 de noviembre de
2026. No es un dato de la documentación.

> **Regla de la Ed. 5:** estos nombres de campos y comandos se mueven entre
> versiones. Antes de dar la clase, vuelve a mirar la fecha de arriba y
> comprueba `/skills` y `/mcp` en tu máquina. Y comprueba la versión de Claude
> Code en el entorno donde vas a trabajar, no en el otro.
