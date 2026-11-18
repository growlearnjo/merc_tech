# Sesión 3 — Costos medidos: modelo, effort y caché

> **El PPT ya está armado**: [`Ed5_sesion3.pptx`](Ed5_sesion3.pptx), 35 láminas
> sobre la plantilla de la sesión 1 (mismos layouts, colores y tipografías) y con
> las notas del docente en el panel de notas de cada lámina. Este documento es el
> guion del que salió: para preparar la clase, no para proyectarlo.

Los datos técnicos están verificados contra la documentación oficial el
**11 de noviembre de 2026**. Las fuentes y la fecha están al final, como pide
`CONVENCIONES.md` §5. Es la sesión del curso donde más importa: **los precios
cambian**, y esta spec entera envejece con ellos.

---

## Verificado hoy (11 nov 2026) — lo que cambia tu preparación

| Hallazgo | Consecuencia para la clase |
|---|---|
| **`/cost` es un alias de `/usage`.** El comando que el alumno localizó en la sesión 1 sigue funcionando, pero la pantalla que hay que leer se llama `/usage`. | La lámina 23 lo dice así, y evita la pregunta de "¿no era `/cost`?". |
| El bloque **Session** de `/usage` trae costo total, duración de API, duración de reloj, cambios de código y **uso por modelo** (input, output, cache read, cache write). | Es la pantalla del lab: de ahí sale el dólar de cada corrida. |
| La línea **`Prompt cache (main)`** da peticiones, porcentaje de entrada servido desde caché, fallos y si la caché está caliente. Requiere **v2.1.251+**; desde **v2.1.260** nombra la causa probable del último fallo. | Es la mejor demo de la sesión. Compruébalo antes de clase con `claude --version`. |
| Los totales del bloque Session **se reinician con `/clear`** (desde v2.1.211). | Es lo que hace que el lab funcione: una corrida, una conversación, un total limpio. |
| **El dólar que muestra Claude Code lo calcula tu máquina**, contando tokens a tarifa de lista. Con plan de Claude no se factura por token. | Lámina 24, y es obligatoria: sin ella medio grupo cree que le están cobrando. |
| **Cambiar el effort ya no invalida la caché** en Opus 5.5, Sonnet 5.5, Haiku 5.5 y Fable 5.1 o posterior, con clave de API o plan de Claude. En los demás modelos sí, y Claude Code pregunta antes. | Hace que la corrida B del lab sea barata. Va con asterisco en la lámina 13. |
| El **TTL** de la caché es de 5 minutos, o de 1 hora para la conversación principal con plan de Claude dentro del uso incluido. Se fija a mano con `promptCacheTtl` / `CLAUDE_CODE_PROMPT_CACHE_TTL` (**v2.1.242+**). | Lámina 14. Explica por qué el primer turno después del café es el caro. |
| **Editar el `CLAUDE.md` a mitad de sesión no rompe la caché… porque tampoco se aplica** hasta el siguiente `/clear`, `/compact` o reinicio. | Cierra un cabo suelto de la sesión 2. Está en las notas de la lámina 13. |

---

## La aritmética de la sesión

Es el corazón del bloque 02 y de la lámina "Acortar prompts ya no es palanca".
**No es una medición: es aritmética con precios publicados.** Dilo así en clase,
y que el número del alumno salga de su `/usage`.

Tarifas de lista de la API de Claude (11 nov 2026), por millón de tokens:

| Modelo | Entrada | Salida | Leído de caché |
|---|---|---|---|
| Opus 5.5 | $4 | $20 | $0,20 |
| Sonnet 5.5 | $2 | $10 | $0,10 |
| Haiku 5.5 | $0,10 | $0,50 | $0,01 |

Escribir en caché cuesta **1,25× la entrada** con el reloj de 5 minutos y **2×**
con el de 1 hora. (Los precios de Haiku 5.5 son para prompts de hasta 100K
tokens; por encima suben.)

Sobre un contexto de **100.000 tokens en Opus 5.5**:

| Operación | Cuenta | Costo |
|---|---|---|
| Reenviarlo **sin** caché | 100.000 × $4 / 1M | **$0,40** por turno |
| Reenviarlo **desde** caché | 100.000 × $0,20 / 1M | **$0,02** por turno |
| **Escribirlo** en caché (5 min) | 100.000 × $5 / 1M | **$0,50**, una vez |
| Tu prompt de 300 tokens | 300 × $4 / 1M | **$0,0012** |

De ahí sale la frase del temario, y conviene decirla entera:

> Recortar tu prompt a la mitad te ahorra **$0,0006**.
> Cambiar de modelo a mitad de sesión te cuesta **$0,40** de lectura sin caché
> más la reescritura, en el turno siguiente.
> Escribir menos ahorra diezmilésimas; no romper la caché ahorra centavos.

**Y la vuelta de tuerca**, que es la que evita la lectura simplona: un prompt
vago sí sale caro, pero no por sus tokens —por los turnos de corrección que
provoca. **El costo se mide por tarea terminada, no por petición.** Es
exactamente lo que mide la columna "turnos" del lab.

---

## Mapa de la presentación

| # | Lámina | Bloque |
|---|---|---|
| 1–3 | Portada · Reglas de clase | — |
| 4 | Sesión 3 · Costos medidos | — |
| 5 | Agenda (6 bloques) | — |
| 6 | Dónde quedamos: dos filas de `MEDICIONES.md` y una factura | recap |
| 7–10 | Cómo se cobra una conversación · Las tres cifras · **Qué se reenvía en cada turno** (diagrama) | 01 |
| 11–15 | Qué hace la caché con números · **Qué rompe la caché y qué no** (diagrama) · El reloj · Acortar prompts ya no es palanca | 02 |
| 16–18 | Qué es el effort · Qué nivel conviene a cada tarea | 03 |
| 19–21 | **Lo que cuesta un millón de tokens** (diagrama) · Criterio de elección | 04 |
| 22–25 | La pantalla que vas a leer · Qué es y qué no es ese número · Por qué sube el consumo solo | 05 |
| 26–33 | El lab · Fase 3.1 · **Las cinco configuraciones** (diagrama) · Fases 3.2 y 3.3 · La tabla que te llevas · La próxima sesión | lab |
| 34–35 | ¡Gracias! · Modo de evaluación | — |

**El laboratorio se corre aparte de esta clase de teoría** (hallazgo 1 de la
spec): esta clase lleva la teoría de la 3 y el laboratorio pendiente de la 2; el
de la 3 va en su propia clase, porque son cinco corridas y diez chats.

**Reloj de 2 h de teoría:** recap 10 · 01 → 15 · 02 → 25 · 03 → 15 · 04 → 15 ·
05 → 15 · cierre 5 (suma 100; el resto, para el laboratorio pendiente de la 2).
Si el reloj aprieta se recorta el bloque 05, **nunca el 02**: es el que sostiene
el laboratorio.

---

## El lab, en detalle

### Fase 3.1 — Tu factura (≈10 min)

El alumno abre `docs/00-ANTES.md`, relee la sección FACTURA y escribe **tres
hipótesis, una línea cada una**: qué palanca cree que manda, si el effort paga
igual con los dos modelos, y cuánto hay entre su configuración más cara y la más
barata. Se comprueban o se desmienten en la fase siguiente, y las dos cosas
enseñan.

Quien no tenga la factura —porque cerró la conversación sin mirarla en la
sesión 1— usa la corrida A como línea base y lo anota así. Eso también es la
lección de la sesión 1, cobrada tarde.

### Fase 3.2 — Cinco corridas, una tarea

**Antes de empezar:** `git revert` del commit del filtro, igual que en la
sesión 2, y un revert antes de cada corrida. Las cinco parten del mismo código.

| | Modelo | Effort | Qué es |
|---|---|---|---|
| **A** | el de la sesión 2 | el de la sesión 2 | la referencia: repite tu fila S2 |
| **B** | el más capaz | el más alto | el techo |
| **C** | el más capaz | el más bajo | |
| **D** | el más barato | el más alto | |
| **E** | el más barato | el más bajo | el piso |

De la B a la E son las cuatro combinaciones de dos modelos por dos niveles de
effort: cada palanca se mide dos veces, y aparece si el effort paga distinto
según el modelo. La A da el ruido del agente entre dos días.

Reglas de la medición, las mismas de `TAREA_PATRON.md`:

* **Conversación nueva** cada vez. Los totales de `/usage` se reinician con
  `/clear`, así que cada corrida tiene su propio total limpio.
* **Enunciado idéntico**, ni una palabra distinta.
* **`/usage` antes de cerrar** cada conversación. Después, el dato se recupera mal.
* **Revertir entre corridas.** Es el error que arruina la medición: si la
  segunda arranca con el filtro ya hecho, sale baratísima y no mide nada.
* Se anotan los siete datos de `TAREA_PATRON.md` §3, con el costo en dólares.
  El séptimo es **decisiones no pedidas**: un modelo más barato puede decidir
  más por su cuenta, y eso no aparece en el dólar.

> **Aviso honesto que hay que dar en clase:** cada conversación nueva paga su
> propia escritura de caché. Está incluido en el precio de cada corrida, y es
> correcto que lo esté: es lo que cuesta hacer esa tarea desde cero.

Si el grupo va lento se sacrifican en orden: primero la A —reemplazable por la
fila S2— y luego la C o la D. **La B y la E no se tocan**, que son el rango. Lo
que no se corra queda para casa.

### Fase 3.3 — `docs/COSTOS.md` (≈10 min)

Nace el archivo que la Ed. 4 nunca llegó a tener. Es corto a propósito:

1. La tabla: una fila por configuración, con costo, turnos, duración y resultado.
2. El precio de lista que usó y **la fecha en que lo consultó**.
3. **La frase que es el producto**: *"para tareas así uso esto, y para estas
   otras, aquello"*.

La fila elegida se copia a `docs/MEDICIONES.md` como **S3**, y con eso la tabla
de tres filas del curso queda completa.

> **Si las corridas salen casi iguales, esa también es una regla**, y hay
> que decirlo antes de que alguien lo viva como un fracaso: significa que para
> *esa* tarea la configuración cara no aporta nada. Es justo lo que querías saber.

---

## Si algo falla (tabla de apoyo para el docente)

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| `/usage` no muestra la línea `Prompt cache (main)` | versión anterior a **v2.1.251** | `claude --version`; actualizar. Sin ella, la demo del bloque 02 se hace con el uso por modelo |
| El costo de la corrida B sale casi igual que el de A | el effort no cambió, o el modelo ignora el nivel | `/effort status` antes de empezar; comprobar que el modelo admite el nivel elegido |
| La corrida C sale **más cara** que la A | el modelo barato necesitó turnos de corrección | **No es un fallo: es el resultado.** Es la lámina del costo por tarea terminada, viva |
| La segunda corrida sale sospechosamente barata | no se revirtió el filtro entre corridas | `git log --oneline`, `git revert`, y repetir esa corrida |
| El alumno con plan cree que le están cobrando | no se dio la lámina 24 | El dólar es una estimación a tarifa de lista; con plan se consume cuota, no dinero |
| Todos los costos salen en cero o vacíos | sesión con proveedor de nube o pasarela que no reporta tokens de caché | Anotar "sin medir" en esa columna y comparar por turnos y duración |
| El alumno quiere comparar su cifra con la del docente | cada app es distinta | La comparación es **consigo misma**, tres veces. Nunca contra el ejemplar ni contra el compañero |

## Restricciones de la sesión

* No se escriben Skills ni se conecta MCP: sesión 4.
* No se crean subagentes: sesión 5. (Se nombran, porque gastan.)
* No se tocan permisos ni hooks: sesión 6.
* **Ninguna cifra de ahorro que nadie midió.** Nada de "hasta un 40 % menos":
  es la lección más cara de la Ed. 4 y está en `CONVENCIONES.md` §4.

## Entregables de la sesión

1. `docs/COSTOS.md` con las cinco configuraciones, su costo en dólares y la regla.
2. La tercera fila de `docs/MEDICIONES.md`, completa.
3. Un commit por fase.

---

## Fuentes y fecha de consulta

Verificado el **11 de noviembre de 2026** contra la documentación oficial:

* `/usage`, el bloque Session, la línea de caché, el desglose por plan y
  "por qué sube el consumo en una sesión larga" —
  [Manage costs effectively](https://code.claude.com/docs/en/costs)
* Capas de la petición, qué rompe y qué conserva la caché, TTL y cómo fijarlo —
  [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
* `/cost` como alias de `/usage`, `/effort`, `/model`, `/context` —
  [Commands](https://code.claude.com/docs/en/commands)
* Niveles de effort, predeterminados por modelo y ventana de auto-compactación —
  [Model configuration](https://code.claude.com/docs/en/model-config)
* Precios por modelo y economía de la caché (lectura 0,05× en Opus 5.5 y
  Sonnet 5.5; escritura 1,25× y 2×) — referencia de la API de Claude

> **Regla de la Ed. 5, y aquí más que en ninguna sesión:** estos precios se
> mueven. Antes de dar la clase, vuelve a mirar la tabla de la lámina 20 y la
> fecha de arriba. Un número viejo en una sesión sobre costos destruye la
> credibilidad de las otras siete.
