# Verificación de partida — Sesión 7

Fecha: 2026-11-20

Nota: este Prompt 0 se corrió **después** de escribir `docs/SECRETOS.md` (Fase 7.1). Por eso el commit de arranque ya es el de la 7.1 y `.claude/settings.json` ya trae las dos reglas `Read` de `.env*`.

## Versiones

- claude: 2.1.327 (mínimo 2.1.283) ✔
- node: v24.11.1 (mínimo 20) ✔
- npm: 11.6.2 (es la que va en `NPM_VERSION` del CI de la 7.2)
- git: 2.51.0.windows.1
- gh: **no instalado**. `gh --version` da "command not found" en Bash, `Get-Command gh` no lo encuentra en PowerShell, y no está en `C:\Program Files\GitHub CLI\`.
- gh conectado: **no se pudo comprobar**, porque `gh` no está instalado.

## Sistema operativo y consolas del agente

- Windows 11 Home Single Language 10.0.22621
- Consolas: `Bash` (Git Bash) y `PowerShell`; PowerShell es la principal.

## Commit de arranque

`c0f976d docs: add the secrets governance table for Fase 7.1` · `git status -sb`: `## main...origin/main [ahead 1]`, con `.claude/settings.json` modificado (las dos reglas `Read` que pegó la persona). **No está subido**: va un commit por delante del remoto.

## Mi repositorio

`origin  https://github.com/growlearnjo/merc_tech3.git` (fetch y push)

## La red de la sesión 6

Lista `deny`, citada (con las dos reglas de la 7.1 ya pegadas, sin commitear):

```json
"deny": [
  "Edit(./docs/00-ANTES.md)",
  "Edit(./docs/MEDICIONES.md)",
  "Read(./.env)",
  "Read(./.env.*)"
]
```

- Matcher de `PreToolUse`: `Bash|PowerShell|Read|Grep|Glob`. Nombra PowerShell ✔
- `git push` en `ask` en las dos consolas: `Bash(git push *)`, `PowerShell(git push *)`, `Bash(git push)`, `PowerShell(git push)` ✔
- `node .claude/hooks/probar-hooks.js`: **22 de 22 casos dan lo esperado.** ✔
- Hook `Stop`: **no existe**. `hooks` solo tiene `PreToolUse`, y `.claude/hooks/` solo tiene `bloquear-peligroso.js` y `probar-hooks.js`. El hook `Stop` corre las pruebas, y el proyecto no tiene pruebas (ver abajo).
- Veredicto de la red: es de la **versión 2** en lo que pide la sesión 7 (matcher con PowerShell, `git push` en `ask` en las dos consolas, `probar-hooks.js`). Le falta el hook `Stop`.

## Pruebas

`npm test`: **no existe**. `grep -c '"test"' package.json` devuelve 0, igual que dice `CLAUDE.md:8-10`. La 7.2 (el CI corre `npm test`) y la 7.3 (el defecto 4 se cierra con pruebas) dependen de esto.

## `.gitignore` y workflows

- `.env*` está excluido (`.gitignore:14`, además de `.env*.local` en `:13`). La base `data/` también (`.gitignore:17`, además de `*.db` en `:18`). ✔
- `.github/workflows/`: no existe todavía. ✔

## Cómo pago Claude y qué secreto toca

`docs/00-ANTES.md` §2:

> Tengo un **plan Max** de Claude con sesión de claude.ai, no saldo de API.

Secreto de la Fase 7.2: **`CLAUDE_CODE_OAUTH_TOKEN`**, generado con `claude setup-token`.

## La regla de seguridad del `CLAUDE.md`

(`CLAUDE.md:33-36`)

> - `/admin` y `createProductAction` exigen un usuario administrador. Hoy no se cumple:
>   `admin/page.tsx:10` está abierta, `actions.ts:107-123` no llama a `getCurrentUser()`,
>   y `users` no tiene columna de rol. No digas que el panel está protegido.
>   Verificación: `grep -nE "getCurrentUser|isAdmin|role" src/app/admin/*.tsx` debe devolver algo.

## Veredicto

Listo para la 7.1 (ya hecha), **no listo para la 7.2**: faltan `gh` instalado y conectado, `npm test` con pruebas y el hook `Stop`, y hay que subir el commit pendiente.
