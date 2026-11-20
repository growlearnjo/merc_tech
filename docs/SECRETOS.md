Para qué sirve: dice, para cada variable y cada archivo sensible del proyecto, qué es, dónde vive, quién lo lee y si puede salir al repositorio. Se armó con nombres, rutas, `git ls-files` y el `.gitignore`: ningún `.env` se abrió y ningún valor aparece aquí. El repositorio es **público**.

Donde un archivo publica la ruta de mi perfil de Windows, aquí se escribe `<usuario>`: este documento también se commitea.

## Tabla de gobernanza

| Variable o archivo | Qué es y para qué sirve | Dónde vive | Quién lo lee | ¿Es secreto? | ¿Puede salir al repositorio? |
|---|---|---|---|---|---|
| `ADMIN_EMAILS` (nace en la 7.3) | Lista de correos que pueden entrar a `/admin` y crear productos. Cierra el defecto 4 sin cambiar el esquema de la base | `.env.local`, en mi máquina. Si algún día hay despliegue, en las variables del hosting | La app, en el servidor (`process.env.ADMIN_EMAILS`), y yo. El agente conoce el **nombre**, no el valor | No: es un dato personal (correos), no una credencial. Por eso puede ir en `.env.local` (ver abajo) | El nombre sí, en el código. El valor no |
| `CLAUDE_CODE_OAUTH_TOKEN` (guardado en la 7.2) | Token de mi plan Max de Claude, generado con `claude setup-token`. Lo usa la Action que revisa cada PR | Guardado como secreto del repositorio en GitHub: Settings → Secrets and variables → Actions. Nunca en un archivo, ni en el chat, ni en `.env.local` | Solo el workflow de revisión, `.github/workflows/claude-review.yml`, al correr en GitHub Actions. `ci.yml` no lo recibe. Yo, una vez, al pegarlo. El agente **nunca** | **Sí**. Quien lo tenga usa mi plan | Solo el nombre, como `${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}` en el workflow. El valor, jamás |
| `.env.local` | Archivo de variables locales que Next.js carga al arrancar. Hoy **no existe**; lo creo yo, a mano, en la 7.1 (prueba) y la 7.3 | Raíz del proyecto | La app (Next.js) y yo. El agente: frenado por `Read(./.env)` y `Read(./.env.*)` en su herramienta, `cat` y `Get-Content`, **pero no** por un programa aparte (ver abajo) | No debe contener secretos: solo lo que no importa que el agente vea | **No**. Lo excluye `.gitignore:14` (`.env*`) |
| `NODE_ENV` | La única variable que la app lee hoy (`src/lib/auth.ts:39`): activa la cookie `secure` en producción | La pone Next.js según el comando (`dev` o `start`) | La app | No | Sí: no tiene valor sensible |
| `data/tienda.db` | Base SQLite de la app: tablas `users` (correos y hash de contraseñas), `sessions`, `products`, `orders`, `order_items` | `data/`, en mi máquina. Se crea sola al arrancar; `npm run db:reset` la borra | La app (`src/lib/db.ts:10`) y yo. El agente **sí puede** leerla: no hay regla `deny` para `data/` | Sensible: hashes de contraseñas y sesiones vivas, aunque sean de prueba | **No**. La excluye `.gitignore:17-20` (`data/`, `*.db`) |
| `.mcp.json` (commiteado) | Configura el servidor MCP `conversaciones`. La línea 11 publica `C:\\Users\\<usuario>\\.claude\\projects\\…` | Raíz del repositorio, y en GitHub | Claude Code, al arrancar. Cualquiera, en GitHub | No es secreto; **es un dato personal** (mi usuario de Windows y mi estructura de carpetas) | Ya salió. De aquí en adelante: decisión mía (ver propuestas) |
| `docs/SALIDA_TOKENS.txt`, `docs/BITACORA.md:521`, `docs/VERIFICACION_S4.md:43` (commiteados) | Salidas de `tokens.py` y notas de sesión. Publican la misma ruta con `<usuario>` (26 veces en `SALIDA_TOKENS.txt`, 1 en cada uno de los otros) | `docs/`, y en GitHub | Yo, el agente y cualquiera en GitHub | No; **dato personal** | Ya salió. De aquí en adelante: decisión mía (ver propuestas) |
| Correo de autor de los commits | `git config user.email`. Cada commit lo guarda; GitHub lo muestra a quien abra un commit con `.patch` | Metadatos de cada commit, en GitHub. Hoy es una dirección personal, no una `noreply` de GitHub | Git, GitHub y cualquiera que mire la historia | No; **dato personal** | Ya salió. De aquí en adelante: decisión mía (ver propuestas) |
| `.claude/settings.local.json` | Mis permisos personales de Claude Code, fuera de la red compartida | `.claude/`, en mi máquina | Claude Code | No, pero es personal | **No**. Ojo: no lo ignora el `.gitignore` del proyecto, sino mi `.gitignore` **global** (`~/.config/git/ignore`). En otra máquina se podría commitear |
| Conversaciones de Claude Code | Todo lo que pasa por el chat, guardado como transcripción | `~/.claude/projects/<proyecto>/`, fuera del repositorio | Claude Code y yo. El agente, además, por el servidor MCP `conversaciones` (solo lectura) | Lo sería si pegara un secreto en el chat: quedaría escrito ahí. Por eso **un secreto no pasa por el chat** | No: está fuera del proyecto |

### Propuestas para los datos personales que ya son públicos

No se reescribe la historia: el repositorio es público, reescribirla es destructivo y no borra las copias que ya existen. Lo que propongo **de aquí en adelante**, para que decida yo:

1. **Rutas en `docs/`**: en documentos nuevos, escribir `<RUTA_PROYECTO>` o `~` en lugar de la ruta absoluta. Si quiero, un commit aparte reemplaza la ruta en los tres archivos de hoy (la historia la conserva).
2. **`.mcp.json`**: la ruta es necesaria para que el servidor funcione. Opción: mover el servidor a mi configuración personal (`claude mcp add --scope local` o `--scope user`) y sacar `.mcp.json` del repositorio con `git rm --cached`.
3. **Correo de autor**: activar en GitHub "Keep my email addresses private" y usar la dirección `noreply` que da GitHub en `git config user.email` de este repositorio.
4. **`.claude/settings.local.json`**: agregarlo al `.gitignore` del proyecto, para no depender de mi configuración global. No lo hice: la Fase 7.1 solo pide comprobar `.env*`.

## Lo que las reglas no frenan

Las dos reglas `deny`, `Read(./.env)` y `Read(./.env.*)`, frenan la herramienta de lectura del agente, `cat` en Bash y `Get-Content` en PowerShell. **No frenan un programa aparte que abre el archivo por su cuenta**: `cmd /c type .env.local` llamado desde PowerShell, o un `node -e` con `fs.readFileSync(".env.local")` desde cualquier consola. La regla mira qué herramienta usa el agente y qué comando escribe, no qué archivos abre por dentro el programa que lanza; la documentación de Claude Code lo avisa, y en el ensayo del curso (decisión 15) los dos caminos leyeron el archivo. En Windows nativo no hay sandbox que lo cierre. La consecuencia: **en `.env.local` solo va lo que no importa que el agente vea**, como `ADMIN_EMAILS`. Un secreto de verdad, como el token de la Action, no se guarda en la máquina donde trabaja el agente: vive en GitHub.

Pendiente de comprobar en esta máquina, cuando estén pegadas las dos reglas y exista un `.env.local` de prueba (paso 1 de "Cómo verificar" de la 7.1, en un chat nuevo): que la herramienta, `cat` y `Get-Content` fallen, y que `cmd /c type` o `node -e` sí lean. El resultado se anota aquí.

## Greps anti-fuga

Se corren desde la raíz, en Bash, antes de cada push. Excluyen `node_modules/`, `.next/`, `.git/` y los `.env*` (el grep tampoco abre un `.env`). `-I` salta archivos binarios como `data/tienda.db`. Las expresiones piden el cuerpo del token, no solo el prefijo, para no marcar este mismo documento.

```bash
G='grep -rnIE --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude=.env*'
$G 'sk-ant-[A-Za-z0-9_-]{20,}' .                                    # 1. Anthropic
$G 'ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}' .           # 2. GitHub
$G 'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' .                   # 3. JWT
$G -- '-----BEGIN [A-Z ]*PRIVATE KEY-----' .                        # 4. Claves privadas
git log --all -p -- .env .env.local                                 # 5. .env en la historia
git log --all -p | grep -cE '<las expresiones 1 a 4, unidas con |>' # 6. Tokens en la historia
```

Salida del 2026-11-20:

| # | Qué busca | Salida |
|---|---|---|
| 1 | Tokens de Anthropic (`sk-ant-…`) | vacía (exit 1) |
| 2 | Tokens de GitHub (`ghp_…`, `github_pat_…`) | vacía (exit 1) |
| 3 | JWT (`eyJ….…`) | vacía (exit 1) |
| 4 | Claves privadas (`BEGIN … PRIVATE KEY`) | vacía (exit 1) |
| 5 | `.env` o `.env.local` en la historia de git | vacía |
| 6 | Cualquiera de los cuatro en toda la historia | `0` |

Esperado: todo vacío. Si una línea aparece, no se hace push: se quita el valor, se revoca el token en su origen (Anthropic o GitHub) y se genera uno nuevo. Un token que llegó a GitHub se da por filtrado aunque se borre después.
