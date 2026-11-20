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

**Las mismas reglas para PowerShell.** En Windows, Claude Code tiene dos consolas, `Bash` y `PowerShell`, y el modelo elige cuál usar. Una regla `Bash(...)` no alcanza a la herramienta `PowerShell`, que tiene sus propias reglas (documentación oficial, sección PowerShell de Permissions). Por eso las filas 3 a 5 y 7 a 11 están repetidas en `.claude/settings.json` como `PowerShell(...)`, con la misma lista y el mismo origen. Se descubrió en la prueba de la Fase 6.2: el modelo corrió `git reset --hard HEAD` con `PowerShell` y nada lo frenó.

## El hook

`.claude/hooks/bloquear-peligroso.js`, registrado en `.claude/settings.json` con `PreToolUse` y el matcher `Bash|PowerShell|Read|Grep|Glob`. Claude Code lo corre antes de cada comando de consola y de cada lectura, lo invoque alguien o no. Exit 2 bloquea, y el motivo le llega al agente.

| Qué bloquea | Por qué no alcanzaba una regla de permisos |
|---|---|
| `git reset --hard`, `git push --force` (o `-f`), `git clean -f` y `rm -rf` **en cualquier parte** del comando | Una regla `Bash(...)` compara contra un patrón desde el inicio del comando: `Bash(git reset --hard *)` no ve `git status && git reset --hard HEAD`, ni el mismo programa por `sh -c '…'` o por su ruta completa. El hook lee el comando entero. |
| `Read`, `Grep` o `Glob` sobre `docs/` **cuando los usa el subagente `tech-lead`** | Un `deny` de `Read(./docs/**)` vale para todos y dejaría ciega a la conversación principal, que necesita `docs/`. Las reglas no saben quién llama; el evento del hook trae `agent_type`. Y `tools:` en `.claude/agents/tech-lead.md` limita qué herramientas usa, no dónde. |

Qué **no** cubre:

- **Un `Grep` o `Glob` del Tech Lead sin ruta, sobre todo el proyecto**, puede devolver líneas de `docs/`. El hook frena lo que *nombra* `docs/` (en `file_path`, `path` o `pattern`), no lo que lo recorre de paso.
- Variantes que no calzan con los patrones, como `rm -r -f`, `rm --recursive --force` o `git checkout -- .`. Ampliar las expresiones las cubriría; no se hizo porque el hook es el del anexo, tal cual.
- Si el hook se rompe (por ejemplo, un evento que no es JSON), `JSON.parse` lanza un error, el proceso sale con 1 y Claude Code **deja pasar** con un aviso: un hook roto abre la puerta en lugar de cerrarla. Un `try/catch` que saliera con 2 la cerraría; tampoco se aplicó, por la misma razón.
- El hook busca texto, no entiende el comando: también frena uno que solo *menciona* esas palabras. Pasó al escribir esta sección: un `cat >> docs/PERMISOS.md` con este texto quedó bloqueado.
- En `PowerShell` el hook reconoce los mismos comandos de git y además `Remove-Item -Recurse -Force`, el equivalente de `rm -rf`. No reconoce otras formas de borrar, como `rd /s` o `del /s` llamados desde PowerShell.
- La documentación dice que un `deny` de `Edit` cubre lo que se escribe desde `Bash` con `>` o `>>`. No dice lo mismo de `PowerShell` (`>`, `Out-File`, `Set-Content`). No está comprobado que los `deny` de las filas 1 y 2 lo frenen.
