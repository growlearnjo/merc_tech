# Claude Code Ed. 5 — Prompts de la Sesión 1 (Tu app en una sesión)

Cada prompt está construido con los ítems de la rúbrica de prompt engineering
(Rol, Contexto, Objetivo, Público/tono, Restricciones, Formato, Ejemplos,
Razonamiento), incluyendo **solo los pertinentes para cada fase**.

Todos asumen que existe `doc_sesions/sesion1/Ed5_sesion1.md` (la spec). El prompt la
referencia SIEMPRE — la spec es la fuente de verdad; el prompt es el
disparador autocontenido.

| Fase | Rol | Contexto | Objetivo | Público/tono | Restricciones | Formato | Ejemplos | Razonamiento |
|---|---|---|---|---|---|---|---|---|
| 0 Terreno | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 1 Lectura de la spec | — | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 1.1 Entorno y modo | ✔ | ✔ | ✔ | — | ✔ | ✔ | ✔ | ✔ |
| 1.2 Generar la app | — | ✔ | ✔ | — | ✔ | ✔ | — | — |
| 1.3 Factura y daños | ✔ | ✔ | ✔ | — | ✔ | ✔ | ✔ | — |
| 1.4 Tarea patrón | — | ✔ | ✔ | — | ✔ | ✔ | — | — |
| Cierre | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

La Fase 1.2 es el único prompt de todo el curso **sin rol y sin
restricciones de calidad**, y es a propósito: es el encargo tal como lo
escribiría cualquiera. Los demás prompts sí llevan la estructura completa,
para que veas la diferencia desde el primer día.

---

## Cómo usar estos prompts

1. **Cada fase empieza en una conversación nueva**, en orden. Dos de ellas
   —la **1.2** y la **1.4**— se ejecutan en **dos pasos dentro de ese mismo
   chat**: primero pegas el texto que dispara el trabajo, y cuando el agente
   termina, pegas el segundo bloque que escribe la documentación. Cada una lo
   explica paso a paso.

   **Quién mide qué** (es la causa de la mitad de las dudas en clase):

   | Dato | Lo consigue | Lo escribe en el archivo |
   |---|---|---|
   | Costo de la conversación | **tú**, con `/cost` antes de cerrarla | el agente, cuando se lo dictas |
   | Duración | **tú**, con el reloj | el agente |
   | Turnos en que lo corregiste | **tú**, contándolos | el agente |
   | Veces que pidió aprobación | **tú**, contándolas | el agente |
   | Evidencia de los 4 defectos | el agente, corriendo comandos | el agente |
   | Dónde quedó el estado del filtro | el agente, mirando su código | el agente |

   El agente no puede medir lo que cuesta su propia conversación ni contar las
   veces que te hizo volver atrás. Si le pides esos números sin dárselos, los
   inventa — y una tabla inventada no sirve para comparar nada.
2. **No recortes el bloque `[CONTEXTO]`**, pero **rellena sus marcadores**:
   `<RUTA_PROYECTO>` y `<TU_REPO>` (ver [`PLACEHOLDERS.md`](PLACEHOLDERS.md)).
   Un marcador sin rellenar hace que el agente persiga un estado que no existe.
3. **Corre la verificación de la fase antes del prompt siguiente.** Una fase
   sin verificar es una fase sin terminar.
4. **Commit por fase**: `docs:` para la 1.1 y la 1.3, `feat:` para la 1.2,
   `feat:` para la 1.4.
5. **Cierre**: el último prompt deja tu bitácora escrita y todo subido a
   GitHub. La sesión 2 arranca leyendo eso.

### Estado del repositorio al iniciar la sesión

* Una carpeta **vacía** en `<RUTA_PROYECTO>`: sin `package.json`, sin `.git`,
  sin `.claude/`.
* El repositorio `<TU_REPO>` creado en GitHub, **vacío y público**.
* Claude Code, Node 20 o superior y Git instalados. **Nada más**: la app de hoy
  guarda sus datos en un archivo dentro del proyecto.
* **Sin** `CLAUDE.md` global tuyo y **sin** Skills personales activas.
* El material del curso (`doc_sesions/sesion1/`) accesible desde la carpeta del proyecto.

---

## Prompt 0 — Verificación del terreno

```text
[ROL] Actúa como ingeniero DevOps que prepara una máquina antes de que empiece
el trabajo: tu única misión es confirmar el terreno y detenerte en la primera
sorpresa.

[CONTEXTO] Voy a empezar la sesión 1 del curso en <RUTA_PROYECTO>. Lee
doc_sesions/sesion1/Ed5_sesion1.md, secciones "Antes de empezar" y "Estado de partida".
La carpeta debe estar vacía y yo ya creé un repositorio vacío y público en
GitHub.

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones, con su comando: claude, node (>= 20), npm, git. No hace falta
   nada más: la app de hoy guarda sus datos en un archivo del propio proyecto,
   así que no hay base de datos que instalar ni servicio que levantar.
2. Que <RUTA_PROYECTO> esté vacía: sin package.json, sin .git, sin .claude.
3. Que NO haya memoria global mía en juego: comprueba si existe un CLAUDE.md
   global o Skills personales activas. Si existen, NO las borres: dime cuáles
   son y explícame en dos líneas por qué hoy conviene trabajar sin ellas.
4. Pregúntame, una por una y sin pedirme ningún valor: ¿tengo plan de Claude o
   saldo de API?, ¿creé el repositorio vacío y público?

[RESTRICCIONES]
- No escribas ni un archivo. No instales nada. No inicialices git.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.
- No empieces ninguna fase: esto es solo verificación.

[RAZONAMIENTO] Ejecuta las comprobaciones una a una y, si alguna falla,
diagnostica antes de pasar a la siguiente.

[FORMATO DE SALIDA] (1) Tabla herramienta × versión × estado; (2) estado de la
carpeta y de la memoria global; (3) mis respuestas a las dos preguntas;
(4) veredicto en una línea: "terreno listo, adelante con la lectura" o el
bloqueo encontrado. Sin commit.
```

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion1/Ed5_sesion1.md y también
doc_sesions/sesion1/ENCARGO_LITE.md y doc_sesions/sesion1/TAREA_PATRON.md. Devuélveme lo que
entendiste: las 4 fases en orden con qué entrega cada una, qué NO se hace hoy,
y los 4 defectos que el encargo debe producir.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.
- No propongas mejoras al encargo. Está cerrado a propósito; si te parece
  pobre, dímelo en una línea y sigue.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora: corregirlo aquí es gratis y durante una fase cuesta.

[FORMATO DE SALIDA] (1) Las 4 fases, una línea cada una; (2) la lista de lo
que NO se hace hoy; (3) los 4 defectos; (4) tus dudas, si hay. Sin commit.
```

## Prompt Fase 1.1 — Entorno, cómo se paga y modo de aprobación

```text
[ROL] Actúa como el ingeniero senior que me acompaña el primer día: explicas
el porqué de cada decisión en dos líneas y no decides por mí lo que me toca
decidir.

[CONTEXTO] Proyecto en <RUTA_PROYECTO>, carpeta vacía. Lee la Fase 1.1 de
doc_sesions/sesion1/Ed5_sesion1.md. El Prompt 0 ya verificó las versiones.

[OBJETIVO] Crea docs/00-ANTES.md con tres secciones:
1. ENTORNO: tabla herramienta × comando × salida real de mi máquina.
2. CÓMO PAGO: en dos líneas, qué tengo contratado y qué pasa cuando se agota.
   Explícame la diferencia entre un plan (techo de uso) y saldo de API (techo
   de dinero), y cuál de los dos me va a frenar primero.
3. MODO DE APROBACIÓN: lista los modos que ofrece ESTA instalación —míralos en
   la ayuda y en la configuración, no de memoria—, ordénalos de "pregunta por
   todo" a "actúa sin preguntar", y para el que yo elija escribe una frase
   concreta de qué podría hacer el agente que yo no querría. Pregúntame cuál
   elijo; no lo elijas tú.

Explícame además, en tres líneas y sin nombres de versión, con qué criterio se
elige un modelo: cuándo vale pagar por capacidad (cuando el error cuesta más
que el modelo) y cuándo no.

[RESTRICCIONES]
- No instales nada que no sea un requisito faltante.
- No escribas ninguna clave, token ni contraseña en el archivo ni en el chat.
- No generes la app todavía: eso es la 1.2.
- No escribas un CLAUDE.md. Es el centro de la sesión 2 y hoy lo arruinaría.

[EJEMPLOS] El tono del archivo: "Node v22.11.0 (`node --version`) — cumple el
mínimo de 20." Hechos con su evidencia, no adjetivos.

[RAZONAMIENTO] Antes de escribir el archivo, muéstrame la tabla de versiones y
la lista de modos, y espera a que te diga cuál elijo.

[FORMATO DE SALIDA] (1) docs/00-ANTES.md con las tres secciones; (2) la frase
del riesgo que acepté; (3) commit propuesto: "docs: record the starting point
for Fase 1.1".
```

## Prompt Fase 1.2 — Generar MercadoTech Lite

> **Este prompt es el encargo, y punto.** Cópialo de
> [`ENCARGO_LITE.md`](ENCARGO_LITE.md) §1 y pégalo tal cual, en una
> conversación nueva. No le agregues rol, ni restricciones, ni formato de
> salida: su pobreza es el experimento.
>
### Esta fase son DOS pasos, en el MISMO chat nuevo

**Paso 1 — tú pegas el encargo y lo envías.**

1. Abre una **conversación nueva** de Claude Code en la carpeta del proyecto.
2. Copia de [`ENCARGO_LITE.md`](ENCARGO_LITE.md) §1 **solo el bloque de texto
   del recuadro** (las ~12 líneas que empiezan con "Necesito una tienda web…").
   No copies el resto del archivo: §2 y §3 le dirían al agente qué se espera
   que haga mal.
3. Pégalo tal cual y envía. **No le agregues nada.**
4. **Anota la hora.** La vas a necesitar en el paso 2.

**Mientras el agente trabaja, el trabajo es tuyo y son tres cosas:**

* **Llevas la cuenta de dos números**, con lápiz o en un bloc: cuántas veces te
  pidió aprobación, y cuántas veces tuviste que corregirlo o recordarle algo
  (por ejemplo, que la base es SQLite y no un servicio en la nube). **Nadie más
  puede contarlos**: el agente no se cuenta a sí mismo, y en el paso 2 se los
  tienes que dictar.
* **Si te pregunta algo, contesta lo mínimo** para que siga. No le des
  convenciones, ni capas, ni nombres de carpetas.
* **No corrijas el código.** Mirar sí, corregir no.

**Paso 2 — cuando termine, en ESE MISMO chat, antes de cerrarlo.**

Primero mira **cuánto costó la conversación**: en Claude Code es el comando
`/cost`. Si tu versión no lo tiene, usa la página de consumo de tu cuenta.
Copia ese número — el agente **no puede saber** lo que costó su propia
conversación, y si se lo preguntas sin dárselo, se lo inventa.

Y entonces pega esto, reemplazando lo que está entre corchetes por tus datos:

```text
[OBJETIVO] Antes de cerrar: dime qué construiste, en qué archivos, y qué
decisiones tomaste que yo no te pedí (estructura de carpetas, dónde pusiste la
lógica de datos, cómo manejaste los permisos y el login, si escribiste
pruebas). Después agrega a docs/00-ANTES.md una sección FACTURA con estos
cuatro datos, que te doy yo porque los medí yo:
- costo de esta conversación: [PEGA AQUÍ lo que dijo /cost]
- duración: [MINUTOS] minutos
- turnos en que tuve que corregirte o recordarte algo: [NÚMERO]
- veces que me pediste aprobación: [NÚMERO]

[RESTRICCIONES]
- No cambies ni un archivo de la app en este turno: solo informas.
- No arregles nada de lo que me cuentes, aunque te parezca grave.
- No estimes ninguno de los cuatro datos: son los que te acabo de dar. Si
  alguno viene vacío, escribe "sin medir".

[FORMATO DE SALIDA] (1) qué construiste y dónde; (2) tus decisiones no
pedidas, en lista; (3) la sección FACTURA escrita; (4) commit propuesto:
"feat: generate MercadoTech Lite for Fase 1.2".
```

## Prompt Fase 1.3 — La factura y el inventario de daños

> **Conversación nueva.** Y no es solo la regla general: si auditas en el mismo
> chat donde el agente construyó la app, el auditor es el que escribió el
> código y arrastra sus propios supuestos — justo lo que la sesión 5 enseña a
> evitar delegando en un subagente con contexto limpio. Aquí lo haces a mano
> abriendo un chat nuevo.
>
> Un solo paso: pegas este prompt y listo. Los datos los saca el agente
> corriendo comandos, así que esta vez no tienes que dictarle nada.

```text
[ROL] Actúa como auditor que documenta hallazgos con evidencia y NO los
corrige. Tu informe tiene que servirle a otra persona mañana.

[CONTEXTO] Proyecto en <RUTA_PROYECTO>, con MercadoTech Lite ya generada.
Lee la Fase 1.3 de doc_sesions/sesion1/Ed5_sesion1.md y la sección 3 de
doc_sesions/sesion1/ENCARGO_LITE.md, que lista los 4 defectos esperados con el grep que
comprueba cada uno.

[OBJETIVO] Completa docs/00-ANTES.md con la sección INVENTARIO DE DAÑOS: una
fila por defecto, con el comando que lo comprueba y SU SALIDA REAL recortada.
Los cuatro son: (1) componentes que consultan la base de datos directamente;
(2) valores ajustables incrustados en el código; (3) cero pruebas; (4) la
seguridad abierta —la página de administración no comprueba quién la usa, las
contraseñas se guardan sin cifrar, o la sesión se decide en el navegador—.

Si un defecto NO apareció, escríbelo así y dime qué decisión tomaste tú que lo
evitó. Si encuentras un quinto problema que no está en la lista, agrégalo con
su evidencia.

[RESTRICCIONES]
- NO corrijas ni un archivo de la app. Ni uno. Hoy se fotografía, no se arregla.
- Cada fila lleva comando y salida, no una opinión ni un "parece que".
- No imprimas el valor de ninguna clave que encuentres: di dónde está y en qué
  línea, nada más.
- Al terminar, `git status` no debe mostrar cambios fuera de docs/.

[EJEMPLOS] Formato de fila esperado:
  | 3 · Cero pruebas | `ls **/*.test.*` → sin resultados; package.json no
  tiene script "test" | se cierra en la sesión 6 |

[FORMATO DE SALIDA] (1) la sección INVENTARIO escrita; (2) confirmación de que
git status solo muestra docs/; (3) commit propuesto: "docs: record the damage
inventory for Fase 1.3".
```

## Prompt Fase 1.4 — La tarea patrón, primera corrida

> **Conversación nueva, obligatorio.** Si la ejecutas en el hilo de la
> generación, el agente ya conoce todo el código y la comparación con las
> sesiones 2 y 3 deja de medir lo que dice medir.

### Esta fase son DOS pasos, en el MISMO chat nuevo

**Paso 1 — tú pegas el enunciado y lo envías.**

1. Abre una **conversación nueva**.
2. Copia de [`TAREA_PATRON.md`](TAREA_PATRON.md) §1 **solo el enunciado del
   recuadro**: *"Agrega al catálogo un filtro por categoría…"*. Son tres
   líneas.
3. Pégalo **tal cual, sin una palabra más**, y envía. Las sesiones 2 y 3 van a
   pegar exactamente este mismo texto: si lo cambias, mides tu prosa en vez de
   tu configuración.
4. **Anota la hora** y, como en la 1.2, **lleva la cuenta de los turnos** en
   que tengas que corregirlo.

**Cuando termine, verifica tú mismo, sin abrir ni un archivo** (son los 5 pasos
de `TAREA_PATRON.md` §2):

1. `npm run dev` arranca sin errores en la consola del navegador.
2. Eliges una categoría → el listado muestra **solo** esos productos.
3. **Recargas con F5** → el filtro sigue aplicado.
4. Copias la URL y la abres en otra pestaña → se ve el mismo listado filtrado.
5. Vuelves a "todas las categorías" → reaparecen los 12 productos.

Y **mira la barra de direcciones**, porque de ahí sale el dato más importante
de la tabla:

| Lo que ves | Dónde quedó el estado del filtro |
|---|---|
| El filtro se pierde al recargar | En el estado del componente |
| Sobrevive, pero la URL no cambió | En el almacenamiento del navegador |
| La URL lleva algo como `?categoria=laptops` | En la URL |

**Paso 2 — en ESE MISMO chat**, con el costo a mano (`/cost`), pega esto
reemplazando lo que está entre corchetes:

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. Acabas de agregar el filtro por
categoría al catálogo. Lee la Fase 1.4 de doc_sesions/sesion1/Ed5_sesion1.md y la
sección 3 de doc_sesions/sesion1/TAREA_PATRON.md.

[OBJETIVO] Crea docs/MEDICIONES.md con la tabla de tres filas de TAREA_PATRON
§3 y rellena SOLO la primera ("S1 · sin reglas"). Cuatro datos te los doy yo:
- resultado: [✅ a la primera / ⚠️ tras corregir / ❌ no pasa / 🔥 rompió algo]
- turnos en que tuve que corregirte: [NÚMERO]
- costo: [PEGA AQUÍ lo que dijo /cost]
- duración: [MINUTOS] minutos

Los otros dos los pones tú: dónde quedó el estado del filtro (el estado del
componente, el almacenamiento del navegador o la URL) y en qué archivo lo
pusiste.

[RESTRICCIONES]
- No cambies el comportamiento del filtro para que se vea mejor en la tabla.
- Las otras dos filas quedan VACÍAS: son de las sesiones 2 y 3.
- No estimes ningún dato de los que te di. Si alguno viene vacío, escribe
  "sin medir".

[FORMATO DE SALIDA] (1) docs/MEDICIONES.md con la primera fila; (2) en qué
archivo quedó el estado del filtro; (3) commit propuesto: "feat: add the
category filter and record the first baseline for Fase 1.4".
```

## Prompt de cierre — Bitácora y primer commit del curso

```text
[ROL] Actúa como quien escribe la bitácora de un proyecto para que otra
persona —o yo en tres semanas— entienda qué pasó sin tener que leer el código.

[CONTEXTO] Proyecto en <RUTA_PROYECTO>, sesión 1 terminada. Existen
docs/00-ANTES.md y docs/MEDICIONES.md. El repositorio remoto es <TU_REPO>,
vacío y público.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con los números que
medí y sin adjetivos. Si algo salió mal, se dice que salió mal.

[OBJETIVO] En este orden:
1. Crea docs/BITACORA.md con la entrada de la sesión 1: qué se construyó, qué
   decidiste tú que yo no te pedí, qué costó, qué salió mal y qué queda
   pendiente para la sesión 2.
2. Crea un .gitignore adecuado al proyecto, y comprueba que .env*.local quede
   excluido ANTES del primer push.
3. Verifica que no haya ninguna clave en el historial ni en los archivos que
   se van a subir. Si encuentras alguna, detente y avísame: no subas nada.
4. Conecta el remoto <TU_REPO> y sube todo. Si Windows abre el navegador para
   autorizar, avísame y espera.

[RESTRICCIONES]
- No escribas un CLAUDE.md: es el centro de la sesión 2.
- No corrijas ningún defecto del inventario.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) docs/BITACORA.md; (2) confirmación de que .env*.local
está ignorado y de que no hay claves en lo que se sube; (3) salida de
`git remote -v` y del push; (4) commit propuesto: "docs: close Sesión 1 with
the baseline log".
```

---

## Nota sobre la rúbrica

La Fase 1.2 rompe a propósito todas las reglas de las demás: sin rol, sin
restricciones, sin formato de salida, sin razonamiento previo. Es el encargo
de la vida real.

Compara ese prompt con el de la Fase 1.3 —mismo agente, mismo proyecto, misma
tarde— y tendrás, en dos pantallas, el argumento completo del curso.
