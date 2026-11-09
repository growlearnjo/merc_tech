# Mediciones de la tarea patrón

La misma tarea, corrida tres veces a lo largo del curso, siempre en una
conversación nueva y sobre el mismo código de partida
(ver `doc_sesions/sesion1/TAREA_PATRON.md` §3–§4).

| Corrida | Resultado | Turnos | Estado del filtro | Costo | Duración |
|---|---|---|---|---|---|
| S1 · sin reglas [^s1] | ✅ a la primera | 0 | La URL (`?page=N`), leída en el servidor en `src/app/page.tsx` | Sin medir en dólares (plan de Claude); el % semanal no tiene resolución para una tarea | 4 min |
| S2 · con `CLAUDE.md` | | | | | |
| S3 · configuración elegida | | | | | |

[^s1]: El enunciado original de la tarea patrón (filtro por categoría) ya
    estaba implementado en la app generada en la Fase 1.2, así que en esta
    corrida se usó el enunciado alternativo de paginación: «muestra solo 6
    productos por página, con enlaces para pasar de página, y que si recargo
    siga en la página en la que estaba». En esta fila, «Estado del filtro» se
    refiere al estado de la página actual.
