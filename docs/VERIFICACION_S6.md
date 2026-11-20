# Verificación de arranque — Sesión 6

Fecha: 2026-11-20

## Versiones

- claude: 2.1.327 (mínimo 2.1.283)
- node: v24.11.1 (mínimo 20)
- npm: 11.6.2
- git: 2.51.0.windows.1

## Commit de arranque

`1eeb765 docs: add the Sesión 6 material from curso-ed5` (árbol limpio)

## MODO Y RIESGO DE LA SESIÓN 1

> **Modo elegido: `auto`.**
>
> **Riesgo que acepto:** el clasificador puede aprobar solo un `npm install` de una
> dependencia que yo no pedí, y sus scripts de instalación se ejecutan en mi máquina
> sin que yo haya visto el comando.

## LAS REGLAS QUE HOY SOLO PIDEN

```
8:- Pruebas: todavía no hay, ni archivos ni script `test`. No digas que las pruebas pasaron;
13:- `src/app/actions.ts` no ejecuta SQL: el acceso a `users` pasa por `src/lib/auth.ts`.
14:  Hoy no se cumple (`actions.ts:33-34`, `:38`, `:48-49`).
16:- No agregues funciones, páginas, dependencias ni cambios de versión que la tarea no pida.
17:  Si crees que hacen falta, pregunta antes.
21:- Viven en un solo archivo, `src/lib/constants.ts`, que todavía no existe. Hoy están incrustados
24:- Un valor nuevo no se escribe en línea, y no se inventan textos comerciales
29:- Filtros, búsqueda y paginación del catálogo viven en la URL (`searchParams`), no en `useState`.
30:  La paginación hoy no existe (se revirtió en la Fase 2.2). Verificación: `grep -n "useState\|use client" src/app/page.tsx` debe devolver vacío.
33:- `/admin` y `createProductAction` exigen un usuario administrador. Hoy no se cumple:
34:  `admin/page.tsx:10` está abierta, `actions.ts:107-123` no llama a `getCurrentUser()`,
35:  y `users` no tiene columna de rol. No digas que el panel está protegido.
```

## Regla de pruebas (CLAUDE.md:8-10)

> - Pruebas: todavía no hay, ni archivos ni script `test`. No digas que las pruebas pasaron;
>   lo único que se puede afirmar es que `typecheck` y `build` terminaron sin error.
>   Verificación: `grep -c '"test"' package.json` devuelve 0 mientras esto siga siendo cierto.

## Tech Lead

- name: `tech-lead`
- tools: `Read, Grep, Glob`

## Modo de aprobación de hoy

`auto` (el mismo de la sesión 1)

## Veredicto

Listo para la Fase 6.1: todo el estado de partida se cumple y hoy nada frena al agente salvo que obedezca.
