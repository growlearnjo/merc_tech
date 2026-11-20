# Verificación de arranque — Sesión 7

Fecha: 2026-11-20

## Versiones

- `claude --version`: 2.1.327 (mínimo 2.1.283) — OK
- `node --version`: v24.11.1 (mínimo 20) — OK
- `npm --version`: 11.6.2
- `git --version`: 2.51.0.windows.1
- `gh --version`: **no instalado** (ni en Bash ni en PowerShell). Por eso `gh auth status` no se pudo correr: gh **no está conectado**.
  Falta la tarea humana 2 de la spec: `winget install --id GitHub.cli`, abrir una terminal nueva y `gh auth login`. Lo necesita la Fase 7.4.

## Sistema operativo y consolas del agente

- Windows 11 Home Single Language 10.0.22621 (Bash es Git Bash, MINGW64).
- Consolas del agente: **las dos**, Bash y PowerShell (Windows PowerShell 5.1).
- Esta verificación se corrió desde la extensión de VS Code; la spec pide trabajar en la terminal con `claude`.

## Commit de arranque

- `git log --oneline -1`: `07e4a4a chore: bring the safety net to version 2 of Sesión 6`
- `git status -sb`: `## main...origin/main`, sin cambios pendientes.
- Después de `git fetch`: 0 commits adelante y 0 atrás de `origin/main`. Está subido.

## Repositorio

- `git remote -v`: `origin https://github.com/growlearnjo/merc_tech.git` (fetch y push).

## Red de la sesión 6

Lista `deny` de `.claude/settings.json`, citada:

```json
"deny": [
  "Edit(./docs/00-ANTES.md)",
  "Edit(./docs/MEDICIONES.md)",
  "Edit(./.claude/settings.json)",
  "Edit(./.claude/hooks/**)"
]
```

- Tiene `allow`, `ask` y `deny`, y los hooks `PreToolUse` y `Stop`.
- Matcher de `PreToolUse`: `Bash|PowerShell|Read|Grep|Glob`, nombra PowerShell — OK.
- `git push` en `ask` como `Bash(git push *)` y como `PowerShell(git push *)` — OK.
- `node .claude/hooks/probar-hooks.js`, salida final: `23 de 23 casos dan lo esperado.`
- Veredicto: la red es de la **versión 2** de la sesión 6.
- Todavía no están `Read(./.env)` ni `Read(./.env.*)` en `deny`: los agrega la Fase 7.1.

Otras comprobaciones:

- `npm test` (`vitest run`): 1 archivo, 3 pruebas, todas pasan.
- `.gitignore` excluye `.env*` (y `.env*.local`) y `data/`, además de `*.db`, `*.sqlite`, `*.sqlite3`. `git check-ignore` lo confirma para `.env`, `.env.local` y `data/`.
- `.github/workflows/` no existe (tampoco `.github/`).
- Desfase en `CLAUDE.md`: la sección "Comandos" todavía dice que no hay pruebas ni script `test`, pero `package.json:13` tiene `"test": "vitest run"`. No se tocó: queda para el cierre.

## Cómo pago Claude

De `docs/00-ANTES.md` §2, citado:

> Tengo un **plan Max** de Claude con sesión de claude.ai, no saldo de API.

Secreto de la Fase 7.2: **`CLAUDE_CODE_OAUTH_TOKEN`**, generado con `claude setup-token` y guardado por mí como secreto del repositorio en GitHub. No `ANTHROPIC_API_KEY`.

## Regla de seguridad del CLAUDE.md

> - `/admin` y `createProductAction` exigen un usuario administrador. Hoy no se cumple:
>   `admin/page.tsx:10` está abierta, `actions.ts:107-123` no llama a `getCurrentUser()`,
>   y `users` no tiene columna de rol. No digas que el panel está protegido.

## Veredicto

Terreno listo para la sesión 7, salvo `gh`: hay que instalarlo y conectarlo antes de la Fase 7.4.
