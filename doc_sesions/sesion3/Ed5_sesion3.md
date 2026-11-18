# Claude Code Ed. 5 — Sesión 3: Costos medidos, modelo, effort y caché

## Este documento contiene la especificación completa de la sesión. Léelo completamente antes de ejecutar nada. No hagas suposiciones fuera de lo especificado.

**Prompts de la sesión (ejecutar en orden; versión completa y autocontenida de cada uno en `PROMPTS_sesion3.md`):**

0. "Ejecuta el Prompt 0 de `PROMPTS_sesion3.md`: verifica el terreno."
1. "Lee `Ed5_sesion3.md` completo y confírmame que entiendes el alcance. No ejecutes nada todavía."
2. "Ejecuta la Fase 3.1: lee mi factura de la sesión 1 y ayúdame a escribir mis hipótesis."
3. "Ejecuta la Fase 3.2: la tarea patrón en cinco configuraciones."
4. "Ejecuta la Fase 3.3: escribe mi `docs/COSTOS.md` con la regla de elección."
5. "Ejecuta el Prompt de cierre de `PROMPTS_sesion3.md`: bitácora y tabla al día."

---

## Objetivo general

Al terminar, el alumno tiene un `docs/COSTOS.md` propio donde la misma tarea
aparece corrida cinco veces: una con la configuración de la sesión 2 y las
cuatro combinaciones de dos modelos por dos niveles de effort, cada una con su costo en dólares, y una frase escrita por él que dice
para qué tarea usa cada configuración. Y tiene la tercera fila de
`docs/MEDICIONES.md`, con lo que cierra la tabla de tres filas del curso.

## Objetivos específicos

* Que el alumno sepa de dónde sale el dólar que ve en pantalla, y que entienda
  que con un plan de Claude ese número es una estimación a tarifa de lista, no
  una factura.
* Que sepa leer las tres cifras que explican el costo de una conversación:
  entrada nueva, lectura de caché y salida.
* Que sepa qué rompe la caché y qué no, y por qué el primer turno después de
  una pausa larga es el caro.
* Que tenga medido, con sus propios números, cuánto le paga bajar el effort y
  cuánto le paga cambiar de modelo en **su** tarea.
* Que salga con una regla de elección escrita por él, no con una tabla copiada.
* Que vea **cómo se movió el costo a lo largo del curso**, leyendo la columna de
  costo de sus tres filas: lo que costó la tarea sin reglas, con el contrato
  puesto, y con la configuración que eligió. Es la otra comparación de la
  sesión, y no es la de las corridas de hoy.

---

## Qué vas a construir, en palabras simples

Hasta hoy el costo era una impresión: "esto parece caro". Hoy se vuelve una
tabla con dólares.

La idea que gobierna la sesión es que **una conversación con un agente no se
paga por mensaje, se paga por lo que se reenvía en cada turno**. Cada vez que
le escribes algo, el agente vuelve a recibir toda la conversación anterior, no
solo tu última frase. Por eso el precio no depende de lo corto que escribas
sino de cuánto contexto arrastras y de a qué precio se te cobra ese arrastre.

La caché es el descuento que se aplica a lo que se reenvía sin cambios. Cuando
funciona, ese arrastre cuesta una fracción. Cuando se rompe, se paga entero.

Y después se mide. La misma tarea de las dos sesiones anteriores, cinco veces:
una con tu configuración actual, y las otras cuatro con las combinaciones de dos
modelos por dos niveles de effort. Cinco números, y la decisión de cuál usar la
tomas tú.

```mermaid
flowchart TD
    A["docs/00-ANTES.md<br/>la FACTURA de la sesión 1"] --> B["Fase 3.1<br/>leer la factura con tokens.py<br/>+ tres hipótesis, una línea cada una"]
    B --> C["Fase 3.2<br/>la misma tarea, cinco veces<br/>A base · B-E: dos modelos × dos niveles de effort"]
    C --> D["Fase 3.3<br/>docs/COSTOS.md<br/>la tabla y LA REGLA"]
    D --> E["docs/MEDICIONES.md<br/>fila S3: la configuración elegida"]
    F["filas S1 y S2<br/>(sesiones 1 y 2)"] -.cierra la tabla.-> E
```

## Glosario mínimo

| Término | En una línea |
|---|---|
| Token | El pedazo en que se corta el texto para cobrarlo. Un token es más o menos tres cuartos de una palabra. |
| Entrada | Lo que el agente recibe en un turno: tu mensaje más toda la conversación anterior más tus archivos de memoria. |
| Salida | Lo que el agente escribe. Cuesta bastante más que la entrada. |
| Caché de prompt | El descuento que se aplica a la parte de la entrada que se reenvía **sin cambios** respecto del turno anterior. |
| Escritura de caché | Lo que cuesta guardar ese contexto la primera vez. Cuesta **más** que la entrada normal, y se paga una sola vez. |
| Lectura de caché | Lo que cuesta reenviar ese contexto ya guardado. Cuesta una fracción de la entrada. |
| TTL de la caché | Cuánto dura guardado antes de caducar. Si caduca, el siguiente turno vuelve a pagar la escritura. |
| Effort | Cuánto se le permite al modelo "pensar" antes de responder. Más effort es más calidad y más salida, y la salida es lo caro. |
| Tarifa de lista | El precio público por millón de tokens. Es con lo que se calcula el número que ves, aunque pagues con un plan. |
| Costo por tarea terminada | Lo que costó **acabar** algo, sumando los turnos de corrección. Es la única medida que sirve para decidir. |
| `/usage` | La pantalla de Claude Code que muestra el gasto de la sesión. `/cost` es su alias. |
| `tokens.py` | La herramienta del curso que lee las conversaciones guardadas en el disco y las convierte a dólares equivalentes. |

---

## Antes de empezar: tareas humanas

1. **Actualizar Claude Code a 2.1.283 o superior** (5 min, sin costo), si no se
   hizo en la sesión 2. Esa versión cubre todo lo que esta sesión necesita: la
   línea de caché de `/usage` pide 2.1.251, el reinicio de los totales con
   `/clear` pide 2.1.211, y fijar el reloj de la caché a mano pide 2.1.242.

   **Comprueba la versión donde vayas a trabajar**, porque la terminal y la
   extensión del editor pueden ser dos instalaciones distintas:

   ```bash
   claude --version
   ```

   Si está por debajo, actualiza con el comando propio y, si tu instalación
   vino por npm y ése no la mueve, con npm:

   ```bash
   claude update
   ```

   ```bash
   npm install -g @anthropic-ai/claude-code@latest
   ```

   Después vuelve a correr `claude --version` y reinicia la sesión.
2. **Tener hecha la medición de la sesión 2** (fases 2.2 y 2.3 de
   `PROMPTS_sesion2.md`). Por la decisión del hallazgo 1, ese laboratorio se
   corre en la clase de esta sesión, así que al llegar al laboratorio de la 3
   la fila S2 ya tiene que estar llena. Quien llegue sin ella hace la sesión
   igual: su comparación será su línea base contra la S3, y lo anota.

> **Para el docente, antes de dar la clase:** volver a consultar la tabla de
> precios y la fecha de §"Las tarifas" de este documento. Un número viejo en la
> sesión sobre costos destruye la credibilidad de las otras siete.

## Estado de partida

| Debe existir | Dónde | Lo usa la fase |
|---|---|---|
| La FACTURA de la sesión 1 | `docs/00-ANTES.md`, sección FACTURA | 3.1 |
| Las conversaciones guardadas del proyecto, que es lo que lee `tokens.py` | la carpeta de proyectos de Claude Code en la máquina del alumno | 3.1, 3.2 |
| La fila "S1 · sin reglas" llena | `docs/MEDICIONES.md` | 3.2, 3.3 |
| La fila "S2 · con `CLAUDE.md`" llena, **o la constancia de que falta** | `docs/MEDICIONES.md` | 3.2, 3.3 |
| El **consumo de la FACTURA** medido por bloque, con el `tokens.py` corregido | `docs/00-ANTES.md` | 3.1 |
| El costo de las filas S1 y S2 **medido por bloque**, con el mismo script, y dicho al pie de la tabla | `docs/MEDICIONES.md` | 3.3 |
| El enunciado de la tarea patrón, al pie de la tabla | `docs/MEDICIONES.md` | 3.2 |
| El `CLAUDE.md` del proyecto, escrito y auditado en la sesión 2 | raíz de `<RUTA_PROYECTO>` | 3.2 |
| El commit de la tarea patrón, aislado y reversible | el historial, `git log --oneline` | 3.2 |
| El repositorio sin cambios pendientes, en `<COMMIT_ANTERIOR>` | `<RUTA_PROYECTO>` | 3.2 |
| Claude Code 2.1.283 o superior | la máquina del alumno | toda la sesión |

La carpeta de la sesión trae cuatro archivos para el alumno: esta spec, los
prompts, `TAREA_PATRON.md` y `tokens.py`. Los dos últimos son **copias
idénticas** de las de las sesiones 1 y 2, para que la carpeta funcione sola. Si
se modifican, se modifican todas: se comprueba con `diff` y tiene que salir sin
diferencias.

### Decisiones tomadas al preparar esta sesión

| # | Hallazgo | Resolución | Fase |
|---|---|---|---|
| 1 | **El laboratorio no entra en la misma clase que la teoría de esta sesión**, sobre todo porque la sesión llega con la medición de la sesión 2 pendiente | **El laboratorio de esta sesión se corre aparte de su clase de teoría.** La clase lleva la teoría y el laboratorio pendiente de la sesión 2; el de la 3 se corre cuando el docente lo programe, igual que pasó con el de la 2. Aparte, se recorta el bloque 05, que la propia presentación nombra como primero en caerse | toda |
| 2 | **El instrumento de medición cambiaba entre sesiones.** Las sesiones 1 y 2 miden el costo con `tokens.py`; la presentación de esta medía con `/usage`. Tres filas de una misma tabla con dos instrumentos distintos no se comparan | **Un solo instrumento para la tabla: `tokens.py`**, también en las cinco corridas de esta sesión, y se anotan **tokens y dólares**, no solo dólares, porque los precios cambian y los tokens no. `/usage` se queda como pantalla de clase, para lo único que la herramienta no puede decir: si la caché está caliente ahora. Se mira, no se copia a la tabla | 3.1, 3.2 |
| 3 | La presentación dice que se anotan **seis** datos y `TAREA_PATRON.md` §3 dice **siete** | Son siete. El que falta es **decisiones no pedidas**, que es justamente el que en la corrida de preparación no empató. Se pide en las cinco corridas: un modelo más barato puede decidir más cosas por su cuenta, y eso es un costo que no aparece en dólares | 3.2 |
| 4 | **`/cost` es un alias de `/usage`.** El comando que el alumno localizó en la sesión 1 sigue funcionando, pero la pantalla que hay que leer se llama `/usage` | Se nombran los dos para evitar la pregunta en clase | 3.1 |
| 5 | **Cambiar el effort ya no invalida la caché** en los modelos de la generación 5.5 y en Fable 5.1 o posterior, con clave de API o plan de Claude. En los demás sí, y Claude Code avisa antes | Hace que la corrida B salga barata, y va dicho con asterisco: en un modelo más viejo esa corrida cuesta más | 3.2 |
| 6 | **Editar el `CLAUDE.md` a mitad de sesión no rompe la caché, porque tampoco se aplica** hasta el siguiente `/clear`, `/compact` o reinicio | Cierra un cabo suelto de la sesión 2, y explica por qué las corridas tienen que empezar en conversación nueva | 3.2 |
| 7 | **El dólar que muestra Claude Code lo calcula la máquina del alumno**, contando tokens a tarifa de lista. Con un plan de Claude no se factura por token: se consume cuota | Es una lámina obligatoria. Sin ella, medio grupo cree que le están cobrando | 3.1 |
| 8 | Un prompt vago sí sale caro, pero **no por sus tokens**: por los turnos de corrección que provoca | El costo se mide **por tarea terminada**, y eso es lo que mide la columna de turnos | 3.1, 3.3 |
| 9 | En la corrida de preparación, la mayor parte del consumo entró **por lectura de caché**, y leerlo costó una fracción de lo que habría costado como entrada nueva | La caché se enseña **con el número del propio alumno**. Ese número lo guarda el paso 2 de `PROMPTS_sesion2.md` en la sección FACTURA, así que esta fase **solo lo lee**: no vuelve a medir | 3.1 |
| 10 | **El `tokens.py` de las sesiones 1 y 2 medía mal, por dos motivos a la vez.** Contaba cada respuesta tantas veces como pedazos tiene en el disco —Claude Code parte una respuesta en una línea por el texto y una por cada herramienta, y repite el contador en todas—, así que inflaba el gasto entre **1,9 y 4,2 veces**, con un factor distinto en cada conversación. Y daba el total de la conversación, no el de la tarea: un chat con tres trabajos dentro reportaba los tres sumados | **El script cuenta cada respuesta una sola vez, por su `message.id`, y da el gasto por bloque**: cada mensaje del alumno con las respuestas que vinieron después. Los tres costos viejos —el consumo de la FACTURA, la fila S1 y la fila S2— se vuelven a medir en el **Paso 2 de la ruta (condicional)** de los prompts, que va **justo después del Prompt 0 y antes de leer la spec**, porque la hipótesis de la 3.1 nace de la FACTURA y la comparación de la 3.3 nace de las filas. Las corridas se buscan por el texto del enunciado con `--patron`. El factor de inflado **no es constante**, así que no se corrige dividiendo: o se vuelve a medir, o la comparación de esta sesión no vale | 3.2, 3.3 |
| 11 | **El Paso 2 de la ruta corregía la FACTURA en `docs/00-ANTES.md`, pero la Fase 3.1 la lee de `docs/VERIFICACION_S3.md`**, que el Prompt 0 escribe antes de esa medición. Todo alumno que pasaba por el Paso 2 llegaba a la 3.1 con "sin dato", o peor, con el número inflado de la sesión 2, que la 3.1 usaba sin avisar. Salió en el ensayo del 2026-11-18 | **El prompt del Paso 2 pone al día `docs/VERIFICACION_S3.md`**: los cuatro datos de la FACTURA, las líneas de bloque de los datos que reescribió, y el veredicto. El archivo sigue sin commit hasta la Fase 3.1, como dice el Prompt 0 | 3.1 |

---

## Mapa de fases y dependencias

| Fase | Qué entrega (en una línea) | Depende de | Se verifica con |
|---|---|---|---|
| 3.1 | La factura de la sesión 1 leída, y tres hipótesis escritas, una línea cada una | Prompt 0 | La hipótesis está escrita en `docs/COSTOS.md` o en la bitácora, antes de medir |
| 3.2 | Las cinco corridas, cada una con sus siete datos | 3.1 | Cinco bloques medidos con `tokens.py`, y `git log` con un revert antes de cada corrida |
| 3.3 | `docs/COSTOS.md` con la tabla y la regla, y la fila S3 de `docs/MEDICIONES.md` | 3.2 | El archivo existe, tiene la fecha de consulta de los precios, y termina con la frase del alumno |

## Convenciones transversales

* **Ningún número sin ejecución detrás.** Lo que no se midió dice "sin medir".
  En esta sesión más que en ninguna: es la sesión de los números.
* **Ninguna cifra de ahorro que nadie midió.** Nada de "hasta un 40 % menos".
  Es la lección más cara de la edición anterior.
* **Los precios se citan con su fecha de consulta.** Siempre.
* **Cada alumno compara contra sí mismo**, tres veces, nunca contra el
  compañero ni contra el proyecto ejemplar.
* **Los comandos que empiezan con `/` los escribe el alumno en el chat**, no el
  agente. El agente trabaja sobre la salida que ya está en el chat.
* **Cuando la spec dice "anota", el que anota es el alumno.**
* **El alumno corre la herramienta; el agente escribe los números.** La salida
  de `tokens.py` se guarda sola en `docs/SALIDA_TOKENS.txt`, y de ahí la lee el
  agente. En esta sesión no queda ningún `[PEGA AQUÍ]`: los corchetes sin
  rellenar fueron el fallo más repetido del laboratorio anterior.
* **Conversación nueva en cada corrida**, y `git revert` entre corridas. Son
  las dos reglas que hacen que la medición valga.
* **Un commit por fase.**

---

## Las tarifas, y de dónde sale la aritmética de la sesión

Tarifas de lista de la API de Claude, **consultadas el 2026-11-11**, por millón
de tokens:

| Modelo | Entrada | Salida | Leído de caché |
|---|---|---|---|
| Opus 5.5 | $4 | $20 | $0,20 |
| Sonnet 5.5 | $2 | $10 | $0,10 |
| Haiku 5.5 | $0,10 | $0,50 | $0,01 |

Escribir en caché cuesta **1,25×** la entrada con el reloj de 5 minutos y **2×**
con el de 1 hora. Los precios de Haiku 5.5 valen para prompts de hasta 100.000
tokens; por encima suben.

**Esto no es una medición, es aritmética con precios publicados**, y hay que
decirlo así en clase. Sobre un contexto de 100.000 tokens en Opus 5.5:

| Operación | Cuenta | Costo |
|---|---|---|
| Reenviarlo **sin** caché | 100.000 × $4 / 1M | **$0,40** por turno |
| Reenviarlo **desde** caché | 100.000 × $0,20 / 1M | **$0,02** por turno |
| **Escribirlo** en caché, reloj de 5 min | 100.000 × $5 / 1M | **$0,50**, una sola vez |
| Un prompt tuyo de 300 tokens | 300 × $4 / 1M | **$0,0012** |

De ahí sale la frase de la sesión, y conviene decirla entera:

> Recortar tu prompt a la mitad te ahorra **$0,0006**. Cambiar de modelo a
> mitad de sesión te cuesta **$0,40** de lectura sin caché más la reescritura,
> en el turno siguiente. Escribir menos ahorra diezmilésimas; no romper la
> caché ahorra centavos.

Y la vuelta de tuerca, que es la que evita la lectura simplona: **un prompt
vago sí sale caro, pero por los turnos de corrección que provoca, no por sus
tokens.** El costo se mide por tarea terminada.

---

# FASES

## Fase 3.1 — Tu factura, y tres hipótesis

**Prompt sugerido:** "Ejecuta la Fase 3.1 de `Ed5_sesion3.md`."

### Qué se construye

Nada todavía: se lee. El alumno abre su propia factura de la sesión 1, que ya
trae el costo, la duración y los dos números de la caché, mira cuánto de su
consumo entró por caché, y escribe **tres hipótesis, una línea cada una**: qué
palanca cree que manda, si el effort paga igual con los dos modelos, y cuánto
cree que hay entre su configuración más cara y la más barata. Las tres se
comprueban o se desmienten en la fase siguiente, y las dos cosas enseñan.

### Depende de

El Prompt 0, que deja los datos de la FACTURA ya citados en
`docs/VERIFICACION_S3.md`, y el Paso 2 de la ruta si te tocó, que los pone al
día en ese mismo archivo (hallazgo 11).

### Archivos

| Archivo | Rol |
|---|---|
| `docs/VERIFICACION_S3.md` | Lo escribió el Prompt 0, y lo puso al día el Paso 2 de la ruta si te tocó. De aquí salen los cuatro datos de la FACTURA, ya citados. **Hoy solo se lee.** |
| `docs/SALIDA_TOKENS.txt` | Lo escribe `tokens.py` solo, cada vez que se corre, agregando al final. De aquí lee el agente los números, en vez de que el alumno los pegue a mano. |
| `docs/00-ANTES.md` | La fuente de esos datos. **No se modifica**: es la fotografía de la sesión 1. |
| `docs/COSTOS.md` | Nace aquí con las tres hipótesis y nada más. La tabla la empieza la 3.2 y la cierra la 3.3. |

### Reglas

* **El número de partida es el del alumno**, no el de la tabla de precios ni el
  del docente. Sale de su sección FACTURA, no de una medición nueva: esos datos
  ya están verificados y **en esta fase no se vuelve a medir nada**.
* **La caché se enseña con los dos números de su FACTURA**: lo que costaron los
  tokens leídos de caché y lo que habrían costado como entrada nueva. Ese
  contraste es el argumento del bloque, y es suyo. Si su factura no los trae, se
  recuperan con el paso 2 de `PROMPTS_sesion2.md`.
* **En esta fase no se mira `/usage`.** Su bloque Session se reinicia con cada
  conversación, así que en el chat recién abierto de la 3.1 está en cero y no
  enseña nada. La pantalla en vivo se mira al **cerrar una corrida de la 3.2**,
  que es donde sí hay una conversación con trabajo dentro.
* **Las hipótesis se escriben antes de medir.** Tres, una línea cada una, y
  quedan fechadas. Si alguna se desmiente, no se borra: se anota que se
  desmintió. Y cada una tiene que ser **respondible con las corridas de hoy**:
  una pregunta que la cuadrícula no pueda contestar no es una hipótesis de
  esta sesión.
* **Quien no tenga la factura** —porque cerró la conversación de la sesión 1
  sin mirarla— usa la corrida A de la fase siguiente como su línea base y lo
  anota así. Eso también es la lección de la sesión 1, cobrada tarde.
* **Se dice en voz alta de dónde sale el dólar de la factura**: lo calcula la
  máquina del alumno contando tokens a tarifa de lista. Con un plan de Claude
  no se factura por token, se consume cuota.

### Cómo verificar al terminar

1. La sección FACTURA de `docs/00-ANTES.md` tiene el costo, la duración y los
   dos números de la caché, sin "sin medir".
2. `docs/COSTOS.md` existe y tiene las tres hipótesis escritas, una línea cada
   una, numeradas y con fecha.

---

## Fase 3.2 — Cinco corridas, una tarea

**Prompt sugerido:** "Ejecuta la Fase 3.2 de `Ed5_sesion3.md`."

### Qué se construye

La misma tarea patrón de las sesiones 1 y 2, corrida cinco veces: una repite la
configuración de la sesión 2, y las otras cuatro son las combinaciones de dos
modelos por dos niveles de effort.

| | Modelo | Effort | Qué es |
|---|---|---|---|
| **A** | el de la sesión 2 | el de la sesión 2 | la referencia: repite tu fila S2 |
| **B** | el más capaz | el más alto | el techo |
| **C** | el más capaz | el más bajo | |
| **D** | el más barato | el más alto | |
| **E** | el más barato | el más bajo | el piso |

De la B a la E son las cuatro combinaciones de dos palancas: la B contra la C y
la D contra la E dicen cuánto paga el effort, y la B contra la D y la C contra
la E dicen cuánto paga el modelo. Es lo que tres corridas no podían dar.

**La corrida A repite la configuración de la sesión 2, y se mide igual.** No
porque la fila S2 esté mal, sino porque se midió otro día: entre ese día y hoy
pueden haber cambiado la versión de Claude Code, el modelo que hay detrás del
mismo nombre y el propio código del alumno, y además el agente no es
determinista. Lo que separe la A de la fila S2 no es ninguna palanca: es el
ruido del agente entre dos días, y dice cuánta diferencia entre las otras
corridas es señal. La fila S2 no se toca: sirve para lo suyo, comparar con
contrato y sin contrato.

### Depende de

La Fase 3.1, y que el commit de la tarea patrón esté aislado y reversible.

### Archivos

| Archivo | Rol |
|---|---|
| Los que toca la tarea patrón | Se escriben y se revierten cinco veces. Cada corrida en su propio commit. |
| `docs/COSTOS.md` | Recibe los datos de las cinco corridas. |

### Reglas

* **Antes de cada corrida, `git revert` del commit de la corrida anterior**, y
  antes de la A, el de la tarea patrón de la sesión 2. Lo ejecuta el agente, con
  un prompt propio y en un chat aparte: en el chat de la corrida no cabe, porque
  le adelantaría la tarea que viene. Son diez conversaciones en la fase, cinco
  de revert y cinco de corrida. **Es el error que arruina la medición**: si una
  corrida arranca con la tarea ya hecha, sale baratísima y no mide nada.
* **El reloj se para al terminar el paso 5 de la verificación**, no cuando el
  agente deja de escribir. Las cinco corridas se cronometran igual.
* **Conversación nueva cada vez.** Los totales de `/usage` se reinician con
  `/clear`, así que cada corrida tiene su propio total limpio. Y es además lo
  que hace que un cambio en el `CLAUDE.md` se aplique: editado a mitad de
  sesión no entra hasta el siguiente `/clear`.
* **Enunciado idéntico, ni una palabra distinta**, y es el mismo que el alumno
  usó en la sesión 1. Está al pie de su tabla de mediciones.
* **Se mide con `tokens.py` antes de cerrar cada conversación**, y se anotan
  tokens y dólares. Es el mismo instrumento de las filas S1 y S2.
* **Se anotan los siete datos** de `TAREA_PATRON.md` §3 en cada corrida, con el
  costo en dólares. Las decisiones no pedidas también: un modelo más barato
  puede decidir más cosas por su cuenta, y eso no aparece en el dólar.
* **Cada conversación nueva paga su propia escritura de caché**, y es correcto
  que la pague: es lo que cuesta hacer esa tarea desde cero. Hay que decirlo en
  clase antes de que alguien lo descubra y crea que la medición está mal.
* **Cambiar el effort no rompe la caché** en los modelos de la generación 5.5 y
  en Fable 5.1 o posterior. En modelos más viejos sí, y Claude Code avisa
  antes de hacerlo.
* **Si el grupo va lento**, se sacrifican en este orden: primero la A, que se
  puede reemplazar por la fila S2 aceptando que se midió otro día; después la C
  o la D, que deja la cuadrícula coja pero conserva el techo y el piso. La B y
  la E no se tocan. Lo que no se corra queda para casa, anotado como pendiente.
* **No se cambia el comportamiento de la tarea** para que una corrida luzca
  mejor en la tabla.

### Cómo verificar al terminar

1. `git log --oneline` → cinco commits de la tarea y sus reverts entre medio,
   en orden.
2. Las corridas tienen anotado su costo en tokens y en dólares, medido
   con `tokens.py` antes de cerrar cada conversación.
3. `git status --short` → sin salida.
4. Cada corrida tiene los siete datos, o "sin medir" donde corresponda.

---

## Fase 3.3 — `docs/COSTOS.md` y la regla

**Prompt sugerido:** "Ejecuta la Fase 3.3 de `Ed5_sesion3.md`."

### Qué se construye

El archivo que la edición anterior nunca llegó a tener. Es corto a propósito, y
lo que importa es la última línea.

### Depende de

La Fase 3.2, con las corridas medidas.

### Archivos

| Archivo | Rol |
|---|---|
| `docs/COSTOS.md` | La tabla de las configuraciones corridas, los precios con su fecha, y la regla. |
| `docs/MEDICIONES.md` | Recibe la fila "S3 · configuración elegida". Las filas S1 y S2 no se tocan. |

### Reglas

* El archivo tiene tres cosas y nada más: **la tabla** con una fila por
  configuración; **el precio de lista que usó y la fecha en que lo consultó**;
  y **la regla**, que es una frase del alumno con la forma *"para tareas así
  uso esto, y para estas otras, aquello"*.
* **El producto es la regla, no la tabla.** Si el archivo termina sin esa
  frase, la fase no está hecha.
* **La fila S3 de `docs/MEDICIONES.md` es la configuración elegida**, y su
  costo ya está medido con `tokens.py` desde la fase 3.2, igual que las otras
  dos filas. Las tres comparaciones viven
  en `docs/COSTOS.md`, no en la tabla de mediciones.
* **Si las corridas salen casi iguales, esa también es una regla**, y hay
  que decirlo antes de que alguien lo viva como un fracaso: significa que para
  *esa* tarea la configuración cara no aporta nada. Es justo lo que se quería
  saber.
* **Si una corrida con modelo barato sale más cara que una con modelo caro, no
  es un fallo: es el resultado.**
  El modelo barato necesitó turnos de corrección, y eso es el costo por tarea
  terminada, vivo.
* **Se vuelven a leer las tres hipótesis de la 3.1** y se escribe si se cumplió o se
  desmintió. Las dos cosas se escriben igual.

### Cómo verificar al terminar

1. `docs/COSTOS.md` existe, tiene una fila por corrida con su costo en dólares, la
   fecha de consulta de los precios, y termina con la regla escrita por el
   alumno.
2. `docs/MEDICIONES.md` → la fila S3 está llena con los siete datos, y las
   filas S1 y S2 siguen como estaban.
3. En la bitácora está escrito si cada hipótesis de la 3.1 se cumplió o no, y
   con qué par de corridas se comprueba.

---

## Si algo falla

| Síntoma | Causa más probable | Qué hacer |
|---|---|---|
| `/usage` no muestra la línea `Prompt cache (main)` | versión anterior a 2.1.251 | `claude --version` y actualizar. Sin esa línea, la demo de la caché se hace con el uso por modelo del bloque Session |
| `Unknown command` al escribir `/usage` | versión muy anterior, o se escribió en la terminal y no en el chat | los comandos con `/` se escriben en el chat de Claude Code. Comprobar la versión |
| Dos corridas que deberían diferir salen casi iguales | el effort o el modelo no cambiaron de verdad antes de pegar el enunciado | comprobarlo antes de empezar, y después en la columna "configuración" de `tokens.py`, que dice con qué corrió cada bloque |
| Una corrida con modelo barato sale **más cara** que una con modelo caro | el modelo barato necesitó turnos de corrección | **no es un fallo, es el resultado.** Es el costo por tarea terminada, y va al archivo tal cual |
| La segunda o tercera corrida sale sospechosamente barata | no se revirtió la tarea entre corridas | `git log --oneline`, `git revert`, y repetir esa corrida |
| Todos los costos salen en cero o vacíos | la sesión corre con un proveedor o una pasarela que no reporta tokens de caché | anotar "sin medir" en esa columna y comparar por turnos y duración |
| El alumno con plan cree que le están cobrando | no se dio la explicación de dónde sale el dólar | es una estimación a tarifa de lista calculada en su máquina; con plan se consume cuota, no dinero |
| `tokens.py` dice que no encuentra las conversaciones | se corrió desde otra carpeta, o el proyecto tiene otra ruta | correrlo desde la raíz del proyecto. El propio script imprime dónde buscar |
| El agente dice que no encuentra `docs/SALIDA_TOKENS.txt` | la herramienta no se corrió, o se corrió desde otra carpeta | correrla desde la raíz del proyecto: el archivo se crea solo, y el script dice al terminar dónde lo dejó |
| El agente toma la fila equivocada del archivo | hay varias corridas guardadas, porque se agregan al final | la buena es la **última** del archivo, y dentro de ella el bloque del enunciado. El prompt le pide que diga cuál tomó antes de escribir |
| El consumo de la FACTURA, o el costo de la S1 o de la S2, no dice de qué bloque salió | se midió con la versión anterior del script, que inflaba el gasto y sumaba la conversación entera | **Paso 2 de la ruta (condicional)** de los prompts, y va antes de leer la spec: el `tokens.py` sin argumentos da los dos números de la caché y el bloque de la generación; `--patron` busca las corridas del enunciado |
| `--patron` no encuentra ninguna corrida | el enunciado no es uno de los tres de `TAREA_PATRON.md` §1, o esas conversaciones se borraron del disco | primero pasarle el enunciado entre comillas. Si tampoco aparece, el paso 3 del mismo apartado: revertir el laboratorio 2 completo en orden inverso y repetirlo. Abrir un chat nuevo **no** borra el anterior, así que esto solo pasa si se borraron a propósito |
| Después de revertir, el `CLAUDE.md` sigue en la raíz | nunca se commiteó, y `revert` no toca lo que no está en el historial | renombrarlo antes de correr la S1, y devolverlo a su sitio después. Si no, esa corrida no es "sin reglas" |
| El alumno no tiene la fila S2 | la medición de la sesión 2 quedó pendiente y no se hizo en casa | hace la sesión igual: su comparación es S1 contra S3, y lo anota en la bitácora |
| El alumno quiere comparar su cifra con la del docente o la del compañero | cada app es distinta | la comparación es **consigo misma**, tres veces. Nunca contra el ejemplar ni contra el compañero |

## Restricciones de la sesión

* **No se escriben Skills ni se conecta MCP**: sesión 4.
* **No se crean subagentes**: sesión 5. Se nombran, porque gastan.
* **No se tocan permisos ni hooks**: sesión 6.
* **No se corrigen los defectos del inventario.** Siguen siendo material de las
  sesiones 5, 6 y 7.
* **No se reescribe el `CLAUDE.md`** de la sesión 2. Si una corrida muestra que
  una regla estorba, se anota en la bitácora y se decide en la sesión que
  corresponda.
* **Ninguna cifra de ahorro que nadie midió.**

## Entregables

1. `docs/VERIFICACION_S3.md`, escrito por el Prompt 0 y puesto al día por el
   Paso 2 de la ruta si te tocó: el terreno comprobado, la FACTURA citada, el
   enunciado de la tarea patrón citado y el commit que hay que revertir.
2. `docs/COSTOS.md` con las configuraciones corridas, su costo en dólares, la fecha
   de consulta de los precios y la regla escrita por el alumno.
3. La tercera fila de `docs/MEDICIONES.md`, completa.
4. La entrada de la sesión 3 en `docs/BITACORA.md`, con las hipótesis y si se
   cumplieron.
5. Un commit por fase, y todo subido al repositorio.

## Producto de la sesión

El alumno se lleva su propia regla de elección de modelo y effort, con los
dólares que la respaldan, y la tabla de tres filas del curso completa.

## Criterios de aceptación

* `docs/COSTOS.md` existe y tiene las configuraciones corridas con su costo en
  dólares.
* El archivo dice qué precios usó y en qué fecha los consultó.
* El archivo termina con una frase del alumno que dice para qué tarea usa cada
  configuración.
* Las corridas de hoy usaron el mismo enunciado, palabra por palabra, y
  es **el mismo de la línea base del alumno**, el que está escrito al pie de su
  tabla. No se asume que sea el de la sesión 1: en la sesión 2 pudo haber
  cambiado de enunciado si su commit no se podía revertir.
* Entre corrida y corrida hubo un revert, y el historial lo muestra.
* La fila S3 de `docs/MEDICIONES.md` está completa, medida con `tokens.py`, y
  ningún dato está estimado.
* Las tres filas tienen su costo **medido por bloque** y con el mismo script, y
  al pie de la tabla queda dicho de qué bloque salió cada una. Tres filas
  medidas con dos versiones del instrumento no se comparan.
* El consumo de la FACTURA que sostiene las hipótesis de la 3.1 está medido con
  ese mismo script, y dice de qué bloque salió.
* Las tres hipótesis de la 3.1 están escritas, y está escrito si cada una se
  cumplió o se desmintió, con el par de corridas que lo demuestra.

## Registro de cambios

**2026-11-11 — versión 1.** Primera versión de la spec. El contenido técnico
viene de la preparación de la presentación, verificada contra la documentación
oficial el 2026-11-11, y las tarifas se consultaron ese mismo día. Tres
decisiones de fondo quedaron resueltas y están en los hallazgos 1, 2 y 3: el
laboratorio se corre aparte de la clase de teoría; el instrumento de medición de
la tabla es `tokens.py` y no `/usage`, para que las tres filas se comparen; y
se anotan siete datos por corrida, no seis.

**2026-11-11 — versión 1.1.** Ajustes que vienen de los cambios de la sesión 2
y de la decisión del docente sobre el reloj. **El laboratorio de esta sesión se corre
aparte de su clase de teoría**: esa clase lleva la teoría de la 3 más el
laboratorio pendiente de la 2 (hallazgo 1 reescrito). La tarea humana 2 deja de mandar la
medición de la sesión 2 a casa, porque se corre en clase. Los criterios de
aceptación ya **no dicen "el mismo enunciado que la sesión 1"**, sino **el de la
línea base del alumno**, porque en la sesión 2 pudo haber cambiado de enunciado
si su commit no se podía revertir. La verificación de las corridas contempla
los **tres** enunciados, no dos. Y la tarea humana 1 gana los comandos para
actualizar Claude Code, con el aviso de comprobar la versión en el entorno
donde se va a trabajar.

**Lo que no hizo falta cambiar:** esta sesión toma el enunciado **del pie de la
tabla del alumno**, no de `TAREA_PATRON.md` §1, así que el tercer enunciado que
nació en la sesión 2 se propaga solo.

**2026-11-13 — versión 1.2.** El instrumento de medición se arregló y la sesión
se ajusta a eso (hallazgo 10). `tokens.py` contaba cada respuesta tantas veces
como pedazos tiene en el disco, así que inflaba el gasto entre 1,9 y 4,2 veces,
y además daba el total de la conversación en vez del de la tarea. Ahora cuenta
cada respuesta una vez y da el gasto **por bloque**, y sabe buscar las corridas
de la tarea patrón por el texto del enunciado, con `--patron`. Los prompts
ganan un **Paso 2 de la ruta (condicional)** que vuelve a medir, antes de comparar
nada, los tres costos que vienen de sesiones anteriores: el consumo de la
FACTURA y las filas S1 y S2. Va **justo después del Prompt 0 y antes de leer la
spec**, porque las hipótesis de la Fase 3.1 se escriben sobre la FACTURA: corregir
el instrumento después de haber medido con él no sirve de nada. Trae además su
camino de repuesto para el caso de que esas conversaciones ya no estén en el
disco: revertir el laboratorio 2 completo en orden inverso —que se lleva el
`CLAUDE.md` con él, y por eso la S1 vuelve a medirse sin reglas— y repetirlo.
El Prompt 0 gana la comprobación de si esos tres datos dicen de qué bloque
salieron, y la Fase 3.2 anota el bloque, no la conversación. La verificación de la 3.2 en el mapa de fases decía "tres totales
de `/usage`", que contradecía el hallazgo 2: ahora dice `tokens.py`.

**Se quita el `/usage` de la Fase 3.1.** Esa fase corre en un chat recién
abierto, y el bloque Session se reinicia con cada conversación: ahí no hay
nada que mirar. La pantalla en vivo se queda donde sí enseña, al cerrar una
corrida de la 3.2. La nota de dónde sale el dólar no se pierde: pasa a la
factura, que es a lo que de verdad se refiere en esa fase.

La salida de `tokens.py` **se guarda sola** en `docs/SALIDA_TOKENS.txt`, dentro
del proyecto medido y agregando al final, y el Paso 2 de la ruta termina con un
prompt que lee de ahí y escribe las celdas: el alumno ya no corrige la FACTURA
ni la tabla a mano. Con eso, y con lo anterior, **en esta sesión no queda
ningún `[PEGA AQUÍ]`**.

Y el **Prompt 0 deja su salida escrita** en `docs/VERIFICACION_S3.md`, en vez
de que el alumno copie a mano nueve comprobaciones de un chat que después
cierra. De ese archivo leen los prompts siguientes: la Fase 3.1 saca de ahí
los cuatro datos de la FACTURA —ya no se pegan a mano—, la Fase 3.2 el commit
que hay que revertir y el enunciado citado, y el Paso 2 de la ruta su propio
veredicto de si le toca correr. Es el único archivo que el Prompt 0 escribe,
y entra en el commit de la Fase 3.1.

En la **Fase 3.2**, el revert deja de ser un "revierte la corrida anterior" sin
comandos y pasa a ser un prompt propio, que ejecuta el agente **en un chat
aparte**: en el de la corrida no cabe, porque le adelantaría la tarea. Son diez
conversaciones en la fase, cinco de revert y cinco de corrida. Y queda dicho
cuándo se para el reloj —al terminar el paso 5 de la verificación, no cuando el
agente deja de escribir—, que antes solo estaba en `TAREA_PATRON.md` §3.

La **Fase 3.2 pasa de tres corridas a cinco**, por decisión del docente. La
primera repite la configuración de la sesión 2 —que no hay que recordar: la
trae la columna "configuración" de `tokens.py`, nueva en esta versión— y las
otras cuatro son las combinaciones de dos modelos por dos niveles de effort.
Con eso cada palanca se mide dos veces, una con cada ajuste de la otra, y
aparece algo que tres corridas no podían dar: si el effort paga distinto según
el modelo. La primera corrida, además, da el ruido: lo que separa esa corrida
de la fila S2 no es ninguna palanca, es la variación del agente entre dos
días. El costo es tiempo —diez chats en la fase—, así que queda escrito en qué
orden se sacrifican corridas si el reloj aprieta.

Y `tokens.py` **reporta ahora el modelo y el effort de cada bloque**, leídos
del archivo de la conversación. La configuración deja de ser algo que el
alumno anota a mano y pasa a ser un dato medido, como el costo.

La Fase 3.1 pasa de **una hipótesis a tres**, porque con cinco corridas hay
tres preguntas que se pueden contestar y antes solo había una: qué palanca
manda, si el effort paga igual con los dos modelos, y cuánto hay entre el
techo y el piso. La 3.3 las revisa una por una y dice con qué par de corridas
se comprueba cada una. Y el paso 2 de cada corrida ya no pregunta con qué
modelo y effort se corrió: lo lee de la columna "configuración" del archivo
de salida, y si no coincide con la que esa corrida debía tener, se detiene.

**2026-11-16 — versión 1.3.** La Fase 3.2 queda escrita en cinco corridas en
todo el material. Se terminó de migrar el cuerpo de la spec (tabla A–E, cuenta
de reverts y de commits, "siete datos"), los dos leftover de los prompts, la
frase de `TAREA_PATRON.md`, el guion y la presentación `Ed5_sesion3.pptx`: la
lámina 29 pasa a las cinco configuraciones A–E, la 28 a las tres hipótesis, la
lista de datos a siete, y la lámina 6 ya no da por hecho que el alumno tenga la
fila S2. La presentación quedó alineada con esta spec.

**2026-11-18 — versión 1.4.** El Paso 2 de la ruta pone al día
`docs/VERIFICACION_S3.md` (hallazgo 11). Antes corregía la FACTURA solo en
`docs/00-ANTES.md`, y la Fase 3.1, que la lee de `docs/VERIFICACION_S3.md`,
recibía el dato de antes de la medición: "sin dato", o el número inflado de la
sesión 2. Cambian el prompt del Paso 2 (un punto 4 en el objetivo, una
restricción y una línea en el formato), su recuadro de entrada, su "Antes de
seguir" y la tabla de la ruta. En esta spec cambian el "Depende de" y la tabla
de archivos de la Fase 3.1, y el entregable 1. La Fase 3.1 no cambia. La
versión anterior quedó en `../_backup_sesion3_pre_paso2_20261118/`.

**Pendiente antes de dar la clase.** Volver a mirar la tabla de precios de
§"Las tarifas", consultada el 11 de noviembre: los modelos y sus tarifas no los
verifica este material.
