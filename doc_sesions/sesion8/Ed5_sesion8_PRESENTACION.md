# Sesión 8 — Plugin del equipo y showcase

> El PPT está armado: [`Ed5_sesion8.pptx`](Ed5_sesion8.pptx), 38 láminas sobre
> la plantilla de las sesiones 5 a 7, con las notas del docente en el panel de
> notas. Este documento es el guion del que salió: para preparar la clase, no
> para proyectarlo.
>
> El material del laboratorio está escrito desde el 19 de noviembre:
> [`Ed5_sesion8.md`](Ed5_sesion8.md) y [`PROMPTS_sesion8.md`](PROMPTS_sesion8.md).
> El empaquetado y la instalación en limpio se ejecutaron ese día con Claude
> Code real. El 23 de noviembre la spec pasó a la versión 2, alineada con la
> sesión 6 versión 2.1, y se ensayó de nuevo (sección "Ensayo del 23 de
> noviembre", abajo).

Los datos técnicos están verificados contra la documentación oficial el
19 de noviembre de 2026. Las fuentes están al final.

---

## Los temas que esta sesión posee

| Tema | Dónde cae |
|---|---|
| ⭐ Plugins: empaquetar todo para que otra persona lo instale | bloques 01 a 04 · fases 8.1 y 8.2 |
| Documentar el proyecto y la configuración del agente | fase 8.3, el README |
| Presentar el antes y el después medido | bloque 05 · fase 8.3 |

---

## Verificado hoy (19 nov 2026)

| Hallazgo | Consecuencia para la clase |
|---|---|
| El manifiesto es `.claude-plugin/plugin.json`, y solo el nombre es obligatorio. Las piezas van en la raíz del plugin; lo que se guarde dentro de `.claude-plugin/` además de `plugin.json` no carga. | Lámina 12 y tabla de fallos. |
| Cada pieza lleva el prefijo del plugin. **El ensayo lo confirmó en el hook**: `agent_type` llegó como `red-de-seguridad:tech-lead`. | Lámina 15. Los hooks de la sesión 6 no se tocan: la 8.1 adapta la copia que va en el plugin. |
| Los hooks del plugin encuentran sus scripts con `${CLAUDE_PLUGIN_ROOT}`. | Lámina 14 y anexo de la spec. |
| Un hook que está en la configuración y en un plugin corre dos veces. | El plugin no se instala en el propio proyecto. |
| `claude plugin marketplace add` e `install` escriben por defecto en la configuración global. | Todo con `--scope local`. |
| `claude plugin validate` pasa con solo `plugin.json`, y avisa que faltan README, LICENSE e ícono, que solo exige el directorio público. | Se agrega el README; LICENSE e ícono no. |

## Lo que el ensayo ejecutó (19 nov 2026)

Con Claude Code real, sobre Windows, con un plugin armado con las piezas del
proyecto de ensayo:

| Qué se probó | Qué pasó |
|---|---|
| `claude plugin validate` en el plugin y en el marketplace | Pasaron. Listó el agente como `red-de-seguridad:tech-lead`, la Skill con su prefijo y los hooks |
| `marketplace add` e `install` con `--scope local`, en un clon del ejemplar en su tag `v-ed4-final` | Instalado. Quedó en el `.claude/settings.local.json` de esa carpeta. La configuración global, igual que antes |
| `git reset --hard HEAD` en esa carpeta | Bloqueado por el hook del plugin |
| El Tech Lead del plugin leyendo un archivo de la app | Lo leyó; el hook lo vio como `red-de-seguridad:tech-lead` |
| El hook corregido, a mano, con el Tech Lead del plugin leyendo `docs/` | Bloqueado. Otro agente con un nombre parecido, no |
| `uninstall` y `marketplace remove` con `--scope local` | Funcionaron, y vaciaron la configuración local |

**No se ejecutó:** lo interactivo (`/plugin`, el menú de `@` con el agente del
plugin, `/reload-plugins`), y el showcase, que depende de los datos de cada
alumno.

## Ensayo del 23 de noviembre — versión 2

La corrección 1.1 de la sesión 6 se revirtió: los hooks del proyecto quedan
como están, y es la 8.1 la que adapta la copia que va al plugin. Es la lección
de la sesión hecha ejercicio. Con Claude Code 2.1.327, el plugin armado desde
`merc_tech` e instalado con alcance local en un clon del ejemplar:

| Qué se probó | Qué pasó |
|---|---|
| El probador del plugin con los hooks de la sesión 6, tal cual | **25 de 27**: fallan el Tech Lead con prefijo y el proyecto sin `npm test`. Es lo que el alumno ve antes de adaptar |
| El probador con la versión que viaja | 27 de 27 |
| `claude plugin validate`, plugin y marketplace | Pasaron. Avisos de LICENSE y de la línea de instalación en el README: se ignoran |
| `git reset --hard HEAD` en el clon del ejemplar, con PowerShell y con Bash | Bloqueado las dos veces. El aviso dice "This hook comes from the red-de-seguridad@tienda-ensayo plugin" |
| El Tech Lead del plugin, con un registro puesto en el hook | El evento trajo `agent_type: "red-de-seguridad:tech-lead"` |
| El Tech Lead del plugin, pidiéndole que intente leer `docs/` | Se negó sin usar herramientas: lo frena su propio archivo, como en la sesión 6 |
| Desde dónde corre el plugin | **Desde la carpeta `plugin/` del proyecto**, no desde la copia en caché |
| `uninstall` y `marketplace remove` con `--scope local` | Vaciaron la configuración local. La global, idéntica (md5). La copia en `~/.claude/plugins/cache/` se quedó |

Lo que conviene decir en clase:

* **El probador falla antes de adaptar, y eso es bueno.** Que lo vean fallar es
  ver por qué un hook que funciona en tu máquina no está empaquetado.
* **Mientras el plugin está instalado, no se mueve el proyecto**: con un
  marketplace local, corre desde ahí.

---

## La pregunta de la sesión

> Si tu red solo funciona en tu máquina, ¿está empaquetada?

---

## Mapa de la presentación

| Láminas | Bloque | Qué se dice |
|---|---|---|
| 1–6 | Apertura | Sesión 8, agenda, dónde quedamos: los cuatro defectos cerrados |
| 7–10 | 01 · De piezas sueltas a un paquete | Lo que tienes y dónde está, y los tres pasos de hoy |
| 11–15 | 02 · Qué es un plugin | El manifiesto, el marketplace, proyecto contra plugin, y lo que el ensayo encontró |
| 16–18 | 03 · Qué viaja y qué no | El criterio, y cada pieza en otra carpeta |
| 19–21 | 04 · Instalar en limpio | Tu carpeta contra otra, y los comandos |
| 22–27 | 05 · El showcase | Es la tabla, cinco bloques, de dónde sale cada número, cómo se prepara, y si algo falla al empaquetar |
| 28–34 | 06 · Lab | Qué entra en tu plugin, las tres fases, y el cierre del curso |
| 35–38 | Cierre | Lo que te llevas, lo que sigue, gracias y evaluación |

**Reloj de 2 h, clase normal:** recap 10 · 01 5 · 02 15 · 03 10 · 04 10 · 05 15 ·
lab 50 · cierre 5. Suma 120. **Sin medir.** Si los showcases se presentan en
clase, el lab se acorta.

---

## El lab, en detalle

| Fase | Qué se hace | Lo que hace la persona |
|---|---|---|
| 8.1 Empaquetar | La tabla de qué entra y por qué; `plugin/` con el Tech Lead, los hooks y un README; el marketplace; la validación | Decide la Skill y el output style |
| 8.2 Instalar en limpio | El plugin en otra carpeta con `--scope local`; las pruebas; la sección "Instalado en limpio" | Corre los comandos en la terminal y prueba en un chat de esa carpeta |
| 8.3 El showcase | `docs/SHOWCASE.md` con cada dato y su archivo, y el README del gobierno | Ensaya con reloj y graba el video |

### Lo que la sesión decide y conviene decir

* **Decidir qué no entra es parte del ejercicio.** La Skill de la sesión 4
  probablemente no viaja: cita la app.
* **El plugin nunca se instala en el propio proyecto.** Los hooks correrían dos
  veces.
* **La presentación es la tabla, no el entusiasmo.** Un número sin archivo no
  entra.

---

## La cantera

| Pieza del ejemplar | Para qué se usa hoy |
|---|---|
| `docs/DEMO.md` | El formato del guion del showcase: minuto a minuto, el dato exacto y un plan B |
| El propio ejemplar, en su tag `v-ed4-final` | La carpeta de prueba de la 8.2: un código que no es el del alumno |
| Las dos Skills ajenas al proyecto del ejemplar | Ejemplo de qué no entraría en un plugin del proyecto |

---

## Lo que falta antes de dar el laboratorio

* **Ensayar lo interactivo**: `/plugin` y el menú de `@` con el agente del plugin.
* **Confirmar cómo acceden los alumnos al ejemplar** para clonarlo en la 8.2.
* **Cronometrar.**

---

## Fuentes y fecha de consulta

Consultadas el 19 de noviembre de 2026:

* Plugins: <https://code.claude.com/docs/en/plugins>
* Referencia de plugins: <https://code.claude.com/docs/en/plugins-reference>
* Marketplaces: <https://code.claude.com/docs/en/plugin-marketplaces>
* Componentes: <https://code.claude.com/docs/en/plugins/components>
* CLI de plugins: <https://code.claude.com/docs/en/plugins/cli-reference>
