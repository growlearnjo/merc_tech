# Secretos — gobernanza (Fase 7.1)

Fecha: 2026-11-20

Para qué sirve: dice, para cada variable y cada archivo sensible del proyecto, qué es, dónde vive, quién lo lee y si puede salir al repositorio. El repositorio es público desde la sesión 1. La tabla se armó con nombres, rutas, `.gitignore` y `git grep`: **ningún `.env` se abrió y ningún valor aparece aquí**.

## Quién lee cada fila hoy

| Fila | Yo | La app | El agente | GitHub |
|---|---|---|---|---|
| `ADMIN_EMAILS` | sí, la escribo | sí, `process.env` en el servidor | no tiene por qué; si la viera, no pasa nada grave | no |
| Token de la Action | una vez, al pegarlo | no | **nunca** | sí, solo el workflow `claude-review.yml` |
| `.env.local` | sí | sí, Next.js al arrancar | bloqueado por las reglas `deny`, salvo un programa aparte | no |
| `data/tienda.db` | sí | sí, `src/lib/db.ts` | hoy no hay regla que lo impida | no |
| Archivos commiteados con rutas de mi máquina | sí | no | sí | **sí, ya públicos** |
| Correo de autor de los commits | sí | no | sí (`git log`) | **sí, ya público** |
| `.claude/settings.local.json` | sí | no | sí, lo lee Claude Code | no, pero solo por mi ignore global |
| Token de `gh` | no lo veo; lo guarda `gh` | no | puede usarlo vía `gh`, no lo lee | sí, es una credencial de GitHub |

Lo que decide: lo que el agente no tiene por qué ver no va en una carpeta que el agente puede abrir. El token de la Action nunca toca mi máquina más allá de la terminal donde se genera.

## La tabla

| Variable o archivo | Qué es | Para qué sirve | Dónde vive | Quién lo lee | ¿Secreto? | ¿Puede salir al repositorio? |
|---|---|---|---|---|---|---|
| `ADMIN_EMAILS` (nace en la 7.3) | Lista de correos separados por coma | Decide quién entra a `/admin` y quién puede usar `createProductAction` (cierra el defecto 4) | `.env.local`, en mi máquina | Yo; la app en el servidor (`process.env.ADMIN_EMAILS`) | No da acceso por sí solo, pero son correos: **dato personal** | **No.** El código nombra la variable, nunca el valor. Las pruebas usan correos de ejemplo propios |
| Token de la Action: `CLAUDE_CODE_OAUTH_TOKEN` (plan) o `ANTHROPIC_API_KEY` (saldo de API) (nace en la 7.2) | Credencial de mi cuenta de Claude | Que la Action de Claude Code revise cada PR | GitHub → Settings → Secrets and variables → Actions → **Repository secrets**. Se genera con `claude setup-token` en mi terminal y se pega directo ahí | El workflow `.github/workflows/claude-review.yml`, en GitHub. Yo, una sola vez, al pegarlo | **Sí** | **Nunca.** El workflow solo nombra `secrets.CLAUDE_CODE_OAUTH_TOKEN`. No pasa por el chat ni por ningún archivo |
| `.env.local` | Archivo de variables de entorno local. **Hoy no existe**; lo creo yo, a mano | Darle a la app `ADMIN_EMAILS` sin ponerla en el código | Raíz del proyecto. Ignorado por `.gitignore:14` (`.env*`) y `:13` (`.env*.local`) | Yo; Next.js al correr `dev`, `build` o `start`. El agente: frenado por `Read(./.env)` y `Read(./.env.*)`, salvo un programa aparte (ver abajo) | Contenedor: solo lleva valores que no importa que el agente vea | **No** |
| `data/tienda.db` | Base SQLite de la tienda | Guarda usuarios (correo y hash de contraseña), sesiones (hash del token), productos y pedidos | `data/tienda.db`. Ignorada por `.gitignore:17` (`data/`) y `:18` (`*.db`). `npm run db:reset` la borra | Yo; la app (`src/lib/db.ts`). El agente podría abrirla: no hay regla que lo impida. El CI crea la suya | Sí: correos y hashes son datos de usuarios | **No** |
| `.mcp.json` (línea 11) | Configuración del servidor MCP `conversaciones`, **commiteada** | Que el agente lea mis conversaciones guardadas | Raíz del repositorio, **público** | Claude Code; cualquiera que vea el repositorio | No es secreto. Publica mi **usuario de Windows** y la ruta de mis conversaciones | **Ya salió.** Propuesta abajo |
| `docs/SALIDA_TOKENS.txt` (líneas 4-5, 49-50 y cada corrida) | Salida de `tokens.py`, **commiteada** | Registro de mediciones de la sesión 3 en adelante | `docs/`, **público** | Cualquiera | No. Publica mi usuario y la ruta completa del proyecto (incluye OneDrive) | **Ya salió.** Propuesta abajo |
| `docs/VERIFICACION_S4.md:43` y `docs/BITACORA.md:521` | Documentos del curso, **commiteados** | Verificación y bitácora | `docs/`, **público** | Cualquiera | No. La misma ruta con mi usuario | **Ya salió.** Propuesta abajo |
| Correo de autor de los commits | El `user.email` de git | Firma cada commit | Metadatos de cada commit, **públicos** | Cualquiera con `git log` | No. Es un correo de dominio propio, no el `noreply` de GitHub: **dato personal** | **Ya salió.** Propuesta abajo |
| `.claude/settings.local.json` | Ajustes locales de Claude Code (hoy solo habilita MCP) | Preferencias de esta máquina | `.claude/`. Lo ignora **mi ignore global** (`~/.config/git/ignore`), no el `.gitignore` del proyecto | Claude Code | No hoy; mañana podría llevar permisos con rutas | No. En otra máquina sin ese ignore global se podría commitear |
| Token de `gh` (se usa en la 7.4) | Credencial de GitHub CLI | Que `gh` lea issues y PR | El almacén de credenciales del sistema, lo guarda `gh auth login` | `gh` | **Sí** | **Nunca.** No pasa por el chat ni por un archivo del proyecto |

### Lo ya publicado: qué hacer de aquí en adelante

No se reescribe la historia: el repositorio es público, reescribir es destructivo y no borra las copias que ya existen. La decisión es mía; esta es la propuesta:

1. **`.mcp.json`**: pasar el servidor `conversaciones` a alcance local (`claude mcp add --scope local …`, queda en mi configuración de usuario, fuera del repo), dejar de seguir el archivo con `git rm --cached .mcp.json` y agregarlo al `.gitignore`. Si prefiero que quede compartido, aceptar la ruta como pública.
2. **`docs/SALIDA_TOKENS.txt`, `VERIFICACION_S4.md`, `BITACORA.md`**: desde hoy, en documentos nuevos se escribe `<RUTA_PROYECTO>` o `~\.claude\projects\…` en vez de la ruta completa. Opcional: corregir la versión actual de esos archivos; la historia conserva la anterior.
3. **Correo de autor**: para los commits nuevos, `git config user.email` con el correo `noreply` que GitHub da en Settings → Emails.
4. **`.claude/settings.local.json`**: agregarlo al `.gitignore` del proyecto, para no depender del ignore global.

## Lo que las reglas no frenan

Las reglas `Read(./.env)` y `Read(./.env.*)` frenan la herramienta de lectura del agente, `cat` en Bash y `Get-Content` en PowerShell. No frenan **un programa aparte que abre el archivo por su cuenta**: `cmd /c type .env.local` lanzado desde PowerShell, o un `node -e "…fs.readFileSync('.env.local')…"` desde cualquier consola. Las reglas miran el comando, no lo que hace el programa por dentro, y la documentación lo avisa. En modo `auto`, el clasificador a veces frena ese intento, pero el clasificador no es una regla: decide en cada llamada, y escrito de otra forma o en otro modo puede pasar. En Windows nativo no hay sandbox que lo cierre. La consecuencia: **en `.env.local` solo va lo que no importa que el agente vea**, como `ADMIN_EMAILS`. Un secreto de verdad, como el token de la Action, no se guarda en la máquina donde trabaja el agente: vive en GitHub.

## Greps anti-fuga

Se corren antes de cada push, desde la raíz, en Git Bash. Excluyen `node_modules/`, `.next/`, `.git/` y los `.env*` (para no leerlos). Buscan la **forma** de cada credencial, no solo el prefijo: un prefijo suelto da falsos positivos en la propia documentación del curso (`PROMPTS_sesion7.md:222-223` nombra los prefijos).

```bash
X="--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude=.env*"
grep -rnIE $X 'sk-ant-[A-Za-z0-9_-]{20,}' .                          # Anthropic
grep -rnIE $X 'ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}' .   # GitHub
grep -rnIE $X 'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' .          # JWT
grep -rnIE $X -e '-----BEGIN ([A-Z]+ )?PRIVATE KEY-----' .           # claves privadas
git log --all -p -- .env .env.local                                  # .env en la historia
```

Salida del 2026-11-20:

| Grep | Salida |
|---|---|
| Anthropic (`sk-ant-`) | vacía (exit 1) |
| GitHub (`ghp_`, `github_pat_`) | vacía (exit 1) |
| JWT (`eyJ…`) | vacía (exit 1) |
| Claves privadas (`-----BEGIN … PRIVATE KEY-----`) | vacía (exit 1) |
| `git log --all -p -- .env .env.local` | vacía (0 líneas) |

`-I` salta los binarios, así que `data/tienda.db` no se revisa: está ignorada y no sale al repositorio.

## Comprobación de la Fase 7.1

Pendiente: las dos reglas las pego yo en la lista `deny` de `.claude/settings.json`, creo un `.env.local` de prueba y, en un chat nuevo, pido al agente que lo lea con su herramienta, con `cat`, con `Get-Content` y con un programa aparte. Aquí se anota qué pasó en cada intento y, en el cuarto, si lo frenó una regla o el clasificador.

| Intento | Resultado |
|---|---|
| Herramienta de lectura | |
| `cat .env.local` (Bash) | |
| `Get-Content .env.local` (PowerShell) | |
| Programa aparte (`cmd /c type` o `node -e`) | |
