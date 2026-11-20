# Sesión 6 — Permisos, hooks y red de seguridad

> El PPT está armado: [`Ed5_sesion6.pptx`](Ed5_sesion6.pptx), 38 láminas sobre
> la plantilla de la sesión 5 —mismos diseños, colores y tipografías— y con las
> notas del docente en el panel de notas. Este documento es el guion del que
> salió: para preparar la clase, no para proyectarlo.
>
> El material del laboratorio está escrito desde el 18 de noviembre:
> [`Ed5_sesion6.md`](Ed5_sesion6.md) y [`PROMPTS_sesion6.md`](PROMPTS_sesion6.md).
> Lo no interactivo se ejecutó ese día con Claude Code real. El 20 de noviembre
> se corrió el laboratorio como alumno, en la terminal, y salió la versión 2 de
> la spec (sección "Ensayo del 20 de noviembre", abajo). Las láminas 30 a 34
> dicen lo mismo que la spec.

Los datos técnicos están verificados contra la documentación oficial el
18 de noviembre de 2026. Las fuentes y la fecha están al final, como pide
`CONVENCIONES.md` §5.

---

## Los cuatro temas que esta sesión posee

De la tabla de dueños del temario (`PLAN_ED5_SESIONES.md`), y no hay ninguno
más:

| Tema | Dónde cae |
|---|---|
| ⭐ Matriz de permisos: qué toca el agente y qué requiere aprobación | bloque 02 · fase 6.1 |
| ⭐ Hooks: reglas que se cumplen aunque el modelo no obedezca | bloque 03 · fase 6.2 |
| Las pruebas como señal que el hook exige | bloque 04 · fase 6.3 |
| ⭐ Sandbox, checkpoints y deshacer lo que salió mal | bloque 05 · fase 6.4 |

---

## Verificado hoy (18 nov 2026) — lo que cambia tu preparación

| Hallazgo | Consecuencia para la clase |
|---|---|
| Las reglas se evalúan deny, ask, allow; la primera que coincide decide. **deny bloquea en todos los modos**, incluso auto y `bypassPermissions`. ask pregunta incluso en auto. | Es la lámina 13. Es la respuesta al modo auto que eligió media clase en la sesión 1. |
| Las reglas `allow` del proyecto **no cuentan hasta aceptar la confianza** de la carpeta; deny y ask sí. El ensayo lo mostró literal: "Ignoring 3 permissions.allow entries … this workspace has not been trusted". | Va en la tabla de fallos. Si alguien dice que `npm test` le sigue pidiendo permiso, la causa es esa. |
| Un deny de `Edit` cubre también `>`, `>>`, `tee` y `sed` desde la consola. No cubre un comando que escribe sin nombrar el archivo ni cualquier subproceso. | Lámina 15. La matriz no promete más de lo que cubre. |
| Un hook sale con **2 para bloquear**; el motivo va por stderr y lo lee el agente. **Cualquier otro código deja pasar.** | Lámina 18. Un hook que se rompe abre la puerta: por eso los dos hooks se dan escritos y probados. |
| Los hooks del proyecto **corren dentro de los subagentes**, y el evento trae `agent_type`. | Es lo que cierra el hueco de la sesión 5: el hook frena al Tech Lead sin tocar su archivo. |
| Un hook `Stop` con exit 2 manda al agente a seguir. El evento trae `stop_hook_active`. | El hook de la 6.3 deja parar la segunda vez. Es una vuelta obligatoria, no infinitas. |
| Los hooks los corre `sh` en macOS y Linux, Git Bash en Windows, o PowerShell si no hay Git Bash. | Los hooks están en Node para que funcionen igual en todos los sistemas. |
| **En Windows el agente tiene dos consolas, `Bash` y `PowerShell`**, y trata a PowerShell como la principal. Una regla `Bash(...)` no alcanza a PowerShell, y un hook con matcher `Bash` no se dispara. En macOS y Linux PowerShell es opcional. | Láminas 15 y 32. Es el hallazgo más caro del 20 de noviembre: un `git reset --hard` pasó. |
| **El sandbox no existe en Windows nativo**: corre en macOS, Linux y WSL2. | Lámina 25. En la 6.4 es opcional. La red de hoy no depende de él. |
| `/rewind` (alias `/undo`, o Esc dos veces) **solo deshace lo que el agente editó con sus herramientas de archivo**. No lo que cambió por la consola, ni lo de un subagente, ni lo que editaste a mano. Guarda los últimos 100 puntos, unos 30 días. | Lámina 24, y la 6.4 lo demuestra rompiendo algo dos veces. |
| En Windows, aprobar con "Sí, y no preguntar de nuevo" **escribe en `.claude/settings.json`**, el archivo que se commitea. | Lámina 12. Antes de cada commit, `git diff .claude/settings.json`. |
| Con `bypassPermissions`, ni siquiera pregunta al escribir en `.claude/`. | Lámina 26: la red se protege de sí misma con dos reglas deny. |

---

## Lo que el ensayo ejecutó (18 nov 2026)

Con Claude Code real, en modo no interactivo y en una copia del proyecto de
ensayo, sobre Windows:

| Qué se probó | Qué pasó |
|---|---|
| Editar `docs/00-ANTES.md` con la herramienta de edición, con el agente en `acceptEdits` y el archivo en deny | Bloqueado: "File is in a directory that is denied by your permission settings" |
| Lo mismo con `echo prueba >> docs/00-ANTES.md` | Bloqueado: el permiso de Bash quedó denegado |
| `git reset --hard HEAD` con el hook `PreToolUse` | Bloqueado, con el motivo del hook. `git status --short`, en el mismo pedido, pasó |
| El Tech Lead, como subagente, leyendo `docs/MEDICIONES.md` | Bloqueado. El evento trajo `agent_type: "tech-lead"`, y el Tech Lead respondió que el hook no lo dejaba |
| Un cambio de formato de precios, sin mencionar las pruebas, con el hook `Stop` | Las pruebas fallaron al querer terminar; el hook lo mandó de vuelta, y el agente actualizó la prueba al formato pedido. Al final, las tres pasaban |
| Editar `.claude/settings.json` y escribir en un hook con `>>`, con los dos deny de la 6.4 | Bloqueados los dos |
| El hook `PreToolUse`, a mano, con diez eventos falsos | Bloqueó los cinco que tenía que bloquear y dejó pasar los otros cinco |
| El hook `Stop`, a mano, en cinco casos | Sin cambios: deja parar. Solo `docs/`: deja parar. Código que rompe una prueba: bloquea. El mismo caso con `stop_hook_active`: deja parar. Código que no rompe: deja parar |

**Lo que no se ejecutó**, porque es interactivo: `/permissions`, `/hooks`,
`/rewind`, la pantalla de aprobar con "Sí, y no preguntar de nuevo", y
`/sandbox`. Pruébalos antes de la clase en el entorno de los alumnos.

**Un error del ensayo que va a pasar en clase.** La primera prueba de
`formatSoles` falló con `Expected "S/ 3,499.00"` y `Received "S/ 3,499.00"`:
dos textos que parecen iguales. El formato de moneda separa el símbolo con un
espacio no separable. Si sale, no es código roto: es la prueba.

## Ensayo del 20 de noviembre — el laboratorio corrido como alumno

En la terminal, en modo auto, sobre Windows, con Claude Code 2.1.327. Las
decisiones 18 a 28 de la spec salen de aquí.

| Qué pasó | Qué cambió en el material |
|---|---|
| En la 6.2 el agente corrió `git reset --hard HEAD` con **PowerShell**, y se ejecutó: el matcher y el hook solo miraban `Bash` | Matcher `Bash\|PowerShell\|Read\|Grep\|Glob`, hook que revisa las dos consolas, reglas `PowerShell(...)` gemelas. Con la corrección, quedó bloqueado |
| Con el hook recién registrado, el propio agente quedó bloqueado al escribir `docs/PERMISOS.md` con `cat >>`: el texto mencionaba `git reset --hard` | Los archivos se escriben con la herramienta de edición |
| El Tech Lead se negó a leer `docs/` con **0 herramientas**: lo frenó su `tech-lead.md`, no el hook | La comprobación le pide intentarlo, y se mira cuántas herramientas usó |
| En la 6.3, el ejemplo "precios sin decimales" no rompió nada (se había probado otra función); con un pedido que sí rompía, el agente actualizó la prueba antes de terminar, o preguntó | El Paso 1 deja el pedido; el Paso 2 no le deja tocar pruebas ni correr `npm test`. Así el hook lo mandó de vuelta |
| La comprobación de la 6.4 pedía quitar `Bash(git push *)`, y la matriz no la tenía | Se pide quitar `Edit(./docs/00-ANTES.md)` |
| `ask` preguntó en modo auto, con `npm install left-pad` y con `npm install` solo | Se confirma; se agrega el segundo caso |
| Después, en una copia: el `deny` de `Edit` frenó `Add-Content` y `>>` de PowerShell, con un mensaje que habla de "allowed working directories" | Va a la tabla de fallos: no es un problema de rutas |

**Lo que sigue sin ensayar:** `/rewind` y la 6.4 completa, y todo en macOS y
Linux.

---

## La pregunta de la sesión

> Si algo no debe pasar nunca, ¿por qué se lo estás pidiendo?

Hasta la sesión 5, todo fueron pedidos. El `CLAUDE.md` pide, la Skill pide, y el
Tech Lead tiene escrito que no lea `docs/`, que también es un pedido. Hoy cada
pedido que no admite excepción pasa a ser algo que aplica Claude Code: un
permiso, un hook o una prueba que un hook exige.

---

## Mapa de la presentación

| Láminas | Bloque | Qué se dice |
|---|---|---|
| 1–6 | Apertura | Sesión 6, agenda, dónde quedamos. La fila 5 de la tabla es la última vacía |
| 7–10 | 01 · Pedir no es imponer | Lo que ya se vio fallar en las sesiones 1, 4 y 5, y las tres capas de hoy |
| 11–15 | 02 · Permisos | Dónde viven, cómo se evalúan, pedir contra imponer, y lo que una regla no ve |
| 16–18 | 03 · Hooks | Qué es un hook, `PreToolUse` y `Stop`, y cómo contesta con su código de salida |
| 19–21 | 04 · Las pruebas como señal | Sin pruebas contra con pruebas, y el hook que las exige |
| 22–27 | 05 · Deshacer | `/rewind` contra git, el sandbox por sistema operativo, la red protegida de sí misma, y qué hacer si algo se bloquea de más |
| 28–34 | 06 · Lab | La tabla de decisión completa, y las cuatro fases |
| 35–38 | Cierre | Lo que te llevas, la sesión 7, gracias y evaluación |

**Reloj de 2 h, clase normal:** recap 10 · 01 10 · 02 15 · 03 15 · 04 10 · 05 10
· lab 45 · cierre 5. Suma 120. **Sin medir**: la sesión no se ha cronometrado.

Si el reloj aprieta, se recorta el bloque 05 a la lámina de `/rewind`. Nunca el
bloque 03: es el que sostiene el laboratorio.

---

## El lab, en detalle

Cuatro fases. Cada una se escribe en un chat y se comprueba en otro nuevo.

### Fase 6.1 — Tu matriz de permisos

El agente propone una regla por fila, cada una con su origen: el riesgo de la
sesión 1, una regla del `CLAUDE.md` o un archivo que nunca se toca. El alumno
elige. Quedan en `docs/PERMISOS.md` y en `.claude/settings.json`.

| Lista | Qué entra, en el ensayo |
|---|---|
| deny | `Edit(./docs/00-ANTES.md)` · `Edit(./docs/MEDICIONES.md)` |
| ask | `Bash(npm install *)` (el riesgo de la sesión 1) · `Bash(npm run db:reset)` · `Bash(git push *)` (lo que sale de la máquina), y cada una también como `PowerShell(...)` |
| allow | `Bash(npm run typecheck)` · `Bash(npm run build)`, y sus gemelas `PowerShell(...)` |

Cada regla de comando va dos veces aunque el alumno tenga una sola consola: el
archivo se commitea y lo usa todo el equipo. Ningún `deny` de comandos: un
`deny` de `Bash` con patrón apaga PowerShell sin avisar.

Se comprueba en un chat nuevo: editar `docs/00-ANTES.md` falla, e instalar un
paquete pregunta.

### Fase 6.2 — El hook que bloquea

`.claude/hooks/bloquear-peligroso.js`, copiado del anexo de la spec. Bloquea,
en `Bash` y en `PowerShell`, `git reset --hard`, `git checkout --`,
`git restore`, `git push --force` o con `+rama`, `git clean -f` y borrar
carpetas enteras (`rm -rf` y sus variantes, `Remove-Item -Recurse`, `rd /s`),
en cualquier parte de un comando; y al `tech-lead` si intenta leer `docs/`. Se
prueba con `node .claude/hooks/probar-hooks.js` antes de registrarlo, y en un
chat nuevo nombrando cada consola. Llena la fila 5 de la tabla.

### Fase 6.3 — Las pruebas como señal

Vitest, el script `npm test` y dos o tres pruebas de una función pura que
elige el alumno. El `npm install` pasa por la regla ask: lo aprueba el alumno.
El hook `Stop` del anexo. El `CLAUDE.md` deja de decir que no hay pruebas: se
cierra el defecto 3. El agente deja propuesto un pedido que rompe una de sus
pruebas; en un chat nuevo se le hace ese pedido sin dejarle tocar las pruebas,
y se ve al hook mandarlo de vuelta.

### Fase 6.4 — Deshacer, y cerrar la red

El agente cambia un título con su herramienta de edición y `/rewind` lo
deshace. Después cambia un archivo con la consola: `/rewind` no lo ve, y se
deshace con `git restore`. Al final, deny sobre `.claude/settings.json` y
`.claude/hooks/`. El sandbox es opcional, fuera de Windows nativo.

### Lo que la sesión decide y conviene decir

* **El defecto 4 pasa entero a la sesión 7.** El inventario decía "S6 / S7".
  Los permisos de hoy son los del agente, no los de la app: proteger `/admin` es
  código de la app, y no entra en cuatro fases.
* **Los hooks se dan escritos.** El alumno los entiende, los prueba a mano y los
  comprueba con el agente. No los inventa en clase.

---

## La cantera

| Pieza del ejemplar | Para qué se usa hoy |
|---|---|
| [`mercadotech-automatic-validator`](../../mercadotech/.claude/skills/mercadotech-automatic-validator/SKILL.md) | El portero binario que funciona solo si el agente lo invoca. Compararlo con un hook que se ejecuta pase lo que pase es la lección del bloque 01 |
| Los greps de arquitectura del [`CLAUDE.md`](../../mercadotech/CLAUDE.md) del ejemplar | Ejemplo de comprobación que un hook podría exigir |
| La suite del ejemplar, 313 pruebas | Qué significa "señal en verde". Se cita, no se copia |

---

## Si algo falla (tabla de apoyo para el docente)

| Síntoma | Qué hacer |
|---|---|
| "Ignoring … permissions.allow entries … not been trusted" | Aceptar la confianza del proyecto al abrir Claude Code. deny y ask ya funcionaban |
| El agente editó un archivo que estaba en deny | La ruta no coincide: `./docs/…` y `/docs/…` no son lo mismo. `/permissions` la muestra |
| El hook no bloquea nada | `/hooks` para ver qué quedó registrado; `node .claude/hooks/probar-hooks.js` |
| Un comando pasó y el aviso dice `PowerShell` | La regla o el matcher solo dicen `Bash`: agregar la gemela `PowerShell(...)` y `PowerShell` al matcher |
| El hook bloquea un `cat >>` que solo menciona `git reset --hard` | Escribir ese archivo con la herramienta de edición |
| El hook bloquea un `git restore` | Correrlo el alumno en su terminal |
| `node: command not found` en un hook | Node no está en el PATH de la consola de los hooks |
| Windows sin Git Bash: el hook no hace nada | Instalar Git for Windows, o registrar el hook en forma exec (spec, "Si algo falla") |
| El Tech Lead se niega con 0 herramientas | Lo frenó su archivo, no el hook. Pedirle que lo intente; si no, vale `probar-hooks.js` |
| El Tech Lead lee `docs/` igual | El `name:` de su archivo tiene que ser `tech-lead` |
| No aparece el aviso del hook `Stop` | Usar el pedido que dejó el Paso 1, sin dejarle tocar pruebas ni correr `npm test` |
| `Expected` y `Received` parecen iguales | Espacio no separable en el formato de moneda |
| El agente borró una prueba para que pase | `git restore`, y pedirle que corrija el código |
| `/rewind` no ofrece restaurar el código | El cambio fue por la consola: `git restore` |
| `/sandbox` no está disponible | Windows nativo o WSL1: es lo esperado. En Linux, faltan `bubblewrap` y `socat` |

La tabla completa está en la spec.

---

## Restricciones de la sesión

* No se toca el modo de aprobación ni se usa `bypassPermissions`.
* No se corrige el defecto 4: sesión 7.
* No se escriben pruebas de páginas, de base de datos ni E2E: *AI Agentic
  Engineer*.
* No se toca el CI: sesión 7. No se empaqueta nada: sesión 8.
* No se mide costo.
* No se modifica el Tech Lead.

## Entregables de la sesión

1. `.claude/settings.json` con permisos y dos hooks.
2. `.claude/hooks/` con los dos hooks y `probar-hooks.js`.
3. `docs/PERMISOS.md`.
4. Vitest, `npm test` y un archivo de pruebas en verde.
5. El `CLAUDE.md` con la regla de pruebas al día.
6. La fila 5 de `docs/DECISIONES.md`.
7. La entrada de la sesión 6 en `docs/BITACORA.md`.

---

## Lo que falta antes de dar el laboratorio

* **Ensayar lo interactivo**: `/permissions`, `/hooks`, `/rewind` y la pantalla
  de aprobación, en el entorno de los alumnos.
* **Cronometrar las cuatro fases.** El plan pide que ninguna pase de 30 minutos.
* **Avisar a la sesión 7** de que recibe el defecto 4 entero.

---

## Fuentes y fecha de consulta

Consultadas el 18 de noviembre de 2026, y de nuevo el 20 (PowerShell, hooks por sistema, sandbox):

* Permisos: <https://code.claude.com/docs/en/permissions>
* Modos de permisos: <https://code.claude.com/docs/en/permission-modes>
* Configuración: <https://code.claude.com/docs/en/settings>
* Hooks: <https://code.claude.com/docs/en/hooks> y <https://code.claude.com/docs/en/hooks-guide>
* Sandbox: <https://code.claude.com/docs/en/sandboxing>
* Checkpoints: <https://code.claude.com/docs/en/checkpointing>
* Herramientas, sección PowerShell: <https://code.claude.com/docs/en/tools-reference>
