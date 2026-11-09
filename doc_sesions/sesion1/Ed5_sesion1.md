# Claude Code Ed. 5 — Sesión 1: Tu app en una sesión

## Este documento contiene la especificación completa de la sesión. Léelo completamente antes de ejecutar nada. No hagas suposiciones fuera de lo especificado.

**Prompts de la sesión (ejecutar en orden; versión completa y autocontenida de cada uno en `PROMPTS_sesion1.md`):**

0. "Ejecuta el Prompt 0 de `PROMPTS_sesion1.md`: verifica el terreno."
1. "Lee `Ed5_sesion1.md` completo y confírmame que entiendes el alcance. No ejecutes nada todavía."
2. "Ejecuta la Fase 1.1: deja el entorno verificado y elige el modo de aprobación."
3. "Ejecuta la Fase 1.2: genera MercadoTech Lite con el encargo, tal cual."
4. "Ejecuta la Fase 1.3: la factura y el inventario de daños."
5. "Ejecuta la Fase 1.4: la primera corrida de la tarea patrón."
6. "Ejecuta el Prompt de cierre de `PROMPTS_sesion1.md`: bitácora y primer commit del curso."

---

## Objetivo general

Al terminar tienes una app funcionando que generaste en una sesión, sabes
exactamente **cuánto costó**, sabes **qué le diste permiso de hacer al agente**
y tienes escrita la lista de lo que salió mal. Nada de eso se arregla hoy: es
la fotografía del "antes" contra la que se mide el resto del curso.

## Objetivos específicos

* Verificar la instalación en terminal y en el editor.
* Entender **cómo se paga** Claude Code: plan de Claude o saldo de API, y en
  qué se diferencian para tu bolsillo.
* Elegir un **modo de aprobación** a conciencia, sabiendo qué riesgo aceptas.
* Saber con qué criterio se elige un modelo, sin memorizar nombres de versión.
* Generar la app del encargo y **medir** lo que costó.
* Dejar por escrito los defectos, sin corregir ninguno.

---

## Qué vas a construir, en palabras simples

Hoy contratas a alguien muy rápido y muy capaz, le das un encargo de una
frase y lo dejas trabajar solo toda la tarde **sin decirle cómo trabajas, sin
revisar lo que hace y sin pedirle que pruebe nada**. Al final del día tendrás
algo que funciona. También tendrás una factura y una lista de sorpresas.

Eso es exactamente lo que pasa cuando se le pide una app a un agente sin
configurarlo. Y es la forma más honesta de empezar el curso: en vez de
explicarte por qué hace falta gobernar al agente, te lo vas a encontrar.

Las siete sesiones siguientes son lo contrario: le pones memoria, le pones
precio, le pones un revisor, le pones límites que no puede saltarse y, al
final, empaquetas todo eso para que tu equipo lo instale en un comando.

> **Importante:** hoy no se corrige nada. Si ves algo que te duele, anótalo.
> Corregirlo hoy destruye la medición — y además lo vas a corregir mejor en la
> sesión 2, cuando el agente ya tenga tus reglas escritas.

## Glosario mínimo

| Término | En una línea |
|---|---|
| Agente | El programa que lee tu proyecto, decide qué hacer y usa herramientas (leer, escribir, ejecutar) para hacerlo. |
| Herramienta | Cada cosa concreta que el agente puede hacer: leer un archivo, escribirlo, correr un comando, buscar en la web. |
| Modo de aprobación | Cuánto puede hacer el agente **sin preguntarte**. Va de "pregunta por todo" a "actúa y te avisa". |
| Modo auto | El predeterminado hoy: un clasificador decide en segundo plano si una acción se aprueba sola o te la pregunta. |
| Plan de Claude | Pagas una suscripción mensual con límites de uso. Precio conocido de antemano. |
| Saldo de API | Pagas por consumo, por token. Más control, y también más posibilidad de sorpresa. |
| Token | La unidad en que se mide el texto que entra y sale del modelo (~4 caracteres). Es lo que se paga. |
| Familia de modelos | Varios modelos de distinta capacidad y precio. Elegir es decidir cuánto te cuesta equivocarte. |
| MercadoTech Lite | La app que vas a generar hoy: catálogo, carrito, checkout simulado y login. |
| Tarea patrón | Una tarea chica que le pedirás tres veces al agente —hoy, en la sesión 2 y en la 3— para comparar. |
| El "antes" | Tu app de hoy, con su costo y su lista de defectos. El punto de comparación de todo el curso. |

---

## Antes de empezar: tareas humanas

Dos, y la primera cuesta dinero. Hazlas antes de la clase:

1. **Cuenta con acceso a Claude Code.** Un plan de Claude o saldo de API
   cargado. En la Fase 1.1 vas a mirar cuál tienes y qué implica; lo que no se
   puede hacer en clase es contratarlo.
2. **Cuenta de GitHub.** Crea un repositorio **vacío** y **público** llamado
   `mercadotech-lite`. Sin README, sin `.gitignore`, sin licencia.

> **¿Público?** Sí, y es una decisión del curso: la protección de rama y la
> revisión automática de PRs de la sesión 7 necesitan un repositorio público
> en el plan gratuito de GitHub. La contrapartida es parte del contenido:
> desde hoy, **nada de claves en el repositorio**, y en la sesión 7 verificas
> que no se te escapó ninguna.

**No hay nada más que instalar**, y es a propósito: la app de hoy guarda sus
datos en un archivo SQLite dentro del propio proyecto. No hace falta Docker, ni
una base de datos aparte, ni cuenta en ningún servicio de datos. Lo único que
tiene que estar en tu máquina es Node 20 o superior, Git y Claude Code.

## Estado de partida

| Debe existir | Dónde | Lo usa la fase |
|---|---|---|
| Claude Code instalado y autenticado | tu terminal (`claude --version`) | 1.1 |
| Node 20 o superior y Git | tu máquina (`node --version`, `git --version`) | 1.1 |
| Repositorio `<TU_REPO>` vacío y público en GitHub | github.com | cierre |
| Una carpeta **vacía** en `<RUTA_PROYECTO>` | tu disco | 1.2 |
| `doc_sesions/sesion1/ENCARGO_LITE.md` y `doc_sesions/sesion1/TAREA_PATRON.md` | el material del curso | 1.2, 1.4 |

**Lo que NO debe existir**, y el Prompt 0 lo comprueba: un `CLAUDE.md` global
tuyo (`~/.claude/CLAUDE.md`), Skills personales activas, o cualquier proyecto
previo en la carpeta. Las tres cosas cambian lo que el agente genera, y hoy
queremos ver qué hace **sin** ayuda. En la sesión 2 las recuperas sabiendo
exactamente qué aportan.

### Decisiones tomadas al preparar esta sesión

| # | Hallazgo | Resolución | Fase |
|---|---|---|---|
| 1 | Si el alumno trae su memoria global, la app sale decente y la sesión se queda sin defectos que estudiar | El Prompt 0 verifica que no haya `CLAUDE.md` global ni Skills personales en juego, y lo explica como contenido: eso **es** la primera demostración de para qué sirve la memoria | 1.1, 1.2 |
| 2 | Los nombres exactos de los modos de aprobación y de los comandos de costo **cambian entre versiones** | La sesión enseña el **concepto** y te hace listar los modos que ofrece **tu** instalación, en vez de memorizar nombres que caducan. Lo mismo con el comando de costo: se usa el que tengas y, si no hay, la página de consumo de la cuenta | 1.1, 1.3 |
| 3 | El encargo tiene que producir siempre los mismos defectos, o el curso se queda sin caso de estudio | El texto del encargo está cerrado en `ENCARGO_LITE.md` y **no se modifica**; sus cuatro defectos se comprueban con greps, no a ojo | 1.2, 1.3 |
| 4 | La tarea patrón no cabía en tres fases sin apretar la sesión | Se añade como Fase 1.4, y es la única que puede quedar como tarea para casa si el reloj aprieta: es autocontenida y su verificación es observable | 1.4 |
| 5 | Medir el costo de la generación exige saberlo **antes** de cerrar la conversación | La Fase 1.2 termina anotando el costo de esa conversación, no la siguiente: al cerrarla, el dato se vuelve difícil de recuperar | 1.2, 1.3 |
| 6 | La versión anterior del encargo pedía Supabase, y eso arrastraba Docker y una instalación que puede comerse media clase | **La app guarda sus datos en SQLite dentro del proyecto.** Cero instalaciones, cero cuentas. Nada del curso dependía de esa elección: las sesiones 2 a 8 gobiernan al agente, no al stack. El defecto 4 se reformuló sin perder la lección (ver `ENCARGO_LITE.md` §3) | 1.2, 1.3 |

---

## Mapa de fases y dependencias

| Fase | Qué entrega (en una línea) | Depende de | Se verifica con |
|---|---|---|---|
| 1.1 | Entorno verificado y modo de aprobación elegido por escrito | Prompt 0 | `docs/00-ANTES.md` tiene la tabla de herramientas y el modo con su riesgo |
| 1.2 | MercadoTech Lite funcionando, generada con el encargo tal cual | 1.1 | `npm run dev` sirve el catálogo con ~12 productos |
| 1.3 | La factura y el inventario de daños | 1.2 | los 4 defectos comprobados con sus greps, y el costo anotado |
| 1.4 | La primera corrida de la tarea patrón, medida | 1.2 | los 5 pasos de verificación de `TAREA_PATRON.md` §2 |

## Convenciones transversales

* **Hoy no se corrige nada.** Lo que salga mal, **tú lo anotas** y sigue
  adelante. Única excepción: si la app no arranca, se arregla lo justo para que
  arranque, y anotas que hubo que hacerlo y en cuántos turnos.
* **Cuando estas instrucciones dicen "anota", el que anota eres tú**, el
  alumno. El agente escribe los archivos; los números que no puede medir
  —lo que costó, el reloj, las veces que te hizo volver atrás— los cuentas tú y
  se los dictas.
* **El encargo no se toca.** Ni una palabra, ni "para que quede mejor".
* **Todo número sale de una medición tuya.** Si no lo mediste, escribe "sin
  medir". Vale decirlo; no vale inventarlo.
* **Nada de claves en el chat ni en el repositorio.** Hoy la app no necesita
  ninguna clave de servicio; si el agente crea un `.env.local`, va al
  `.gitignore` y no se imprime en el chat.

---

# FASES

## Fase 1.1 — Entorno, cómo se paga y modo de aprobación

**Prompt sugerido:** "Ejecuta la Fase 1.1 de `Ed5_sesion1.md`."

### Qué se construye

La fotografía de tu punto de partida: qué herramientas tienes y en qué
versión, cómo estás pagando, y **qué le vas a dejar hacer al agente sin
preguntarte**. Todavía no se genera nada.

### Depende de

Prompt 0 (terreno verificado).

### Archivos

| Archivo | Rol |
|---|---|
| `docs/00-ANTES.md` | **Nuevo.** Tu "antes". Hoy nace con tres secciones: entorno, cómo pago, y el modo de aprobación elegido con su riesgo. Las secciones de factura y daños se agregan en la 1.3. |

### Reglas

* La tabla de entorno lleva **lo que imprime tu máquina**, no lo que diga este
  documento: una fila por herramienta, con el comando y su salida.
* **Cómo se paga** se escribe en dos líneas tuyas: qué tienes contratado y qué
  pasa cuando se agota. Un plan tiene techo de uso; el saldo de API tiene techo
  de dinero. Saber cuál de los dos te va a frenar es el punto.
* **Localiza aquí el comando de costo de tu versión** (en Claude Code es
  `/cost`), pruébalo y anota en esa misma sección cómo se llama y qué imprime.
  Lo vas a usar al cerrar la Fase 1.2 y durante toda la sesión 3: no conviene
  descubrirlo con el reloj corriendo. Si tu versión no lo tiene, anota la
  página de consumo de tu cuenta como alternativa.
* **El modo de aprobación lo eliges tú, no el agente.** Lista los modos que
  ofrece tu instalación, ordénalos de "pregunta por todo" a "actúa sin
  preguntar", y escribe en una línea **qué podría hacer el agente en el modo
  que elegiste que no quisieras que haga**. Si no se te ocurre nada, no has
  entendido el modo.
* Sobre modelos, hoy solo se escribe el **criterio**, no una elección: ¿cuándo
  vale pagar más por capacidad? Cuando el error cuesta más que el modelo (una
  migración de base de datos, un cambio de arquitectura) frente a cuando no
  (renombrar, documentar, boilerplate). La elección medida es la sesión 3.
* No se instala nada que no sea un requisito. Si falta una herramienta, se
  instala y se anota; no se "aprovecha" para poner otras.

### Cómo verificar al terminar

1. `docs/00-ANTES.md` existe y su tabla de entorno tiene una fila por
   herramienta **con la salida real** del comando.
2. En el archivo está escrito el modo de aprobación elegido **y** una frase
   concreta de qué riesgo aceptaste con él.
3. Nada de lo anterior contiene una clave, un token ni una contraseña.

## Fase 1.2 — Generar MercadoTech Lite

**Prompt sugerido:** "Ejecuta la Fase 1.2 de `Ed5_sesion1.md`."

### Qué se construye

La app. Un solo encargo, en prosa, y el agente trabajando sin reglas, sin
pruebas y sin que nadie revise lo que escribe. Es el "antes" en estado puro.

### Depende de

1.1. Carpeta vacía. Nada que instalar: la base de datos es un archivo del
propio proyecto.

### Archivos

| Archivo | Rol |
|---|---|
| `doc_sesions/sesion1/ENCARGO_LITE.md` §1 | **El texto que pegas, tal cual.** No es un resumen: es el encargo. |
| todo el proyecto | Lo genera el agente. Qué archivos cree y cómo los organice **es su decisión**, y es precisamente lo que vamos a estudiar. |
| `docs/00-ANTES.md` | Al terminar, el alumno le dicta al agente los cuatro datos de la sección FACTURA (costo, duración, turnos de corrección, aprobaciones) y el agente los escribe. |

### Reglas

* **El encargo se pega una vez, completo y sin cambios.** Si el agente pregunta
  algo, contesta lo mínimo para que siga; no le des convenciones, ni capas, ni
  nombres de carpetas. Anota cuántas veces preguntó.
* **No revises el código mientras trabaja.** Mirar está bien; corregir, no.
* **No le pidas pruebas.** Si las escribe por su cuenta, anótalo: es un dato
  interesante y poco frecuente.
* Si no arranca, se arregla **lo justo para que arranque**, y se anota qué hizo
  falta y en cuántos turnos. Eso también es parte de la medición.
* **El costo lo mides tú, y se lo dictas al agente.** Antes de cerrar la
  conversación, mira lo que costó (`/cost` en Claude Code; si tu versión no lo
  tiene, la página de consumo de tu cuenta) y pásale el número. El agente no
  puede saber lo que costó su propia conversación: si se lo preguntas sin
  dárselo, se lo inventa. Y después de cerrar el chat, el dato se recupera mal.
* **Los dos números que solo tú puedes contar:** cuántas veces te pidió
  aprobación y cuántas veces tuviste que corregirlo o recordarle algo. Llévalos
  a mano mientras trabaja; van a la FACTURA.

### Cómo verificar al terminar

1. `npm run dev` arranca y el catálogo muestra los ~12 productos de ejemplo.
2. Se puede entrar al detalle de un producto, agregarlo al carrito y terminar
   la compra; el pedido queda registrado y el stock baja.
3. El registro e inicio de sesión funcionan con un usuario creado por ti.
4. En `docs/00-ANTES.md` están el costo de la conversación y la duración real.
5. **No** hay filtro por categoría (si lo hay, anótalo: la tarea patrón de la
   1.4 cambia de enunciado y hay que avisar al docente).

## Fase 1.3 — La factura y el inventario de daños

**Prompt sugerido:** "Ejecuta la Fase 1.3 de `Ed5_sesion1.md`."

### Qué se construye

Las dos listas que convierten la sesión en una medición: lo que costó, y lo que
quedó mal. Aquí es donde la sesión 1 deja de ser "una demo que funciona".

### Depende de

1.2. **Conversación nueva**: el que auditó no debe ser el mismo turno que
escribió el código (es, en pequeño, la lección de la sesión 5).

### Archivos

| Archivo | Rol |
|---|---|
| `docs/00-ANTES.md` | Se le agregan dos secciones: **la factura** (costo, duración, turnos, cuántas veces te pidió aprobación) y **el inventario de daños** (los 4 defectos, con la evidencia de cada uno). |

### Reglas

* **Los cuatro defectos se comprueban con los greps de
  `ENCARGO_LITE.md` §3, no a ojo.** Cada fila del inventario lleva el comando
  y su salida: así mañana puedes demostrar que estaba, y en la sesión 5 el
  subagente revisor tendrá con qué compararse.
* **Se anota, no se arregla.** Ninguna de las cuatro filas se corrige hoy.
* Si un defecto **no** apareció, se escribe que no apareció. Es un dato, no un
  fracaso: significa que el agente tomó una buena decisión por su cuenta, y
  conviene saber cuál.
* Si encuentras un quinto problema que no está en la lista, agrégalo con su
  evidencia. La lista de cuatro es el mínimo, no el máximo.
* La factura lleva **las cuatro cifras que puedas medir** y "sin medir" en las
  que no. Una factura con huecos honestos es útil; una inventada, no.

### Cómo verificar al terminar

1. `docs/00-ANTES.md` tiene las cuatro secciones completas: entorno, cómo
   pago, factura, inventario.
2. Cada fila del inventario tiene **comando y salida**, no una opinión.
3. El código de la app **no cambió** en esta fase: `git status` no muestra
   modificaciones fuera de `docs/`.

## Fase 1.4 — La tarea patrón, primera corrida

**Prompt sugerido:** "Ejecuta la Fase 1.4 de `Ed5_sesion1.md`."

### Qué se construye

La primera de tres corridas de la misma tarea. Hoy, sin reglas. En la sesión 2
la repetirás con tu `CLAUDE.md` puesto, y en la 3 con la configuración que
elijas. Las tres filas juntas son el resultado del curso.

### Depende de

1.2 (la app existe). **Conversación nueva**: si se ejecuta en el mismo hilo que
la generación, el agente ya tiene todo el contexto y la comparación miente.

### Archivos

| Archivo | Rol |
|---|---|
| `doc_sesions/sesion1/TAREA_PATRON.md` §1 | **El enunciado que pegas, tal cual.** No se cambia ni una palabra entre las tres corridas. |
| `docs/MEDICIONES.md` | **Nuevo.** La tabla de tres filas de `TAREA_PATRON.md` §3, con la primera llena. |

### Reglas

* **Conversación nueva, enunciado literal.** Las dos cosas, o la medición no
  sirve.
* Se recorren los **5 pasos de verificación** de `TAREA_PATRON.md` §2 sin abrir
  un archivo. El paso 3 (recargar y ver si el filtro sigue) y el 4 (abrir la
  URL en otra pestaña) son los que distinguen las corridas.
* De los **seis datos** de `TAREA_PATRON.md` §3, **cuatro los mides tú** y se
  los dictas (resultado, turnos de corrección, costo y duración); los otros dos
  los pone el agente (dónde quedó el estado del filtro y en qué archivo). El
  primero de esos dos lo confirmas tú **mirando la barra de direcciones**, no
  el código.
* Si hubo que corregir al agente, se cuentan los turnos. Ese número es la mitad
  del valor de la medición.
* Si el reloj aprieta, **esta es la única fase que puede quedar para casa**.

### Cómo verificar al terminar

1. Los 5 pasos de `TAREA_PATRON.md` §2 se recorren y su resultado está en
   `docs/MEDICIONES.md`.
2. La primera fila de la tabla tiene los seis datos, o "sin medir" donde
   corresponda.
3. `git log --oneline` muestra un commit por fase de hoy.

---

## Si algo falla

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| El agente propone usar una base de datos en la nube, o pide que crees una cuenta | No leyó la restricción del encargo, o la "mejoró" por su cuenta | Recuérdale la frase del encargo: la base es un archivo SQLite dentro del proyecto. **Anota que hizo falta recordárselo**: es un dato de la medición |
| `Error: Cannot find module` al arrancar, con el nombre de un paquete de base de datos | Instaló la librería de SQLite pero no terminó el `npm install`, o la puso en el `package.json` sin instalarla | `npm install` en la carpeta del proyecto y volver a arrancar |
| La app salió **demasiado bien**: capas, constantes, incluso pruebas | Tienes memoria global propia (`~/.claude/CLAUDE.md`) o Skills personales activas | No es un fallo, es el contenido de la sesión 2 adelantándose. Anótalo, y repítelo sin ellas si da el tiempo |
| El agente pidió aprobación en cada paso y la sesión no avanza | Modo de aprobación muy restrictivo para una tarea de generación masiva | Es una lección de la 1.1, no un problema: anótalo, cambia de modo a conciencia y escribe qué riesgo aceptaste |
| El agente hizo algo que no querías (borró, sobrescribió, instaló de más) | Modo de aprobación demasiado permisivo | **Anótalo con detalle: es el mejor material de la sesión 6.** Hoy no hay red de seguridad; en la 6 la pones |
| No encuentro el costo de la conversación | Se cerró antes de anotarlo (decisión 5) | Mira la página de consumo de tu cuenta; si no hay dato por conversación, escribe "sin medir" y anota la duración |
| El catálogo se ve vacío aunque el seed dice que sembró | El archivo de la base se creó en una ruta distinta de la que lee la app, o el seed no llegó a correr | Busca el archivo `.db` o `.sqlite` en el proyecto y pregúntale al agente desde dónde lo lee; es el error más común del día |
| Cualquiera puede entrar a la página de administración y crear productos | Pasó lo que el encargo pedía sin querer ("no te compliques con los permisos") | **No lo arregles: es el defecto 4.** Anótalo con su evidencia. Se cierra en las sesiones 6 y 7 |
| Las contraseñas están guardadas tal cual en la base | Lo mismo: nadie le pidió cifrarlas | **Tampoco se arregla hoy.** Es la otra cara del defecto 4, y en la sesión 5 el subagente revisor debería encontrarlo solo |

## Restricciones de la sesión

* **No se corrige ningún defecto.** Se corrigen entre las sesiones 2 y 7.
* **No se escribe `CLAUDE.md`.** Es el centro de la sesión 2, y escribirlo hoy
  arruina la comparación.
* No se configuran permisos, hooks, Skills ni subagentes (sesiones 4 a 6).
* No se escribe ninguna prueba (sesión 6).
* No se despliega nada: la app corre en tu máquina.
* No se usa ningún proveedor de IA externo en ninguna sesión del curso.

## Entregables

1. La app MercadoTech Lite funcionando en local.
2. `docs/00-ANTES.md` con sus cuatro secciones: entorno, cómo pago, factura,
   inventario de daños (con evidencia por defecto).
3. `docs/MEDICIONES.md` con la primera fila de la tarea patrón.
4. El repositorio `<TU_REPO>` con un commit por fase y todo subido.

## Producto de la sesión

La app funcionando, el costo de haberla hecho y la lista de lo que salió mal.
**Es el "antes" contra el que se mide todo el curso.**

## Criterios de aceptación

* La app arranca y permite el recorrido completo: catálogo → detalle → carrito
  → compra, más registro e inicio de sesión.
* `docs/00-ANTES.md` tiene el modo de aprobación elegido **con el riesgo
  aceptado escrito en una frase**.
* El inventario de daños cubre los cuatro defectos, cada uno con comando y
  salida (o con la constancia de que no apareció).
* La factura tiene las cifras medidas, y "sin medir" donde no se midió.
* `docs/MEDICIONES.md` tiene la primera fila completa.
* Ningún archivo del repositorio contiene una clave, un token ni una
  contraseña.

## Registro de cambios

**<fecha de la edición> — versión 3.** Tres huecos de redacción que un lector
externo encontró al seguir la sesión paso a paso, los tres por escribir en
pasiva lo que requiere un sujeto:

1. **Quién mide el costo.** La spec decía "anota el costo" sin decir quién ni
   con qué comando. Ahora: lo mide el alumno con el comando de costo de su
   versión y se lo **dicta** al agente, porque el agente no puede saber lo que
   costó su propia conversación — si se lo preguntan sin dárselo, lo inventa.
   La Fase 1.1 pasa a localizar ese comando, para no descubrirlo con el reloj
   corriendo.
2. **Quién anota los turnos.** Igual: los dos números que solo el alumno puede
   contar (turnos de corrección y veces que el agente pidió aprobación) ahora
   dicen explícitamente que los lleva él y los dicta. Y se agregó una
   convención transversal: *cuando estas instrucciones dicen "anota", el que
   anota es el alumno*.
3. **La Fase 1.3 va en conversación nueva**, y ahora lo dice en la fase y en el
   prompt, no solo en la regla general del archivo de prompts. El motivo
   también está escrito: el que auditó no debe ser el mismo turno que escribió
   el código.

Además, las fases **1.2 y 1.4** se reescribieron como **dos pasos explícitos**
dentro de un mismo chat (qué pega el alumno, cuándo, y qué hace mientras el
agente trabaja), y el archivo de prompts abre con una tabla de *quién mide qué*.

**<fecha de la edición> — versión 2.** Se quitó Supabase del encargo: la app
guarda sus datos en SQLite dentro del proyecto (decisión 6). Motivo: la
versión 1 exigía la CLI de Supabase y Docker Desktop corriendo, y eso no estaba
en "Antes de empezar" —solo en "Estado de partida"—, así que el alumno llegaba
a clase sin haberlo instalado. En una clase de 2 h, instalar Docker en Windows
puede dejar a parte del grupo fuera de la sesión entera. El defecto 4 se
reformuló (página de administración sin control, contraseñas en claro o sesión
decidida en el navegador) y con eso pasa a cerrarse en las sesiones 6 y 7, no
solo en la 7.

**<fecha de la edición> — versión 1.** Primera sesión escrita para la Ed. 5,
como piloto del formato (Fase P.4 de `PLAN_ED5.md`). Se añadió la Fase 1.4 (la
tarea patrón), que el plan preveía en tres fases: sin ella la medición del
curso arrancaba en la sesión 2 y perdía su punto de partida.
