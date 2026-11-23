# Contrato del proyecto

## Qué es esto
Tienda de práctica del curso; cada regla de abajo sale del inventario de `docs/00-ANTES.md` §5.

## Comandos
`npm run dev` · `npm run build` · `npm run typecheck` · `npm run start` · `npm run db:reset` (borra `data/`).
- Pruebas: `npm test` (Vitest, funciones puras, archivos `*.test.ts` junto a su módulo) tiene que
  pasar antes de dar algo por terminado. El hook `Stop` (`.claude/hooks/exigir-pruebas.js`) lo exige.
  Verificación: `npm test` termina con `passed` y sin `failed`.

## Reglas de arquitectura
- `src/app/actions.ts` no ejecuta SQL: el acceso a `users` pasa por `src/lib/auth.ts`.
  Hoy no se cumple (`actions.ts:34-35`, `:39`, `:49-50`).
  Verificación: `grep -nE "getDb|prepare\(" src/app/actions.ts` debe devolver vacío.
- No agregues funciones, páginas, dependencias ni cambios de versión que la tarea no pida.
  Si crees que hacen falta, pregunta antes.
  Verificación: `git diff --stat` solo toca archivos de la tarea, y `git diff package.json` sale vacío.

## Valores ajustables
- Viven en un solo archivo, `src/lib/constants.ts`. Todavía quedan incrustados: `99` en
  `actions.ts:78` y `CartButton.tsx:21`; `100` en `actions.ts:73`; y `30` en `auth.ts:8`.
- Un valor nuevo no se escribe en línea, y no se inventan textos comerciales
  (envío gratis, garantía): hoy hay dos sin aprobar, en `src/app/page.tsx:40` y `producto/[id]/page.tsx:61`.
  Verificación (cubre `99`, `100`, `120` y los textos comerciales; `10`, `30` y `80` se revisan a mano): `grep -rnE "> ?99|> ?100|> ?120|maxLength=\{[0-9]|S/ [0-9]|[0-9]+ meses" src --include="*.ts*" | grep -v -e seed.ts -e money.ts` debe devolver vacío.

## Estado de la interfaz
- Filtros, búsqueda y paginación del catálogo viven en la URL (`searchParams`), no en `useState`.
  La paginación existe desde la corrida E de la Fase 3.2, con `PRODUCTS_PER_PAGE` y el parámetro `page`.
  Verificación: `grep -n "useState\|use client" src/app/page.tsx` debe devolver vacío.

## Seguridad
- `/admin` y `createProductAction` exigen un usuario administrador. Hoy no se cumple:
  `admin/page.tsx:10` está abierta, `actions.ts:107-123` no llama a `getCurrentUser()`,
  y `users` no tiene columna de rol. No digas que el panel está protegido.
  Verificación: `grep -nE "getCurrentUser|isAdmin|role" src/app/admin/*.tsx` debe devolver algo.
