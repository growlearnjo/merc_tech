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
La carpeta del proyecto es un repositorio git: al cerrar la sesión 1 tiene
cuatro commits (`git log --oneline`), con la rama `main` conectada a `origin`.

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

## FACTURA

Generación de MercadoTech Lite (Fase 1.2), 2026-11-09. Los datos los midió el
usuario; no son estimaciones del agente.

| Dato | Valor |
|---|---|
| Costo de esta conversación (`/cost`) | 26 % → 26 % de uso semanal del plan; por debajo de la resolución del indicador. Sin medir en dólares (plan de Claude, no saldo de API) |
| Duración | 12 minutos |
| Turnos en que hubo que corregir o recordar algo al agente | 0 |
| Veces que el agente pidió aprobación | 0 preguntas del agente; avisos de permiso del modo `auto`: no contados |

## INVENTARIO DE DAÑOS

Auditoría de la Fase 1.3, 2026-11-09, en una conversación distinta de la que
generó la app. **No se corrigió ningún archivo de la app.** Cada fila lleva el
comando ejecutado y su salida real, recortada.

**Dos ajustes al instrumento antes de leer la tabla.** Los greps de
`ENCARGO_LITE.md` §3 se escribieron para una app con `app/` y `components/` en
la raíz y con cliente de Supabase. Esta app vive en `src/` y usa `node:sqlite`:

- Con las rutas literales, el grep falla:
  `grep -rl "createClient\|from(" app components --include="*.tsx"` →
  `grep: app: No such file or directory` (exit 2).
- Por eso cada fila trae el grep del encargo **apuntado a `src/`** y, cuando el
  patrón era de Supabase (`createClient`, `.limit(`, `.range(`), un grep
  equivalente para SQLite (`getDb`, `.prepare(`, `LIMIT`).

### Tabla

| # · Defecto | Comando → salida real | ¿Apareció? | Se cierra en |
|---|---|---|---|
| 1 · Componentes que consultan la base directamente | `grep -rl "createClient\|from(" src --include="*.tsx"` → `src/app/page.tsx`. Es un **falso positivo**: el único `from(` es `page.tsx:116  Array.from({ length: 8 }, …`. Equivalente SQLite: `grep -rnE "getDb\|DatabaseSync\|\.prepare\(\|node:sqlite" src --include="*.tsx"` → sin resultados (exit 1). `grep -rlE "getDb\(\|\.prepare\(" src` → `src/app/actions.ts`, `src/lib/auth.ts`, `src/lib/data.ts`, `src/lib/db.ts`. | **No, en su forma literal.** Ningún `.tsx` toca la base: las páginas importan funciones de `src/lib/data.ts` (`grep -rn "@/lib/data" src --include="*.tsx"` → 7 archivos). **Queda una forma parcial:** `grep -c "\.prepare(" src/app/actions.ts` → `9`. Las Server Actions mezclan SQL y reglas de negocio (stock, total, checkout en transacción, `actions.ts:83-116`) en un solo archivo. | S2 / S5 |
| 2 · Valores ajustables incrustados | `ls -d src/lib/constants` → `No such file or directory`. Grep del encargo en `src`: `grep -rnE "\.limit\(\|\.range\(\|0\.18\|S/ " src/app src/components` → sin resultados (no hay paginación ni IGV). Números sueltos: `actions.ts:135  if (password.length < 8)` **y** `AuthCard.tsx:28  minLength={isLogin ? undefined : 8}` (el mismo límite en dos sitios); `actions.ts:133`, `:179`, `:182  length < 2`; `StockBadge.tsx:5  if (stock <= 5)`; `auth.ts:6  SESSION_DAYS = 30`; `cart.ts:39  maxAge: 60 * 60 * 24 * 14`; `page.tsx:116  length: 8`; `db.ts:167  busy_timeout = 5000`. Moneda y zona: `money.ts:1-3  "es-PE"`, `"PEN"`; `dates.ts:1,4  "es-PE"`, `"America/Lima"`. | **Sí.** No hay carpeta de constantes y el mínimo de contraseña está duplicado entre servidor y cliente. Atenuante: la moneda sí está centralizada en `formatPEN` (`src/lib/money.ts`). | S2 / S5 |
| 3 · Cero pruebas | `find . -path ./node_modules -prune -o \( -name "*.test.*" -o -name "*.spec.*" -o -name "__tests__" \) -print` → sin resultados. `npm test` → `npm error Missing script: "test"`. `grep -nE "jest\|vitest\|playwright\|testing-library\|mocha" package.json` → sin resultados (exit 1). | **Sí.** | S6 |
| 4 · Seguridad abierta | **(a) Admin sin control:** `grep -nE "getCurrentUser\|redirect\|role\|isAdmin" src/app/admin/page.tsx` → sin resultados (exit 1). `createProduct` (`actions.ts:171-195`) escribe en `products` sin llamar a `getCurrentUser`. `grep -nE "role\|is_admin\|admin" src/lib/db.ts src/lib/auth.ts` → sin resultados: no existe el concepto de administrador. El propio código lo admite en `admin/page.tsx:13` (`⚠️ Sin control de acceso, a pedido para la demo`). `Header.tsx:22` y `:83` muestran el enlace "Administrar" a todo visitante. **(b) Contraseñas:** `grep -rniE "bcrypt\|argon\|scrypt\|hash" package.json src/app src/lib` → `src/lib/auth.ts:12  crypto.scryptSync(password, salt, 64)` con sal aleatoria (`auth.ts:11`); se guarda en `users.password_hash`. **(c) Sesión:** `grep -rn "localStorage\|sessionStorage" src` → sin resultados (exit 1); `grep -rn "document.cookie" src` → sin resultados. La sesión es un token aleatorio en cookie `httpOnly` (`auth.ts:30-42`) validado contra la tabla `sessions` (`auth.ts:57-63`). | **Sí, por la forma (a).** Cualquier persona, incluso sin cuenta, puede crear productos desde `/admin`. Las formas (b) y (c) **no** aparecieron. | S6 / S7 |
| 5 · **Extra:** el filtro por categoría ya existe | `grep -rn "sp.cat\|params.set(\"cat\"" src` → `src/app/page.tsx:42  const cat = typeof sp.cat === "string" ? sp.cat : "";` y `page.tsx:51  if (c) params.set("cat", c);`. `src/lib/data.ts:28-30` filtra con `WHERE category = ?`. | **Sí.** El catálogo ya filtra por categoría con `?cat=` en la URL, y eso es justo la tarea patrón de la Fase 1.4. Según `Ed5_sesion1.md` (verificación 1.2, punto 5), **hay que avisar al docente: el enunciado de la 1.4 cambia.** | Aviso al docente antes de la 1.4 |
| 6 · **Extra:** la app no está en git | `git log --oneline` → solo `2d65943 Initial commit from Create Next App`. `git status --short` → `src/app/actions.ts`, `src/app/admin/`, `src/components/`, `src/lib/` aparecen como `??` (sin seguimiento), y `src/app/page.tsx`, `package.json` como ` M`. | **Sí.** El "antes" generado en la 1.2 no tiene commit: si alguien toca un archivo, no hay versión a la cual volver ni con qué comparar en la S5. | Commitear la app tal cual antes de la 1.4 (decisión del usuario) |

### Comandos exactos para repetir la auditoría

Dentro de una tabla, Markdown muestra `\|` como `|`. En los greps sin `-E`, esa
barra invertida es la que hace la alternancia, así que conviene copiarlos de
aquí. Se ejecutan en Git Bash desde la raíz del proyecto:

```bash
grep -rl "createClient\|from(" src --include="*.tsx"                    # D1, encargo
grep -rnE "getDb|DatabaseSync|\.prepare\(|node:sqlite" src --include="*.tsx"  # D1, SQLite
grep -c "\.prepare(" src/app/actions.ts                                  # D1, forma parcial
ls -d src/lib/constants                                                  # D2
grep -rnE "\.limit\(|\.range\(|0\.18|S/ " src/app src/components         # D2, encargo
grep -rnE "length < (2|8)|minLength|stock <= 5|SESSION_DAYS|maxAge" src   # D2, números sueltos
find . -path ./node_modules -prune -o \( -name "*.test.*" -o -name "*.spec.*" \) -print  # D3
npm test                                                                 # D3
grep -nE "getCurrentUser|redirect|role|isAdmin" src/app/admin/page.tsx   # D4a
grep -rniE "bcrypt|argon|scrypt|hash" package.json src/app src/lib       # D4b
grep -rn "localStorage\|sessionStorage" src                              # D4c
grep -rn "sp.cat\|params.set(\"cat\"" src                                # 5
git status --short                                                       # 6
```

### Defectos que no aparecieron, y la decisión que los evitó

No los evité yo: esta conversación solo auditó. La decisión la tomó el agente
que generó la app en la Fase 1.2, y se ve en el código:

- **Defecto 1, forma literal:** el agente puso todas las lecturas en
  `src/lib/data.ts` y la conexión en `src/lib/db.ts`, y las páginas solo llaman
  a esas funciones. Las escrituras, en cambio, quedaron con SQL dentro de
  `src/app/actions.ts`.
- **Defecto 4, formas (b) y (c):** usó `scrypt` de `node:crypto` (sin
  dependencias) para las contraseñas, y guardó la sesión en el servidor (tabla
  `sessions`, con el token hasheado con SHA-256 en `auth.ts:24-26`) en vez de
  en el navegador. La frase "No te compliques con los permisos" solo le hizo
  omitir la **autorización** de `/admin`, no la **autenticación**.

### Claves y secretos

`ls -a | grep -i "^\.env"` → sin resultados. Grep de asignaciones literales
(`api_key|secret|token|password` = cadena de 6 o más caracteres) en `src` →
sin resultados (exit 1). No hay claves que reportar.
