# VERIFICACIÓN S4: terreno antes de sacar una regla y conectar un servidor

Fecha: 2026-11-18

## Versiones

- claude: 2.1.327 (Claude Code), mínimo 2.1.283 ✅ (la extensión del editor también: `anthropic.claude-code@2.1.327`)
- node: v24.11.1
- npm: 11.6.2
- npx: 11.6.2 ✅
- git: 2.51.0.windows.1
- python: 3.14.0

## Commit de partida

`1d1f8c5 docs: mark the Sesión 3 push as done in the bitacora`. `git status --short` sale vacío.

## Reglas de mi CLAUDE.md (39 líneas) y propuesta

| # | Línea | Regla | Propuesta | Por qué / tipo de tarea |
|---|---|---|---|---|
| 1 | 8 | No hay pruebas: no decir que pasaron; solo afirmar `typecheck` y `build` | **Siempre** | Cualquier tarea que cierre con un "listo" puede afirmarlo de más |
| 2 | 13 | `actions.ts` no ejecuta SQL; `users` pasa por `auth.ts` (hoy no se cumple) | A veces | Tareas que tocan `actions.ts`, registro/login o el acceso a datos |
| 3 | 16 | No agregar funciones, páginas, dependencias ni versiones no pedidas | **Siempre** | Es el límite de alcance de toda tarea |
| 4 | 21 | Valores ajustables en `src/lib/constants.ts` (no existe; hoy incrustados y duplicados) | A veces | Tareas que agregan o cambian límites, topes o cantidades |
| 5 | 24 | Ningún valor nuevo en línea; no inventar textos comerciales (hoy hay dos) | A veces | Tareas que escriben números o textos de cara al cliente |
| 6 | 29 | Filtros, búsqueda y paginación del catálogo en la URL, no en `useState` | A veces | Tareas sobre el catálogo (`src/app/page.tsx`) |
| 7 | 31 | `localStorage` solo guarda el carrito; no crear `cart_items` | A veces | Tareas sobre el carrito o sobre qué se persiste |
| 8 | 36 | `/admin` y `createProductAction` exigen admin (hoy no se cumple; no decir que está protegido) | A veces | Tareas sobre `/admin`, productos, sesión o seguridad |

Nota: las líneas `Verificación:` de las reglas 1–8 solo hacen falta al cerrar una tarea, nunca en medio. Si no eliges una regla "a veces", ese es el candidato de la Skill de auditoría del contrato.

## Defectos del inventario que aparecieron (`docs/00-ANTES.md` §5)

- 2 · Valores ajustables incrustados: **"Apareció."** ("El límite `120` está duplicado en dos archivos (form y action) y `99` en dos (action y badge).")
- 3 · Cero pruebas: **"Apareció."**
- 4 · Seguridad abierta: **"Apareció** (forma a: `/admin` no comprueba quién la usa)."
- 1 · BD desde componentes: "No apareció en su forma fuerte"; **parcial**: `actions.ts` mezcla SQL crudo (líneas 34, 38, 49).

## LA CARPETA DE MIS CONVERSACIONES

```
Conversaciones en: C:\Users\jhono\.claude\projects\c--Users-jhono-OneDrive-Documents-datapath-esp-merc-tech3
```

## Veredicto

Terreno listo: versiones sobre el mínimo, repo limpio en `1d1f8c5`, sin `.claude/skills/` ni `.mcp.json`, y la ruta de conversaciones anotada.
