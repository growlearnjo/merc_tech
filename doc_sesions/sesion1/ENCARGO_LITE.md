# El encargo: MercadoTech Lite

Este documento contiene el **pedido exacto** con el que el alumno genera su app
en la sesión 1, el alcance cerrado de esa app, y los **cuatro defectos** que el
encargo debe producir.

> **Lee esto antes de dárselo a nadie.** El encargo está escrito a propósito
> como lo escribiría un desarrollador con prisa un lunes a las nueve: en prosa,
> sin convenciones, sin capas y sin pedir pruebas. **Está prohibido
> "mejorarlo".** Si se le añaden reglas, la app sale decente y las siete
> sesiones siguientes se quedan sin nada que gobernar.

---

## 1. El encargo (texto literal)

El alumno abre Claude Code en una **carpeta vacía** y pega esto, tal cual, en
un solo turno:

```text
Necesito una tienda web para vender productos de tecnología. Que se vea
moderna y funcione bien en el celular.

Tiene que haber un catálogo con los productos, poder entrar a ver el detalle
de uno, agregarlo a un carrito y terminar la compra — la compra no cobra nada,
solo registra el pedido y descuenta el stock. También necesito registro e
inicio de sesión, y una página simple donde yo pueda cargar productos nuevos.

Usa Next.js con TypeScript, y guarda todo en una base SQLite dentro del mismo
proyecto: nada de servicios en la nube ni de cosas que haya que instalar
aparte. Los precios en soles. Mete unos 12 productos de ejemplo para que no se
vea vacío.

No te compliques con los permisos por ahora, es para mostrársela a un cliente
el viernes. Hazlo todo de una, que quede funcionando.
```

### Por qué cada frase está ahí

| Frase | Qué provoca |
|---|---|
| "Hazlo todo de una, que quede funcionando" | Un monolito: el agente optimiza para que arranque, no para que se mantenga. |
| "No te compliques con los permisos por ahora" | **Defecto 4.** Es la frase que deja la aplicación abierta, y es la que de verdad dice todo el mundo. |
| "una página simple donde yo pueda cargar productos" | Una escritura privilegiada sin comprobar quién llama: por ahí entra el defecto 4. |
| "guarda todo en una base SQLite dentro del mismo proyecto" | **Es la única restricción del encargo, y es de alcance, no de calidad**: evita que el alumno tenga que instalar Docker o crear cuentas en la nube el primer día. No le dice al agente cómo organizar el código, así que los cuatro defectos siguen apareciendo igual. |
| "para mostrársela a un cliente el viernes" | Nadie escribe pruebas para un viernes. **Defecto 3.** |
| No menciona capas, convenciones ni constantes | **Defectos 1 y 2**, por omisión: el agente decide, y decide rápido. |
| No menciona filtrar por categoría | La **tarea patrón** tiene que quedar fuera del encargo, o ya estaría hecha. |

---

## 2. Alcance cerrado de MercadoTech Lite

Lo que el encargo produce, y nada más:

| Sí entra | No entra |
|---|---|
| Catálogo: lista y detalle | Preguntas, reseñas, favoritos |
| Carrito y checkout simulado (registra el pedido, descuenta stock) | Pago real de cualquier tipo |
| Registro e inicio de sesión | Recuperación de contraseña, verificación de correo |
| Una página para cargar productos | Panel de vendedor, kanban de pedidos |
| SQLite dentro del proyecto: 4 tablas y su seed | Bases de datos en la nube, RAG, embeddings, voz, MCP |
| ~12 productos de ejemplo | Imágenes propias (basta una URL o un placeholder) |

**Las 4 tablas**, para que la tarea patrón sea posible y el alcance no crezca:

```
products     id · title · description · price · stock · category · image_url
users        id · email · password  (como el agente decida guardarla — ojo con eso)
cart_items   id · user_id · product_id · quantity
orders       id · user_id · total · created_at  (+ los ítems, como el agente decida)
```

`category` es una **columna de texto**, no una tabla: mantiene el alcance chico
y hace posible la tarea patrón de la sesión 2.

> **Por qué SQLite y no una base en la nube.** Para que el primer día no haya
> nada que instalar ni ninguna cuenta que crear: el archivo de la base vive en
> el propio proyecto y se borra con él. Nada del curso depende de esta
> elección — las sesiones 2 a 8 gobiernan al agente, no al stack.

> **Deja que el agente decida el resto.** Si inventa una cuarta tabla para los
> ítems del pedido, bien; si mete los ítems como JSON en `orders`, también.
> Esa decisión suya es material de la sesión 5, cuando el subagente revisor la
> encuentre.

---

## 3. Los cuatro defectos que debe producir

No son opcionales: **cada uno es el temario de una sesión posterior.** Si el
encargo no los produce, el curso se queda sin caso de estudio.

| # | Defecto | Se arregla en | Cómo se comprueba |
|---|---|---|---|
| 1 | **Los componentes consultan la base de datos directamente.** Fetching, render y lógica de negocio en el mismo archivo. | S2 (la regla entra al `CLAUDE.md`) y S5 (el subagente lo encuentra) | `grep -rl "createClient\|from(" app components --include="*.tsx"` → devuelve archivos |
| 2 | **Los valores ajustables están incrustados en el código.** Productos por página, IVA, moneda, límites: números sueltos repartidos. | S2 y S5 | No existe `lib/constants/`; `grep -rnE "\.limit\(|\.range\(|0\.18|S/ " app components` → aparece en varios sitios |
| 3 | **Cero pruebas.** Ni un archivo de test, ni el script en `package.json`. | S6 (las pruebas como señal que el hook exige) | `ls **/*.test.*` → nada; `npm test` → no existe el script |
| 4 | **La seguridad queda abierta.** Se manifiesta de una de estas tres formas, y basta una: la página de administración **no comprueba quién la usa**; las contraseñas se guardan **sin cifrar**; o la sesión se decide **en el navegador** (un valor que cualquiera edita). | S6 (permisos) y S7 (secretos e inyección) | Abrir la ruta de la API que crea productos y ver si comprueba la sesión · `grep -rniE "bcrypt\|argon\|scrypt\|hash" package.json app lib` → si no hay nada, las contraseñas están en claro · `grep -rn "localStorage\|sessionStorage" app components` buscando la sesión |

### Lo que se anota, no se arregla

En la sesión 1 el alumno **escribe la lista y no toca nada**. Arreglar aquí
destruye la medición: el "antes" tiene que quedar fotografiado. La spec de la
sesión 1 lo dice con esas palabras.

---

## 4. Condiciones para que el encargo sea repetible

Dos cosas pueden hacer que la app salga "demasiado bien" y la sesión 1 se
quede sin defectos. El Prompt 0 de la sesión 1 las verifica:

1. **Memoria global del alumno.** Un `~/.claude/CLAUDE.md` con sus
   convenciones, o Skills personales, cambian el resultado. Para esta sesión se
   trabaja sin ellos (y eso enseña, de paso, qué hace la memoria global).
2. **La carpeta tiene que estar vacía.** Sin repo previo, sin `package.json`,
   sin `.claude/`. Si hay un proyecto antes, el agente lo imita.

Y una condición de entorno que ya no existe, y conviene decirlo en clase:
**no hay nada que instalar** más allá de Node, Git y Claude Code. Ni Docker, ni una
base de datos aparte, ni cuentas de ningún servicio. Es deliberado: el primer
día, cada instalación es media hora de clase que se pierde y un alumno que
confunde un problema de entorno con un problema del agente.

---

## 5. Verificación de este documento (Fase P.2)

Antes de dar el encargo por bueno hay que **ejecutarlo dos veces**, en dos
conversaciones limpias y dos carpetas vacías, y comprobar que las dos apps:

1. Arrancan (`npm run dev` sirve el catálogo con sus ~12 productos).
2. Presentan **los cuatro defectos**, comprobados con los greps de la tabla
   §3 — no a ojo.
3. No implementan filtro por categoría (si lo implementan, el encargo lo está
   sugiriendo sin querer y hay que recortarlo).

Los dos resultados se anotan en
`BITACORA_PRODUCCION.md` (documento del docente, no se reparte), con el costo real de cada
corrida: ese número es el que la sesión 1 usa como referencia, y **no se
escribe antes de haberlo medido**.

> Si una de las dos corridas sale sin un defecto, el encargo no es repetible
> todavía: se ajusta la frase que debía provocarlo (tabla §1) y se vuelve a
> correr. No se "ayuda" al agente a fallar.
