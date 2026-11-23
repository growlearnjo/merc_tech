Para qué sirve: dice qué hace el agente solo, qué me pregunta y qué no hace nunca, con el origen de cada regla; las reglas viven en `.claude/settings.json`.

| # | Acción | Lista | Regla exacta | De dónde sale |
|---|---|---|---|---|
| 1 | Editar la foto de la sesión 1 | deny | `Edit(./docs/00-ANTES.md)` | Archivo que no se toca: `docs/00-ANTES.md` |
| 2 | Editar las mediciones cerradas | deny | `Edit(./docs/MEDICIONES.md)` | Archivo que no se toca: `docs/MEDICIONES.md` (cerrada en S3) |
| 3 | Instalar un paquete | ask | `Bash(npm install *)` | Riesgo de la sesión 1, `docs/00-ANTES.md:55-57` |
| 4 | Instalar un paquete (alias corto) | ask | `Bash(npm i *)` | Riesgo de la sesión 1, `docs/00-ANTES.md:55-57` |
| 5 | Instalar un paquete (alias `add`) | ask | `Bash(npm add *)` | Riesgo de la sesión 1, `docs/00-ANTES.md:55-57` |
| 6 | Editar `package.json` a mano (dependencias, versiones) | ask | `Edit(./package.json)` | `CLAUDE.md:16-17`: "dependencias ni cambios de versión… pregunta antes" |
| 7 | Subir versiones de dependencias | ask | `Bash(npm update *)` | `CLAUDE.md:16-17`: "cambios de versión… pregunta antes" |
| 8 | Borrar la base de la app | ask | `Bash(npm run db:reset)` | `CLAUDE.md:7`: "`npm run db:reset` (borra `data/`)" |
| 9 | Chequeo de tipos | allow | `Bash(npm run typecheck)` | `CLAUDE.md:9`: "`typecheck` y `build` terminaron sin error" |
| 10 | Build | allow | `Bash(npm run build)` | `CLAUDE.md:9`: "`typecheck` y `build` terminaron sin error" |
| 11 | Ver el diff | allow | `Bash(git diff *)` | `CLAUDE.md:18`: "Verificación: `git diff --stat`… `git diff package.json`" |
| 12 | Correr las pruebas | allow | `Bash(npm test)` | Fase 6.3: el hook `Stop` las exige, y no tiene sentido preguntar |
| 13 | Publicar en el remoto | ask | `Bash(git push *)` | Lo que sale de mi máquina: ni `/rewind` ni git lo deshacen (sesión 6 v2, cuarto origen) |
| 14 | Editar la configuración de la red | deny | `Edit(./.claude/settings.json)` | Fase 6.4: la red la cambia la persona, no el agente |
| 15 | Editar los hooks | deny | `Edit(./.claude/hooks/**)` | Fase 6.4: lo mismo |
| 16 | Leer `.env` | deny | `Read(./.env)` | Fase 7.1, pegada a mano: ver `docs/SECRETOS.md` |
| 17 | Leer `.env.*` | deny | `Read(./.env.*)` | Fase 7.1, pegada a mano |

**Las mismas reglas para PowerShell.** En Windows, Claude Code tiene dos consolas, `Bash` y `PowerShell`, y el modelo elige cuál usar. Una regla `Bash(...)` no alcanza a la herramienta `PowerShell`, que tiene sus propias reglas (documentación oficial, sección PowerShell de Permissions). Por eso las filas de comandos (3 a 5, 7 a 13) están repetidas en `.claude/settings.json` como `PowerShell(...)`, con la misma lista y el mismo origen. Las de `Edit` y `Read` van una sola vez: se comprobó que también frenan lo que escribe o lee PowerShell (decisión 19 de la sesión 6 y 15 de la sesión 7). Se descubrió en la prueba de la Fase 6.2: el modelo corrió `git reset --hard HEAD` con `PowerShell` y nada lo frenó.

## El hook

`.claude/hooks/bloquear-peligroso.js`, registrado en `.claude/settings.json` con `PreToolUse` y el matcher `Bash|PowerShell|Read|Grep|Glob`. Claude Code lo corre antes de cada comando de consola y de cada lectura, lo invoque alguien o no. Exit 2 bloquea, y el motivo le llega al agente.

| Qué bloquea | Por qué no alcanzaba una regla de permisos |
|---|---|
| En `Bash` y en `PowerShell`, **en cualquier parte** del comando: `git reset --hard`; `git checkout --` y `git restore` sin `--staged`; `git push --force`, `-f` o con `+rama`; `git clean -f`; y borrar una carpeta entera (`rm -rf`, `rm -r -f`, `rm --recursive --force`, `Remove-Item -Recurse`, `rd /s`) | Una regla `Bash(...)` compara contra un patrón desde el inicio del comando: `Bash(git reset --hard *)` no ve `git status && git reset --hard HEAD`, ni el mismo programa por `sh -c '…'` o por su ruta completa. El hook lee el comando entero. |
| `Read`, `Grep` o `Glob` sobre `docs/` **cuando los usa el subagente `tech-lead`** | Un `deny` de `Read(./docs/**)` vale para todos y dejaría ciega a la conversación principal, que necesita `docs/`. Las reglas no saben quién llama; el evento del hook trae `agent_type`. Y `tools:` en `.claude/agents/tech-lead.md` limita qué herramientas usa, no dónde. |

Desde el 2026-11-20 el hook es el de la versión 2.1 del anexo de la sesión 6 (commit `07e4a4a`), más la letra de la unidad en mayúscula en el hook de pruebas (`b1accc4`). `node .claude/hooks/probar-hooks.js` da 23 de 23.

Qué **no** cubre:

- **Un `Grep` o `Glob` del Tech Lead sin ruta, sobre todo el proyecto**, puede devolver líneas de `docs/`. El hook frena lo que *nombra* `docs/` (en `file_path`, `path` o `pattern`), no lo que lo recorre de paso.
- **Un comando que borra o descarta por otro camino**: un script, un `node -e`, un `find -delete`. El hook busca texto en el comando, no entiende lo que hace el programa.
- **Por lo mismo, también frena un comando que solo menciona esas palabras.** Pasó al escribir esta sección en la 6.2: un `cat >> docs/PERMISOS.md` con este texto quedó bloqueado. Los archivos se escriben con la herramienta de edición.
- **Si el evento no se puede leer, bloquea** (versión 2): un hook roto cierra la puerta. El de pruebas, en cambio, deja pasar con un aviso, porque un `Stop` que siempre dice "no" dejaría al agente en un bucle.
- **El Tech Lead se niega a leer `docs/` antes de que el hook actúe**: lo dice su propio archivo. En la comprobación de la 6.2 respondió sin usar ninguna herramienta. La prueba del hook con el Tech Lead es la de `probar-hooks.js`.

## Deshacer

| Qué salió mal | Con qué se deshace | Qué no deshace |
|---|---|---|
| Algo que el agente editó con su herramienta de edición | `/rewind` (o Esc dos veces), eligiendo restaurar el código | — |
| Algo que cambió por la consola (`>>`, `sed`, `Add-Content`, `npm install`), lo que hizo un subagente, o lo que edité yo a mano | `git restore`, que corro **yo, en mi terminal**: desde la 6.2 el hook no deja que lo corra el agente | `/rewind` no lo ve |
| Algo que ya salió de mi máquina: un push, la base de datos | Nada lo deshace del todo. Por eso `git push` está en `ask` | ni `/rewind` ni git |

**En este ensayo la parte de `/rewind` no se ejecutó**: la Fase 6.4 se cerró sin correr sus pasos 1 y 2, que son interactivos. Lo de la tabla sale de la documentación y de la spec de la sesión 6.

**La red, protegida.** Las filas 14 y 15 ponen en `deny` `.claude/settings.json` y `.claude/hooks/`: el agente ya no puede quitar las reglas que lo frenan. Se agregaron el 2026-11-20 (commit `07e4a4a`). Desde ahí, los cambios a la red los hice yo, a mano: las dos reglas de `.env` de la 7.1 y la letra de la unidad del hook de pruebas.

**Lo que no frena el `deny`:** un programa que escribe el archivo por dentro, como un `node -e`. Es el mismo hueco que la 7.1 encontró al leer `.env.local`.

**El sandbox, en mi sistema.** Trabajo en Windows nativo: el sandbox de Claude Code no existe aquí, y los comandos corren sin aislar. Existe en macOS, Linux y WSL2 (en Linux y WSL2, con `bubblewrap` y `socat`). La red de hoy no depende de él.
