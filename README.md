# 🐈 Checklist Gato

**Checklist Gato** es una aplicación web progresiva (PWA) de listas, notas y tareas pensada para ser **simple de usar, potente en sus posibilidades y 100 % privada**. Funciona en computadora y celular, se puede instalar como aplicación y trabaja sin conexión a internet (*offline-first*).

- **Aplicación web:** [https://checklistgato.com](https://checklistgato.com/)
- **Código fuente (100 % Open Source y auditable):** [https://github.com/MartnMartnez14/checklist](https://github.com/MartnMartnez14/checklist)

**Publicación actual — 2026-10-27:** imagen completa de fondo con letras negras/blancas automáticas y contorno fino, sin paneles ni mezcla de color; caché `checklist-v18`. Sin imagen se conserva el estilo de color. [Despliegue completado](https://github.com/MartnMartnez14/checklist/actions/runs/40575181195); 54/54 pruebas locales normal y reducido y 54/54 en la web pública con tiempo normal. Recarga offline verificada con imágenes de prueba. Evidencia y límites en ROADMAP.md.

Si una pestaña antigua no muestra los cambios, probá recargar sin caché (`Ctrl+Shift+R` en Chrome de escritorio). No borres los datos del sitio: allí están tus notas.

---

## 🔒 Privacidad total y confianza (Para todos los usuarios)

En la mayoría de las aplicaciones actuales, tus notas y listas personales se envían a servidores externos. **En Checklist Gato tus datos son exclusivamente tuyos:**

- **Todo vive en tu propio dispositivo:** Lo que escribís se guarda directamente dentro del navegador de tu teléfono o computadora. Nada sale de tu equipo.
- **Sin cuentas ni registros:** No tenés que dar tu correo electrónico, crear contraseñas ni iniciar sesión para usarla.
- **Sin servidores externos ni rastreadores:** No hay bases de datos en la nube, ni telemetría oculta, ni publicidad, ni analíticas espiando qué anotás.
- **Sin riesgo de filtraciones en la nube:** Como no almacenamos tus listas en ningún servidor, es imposible que tus notas se filtren por un hackeo a una base de datos remota.
- **100 % Open Source y auditable:** Cualquier persona o especialista puede inspeccionar el código completo en este repositorio (`index.html`, `sw.js`, `manifest.json`), construido sin librerías externas ocultas (*cero dependencias*).

---

## 🔄 Cómo respaldar tus datos o pasarlos entre PC y celular

Dado que no hay un servidor intermediario, el traslado de información entre tus propios dispositivos (por ejemplo, de la computadora al celular) y tus copias de seguridad se hacen mediante los botones **Exportar** e **Importar** de la barra superior:

1. **Exportar (`↓ Exportar`):** Descarga un archivo `.json` en tu dispositivo con todas tus listas, tareas, colores, etiquetas, conexiones e imágenes/GIFs de fondo incluidos.
2. **Importar (`↑ Importar`):** Seleccionás un archivo `.json` exportado previamente y la aplicación te permite elegir entre dos modos seguros:
   - **Fusionar (Recomendado):** Combina de forma inteligente las listas del archivo con las que ya tenés en pantalla sin perder nada. Si una lista fue editada recientemente, aplica la versión más nueva; si hay dudas o diferencias sin fecha, conserva ambas copias para que nunca pierdas información. Además es *idempotente* (si importás el mismo archivo dos veces seguidas, no duplica tus listas).
   - **Reemplazar:** Sustituye el tablero actual por el contenido exacto del archivo importado.
3. **Protección automática:** Antes de aplicar cualquier importación (sea fusión o reemplazo), Checklist Gato **descarga automáticamente una copia de seguridad** (`checklist-backup-...json`) de tus datos actuales por si querés volver atrás.

> 💡 **Recomendación importante:** Como tus datos residen en el almacenamiento local del navegador, si algún día desinstalás el navegador, formateás el equipo o borrás los *"datos de sitios web"* en la configuración del navegador, tus listas locales se borrarán. **Acostumbrate a tocar «Exportar» periódicamente** para guardar tu respaldo `.json` en una carpeta segura.

---

## ✨ Funcionalidades principales

- **Listas y tareas ágiles:**
  - Creación, edición multilínea automática y tachado de tareas completadas con barra plegable (`Completados`).
  - **División rápida con `Enter`:** Al presionar `Enter` en medio de un elemento, el texto se divide en la posición del cursor e inserta un ítem nuevo justo debajo (`Shift + Enter` inserta un salto de línea dentro del mismo ítem).
  - **Reordenamiento intuitivo:** Arrastrá cada tarea desde su asa lateral `≡` con el ratón o pantalla táctil, o reordenala con el teclado (`↑` / `↓` sobre el asa; con `Shift` se mueve de a 3 posiciones).
  - **Fecha y hora de creación:** Visible en la parte superior de cada nota en horario local (respetando notas antiguas sin inventarles fecha).
  - **Progreso por lista:** Barra discreta y contador `completados/total` en cada tarjeta con elementos.
  - **Atajos de teclado:** `N` nueva lista, `G` vista cuadrícula, `M` vista mapa, `/` buscar y `?` para ver la ayuda (se desactivan mientras escribís).
  - **Buscador global:** Filtrá al instante por título, tarea o etiqueta, sin importar mayúsculas ni acentos (`Escape` limpia el filtro).
  - **Plantillas rápidas:** Creá listas de Compras, Estudios, Proyectos, Hábitos, Viajes u Organización personal con ítems de ejemplo editables (incluye Pomodoro, hábitos saludables y checklist de viaje).
  - **Editor ampliado:** Abrí cualquier ítem largo en un modal cómodo para leerlo y editarlo sin perder el contexto.
  - **Listas fijadas:** Fijá hasta 3 listas para que queden siempre primero; las fijadas lucen un borde holográfico tipo carta legendaria (con versión estática si reducís el movimiento).
- **Dos modos de visualización:**
  - **Vista Cuadrícula:** Tablero organizado automáticamente en columnas adaptables.
  - **Vista Mapa:** Lienzo libre donde podés arrastrar y ubicar cada lista donde quieras (con ratón, pantalla táctil o flechas del teclado).
  - **Ordenar mapa:** agrupa listas conectadas manualmente o por etiquetas, con al menos 40 px entre tarjetas y 64 px entre grupos. Conserva su tamaño legible; desplazate para recorrer todo el tablero. Se desactiva durante búsquedas y arrastres.
  - **Deshacer orden:** restaura las posiciones anteriores durante la sesión; deja de estar disponible al editar listas, cambiar tamaños o mover tarjetas.
- **Conexiones entre listas (Grafo estilo Obsidian):**
  - **Manuales:** Tocá el ícono de cadena en una lista y luego hacé clic en otra para unirlas con una flecha curva interactiva.
  - **Automáticas por etiquetas (`tags`):** Si dos o más listas comparten una etiqueta (ej. `proyecto`, `compras`), se conectan automáticamente con línea punteada del color de esa etiqueta.
  - **Bordes inteligentes:** Cada lista conectada se ilumina con un borde del color de su conexión (o un degradado multicolor si participa en varias conexiones).
- **Personalización visual, idioma y temas:**
  - **Bilingüe Español / Inglés (`ES` / `EN`):** Alterná en un clic entre **Checklist Gato** y **Checklist Cat** desde la barra superior (sin tocar jamás el texto de tus notas).
  - **Modo claro y modo oscuro:** Con detección automática del sistema, botón de cambio instantáneo y logos dedicados (`cat-day.png` / `cat-night.png`).
  - **Estilo por lista:** Paleta de 10 colores con opacidad (0 % a 60 %) o imagen de fondo completa, sin mezclarlas. Las imágenes usan letras negras/blancas automáticas con contorno fino.
- **Restablecer estilo:** desde el panel de diseño, con confirmación, quitá color e imagen y volvé a opacidad 18 % sin alterar el contenido, conexiones, posición, fijado o PIN. Disponible en ES/EN.
- **Legibilidad de tarjetas:** primer plano adaptado al color y opacidad; sobre imágenes, texto negro/blanco automático y contorno fino, sin paneles. La lectura sobre fotografías muy cargadas puede variar. Realce breve al completar tareas, desactivado con movimiento reducido.
- **PIN visual por lista:** botón con candado, PIN de 4–8 dígitos y repetición para confirmarlo. Oculta título, tareas, etiquetas y fondo en la interfaz, y omite el contenido bloqueado en búsquedas. El desbloqueo dura hasta recargar o tocar «Bloquear ahora».
  - **No cifra los datos:** el contenido continúa en texto plano en el almacenamiento y los respaldos JSON. Solo se guarda un verificador SHA-256 con sal aleatoria, nunca el PIN. Requiere HTTPS o localhost con Web Crypto.
  - **Recuperación:** «Olvidé el PIN» permite quitar el bloqueo con una confirmación explícita. Es una ayuda para ocultar casualmente, sin protección frente a alguien con acceso al navegador.
  - Exportar/Importar conserva los metadatos del bloqueo; las importaciones comienzan bloqueadas. Las copias antiguas de la app pueden ignorar este campo opcional y mostrar el texto.
- **Ayuda del gato:** preguntas guiadas en el pie, con ocho temas en ES/EN. Funciona offline, no usa IA ni lee las notas.
- **Confirmaciones de borrado:** listas, conexiones y completados usan un diálogo con Cancelar como opción inicial y soporte de teclado.
- **Accesibilidad:** Navegación completa por teclado, avisos para lectores de pantalla (`aria-live`) y respeto por la preferencia de movimiento reducido (`prefers-reduced-motion`).
- **Enlace compartible:** Metadatos SEO/OpenGraph y Twitter Card con imagen, para que el enlace muestre una vista previa clara al compartirlo.

---

## 🛠️ Detalles técnicos (Para desarrolladores y auditores)

Para comprender los componentes, el flujo de datos, los diagramas y la mecánica worktrees → dev → main → publicación, consultá [Arquitectura y flujo de desarrollo](ARQUITECTURA.md).

### Arquitectura de almacenamiento local
- **`localStorage` (`checklist-notas-v1`, `checklist-theme`, `checklist-view`):** Guarda la estructura JSON de las notas, ítems, colores, posiciones en el mapa, etiquetas, conexiones, listas fijadas (`pinned`/`pinnedAt`), metadatos opcionales `visualLock` (`version`, `salt`, `verifier`) y preferencias de vista/tema.
- **`IndexedDB` (base `checklist-media`, almacén `images`):** Guarda los binarios (`Blob`) de las imágenes y GIFs de fondo con deduplicación por hash **SHA-256** (`crypto.subtle.digest`) y recolector de basura automático (`gcImages`) que limpia imágenes huérfanas cuando ya ninguna nota las utiliza.
- **Seguridad contra XSS:** Toda la construcción del DOM se realiza con funciones declarativas (`el()`, `svgEl()`) y `textContent`. No se utiliza `innerHTML` con datos del usuario en ningún punto de la aplicación.

### Estructura de archivos
- `index.html` — Aplicación completa (HTML5, CSS moderno y JavaScript vanilla en un único archivo, cero dependencias externas).
- `sw.js` — Service Worker para funcionamiento offline (estrategia *network-first* con solicitud sin caché HTTP y respaldo offline del documento HTML y *cache-first* para iconos y recursos estáticos).
- `manifest.json`, `icon-192.png`, `icon-512.png` — Manifiesto e íconos para instalación como PWA en Android, iOS y escritorio.
- `cat-day.png` / `cat-night.png` — Ilustraciones del logo para modo claro y oscuro.
- `CNAME` — Configuración de dominio personalizado (`checklistgato.com`) sobre GitHub Pages con HTTPS obligatorio.
- `CHANGELOG.md` — Historial de cambios comprobados, sin versiones históricas atribuidas.
- `INCIDENCIAS.md` — Seguimiento de errores y sugerencias sin datos personales.
- `ARQUITECTURA.md` — Arquitectura, diagramas, decisiones y convenciones de desarrollo y comentarios.
- `ROADMAP.md` — Hoja de ruta técnica, auditoría y planificación evolutiva del proyecto.
- `tests/run.sh` y `tests/harness.html` — Suite automatizada de pruebas de regresión en Chrome headless.

### Ejecución en entorno local
Para probar la aplicación localmente (incluyendo la subida de imágenes con `crypto.subtle` y el Service Worker, que requieren un contexto seguro `localhost` o `HTTPS`):

```bash
python3 -m http.server 8080
# Abrir http://localhost:8080 en el navegador
```

*(Nota: si abrís `index.html` directamente con doble clic mediante `file://`, las listas y conexiones funcionan, pero el navegador bloqueará `crypto.subtle` para subir imágenes y el registro del Service Worker).*

### Pruebas automatizadas (Suite de regresión)
El proyecto cuenta con una batería de pruebas end-to-end que se ejecuta en un navegador Chrome headless real:

```bash
bash tests/run.sh
```

Requiere `google-chrome` y `python3`. Levanta un servidor temporal y ejecuta los 54 casos de `tests/harness.html`. La versión v18 aprobó 54/54 en Chrome con tiempo real normal y reducido; incluye imágenes claras/oscuras, mixtas, transparentes y dañadas, PIN visual, importación, ordenamiento y conexiones. El ejecutor con reloj virtual tiene antecedentes de esperas intermitentes, registrados en el roadmap. Estas pruebas no equivalen a validación física en Android ni auditoría WCAG integral.

---

## ❤️ Apoyar el proyecto y contacto

Checklist Gato es un proyecto independiente, gratuito y de código abierto:
- **Colaboraciones voluntarias:** Al pie de la aplicación encontrás las opciones (Ko-fi, PayPal, referido de Starlink y cuenta Prex `35502`).
- **Reportar errores, sugerencias o comentarios:** Podés escribir directamente al desarrollador a **`mmartinez23bio@hotmail.com`** (con enlace directo y botón para copiar el correo en el footer).

## 📄 Licencia

Publicado bajo licencia [MIT](LICENSE).

## Antecedente de publicación — 2026-10-25

Publicada y verificada en main/Pages y https://checklistgato.com/ con caché `checklist-v15`: estilo, contraste, realce de tareas y documentación sincronizada. El roadmap visible separa funciones disponibles, próximos pasos e ideas. El cierre del despliegue, la prueba offline y la actualización v13 → v15 están registrados en [ROADMAP.md](ROADMAP.md). El PIN sigue siendo visual, sin cifrado; zoom del mapa y Android físico siguen pendientes.

## Antecedente de implementación local — 2026-10-26 (antes de publicar)

- Panel de estilo con muestra integrada: texto de ejemplo ES/EN que refleja color, opacidad, imagen y contraste. Los cambios siguen aplicándose inmediatamente.
- Aparición suave de 180 ms al crear listas o plantillas y cambiar entre Cuadrícula y Mapa; sin desplazamientos, desactivada con movimiento reducido.
- Caché candidata `checklist-v16`; formato de datos y respaldos sin cambios. La publicación del 2026-10-25 descrita arriba permanece como antecedente público.

- Ampliación solicitada: Mercado Pago al final de los medios de apoyo, cuenta UYU y titular proporcionados por el autor, con botón Copiar y textos ES/EN. Cambio local sin publicar.

Validación local: 50/50 en Chrome con tiempo real normal; movimiento reducido completo pendiente por límites del ejecutor. Nuevas pruebas aprobadas también con movimiento reducido virtual. Recarga desde caché v16 con servidor detenido comprobada. Detalle de esperas y límites en ROADMAP.md.

## CAT-27 — implementación local previa a la publicación (2026-10-27)

En dev, la barra **Visibilidad de imagen** ajusta por lista de 0 a 100 % cuánto se ve el fondo; comienza en 40 %, independiente de la opacidad del color. Se refleja en la muestra y se guarda en el JSON con los datos de la lista. Las listas y respaldos antiguos sin este ajuste usan el 40 %. Restablecer estilo lo devuelve a 40 %. Superficies de lectura protegen textos y controles sobre imágenes.

Validación local: 52/52 en Chrome con tiempo real normal y movimiento reducido; teclado, dos temas, viewport de 375 px y recarga offline con imagen ficticia comprobados. El ejecutor de reloj virtual agotó el plazo tras 50 pruebas. Sin prueba Android física, Safari, lector de pantalla ni auditoría integral de accesibilidad. Ese registro describe la etapa local previa; CAT-27 se publicó posteriormente en v17.
