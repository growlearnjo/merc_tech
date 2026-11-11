# Claude Code Ed. 5 — Prompts de la Sesión 1 (Tu app en una sesión)

Cada prompt está construido con los ítems de la rúbrica de prompt engineering
(Rol, Contexto, Objetivo, Público/tono, Restricciones, Formato, Ejemplos,
Razonamiento), incluyendo **solo los pertinentes para cada fase**.

Todos asumen que existe `curso-ed5/Ed5_sesion1.md` (la spec). El prompt la
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

1. **Un prompt por turno, en orden, en conversación nueva** (o tras `/clear`).
   La Fase 1.4 **exige** conversación nueva: si la ejecutas en el mismo hilo
   que la generación, el agente ya tiene el contexto y la medición miente.
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
* El material del curso (`curso-ed5/`) accesible desde la carpeta del proyecto.

---

## Prompt 0 — Verificación del terreno

```text
[ROL] Actúa como ingeniero DevOps que prepara una máquina antes de que empiece
el trabajo: tu única misión es confirmar el terreno y detenerte en la primera
sorpresa.

[CONTEXTO] Voy a empezar la sesión 1 del curso en <RUTA_PROYECTO>. Lee
curso-ed5/Ed5_sesion1.md, secciones "Antes de empezar" y "Estado de partida".
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

[OBJETIVO] Lee completo curso-ed5/Ed5_sesion1.md y también
curso-ed5/ENCARGO_LITE.md y curso-ed5/TAREA_PATRON.md. Devuélveme lo que
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
curso-ed5/Ed5_sesion1.md. El Prompt 0 ya verificó las versiones.

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
> Dos cosas antes de pegarlo:
>
> * **Un reloj.** Anota la hora de inicio.
> * **Nada que instalar antes.** Si el agente propone una base de datos en la
>   nube o te pide crear una cuenta, recuérdale la frase del encargo: la base
>   es un archivo SQLite dentro del proyecto. Y anota que hizo falta
>   recordárselo.
>
> Y tres durante:
>
> * Si pregunta, contesta lo mínimo para que siga; **no le des convenciones**.
>   Cuenta cuántas veces preguntó.
> * **No corrijas el código** mientras trabaja. Mirar sí, corregir no.
> * **Antes de cerrar la conversación, anota el costo.** Después se recupera
>   mal, y es el número que la 1.3 necesita.

Cuando termine, en la MISMA conversación:

```text
[OBJETIVO] Antes de cerrar: dime qué construiste, en qué archivos, y qué
decisiones tomaste que yo no te pedí (estructura de carpetas, dónde pusiste la
lógica de datos, cómo manejaste los permisos de la base de datos, si escribiste
pruebas). Después agrega a docs/00-ANTES.md una sección FACTURA con el costo de
esta conversación, su duración y cuántas veces me pediste aprobación.

[RESTRICCIONES]
- No cambies ni un archivo de la app en este turno: solo informas.
- No arregles nada de lo que me cuentes, aunque te parezca grave.

[FORMATO DE SALIDA] (1) qué construiste y dónde; (2) tus decisiones no
pedidas, en lista; (3) la sección FACTURA escrita; (4) commit propuesto:
"feat: generate MercadoTech Lite for Fase 1.2".
```

## Prompt Fase 1.3 — La factura y el inventario de daños

```text
[ROL] Actúa como auditor que documenta hallazgos con evidencia y NO los
corrige. Tu informe tiene que servirle a otra persona mañana.

[CONTEXTO] Proyecto en <RUTA_PROYECTO>, con MercadoTech Lite ya generada.
Lee la Fase 1.3 de curso-ed5/Ed5_sesion1.md y la sección 3 de
curso-ed5/ENCARGO_LITE.md, que lista los 4 defectos esperados con el grep que
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

Primero pega el enunciado de [`TAREA_PATRON.md`](TAREA_PATRON.md) §1, **tal
cual, sin una palabra más**, y anota la hora. Cuando termine, en la misma
conversación:

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. Acabas de agregar el filtro por
categoría al catálogo. Lee la Fase 1.4 de curso-ed5/Ed5_sesion1.md y la
sección 3 de curso-ed5/TAREA_PATRON.md.

[OBJETIVO] Crea docs/MEDICIONES.md con la tabla de tres filas de TAREA_PATRON
§3 y rellena la primera ("S1 · sin reglas") con los seis datos. Para "dónde
quedó el estado del filtro", dime si vive en el estado del componente, en el
almacenamiento del navegador o en la URL, y en qué archivo lo pusiste.

[RESTRICCIONES]
- No cambies el comportamiento del filtro para que se vea mejor en la tabla.
- Las otras dos filas quedan VACÍAS: son de las sesiones 2 y 3.
- Si no tengo un dato (el costo, por ejemplo), escribe "sin medir". No lo
  estimes.

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
