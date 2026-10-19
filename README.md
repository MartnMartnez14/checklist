# 🐈 Checklist Gato

**Checklist Gato** es una aplicación web progresiva (PWA) de listas, notas y tareas pensada para ser **simple de usar, potente en sus posibilidades y 100 % privada**. Funciona en computadora y celular, se puede instalar como aplicación y trabaja sin conexión a internet (*offline-first*).

- **Aplicación web:** [https://checklistgato.com](https://checklistgato.com/)
- **Código fuente (100 % Open Source y auditable):** [https://github.com/MartnMartnez14/checklist](https://github.com/MartnMartnez14/checklist)

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
  - **Plantillas rápidas:** Creá listas de Compras, Estudios, Proyectos, Hábitos, Viajes u Organización personal con ítems de ejemplo editables.
- **Dos modos de visualización:**
  - **Vista Cuadrícula:** Tablero organizado automáticamente en columnas adaptables.
  - **Vista Mapa:** Lienzo libre donde podés arrastrar y ubicar cada lista donde quieras (con ratón, pantalla táctil o flechas del teclado).
- **Conexiones entre listas (Grafo estilo Obsidian):**
  - **Manuales:** Tocá el ícono de cadena en una lista y luego hacé clic en otra para unirlas con una flecha curva interactiva.
  - **Automáticas por etiquetas (`tags`):** Si dos o más listas comparten una etiqueta (ej. `proyecto`, `compras`), se conectan automáticamente con línea punteada del color de esa etiqueta.
  - **Bordes inteligentes:** Cada lista conectada se ilumina con un borde del color de su conexión (o un degradado multicolor si participa en varias conexiones).
- **Personalización visual, idioma y temas:**
  - **Bilingüe Español / Inglés (`ES` / `EN`):** Alterná en un clic entre **Checklist Gato** y **Checklist Cat** desde la barra superior (sin tocar jamás el texto de tus notas).
  - **Modo claro y modo oscuro:** Con detección automática del sistema, botón de cambio instantáneo y logos dedicados (`cat-day.png` / `cat-night.png`).
  - **Estilo por lista:** Paleta de 10 colores con control deslizable de opacidad (0 % a 60 %) y soporte para subir imágenes o GIFs animados de fondo.
- **Accesibilidad:** Navegación completa por teclado, avisos para lectores de pantalla (`aria-live`) y respeto por la preferencia de movimiento reducido (`prefers-reduced-motion`).
- **Enlace compartible:** Metadatos SEO/OpenGraph y Twitter Card con imagen, para que el enlace muestre una vista previa clara al compartirlo.

---

## 🛠️ Detalles técnicos (Para desarrolladores y auditores)

### Arquitectura de almacenamiento local
- **`localStorage` (`checklist-notas-v1`, `checklist-theme`, `checklist-view`):** Guarda la estructura JSON de las notas, ítems, colores, posiciones en el mapa, etiquetas, conexiones y preferencias de vista/tema.
- **`IndexedDB` (base `checklist-media`, almacén `images`):** Guarda los binarios (`Blob`) de las imágenes y GIFs de fondo con deduplicación por hash **SHA-256** (`crypto.subtle.digest`) y recolector de basura automático (`gcImages`) que limpia imágenes huérfanas cuando ya ninguna nota las utiliza.
- **Seguridad contra XSS:** Toda la construcción del DOM se realiza con funciones declarativas (`el()`, `svgEl()`) y `textContent`. No se utiliza `innerHTML` con datos del usuario en ningún punto de la aplicación.

### Estructura de archivos
- `index.html` — Aplicación completa (HTML5, CSS moderno y JavaScript vanilla en un único archivo, cero dependencias externas).
- `sw.js` — Service Worker para funcionamiento offline (estrategia *network-first* sin caché para el documento HTML y *cache-first* para iconos y recursos estáticos).
- `manifest.json`, `icon-192.png`, `icon-512.png` — Manifiesto e íconos para instalación como PWA en Android, iOS y escritorio.
- `cat-day.png` / `cat-night.png` — Ilustraciones del logo para modo claro y oscuro.
- `CNAME` — Configuración de dominio personalizado (`checklistgato.com`) sobre GitHub Pages con HTTPS obligatorio.
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

Requiere `google-chrome` y `python3`. Levanta un servidor temporal, ejecuta todos los casos de `tests/harness.html` y reporta el resumen final (`PASS=25 FAIL=0 NOVERIFY=0`).

---

## ❤️ Apoyar el proyecto y contacto

Checklist Gato es un proyecto independiente, gratuito y de código abierto:
- **Colaboraciones voluntarias:** Al pie de la aplicación encontrás las opciones (Ko-fi, PayPal, referido de Starlink y cuenta Prex `35502`).
- **Reportar errores, sugerencias o comentarios:** Podés escribir directamente al desarrollador a **`mmartinez23bio@hotmail.com`** (con enlace directo y botón para copiar el correo en el footer).

## 📄 Licencia

Publicado bajo licencia [MIT](LICENSE).
