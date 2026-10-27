# Historial de cambios

## 2026-10-27 — CAT-27 publicado y verificado

- Control de visibilidad de imágenes y superficies de lectura publicados con caché `checklist-v17`; commit funcional `ea40c33` y [despliegue Pages](https://github.com/MartnMartnez14/checklist/actions/runs/40570456782) completado.
- 52/52 pruebas en dev con tiempo real normal y reducido; 52/52 en la web pública con tiempo normal. Reloj virtual: 50 PASS y tres fallos de espera/timeout, pendiente de estabilizar.
- Web pública: imagen, teclado y recarga offline verificados con datos ficticios. Actualización v16 → v17 con nota e imagen probada en origen local aislado; transición completa en dominio público no verificada.
- Sin Android físico, Safari ni lector de pantalla. Detalles en ROADMAP.md.


## 2026-10-27 — CAT-27 (candidata validada en dev)

- Visibilidad de imagen por lista de 0–100 %, valor inicial 40 %, muestra y etiqueta ES/EN; independiente de la opacidad del color.
- Superficies de lectura para texto y controles; ajuste conservado al recargar y en respaldos/importación/fusión. Restablecer vuelve al 40 %.
- 52/52 pruebas en tiempo real normal y reducido; teclado, temas, 375 px y recarga offline con imagen ficticia comprobados. Reloj virtual: 50 PASS, 3 FAIL (esperas de conexiones e imagen y timeout del harness). Caché candidata `checklist-v17`.
- Sin Android físico, Safari, lector de pantalla ni auditoría WCAG integral. Sin commits, integración ni publicación.


## Publicación verificada — 2026-10-26

- Vista previa integrada ES/EN, transiciones de 180 ms y Mercado Pago publicados con caché `checklist-v16`.
- Dev y main integrados por fast-forward; commit funcional `35855e0` y [Pages completado](https://github.com/MartnMartnez14/checklist/actions/runs/40410492648).
- 50/50 pruebas en dev y en la web pública con tiempo real normal; 12 archivos públicos idénticos a la candidata. Actualización v15 → v16 conservó nota ficticia.
- Revisión pública a 375 px, copia de cuenta y foco; sin errores de consola observados. Edición sin red guardada; limitación de emulación durante recarga pública explicada en ROADMAP.md.
- Enlace web incorporado a la ficha del repositorio. CAT-27 preservado; pendientes Android, cifrado y limitaciones del ejecutor sin cerrar.
- Los apartados siguientes son antecedentes; «sin publicar» describe el momento en que se registraron.


## Candidata integrada — 2026-10-26

- Presentación, vista previa y Mercado Pago integrados en dev; CAT-27 conservado como pendiente.
- 50/50 pruebas aprobadas en Chrome con tiempo real normal; caché v16. Publicación autorizada, verificación pública pendiente.
- Los registros de trabajo local siguientes conservan el estado que tenían al escribirse.

## 2026-10-26 — Presentación y documentación (local, sin publicar)

- Vista previa integrada de estilo ES/EN con contenido de ejemplo y aplicación inmediata.
- Transiciones de opacidad de 180 ms para nuevas listas/plantillas y cambios efectivos de vista; movimiento reducido respetado.
- Estados actuales del roadmap aclarados; historial conservado. Caché candidata `checklist-v16`, sin cambios de formato de datos.
- Sin commits, integración ni publicación; Android físico y demás pendientes conservados.

## Publicación verificada — 2026-10-25

- Restablecer estilo ES/EN con confirmación, contraste adaptativo y realce al completar tareas con movimiento reducido.
- Roadmap visible actualizado en ambos idiomas; documentación de arquitectura, decisiones y CAT-26 sincronizada.
- Corregido desborde móvil de la tarjeta de correo de contacto a 375 px.
- 48 pruebas aprobadas en tiempo real normal y reducido; esperas intermitentes del ejecutor con reloj virtual registradas, sin validación Android física.
- Caché `checklist-v15`; despliegue funcional `99f44a3` completado y archivos públicos comparados con el repositorio. Actualización desde v13 con datos ficticios conservados; recarga y edición offline públicas verificadas. No cambia el formato de datos; PIN visual y pendientes Android conservados.

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


## 2026-10-25 — Estilo y legibilidad (worktree, sin integrar)
- Restablecer estilo con confirmación bilingüe y conservación del contenido y PIN.
- Contraste adaptado a tintes de tarjetas, iconos y foco visibles; lectura reforzada sobre imágenes.
- Realce breve al completar tareas con respeto por movimiento reducido.
- Cancelar diálogos conserva panel de estilo y foco. Caché `checklist-v14`.
- 48 pruebas aprobadas en modo normal y movimiento reducido; revisión visual a 375 px. Android físico pendiente.


## 2026-10-25 — Integración local en dev
- Integrada la rama de estilo y legibilidad con arquitectura, decisión futura de cifrado y propuesta pendiente CAT-26 de controles de zoom.
- Conservado el historial de `pin-mapa`, cuyo código ya estaba integrado.
- Caché `checklist-v14`; 48 pruebas aprobadas en Chrome con tiempo real y en headless con movimiento reducido. El ejecutor con reloj virtual en modo normal presenta esperas intermitentes en imágenes/conexiones, documentadas en el roadmap.
- Sin cambios en `main`, push ni publicación.

- Ampliación solicitada: Mercado Pago al final de los medios de apoyo, cuenta UYU y titular proporcionados por el autor, con botón Copiar y textos ES/EN. Cambio local sin publicar.

### Validación local del bloque — 2026-10-26
- Chrome con tiempo real normal: 50/50 casos aprobados sobre el bloque final, incluido Mercado Pago.
- Reloj virtual normal: 48/50; fallaron esperas de `delete-dialogs` y `style-shared-image`. Movimiento reducido con reloj virtual: 49/50; falló `style-shared-image`. Las dos pruebas nuevas pasaron en ambos modos. La ejecución aislada con tiempo real reducido no llegó a cargar el harness y agotó el plazo; no se declara validada la suite completa en ese modo.
- Revisión visual: vista previa EN/claro a 375 px y ES/oscuro en escritorio; Mercado Pago ES/oscuro a 375 px sin desbordes. Copiar entrega exactamente la cuenta indicada mediante un sustituto de la API del portapapeles; no se verificó el portapapeles del sistema.
- Imagen añadida y retirada reflejada en la muestra; recarga con servidor detenido desde caché v16 conserva estilo y muestra. Datos ficticios y origen local aislado.
- `git diff --check` correcto. Sin Android físico, Safari ni lector de pantalla. Sin commits, integración ni publicación.
