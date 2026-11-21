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
