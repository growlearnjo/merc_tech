# Sesión 7 — Claude Code en el equipo

> El PPT está armado: [`Ed5_sesion7.pptx`](Ed5_sesion7.pptx), 38 láminas sobre
> la plantilla de las sesiones 5 y 6, con las notas del docente en el panel de
> notas. Este documento es el guion del que salió: para preparar la clase, no
> para proyectarlo.
>
> El material del laboratorio está escrito desde el 19 de noviembre:
> [`Ed5_sesion7.md`](Ed5_sesion7.md) y [`PROMPTS_sesion7.md`](PROMPTS_sesion7.md).
> Lo local se ejecutó ese día con Claude Code real. **Lo que ocurre en GitHub no
> se ejecutó**: necesita una cuenta y un repositorio. El 20 de noviembre la spec
> pasó a la versión 2, alineada con la versión 2 de la sesión 6 (sección "Ensayo
> del 20 de noviembre", abajo).

Los datos técnicos están verificados contra la documentación oficial el
19 de noviembre de 2026. Las fuentes están al final.

---

## Los temas que esta sesión posee

| Tema | Dónde cae |
|---|---|
| Secretos fuera del alcance del agente | bloque 02 · fase 7.1 |
| ⭐ La Action de Claude Code revisando cada PR | bloque 03 · fases 7.2 y 7.3 |
| Inyección de prompt al leer issues, dependencias o contenido externo | bloque 05 · fase 7.4 |

Y cierra el **defecto 4** del inventario, que la sesión 6 le pasó entero.

---

## Verificado hoy (19 nov 2026)

| Hallazgo | Consecuencia para la clase |
|---|---|
| `Read(./.env)` y `Read(./.env.*)` en deny dejan `.env.local` fuera del alcance de la herramienta de lectura, de `cat` y de `Get-Content`. No cubren un programa que abre el archivo por su cuenta: `cmd /c type` y `node -e` lo leyeron. | Lámina 13. Ejecutado en los dos ensayos. |
| La Action necesita un secreto: `CLAUDE_CODE_OAUTH_TOKEN` con un plan (lo genera `claude setup-token`) o `ANTHROPIC_API_KEY` con saldo de API. | Lámina 18. El token lo genera y lo guarda la persona: nunca pasa por el chat. |
| `/install-github-app` hace todo en un paso, pero necesita `gh` y admin, y abre su propio PR. | El camino principal es el manual. En la máquina del ensayo `gh` no estaba instalado. |
| La revisión automática de cada PR, en la documentación, usa el plugin `code-review` con `--comment`. Salta borradores, PR cerrados y PR ya comentados. | Lámina 18 y anexo de la spec. |
| En un repositorio público, GitHub no entrega secretos a un PR que viene de un fork. Solo la disparan usuarios con escritura. | Es una protección. Se dice para que nadie lo lea como un fallo. |
| La herramienta web pasa la mayoría de las páginas por otro modelo; `gh` trae el texto crudo. | Lámina 24. La 7.4 usa `gh`: el peor caso. |
| No mostrar la salida completa de la Action en un repositorio público: puede exponer secretos en los registros. | Lámina 27. |

## Lo que el ensayo ejecutó (19 nov 2026)

| Qué se probó | Qué pasó |
|---|---|
| Leer `.env.local` con la herramienta de lectura y con `cat`, con las dos reglas en deny | Los dos intentos fueron negados |
| Un texto de issue con un comentario HTML escondido que pedía `git reset --hard`, escribir en `docs/00-ANTES.md` y mostrar `.env.local` | El agente detectó la nota, la reportó y no hizo ninguna de las tres cosas. Las tres chocan además con la red de la sesión 6 y con la regla de la 7.1, comprobadas por separado |
| Los dos workflows | Válidos como YAML |

**No se ejecutó:** instalar la app de Claude, guardar el secreto, el CI en un
runner, la revisión en un PR, ni el issue con `gh`. Es lo primero que hay que
ensayar antes de dar la clase.

## Ensayo del 20 de noviembre — alineada con la sesión 6 versión 2

Con Claude Code 2.1.327, sobre Windows, en una copia del proyecto, con
`Read(./.env)` y `Read(./.env.*)` en `deny`:

| Cómo intentó leer `.env.local` | Qué pasó |
|---|---|
| `cat` con Bash | Bloqueado |
| `Get-Content` con PowerShell | Bloqueado |
| `cmd /c type` con PowerShell | **Leído** |
| `node -e` con `fs.readFileSync`, con Bash | **Leído** |

Es el hueco que la documentación avisa, "un programa que abre el archivo por su
cuenta". Lo que cambió en el material:

* La comprobación de la 7.1 suma `Get-Content` y un programa aparte, para que el
  alumno vea el hueco. Y `docs/SECRETOS.md` lo deja escrito.
* La consecuencia, que conviene decir en clase: en `.env.local` solo va lo que no
  importa que el agente vea. Un secreto de verdad no se guarda en la máquina
  donde trabaja el agente sin sandbox.
* La red de partida es la de la sesión 6 versión 2 (las dos consolas, `git push`
  en `ask`, `probar-hooks.js`), y el Prompt 0 lo comprueba.
* `.env.local` se crea con el editor, con `Set-Content` en PowerShell o con
  `echo` en Bash: `echo >` en PowerShell 5.1 lo guarda en UTF-16 y Next.js no lo
  lee.
* `gh` se instala según el sistema: `winget`, `brew` o el paquete de Linux.
* Los archivos los escribe el agente con su herramienta de edición: el hook busca
  texto, y `docs/INYECCION.md` trae `git reset --hard`.

---

## La pregunta de la sesión

> Tu red funciona en tu máquina. ¿Qué pasa cuando el proyecto deja de ser solo
> tuyo?

---

## Mapa de la presentación

| Láminas | Bloque | Qué se dice |
|---|---|---|
| 1–6 | Apertura | Sesión 7, agenda, dónde quedamos: el defecto 4 es el último abierto |
| 7–10 | 01 · Del gobierno personal al del equipo | Lo que hoy falta, y las tres capas: secretos, CI y Action, desconfianza |
| 11–15 | 02 · Secretos | Qué es secreto y qué no, fuera del alcance del agente, dónde vive cada valor, y lo que ya se fue |
| 16–18 | 03 · El CI y la Action | El CI sin secretos, y la Action por dentro |
| 19–21 | 04 · El defecto 4 | Antes y después del PR, y cómo se cierra con `ADMIN_EMAILS` |
| 22–27 | 05 · Inyección | La puerta de atrás, cómo llega, la prueba de hoy, las tres reglas con contenido ajeno, y si algo falla en GitHub |
| 28–34 | 06 · Lab | La tabla de gobernanza y las cuatro fases |
| 35–38 | Cierre | Lo que te llevas, la sesión 8, gracias y evaluación |

**Reloj de 2 h, clase normal:** recap 10 · 01 10 · 02 15 · 03 15 · 04 10 · 05 15
· lab 40 · cierre 5. Suma 120. **Sin medir.**

---

## El lab, en detalle

| Fase | Qué se hace | Lo que hace la persona |
|---|---|---|
| 7.1 Secretos | `docs/SECRETOS.md` con la tabla de gobernanza y los greps anti-fuga | Pega las dos reglas deny (el agente no puede desde la 6.4) y crea `.env.local` |
| 7.2 CI y Action | `ci.yml` sin secretos, y `claude-review.yml` del ejemplo oficial, en una rama | Instala la app de Claude, genera el token y lo guarda en GitHub; abre el PR y hace el merge |
| 7.3 El defecto 4 | La comprobación de `ADMIN_EMAILS` en la página y en la acción, con pruebas | Pone su correo en `.env.local`, prueba en el navegador, lee la revisión |
| 7.4 Inyección | El agente lee un issue con una orden escondida, y se documenta en `docs/INYECCION.md` | Abre y cierra el issue, y lee antes de aprobar |

### Lo que la sesión decide y conviene decir

* **El defecto 4 se cierra con una variable de entorno**, no con una columna de
  rol: no cambia la base, y une el defecto con el tema de la sesión.
* **El token no pasa por el chat.** Lo genera la persona en su terminal y lo pega
  en GitHub.
* **La 7.4 no es un examen del modelo.** Se anota lo que pasó, sobre todo si
  obedeció.

---

## La cantera

| Pieza del ejemplar | Para qué se usa hoy |
|---|---|
| `docs/DEPLOY.md` §1.1, la tabla de gobernanza | Formato de la tabla de `docs/SECRETOS.md` |
| `docs/DEPLOY.md` §1.4, los greps anti-fuga | Los greps de la 7.1, adaptados |
| `.github/workflows/ci.yml` | El CI sin secretos, y la lección del npm fijado |

---

## Lo que falta antes de dar el laboratorio

* **Ensayar todo lo de GitHub** en un repositorio propio: la app, el secreto, el
  CI, la revisión en un PR y el issue con `gh`.
* **Cronometrar las cuatro fases.**
* Si el ensayo cambia algo de la Action —el nombre de un input, el comportamiento
  de `--comment`—, se corrige el anexo de la spec antes de la clase.

---

## Fuentes y fecha de consulta

Consultadas el 19 de noviembre de 2026:

* GitHub Actions: <https://code.claude.com/docs/en/github-actions>
* Seguridad de la Action: <https://github.com/anthropics/claude-code-action/blob/main/docs/security.md>
* Seguridad: <https://code.claude.com/docs/en/security>
* Permisos: <https://code.claude.com/docs/en/permissions>
* Configuración: <https://code.claude.com/docs/en/settings>
