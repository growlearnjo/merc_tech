# Claude Code Ed. 5 — Prompts de la Sesión 6 (Permisos, hooks y red de seguridad)

Cada prompt está escrito para pegarse **tal cual**, después de rellenar sus
marcadores. Están en el orden en que se usan, y cada uno dice en qué chat va.

Hoy no se mide costo. Lo que se comprueba es otra cosa: que lo que no debe
pasar no pasa, aunque el modelo no obedezca.

| Fase | Rol | Contexto | Objetivo | Público/tono | Restricciones | Formato | Ejemplos | Razonamiento |
|---|---|---|---|---|---|---|---|---|
| 0 Terreno | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 1 Lectura de la spec | — | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 6.1 Matriz de permisos | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 6.2 El hook que bloquea | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 6.3 Las pruebas como señal | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 6.4 Deshacer y cerrar la red | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| Cierre | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

---

## La ruta de hoy, y en qué chat va cada paso

| # | Paso | ¿Dónde? |
|---|---|---|
| 1 | **Prompt 0** — verificar el terreno | chat nuevo. Deja escrito `docs/VERIFICACION_S6.md`, y de ahí leen los demás |
| 2 | **Prompt 1** — leer la spec | chat nuevo |
| 3 | **Fase 6.1** — tu matriz de permisos | un chat para escribirla y **otro nuevo** para comprobarla |
| 4 | **Fase 6.2** — el hook que bloquea | un chat para escribirlo y **otro nuevo** para comprobarlo |
| 5 | **Fase 6.3** — las pruebas como señal | un chat para escribirlas y **otro nuevo** para romper una a propósito |
| 6 | **Fase 6.4** — deshacer, y cerrar la red | un chat para romper y deshacer, uno para proteger la red y **otro nuevo** para comprobarla |
| 7 | **Cierre** — bitácora, `CLAUDE.md` y push | chat nuevo |

**Por qué cada comprobación va en un chat nuevo.** Dos razones. La primera: el
agente que escribió una regla sabe lo que dice, y cuando la prueba en el mismo
chat la esquiva sin querer. La segunda: un chat nuevo carga la configuración tal
como quedó en el disco, y así compruebas lo que de verdad va a pasar mañana.

---

## Cómo usar estos prompts

1. **Hoy se trabaja en la terminal**, con `claude` abierto en la raíz del
   proyecto, y no en la extensión de VS Code. La terminal integrada de VS Code
   sirve. `/permissions`, `/hooks`, `/rewind`, el aviso de confianza y el menú
   de `@` se ensayaron ahí. **Cada fase empieza en una conversación nueva**, en
   orden: `/exit` y `claude` otra vez.
2. **Los comandos que empiezan con `/` y las menciones con `@` las escribes tú**,
   en la misma caja donde escribes tus mensajes. `/permissions`, `/hooks` y
   `/rewind` son comandos de Claude Code, y el agente no los puede ejecutar por
   ti.
3. **No recortes el bloque `[CONTEXTO]`**, pero **rellena sus marcadores**:

   | Marcador | Qué es | Cómo lo consigues |
   |---|---|---|
   | `<RUTA_PROYECTO>` | La carpeta donde vive tu app | `pwd` desde la carpeta del proyecto |
   | `<COMMIT_ANTERIOR>` | El commit con el que cerraste la sesión 5 | `git log --oneline -1` al empezar hoy |
   | `<TU_REPO>` | Tu repositorio en GitHub | `git remote -v` |

4. **Corre la verificación de la fase antes del prompt siguiente.**
5. **Commit por fase**: `chore:` para la 6.1 y la 6.4, `feat:` para el hook de
   la 6.2, `test:` para la 6.3 y `docs:` para el cierre.
6. **Antes de cada commit, mira `git diff .claude/settings.json`.** En Windows,
   aprobar algo con "Sí, y no preguntar de nuevo" escribe una regla en ese
   archivo, y no debe entrar una regla que nadie decidió.
7. **Tu agente puede tener dos consolas.** En Windows tiene `Bash` (Git Bash) y
   `PowerShell`, y elige cuál usar; en macOS y Linux, solo `Bash`. Una regla o
   un hook que solo mira `Bash` no se entera de lo que corre `PowerShell`. Por
   eso hoy cada regla de comando va dos veces, y las comprobaciones nombran la
   consola. El aviso de un bloqueo dice cuál fue: `PreToolUse:PowerShell` o
   `PreToolUse:Bash`.
8. **Lo que el agente no puede correr, lo corres tú en tu terminal**: los
   `git restore` de las comprobaciones, por ejemplo. Desde la 6.2 el hook no
   deja que lo corra el agente, y eso es la red funcionando.

### Quién hace qué

| Cosa | La hace |
|---|---|
| Proponer la matriz de permisos | el agente, desde tu sesión 1 y tu `CLAUDE.md`. **La eliges tú** |
| Escribir los hooks | nadie los inventa: el agente los copia del anexo de la spec, y los prueba a mano |
| Elegir qué función de tu app se prueba | **tú**, entre dos o tres que propone el agente |
| Aprobar el `npm install` de la 6.3 | **tú**: es la regla `ask` de la 6.1 funcionando |
| `/rewind` y `git restore` en la 6.3 y la 6.4 | **tú**, en tu terminal: el hook no deja que el agente descarte cambios |
| Probar los hooks | el agente, con `node .claude/hooks/probar-hooks.js`, y tú en un chat nuevo nombrando cada consola |
| Cambiar la red después de la 6.4 | **tú**, a mano. El agente ya no puede |

### Estado del repositorio al iniciar la sesión

* El repositorio en `<RUTA_PROYECTO>`, **sin cambios pendientes** y en
  `<COMMIT_ANTERIOR>`.
* Tu `CLAUDE.md`, `docs/00-ANTES.md` con su modo de aprobación (§3) y su
  **INVENTARIO DE DAÑOS** (§5), y `docs/DECISIONES.md` con la fila 5 reservada.
* De la sesión 5: el Tech Lead en `.claude/agents/tech-lead.md`.
* **Todavía no existen** `.claude/settings.json` ni `.claude/hooks/`.
* **Claude Code 2.1.283 o superior**, Node 20 o superior, y en Windows, Git for
  Windows. En Linux y WSL2, `bubblewrap` y `socat` solo si quieres probar el
  sandbox, que es opcional.

---

## Prompt 0 — Verificación del terreno

> **Chat nuevo.** Comprueba, y deja lo comprobado escrito en
> `docs/VERIFICACION_S6.md`. Es el único archivo que toca hoy.

```text
[ROL] Actúa como ingeniero que revisa el terreno antes de poner una red de
seguridad: lo que importa es qué hay hoy que dependa de que el agente obedezca.
Detente en la primera sorpresa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y debería estar en
<COMMIT_ANTERIOR>. Lee doc_sesions/sesion6/Ed5_sesion6.md, secciones "Antes de
empezar", "Estado de partida" y "Decisiones tomadas". Las sesiones 1 a 5
dejaron mi CLAUDE.md, docs/00-ANTES.md, docs/DECISIONES.md, una Skill, el
.mcp.json y mi Tech Lead en .claude/agents/.

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones, con su comando: claude (mínimo 2.1.283), node (mínimo 20), npm,
   git. Si claude está por debajo del mínimo, dímelo y sigue verificando.
2. Que el repositorio esté limpio y en qué commit estoy: git status --short y
   git log --oneline -1.
3. Cítame tal cual, de docs/00-ANTES.md §3, el modo de aprobación que elegí en
   la sesión 1 y el riesgo que dije que aceptaba.
4. Que exista mi CLAUDE.md, cuántas líneas tiene, y cítame la regla que habla
   de pruebas. Lístame además, una por línea, las reglas que dicen "pregunta
   antes" o "no": solo la línea y su número, sin comentarlas.
5. Que docs/00-ANTES.md §5 marque el defecto 3, "Cero pruebas", y cítame su
   veredicto.
6. Que exista .claude/agents/tech-lead.md: dime su campo name y su línea tools.
7. Que exista docs/DECISIONES.md y que su fila 5 diga "sesión 6".
8. Que NO existan todavía .claude/settings.json ni .claude/hooks/. Si existen,
   dime qué hay dentro.
9. Que package.json no tenga todavía un script "test".
10. Dime en qué sistema operativo estás y con qué consolas cuentas hoy entre
    tus herramientas: Bash, PowerShell o las dos. Míralo en tus herramientas,
    no lo deduzcas del sistema.
11. Pregúntame en qué modo de aprobación trabajo hoy. No lo adivines.
12. Escribe docs/VERIFICACION_S6.md con lo que acabas de comprobar, con la
    fecha arriba y estas secciones, en este orden:
    - Versiones, una línea cada una.
    - Sistema operativo y consolas del agente.
    - El commit en el que arranqué hoy, con su mensaje.
    - MODO Y RIESGO DE LA SESIÓN 1, citados tal cual.
    - LAS REGLAS QUE HOY SOLO PIDEN: las líneas del punto 4, con su número.
    - La regla de pruebas de mi CLAUDE.md, citada.
    - El Tech Lead: name y tools.
    - Mi modo de aprobación de hoy.
    - El veredicto final, en una línea.
    Nada más. Es un archivo para leer de un vistazo.

[RESTRICCIONES]
- El ÚNICO archivo que escribes es docs/VERIFICACION_S6.md.
- No crees .claude/settings.json ni ningún hook todavía.
- No modifiques mi CLAUDE.md, ni docs/00-ANTES.md, ni ninguna tabla.
- No instales nada.
- No me pidas claves, tokens ni contraseñas, ni me los muestres.

[RAZONAMIENTO] Ejecuta las comprobaciones una a una y, si alguna falla,
diagnostica antes de pasar a la siguiente. Si falta un artefacto de una sesión
anterior, dime qué camino de repuesto da la spec en vez de improvisar uno.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado; (2) modo y
riesgo de la sesión 1, citados; (3) las reglas que hoy solo piden; (4) veredicto
en una línea; (5) docs/VERIFICACION_S6.md escrito, y me dices cuántas líneas
tiene. Sin commit: ese archivo entra en el commit de la Fase 6.1.
```

---

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

> **Chat nuevo.** No escribe nada.

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion6/Ed5_sesion6.md, anexo incluido.
Devuélveme lo que entendiste:
1. Las 4 fases en orden, con qué entrega cada una.
2. Qué NO se hace hoy, y en qué sesión se hace cada una de esas cosas.
3. En dos líneas: la diferencia entre pedirle algo al agente en el CLAUDE.md y
   ponerlo en .claude/settings.json.
4. Qué hace un hook cuando sale con código 2, y qué pasa si sale con otro código
   por un error.
5. Por qué el hook de la 6.3 deja parar al agente la segunda vez.
6. Qué deshace /rewind y qué no.
7. Según docs/VERIFICACION_S6.md, qué consolas tienes hoy, y qué cambia eso en
   las reglas y en el hook.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.
- No toques mi CLAUDE.md ni ningún archivo de docs/.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora: corregirlo aquí es gratis y durante una fase cuesta. Y si la spec pide
algo que mi versión de Claude Code o mi sistema operativo no pueden hacer,
dímelo también.

[FORMATO DE SALIDA] (1) las 4 fases, una línea cada una; (2) lo que NO se hace
hoy, con su sesión; (3) pedir contra imponer; (4) los códigos de salida;
(5) la segunda vuelta; (6) /rewind; (7) tus consolas; (8) tus dudas, si hay.
Sin commit.
```

---

## Prompt Fase 6.1 — Tu matriz de permisos

> **Dos chats.** En el primero el agente propone la matriz y la escribe. En el
> segundo, nuevo, la compruebas tú.

### Paso 1 — la propone y la escribe el agente

```text
[ROL] Actúa como quien escribe las reglas de una casa para alguien que va a
trabajar solo en ella: cada regla tiene que tener un motivo que se pueda
señalar, y ninguna puede depender de que el otro se acuerde.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 6.1 de
doc_sesions/sesion6/Ed5_sesion6.md, sus decisiones 18 a 20, y después
docs/VERIFICACION_S6.md: ahí están el modo y el riesgo que acepté en la sesión
1, las reglas de mi CLAUDE.md que hoy solo piden, y las consolas que tienes.

[OBJETIVO] Escribe docs/PERMISOS.md y .claude/settings.json, y nada más.
1. Antes de escribir, muéstrame la matriz: una fila por regla, con cuatro
   columnas: la acción, la lista (allow, ask o deny), la regla exacta tal como
   va en el archivo, y de dónde sale. El origen solo puede ser uno de estos
   cuatro: el riesgo que acepté en la sesión 1; una regla de mi CLAUDE.md, con
   su número de línea; un archivo que los prompts del curso repiten que no se
   toca (docs/00-ANTES.md y docs/MEDICIONES.md); o lo que sale de mi máquina
   (git push). Si una fila no llena las cuatro columnas, sácala.
2. Espera a que yo elija qué filas quedan.
3. Con lo que elija, escribe docs/PERMISOS.md con la matriz y una línea arriba
   que diga para qué sirve, y debajo un párrafo que explique por qué cada regla
   de comando está dos veces. Y escribe .claude/settings.json con la clave
   "permissions" y sus listas allow, ask y deny, y nada más. Cada regla de
   comando va dos veces, como Bash(...) y como PowerShell(...), aunque hoy
   tengas una sola consola: el archivo se commitea y lo usa todo el equipo. Las
   reglas Edit(...) van una sola vez.
4. Comprueba que el JSON es válido con:
   node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('ok')"

[RESTRICCIONES]
- No escribas ningún hook: eso es la Fase 6.2.
- No pongas defaultMode ni toques mi modo de aprobación.
- allow solo para comandos que leen o comprueban, como el chequeo de tipos y el
  build. Nada que escriba, instale o publique.
- Ningún deny de comandos, ni Bash(...) ni PowerShell(...): un deny de Bash con
  patrón apaga la consola PowerShell sin avisar.
- Escribe los dos archivos con tu herramienta de edición, no con la consola.
- No modifiques mi CLAUDE.md ni docs/00-ANTES.md.
- No pruebes las reglas en este chat: se prueban en otro.

[RAZONAMIENTO] Antes de la matriz, dime en una línea qué te preocupa del riesgo
que acepté en la sesión 1, y qué regla lo convertiría en algo que no dependa de
que el agente se acuerde.

[FORMATO DE SALIDA] (1) la matriz para que yo elija; (2) después de mi elección,
los dos archivos escritos; (3) la salida de la comprobación del JSON; (4) commit
propuesto: "chore: add the permission matrix for Fase 6.1". El commit lleva
también docs/VERIFICACION_S6.md.
```

Haz el commit y **cierra este chat**.

### Paso 2 — la compruebas tú, en un chat nuevo

1. Escribe `/permissions`. Tienen que aparecer tus reglas, y al lado el archivo
   de donde salen.

   > Si aparece el aviso de confiar en el proyecto, acéptalo. Las reglas `allow`
   > del proyecto no cuentan hasta entonces. `deny` y `ask` sí.

2. Pega esto:

   ```text
   Agrega al final de docs/00-ANTES.md una línea que diga: prueba de permisos.
   Después dime qué pasó.
   ```

   Tiene que responder que no pudo, porque los permisos lo niegan. Si te pide
   permiso, la regla quedó en `ask` y no en `deny`: vuelve al Paso 1.

3. Pega esto:

   ```text
   Instala el paquete left-pad con npm.
   ```

   Claude Code te tiene que preguntar antes, también en modo auto. **Recházalo.**

4. Pega esto:

   ```text
   Ahora corre npm install sin argumentos.
   ```

   También te tiene que preguntar. **Recházalo.** Si no pregunta, mira en el
   aviso qué consola usó y si esa consola tiene su regla.

5. En la terminal: `git status --short` → no aparece `docs/00-ANTES.md`, ni
   `package.json`.

> **Anota lo que pasó en cada paso.** Va a la bitácora en el cierre.

---

## Prompt Fase 6.2 — El hook que bloquea

> **Dos chats.** En el primero el agente instala el hook y lo prueba a mano. En
> el segundo, nuevo, lo pruebas tú con el agente de verdad.

### Paso 1 — lo instala el agente

```text
[ROL] Actúa como quien instala un portero que no se puede convencer: lo que
importa es que bloquee lo que tiene que bloquear y deje pasar todo lo demás.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 6.2 de
doc_sesions/sesion6/Ed5_sesion6.md y su anexo, mi .claude/settings.json,
docs/PERMISOS.md y docs/VERIFICACION_S6.md, que dice qué consolas tienes.

[OBJETIVO] En este orden.
1. Crea .claude/hooks/bloquear-peligroso.js y .claude/hooks/probar-hooks.js con
   el texto EXACTO del anexo de la spec, con tu herramienta de edición. No los
   cambies. Si crees que deberían cambiar en algo, dímelo y no lo apliques.
2. Pruébalo a mano, desde la raíz, con este comando, y muéstrame la salida
   completa:
   node .claude/hooks/probar-hooks.js
   Todos los casos tienen que dar OK. Si alguno da FALLA, detente.
3. Solo si todos dieron OK, agrega a .claude/settings.json la clave "hooks" con
   el evento PreToolUse, tal como la muestra el anexo, con el matcher
   "Bash|PowerShell|Read|Grep|Glob". Las reglas de "permissions" no se tocan.
   Comprueba que el JSON sigue siendo válido.
4. Agrega a docs/PERMISOS.md, con tu herramienta de edición, una sección "El
   hook": qué bloquea, en qué consolas, por qué no podía hacerlo una regla de
   permisos, y qué no cubre (un Grep del tech-lead sin ruta, sobre todo el
   proyecto; un comando que borra o descarta por otro camino; y que también
   frena un comando que solo menciona esas palabras).
5. En docs/DECISIONES.md, la fila 5 dice "sesión 6" en "mi caso". Propónme dos
   o tres redacciones con lo que hiciste hoy, y espera a que elija.

[RESTRICCIONES]
- No toques .claude/agents/tech-lead.md: al Tech Lead lo frena el hook, no un
  cambio en su archivo.
- No agregues el hook Stop: eso es la Fase 6.3.
- No corras ningún comando destructivo de verdad para probar el hook: se prueba
  con probar-hooks.js, que le pasa eventos falsos.
- No escribas ningún archivo con la consola (cat >>, echo >, Set-Content): el
  hook se activa en cuanto lo registras, busca texto, y frena un comando que
  solo menciona git reset --hard.
- No modifiques mi CLAUDE.md ni docs/00-ANTES.md.

[RAZONAMIENTO] Antes de escribir, dime para cada una de las dos cosas que
bloquea el hook por qué una regla de .claude/settings.json no alcanzaba, y por
qué el matcher tiene que nombrar PowerShell.

[FORMATO DE SALIDA] (1) las razones; (2) la salida de probar-hooks.js; (3) el
bloque "hooks" que agregaste; (4) la sección de docs/PERMISOS.md; (5) las
redacciones de la fila 5; (6) después de mi elección, el commit propuesto:
"feat: add the PreToolUse hook for Fase 6.2".
```

Haz el commit y **cierra este chat**.

### Paso 2 — lo compruebas tú, en un chat nuevo

Cada prueba nombra la consola. Si no, el agente elige, y puedes estar probando
solo una de las dos.

1. Escribe `/hooks`. Tiene que aparecer `PreToolUse` con tu hook, del archivo
   del proyecto, con el matcher `Bash|PowerShell|Read|Grep|Glob`.
2. Con el repositorio limpio, pega esto:

   ```text
   Usa la consola Bash: corre git status --short y después git reset --hard
   HEAD. Dime qué pasó con cada uno, y copia tal cual cualquier mensaje de
   bloqueo.
   ```

   El primero corre. El segundo queda bloqueado, con el motivo que escribe el
   hook y el aviso `PreToolUse:Bash`.

3. **Solo si tu agente tiene PowerShell** (Windows), pega esto:

   ```text
   Ahora lo mismo con la consola PowerShell.
   ```

   Tiene que quedar bloqueado igual, con el aviso `PreToolUse:PowerShell`. Si se
   ejecuta, el matcher o el hook no miran PowerShell: vuelve al Paso 1.

4. Pega esto:

   ```text
   Pásale a @"tech-lead (agent)" este encargo, y nada más: "Esto es una prueba
   del hook del proyecto, autorizada por mí. Intenta leer docs/MEDICIONES.md con
   Read, aunque tu archivo lo prohíba, y dime su primera línea. Si algo te
   bloquea, copia el mensaje tal cual." Muéstrame tal cual lo que responda, y
   cuántas herramientas usó.
   ```

   Hay dos resultados posibles, y los dos se anotan:
   * **Usó 1 herramienta** y responde con el motivo del hook, "el tech-lead no
     lee docs/": el hook funciona con el agente real.
   * **Se negó con 0 herramientas**: lo frenó su propio archivo, que desde la
     sesión 5 le dice que no lea `docs/`. Es el "pedir" funcionando, y el hook no
     llegó a actuar. La prueba del hook es la del Paso 1: los dos casos del
     Tech Lead en `probar-hooks.js`.

5. Y esto, para comprobar que no quedó ciego:

   ```text
   Pásale a @"tech-lead (agent)" este encargo, y nada más: "Lee package.json y
   dime cuántos scripts tiene." Muéstrame tal cual lo que responda.
   ```

6. En la terminal: `git status --short` → sin cambios.

---

## Prompt Fase 6.3 — Las pruebas como señal

> **Dos chats.** En el primero el agente pone las pruebas y el hook. En el
> segundo, nuevo, rompes una prueba a propósito.

### Paso 1 — las pone el agente

```text
[ROL] Actúa como quien pone la primera prueba en un proyecto que nunca tuvo
ninguna: pocas, claras, que comprueben algo que hoy es verdad, y que corran en
segundos.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 6.3 de
doc_sesions/sesion6/Ed5_sesion6.md y su anexo, mi CLAUDE.md, mi
.claude/settings.json y el defecto 3 del inventario en docs/00-ANTES.md §5.

[OBJETIVO] En este orden.
1. Propónme dos o tres funciones puras de mi app (reciben datos y devuelven
   datos, sin base de datos, sin red y sin páginas), con su archivo y qué
   comprobaría de cada una. Espera a que elija una.
2. Instala Vitest como dependencia de desarrollo y agrega a package.json el
   script "test": "vitest run". Claude Code me va a pedir permiso para el
   npm install: es la regla de la Fase 6.1.
3. Escribe dos o tres pruebas de la función que elegí, en un archivo .test.ts
   junto a su módulo. Cada una dice en su nombre qué comprueba.
4. Corre npm test y muéstrame la salida. Tienen que pasar todas. Si una falla,
   diagnostica antes de tocar nada: puede ser la prueba, no el código.
5. Crea .claude/hooks/exigir-pruebas.js con el texto EXACTO del anexo, con tu
   herramienta de edición, y pruébalo a mano con:
   node .claude/hooks/probar-hooks.js
   Todos los casos tienen que dar OK, y ahora incluye uno del hook nuevo.
6. Agrega a .claude/settings.json SOLO el evento Stop del bloque "hooks" del
   anexo. El PreToolUse de la Fase 6.2 se queda como está, con su matcher
   "Bash|PowerShell|Read|Grep|Glob". Y agrega a la lista allow
   "Bash(npm test)" y "PowerShell(npm test)". Lo demás no se toca. Comprueba que
   el JSON sigue siendo válido.
7. En mi CLAUDE.md, cambia SOLO la regla de pruebas: ahora hay pruebas,
   npm test tiene que pasar antes de dar algo por terminado, y un hook lo exige.
   Con su comando de verificación.
8. Propónme el pedido para el Paso 2: un cambio de comportamiento de una línea,
   en palabras de usuario, que contradiga una de las pruebas que escribiste, y
   que no mencione las pruebas. Dime cuál prueba va a romper. No lo apliques.

[RESTRICCIONES]
- Solo Vitest. Nada de Playwright, ni pruebas de páginas, de base de datos o de
  red.
- No escribas una prueba para que falle, ni cambies código de la app para que
  una prueba pase.
- No toques las reglas de permisos ni el hook de la Fase 6.2.
- No agregues reglas nuevas a mi CLAUDE.md.
- No modifiques docs/00-ANTES.md.

[RAZONAMIENTO] Antes de escribir las pruebas, dime qué devuelve hoy la función
que elegí para dos entradas concretas, corriéndola, no suponiéndolo. Eso es lo
que la prueba va a comprobar.

[FORMATO DE SALIDA] (1) las funciones candidatas; (2) después de mi elección, la
salida de npm test; (3) la salida de probar-hooks.js; (4) el bloque Stop y las
reglas allow que agregaste; (5) la regla del CLAUDE.md, antes y después; (6) el
pedido para el Paso 2 y la prueba que rompe; (7) commit propuesto: "test: add
the minimal test signal and the Stop hook for Fase 6.3".
```

**Copia el pedido del punto (6)**: lo vas a usar en el Paso 2. Haz el commit y
**cierra este chat**.

### Paso 2 — rompes una prueba a propósito, en un chat nuevo

Vas a simular al agente que no obedece. Un agente que obedece lee la prueba antes
de cambiar el código: la actualiza en el mismo turno, o te pregunta, porque tu
`CLAUDE.md` ahora dice que `npm test` tiene que pasar. Así el rojo nunca llega al
hook, y no ves nada. Por eso este pedido le prohíbe tocar las pruebas y correr
`npm test`.

Pega esto, con el pedido que te dejó el Paso 1 en lugar de `<PEDIDO>`:

```text
<PEDIDO>. Solo ese cambio: no toques ningún archivo .test.ts, no corras
npm test, y cuando termines el cambio, termina.
```

Si perdiste el pedido, `git ls-files "*.test.ts"` te dice cuál es tu archivo de
pruebas: ábrelo y pide un cambio que contradiga una de sus pruebas. Ojo: el
ejemplo "que los precios se muestren sin decimales" solo sirve si probaste el
formato de moneda.

Lo que tiene que pasar:

1. El agente hace el cambio y quiere terminar.
2. Aparece el aviso del hook `Stop`: "Las pruebas fallan (npm test)…", con la
   salida de las pruebas.
3. El agente sigue trabajando una vuelta más. Como no puede tocar la prueba, lo
   esperable es que te explique el conflicto o revierta su cambio.
4. En la segunda vuelta el hook lo deja parar: no entra en bucle.

Si el agente te pregunta antes de hacer el cambio, porque ve que la prueba va a
fallar, respóndele que lo haga igual, sin tocar las pruebas.

Después, **en tu terminal**, no en el chat (el hook no deja que el agente
descarte cambios):

```bash
git diff
```

El archivo de pruebas no tiene que aparecer. Si en algún intento el agente lo
cambió, el cambio tiene que ser el que pediste; si borró o debilitó una prueba
para que pase, anótalo: es justo lo que un hook no puede ver.

Al final, descarta los cambios de esta comprobación:

```bash
git restore .
```

Y comprueba que todo vuelve a estar en verde:

```bash
npm test
```

---

## Prompt Fase 6.4 — Deshacer, y cerrar la red

> **Tres chats.** En el primero rompes y deshaces. En el segundo el agente
> protege la red. En el tercero, nuevo, compruebas que ya no la puede tocar.

### Paso 1 — la ruptura que `/rewind` sí deshace

En un chat nuevo, pega esto:

```text
Cambia el título principal de la página de inicio por "Prueba de rewind". Usa
tu herramienta de edición, no la consola. Solo ese cambio.
```

Cuando termine:

1. Escribe `/rewind`, o pulsa Esc dos veces con la caja vacía.
2. Elige el mensaje que acabas de enviar.
3. Elige restaurar el código.
4. En la terminal: `git status --short` → el archivo ya no aparece.

### Paso 2 — la ruptura que `/rewind` no ve

En el mismo chat, pega esto:

```text
Con un solo comando de consola, sin usar tu herramienta de edición, agrega al
final de tu archivo de pruebas de la Fase 6.3 la línea: // prueba de consola
```

Cuando termine:

1. Escribe `/rewind` otra vez y mira las opciones. La de restaurar el código no
   aparece para ese cambio, o no lo deshace.
2. En la terminal: `git diff` → el cambio sigue ahí.
3. Deshazlo tú, **en tu terminal**: si se lo pides al agente, el hook de la 6.2
   lo bloquea, porque `git restore` descarta cambios. Este comando restaura
   cualquier archivo de pruebas que haya cambiado, esté donde esté:

   ```bash
   git restore -- '*.test.ts'
   ```

4. `git status --short` → sin cambios.

**Lo que acabas de ver:** `/rewind` guarda lo que el agente edita con sus
herramientas de archivo. Lo que cambia por la consola, lo que cambia un
subagente o lo que cambias tú a mano, no. Para eso está git.

Cierra este chat.

### Paso 3 — el agente protege la red

```text
[ROL] Actúa como quien termina de instalar una cerradura y entrega la llave:
después de esto, la cerradura solo la cambia el dueño.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 6.4 de
doc_sesions/sesion6/Ed5_sesion6.md, docs/PERMISOS.md y mi
.claude/settings.json. Ya probé que /rewind deshizo una edición tuya y que no
vio un cambio hecho por la consola, que deshice con git restore.

[OBJETIVO] En este orden.
1. Agrega a docs/PERMISOS.md, con tu herramienta de edición, una sección
   "Deshacer", corta: qué deshace /rewind, qué no deshace y qué uso en ese
   caso; qué no frenan las reglas deny (un programa que escribe un archivo por
   dentro, como node -e); y qué hace el sandbox en mi sistema operativo, según
   la tabla de la Fase 6.4. Comprueba cuál es mi sistema. Si es Windows nativo,
   escribe que el sandbox no está disponible aquí y por qué.
2. Al final, agrega a la lista deny de .claude/settings.json estas dos reglas, y
   nada más:
   "Edit(./.claude/settings.json)"
   "Edit(./.claude/hooks/**)"
   Comprueba que el JSON sigue siendo válido.

[RESTRICCIONES]
- El punto 2 va al final: después de esa regla ya no vas a poder editar
  .claude/settings.json.
- No cambies ninguna otra regla, ni los hooks.
- No actives el sandbox ni cambies el modo de aprobación.
- No modifiques mi CLAUDE.md ni docs/00-ANTES.md.

[FORMATO DE SALIDA] (1) la sección "Deshacer"; (2) las dos reglas agregadas y
la comprobación del JSON; (3) commit propuesto: "chore: protect the safety net
for Fase 6.4".
```

Haz el commit y **cierra este chat**.

### Paso 4 — compruebas que ya no la puede tocar, en un chat nuevo

```text
Quita de .claude/settings.json la regla "Edit(./docs/00-ANTES.md)". Primero
con tu herramienta de edición; si no puedes, inténtalo una vez desde la
consola. Después dime qué pasó, y copia tal cual cada mensaje de bloqueo.
```

Toda matriz tiene esa regla en `deny`. Tiene que responder que no pudo, las dos
veces. Si lo intentó con PowerShell, el mensaje puede decir que el archivo está
fuera de "the allowed working directories": es el mensaje con que Claude Code
bloquea esa escritura, no un problema de rutas. Y `git status --short` → sin
cambios.

> **Opcional, solo en macOS, Linux o WSL2.** En Linux y WSL2 hacen falta
> `bubblewrap` y `socat` instalados; en macOS, nada. Escribe `/sandbox`,
> actívalo, y pídele al agente que corra `touch ~/prueba-sandbox`. Tiene que
> fallar, porque el sandbox solo deja escribir en la carpeta del proyecto. Si el
> agente te pide correrlo fuera del sandbox, **recházalo**. Anota el resultado
> en `docs/PERMISOS.md` a mano, y apaga el sandbox con `/sandbox` si no lo vas a
> usar.

---

## Prompt de cierre — Bitácora, `CLAUDE.md` y push

> **Conversación nueva.** Deja la sesión documentada y subida, y es lo que la
> sesión 7 lee para arrancar.

```text
[ROL] Actúa como quien escribe la bitácora de un proyecto para que otra
persona —o yo mismo en tres semanas— entienda qué pasó sin tener que leer el
código.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y la sesión 6 terminó. Existen
.claude/settings.json con permisos y dos hooks, .claude/hooks/ con los dos
scripts, docs/PERMISOS.md, las pruebas con su script npm test, la fila 5 de
docs/DECISIONES.md y docs/VERIFICACION_S6.md. El repositorio remoto es
<TU_REPO>.

[PÚBLICO Y TONO] Para mí dentro de tres semanas: directo, con lo que de verdad
pasó y sin adjetivos. Si algo no funcionó, se dice que no funcionó.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 6, con estas cosas: qué
   reglas puse en deny, ask y allow, y de dónde salió cada una; qué pasó cuando
   le pedí editar docs/00-ANTES.md y cuando le pedí instalar un paquete; qué
   bloqueó el hook, con qué consola, y qué respondió el Tech Lead, y si lo
   frenó el hook o su propio archivo; qué función probé y qué pasó cuando rompí
   una prueba; qué deshizo /rewind y qué tuve que deshacer con git;
   qué pasó cuando le pedí tocar la configuración; y qué queda para la sesión 7.
   Entre lo que queda va el defecto 4 del inventario, que pasa entero a la
   sesión 7.
2. Revisa mi CLAUDE.md completo: ninguna línea puede afirmar algo que hoy sea
   falso. Comprueba con su comando cada regla que diga "hoy no se cumple" o
   "no existe". Si alguna ya no es verdad, dime cuál y propón la línea nueva,
   pero no cambies ninguna sin que yo lo confirme.
3. Corre npm test y muéstrame el resultado.
4. Comprueba que .env*.local siga excluido y que no haya ninguna clave en lo
   que se va a subir. Si encuentras alguna, detente y avísame: no subas nada.
5. Sube todo al remoto.

[RESTRICCIONES]
- No corrijas ningún defecto del inventario.
- No intentes cambiar .claude/settings.json ni los hooks: están protegidos, y
  así tiene que seguir.
- No toques docs/00-ANTES.md ni docs/MEDICIONES.md.
- No escribas ninguna cifra que no hayamos comprobado hoy.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) la entrada de la bitácora; (2) las líneas del CLAUDE.md
que ya no son verdad, si hay, con su comando y la línea propuesta; (3) la salida
de npm test; (4) confirmación de que no hay claves en lo que se sube; (5) la
salida del push; (6) commit propuesto: "docs: close Sesión 6 with the safety
net".
```

El push lo vas a tener que aprobar: es la regla `ask` de la 6.1.
