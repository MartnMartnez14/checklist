# Historial de cambios

## Actualización 2026-10-24

- Publicación autorizada de los dos bloques integrados: confirmaciones accesibles, FAQ local ES/EN, PIN visual con recuperación y orden automático del mapa con Deshacer.
- Robustez adicional del arrastre, diálogos adaptados al viewport móvil y documentación ampliada. CAT-21 sigue pendiente de reproducción y validación en Android físico.
- Validación previa a publicar: `PASS=44 FAIL=0 NOVERIFY=0 chrome_rc=0`; caché PWA `checklist-v13`.
- Distribución desde `main` mediante GitHub Pages en `https://checklistgato.com/`. La finalización del despliegue se comprueba después de subir el commit.

Los registros siguientes describen estados anteriores durante el desarrollo; sus menciones a ausencia de commits o publicación corresponden a esas etapas.

## Integración local en `codex/dev-offline` — 2026-10-24

- Se incorporaron las siete versiones combinadas del worktree `pin-mapa` a la carpeta de desarrollo original, después de respaldar sus archivos fuera del repositorio y verificar SHA-256.
- La nota anterior sobre cambios exclusivos del worktree describe el estado previo a esta integración. La carpeta dev ahora contiene ambos bloques; el worktree se conserva como referencia.
- Suite ejecutada desde dev offline: `PASS=44 FAIL=0 NOVERIFY=0 chrome_rc=0`; `git diff --check` sin errores.
- La referencia `main` no cambió. Sin commits, push ni publicación. La validación en Android físico sigue pendiente.

## Sin publicar — worktree PIN y mapa 2026-10-24

- PIN visual por lista con verificador SHA-256 y sal aleatoria; aviso de que no cifra, recuperación confirmada y desbloqueo solo en memoria. Metadatos opcionales del esquema 2 conservados al importar/exportar y fusionar.
- Ordenar mapa por conexiones manuales/etiquetas, separación según tamaño real, persistencia y Deshacer durante la sesión. Sin autoordenar al editar.
- Limpieza de arrastre de listas e ítems ante cancelación, pérdida de captura/foco, ocultación y cambios de zoom; segundo puntero no toma el control. Android real pendiente de reproducción y validación.
- Diálogos dentro del viewport visual y título de tarjeta legible en mapa táctil.
- Ayuda ES/EN ampliada; caché `checklist-v13`; suite actual: `PASS=44 FAIL=0 NOVERIFY=0`.

### Validación de este worktree

- `bash tests/run.sh`: `PASS=44 FAIL=0 NOVERIFY=0 chrome_rc=0`.
- Revisión visual en Chrome: escritorio y móvil táctil simulado de 375 px, español/inglés y temas claro/oscuro. Diálogo completo dentro del viewport y cabeceras del mapa legibles.
- Con el servidor local detenido: recarga desde la caché `checklist-v13`, lista nuevamente oculta, ordenamiento/Deshacer y desbloqueo con PIN funcionando.
- `git diff --check` sin errores. Checkout original conserva el bloque previo de 34 pruebas y caché v12; cambios nuevos solo en este worktree.
- Sin prueba en Android físico ni auditoría con lector de pantalla. CAT-21 continúa abierta; los eventos sintéticos no demuestran la corrección del problema original.

### Bloque anterior conservado — revisión local 2026-10-24

- Confirmaciones de borrado de listas, conexiones y completados mediante diálogo accesible, con Cancelar inicialmente enfocado y recuperación del foco.
- Ayuda del gato con ocho preguntas guiadas en español e inglés: listas, vistas/conexiones, etiquetas, plantillas, fijado, respaldos, privacidad y uso offline. Sin IA ni lectura de notas.
- Registro de incidencias y actualización de documentación.
- Caché PWA `checklist-v12`.
- Suite local: 34 casos, incluidos cancelación/confirmación de borrados y ayuda bilingüe.

## Base existente comprobada

Sin atribuir versiones ni fechas históricas: listas y tareas; vista Cuadrícula y Mapa; conexiones manuales y etiquetas; plantillas y atajos; buscador; progreso por lista; editor ampliado; hasta tres listas fijadas; temas claro/oscuro e interfaz ES/EN; imágenes locales; exportación/importación JSON con fusión; PWA y metadatos para compartir.

La suite anterior a este bloque tenía 32 pruebas aprobadas. Este historial describe el repositorio local; no certifica el estado del despliegue público.
