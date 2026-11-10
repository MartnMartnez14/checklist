# Incidencias y sugerencias

Registro del proyecto, sin datos personales ni copias de notas.

Estados: Pendiente → En evaluación → En desarrollo → Resuelto → Descartado.
La fecha indica el registro documental, no la fecha del reporte original.

| ID | Fecha | Tipo | Descripción | Prioridad | Estado | Resolución |
|---|---|---|---|---|---|---|
| CAT-21 | 2026-10-24 | Error documentado en roadmap | En Android, el asa puede quedar trabada al hacer zoom/pellizco en Mapa. Pendiente de reproducción local y de prueba en dispositivo real. | P1 | En desarrollo | Endurecimiento publicado: cancelación/captura/foco/visibilidad/zoom y segundo puntero; tests sintéticos aprobados. Falta reproducir el problema original y validar en Android físico. No se considera resuelto. |
| CAT-27 | 2026-10-25 | Presentación de imágenes | Las imágenes de fondo casi no se distinguen por la capa de lectura fija al 96 %. La vista previa v16 conserva el mismo comportamiento. | P2 | Resuelto | V17 incorporó barra y superficies; v18 las reemplaza por imagen completa, texto negro/blanco automático y contorno, sin mezcla de color. Publicación y límites de legibilidad registrados en ROADMAP.md. |
| CAT-26 | 2026-10-24 | Sugerencia (uso móvil) | En el teléfono probado no se puede acercar ni alejar el modo Mapa (PWA y navegador); en modo escritorio sí. Propuesta: botones flotantes «+» / «−» solo en Mapa. | P2 | Pendiente | Sin cambios funcionales. Criterios de aceptación en ROADMAP.md §2.8. Causa técnica sin confirmar. |
| CAT-28 | 2026-10-27 | Legibilidad | En PC, sobre algunas imágenes de fondo, las letras a veces tienen poca visibilidad; en celular se ven bien. | P2 | En evaluación | Evaluar ajuste moderado de contorno o peso en escritorio (ROADMAP.md §5.1). Sin reproducción técnica ni cambios todavía. |
| CAT-30 | 2026-11-09 | Error reportado (uso móvil) | Al intentar mover las tareas/notitas dentro de una lista desde el asa (`≡`) en celular, queda trabado y no se desplaza el elemento. | P2 | Pendiente | Registrado en ROADMAP.md (§3, §2.9 y §9.15) para testeo focalizado y resolución futura sin urgencia inmediata. |

Cierre del 2026-10-26: CAT-21 sigue pendiente de Android físico. Las mejoras de presentación publicadas en esa fecha no resolvían CAT-26 ni CAT-27 (CAT-27 se resolvió el 2026-10-27). Las limitaciones del ejecutor de pruebas están registradas en el cierre del roadmap.

Cierre del 2026-10-27: CAT-27 publicado y verificado; CAT-21 continúa abierta a validación Android física y CAT-26 permanece pendiente.

Revisión del 2026-11-07: se registran en la tabla CAT-26 (Pendiente) y CAT-28 (En evaluación). Estado sin cambios: CAT-21 abierta, CAT-27 resuelta. Publicación vigente: caché `checklist-v20`.

Revisión del 2026-11-09: se incorpora CAT-30 (Pendiente) por reporte del usuario sobre el reordenamiento táctil de ítems dentro de una lista en móvil.
