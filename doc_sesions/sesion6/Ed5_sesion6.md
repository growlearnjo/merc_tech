# Claude Code Ed. 5 — Sesión 6: Permisos, hooks y red de seguridad

## Este documento contiene la especificación completa de la sesión. Léelo completamente antes de ejecutar nada. No hagas suposiciones fuera de lo especificado.

**Prompts de la sesión (ejecutar en orden; versión completa y autocontenida de cada uno en `PROMPTS_sesion6.md`):**

0. "Ejecuta el Prompt 0 de `PROMPTS_sesion6.md`: verifica el terreno."
1. "Lee `Ed5_sesion6.md` completo y confírmame que entiendes el alcance. No ejecutes nada todavía."
2. "Ejecuta la Fase 6.1: escribe mi matriz de permisos."
3. "Ejecuta la Fase 6.2: un hook que bloquea lo peligroso antes de que se ejecute."
4. "Ejecuta la Fase 6.3: las pruebas mínimas y el hook que las exige."
5. "Ejecuta la Fase 6.4: deshacer lo que salió mal, y cerrar la red."
6. "Ejecuta el Prompt de cierre de `PROMPTS_sesion6.md`: bitácora, CLAUDE.md y push."

---

## Objetivo general

El alumno termina con una red de seguridad que no depende de que el modelo
obedezca: reglas de permisos que niegan o preguntan, un hook que bloquea
comandos destructivos y que el Tech Lead lea `docs/`, y un hook que no deja
dar una tarea por terminada si las pruebas fallan. Sabe deshacer lo que salió
mal y sabe qué se puede deshacer y qué no. Y cierra el defecto 3 de su
inventario: su app pasa de cero pruebas a una señal en verde que alguien exige.

## Objetivos específicos

* Convierte el riesgo que aceptó en la sesión 1 y las prohibiciones que los
  prompts repitieron sesión tras sesión en reglas `allow`, `ask` y `deny` de
  `.claude/settings.json`, y comprueba que una regla `deny` frena al agente aunque
  esté en modo auto.
* Escribe un hook `PreToolUse` que bloquea lo que una regla de permisos no
  alcanza a ver, y comprueba que bloquea y que deja pasar lo normal.
* Cierra el hueco que dejó la sesión 5: el Tech Lead ya no puede leer `docs/`,
  aunque intente.
* Agrega las pruebas mínimas a su app y un hook `Stop` que manda al agente de
  vuelta si las rompió.
* Usa `/rewind` para deshacer un cambio del agente, ve el caso que `/rewind` no
  cubre, y lo deshace con git.
* Protege la propia red: el agente no puede editar la configuración ni los
  hooks que lo frenan.
* Llena la fila 5 de su tabla de decisión con un caso suyo.

---

## Qué vas a construir, en palabras simples

Hasta hoy, todo lo que le dijiste al agente fueron **pedidos**. El `CLAUDE.md`
le pide que no agregue dependencias sin preguntar. La Skill le pide que no
guarde nada más en `localStorage`. El Tech Lead tiene escrito que no lea
`docs/`. Y cada prompt del curso repite "no toques `docs/00-ANTES.md`". Todo eso
funciona mientras el modelo obedece. En la sesión 5 lo viste fallar: el Tech
Lead tenía `Read`, y nada le impedía abrir `docs/` salvo su propia obediencia.

Hoy pones cosas que **se cumplen aunque el modelo no quiera**, porque no las
ejecuta el modelo: las ejecuta Claude Code.

1. **Permisos.** Una lista en `.claude/settings.json` que dice qué hace el
   agente solo, qué te pregunta antes y qué no hace nunca.
2. **Hooks.** Programas chicos que Claude Code corre en momentos fijos: antes de
   cada herramienta, o cuando el agente quiere terminar. Si el programa dice que
   no, el agente no puede.
3. **Pruebas.** La señal que un hook puede exigir. Sin pruebas, "terminé" es la
   palabra del agente. Con pruebas y un hook, es un resultado que se comprueba.
4. **Deshacer.** Lo que hacer cuando algo salió mal igual: `/rewind` para lo que
   el agente editó, y git para todo lo demás.

```mermaid
flowchart TD
    A["Lo que el agente quiere hacer"] --> B{"¿Permisos?<br/>.claude/settings.json"}
    B -- deny --> X["No se hace"]
    B -- ask --> P["Te pregunta"]
    B -- allow / modo --> C{"¿Hook PreToolUse?<br/>bloquear-peligroso.js"}
    C -- exit 2 --> X
    C -- exit 0 --> D["Se ejecuta"]
    D --> E["El agente quiere terminar"]
    E --> F{"¿Hook Stop?<br/>exigir-pruebas.js"}
    F -- pruebas en rojo --> G["Sigue trabajando"]
    F -- pruebas en verde --> H["Termina"]
```

## Glosario mínimo

| Término | En una línea |
|---|---|
| **Regla de permisos** | Una línea en `allow`, `ask` o `deny` de `.claude/settings.json` que dice qué hace el agente con una herramienta o un archivo. |
| **`deny`** | No se hace nunca, en ningún modo. Gana a `allow` y a `ask`. |
| **`ask`** | Te pregunta antes, aunque estés en modo auto. |
| **`allow`** | Lo hace sin preguntar. Solo cuenta después de aceptar la confianza del proyecto. |
| **Hook** | Un programa que Claude Code corre en un momento fijo y que puede bloquear lo que el agente iba a hacer. |
| **`PreToolUse`** | El momento justo antes de que el agente use una herramienta. |
| **`Stop`** | El momento en que el agente quiere dar su respuesta por terminada. |
| **Exit 2** | El código de salida con el que un hook dice "no". Lo que el hook escribe en stderr es el motivo que lee el agente. |
| **Checkpoint** | La foto que Claude Code guarda de los archivos que editó, antes de cada mensaje tuyo. |
| **`/rewind`** | El comando que vuelve a un checkpoint: el código, la conversación o los dos. También con Esc dos veces. |
| **Consola del agente** | La herramienta con la que el agente corre comandos. Hay dos: `Bash` (macOS, Linux, y Git Bash en Windows) y `PowerShell` (Windows). En Windows el agente tiene las dos y elige cuál usar. Cada una tiene sus propias reglas de permisos. |
| **Sandbox** | Un aislamiento del sistema operativo para los comandos de consola del agente. Existe en macOS, Linux y WSL2; no en Windows nativo. |

---

## Antes de empezar: tareas humanas

1. **Comprobar la versión de Claude Code**, en el entorno donde vas a trabajar:

   ```bash
   claude --version
   ```

   Tiene que ser 2.1.283 o superior. Si está por debajo: `claude update`.

2. **Saber qué consolas tiene tu agente**, según tu sistema:

   | Sistema | Consolas del agente | Con qué corren los hooks |
   |---|---|---|
   | Windows con Git for Windows (el del curso) | `Bash` (Git Bash) y `PowerShell`. El agente trata a PowerShell como la principal | Git Bash |
   | Windows sin Git Bash | Solo `PowerShell` | PowerShell: ver "Si algo falla" |
   | macOS y Linux | Solo `Bash`. `PowerShell` existe solo si instalas `pwsh` y lo activas con `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` | `sh` |
   | WSL2 | Como Linux | `sh` |

   Git for Windows ya lo tienes desde la sesión 1, porque es el mismo Git. La red
   de hoy vigila las dos consolas, para que funcione en cualquier sistema del
   equipo: `.claude/settings.json` se commitea, y lo usa gente con otros
   sistemas.

3. **Trabajar en la terminal**, con `claude`, y no en la extensión de VS Code.
   Las comprobaciones usan `/permissions`, `/hooks`, `/rewind`, el aviso de
   confianza de la carpeta y el menú de `@`, y el material está escrito y
   ensayado para la terminal. La terminal integrada de VS Code sirve.

4. **Tener internet en la Fase 6.3.** Se instala una dependencia de pruebas con
   `npm`.

5. **Saber en qué modo de aprobación trabajas**, el de la sesión 1. El Prompt 0
   lo lee de tu `docs/00-ANTES.md` §3, junto con el riesgo que aceptaste.

No hace falta crear ninguna cuenta ni ningún token.

## Estado de partida

| Debe existir | Dónde | Lo usa la fase |
|---|---|---|
| El `CLAUDE.md`, con la regla que dice que no hay pruebas | raíz de `<RUTA_PROYECTO>` | 6.1, 6.3 |
| El modo de aprobación de la sesión 1 y el riesgo que aceptaste | `docs/00-ANTES.md` §3 | 6.1 |
| El inventario de daños, con el defecto 3 "Cero pruebas" | `docs/00-ANTES.md` §5 | 6.3 |
| El Tech Lead de la sesión 5 | `.claude/agents/tech-lead.md` | 6.2 |
| La tabla de decisión con la fila 5 reservada | `docs/DECISIONES.md` | 6.2 |
| Que no exista todavía `.claude/settings.json` ni `.claude/hooks/` | `<RUTA_PROYECTO>` | 6.1, 6.2 |
| El repositorio sin cambios pendientes | `<RUTA_PROYECTO>` | toda la sesión |
| Node 20 o superior, y Claude Code 2.1.283 o superior | la máquina del alumno | toda la sesión |

La carpeta de la sesión trae cuatro archivos para el alumno: esta spec, los
prompts, `TAREA_PATRON.md` y `tokens.py`. Los dos últimos son copias idénticas
de las de las sesiones anteriores, para que la carpeta funcione sola. Hoy no se
corre ninguno de los dos.

### Decisiones tomadas al preparar esta sesión

Las decisiones 1 a 17 salen del ensayo del 2026-11-18, con Claude Code real, en
una copia del proyecto de ensayo, sobre Windows. Las 18 a 28 salen del ensayo
del 2026-11-20: el laboratorio completo, corrido como alumno, en la terminal y
en modo auto, con Claude Code 2.1.327 sobre Windows, y comprobado después en una
copia. La documentación oficial se consultó los dos días.

| # | Hallazgo | Resolución | Fase |
|---|---|---|---|
| 1 | El inventario dice que el defecto 4 "se cierra en S6 / S7", y el plan dice que el control de acceso de `/admin` se cierra aquí "con los permisos". Pero los permisos de esta sesión son los del agente, no los de la app: proteger `/admin` es código de la app, y no entra en cuatro fases | La sesión 6 cierra el **defecto 3**. El **defecto 4** pasa entero a la sesión 7, que trata la seguridad de la app y los secretos. Así lo decía ya la sesión 5: "los defectos 3 y 4 son de las sesiones 6 y 7" | toda |
| 2 | **Una regla `deny` bloquea en todos los modos, incluso auto y `bypassPermissions`.** Ensayo: con el agente en `acceptEdits`, la edición de `docs/00-ANTES.md` falló con "File is in a directory that is denied by your permission settings" | La matriz pone en `deny` lo que ningún modo debe poder hacer. Es la respuesta al modo auto que eligió el alumno en la sesión 1 | 6.1 |
| 3 | **Las reglas `allow` del proyecto no cuentan hasta aceptar la confianza del proyecto; `deny` y `ask` cuentan desde el primer momento.** Ensayo: "Ignoring 3 permissions.allow entries … this workspace has not been trusted" | Si el agente sigue pidiendo permiso para `npm test`, la causa es esa. Se acepta la confianza al abrir Claude Code en la carpeta | 6.1 |
| 4 | **Una regla `deny` de `Edit` cubre también lo que se escribe desde la consola con `>`, `>>`, `tee` o `sed`.** Ensayo: `echo prueba >> docs/00-ANTES.md` quedó bloqueado. No cubre comandos que escriben sin nombrar el archivo ni cualquier subproceso | La matriz no promete más de lo que cubre, y se dice en clase | 6.1 |
| 5 | **Una regla de `Bash` compara el comando contra un patrón**, y no frena el mismo programa por otro camino (`sh -c '…'`, una ruta completa) | Lo que tiene que encontrarse **en cualquier parte** del comando, como `git reset --hard` después de un `&&`, va en un hook, que lee el comando entero | 6.2 |
| 6 | **Exit 2 bloquea, exit 0 deja pasar, y cualquier otro código deja pasar con un aviso.** Un hook que se rompe abre la puerta en lugar de cerrarla | Los dos hooks se dan escritos y probados (anexo). El alumno los entiende y los comprueba; no los inventa en clase, porque un hook mal escrito bloquea o deja pasar sin que se note | 6.2, 6.3 |
| 7 | La documentación: el comando de un hook lo corre `sh -c` en macOS y Linux, Git Bash en Windows, o PowerShell cuando no hay Git Bash. Un script de shell se comporta distinto en cada uno | Los hooks están escritos en **Node**, que el alumno ya tiene desde la sesión 1, y leen el evento como JSON sin herramientas extra. Funcionan igual en Windows, macOS y Linux. Lo único que depende de la consola es la línea que los registra (decisión 25) | 6.2, 6.3 |
| 8 | **Los hooks de `.claude/settings.json` también corren dentro de los subagentes**, y el evento trae `agent_type` con el nombre del subagente. Ensayo: el Tech Lead pidió leer `docs/MEDICIONES.md` y el hook lo bloqueó; el Tech Lead respondió que el hook no lo dejaba | Cierra el hueco de la sesión 5 (sus decisiones 5 y 10): `tools` no impedía que el Tech Lead leyera `docs/`, y ahora sí hay algo que lo impide. Cómo comprobarlo en clase: decisión 22 | 6.2 |
| 9 | **Un hook `Stop` con exit 2 manda al agente a seguir trabajando.** El evento trae `stop_hook_active`, que vale `true` si el agente ya volvió una vez por un hook. Ensayo: se pidió un cambio de formato sin mencionar las pruebas; al querer terminar, las pruebas fallaban, el hook lo mandó de vuelta y el agente actualizó la prueba al formato pedido | El hook deja parar al agente cuando `stop_hook_active` es `true`, para no entrar en bucle. Es **una vuelta obligatoria**, no infinitas, y se dice así | 6.3 |
| 10 | En el ensayo, el agente "arregló" las pruebas cambiando la prueba, no el código. En ese caso era correcto: el pedido cambiaba el comportamiento. Pero un agente también puede debilitar una prueba para que pase | La verificación de la 6.3 obliga a mirar el diff de la prueba: si la prueba cambió, que el cambio sea el que se pidió | 6.3 |
| 11 | **La primera prueba del ensayo falló por un espacio invisible**: el formato de moneda separa el símbolo del número con un espacio no separable, y la prueba lo escribía con un espacio común. El mensaje mostraba dos textos que parecían iguales | Va en la tabla de fallos. Es el error más probable en clase, y enseña que una prueba en rojo no siempre es código roto | 6.3 |
| 12 | Las pruebas son la señal que el hook exige, no un tema. Vitest y Playwright a fondo son *AI Agentic Engineer* | Se instala solo Vitest, como dependencia de desarrollo, y se prueban dos o tres funciones puras de la app: sin base de datos, sin red y sin páginas. La instalación pasa por la regla `ask` de la 6.1, y eso es a propósito | 6.3 |
| 13 | Correr las pruebas cada vez que el agente termina una respuesta las haría correr también cuando solo conversa | El hook las corre solo si cambió algo fuera de `docs/` (`git status`). En el ensayo, `npm test` tardó alrededor de 2 segundos con tres pruebas | 6.3 |
| 14 | **El sandbox no existe en Windows nativo.** La documentación: corre en macOS, Linux y WSL2; en Windows nativo los comandos corren sin aislar | La 6.4 lo explica y no lo ejecuta. Quien trabaja en macOS, Linux o WSL2 puede activarlo con `/sandbox`, como paso opcional. La red de hoy no depende de él | 6.4 |
| 15 | **`/rewind` solo deshace lo que el agente editó con sus herramientas de archivo.** Un archivo que solo cambió por un comando de consola no se restaura, ni lo que hizo un subagente, ni lo que editaste tú a mano. Los checkpoints duran unos 30 días y guardan los últimos 100 de una sesión | La 6.4 lo enseña rompiendo algo dos veces: una con la herramienta de edición, que `/rewind` deshace, y otra con la consola, que `/rewind` no ve y git sí. `/rewind` es interactivo y no se pudo ejecutar en el ensayo automático: lo comprueba el ensayo en clase | 6.4 |
| 16 | **El agente puede editar `.claude/settings.json` y los hooks**, es decir, quitar las reglas que lo frenan. Con `bypassPermissions` ni siquiera pregunta al escribir en `.claude/` | La 6.4 termina poniendo en `deny` la configuración y los hooks. Ensayo: el agente no pudo editar `.claude/settings.json` ni escribir en un hook con `>>`. Desde ahí, la red la cambia la persona | 6.4 |
| 17 | En Windows, aprobar algo con "Sí, y no preguntar de nuevo" escribe la regla en `.claude/settings.json`, el archivo que se commitea | Antes de cada commit de la sesión, `git diff .claude/settings.json`: que no haya entrado una regla que nadie decidió | 6.1–6.4 |
| 18 | **En Windows el agente tiene dos consolas, `Bash` y `PowerShell`, y elige cuál usar.** La documentación: con Git Bash instalado, PowerShell viene encendida y el agente la trata como su consola principal. Ensayo del 20: en la 6.1 el agente usó `Bash` y las reglas funcionaron; en la 6.2 usó `PowerShell` y `git reset --hard HEAD` **se ejecutó**: el matcher solo decía `Bash` y el hook solo miraba `tool_name === "Bash"`. La documentación: "A hook that matches only `Bash` never fires there", y una regla `Bash(...)` no alcanza a la herramienta `PowerShell` | El matcher es `Bash\|PowerShell\|Read\|Grep\|Glob`, el hook revisa las dos consolas, y cada regla de comando de la matriz se escribe dos veces, `Bash(...)` y `PowerShell(...)`. En macOS y Linux la regla `PowerShell(...)` no estorba, y el archivo sirve para todo el equipo. Ensayo: con la corrección, el `reset` por PowerShell quedó bloqueado | 6.1, 6.2, 6.3 |
| 19 | **El `deny` de `Edit` también frena lo que escribe PowerShell.** La documentación solo lo dice de Bash. Ensayo del 20: `Add-Content` y `>>` desde PowerShell sobre `docs/00-ANTES.md` y sobre `.claude/` quedaron bloqueados; el mismo `Add-Content` sobre un archivo sin `deny` pasó. El mensaje de bloqueo confunde: dice que el archivo está fuera de "the allowed working directories", aunque está dentro | Los `deny` de `Edit` no se duplican. El mensaje va a la tabla de fallos, para que nadie busque un problema de rutas | 6.1, 6.4 |
| 20 | **Una regla `deny` de `Bash` con patrón apaga la herramienta `PowerShell` sin avisar.** La documentación lo dice en "Bash deny rules also turn off the PowerShell tool" | La matriz no lleva `deny` de comandos. Lo destructivo lo frena el hook, que mira las dos consolas | 6.1 |
| 21 | **El hook busca texto en el comando, y se activa en cuanto se registra.** Ensayo del 20: con el hook recién registrado, el propio agente quiso escribir `docs/PERMISOS.md` con `cat >>`, y el texto mencionaba `git reset --hard`: el hook lo bloqueó. También estaban sin cubrir `git push origin +main`, `rm -r -f`, `rm --recursive --force`, `git checkout -- .`, `Remove-Item -Recurse` y un evento que no es JSON, que hacía salir al hook con 1 y dejaba pasar | Los archivos de la sesión se escriben con la herramienta de edición, no con la consola. El hook del anexo cubre esas variantes, y un evento ilegible ahora bloquea. Lo que sigue sin cubrir queda escrito en `docs/PERMISOS.md` | 6.2 |
| 22 | **La prueba del Tech Lead no probaba el hook.** Ensayo del 20: el `tech-lead.md` del alumno ya dice "No lees nada de `docs/`" (lo escribió en la 5.2). Ante el pedido, el Tech Lead se negó con **0 herramientas usadas**: lo frenó su propia instrucción, el "pedir", y el hook nunca actuó | La prueba en clase le pide intentarlo de todas formas, y se mira cuántas herramientas usó. Si usó una y el motivo es el del hook, el hook funciona con el agente real. Si se negó con 0, la prueba que cuenta es la de `probar-hooks.js` con el evento del Tech Lead | 6.2 |
| 23 | **El Paso 2 de la 6.3 casi nunca muestra el hook `Stop`.** Ensayo del 20: (a) el ejemplo del material, "precios sin decimales", supone que se probó el formato de moneda; el agente había elegido otra función, y el cambio no rompió nada; (b) con un cambio que sí contradecía una prueba, el agente leyó la prueba antes y la actualizó en el mismo turno; (c) cuando se le prohibió tocar la prueba, la regla del `CLAUDE.md` lo hizo preguntar antes de dejarla en rojo | El Paso 1 deja propuesto el pedido que rompe una prueba suya. El Paso 2 lo pide **sin dejarle tocar las pruebas ni correr `npm test`**: así se simula al agente que no obedece, y el rojo llega al hook. Ensayo: así, el hook lo mandó de vuelta, y en la segunda vuelta lo dejó parar | 6.3 |
| 24 | **El `git push` no tenía de dónde salir.** La spec pedía `ask` para "publicar en el remoto", pero ninguno de los tres orígenes de la matriz lo da, y en el ensayo el agente lo dejó fuera. El cierre decía "el push lo vas a tener que aprobar" | Se agrega un cuarto origen, el de lo que sale de tu máquina: ni `/rewind` ni git lo deshacen. `git push` va en `ask` en las dos consolas | 6.1 |
| 25 | **La línea que registra el hook depende de la consola de los hooks.** `node "$CLAUDE_PROJECT_DIR/…"` funciona en Git Bash y en `sh`, pero en PowerShell `$CLAUDE_PROJECT_DIR` no es una variable de entorno (la documentación usa `$env:CLAUDE_PROJECT_DIR`). La documentación describe además la forma "exec", con `args`, que no pasa por ninguna consola | Se registra con `node "$CLAUDE_PROJECT_DIR/…"`, ensayado en los dos ensayos. Para Windows sin Git Bash, la forma exec queda en "Si algo falla". Ensayo del 20: la forma exec también bloqueó, con Claude Code 2.1.327 | 6.2, 6.3 |
| 26 | **Una regla `ask` pregunta también en modo auto.** La documentación: "Explicit ask rules still force a prompt." Ensayo del 20, en modo auto: `npm install left-pad` y `npm install` sin argumentos preguntaron, y el rechazo no instaló nada | Se mantiene la verificación de la 6.1, y se agrega el `npm install` sin argumentos | 6.1 |
| 27 | **Probar un hook a mano con `echo '…' \| node …; echo "exit=$?"` depende de la consola**: en PowerShell `$?` es verdadero o falso, no el código. Y una vez registrado el hook, ese mismo `echo`, que trae `git reset --hard` en el texto, queda bloqueado por el hook | Se prueba con `node .claude/hooks/probar-hooks.js`, que está en el anexo: le pasa 23 eventos falsos a los dos hooks y compara cada código de salida con el esperado. Es igual en todas las consolas y en todos los sistemas, y su comando no trae texto peligroso | 6.2, 6.3 |
| 28 | **La comprobación de la 6.4 pedía quitar `"Bash(git push *)"`**, una regla que la matriz del alumno podía no tener. El agente diría "no la encuentro" y no se probaría nada | Se pide quitar `"Edit(./docs/00-ANTES.md)"`, que toda matriz tiene en `deny` | 6.4 |
---

## Mapa de fases y dependencias

| Fase | Qué entrega (en una línea) | Depende de | Se verifica con |
|---|---|---|---|
| 6.1 | `docs/PERMISOS.md` con la matriz, y sus reglas en `.claude/settings.json` | Prompt 0 | En un chat nuevo: editar `docs/00-ANTES.md` falla, e instalar un paquete pregunta |
| 6.2 | El hook `PreToolUse` que bloquea comandos destructivos y que el Tech Lead lea `docs/`, su probador, y la fila 5 de la tabla | 6.1 | `probar-hooks.js` da lo esperado; `/hooks` lo muestra; `git reset --hard` queda bloqueado en cada consola y `git status` no; el Tech Lead no puede leer `docs/` |
| 6.3 | Las pruebas mínimas, el script `test`, el hook `Stop`, y la regla de pruebas del `CLAUDE.md` al día | 6.2 | `npm test` en verde; un cambio que rompe una prueba hace que el agente siga trabajando |
| 6.4 | Deshacer con `/rewind` y con git, y la red protegida contra el propio agente | 6.3 | `/rewind` deshace la edición; el cambio por consola se deshace con git; el agente no puede editar `.claude/settings.json` |

## Convenciones transversales

* **Pedir no es imponer.** Lo que hoy entra en `.claude/settings.json` deja de
  depender del modelo. Lo que sigue en el `CLAUDE.md` o en una Skill, sí depende.
* **Cada regla sale de algo que ya pasó**: del riesgo que aceptaste en la sesión
  1, de una regla de tu `CLAUDE.md`, o de un archivo que los prompts repitieron
  que no se toca. Una regla sin origen no entra.
* **Cada bloqueo se comprueba en los dos sentidos**: que frena lo que debe, y que
  deja pasar lo normal. Un hook que bloquea todo bloquea la clase.
* **Las comprobaciones se hacen en un chat nuevo**, después de escribir la
  configuración, igual que en las sesiones 4 y 5.
* **Hoy no se mide costo.** La tabla de mediciones quedó cerrada en la sesión 3.
* Los comandos que empiezan con `/` y las menciones con `@` las escribe el
  alumno, no el agente.
* Un commit por fase.

---

# FASES

## Fase 6.1 — Tu matriz de permisos

**Prompt sugerido:** "Ejecuta la Fase 6.1 de `Ed5_sesion6.md`."

### Qué se construye

Una tabla que dice, acción por acción, qué hace el agente solo, qué te pregunta
y qué no hace nunca, con el origen de cada decisión. Y esa misma tabla escrita
como reglas en `.claude/settings.json`, donde Claude Code la aplica.

### Depende de

El Prompt 0, que deja en `docs/VERIFICACION_S6.md` el modo de aprobación, el
riesgo que aceptaste en la sesión 1 y las reglas de tu `CLAUDE.md`.

### Archivos

| Archivo | Rol |
|---|---|
| `docs/PERMISOS.md` | Nace en esta fase: la matriz, una fila por regla, con su origen. |
| `.claude/settings.json` | Nace en esta fase, con la clave `permissions`. Se commitea: es la configuración del equipo. |
| `docs/00-ANTES.md` | Se lee §3, el modo y el riesgo. **No se modifica.** |
| `CLAUDE.md` | Se lee para encontrar las reglas que hoy solo piden. **No se modifica en esta fase.** |

### Reglas

* **Cada fila de la matriz tiene cuatro columnas**: la acción, la lista
  (`allow`, `ask` o `deny`), la regla exacta como va en el archivo, y de dónde
  sale. Si una fila no llena las cuatro, se saca. Es la misma tabla de
  trazabilidad de las fases 2.1 y 5.2.
* **De dónde sale cada regla**, y solo de estos cuatro sitios:
  1. el riesgo que aceptaste en la sesión 1, en `docs/00-ANTES.md` §3;
  2. una regla de tu `CLAUDE.md` que dice "pregunta antes" o "no";
  3. los archivos que los prompts del curso repiten que no se tocan:
     `docs/00-ANTES.md`, la foto de la sesión 1, y `docs/MEDICIONES.md`,
     cerrada en la sesión 3;
  4. lo que sale de tu máquina: `git push`. Ni `/rewind` ni git lo deshacen.
* **`deny` para lo que ningún modo debe poder hacer**: editar esos dos archivos.
* **`ask` para lo que tiene que pasar por ti**: instalar dependencias, borrar la
  base de datos de la app, publicar en el remoto.
* **`allow` solo para comandos que solo leen o comprueban**, para que el modo
  manual pregunte menos: el chequeo de tipos y el build.
* **La sintaxis**: `Edit(./ruta)` para un archivo del proyecto, y
  `Bash(comando *)` para un comando y todo lo que lleve detrás.
* **Cada regla de comando va dos veces: `Bash(...)` y `PowerShell(...)`**, con la
  misma lista y el mismo origen. Una regla `Bash(...)` no alcanza a la consola
  `PowerShell`, y en Windows el agente puede usar cualquiera de las dos
  (decisión 18). En macOS y Linux la de `PowerShell` no estorba. Las reglas de
  `Edit` no se duplican: frenan también lo que escribe PowerShell (decisión 19).
* **Ningún `deny` de comandos.** Un `deny` de `Bash` con patrón apaga la consola
  `PowerShell` sin avisar (decisión 20). Lo destructivo lo frena el hook de la
  6.2.
* **No se toca el modo de aprobación** ni se agrega `defaultMode`. La matriz
  funciona en el modo que ya tienes.
* **No se escribe ningún hook todavía.** Eso es la 6.2.
* **Las comprobaciones se hacen en un chat nuevo.**

### Cómo verificar al terminar

1. `/permissions`, en un chat nuevo → aparecen tus reglas, y al lado el archivo
   de donde salen: `.claude/settings.json`.
2. Se le pide al agente agregar una línea a `docs/00-ANTES.md` → no puede, y el
   mensaje dice que los permisos lo niegan. `git status --short` no muestra ese
   archivo.
3. Se le pide instalar un paquete cualquiera, y después `npm install` sin
   argumentos → Claude Code te pregunta antes las dos veces, también en modo
   auto. Lo rechazas.
4. `docs/PERMISOS.md` tiene una fila por regla, cada una con su origen, y
   `.claude/settings.json` tiene cada regla de comando en `Bash(...)` y en
   `PowerShell(...)`.

---

## Fase 6.2 — El hook que bloquea

**Prompt sugerido:** "Ejecuta la Fase 6.2 de `Ed5_sesion6.md`."

### Qué se construye

Un programa chico, `.claude/hooks/bloquear-peligroso.js`, que Claude Code corre
antes de cada comando de consola, en `Bash` o en `PowerShell`, y de cada
lectura. Bloquea dos cosas que una regla de permisos no alcanza: un comando
destructivo escondido en medio de otro comando, y que el Tech Lead lea `docs/`.
Un segundo programa, `.claude/hooks/probar-hooks.js`, lo prueba con eventos
falsos. Y la fila 5 de tu tabla de decisión.

### Depende de

La Fase 6.1, porque el hook se registra en el mismo `.claude/settings.json`.

### Archivos

| Archivo | Rol |
|---|---|
| `.claude/hooks/bloquear-peligroso.js` | Nace en esta fase. El texto exacto está en el anexo. |
| `.claude/hooks/probar-hooks.js` | Nace en esta fase. El texto exacto está en el anexo. Prueba los dos hooks; el de la 6.3 lo prueba cuando exista. |
| `.claude/settings.json` | Gana la clave `hooks`, con el evento `PreToolUse`. Las reglas de la 6.1 no se tocan. |
| `docs/PERMISOS.md` | Gana una sección: qué bloquea el hook y por qué no podía hacerlo una regla. |
| `docs/DECISIONES.md` | La fila 5 deja de decir "sesión 6" y lleva tu caso. |

### Reglas

* **El hook es el del anexo, tal cual.** Se copia, no se reescribe. Si el agente
  propone cambios, los dice y no los aplica.
* **Bloquea dos cosas y ninguna más**:
  1. en `Bash` o en `PowerShell`, en cualquier parte de un comando:
     `git reset --hard`; `git checkout --` y `git restore` sin `--staged`, que
     descartan cambios; `git push --force` o con `+rama`; `git clean -f`; y
     borrar una carpeta entera (`rm -rf`, `rm -r -f`, `rm --recursive --force`,
     `Remove-Item -Recurse` y sus alias, `rd /s`);
  2. `Read`, `Grep` o `Glob` sobre `docs/` cuando quien los usa es el subagente
     `tech-lead`.
* **La conversación principal sí puede leer `docs/`.** Lo necesita en todas las
  sesiones. El hook solo frena al Tech Lead.
* **Si recibe un evento que no puede leer, bloquea.** Un hook roto no debe abrir
  la puerta.
* **Se registra con `PreToolUse` y el matcher `Bash|PowerShell|Read|Grep|Glob`**,
  y el comando usa `$CLAUDE_PROJECT_DIR` para encontrar el archivo. Sin
  `PowerShell` en el matcher, en Windows el hook no se entera de la mitad de los
  comandos (decisión 18).
* **Antes de registrarlo, se prueba a mano** con
  `node .claude/hooks/probar-hooks.js`: 22 eventos falsos para este hook, cada
  uno con el código que tiene que dar. Tienen que dar lo esperado todos.
* **Los archivos de esta fase se escriben con la herramienta de edición**, no
  con la consola. El hook busca texto: un `cat >>` cuyo texto mencione
  `git reset --hard` queda bloqueado, también el del propio agente (decisión
  21).
* **En `docs/PERMISOS.md` queda escrito qué no cubre**: un `Grep` del Tech Lead
  sin ruta, sobre todo el proyecto, puede devolver líneas de `docs/`, porque el
  hook frena lo que nombra `docs/`, no lo que lo recorre de paso; un comando que
  borra o descarta por otro camino (un script, `node -e`, `find -delete`); y que
  también frena un comando que solo menciona esas palabras.
* **La fila 5 lleva un caso del alumno**, no el del ejemplo.
* **Cantera:** el `mercadotech-automatic-validator` del ejemplar es un portero
  que funciona solo si el agente lo invoca. El hook funciona aunque nadie lo
  invoque. Esa comparación es la lección de la fase.

### Cómo verificar al terminar

1. `node .claude/hooks/probar-hooks.js` → todos los casos dan lo esperado.
2. `/hooks`, en un chat nuevo → aparece `PreToolUse` con tu hook, del archivo
   del proyecto, con el matcher `Bash|PowerShell|Read|Grep|Glob`.
3. Con el repositorio limpio, se le pide correr `git status` y después
   `git reset --hard HEAD`, **nombrando la consola**: una vez con `Bash` y otra
   con `PowerShell` (en macOS y Linux, solo `Bash`) → `git status` corre y el
   `reset` queda bloqueado las dos veces, con el motivo que escribe el hook.
4. Se le pide a `@"tech-lead (agent)"` que **intente** leer `docs/MEDICIONES.md`
   aunque su archivo lo prohíba → si usó una herramienta, el motivo es el del
   hook. Si se negó con 0 herramientas, lo frenó su propia instrucción: vale la
   prueba del punto 1 (decisión 22).
5. Se le pide al Tech Lead que lea un archivo de la app → lo lee. El hook no lo
   dejó ciego.
6. `docs/DECISIONES.md` tiene la fila 5 con tu caso.

---

## Fase 6.3 — Las pruebas como señal

**Prompt sugerido:** "Ejecuta la Fase 6.3 de `Ed5_sesion6.md`."

### Qué se construye

Las pruebas mínimas de tu app: Vitest, un script `npm test`, y dos o tres
pruebas de funciones que no tocan la base ni la red. Y un segundo hook,
`.claude/hooks/exigir-pruebas.js`, que cuando el agente quiere terminar corre
las pruebas y, si fallan, lo manda de vuelta. Tu `CLAUDE.md` deja de decir que
no hay pruebas.

### Depende de

La Fase 6.2, porque el hook nuevo se agrega al mismo `.claude/settings.json`.

### Archivos

| Archivo | Rol |
|---|---|
| `package.json` y su lockfile | Ganan Vitest como dependencia de desarrollo, y el script `"test": "vitest run"`. |
| Un archivo `*.test.ts` junto al módulo que se prueba | Nace aquí, con dos o tres pruebas. |
| `.claude/hooks/exigir-pruebas.js` | Nace en esta fase. El texto exacto está en el anexo. |
| `.claude/settings.json` | Gana el evento `Stop`, y las reglas `Bash(npm test)` y `PowerShell(npm test)` en `allow`. El matcher de `PreToolUse` no se toca. |
| `CLAUDE.md` | Cambia la regla de pruebas: ahora existen, `npm test` tiene que pasar, y un hook lo exige. |

### Reglas

* **La instalación pasa por la regla `ask` de la 6.1**: Claude Code te va a
  preguntar antes de `npm install`. La apruebas, y eso es la matriz funcionando.
* **Solo Vitest.** Nada de Playwright, nada de pruebas de páginas, de base de
  datos ni de red. Eso es *AI Agentic Engineer*.
* **Se prueban funciones puras**: las que reciben datos y devuelven datos. El
  agente propone dos o tres candidatas de tu app, y tú eliges una.
* **Cada prueba dice qué comprueba en su nombre**, en una línea, y comprueba
  algo que hoy es verdad: no se escribe una prueba para que falle.
* **El hook `Stop` es el del anexo, tal cual**, y se prueba a mano antes de
  registrarlo con `node .claude/hooks/probar-hooks.js`, que ahora también lo
  prueba a él.
* **Del bloque `hooks` del anexo se agrega solo `Stop`.** El `PreToolUse` de la
  6.2 queda como está.
* **El `CLAUDE.md` se actualiza en una sola regla**, la de las pruebas, con su
  comando de verificación. No se agregan reglas nuevas.
* **El agente deja propuesto el pedido que va a romper una prueba**: un cambio de
  comportamiento de una línea que contradice una de las pruebas que escribió, sin
  mencionarlas. Lo usa el Paso 2, que no puede depender de un ejemplo del
  material, porque cada alumno prueba una función distinta (decisión 23).
* **Las comprobaciones se hacen en un chat nuevo.** En la comprobación, el agente
  no puede tocar las pruebas ni correr `npm test`: se simula al agente que no
  obedece, para que el rojo llegue al hook. Un agente que obedece lee la prueba y
  la actualiza, o te pregunta, antes de terminar, y el hook no tiene nada que
  hacer.

### Cómo verificar al terminar

1. `npm test` → todas las pruebas pasan. `node .claude/hooks/probar-hooks.js` →
   todos los casos dan lo esperado.
2. En un chat nuevo, se le hace el pedido que dejó propuesto el Paso 1, sin
   dejarle tocar las pruebas ni correr `npm test` → cuando el agente quiere
   terminar, aparece el aviso del hook `Stop`, con la salida de las pruebas, y el
   agente sigue trabajando una vuelta más.
3. `git diff` del archivo de pruebas → no cambió. Si en otro intento el agente lo
   cambió, el cambio tiene que ser el que pediste, no una prueba borrada o
   debilitada.
4. Se descartan los cambios de la comprobación con `git restore .`, **en tu
   terminal**: el hook no deja que lo corra el agente. Después, `npm test` vuelve
   a pasar.
5. `grep -n "test" CLAUDE.md` → la regla de pruebas ya no dice que no hay.

---

## Fase 6.4 — Deshacer, y cerrar la red

**Prompt sugerido:** "Ejecuta la Fase 6.4 de `Ed5_sesion6.md`."

### Qué se construye

Rompes algo dos veces, a propósito, y lo deshaces: una vez con `/rewind` y otra
con git, porque `/rewind` no lo ve. Después proteges la red: el agente ya no
puede editar `.claude/settings.json` ni los hooks. Y queda escrito qué haces si
algo sale mal.

### Depende de

La Fase 6.3.

### Archivos

| Archivo | Rol |
|---|---|
| `.claude/settings.json` | Gana dos reglas `deny`: la configuración y los hooks. |
| `docs/PERMISOS.md` | Gana una sección "Deshacer": qué deshace `/rewind`, qué deshace git, y qué hace el sandbox en tu sistema. |
| Un archivo de la app | Se cambia dos veces y se deshace dos veces. Al final queda como estaba. |

### Reglas

* **La primera ruptura la hace el agente con su herramienta de edición**, y se
  deshace con `/rewind`, eligiendo restaurar el código.
* **La segunda la hace con un comando de consola**, en `Bash` o en `PowerShell`,
  y `/rewind` no la ve. Se deshace con `git restore`, que corres tú en tu
  terminal: el hook de la 6.2 no deja que lo corra el agente.
* **Lo que se rompe es chico y visible**: un texto de una página o una línea de
  comentario. Nada que toque la base de datos.
* **El sandbox se explica y no se exige.** Según el sistema:

  | Sistema | Sandbox |
  |---|---|
  | macOS | Funciona, con el aislamiento del propio sistema (Seatbelt). Sin instalar nada |
  | Linux y WSL2 | Funciona si están instalados `bubblewrap` y `socat` |
  | WSL1 | No funciona: hace falta WSL2 |
  | Windows nativo | No existe: los comandos corren sin aislar |

  Donde funciona, limita a los comandos de `Bash` y de `PowerShell` y a los
  procesos que abren: escriben solo en la carpeta del proyecto y en un temporal,
  no leen archivos como `~/.ssh`, y salen a internet solo hacia los dominios
  permitidos, que al principio son ninguno. Quien trabaja en macOS, Linux o WSL2
  puede activarlo con `/sandbox` y probarlo, como paso opcional, y anota el
  resultado.
* **Las dos reglas de protección van al final de la fase**: `Edit(./.claude/settings.json)`
  y `Edit(./.claude/hooks/**)`. Frenan la herramienta de edición, las
  redirecciones de `Bash` y lo que escribe `PowerShell` (decisión 19). Después,
  la red solo la cambia la persona.
* **Las comprobaciones se hacen en un chat nuevo.**

### Cómo verificar al terminar

1. Después del `/rewind`, `git status --short` → el archivo de la primera
   ruptura ya no aparece.
2. Después del segundo `/rewind`, `git diff` → el cambio por consola sigue ahí.
   Después de `git restore`, desaparece.
3. En un chat nuevo, se le pide al agente quitar la regla
   `"Edit(./docs/00-ANTES.md)"` de `.claude/settings.json`, que toda matriz
   tiene → no puede con su herramienta de edición, y si lo intenta desde la
   consola con una redirección o con `Add-Content`, tampoco. Un programa que
   escribe el archivo por dentro, como `node -e`, no lo frena el `deny`
   (decisión 4): queda escrito en "Deshacer".
4. `docs/PERMISOS.md` tiene la sección "Deshacer".
5. `git status --short` → solo los archivos de la fase.

---

## Si algo falla

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| `Ignoring … permissions.allow entries … this workspace has not been trusted` | no se aceptó la confianza del proyecto | abrir Claude Code en la carpeta y aceptar el aviso. `deny` y `ask` ya funcionaban; solo `allow` esperaba |
| El agente edita un archivo que estaba en `deny` | la ruta de la regla no coincide. `./docs/…` se cuenta desde la carpeta donde abriste Claude Code, y `/docs/…` desde la carpeta del archivo de configuración | `/permissions` muestra la regla tal como quedó. Escribirla con `./` delante y abrir Claude Code en la raíz del proyecto |
| El `deny` bloquea con "… was blocked. For security, Claude Code may only access files in the allowed working directories", y el archivo está dentro del proyecto | es el mensaje con que Claude Code bloquea una escritura de `PowerShell` sobre un archivo en `deny` | la regla funciona. No es un problema de rutas (decisión 19) |
| `ask` no pregunta, o el hook no frena, y el agente usó `PowerShell` | la regla dice `Bash(...)`, o el matcher no dice `PowerShell` | escribir cada regla de comando también como `PowerShell(...)`, y poner `Bash\|PowerShell\|Read\|Grep\|Glob` en el matcher (decisión 18). El nombre de la consola aparece en el aviso: `PreToolUse:PowerShell` |
| El agente dejó de tener la consola `PowerShell` sin que nadie la apagara | hay un `deny` de `Bash` con patrón | quitarlo: lo destructivo va en el hook (decisión 20) |
| `/permissions` no muestra las reglas | el JSON tiene un error, o el archivo no está en `.claude/` | `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'))"` dice dónde está el error |
| Apareció en `.claude/settings.json` una regla que nadie escribió | se aprobó algo con "Sí, y no preguntar de nuevo" | en Windows se escribe en este archivo. Revisar `git diff` antes del commit y quitarla si nadie la decidió |
| El hook no bloquea nada | el matcher no incluye la herramienta, o la ruta del comando está mal | `/hooks` muestra qué quedó registrado. `node .claude/hooks/probar-hooks.js` prueba el hook sin pasar por el registro |
| El hook bloquea todo, con "no pude leer el evento" | el hook no recibe un JSON | es a propósito: un hook que no entiende el evento cierra la puerta. Revisar la línea que lo registra en `.claude/settings.json` |
| El hook bloquea un comando que solo menciona `git reset --hard` (un `cat >>` o un `echo` con ese texto) | el hook busca texto, no entiende el comando | escribir ese archivo con la herramienta de edición, que el hook no mira (decisión 21) |
| El hook bloquea un `git restore` o un `git checkout --` que pediste | descartan cambios sin commitear, y el hook los frena | correrlo tú, en tu terminal. Es lo que dice el motivo del bloqueo |
| `node: command not found` al correr un hook | Node no está en el PATH de la consola que corre los hooks | abrir esa consola (Git Bash en Windows, la terminal en macOS y Linux) y correr `node --version`. Si falla, reinstalar Node marcando "agregar al PATH" |
| En Windows sin Git Bash, el hook no bloquea nada y `/hooks` lo muestra | los hooks corren con PowerShell, y ahí `$CLAUDE_PROJECT_DIR` no es una variable de entorno | instalar Git for Windows, que es lo del curso. Si no se puede, registrar el hook en forma exec, sin consola: `{ "type": "command", "command": "node", "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/bloquear-peligroso.js"] }`. Ensayado con Claude Code 2.1.327 (decisión 25) |
| El Tech Lead se niega a leer `docs/` y dice 0 herramientas usadas | lo frena su propio archivo, que ya dice que no lea `docs/`: el hook nunca actuó | pedirle que lo intente de todas formas. Si sigue en 0, vale la prueba de `probar-hooks.js` (decisión 22) |
| El Tech Lead lee `docs/` igual | el subagente no se llama `tech-lead`, o el hook no tiene `Read` en el matcher | el nombre está en el `name:` de `.claude/agents/tech-lead.md`. Tiene que coincidir con el del hook |
| `Expected "S/ 3,499.00"` y `Received "S/ 3,499.00"`: parecen iguales | el formato de moneda usa un espacio no separable | escribir ` ` en la prueba, o comparar después de reemplazar los espacios. No es código roto |
| El agente "arregla" las pruebas borrándolas | el hook exige verde, no qué prueba | revisar el diff de la prueba. Si se borró o se debilitó, `git restore` y pedirle que corrija el código |
| El agente vuelve una vez y después termina con pruebas en rojo | el hook lo deja parar a la segunda vuelta, para no entrar en bucle | es así por diseño. Correr `npm test` y decidir tú el siguiente paso |
| En la comprobación de la 6.3 no aparece el aviso del hook `Stop` | el cambio no rompió ninguna prueba; o el agente actualizó la prueba, o te preguntó, antes de terminar | usar el pedido que dejó propuesto el Paso 1, y no dejarle tocar las pruebas ni correr `npm test` (decisión 23) |
| `/rewind` no ofrece restaurar el código | el archivo cambió por la consola, no por la herramienta de edición | es la lección de la 6.4: `git restore` |
| `/sandbox` dice que no está disponible | Windows nativo, o WSL1, o en Linux faltan `bubblewrap` y `socat` | en Windows nativo es lo esperado: se explica y no se ejecuta. En WSL1, pasar a WSL2. En Linux, instalar los dos paquetes |
| El agente no puede editar `.claude/settings.json` y hace falta un cambio | la protección de la 6.4 | el cambio lo hace la persona, a mano |

## Restricciones de la sesión

* **No se toca el modo de aprobación** ni se usa `bypassPermissions`.
* **No se corrige el defecto 4** (el control de acceso de `/admin`): pasa a la
  sesión 7.
* **No se escriben pruebas de páginas, de base de datos ni E2E**, y no se
  instala Playwright: *AI Agentic Engineer*.
* **No se toca el CI ni GitHub Actions**: sesión 7.
* **No se empaqueta nada**: el plugin es la sesión 8. Los hooks y los permisos
  de hoy son lo que la sesión 8 va a empaquetar.
* **No se mide costo** y no se toca `docs/MEDICIONES.md`.
* **No se modifica el Tech Lead**: lo frena el hook, no un cambio en su archivo.
* Ninguna clave pasa por el chat ni por el repositorio (`CONVENCIONES.md` §6).

## Entregables

1. `.claude/settings.json` con `permissions` (`allow`, `ask`, `deny`) y `hooks`
   (`PreToolUse` y `Stop`).
2. `.claude/hooks/bloquear-peligroso.js`, `.claude/hooks/exigir-pruebas.js` y
   `.claude/hooks/probar-hooks.js`.
3. `docs/PERMISOS.md`: la matriz, lo que el hook bloquea y lo que no cubre, y la
   sección "Deshacer".
4. Vitest, el script `test` y un archivo de pruebas en verde.
5. El `CLAUDE.md` con la regla de pruebas al día.
6. La fila 5 de `docs/DECISIONES.md` con un caso del alumno.
7. La entrada de la sesión 6 en `docs/BITACORA.md`.
8. Un commit por fase, y todo subido al repositorio.

## Producto de la sesión

Un hook que bloquea lo peligroso y exige pruebas verdes.

## Criterios de aceptación

* Una regla `deny` bloqueó una edición en el modo de aprobación del alumno.
  Ejecutado, no descrito.
* Un comando destructivo quedó bloqueado por el hook en cada consola que tiene
  el agente del alumno, y `git status` pasó.
* `node .claude/hooks/probar-hooks.js` da lo esperado en todos los casos.
* El Tech Lead no pudo leer `docs/`, por el hook o por su propia instrucción, y
  quedó anotado cuál de los dos. Y sí pudo leer la app.
* `npm test` pasa, y el hook `Stop` mandó al agente de vuelta al menos una vez
  ante una prueba en rojo.
* Se deshizo un cambio con `/rewind` y otro con git, y quedó escrito por qué hizo
  falta git.
* El agente no pudo editar `.claude/settings.json`.
* El `CLAUDE.md` ya no dice que no hay pruebas.
* `docs/00-ANTES.md` y `docs/MEDICIONES.md` no cambiaron en toda la sesión.
* Ninguna clave quedó en el repositorio ni pasó por el chat.

---

## Anexo — los tres archivos de los hooks, tal como se ensayaron

Se copian tal cual a `.claude/hooks/`, con la herramienta de edición. Están en
Node, y leen el evento que Claude Code les pasa por la entrada estándar.
Funcionan igual en Windows, macOS y Linux, y vigilan las dos consolas del
agente, `Bash` y `PowerShell`. Versión 2, ensayada el 2026-11-20.

### `.claude/hooks/bloquear-peligroso.js` (Fase 6.2)

```js
// PreToolUse: bloquea lo que una regla de permisos no alcanza a ver.
// Lee el evento por stdin. Exit 2 = bloquear; lo que se escribe en stderr es el motivo que ve Claude.
// Vigila las dos consolas de Claude Code: Bash (macOS, Linux, Git Bash) y PowerShell (Windows).
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let e;
  try {
    e = JSON.parse(raw || "{}");
  } catch {
    // Un evento que no se entiende se bloquea: un hook roto no debe abrir la puerta.
    process.stderr.write("Bloqueado por el hook del proyecto: no pude leer el evento.");
    process.exit(2);
  }
  const tool = e.tool_name;
  const input = e.tool_input || {};

  // 1. Comandos destructivos, aunque vengan en medio de otro comando, en Bash o en PowerShell.
  if (tool === "Bash" || tool === "PowerShell") {
    const cmd = String(input.command || "");
    const reglas = [
      [/git\s+reset\s+--hard/, "git reset --hard borra cambios sin commitear"],
      [/git\s+(checkout\s+(\S+\s+)?--\s|restore\s+(?![^\n;&|]*--staged))/, "git checkout -- y git restore descartan cambios sin commitear"],
      [/git\s+push\b[^\n;&|]*(--force|\s-f\b|\s\+\S)/, "git push --force (o con +rama) reescribe la historia del remoto"],
      [/git\s+clean\s+-[a-zA-Z]*f/, "git clean -f borra archivos que git no sigue"],
      // rm -rf, rm -r -f, rm --recursive --force; Remove-Item -Recurse (y sus alias); rd /s y del /s.
      [/(?<!git\s+)\b(rm|rmdir|rd|del|erase|ri|Remove-Item)\b(?=[^\n;&|]*\s(-[dfiIrRv]*[rR][dfiIrRv]*\b|--recursive\b|-[Rr]ec[a-z]*\b|\/[sS]\b))/, "borrar una carpeta entera con todo su contenido no tiene papelera"],
    ];
    for (const [patron, motivo] of reglas) {
      if (patron.test(cmd)) {
        process.stderr.write(
          "Bloqueado por el hook del proyecto: " + motivo +
          ". Si de verdad hace falta, lo corre la persona en su terminal."
        );
        process.exit(2);
      }
    }
  }

  // 2. El tech-lead no lee docs/: ahí están el inventario y la lista del autor.
  if (e.agent_type === "tech-lead" && ["Read", "Grep", "Glob"].includes(tool)) {
    const rutas = [input.file_path, input.path, input.pattern, input.glob].filter(Boolean).map(String);
    if (rutas.some((r) => /(^|[\\/])docs([\\/]|$)/.test(r))) {
      process.stderr.write("Bloqueado por el hook del proyecto: el tech-lead no lee docs/.");
      process.exit(2);
    }
  }

  process.exit(0);
});
```

### `.claude/hooks/probar-hooks.js` (Fase 6.2)

```js
// Prueba los hooks a mano: les pasa eventos falsos y compara el código de salida con el esperado.
// Funciona igual en Bash, PowerShell, macOS, Linux y Windows: node .claude/hooks/probar-hooks.js
// No ejecuta nada peligroso: los comandos de los eventos son texto, nadie los corre.
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const casos = [
  // [hook, descripción, evento, código esperado]
  ["bloquear-peligroso.js", "Bash: git reset --hard después de &&", { tool_name: "Bash", tool_input: { command: "git status && git reset --hard HEAD" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: git reset --hard después de ;", { tool_name: "PowerShell", tool_input: { command: "git status --short; git reset --hard HEAD" } }, 2],
  ["bloquear-peligroso.js", "Bash: git push --force", { tool_name: "Bash", tool_input: { command: "git push --force origin main" } }, 2],
  ["bloquear-peligroso.js", "Bash: git push con +rama", { tool_name: "Bash", tool_input: { command: "git push origin +main" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: git clean -fd", { tool_name: "PowerShell", tool_input: { command: "git clean -fd" } }, 2],
  ["bloquear-peligroso.js", "Bash: git checkout -- .", { tool_name: "Bash", tool_input: { command: "git checkout -- ." } }, 2],
  ["bloquear-peligroso.js", "PowerShell: git restore .", { tool_name: "PowerShell", tool_input: { command: "git restore ." } }, 2],
  ["bloquear-peligroso.js", "Bash: rm -rf", { tool_name: "Bash", tool_input: { command: "rm -rf .next" } }, 2],
  ["bloquear-peligroso.js", "Bash: rm -r -f", { tool_name: "Bash", tool_input: { command: "rm -r -f .next" } }, 2],
  ["bloquear-peligroso.js", "Bash: rm --recursive --force", { tool_name: "Bash", tool_input: { command: "rm --recursive --force .next" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: Remove-Item -Recurse -Force", { tool_name: "PowerShell", tool_input: { command: "Remove-Item -Recurse -Force .next" } }, 2],
  ["bloquear-peligroso.js", "PowerShell: rd /s /q", { tool_name: "PowerShell", tool_input: { command: "cmd /c rd /s /q .next" } }, 2],
  ["bloquear-peligroso.js", "Evento que no es JSON", "esto no es json", 2],
  ["bloquear-peligroso.js", "Bash: git status pasa", { tool_name: "Bash", tool_input: { command: "git status --short" } }, 0],
  ["bloquear-peligroso.js", "PowerShell: git status pasa", { tool_name: "PowerShell", tool_input: { command: "git status --short" } }, 0],
  ["bloquear-peligroso.js", "Bash: git restore --staged pasa", { tool_name: "Bash", tool_input: { command: "git restore --staged src/app/page.tsx" } }, 0],
  ["bloquear-peligroso.js", "Bash: rm de un archivo pasa", { tool_name: "Bash", tool_input: { command: "rm -f notas.txt" } }, 0],
  ["bloquear-peligroso.js", "PowerShell: Remove-Item -Force de un archivo pasa", { tool_name: "PowerShell", tool_input: { command: "Remove-Item -Force notas.txt" } }, 0],
  ["bloquear-peligroso.js", "Tech Lead: Read de docs/ (ruta de Windows)", { tool_name: "Read", agent_type: "tech-lead", tool_input: { file_path: "C:\\proyecto\\docs\\MEDICIONES.md" } }, 2],
  ["bloquear-peligroso.js", "Tech Lead: Grep con path docs", { tool_name: "Grep", agent_type: "tech-lead", tool_input: { pattern: "Fase", path: "docs" } }, 2],
  ["bloquear-peligroso.js", "Tech Lead: Read de package.json pasa", { tool_name: "Read", agent_type: "tech-lead", tool_input: { file_path: "/proyecto/package.json" } }, 0],
  ["bloquear-peligroso.js", "Conversación principal: Read de docs/ pasa", { tool_name: "Read", tool_input: { file_path: "docs/MEDICIONES.md" } }, 0],
  ["exigir-pruebas.js", "Stop en la segunda vuelta pasa", { stop_hook_active: true }, 0],
];

let fallas = 0;
let corridas = 0;
for (const [hook, desc, evento, esperado] of casos) {
  const archivo = path.join(dir, hook);
  if (!fs.existsSync(archivo)) continue; // el de pruebas nace en la Fase 6.3
  const entrada = typeof evento === "string" ? evento : JSON.stringify(evento);
  const r = spawnSync(process.execPath, [archivo], { input: entrada, encoding: "utf8" });
  const ok = r.status === esperado;
  corridas++;
  if (!ok) fallas++;
  console.log(`${ok ? "OK   " : "FALLA"}  exit=${r.status} (esperado ${esperado})  ${hook} · ${desc}`);
}
console.log(`\n${corridas - fallas} de ${corridas} casos dan lo esperado.`);
process.exit(fallas ? 1 : 0);
```

### `.claude/hooks/exigir-pruebas.js` (Fase 6.3)

```js
// Stop: si cambió el código y las pruebas fallan, Claude no puede darse por terminado.
// Exit 2 = Claude sigue trabajando; lo que se escribe en stderr es el motivo que ve.
const { spawnSync } = require("child_process");
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let e;
  try {
    e = JSON.parse(raw || "{}");
  } catch {
    // Aquí no se bloquea: un Stop que siempre dice "no" dejaría al agente en un bucle.
    process.stderr.write("Hook de pruebas: no pude leer el evento. No exijo pruebas esta vez.");
    process.exit(1);
  }

  // Si ya lo mandamos de vuelta una vez, lo dejamos parar: así no entra en bucle.
  if (e.stop_hook_active) process.exit(0);

  // ¿Cambió algo fuera de docs/? Si no, no hay código nuevo que probar.
  const cwd = process.env.CLAUDE_PROJECT_DIR || e.cwd || process.cwd();
  const cambios = spawnSync("git", ["status", "--porcelain", "--", ".", ":(exclude)docs"], { cwd, encoding: "utf8" });
  if (!String(cambios.stdout || "").trim()) process.exit(0);

  // shell: true para que npm se encuentre igual en Windows (npm.cmd), macOS y Linux.
  const r = spawnSync("npm", ["test"], { cwd, encoding: "utf8", shell: true });
  if (r.status !== 0) {
    const salida = ((r.stdout || "") + (r.stderr || "")).split("\n").slice(-25).join("\n");
    process.stderr.write(
      "Las pruebas fallan (npm test). No des la tarea por terminada: corrige el código o explica por qué falla.\n" + salida
    );
    process.exit(2);
  }
  process.exit(0);
});
```

### Cómo se registran en `.claude/settings.json`

```json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Bash|PowerShell|Read|Grep|Glob",
      "hooks": [
        { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/bloquear-peligroso.js\"" }
      ]
    }
  ],
  "Stop": [
    {
      "hooks": [
        { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/exigir-pruebas.js\"" }
      ]
    }
  ]
}
```

La 6.2 escribe solo `PreToolUse`. La 6.3 agrega `Stop`, y no toca el
`PreToolUse`.

El comando lo corre Git Bash en Windows y `sh` en macOS y Linux. En Windows sin
Git Bash lo correría PowerShell, donde `$CLAUDE_PROJECT_DIR` no es una variable
de entorno: ahí se usa la forma exec, sin consola, que también se ensayó:

```json
{ "type": "command", "command": "node", "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/bloquear-peligroso.js"] }
```

### Las reglas de comando, en las dos consolas

Así queda la parte de comandos de una matriz típica al final de la sesión. Cada
regla `Bash(...)` tiene su gemela `PowerShell(...)`; las de `Edit` van una sola
vez:

```json
"permissions": {
  "allow": [
    "Bash(npm run typecheck)", "PowerShell(npm run typecheck)",
    "Bash(npm run build)", "PowerShell(npm run build)",
    "Bash(npm test)", "PowerShell(npm test)"
  ],
  "ask": [
    "Bash(npm install *)", "PowerShell(npm install *)",
    "Bash(npm run db:reset)", "PowerShell(npm run db:reset)",
    "Bash(git push *)", "PowerShell(git push *)"
  ],
  "deny": [
    "Edit(./docs/00-ANTES.md)",
    "Edit(./docs/MEDICIONES.md)",
    "Edit(./.claude/settings.json)",
    "Edit(./.claude/hooks/**)"
  ]
}
```

Las dos últimas de `deny` entran en la 6.4. Las demás filas dependen de la
matriz de cada alumno.

### Cómo se prueba un hook a mano

Desde la raíz del proyecto, en cualquier consola:

```bash
node .claude/hooks/probar-hooks.js
```

Imprime una línea por caso, `OK` o `FALLA`, con el código que dio y el que se
esperaba, y al final cuántos dan lo esperado. Tienen que dar todos. En la 6.2
corre 22 casos; desde la 6.3, 23. Los comandos peligrosos van dentro de los
eventos como texto: nadie los ejecuta, y el comando que lo corre no trae ningún
texto que el hook bloquee.

---

## Registro de cambios

**2026-11-18 — versión 1.** Primera versión de la spec. Sale de cruzar el plan
de producción (`PLAN_ED5_SESIONES.md`, Fase S.6: matriz de permisos, hook de
bloqueo, pruebas como señal y sandbox, checkpoints y `/rewind`), el producto
que promete el temario para esta sesión ("hook que bloquea lo peligroso y exige
pruebas verdes"), y lo que dejan en el repositorio del alumno los laboratorios
1 a 5. Los datos técnicos se consultaron en la documentación oficial de
permisos, modos de permisos, configuración, hooks, sandbox y checkpoints el
2026-11-18. La regla `deny` (con la herramienta de edición y con `>>`), el hook
`PreToolUse` (con un comando destructivo y con el Tech Lead leyendo `docs/`), el
hook `Stop` con una prueba en rojo, las pruebas con Vitest y la protección de
`.claude/` se ejecutaron ese día con Claude Code real, sobre Windows, en una
copia del proyecto de ensayo.

**Pendiente antes de dar la clase (versión 1).** No se ejecutó lo interactivo: `/permissions`,
`/hooks`, `/rewind` y el aviso de "Sí, y no preguntar de nuevo". Falta el ensayo
completo en clase, cronometrado: el plan pide que ninguna fase pase de 30
minutos.

**2026-11-20 — versión 2.** Sale del ensayo del laboratorio corrido como alumno,
en la terminal y en modo auto, sobre Windows, con Claude Code 2.1.327: Prompt 0,
Prompt 1, 6.1, 6.2 y 6.3 completos, con `/permissions`, `/hooks` y el menú de `@`.
Decisiones 18 a 28. Lo principal: en Windows el agente usó la consola
`PowerShell` y un `git reset --hard` pasó, porque el hook y las reglas solo
miraban `Bash`. Cambios:

* El hook vigila `Bash` y `PowerShell`, cubre las variantes que faltaban
  (`+rama`, `rm -r -f`, `--recursive --force`, `Remove-Item -Recurse`, `rd /s`,
  `git checkout --`, `git restore`) y bloquea si no puede leer el evento. El de
  pruebas lee el evento con cuidado y busca `npm` igual en los tres sistemas.
* Nuevo `probar-hooks.js`, que reemplaza la prueba a mano con `echo`: no depende
  de la consola, y su comando no trae texto que el hook bloquee.
* La matriz escribe cada regla de comando en `Bash(...)` y en `PowerShell(...)`,
  no lleva `deny` de comandos, y suma un cuarto origen para `git push`.
* La tabla por sistema operativo: consolas, con qué corren los hooks y sandbox
  en Windows, macOS, Linux y WSL.
* Las comprobaciones del Tech Lead (6.2), del hook `Stop` (6.3) y de la red
  protegida (6.4) se rehicieron para que prueben lo que dicen probar.
* Se trabaja en la terminal, no en la extensión de VS Code.

Comprobado ese día con Claude Code real, en una copia del proyecto de ensayo:
`probar-hooks.js` (23 de 23); el `reset` por `PowerShell`, bloqueado por el
hook; `Add-Content` y `>>` de `PowerShell` sobre `docs/00-ANTES.md` y sobre
`.claude/`, bloqueados por el `deny`, y sobre un archivo sin `deny`, permitido;
el hook `Stop` con una prueba en rojo; y el hook registrado en forma exec. No se
ejecutó en macOS ni en Linux: lo de esos sistemas sale de la documentación
oficial, consultada el 2026-11-20.

**La sesión 8 empaqueta estos hooks.** Su anexo copia los de la sesión 6, y hay
que pasarla a esta versión (el matcher, las reglas `PowerShell(...)` y
`probar-hooks.js`).

**Pendiente antes de dar la clase (versión 2).** Ensayar `/rewind` y la 6.4
completa; ensayar en macOS o Linux; cronometrar.
