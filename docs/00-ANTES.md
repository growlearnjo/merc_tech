# 00 — ANTES: punto de partida (Fase 1.1)

Fecha: 2026-11-11. Todo lo de abajo sale de comandos ejecutados en esta máquina
(Windows 11, Git Bash). Nada medido a ojo.

## 1. Entorno

| Herramienta | Comando | Salida real | Requisito |
|---|---|---|---|
| Node | `node --version` | `v24.11.1` | Cumple el mínimo de 20. |
| npm | `npm --version` | `11.6.2` | Viene con Node. |
| Git | `git --version` | `git version 2.51.0.windows.1` | Instalado. |
| Claude Code | `claude --version` | `2.1.206 (Claude Code)` | Instalado. |
| Editor (VS Code) | `code --version` | `1.146.0` (x64) | Instalado. |
| Autenticación | `claude auth status` | `loggedIn: true`, `authMethod: claude.ai`, `subscriptionType: max` | Autenticado. |

- No se instaló nada: no faltaba ningún requisito.
- `env | grep ^ANTHROPIC` no devuelve nada: no hay clave de API en el entorno.
- La carpeta del proyecto solo contiene `curso-ed5/` (material del curso). No hay ningún proyecto previo.

## 2. Cómo pago

Tengo un **plan Max** de Claude con sesión de claude.ai, no saldo de API. Cuando
se agota, el agente se detiene hasta que se reinicie la ventana de uso. No se cobra nada extra.

- **Plan = techo de uso.** La cuota mensual es fija y el límite es de consumo. Lo que me frena es una pausa, no una factura.
- **Saldo de API = techo de dinero.** Pago por token y no hay pausa mientras quede saldo. Cada vuelta de más del agente cuesta dinero.
- **Lo que me frena primero:** el límite de uso del plan.

**Criterio para elegir modelo.** Pago por más capacidad cuando un error cuesta más
que el modelo: migraciones de datos, cambios de arquitectura, seguridad. No lo
pago para tareas mecánicas que se revisan de un vistazo: renombrar, documentar,
código repetitivo. La elección medida se hace en la sesión 3.

## 3. Modo de aprobación

Modos que ofrece esta instalación según `claude --help`, en la opción
`--permission-mode` (choices: `acceptEdits`, `auto`, `bypassPermissions`,
`manual`, `dontAsk`, `plan`). `~/.claude/settings.json` y
`~/.claude/settings.local.json` no fijan `defaultMode` ni reglas de permisos.

De "pregunta por todo" a "actúa sin preguntar":

| # | Modo | Qué hace sin preguntarme |
|---|---|---|
| 1 | `plan` | Nada. Solo lee y propone. No edita ni ejecuta hasta que apruebo. |
| 2 | `manual` | Solo lecturas. Pide permiso para cada edición y cada comando. |
| 3 | `acceptEdits` | Edita archivos. Pide permiso para los comandos. |
| 4 | `auto` | Lo que un clasificador en segundo plano juzgue seguro. El resto me lo pregunta. |
| 5 | `dontAsk` | No pregunta nunca. Lo que no está en la lista de permitidos lo **rechaza** solo. |
| 6 | `bypassPermissions` | Todo. La ayuda lo recomienda solo en entornos aislados sin internet. |

**Modo elegido: `auto`.**

**Riesgo que acepto:** el clasificador puede aprobar solo un `npm install` de una
dependencia que yo no pedí, y sus scripts de instalación se ejecutan en mi máquina
sin que yo haya visto el comando.

## 4. FACTURA (Fase 1.2: generación de la tienda)

Fecha: 2026-11-11. Esta sección la escribió el agente. Si un dato no se podía
medir desde la sesión, aparece "sin dato" y no un número estimado.

| Concepto | Valor | De dónde sale |
|---|---|---|
| Costo en dinero | **S/ 0 / US$ 0 extra** | Plan Max (sección 2): no se paga por token. |
| Consumo del plan (tokens / % de la ventana) | **sin dato** | El agente no ve su propio consumo. Correr `/cost` (o `/usage`) en la sesión y pegar aquí la salida. |
| Duración del trabajo | **≈ 12 min** (15:03:57 → 15:15:55) | Desde que se creó `package.json` hasta el último build (`.next/BUILD_ID`). No incluye el tiempo de lectura previo ni este informe. |
| Aprobaciones pedidas | **sin dato exacto** | En modo `auto` decide el clasificador y el agente no ve qué le mostró al usuario. Lo seguro: el agente no hizo ninguna pregunta directa (0 `AskUserQuestion`) y no le rechazaron ninguna llamada. Las ventanas de permiso que hayas visto, cuéntalas tú. |

Lo que se ejecutó sin aprobación explícita y aplica al riesgo de la sección 3:

- `npm install next react react-dom` y `npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss`. Después, `typescript@5` para reemplazar la 7 que trajo npm.
- Se abrió Chrome en modo headless para las pruebas E2E. El script quedó fuera del proyecto, en la carpeta temporal de la sesión.
- Varias veces `Stop-Process` sobre el servidor de prueba (puerto 3100) y `npm run db:reset`.

## 5. INVENTARIO DE DAÑOS (Fase 1.3)

Fecha: 2026-11-11. Auditoría de solo lectura: no se modificó ningún archivo de la
app. Cada fila lleva el comando ejecutado y su salida real, recortada.

**Aviso sobre los greps de `ENCARGO_LITE.md` §3.** Están escritos para la versión
Supabase del encargo: buscan en `app/` y `components/` en la raíz, y buscan
`createClient` / `.from(` / `.limit(`. Esta app vive en `src/` y usa `node:sqlite`
con SQL escrito a mano. Corridos tal cual, fallan por la ruta, no por el código:

```
$ grep -rl "createClient\|from(" app components --include="*.tsx"
grep: app: No such file or directory
grep: components: No such file or directory
```

Por eso cada fila trae el grep **literal** y uno **adaptado** a `src/` y a SQLite.
Si el docente prefiere otra adaptación, este es el punto a corregir en el encargo.

### Los cuatro defectos esperados

| # · Defecto | Comando | Salida real (recortada) | Veredicto | Se cierra en |
|---|---|---|---|---|
| 1 · Componentes que consultan la BD directamente | `grep -rl "createClient\|from(" src/app src/components --include="*.tsx"` | *(sin resultados)* | **No apareció** en su forma fuerte (ver nota 1). | S2 / S5 |
| | `grep -rnE "SELECT\|INSERT\|UPDATE\|DELETE\|queryAll\|queryOne\|getDb" src --include="*.tsx"` | *(sin resultados, exit 1)*: ningún `.tsx` tiene SQL ni abre la base. | | |
| | `grep -rlE "SELECT\|INSERT\|UPDATE \|DELETE" src --include="*.ts"` | `src/app/actions.ts` · `src/lib/auth.ts` · `src/lib/db.ts` · `src/lib/orders.ts` · `src/lib/products.ts` | **Parcial:** `actions.ts` mezcla SQL crudo con validación y flujo (líneas 34, 38, 49). | |
| | `grep -n "getDb\|prepare" src/app/actions.ts` | `5: import { getDb } from "@/lib/db";` · `33: const db = getDb();` · `34: db.prepare("SELECT 1 FROM users WHERE email = ?")` · `38: .prepare("INSERT INTO users …")` · `48: const user = getDb()` | | |
| 2 · Valores ajustables incrustados | `ls src/lib/constants lib/constants` | `ls: cannot access 'src/lib/constants': No such file or directory` (ídem `lib/constants`) | **Apareció.** | S2 / S5 |
| | `grep -rnE "\.limit\(\|\.range\(\|0\.18\|S/ " src/app src/components` | `src/app/page.tsx:32: Envío gratis en Lima desde S/ 199` | | |
| | `grep -rnE "> ?99\|> ?100\|maxLength\|defaultValue=\|SESSION_DAYS =\|12 meses" src --include="*.ts*" \| grep -v seed.ts` | `actions.ts:72: … data.length > 100` · `actions.ts:77: … qty > 99` · `actions.ts:115: name.length > 120` · `admin/ProductForm.tsx:20: maxLength={120}` · `admin/ProductForm.tsx:34: defaultValue={10}` · `components/CartButton.tsx:21: count > 99 ? "99+"` · `producto/[id]/page.tsx:61: 12 meses de garantía` · `lib/auth.ts:8: const SESSION_DAYS = 30;` | El límite `120` está duplicado en dos archivos (form y action) y `99` en dos (action y badge). | |
| 3 · Cero pruebas | `find . -path ./node_modules -prune -o -path ./.next -prune -o \( -name "*.test.*" -o -name "*.spec.*" \) -print` | *(sin resultados)* | **Apareció.** | S6 |
| | `grep -c '"test"' package.json` · `npm test` | `0` · `npm error Missing script: "test"` | Tampoco hay dependencia de testing en `package.json`. | |
| 4 · Seguridad abierta | `head -12 src/app/admin/page.tsx` · `grep -nE "getCurrentUser\|redirect\|isAdmin\|role" src/app/admin/*.tsx` | `10: // NOTA: página abierta, sin control de permisos (pedido explícito para la demo).` · grep: *(sin resultados)* | **Apareció** (forma a: `/admin` no comprueba quién la usa). | S6 / S7 |
| | `sed -n 107,125p src/app/actions.ts` | `107: export async function createProductAction(_, fd) {` … `123: const id = insertProduct({ … });` — sin `getCurrentUser()` en toda la función (sí está en `checkoutAction`, línea 84). | La Server Action que escribe productos acepta a cualquiera, incluso llamada sin pasar por la página. No hay `middleware.ts`/`proxy.ts` que la proteja (`ls` → `No such file or directory`). | |
| | `grep -rniE "bcrypt\|argon\|scrypt\|hash" package.json src/app src/lib` | `src/lib/auth.ts:14: const hash = scryptSync(password, salt, 64);` · `src/lib/db.ts:17: password_hash TEXT NOT NULL,` | Forma b **no apareció**: contraseñas con scrypt + sal. | |
| | `grep -rn "localStorage\|sessionStorage" src/app src/components` | `src/components/CartProvider.tsx:35: localStorage.getItem(STORAGE_KEY)` · `:46: localStorage.setItem(…)` | Forma c **no apareció**: lo que va a `localStorage` es el **carrito**, no la sesión. La sesión es cookie `httpOnly` con token hasheado en la tabla `sessions` (`src/lib/auth.ts:29-43`). | |

**Nota 1 — qué decisión evitó el defecto 1.** En la generación (Fase 1.2) se creó
una capa de datos en `src/lib/` (`db.ts`, `products.ts`, `orders.ts`, `auth.ts`)
y ningún componente `.tsx` ejecuta SQL: las páginas llaman funciones como
`listProducts()` o `getOrderForUser()`. Lo que queda del defecto: las páginas de
servidor siguen obteniendo datos y renderizando en el mismo archivo (ej.
`src/app/page.tsx:14`, `src/app/admin/page.tsx:12`), y `src/app/actions.ts` tiene
SQL de usuarios en línea en vez de pasar por `lib/auth.ts`.

**Nota 2 — qué decisión evitó las formas b y c del defecto 4.** Se usó
`node:crypto` (scrypt, sin dependencia extra) para las contraseñas y una sesión
del lado del servidor. Para la sesión 6, el agujero real es uno solo: el
permiso de `/admin` y de `createProductAction`.

### Problemas fuera de la lista

| # · Problema | Comando | Salida real (recortada) | Por qué importa |
|---|---|---|---|
| 5 · **La tarea patrón ya está hecha.** El catálogo ya filtra por categoría y el filtro sobrevive a la recarga (vive en la URL). | `grep -nE "category\|cat" src/app/page.tsx src/lib/products.ts` · `grep -n "filtro" README.md` | `page.tsx:10: searchParams: Promise<{ q?: string; cat?: string }>` · `page.tsx:14: listProducts({ …, category: cat \|\| undefined })` · `page.tsx:20: if (c) p.set("cat", c);` · `products.ts:23-25: where.push("category = ?")` · README: `Catálogo con búsqueda y filtro por categoría` | `TAREA_PATRON.md` §1 pide exactamente esto, y §"Por qué" dice que no debe estar en el encargo. Según `Ed5_sesion1.md` (verificación de la 1.2, punto 5) **hay que avisar al docente**: el enunciado de la 1.4 cambia. |
| 6 · **El esquema no es el de `ENCARGO_LITE.md` §2.** No existe `cart_items`; el carrito vive solo en el navegador. Hay dos tablas extra. | `grep -nE "CREATE TABLE" src/lib/db.ts` · `grep -rn "cart_items" src` | `13: users` · `21: sessions` · `27: products` · `38: orders` · `47: order_items` · `cart_items`: *(sin resultados, exit 1)* | El carrito no se guarda por usuario: se pierde al cambiar de navegador o dispositivo. Las columnas también difieren (`name` y `price_cents` en vez de `title` y `price`). Es material para el revisor de la sesión 5. |
| 7 · **El proyecto no es un repositorio git.** | `git status` | `fatal: not a git repository (or any of the parent directories): .git` | La verificación de la Fase 1.3 ("`git status` no muestra cambios fuera de `docs/`") no se puede ejecutar, y no hay forma de demostrar mañana qué cambió desde hoy. |

**Claves y secretos.** `grep -rniE "api[_-]?key|secret|password *=|token *= *['\"]|sk-|BEGIN PRIVATE" src README.md next.config.ts`
solo devuelve `src/app/actions.ts:27` y `:46`, que leen el campo del formulario
(no son claves). `find . -path ./node_modules -prune -o -name ".env*" -print`
no devuelve nada. **No se encontró ninguna clave en el proyecto.**
