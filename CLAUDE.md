# Contrato del proyecto

## Qué es esto
Tienda de práctica del curso; cada regla de abajo sale del inventario de `docs/00-ANTES.md` §5.

## Comandos
`npm run dev` · `npm run build` · `npm run typecheck` · `npm run start` · `npm run db:reset` (borra `data/`).
- Pruebas: todavía no hay, ni archivos ni script `test`. No digas que las pruebas pasaron;
  lo único que se puede afirmar es que `typecheck` y `build` terminaron sin error.
  Verificación: `grep -c '"test"' package.json` devuelve 0 mientras esto siga siendo cierto.

## Reglas de arquitectura
- `src/app/actions.ts` no ejecuta SQL: el acceso a `users` pasa por `src/lib/auth.ts`.
  Hoy no se cumple (`actions.ts:33-34`, `:38`, `:48-49`).
  Verificación: `grep -nE "getDb|prepare\(" src/app/actions.ts` debe devolver vacío.
- No agregues funciones, páginas, dependencias ni cambios de versión que la tarea no pida.
  Si crees que hacen falta, pregunta antes.
  Verificación: `git diff --stat` solo toca archivos de la tarea, y `git diff package.json` sale vacío.

## Valores ajustables
- Viven en un solo archivo, `src/lib/constants.ts`, que todavía no existe. Hoy están incrustados
  y duplicados: `120` en `actions.ts:115` y `ProductForm.tsx:20`; `99` en `actions.ts:77` y
  `CartButton.tsx:21`; además `actions.ts:72`, `ProductForm.tsx:34`, `auth.ts:8`, `src/app/page.tsx:13`.
- Un valor nuevo no se escribe en línea, y no se inventan textos comerciales
  (envío gratis, garantía): hoy hay dos sin aprobar, en `src/app/page.tsx:32` y `producto/[id]/page.tsx:61`.
  Verificación (cubre `99`, `100`, `120` y los textos comerciales; `10`, `30` y `80` se revisan a mano): `grep -rnE "> ?99|> ?100|> ?120|maxLength=\{[0-9]|S/ [0-9]|[0-9]+ meses" src --include="*.ts*" | grep -v -e seed.ts -e money.ts` debe devolver vacío.

## Estado de la interfaz
- Filtros, búsqueda y paginación del catálogo viven en la URL (`searchParams`), no en `useState`.
  La paginación hoy no existe (se revirtió en la Fase 2.2). Verificación: `grep -n "useState\|use client" src/app/page.tsx` debe devolver vacío.
- `localStorage` solo guarda el carrito (`CartProvider.tsx`); no hay tabla `cart_items`.
  No la crees ni muevas el carrito sin que se pida.
  Verificación: `grep -rln localStorage src` devuelve solo `src/components/CartProvider.tsx`.

## Seguridad
- `/admin` y `createProductAction` exigen un usuario administrador. Hoy no se cumple:
  `admin/page.tsx:10` está abierta, `actions.ts:107-123` no llama a `getCurrentUser()`,
  y `users` no tiene columna de rol. No digas que el panel está protegido.
  Verificación: `grep -nE "getCurrentUser|isAdmin|role" src/app/admin/*.tsx` debe devolver algo.
