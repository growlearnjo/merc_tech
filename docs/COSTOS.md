## Hipótesis antes de medir

Fecha: 2026-11-18

1. Creo que manda el modelo: pasar de Opus a Haiku moverá mi costo más que cambiar el effort, en las dos comparaciones.
2. Creo que el effort pesa más con Opus: es el que más aprovecha el margen para pensar, y Haiku hará casi lo mismo con margen o sin él.
3. Creo que B costará más de 10 veces lo que cueste E: el modelo cambia el precio de cada token, el effort cambia cuántos se gastan, y las dos cosas se multiplican.

## Corridas de la Fase 3.2

| Corrida | Modelo | Effort | Resultado | Turnos | Decisiones no pedidas | Costo | Duración |
|---|---|---|---|---|---|---|---|
| A | opus-5-5 | medium | ✅ a la primera | 0 | 13, de ellas 4 con ⚠️ | entrada 10 · caché esc 40,207 · caché lec 313,782 · salida 3,716 · US$ 0.34 | 1 min |
| B | opus-5-5 | max | ✅ a la primera | 0 | 10, de ellas 4 con ⚠️ | entrada 34 · caché esc 82,245 · caché lec 1,579,013 · salida 26,438 · US$ 1.26 | 5 min |
