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
