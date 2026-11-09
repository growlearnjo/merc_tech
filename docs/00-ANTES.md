# 00 — ANTES

Punto de partida de MercadoTech Lite, registrado en la Fase 1.1 (2026-11-09).
Cada dato va con el comando o la pantalla de donde salió.

## 1. Entorno

| Herramienta | Comando | Salida real | Requisito |
|---|---|---|---|
| Node | `node --version` | `v24.11.1` | Mínimo 20: cumple |
| npm | `npm --version` | `11.6.2` | Viene con Node |
| Git | `git --version` | `git version 2.51.0.windows.1` | Cumple |
| Claude Code | `claude --version` | `2.1.206 (Claude Code)` | Cumple |
| Autenticación | `claude auth status` | `loggedIn: true`, `authMethod: claude.ai`, `subscriptionType: max` | Cumple |
| Memoria global | `ls ~/.claude/CLAUDE.md` | `No such file or directory` | No debe existir: cumple |

No se instaló nada: no faltaba ningún requisito.
La carpeta del proyecto todavía no es un repositorio git (no tiene `.git`).

## 2. Cómo pago

Tengo un plan de suscripción de claude.ai, no saldo de API. Cuando se agota, el
agente se detiene hasta que se reinicie la ventana semanal; no me cobran más.

- **Plan = techo de uso.** Pago una cuota fija; el límite es cuánto puedo usar
  por ventana de tiempo.
- **Saldo de API = techo de dinero.** Pago por token; cada turno, incluidos los
  errores del agente, cuesta dinero mientras quede saldo.
- **Lo que me va a frenar primero:** el límite de uso del plan, no el dinero.

**Comando de costo:** `/cost` abre el panel "Account & Usage". El 2026-11-09 mostró:

| Campo | Valor |
|---|---|
| Plan | `Claude Ultra` (`claude auth status` dice `subscriptionType: max`; los dos nombres no coinciden) |
| Weekly (7 day) | `26%`, se reinicia el sábado 14 de noviembre a las 5:59 AM |
| Weekly Fable | `3%`, se reinicia el sábado 14 de noviembre a las 5:59 AM |
| Mayor consumo (24 h, solo esta máquina) | `/anthropic-skills:pptx` 28 %, servidores MCP ~35k tokens por request |

El panel mide **porcentaje del plan**, no dólares ni tokens por conversación.
Para medir la Fase 1.2 hay que anotar el `%` semanal justo antes y justo
después de la generación, y la diferencia es el costo. Si hace falta más
detalle, la otra fuente es la página de uso de claude.ai.

## 3. Modo de aprobación

Modos que ofrece esta instalación (`claude --help`, opción `--permission-mode`),
ordenados de "pregunta por todo" a "actúa sin preguntar". En
`~/.claude/settings.json` no hay ningún `defaultMode` configurado.

| # | Modo | Qué hace |
|---|---|---|
| 1 | `plan` | Solo lee y propone un plan; no edita ni ejecuta hasta que apruebo. |
| 2 | `manual` | Pide permiso para cada edición y cada comando. |
| 3 | `acceptEdits` | Edita archivos sin preguntar; los comandos los pregunta. |
| 4 | `auto` | Un clasificador decide en segundo plano qué se aprueba solo y qué se pregunta. |
| 5 | `dontAsk` | No pregunta: rechaza todo lo que no esté preaprobado en las reglas. |
| 6 | `bypassPermissions` | Todo sin preguntar; la ayuda lo recomienda solo para entornos aislados sin internet. |

**Modo elegido: `auto`.**

**Riesgo que acepto:** durante la generación, el clasificador puede aprobar solo
un `npm install` de paquetes que el encargo no pidió, lo que ejecuta sus scripts
de instalación en mi máquina, o sobrescribir archivos del proyecto sin
preguntarme, porque los considera trabajo rutinario.

## Criterio para elegir modelo

- Vale pagar por más capacidad cuando el error cuesta más que el modelo: una
  migración de datos, un cambio de arquitectura, seguridad o pagos.
- No vale cuando el error es barato y se nota enseguida: renombrar, documentar,
  código repetitivo.
- La pregunta es cuánto cuesta que salga mal y cuánto tardo en notarlo. La
  elección medida se hace en la sesión 3.
