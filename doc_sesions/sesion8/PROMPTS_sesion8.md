# Claude Code Ed. 5 — Prompts de la Sesión 8 (Plugin del equipo y showcase)

Cada prompt está escrito para pegarse **tal cual**, después de rellenar sus
marcadores. Están en el orden en que se usan, y cada uno dice en qué chat va.

Es la última sesión. No se agrega nada nuevo a tu app: se empaqueta lo que
construiste, se prueba fuera de tu máquina, y se presenta con tus números.

| Fase | Rol | Contexto | Objetivo | Público/tono | Restricciones | Formato | Ejemplos | Razonamiento |
|---|---|---|---|---|---|---|---|---|
| 0 Terreno | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 1 Lectura de la spec | — | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 8.1 Empaquetar | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | ✔ |
| 8.2 Instalar en limpio | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| 8.3 Showcase | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| Cierre del curso | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

---

## La ruta de hoy, y en qué chat va cada paso

| # | Paso | ¿Dónde? |
|---|---|---|
| 1 | **Prompt 0** — verificar el terreno | chat nuevo. Deja escrito `docs/VERIFICACION_S8.md` |
| 2 | **Prompt 1** — leer la spec | chat nuevo |
| 3 | **Fase 8.1** — empaquetar | chat nuevo, en tu proyecto |
| 4 | **Fase 8.2** — instalar en limpio | **tu terminal** en la carpeta de prueba, un chat **en esa carpeta**, y un chat en tu proyecto para anotarlo |
| 5 | **Fase 8.3** — el showcase | chat nuevo, y **tú** con el reloj y la grabación |
| 6 | **Cierre del curso** | chat nuevo |

---

## Cómo usar estos prompts

1. **Se trabaja en la terminal**, con `claude` abierto en la raíz de la carpeta
   que dice cada paso: tu proyecto, o la carpeta de prueba en la 8.2. **Cada
   fase empieza en una conversación nueva**, en orden.
2. **Los comandos que empiezan con `/` y las menciones con `@` las escribes tú.**
3. **Rellena los marcadores** del bloque `[CONTEXTO]`:

   | Marcador | Qué es | Cómo lo consigues |
   |---|---|---|
   | `<RUTA_PROYECTO>` | La carpeta donde vive tu app | `pwd` desde la carpeta del proyecto |
   | `<COMMIT_ANTERIOR>` | El commit con el que cerraste la sesión 7 | `git log --oneline -1` al empezar hoy |
   | `<TU_REPO>` | Tu repositorio en GitHub | `git remote -v` |

4. **Todo lo que se instala, con `--scope local`.** Así no cambia tu
   configuración global.
5. **Commit por fase**: `feat:` para la 8.1, `docs:` para la 8.2, la 8.3 y el
   cierre.

### Estado del repositorio al iniciar la sesión

* El repositorio en `<RUTA_PROYECTO>`, **sin cambios pendientes**, en
  `<COMMIT_ANTERIOR>` y subido a `<TU_REPO>`.
* Tus piezas: la Skill (`.claude/skills/`), el Tech Lead (`.claude/agents/`), los
  dos hooks y su probador en la versión 2.1 de la sesión 6 (`.claude/hooks/`), y
  sus permisos (`.claude/settings.json`).
* Las tablas del curso en `docs/`.
* Una carpeta de prueba que no sea tu proyecto: un clon del ejemplar, o
  cualquier otro proyecto tuyo. Si no la tienes, la creas antes de la Fase 8.2
  con los comandos de su Paso 0.

---

## Prompt 0 — Verificación del terreno

> **Chat nuevo.** Comprueba, y deja lo comprobado escrito en
> `docs/VERIFICACION_S8.md`. Es el único archivo que toca hoy.

```text
[ROL] Actúa como quien revisa lo que va a empaquetar antes de cerrar la caja:
qué piezas hay, en qué estado, y cuál no sirve fuera de esta casa. Detente en la
primera sorpresa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y debería estar en
<COMMIT_ANTERIOR>. Lee doc_sesions/sesion8/Ed5_sesion8.md, secciones "Antes de
empezar", "Estado de partida" y "Decisiones tomadas".

[OBJETIVO] Verifica, en este orden, deteniéndote en la primera sorpresa:
1. Versiones: claude (mínimo 2.1.283), node y git. Y que exista el comando
   claude plugin: claude plugin --help.
2. Que el repositorio esté limpio, en qué commit estoy y si está subido:
   git status -sb y git log --oneline -1.
3. Las piezas: el nombre de mi Skill, el name y la línea tools de mi Tech Lead,
   y los dos archivos de .claude/hooks/.
4. Que mi red sea la de la sesión 6 versión 2.1: que .claude/hooks/ tenga
   bloquear-peligroso.js, exigir-pruebas.js y probar-hooks.js, y que
   node .claude/hooks/probar-hooks.js dé 23 de 23. Si falta algo, dímelo y
   sigue.
5. Dime, sin cambiar nada, dos cosas de esos hooks: si bloquear-peligroso.js
   compara contra "tech-lead" exacto, y si exigir-pruebas.js corre npm test
   aunque el proyecto no tenga script test. En la versión 2.1 las dos cosas son
   así, y está bien para mi proyecto: es lo que la Fase 8.1 adapta en la copia
   que va al plugin.
6. Si existe algún output style en .claude/output-styles/.
7. Qué tablas hay en docs/: MEDICIONES, COSTOS, REVISION, PERMISOS, SECRETOS,
   INYECCION, DECISIONES. Solo si existen, sin copiar su contenido.
8. Que no exista todavía plugin/ ni .claude-plugin/.
9. Escribe docs/VERIFICACION_S8.md con lo comprobado: versiones; el commit; las
   piezas, con su estado; si la red es la 2.1 y la salida final de
   probar-hooks.js; las dos cosas del punto 5; si hay output style; las tablas
   que existen; y el veredicto en una línea.

[RESTRICCIONES]
- El ÚNICO archivo que escribes es docs/VERIFICACION_S8.md.
- No cambies los hooks: solo dime en qué estado están.
- No crees el plugin todavía.
- No leas ningún archivo .env.

[RAZONAMIENTO] Ejecuta las comprobaciones una a una y, si alguna falla,
diagnostica antes de pasar a la siguiente.

[FORMATO DE SALIDA] (1) tabla de comprobación × comando × resultado; (2) el
estado de los hooks; (3) veredicto en una línea; (4) docs/VERIFICACION_S8.md
escrito, y cuántas líneas tiene. Sin commit: entra en el commit de la Fase 8.1.
```

---

## Prompt 1 — Lectura de la spec (sin ejecutar nada)

> **Chat nuevo.** No escribe nada.

```text
[CONTEXTO] Proyecto en <RUTA_PROYECTO>. El terreno quedó verificado.

[OBJETIVO] Lee completo doc_sesions/sesion8/Ed5_sesion8.md, anexo incluido.
Devuélveme lo que entendiste:
1. Las 3 fases en orden, con qué entrega cada una.
2. Qué piezas entran en el plugin seguro, cuáles decido yo, y cuáles no entran,
   con su razón.
3. Por qué el plugin no se instala en mi propio proyecto.
4. Por qué todo va con --scope local.
5. Qué tiene que tener cada número del showcase.

[RESTRICCIONES]
- No generes código, no crees archivos, no instales nada.

[RAZONAMIENTO] Si algo de la spec te parece ambiguo o contradictorio, dilo
ahora.

[FORMATO DE SALIDA] (1) las 3 fases; (2) las piezas; (3) dónde se instala;
(4) el alcance; (5) el showcase; (6) tus dudas, si hay. Sin commit.
```

---

## Prompt Fase 8.1 — Empaquetar

> **Chat nuevo**, en tu proyecto.

```text
[ROL] Actúa como quien prepara una caja para que la abra otra persona en otra
casa: solo entra lo que sirve allí, y la caja dice qué trae y qué se quedó.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 8.1 de
doc_sesions/sesion8/Ed5_sesion8.md, sus decisiones 1, 2, 13 y 14, y su anexo;
docs/VERIFICACION_S8.md, mi Skill, mi Tech Lead, mis hooks y mi
.claude/settings.json.

[OBJETIVO] En este orden.
1. Antes de copiar nada, muéstrame la tabla de decisión: una fila por pieza de
   las sesiones 4 a 7 (la Skill, el Tech Lead, cada hook, los permisos, el
   servidor MCP, el output style si existe, y los workflows), con tres
   columnas: la pieza, si entra o no, y por qué. El criterio es uno: ¿sirve en un
   proyecto que no es el mío? Espera a que yo decida la Skill y el output style.
2. Propónme dos o tres nombres para el plugin y para el marketplace, en
   minúsculas con guiones, y espera a que elija.
3. Con lo que elija, arma plugin/ copiando, no moviendo:
   - plugin/.claude-plugin/plugin.json con name, version 1.0.0, description y
     author;
   - plugin/agents/tech-lead.md;
   - plugin/hooks/hooks.json con el texto del anexo;
   - plugin/skills/<nombre>/SKILL.md, solo si decidí que la Skill entra;
   - plugin/README.md: qué trae, cómo se instala con --scope local, y qué
     quedó fuera.
4. Los hooks, en tres pasos, y muéstrame la salida de cada corrida:
   a. Copia a plugin/scripts/ mis dos hooks de .claude/hooks/, tal cual, y el
      probador del plugin del anexo (plugin/scripts/probar-hooks.js). Corre
      node plugin/scripts/probar-hooks.js. Tiene que dar 25 de 27: dime cuáles
      fallan y por qué fallan fuera de mi proyecto.
   b. Reemplaza los dos hooks de plugin/scripts/ por su versión que viaja, del
      anexo, con el texto EXACTO.
   c. Corre el probador otra vez: 27 de 27. Si no, detente.
5. Escribe .claude-plugin/marketplace.json en la raíz del repositorio con el
   texto del anexo, con los nombres que elegí.
6. Corre claude plugin validate ./plugin y claude plugin validate . y
   muéstrame la salida.
7. Escribe docs/PLUGIN.md con la tabla de decisión, las dos salidas del
   probador (25 de 27 y 27 de 27) con qué cambió entre una y otra, y la salida
   de la validación.

[RESTRICCIONES]
- No muevas ni borres nada de .claude/, y no cambies los hooks de mi proyecto:
  la adaptación va solo en la copia de plugin/scripts/.
- Escribe todos los archivos con tu herramienta de edición, no con la consola:
  el hook de mi proyecto busca texto, y los hooks traen git reset --hard
  escrito adentro.
- No instales el plugin en este proyecto: los hooks correrían dos veces.
- Ninguna ruta de mi máquina dentro de plugin/.
- No agregues piezas nuevas: se empaqueta lo que existe.
- No escribas LICENSE ni ícono.

[RAZONAMIENTO] Para cada pieza, antes de decidir, dime qué parte de ella
depende de mi app: un archivo, una ruta, una regla. Eso decide si viaja.

[FORMATO DE SALIDA] (1) la tabla de decisión; (2) los nombres para elegir;
(3) después de mi elección, el árbol de plugin/; (4) las dos corridas del
probador, y qué falló en la primera; (5) la salida de las dos validaciones;
(6) commit propuesto: "feat: package the safety net as a plugin for Fase 8.1".
El commit lleva también docs/VERIFICACION_S8.md.
```

---

## Prompt Fase 8.2 — Instalar en limpio

> **Tu terminal y un chat, en la carpeta de prueba.** Después, un chat en tu
> proyecto para anotarlo.

### Paso 0 — creas la carpeta de prueba, en tu terminal

Si ya la tienes, salta al Paso 1. Es un clon del ejemplar del curso. Va **al
lado de tu proyecto, no dentro**, y no es una copia de tu repositorio: esa ya
trae tus hooks, y correrían dos veces. Los comandos son iguales en PowerShell,
macOS y Linux:

```bash
cd <CARPETA_QUE_CONTIENE_TU_PROYECTO>
git clone https://github.com/growlearnjo/mercadotech.git prueba_plugin
cd prueba_plugin
git checkout f4c3ffb
```

`f4c3ffb` es la versión final del ejemplar de la edición 4. Git avisa
"detached HEAD": es lo esperado, porque ahí no vas a hacer commits. No hace
falta `npm install`.

### Paso 1 — instalas, en tu terminal

Abre una terminal **en la carpeta de prueba**, no en tu proyecto. Cambia los
nombres por los de tu `marketplace.json`:

```bash
claude plugin marketplace add <RUTA_PROYECTO> --scope local
```

```bash
claude plugin install <nombre-del-plugin>@<nombre-del-marketplace> --scope local
```

```bash
claude plugin list
```

Tiene que aparecer tu plugin, con `Scope: local` y habilitado.

**Mientras esté instalado, no muevas ni borres tu proyecto**: con un marketplace
local, el plugin corre desde tu carpeta `plugin/`.

### Paso 2 — lo pruebas, en un chat abierto en la carpeta de prueba

Abre Claude Code en la carpeta de prueba. Si te pide aprobar un servidor MCP de
ese proyecto, puedes rechazarlo: no es tu plugin.

1. Pega esto:

   ```text
   Usa la consola Bash: corre git status --short y después git reset --hard
   HEAD. Dime qué pasó con cada uno, y copia tal cual cualquier mensaje de
   bloqueo.
   ```

   El segundo tiene que quedar bloqueado. El aviso dice que el hook viene de tu
   plugin: "This hook comes from the <plugin>@<marketplace> plugin". **En
   Windows**, pega después:

   ```text
   Ahora lo mismo con la consola PowerShell.
   ```

   También tiene que quedar bloqueado.

2. Escribe `@` y busca tu Tech Lead. Tiene que aparecer con el prefijo del
   plugin.

3. Elige un módulo de ese proyecto y pégale esto, con el nombre que aparezca en
   `@`:

   ```text
   Pásale a @"<plugin>:tech-lead (agent)" este encargo, y nada más: "Audita
   [MÓDULO]. Usa tu rúbrica." Muéstrame tal cual lo que responda.
   ```

   Mira si su rúbrica, escrita para tu app, encuentra algo en un código que no es
   el tuyo.

   Si quieres ver al hook frenarlo: pídele que **intente** leer un archivo de
   `docs/` de ese proyecto aunque su archivo lo prohíba, y que te diga cuántas
   herramientas usó. Lo más probable es que se niegue sin usar ninguna: lo frena
   su propia instrucción, no el hook. La prueba del prefijo ya la hizo el
   probador en la 8.1.

4. Si llevaste la Skill, pídele algo que coincida con su descripción y mira si se
   carga, y si lo que dice tiene sentido en este proyecto.

**Anota todo lo que pase**, actúe o no.

### Paso 3 — desinstalas, en tu terminal

```bash
claude plugin uninstall <nombre-del-plugin>@<nombre-del-marketplace> --scope local
```

```bash
claude plugin marketplace remove <nombre-del-marketplace> --scope local
```

`claude plugin list` ya no lo muestra, y el `.claude/settings.local.json` de la
carpeta de prueba queda con las dos listas vacías. La copia del plugin en
`~/.claude/plugins/cache/<marketplace>/` se queda: si quieres, la borras a mano.

### Paso 4 — lo anotas, en un chat nuevo en tu proyecto

```text
[ROL] Actúa como quien escribe el informe de una prueba de campo: qué se probó,
dónde, qué funcionó y qué no, sin adornarlo.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 8.2 de
doc_sesions/sesion8/Ed5_sesion8.md y docs/PLUGIN.md. Instalé mi plugin con
alcance local en otra carpeta y lo probé. Lo que pasó te lo cuento aquí:
[PEGA AQUÍ TUS NOTAS: qué carpeta usaste, qué respondió al reset, cómo apareció
el Tech Lead, qué encontró en el módulo, y qué pasó con la Skill si la llevaste]

[OBJETIVO] Agrega a docs/PLUGIN.md una sección "Instalado en limpio": la carpeta
de prueba (sin rutas de mi máquina), los comandos, qué actuó, qué no, y qué
cambiarías en el plugin. Y, con eso, responde la pregunta de la 8.1: ¿las piezas
que dije que viajaban, viajaron?

[RESTRICCIONES]
- Escribe lo que pasó, no lo que debería haber pasado.
- No cambies el plugin en esta fase.

[FORMATO DE SALIDA] (1) la sección escrita; (2) commit propuesto: "docs: record
the clean install of the plugin for Fase 8.2".
```

---

## Prompt Fase 8.3 — El showcase

> **Chat nuevo.** Después, **tú**: el reloj y la grabación.

```text
[ROL] Actúa como quien prepara una demo que no puede fallar en vivo: cada minuto
tiene su dato, cada dato tiene su archivo, y hay un plan B para lo que se rompa.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO>. Lee la Fase 8.3 de
doc_sesions/sesion8/Ed5_sesion8.md y mis tablas: docs/00-ANTES.md §5,
docs/MEDICIONES.md, docs/COSTOS.md, docs/REVISION.md, docs/PERMISOS.md,
docs/SECRETOS.md, docs/INYECCION.md, docs/DECISIONES.md y docs/PLUGIN.md.

[PÚBLICO Y TONO] Para una audiencia técnica que no conoce mi proyecto, en cinco
minutos. Sin adjetivos: la presentación es la tabla.

[OBJETIVO] En este orden.
1. Escribe docs/SHOWCASE.md con el formato de docs/DEMO.md del ejemplar: antes
   de empezar; cinco bloques de un minuto (el antes, el contrato y el costo, el
   revisor, la red, el paquete), cada uno con qué se muestra en pantalla, el
   dato exacto, y de qué archivo sale; y un plan B. Si un dato no se midió,
   escribe "sin medir".
2. Actualiza README.md: qué es el proyecto en dos líneas, cómo correrlo, y una
   tabla de dónde está cada pieza del gobierno (contrato, Skill, revisor,
   permisos, hooks, CI y revisión, plugin), con su archivo y la sesión en que
   nació.
3. Deja en docs/SHOWCASE.md una línea al final: "Ensayo cronometrado: [tiempo]".
   La lleno yo.

[RESTRICCIONES]
- Ningún número que no esté en mis archivos. Ningún "hasta un X %".
- No toques docs/00-ANTES.md ni docs/MEDICIONES.md.
- No leas ningún archivo .env.

[RAZONAMIENTO] Antes de escribir, dime para cada bloque cuál es el único dato que
más cambió entre la sesión 1 y hoy. Ese es el que va en grande.

[FORMATO DE SALIDA] (1) los cinco datos centrales, con su archivo; (2) el guion
escrito; (3) el README, antes y después; (4) commit propuesto: "docs: add the
showcase script and the governance README for Fase 8.3".
```

Después, **tú**:

1. Ensaya el guion con un reloj, de principio a fin.
2. Anota el tiempo en la última línea de `docs/SHOWCASE.md`. Si pasa de cinco
   minutos, saca un bloque o un dato. No hables más rápido.
3. Graba el video con tu herramienta de pantalla, en un ensayo que entre en el
   tiempo.
4. Haz el commit con el tiempo anotado.

---

## Prompt de cierre del curso

> **Conversación nueva.** Es la última entrada de tu bitácora.

```text
[ROL] Actúa como quien escribe la última página de la bitácora de un proyecto:
qué se quería, qué se logró, qué no, y qué sigue.

[CONTEXTO] Mi proyecto está en <RUTA_PROYECTO> y el curso terminó. Existen
plugin/, .claude-plugin/marketplace.json, docs/PLUGIN.md, docs/SHOWCASE.md con
el tiempo del ensayo, y el README.md al día. El repositorio remoto es <TU_REPO>.

[PÚBLICO Y TONO] Para mí, y para quien abra este repositorio sin conocerme:
directo, con lo que de verdad pasó y sin adjetivos.

[OBJETIVO] En este orden:
1. Agrega a docs/BITACORA.md la entrada de la sesión 8: qué entró en el plugin y
   qué no, qué pasó al instalarlo en limpio, cuánto duró el ensayo del
   showcase, y una tabla final del curso: los cuatro defectos del inventario de
   la sesión 1, en qué sesión se cerró cada uno, y con qué archivo se comprueba.
2. Revisa mi CLAUDE.md completo: ninguna línea puede afirmar algo que hoy sea
   falso. Si alguna ya no es verdad, dime cuál y propón la línea nueva, pero no
   la cambies sin que yo lo confirme.
3. Corre los greps anti-fuga de docs/SECRETOS.md. Tienen que dar vacío. Si
   encuentras algo, detente y avísame: no subas nada.
4. Sube todo al remoto.

[RESTRICCIONES]
- No toques docs/00-ANTES.md ni docs/MEDICIONES.md: son el antes y la medición.
- No intentes cambiar .claude/settings.json ni los hooks.
- No escribas ninguna cifra que no esté en mis archivos.
- Si el push falla por autenticación, dime el paso exacto que tengo que hacer
  en el navegador; no intentes rutas alternativas con tokens.

[FORMATO DE SALIDA] (1) la entrada de la bitácora; (2) la tabla de los cuatro
defectos; (3) las líneas del CLAUDE.md que ya no son verdad, si hay; (4) la
salida de los greps; (5) la salida del push; (6) commit propuesto: "docs: close
the course with the plugin and the showcase".
```

**Y lo que sigue.** Este curso enseñó a gobernar un agente sobre una app chica.
Construir productos completos con agentes —backend, base de datos, RAG,
despliegue, orquestación de varios agentes— es *AI Agentic Engineer*.
