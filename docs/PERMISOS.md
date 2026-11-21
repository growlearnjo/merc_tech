Para qué sirve: dice, acción por acción, qué hace el agente solo, qué te pregunta y qué no hace nunca, con el origen de cada regla; las reglas viven en `.claude/settings.json`, donde Claude Code las aplica sin depender de que el agente se acuerde.

| # | Acción | Lista | Regla exacta | De dónde sale |
|---|---|---|---|---|
| 1 | Chequear tipos | `allow` | `Bash(npm run typecheck)` · `PowerShell(npm run typecheck)` | `CLAUDE.md:9`: "lo único que se puede afirmar es que `typecheck` y `build` terminaron sin error" |
| 2 | Compilar | `allow` | `Bash(npm run build)` · `PowerShell(npm run build)` | `CLAUDE.md:9`, la misma regla |
| 3 | Instalar un paquete con nombre | `ask` | `Bash(npm install *)` · `PowerShell(npm install *)` | Riesgo de la sesión 1 (`docs/00-ANTES.md` §3, líneas 55-57) y `CLAUDE.md:16-17`: "No agregues … dependencias … pregunta antes" |
| 4 | `npm install` sin argumentos | `ask` | `Bash(npm install)` · `PowerShell(npm install)` | Riesgo de la sesión 1: la dependencia puede entrar editando `package.json` e instalarse con el comando sin argumentos |
| 5 | Instalar con el alias `i` | `ask` | `Bash(npm i *)` · `PowerShell(npm i *)` | Riesgo de la sesión 1: el mismo `npm install` con otro nombre |
| 6 | Instalar con el alias `add` | `ask` | `Bash(npm add *)` · `PowerShell(npm add *)` | Riesgo de la sesión 1: el mismo `npm install` con otro nombre |
| 7 | Publicar en el remoto | `ask` | `Bash(git push *)` · `PowerShell(git push *)` | Lo que sale de mi máquina: ni `/rewind` ni git lo deshacen |
| 8 | `git push` sin argumentos | `ask` | `Bash(git push)` · `PowerShell(git push)` | Lo que sale de mi máquina, igual que la fila 7 |
| 9 | Editar la foto de la sesión 1 | `deny` | `Edit(./docs/00-ANTES.md)` | Archivo que los prompts del curso repiten que no se toca |
| 10 | Editar las mediciones | `deny` | `Edit(./docs/MEDICIONES.md)` | Archivo que los prompts del curso repiten que no se toca (cerrado en la sesión 3) |
| 11 | Editar `package.json` | `ask` | `Edit(./package.json)` | `CLAUDE.md:16-18`: "pregunta antes" y "`git diff package.json` sale vacío" |

Por qué cada regla de comando está dos veces: en Windows el agente tiene dos consolas, `Bash` (Git Bash) y `PowerShell`, y elige cuál usar; una regla `Bash(...)` no alcanza a la herramienta `PowerShell`, así que una regla escrita una sola vez deja abierta la otra consola (decisión 18 de la sesión 6). Por eso cada regla de comando tiene su gemela `PowerShell(...)`, con la misma lista y el mismo origen. En macOS y Linux la gemela no estorba, y el archivo se commitea para todo el equipo. Las reglas `Edit(...)` van una sola vez porque el `deny` de `Edit` frena también lo que se escribe desde cualquiera de las dos consolas (decisión 19). Y no hay ningún `deny` de comandos porque un `deny` de `Bash` con patrón apaga la consola `PowerShell` sin avisar (decisión 20): lo destructivo lo frenará el hook de la Fase 6.2.

## El hook

`.claude/hooks/bloquear-peligroso.js`, registrado en `.claude/settings.json` como `PreToolUse` con el matcher `Bash|PowerShell|Read|Grep|Glob`. Claude Code lo corre antes de cada comando y de cada lectura, aunque nadie lo invoque y aunque el modelo no quiera. Sale con 2 y bloquea, o sale con 0 y deja pasar. Se prueba con `node .claude/hooks/probar-hooks.js`, que le pasa 22 eventos falsos y no ejecuta ninguno.

**Qué bloquea.** Dos cosas y ninguna más:

1. En cualquier parte de un comando, también después de `&&` o `;`: `git reset --hard`; `git checkout --` y `git restore` sin `--staged`, que descartan cambios; `git push --force` o con `+rama`; `git clean -f`; y borrar una carpeta entera (`rm -rf`, `rm -r -f`, `rm --recursive --force`, `Remove-Item -Recurse` y sus alias, `rd /s`, `del /s`).
2. `Read`, `Grep` o `Glob` sobre `docs/` cuando quien los usa es el subagente `tech-lead`. La conversación principal sí lee `docs/`.

Si recibe un evento que no puede leer, también bloquea: un hook roto no abre la puerta.

**En qué consolas.** En las dos que tiene el agente en Windows, `Bash` (Git Bash) y `PowerShell`, que es la principal. El matcher nombra `PowerShell` y el hook revisa las dos, porque un hook que solo mira `Bash` nunca se entera de lo que corre por PowerShell (decisión 18 de la sesión 6). En macOS y Linux solo existe `Bash`, y el mismo archivo sirve.

**Por qué no podía hacerlo una regla de permisos.**

- Una regla de comando compara el comando contra un patrón desde el principio: `Bash(git reset *)` no ve un `git reset --hard` escondido después de un `&&`, ni dentro de `sh -c '…'`, ni con la ruta completa del programa. Y un `deny` de `Bash` con patrón apaga la consola `PowerShell` sin avisar, por eso la matriz no tiene ninguno (decisión 20). El hook lee el comando entero.
- Una regla `Read(./docs/**)` frenaría a todos, también a la conversación principal. Las reglas no saben quién llama, y `tools` en `tech-lead.md` dice qué herramientas tiene el Tech Lead, no qué rutas lee. El evento del hook trae `agent_type`, y con eso frena solo al `tech-lead`.

**Qué no cubre.**

- **Un `Grep` del Tech Lead sin ruta, sobre todo el proyecto**, puede devolver líneas de `docs/`: el hook frena lo que nombra `docs/`, no lo que lo recorre de paso.
- **Un comando que borra o descarta por otro camino**: un script, `node -e`, `find -delete`, o cualquier programa que no esté en su lista. El hook busca texto conocido, no entiende lo que hace el comando.
- **También frena un comando que solo menciona esas palabras**, aunque no las ejecute: un `echo`, un `cat >>` o un mensaje de commit que traiga el texto de un comando peligroso queda bloqueado. Por eso los archivos de la sesión se escriben con la herramienta de edición, no con la consola (decisión 21).
