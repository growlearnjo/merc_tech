# Sesión 2 — Memoria y contexto: `CLAUDE.md` como contrato

> **El PPT ya está armado**: [`Ed5_sesion2.pptx`](Ed5_sesion2.pptx), 38 láminas
> construidas sobre la plantilla de la sesión 1 (mismos layouts, mismos colores,
> mismas tipografías) y con las notas del docente en el panel de notas de cada
> lámina. Este documento es el guion largo del que salió: úsalo para preparar la
> clase, no para proyectarlo.

**Contenido para la presentación**, con la misma estructura que el PPT de la
sesión 1: portada → reglas → título de sesión → agenda → láminas de concepto
(con su lámina visual) → lab → cierre.

Cada lámina trae **lo que va en la diapositiva** (texto corto) y **lo que
dices** (la nota del docente). Los datos técnicos están verificados contra la
documentación oficial el **8 de noviembre de 2026** y contra una instalación
real; las fuentes y la fecha están al final, como pide `CONVENCIONES.md` §5.

> **Antes de armar el PPT, lee el bloque "Verificado hoy" (abajo).** Hay un
> requisito de versión que afecta a una de las cinco láminas de agenda.

---

## Verificado hoy (8 nov 2026) — lo que cambia tu preparación

| Hallazgo | Consecuencia para la clase |
|---|---|
| `/doctor prompt-audit` **existe** y es exactamente lo que dice el temario: busca instrucciones escritas para modelos anteriores, referencias a archivos o comandos que ya no existen, y archivos que se contradicen. Solo reporta: propone ediciones y **no cambia nada** hasta que se lo pidas. | Es el centro de la lámina 04 y de la fase 3 del lab. |
| **Requiere Claude Code v2.1.283 o superior.** La máquina donde preparé esto tiene **2.1.206**, así que el comando **no corre**. | **Actualizar Claude Code antes de la clase** y pedirle a los alumnos que lo hagan (`claude --version` en la lámina de requisitos). Si alguien no puede, la fase 3 del lab se hace a mano: el alumno le pide al agente que audite su propio `CLAUDE.md` contra la lista de criterios de la lámina 04. |
| El audit corre a través de la Skill incorporada `/claude-api`; no está disponible si esa Skill está desactivada (`skillOverrides`, `disableBundledSkills`). | Una línea en la tabla de "Si algo falla". |
| Existe un segundo comando parecido, `/claude-api prompt-audit`, que audita prompts de **aplicaciones** construidas sobre la API. **No es el mismo.** | No confundirlos en clase. |
| Además de `CLAUDE.md` hay **memoria automática**: notas que el agente se escribe a sí mismo en `~/.claude/projects/<proyecto>/memory/`. Está **activa por defecto**. | Entra en la lámina 02. Y explica por qué la sesión 1 exigía terreno limpio. |
| `/output-style` como comando requiere v2.1.269+; el estilo **Concise** requiere v2.1.237+; desde v2.1.251 el cambio de estilo aplica **desde el mensaje siguiente** (antes hacía falta `/clear`). | Nota al pie de la lámina 05. |

---

# LÁMINAS

## L1 · Portada

**En la diapositiva:** `Presentación` · `www.datapath.ai`
*(la misma de la sesión 1, sin cambios)*

## L2 · Reglas de clase

**En la diapositiva:** la misma de la sesión 1.

**Lo que dices (30 s):** agrega una regla nueva para hoy —
*"hoy sí vamos a tocar la app: la sesión 1 era mirar y anotar, la 2 es escribir
reglas y volver a medir."*

## L3 · Título de sesión

**En la diapositiva:**
> **Memoria y contexto: `CLAUDE.md` como contrato**
> Sesión 2

## L4 · Dónde quedamos (recap de la sesión 1)

**En la diapositiva** — cuatro cajas, una por defecto medido:

| # | Lo que quedó mal | Se cierra en |
|---|---|---|
| 1 | Los componentes consultan la base de datos directamente | **hoy** (regla) y S5 (el revisor lo encuentra) |
| 2 | Valores ajustables incrustados en el código | **hoy** (regla) y S6 |
| 3 | Cero pruebas | S6 |
| 4 | La seguridad quedó abierta | S6 y S7 |

Y una quinta caja, distinta de las otras: **la tarea patrón, corrida 1** —
el filtro por categoría se perdía al recargar.

**Lo que dices (2 min):** *"La sesión pasada contrataste a alguien muy rápido y
no le dijiste cómo trabajas. Hoy se lo dices por escrito. Y al final del día
vamos a repetir exactamente la misma tarea del viernes para ver si el papel
sirvió de algo."*

> **Pide que abran `docs/00-ANTES.md`.** Todo lo que se escribe hoy sale de ese
> archivo. Si un alumno llega sin inventario, no tiene de dónde sacar sus
> reglas: dale las dos reglas mínimas (defectos 1 y 2) y que siga.

## L5 · Agenda

**En la diapositiva** — mismo formato numerado de la sesión 1:

```
01  CLAUDE.md: qué va dentro, qué no, y por qué un archivo
    demasiado largo empeora el resultado
02  Jerarquía de memoria: global, proyecto y subcarpeta
03  Compactación de contexto y cuándo conviene empezar de cero
04  /doctor prompt-audit: ¿tus instrucciones están escritas
    para un modelo que ya no existe?
05  Output styles: cuándo usarlos y en qué se diferencian
    de CLAUDE.md
Lab El CLAUDE.md de tu app, y la misma tarea de la sesión 1
    repetida con él
```

**Reloj sugerido (2 h):** recap 10 · 01 → 25 · 02 → 15 · 03 → 15 ·
04 → 10 · 05 → 10 · **lab 30** · cierre 5.
Si el reloj aprieta, lo que se recorta es **03** (la teoría de compactación se
entiende leyendo `/context` en pantalla), nunca el lab.

---

# 01 · `CLAUDE.md`: qué va dentro y qué no

## L6 · La frase de la sesión

**En la diapositiva, sola y grande:**
> **Un contrato que miente es peor que ninguno.**

**Lo que dices (2 min):** el `CLAUDE.md` del proyecto ejemplar de este curso
—357 líneas escritas a lo largo de ocho sesiones— afirmaba *"este proyecto no
tiene pruebas"* cuando ya existía la suite completa. El agente lo leyó, lo
creyó, y dejó de correr unas pruebas que estaban ahí. Nadie había mentido: el
archivo simplemente **envejeció**. De ahí sale la fase 3 del lab de hoy.

## L7 · Qué es, en una línea

**En la diapositiva:**
* Un archivo de texto que el agente lee **al empezar cada conversación**.
* No es configuración: es **contexto**. El agente lo lee y trata de seguirlo;
  no hay garantía de cumplimiento.
* Lo que **tiene** que cumplirse pase lo que pase no va aquí: va en un **hook**
  (sesión 6).

**Lo que dices:** esta distinción es la que evita la frustración de la semana 3.
Un `CLAUDE.md` **pide**; un hook **impone**. Hoy pedimos bien.

## L8 · Qué SÍ va dentro

**En la diapositiva** — la regla de entrada, en cuatro gatillos:

Agrega algo al `CLAUDE.md` cuando:
1. El agente comete **la misma equivocación por segunda vez**.
2. Una revisión de código detecta algo que el agente debería haber sabido.
3. Te sorprendes escribiendo **la misma corrección** que escribiste ayer.
4. Una persona nueva en el equipo necesitaría ese mismo dato.

Y que cada regla sea **verificable**:

| Así no | Así sí |
|---|---|
| "Que quede limpio" | "Los componentes no importan el cliente de base de datos" |
| "Formatea bien el código" | "Indentación de 2 espacios" |
| "Prueba tus cambios" | "Corre `npm test` antes de commitear" |
| "Mantén el orden" | "Las rutas de API viven en `app/api/`" |

**Lo que dices:** si no puedes escribir el `grep` que comprueba tu regla, la
regla todavía no está escrita.

## L9 · Qué NO va dentro

**En la diapositiva** — cuatro destinos, no uno:

| Lo que NO va en `CLAUDE.md` | Dónde va |
|---|---|
| Lo que el agente **deduce leyendo el código**: árbol de carpetas, lista de dependencias, resumen de arquitectura | en ninguna parte — bórralo |
| Lo que ya está en el **historial de git** | en ninguna parte |
| Lo que **solo importaba un día** ("ojo, estoy a mitad de la migración") | en el chat, o en memoria automática |
| Un **procedimiento de varios pasos** (checklist de release, revisión de PR) | una **Skill** (sesión 4) |
| Reglas que solo aplican a **parte** del código | `.claude/rules/` con `paths:` (lámina 11) |

**Lo que dices:** el error típico no es escribir poco, es escribir el README
otra vez. El agente ya puede leer el README.

## L10 · Por qué un archivo largo empeora el resultado

**En la diapositiva** — tres hechos y un número:

* **Objetivo: menos de 200 líneas por archivo.** Más largo consume más contexto
  y **reduce la adherencia**: el agente sigue peor las reglas.
* **Se carga en cada conversación**, hagas lo que hagas. Mil líneas de reglas de
  despliegue también se pagan cuando estás renombrando una variable.
* Los `@imports` **organizan**, pero **no reducen** el costo de contexto: el
  archivo importado se carga junto con el que lo importa.
* Un archivo de más de **4 MiB** se salta completo: el agente no lee nada de él.
* Si pasas del largo recomendado, verás un aviso al arrancar y en `/status`.

**Demo en vivo (2 min):** corre `/context` en un proyecto con `CLAUDE.md` y
muestra en pantalla cuántos tokens se está comiendo **antes de escribir nada**.
Es el momento en que la clase entiende el costo.

> **Dato honesto para la clase:** no existe un número publicado de "cuánto
> empeora". Lo que está documentado es la dirección (más largo → peor
> adherencia) y el objetivo (< 200 líneas). No inventes un porcentaje.

---

# 02 · Jerarquía de memoria

## L11 · Lámina visual: las cuatro capas

**En la diapositiva** — diagrama de capas, de lo general a lo específico. Todas
**se suman**; ninguna reemplaza a la otra:

```
┌─ Política gestionada (la empresa) ────────────────────────┐
│  Windows: C:\Program Files\ClaudeCode\CLAUDE.md           │
│  macOS:  /Library/Application Support/ClaudeCode/CLAUDE.md│
│  Linux/WSL: /etc/claude-code/CLAUDE.md                    │
├─ Tú, en todos tus proyectos ──────────────────────────────┤
│  ~/.claude/CLAUDE.md                                      │
├─ El proyecto (va al repositorio, lo ve el equipo) ────────┤
│  ./CLAUDE.md   o   ./.claude/CLAUDE.md                    │
├─ Tú, solo en este proyecto (va al .gitignore) ────────────┤
│  ./CLAUDE.local.md                                        │
└───────────────────────────────────────────────────────────┘
        +  subcarpetas: ./app/CLAUDE.md, ./lib/CLAUDE.md
           → se cargan SOLO cuando el agente toca un archivo de ahí
```

**Lo que dices (4 min), tres ideas:**
1. **Se concatenan, no se sobreescriben.** El orden va de la raíz del disco
   hacia tu carpeta de trabajo, así que lo más cercano a donde arrancaste se lee
   **al final**.
2. **Dos reglas que se contradicen = el agente elige una, y no sabes cuál.** Esa
   es la razón real por la que hay que auditar (lámina 04).
3. **Las subcarpetas se cargan a demanda**, no al arrancar: cuestan contexto
   solo cuando el agente trabaja ahí. Es la forma barata de tener reglas
   específicas.

**Dónde comprobarlo:** `/context all` → lista **Memory files**. Lo que no
aparece ahí, el agente no lo está viendo. `/memory` los abre para editar.

## L12 · La capa que la sesión 1 te pidió apagar

**En la diapositiva:**
* El Prompt 0 de la sesión 1 verificaba que **no** tuvieras `~/.claude/CLAUDE.md`
  ni Skills personales.
* No era burocracia: **esa capa cambia lo que el agente genera.**
* Hoy la recuperas sabiendo exactamente qué aporta.

**Lo que dices:** si a alguien de la clase le salió la app "demasiado bien" la
semana pasada —con capas, constantes, incluso pruebas—, ya tenía memoria global.
Esa persona acaba de ver la demostración del curso sin querer.

## L13 · La otra memoria: la que el agente se escribe solo

**En la diapositiva** — tabla de dos columnas:

| | `CLAUDE.md` | Memoria automática |
|---|---|---|
| **Quién la escribe** | tú | el agente |
| **Qué contiene** | instrucciones y reglas | aprendizajes y patrones |
| **Alcance** | proyecto, usuario u organización | por repositorio |
| **Se carga** | en cada sesión | en cada sesión (`MEMORY.md`, primeras 200 líneas o 25 KB) |
| **Para qué** | convenciones, comandos, arquitectura | tus preferencias, tus correcciones, contexto que no está en el código |

* Vive en `~/.claude/projects/<proyecto>/memory/`, con un `MEMORY.md` que hace
  de índice y un archivo por tema.
* Está **activa por defecto** en sesiones locales. Se ve y se edita con
  `/memory`; el interruptor está ahí mismo.
* El agente **no guarda** lo que puede deducir del código, ni lo que tu
  `CLAUDE.md` ya dice.

**Lo que dices:** cuando en pantalla aparezca *"Saved 2 memories"*, eso es lo
que está pasando. Y conviene abrirlo: es la forma más rápida de descubrir que el
agente aprendió algo que tú no querías que aprendiera.

## L14 · Dos notas para equipos (30 s cada una)

**En la diapositiva, pie de lámina:**
* `.claude/rules/` — un archivo por tema, y con `paths:` al inicio se cargan
  **solo** cuando el agente toca archivos que coinciden. Es a dónde se mudan las
  reglas que hoy inflan tu `CLAUDE.md`.
* `AGENTS.md` — si el repositorio ya lo tiene y **no** hay `CLAUDE.md`, el
  agente lo lee en su lugar. Si hay los dos, lee `CLAUDE.md`. Se cambia en
  `/config` → **Project instructions**.

---

# 03 · Compactación de contexto

## L15 · El problema, en una línea

**En la diapositiva:**
> Cada conversación empieza vacía. Y cada petición vuelve a enviar **toda** la
> conversación.
>
> Por eso una pregunta de una línea, en un chat que lleva abierto toda la tarde,
> se cobra como toda la tarde.

## L16 · Lámina visual: qué pasa al compactar

**En la diapositiva** — antes y después:

```
ANTES (contexto casi lleno)          DESPUÉS de compactar
┌──────────────────────────┐         ┌──────────────────────────┐
│ system + output style    │  ───►   │ system + output style    │ sigue
│ CLAUDE.md + memoria      │  ───►   │ CLAUDE.md + memoria      │ se recarga del disco
│ 40 turnos de charla      │  ──x──► │ RESUMEN de los 40 turnos │ resumido
│ 25 archivos leídos       │  ──x──► │ los 5 últimos, re-leídos │ (>5.000 tokens: solo la ruta)
│ reglas con paths:        │  ──x──► │ (se recargan a demanda)  │
└──────────────────────────┘         └──────────────────────────┘
```

**Lo que dices (3 min):** compactar no es borrar, es **resumir**. Lo que se
pierde son los detalles de la conversación; lo que sobrevive son tus
instrucciones, porque se vuelven a leer del disco. Y de ahí sale el consejo
práctico: **lo que no quieres perder, escríbelo en un archivo, no en el chat.**

## L17 · Las cinco palancas

**En la diapositiva:**

| Quiero… | Comando |
|---|---|
| Ver qué está ocupando mi contexto | `/context` (y `/context all`) |
| Resumir **conservando lo que me importa** | `/compact céntrate en el bug de login` |
| Compactar **antes** de que se llene | `/autocompact 500k` |
| Resumir **solo una parte** de la charla | `/rewind` → *Summarize from here* |
| **Empezar de cero** | `/clear` |

## L18 · ¿Compactar o empezar de cero?

**En la diapositiva** — la regla de decisión:

| Situación | Qué hacer | Por qué |
|---|---|---|
| Sigo con **la misma** tarea y el contexto se llena | `/compact` con instrucciones | necesitas la continuidad |
| Cambio a una tarea **sin relación** | **`/clear`** | el contexto viejo desplaza a los archivos que necesitas ahora |
| El agente "se obsesionó" con un enfoque que descarté | **`/clear`** | el resumen arrastra el error; la conversación nueva no |
| Cada fase del curso | **conversación nueva** (es la convención del material) | es lo que impide que reinvente lo ya hecho |

**El dato que decide:** `/compact` **lee** toda la conversación que resume, así
que compactar un contexto grande **es, en sí mismo, una petición grande**.
**`/clear` no cuesta nada.** Si no necesitas la continuidad, no la pagues.

**Lo que dices:** y la trampa opuesta: `/clear` tira también lo que el agente
había entendido de tu proyecto. Si eso te dolió, es señal de que esa información
debería haber estado en tu `CLAUDE.md`. La compactación es, entre otras cosas,
un detector de reglas que te faltan.

---

# 04 · `/doctor prompt-audit`

## L19 · El problema: las instrucciones envejecen

**En la diapositiva:**
* Tu `CLAUDE.md` lo escribiste para el modelo del mes pasado.
* Las instrucciones que **ayudaban** a un modelo anterior hoy pueden **estorbar**:
  "piensa paso a paso antes de responder", "no uses herramientas sin
  explicarlo", "divide la tarea en subtareas".
* Y las rutas y comandos que citaba quizá ya no existen.
* Nadie revisa un archivo que "funciona".

**Lo que dices:** vuelve a la frase del inicio — *un contrato que miente es peor
que ninguno*. Hoy hay un comando para detectarlo.

## L20 · El comando

**En la diapositiva:**

```
/doctor prompt-audit
```

**Qué revisa, por defecto:** tus `CLAUDE.md`, `CLAUDE.local.md` y `AGENTS.md`,
más las reglas, Skills, comandos, subagentes y output styles bajo `.claude/` y
`~/.claude/`.

**Qué busca:**
* instrucciones escritas para **modelos anteriores**;
* referencias a **archivos o comandos que no existen**;
* archivos que **se contradicen entre sí**.

**Qué hace con lo que encuentra:** un **informe con ediciones propuestas**.
**No cambia nada** hasta que se lo pidas. Es un diagnóstico, no una cirugía.

**Para auditar una sola cosa**, se le pasa la ruta:
```
/doctor prompt-audit .claude/skills/deploy
```

**Pie de lámina (importante):** requiere **Claude Code v2.1.283 o superior**
(`claude --version`). Corre a través de la Skill incorporada `/claude-api`.

## L21 · Y el otro `/doctor`

**En la diapositiva, dos líneas:**
* `/doctor` sin argumentos es el chequeo general de la instalación; también
  **propone recortes** para un `CLAUDE.md` versionado: quita lo que el agente
  puede deducir del código (carpetas, dependencias, arquitectura) y **conserva**
  las trampas, los motivos y las convenciones que se apartan de lo normal.
* `/claude-api prompt-audit` es **otra cosa**: audita los prompts de una
  aplicación construida sobre la API. No lo confundas con este.

---

# 05 · Output styles

## L22 · La diferencia, en una frase

**En la diapositiva:**
> `CLAUDE.md` dice **qué tiene que saber** el agente sobre tu proyecto.
> Un output style dice **cómo te responde** durante toda la sesión.
> Un hook dice **qué va a pasar sí o sí**.

**Lo que dices:** los tres se usan a la vez, y cada uno resuelve algo que los
otros no.

## L23 · Los cinco que ya tienes

**En la diapositiva:**

| Estilo | Qué cambia | Cuándo lo usas |
|---|---|---|
| **Default** | nada: las instrucciones estándar de ingeniería | el día a día |
| **Proactive** | arranca a trabajar y asume lo rutinario en vez de preguntar | sabes que vas a corregir el rumbo si se equivoca |
| **Concise** | la primera frase es el resultado; sin preámbulo ni resumen final | las respuestas te sobran de largas |
| **Explanatory** | agrega bloques `Insight` explicando **por qué** eligió eso | estás conociendo un código ajeno |
| **Learning** | explica y además te deja escribir trozos (`TODO(human)`) | quieres practicar mientras la tarea avanza |

**Cómo se cambia:** `/output-style concise`, o `/output-style` sin argumentos
para ver la lista. También en `/config` → **Output style**. Se guarda en
`.claude/settings.local.json` (campo `outputStyle`; los nombres incorporados son
sensibles a mayúsculas: `Proactive`, `Concise`, `Explanatory`, `Learning`).

**Demo en vivo (1 min):** pide la misma explicación en **Default** y en
**Explanatory**. La diferencia se ve sin leer documentación.

> Nota: `Proactive` **no** cambia tu modo de aprobación. Los permisos de la
> sesión 1 siguen mandando sobre lo que corre sin preguntarte.

## L24 · El tuyo, en diez líneas

**En la diapositiva:**

`.claude/output-styles/mi-estilo.md` (o `~/.claude/output-styles/` para todos
tus proyectos):

```markdown
---
name: Diagramas primero
description: Empieza cada explicación con un diagrama
keep-coding-instructions: true
---

Cuando expliques código, arquitectura o flujo de datos, empieza con un
diagrama Mermaid y después explica en prosa. Menos de 15 nodos.
```

* `keep-coding-instructions: true` → **conserva** las instrucciones de
  ingeniería de Claude Code y solo cambia la forma de comunicar. Sin él, se
  reemplazan (eso sirve para convertir al agente en algo que no es programador:
  redactor, analista de datos).
* En terminal, los archivos de estilo se leen **al arrancar**: si lo creas a
  mitad de sesión, reinicia.

## L25 · Lámina visual: la tabla de decisión

**En la diapositiva** — tiene que caber en media pantalla; se cita el resto del
curso:

| Quiero… | Uso | Por qué |
|---|---|---|
| Que sepa **cómo es mi proyecto** | `CLAUDE.md` | se carga siempre |
| Reglas para **parte** del código | `.claude/rules/` con `paths:` | se cargan solo al tocar esos archivos |
| Que responda en cierto **tono o formato** toda la sesión | **output style** | aplica a cada respuesta, se cambia con un comando |
| Instrucciones para **un tipo de tarea** | **Skill** (S4) | se carga solo cuando la tarea coincide |
| Que algo pase **sin excepción** | **hook** (S6) | lo ejecuta la herramienta, no el modelo |
| Un ayudante con **contexto aparte** | **subagente** (S5) | devuelve un resumen, no su contexto |

**Lo que dices:** esta tabla se completa en la sesión 4 y se usa hasta la 8.
Hoy ya tienes tres de sus seis filas.

---

# LAB · El contrato, y la misma tarea otra vez

## L26 · Lámina de lab: las tres fases

**En la diapositiva:**

```
2.1  Escribe tu CLAUDE.md desde tu inventario de daños.
     Cada regla apunta a un defecto que TÚ mediste.        (~15 min)

2.2  Revierte el filtro de la sesión 1 y deja la app
     como estaba antes.                                    (~5 min)

2.3  Corre /doctor prompt-audit sobre lo que escribiste,
     y repite la tarea patrón — conversación nueva,
     enunciado idéntico.                                   (~15 min)
```

**Producto:** la **segunda fila** de `docs/MEDICIONES.md`, al lado de la de la
semana pasada.

## L27 · Fase 2.1 — El `CLAUDE.md` que nace de tus daños

**En la diapositiva** — la regla de oro y el esqueleto:

> **Cada regla apunta a un defecto concreto que tú mediste.** Nada de plantillas.
> Si una línea no corresponde a una fila de tu inventario, bórrala.

Esqueleto sugerido (**menos de 200 líneas**, y hoy no deberías pasar de 40):

```markdown
# <nombre de tu app>

## Qué es esto
Una línea. No repitas el README.

## Comandos
- Desarrollo: `npm run dev`
- Pruebas: todavía no hay. (No afirmes que existen: ver S6.)

## Reglas de arquitectura  ← defecto 1 de tu inventario
- Los componentes no importan el cliente de base de datos.
  El acceso a datos vive en `lib/`; los componentes reciben datos ya listos.
- Verificación: `grep -rl "<el import que encontraste>" app components`
  debe devolver vacío.

## Valores ajustables  ← defecto 2
- IVA, moneda, productos por página y límites viven en UN solo archivo:
  `lib/constants.ts`. Ningún número suelto en componentes ni en rutas.

## Estado de la interfaz  ← lo que midió tu tarea patrón
- El estado de filtros, búsqueda y paginación vive en la URL
  (parámetros de búsqueda), no en el estado del componente.
- Si un filtro no sobrevive a recargar la página, está mal puesto.

## Seguridad  ← defecto 4 (se cierra en S6 y S7)
- Toda ruta que escribe comprueba la sesión en el servidor.
- Las contraseñas se guardan con hash. Nunca en claro.
```

**La línea que decide el lab** es la de *Estado de la interfaz*: es lo único que
la tarea patrón mide. Dilo en voz alta.

**Lo que dices:** dos advertencias.
1. **No escribas lo que el agente deduce.** El árbol de carpetas, la lista de
   dependencias y el resumen de arquitectura se borran: ya los lee.
2. **Lo que todavía no es verdad, no se escribe como si lo fuera.** Hoy no hay
   pruebas. El archivo lo dice así. Ese es el contrato que no miente.

**Atajo útil:** `/init` genera un `CLAUDE.md` de partida leyendo el código; si ya
existe, propone mejoras en vez de sobrescribirlo. Úsalo **después** de escribir
tus reglas, para comparar: lo que `/init` encuentra solo es, casi siempre, lo que
no hacía falta escribir.

## L28 · Fase 2.2 — Volver al punto de partida

**En la diapositiva:**
* La corrida 2 tiene que partir del **mismo código** que la corrida 1: la app
  **sin** el filtro.
* Hoy se revierte con **git**: `git log --oneline` para encontrar el commit del
  filtro, y `git revert <commit>`.
* `git status` limpio antes de seguir. Si el filtro sigue en pantalla, no has
  revertido: el navegador tiene caché.

> El `/rewind` llega en la sesión 6. Hoy, git.

## L29 · Fase 2.3 — La auditoría y la segunda corrida

**En la diapositiva, dos pasos:**

**Paso 1 — audita lo que acabas de escribir:**
```
/doctor prompt-audit
```
Lee el informe **y decide tú** qué aceptar. Anota en tu bitácora cuántos
hallazgos tuvo y cuántos aceptaste.
*(Sin v2.1.283: pídele al agente que revise tu `CLAUDE.md` buscando las tres
cosas de la lámina 20, y anótalo igual.)*

**Paso 2 — la misma tarea, otra vez.** Conversación **nueva**, enunciado
**idéntico** al de la semana pasada:

```text
Agrega al catálogo un filtro por categoría. Que se pueda elegir una categoría
y el listado muestre solo los productos de esa categoría, y que el filtro
siga aplicado si recargo la página.
```

**No se cambia ni una palabra.** Si hoy explicas mejor la tarea, la comparación
mide tu prosa, no tu contrato.

**Verifica los 5 pasos sin abrir un archivo:** arranca · filtra · **recarga
(F5)** · copia la URL en otra pestaña · vuelve a "todas".

## L30 · La tabla que te llevas

**En la diapositiva:**

| Corrida | Resultado | Turnos | Dónde quedó el estado del filtro | Costo | Duración |
|---|---|---|---|---|---|
| S1 · sin reglas | *(de la semana pasada)* | | | | |
| **S2 · con `CLAUDE.md`** | **hoy** | | | | |
| S3 · configuración elegida | *(la próxima)* | | | | |

**Quién mide qué** (igual que la sesión 1): el **costo**, la **duración**, los
**turnos de corrección** los cuentas **tú** y se los dictas al agente; **dónde
quedó el estado del filtro** lo mira el agente, y tú lo confirmas **en la barra
de direcciones**, no en el código.

**Lo que dices:** *"Si esta fila sale igual que la de la semana pasada, hoy no
demostramos nada — y lo interesante es por qué. Casi siempre es que tu
`CLAUDE.md` no dice nada sobre lo que esta tarea mide."*

## L31 · Cierre de sesión

**En la diapositiva:**
* Tienes un contrato escrito, **auditado**, y una segunda fila medida.
* Lo que hoy **no** hicimos: nada de costos (S3), nada de Skills (S4), nada de
  pruebas ni hooks (S6).
* La semana que viene: **la factura**. Las tres palancas del costo, sobre tu
  propia factura de la sesión 1 — y la misma tarea, una tercera vez.

## L32 · ¡Gracias! / Modo de evaluación

Las dos últimas láminas de la sesión 1, sin cambios.

---

## Si algo falla (tabla de apoyo para el docente)

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| `Unknown command` al correr `/doctor prompt-audit` | versión anterior a **v2.1.283** | `claude --version`; actualizar, o hacer la auditoría a mano con los tres criterios de la lámina 20 |
| El audit dice que no está disponible | la Skill incorporada `/claude-api` está desactivada (`skillOverrides` / `disableBundledSkills`) | activarla, o auditar a mano |
| El `CLAUDE.md` del alumno no aparece en `/context all` → **Memory files** | está en una carpeta que no se carga, o es de una subcarpeta (esas cargan a demanda) | revisar la jerarquía de la lámina 11; `/memory` para abrirlo |
| El agente ignora una regla que sí está cargada | regla vaga, o dos reglas que se contradicen | hacerla verificable (lámina 8) y correr el audit; si **tiene** que cumplirse, es un hook (S6) |
| La fila S2 sale **idéntica** a la S1 | el `CLAUDE.md` no dice nada sobre lo que la tarea mide | comprobar que incluye la regla de "el estado de los filtros vive en la URL" |
| La app "ya tenía" el filtro al empezar la corrida 2 | no se revirtió el commit de la sesión 1 | fase 2.2; `git log --oneline` y `git revert` |
| La app salió sospechosamente bien también hoy | memoria global propia o memoria automática acumulada | no es un fallo: es la lámina 12. Anotarlo |
| Al alumno le sobró tiempo | — | que mueva una regla larga a `.claude/rules/` con `paths:` y compruebe con `/context` que el arranque pesa menos |

## Restricciones de la sesión

* No se tocan costos, modelos ni effort: eso es la sesión 3.
* No se escribe ninguna Skill ni se conecta MCP: sesión 4.
* No se escribe ninguna prueba ni ningún hook: sesión 6.
* No se corrige el defecto 3 ni el 4 **en el código**: hoy solo entran al
  contrato como reglas.

---

## Fuentes y fecha de consulta

Todo lo técnico de este documento se verificó el **8 de noviembre de 2026**
contra la documentación oficial, y la versión instalada en la máquina de
preparación (**2.1.206**) se comprobó con `claude --version`:

* Jerarquía de `CLAUDE.md`, límite de 200 líneas, `@imports`, `.claude/rules/`,
  `AGENTS.md`, memoria automática y `/doctor prompt-audit` —
  [How Claude remembers your project](https://code.claude.com/docs/en/memory)
* Compactación, `/context`, `/compact`, `/autocompact`, `/clear`, qué sobrevive
  a la compactación —
  [Explore the context window](https://code.claude.com/docs/en/context-window)
  y [Manage costs effectively](https://code.claude.com/docs/en/costs)
* Output styles, los cuatro incorporados, frontmatter y tabla de decisión —
  [Output styles](https://code.claude.com/docs/en/output-styles)
* Niveles de effort y ventana de auto-compactación (contexto para la sesión 3) —
  [Model configuration](https://code.claude.com/docs/en/model-config)

> **Regla de la Ed. 5:** estas funciones se mueven entre versiones. Antes de
> dar la clase, vuelve a comprobar los comandos de las láminas 17, 20 y 23 y
> actualiza la fecha de arriba.
