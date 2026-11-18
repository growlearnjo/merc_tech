# Verificación de partida — Sesión 5

Fecha: 2026-11-18

## Versiones

- claude: 2.1.327 (mínimo 2.1.283)
- node: v24.11.1
- npm: 11.6.2
- git: 2.51.0.windows.1

## Commit de arranque

`120dd50` — chore: point the conversations server to this project's folder (repositorio limpio).

## EL COMMIT DE LA TAREA PATRÓN

- Identificador: `1389e03` (`1389e035d79646479d84ff5fec8762452b99fb3d`)
- Mensaje: feat: rerun the pattern task with the contract for Fase 2.3
- Archivos: `src/app/page.tsx`, `src/lib/constants.ts`, `docs/MEDICIONES.md`
- También tocó `docs/` porque la Fase 2.3 pedía registrar la corrida en la tabla en la
  misma conversación. Lo que se revisa es el código: `git show 1389e03 -- . ':(exclude)docs'`.
  No tocó `CLAUDE.md`. Se revirtió después con `ff12c58`, antes de la Fase 3.2.

## EL ENUNCIADO

"Muestra solo 6 productos por página, con enlaces para pasar de página, y que si recargo siga en la página en la que estaba."

## Defectos del inventario que aparecieron

- Valores ajustables incrustados
- Cero pruebas
- Seguridad abierta

## Mi Skill de la sesión 4 y la propuesta

`carrito-localstorage`: decide qué puede ir a `localStorage` (solo el carrito). No tiene
`disable-model-invocation: true`. Propuesta: no cargarla en el Tech Lead. Le serviría
poco al revisor: está escrita para quien hace el cambio, no para quien lo revisa, cubre
una sola regla y cita rutas y líneas del inventario, que ningún revisor debe ver.

## Mi regla de costos

"Para tareas chicas y bien definidas como esta, uso Haiku con effort low, porque costó US$ 0.01 contra US$ 1.26 de Opus con effort max y las dos pasaron a la primera, sin turnos de corrección. Para lo que toque la base de datos, el dinero o la seguridad vuelvo a Opus: eso no lo medí, pero un error ahí me cuesta más que esa diferencia."

## Mi modo de aprobación

auto (el subagente corre en este mismo modo).

## Veredicto

Listo para la 5.1, con un aviso: `CLAUDE.md` dice que `src/lib/constants.ts` y la paginación no existen, pero sí están en `main` desde la corrida E (`9108dd6`).
