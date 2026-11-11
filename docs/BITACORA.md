# Bitácora

Una entrada por sesión. Horas en hora local (UTC−5). Cada número sale de un
comando o de un archivo; donde no hay medición dice "sin medir".

---

## Sesión 1 — 2026-11-11 — La línea base

### Qué se construyó

- **La app.** Tienda de tecnología en Next.js 16 + TypeScript + Tailwind 4,
  con SQLite en `data/tienda.db` vía `node:sqlite` (sin dependencia de base).
  Rutas: catálogo `/`, detalle `/producto/[id]`, carrito `/carrito`,
  `/registro`, `/login`, `/pedido/[id]`, `/pedidos`, `/admin`. Se siembran
  12 productos al arrancar. El checkout descuenta stock en una transacción y no
  cobra. Detalle en `README.md`.
- **`docs/00-ANTES.md`.** Entorno (Node 24.11.1, npm 11.6.2, Git 2.51, Claude
  Code 2.1.206, plan Max), modo de aprobación elegido (`auto`) con su riesgo,
  la factura de la generación y el inventario de daños con comando y salida
  por defecto.
- **`docs/MEDICIONES.md`.** Fila S1 de la tarea patrón: **no comparable**
  (ver "Qué salió mal", punto 1).
- **`.gitignore`** y esta bitácora (cierre).

### Qué decidió el agente sin que se lo pidiera

En la generación (Fase 1.2), el encargo no decía nada de esto:

| Decisión | Dónde | Consecuencia |
|---|---|---|
| Capa de datos en `src/lib/` (`db.ts`, `products.ts`, `orders.ts`, `auth.ts`); ningún `.tsx` ejecuta SQL | `src/lib/` | El defecto 1 aparece solo en forma parcial: `src/app/actions.ts` todavía tiene SQL de usuarios en línea |
| Contraseñas con `scrypt` + sal | `src/lib/auth.ts:14` | Las formas b del defecto 4 no aparecieron |
| Sesión por cookie `httpOnly` con token hasheado en una tabla `sessions` (30 días) | `src/lib/auth.ts` | La forma c del defecto 4 no apareció |
| **Filtro por categoría y búsqueda** en el catálogo, con el estado en la URL (`?cat=`, `?q=`) | `src/app/page.tsx`, `src/lib/products.ts` | **Dejó hecha la tarea patrón** antes de medirla |
| Carrito en `localStorage`, sin tabla `cart_items` | `src/components/CartProvider.tsx` | El esquema no es el de `ENCARGO_LITE.md` §2; el carrito no sigue al usuario entre dispositivos |
| Esquema propio: `users`, `sessions`, `products` (`name`, `price_cents`), `orders`, `order_items` | `src/lib/db.ts` | Columnas distintas de las del encargo (`title`, `price`) |
| Marca "VoltTech" en vez de "MercadoTech Lite" | `README.md`, UI | Cosmético; el nombre del curso no aparece en la app |
| Textos de ejemplo: "Envío gratis en Lima desde S/ 199", "12 meses de garantía" | `src/app/page.tsx:32`, `src/app/producto/[id]/page.tsx:61` | Forman parte del defecto 2 |
| Scripts `typecheck` y `db:reset`; `data/` fuera de git | `package.json`, `.gitignore` | La base no se sube; se recrea al arrancar |
| `typescript@5` en lugar de la 7 que trajo `npm install` | `package.json` | Instalación no pedida, aprobada por el clasificador del modo `auto` |
| Pruebas E2E con Chrome headless y servidor en el puerto 3100 | fuera del proyecto (carpeta temporal) | No queda ninguna prueba en el repo: el defecto 3 sigue intacto |

En el cierre (esta conversación), el agente además:

- Reescribió el `.gitignore` que había dejado la generación (ver "Cierre").
- Corrió `curso-ed5/tokens.py` para tener tokens medidos en vez de "sin dato".

### Qué costó

Plan Max: **US$ 0 cobrados.** La columna ~USD es el valor a tarifa pública
(`curso-ed5/tokens.py`, tarifas consultadas el 2026-11-09), útil solo para
comparar.

Salida de `python -I curso-ed5/tokens.py` (2026-11-11, 16:06), con la fase
asignada por el primer mensaje de cada conversación:

| Fase | Conversación | Inicio | Turnos | Entrada | Caché esc. | Caché lec. | Salida | Duración | ~USD |
|---|---|---|---|---|---|---|---|---|---|
| Prompt 0 · terreno | `b7543045` | 14:29 | 23 | 50 | 128,699 | 1,499,782 | 10,688 | 2 min | 1.16 |
| Prompt 1 · lectura de la spec | `d995c786` | 14:40 | 6 | 12 | 164,050 | 263,860 | 9,142 | 1 min | 1.06 |
| 1.1 · entorno y modo | `cd03a2c0` | 14:52 | 16 | 36 | 126,298 | 1,029,882 | 11,318 | 3 min | 1.06 |
| 1.2 · generar la app | `b1471b87` | 15:02 | 135 | 274 | 425,383 | 14,743,930 | 395,796 | 30 min | 12.99 |
| 1.3 · factura y daños | `d43a8b5b` | 15:43 | 38 | 80 | 169,045 | 3,105,608 | 28,893 | 5 min | 2.04 |
| 1.4 · tarea patrón | `3af62490` | 15:57 | 21 | 46 | 110,723 | 1,586,033 | 11,088 | 4 min | 1.09 |
| Cierre (parcial, al correr el script) | `b71d60b8` | 16:05 | 16 | 32 | 151,375 | 1,130,225 | 7,521 | 1 min | 1.13 |
| **Total** | | | **255** | **530** | **1,275,573** | **23,359,320** | **474,446** | | **20.54** |

- La generación se llevó el **63 %** del valor (12.99 de 20.54) y el **83 %**
  de la salida (395,796 de 474,446 tokens).
- Sin caché, los 23.4 M tokens leídos habrían valido US$ 93.44; costaron
  US$ 4.67.
- La fila del cierre no es final: el script se corrió a mitad de esta
  conversación.
- Aprobaciones pedidas en modo `auto`: **sin medir** (el agente no ve qué
  ventanas mostró el clasificador).
- Corrige dos "sin dato" anteriores: la factura de `00-ANTES.md` §4 no tenía
  tokens (ahora: fila 1.2), y `MEDICIONES.md` S1 tenía costo y duración "sin
  medir" (ahora: fila 1.4, 4 min, ~US$ 1.09). No se editaron esos archivos.

### Qué salió mal

1. **La tarea patrón ya estaba hecha.** La generación agregó el filtro por
   categoría sin que el encargo lo pidiera. La corrida S1 de la Fase 1.4 no
   construyó nada y su fila **no sirve como "antes"** para la sesión 2.
2. **El esquema no es el del encargo.** Falta `cart_items`; hay `sessions` y
   `order_items`; las columnas se llaman distinto.
3. **No hubo un commit por fase.** El proyecto no era un repositorio git hasta
   el cierre. La spec pide "un commit por fase"; queda un solo commit con todo,
   y no se puede reconstruir qué cambió en cada fase.
4. **Los greps de `ENCARGO_LITE.md` §3 no corren tal cual**: buscan `app/` y
   `components/` en la raíz y llamadas de Supabase. Fallan por la ruta
   (`No such file or directory`), no por el código. Hubo que adaptarlos.
5. **Placeholders sin rellenar.** El Prompt 1 y el de cierre se pegaron con
   `<RUTA_PROYECTO>` y `<TU_REPO>` literales. En el cierre eso bloqueó el push:
   el agente no tenía la URL del remoto.
6. `npm install typescript` trajo la versión 7 y hubo que bajar a la 5.

### Los cuatro defectos (sin corregir)

| # | Defecto | Estado | Se cierra en |
|---|---|---|---|
| 1 | Componentes que consultan la BD | Parcial: SQL en línea en `src/app/actions.ts` (líneas 33–49) | S2 / S5 |
| 2 | Valores incrustados | Apareció: `120` y `99` duplicados en dos archivos cada uno, sin `constants` | S2 / S5 |
| 3 | Cero pruebas | Apareció: ni archivos de prueba ni script `test` | S6 |
| 4 | Seguridad abierta | Apareció: `/admin` y `createProductAction` sin control de quién llama | S6 / S7 |

### Cierre

- `.gitignore`: se mantuvieron `node_modules/`, `.next/`, `out/`,
  `next-env.d.ts`, `*.tsbuildinfo`, `data/` y `.env*`; se agregaron una línea
  explícita `.env*.local`, logs de npm, `coverage/`, `.vercel/` y archivos del
  sistema. Comprobado con `git check-ignore -v`.
- Búsqueda de claves en los archivos a subir: ninguna (detalle en el mensaje
  del cierre).

### Pendiente para la sesión 2

- [ ] **Avisar al docente** del punto 1 de "Qué salió mal" y decidir cómo se
      mide la S1: la spec propone sacar el filtro de `src/app/page.tsx` y
      repetir la Fase 1.4 en conversación nueva con el reloj corriendo.
- [ ] Escribir el `CLAUDE.md` (centro de la sesión 2; hoy no se escribió).
- [ ] Correr la tarea patrón S2 con `CLAUDE.md` y llenar su fila en
      `docs/MEDICIONES.md`. Medir con `curso-ed5/tokens.py`, no a mano.
- [ ] Decidir si `cart_items` entra en el alcance o se acepta el carrito en el
      navegador (material del revisor de la sesión 5).
- [ ] Si el push del cierre quedó pendiente: hacerlo antes de empezar y
      confirmar con `git log --oneline -1` que local y remoto coinciden.
