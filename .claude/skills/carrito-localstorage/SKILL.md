---
name: carrito-localstorage
description: >-
  Decide dónde se guarda un dato en esta tienda: en `localStorage` solo va el
  carrito (`CartProvider.tsx`) y no hay tabla `cart_items`. Úsala cuando la
  tarea quiera recordar algo entre recargas o entre dispositivos: «guarda mis
  productos favoritos en el navegador», «que el carrito no se pierda al cambiar
  de navegador», «recuerda lo último que agregué», «guarda el carrito en la base
  de datos». No cubre la sesión de login, los filtros del catálogo ni los datos
  de productos y pedidos.
---

# Dónde se guarda el carrito

## La regla (sale del CLAUDE.md, regla 7)

`localStorage` solo guarda el carrito (`CartProvider.tsx`); no hay tabla `cart_items`.
No la crees ni muevas el carrito sin que se pida.

## Cómo está hoy (inventario, `docs/00-ANTES.md` §5)

- Lo que va a `localStorage` es el carrito, no la sesión:
  `src/components/CartProvider.tsx:35` (`getItem`) y `:46` (`setItem`).
- La sesión es cookie `httpOnly` con token hasheado en la tabla `sessions`
  (`src/lib/auth.ts:29-43`). No va a `localStorage`.
- No existe `cart_items`: el carrito vive solo en el navegador y se pierde al
  cambiar de navegador o dispositivo (problema 6 del inventario).

## Pasos

1. Si la tarea quiere guardar en `localStorage` algo que no es el carrito, no lo
   hagas: pregunta antes.
2. Si la tarea pide crear `cart_items` o mover el carrito fuera de
   `localStorage`, hazlo solo si la petición lo dice explícitamente. Si no lo
   dice, pregunta antes.
3. Al cerrar la tarea, corre la verificación y reporta su salida tal cual.

## Verificación

`grep -rln localStorage src` devuelve solo `src/components/CartProvider.tsx`.
