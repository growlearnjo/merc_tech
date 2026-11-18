| si necesitas | usas | mi caso |
|---|---|---|
| Una regla que vale siempre | `CLAUDE.md` | «`src/app/actions.ts` no ejecuta SQL: el acceso a `users` pasa por `src/lib/auth.ts`.» |
| Un procedimiento que vale a veces | Skill | `carrito-localstorage`: decide qué puede ir a `localStorage` (solo el carrito) |
| Datos o acciones de un sistema externo | MCP | `conversaciones`: lee mis conversaciones de este proyecto, en solo lectura |
| Trabajo largo que no debe ensuciar mi contexto | subagente | sesión 5 |
| Algo que se cumpla aunque el modelo no obedezca | hook | sesión 6 |

Me pregunto cuándo lo necesito y quién lo hace cumplir, porque cada pieza la pago distinto: el contrato en cada conversación, la Skill cuando la uso, el MCP cuando consulto afuera, el subagente en otro contexto y el hook aunque el modelo no quiera.
