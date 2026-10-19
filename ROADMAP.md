# 🐈 CHECKLIST GATO (CHECKLIST CAT) — ROADMAP TÉCNICO, AUDITORÍA Y EXPANSIÓN

**Proyecto:** Checklist Gato (ES) / Checklist Cat (EN)  
**Sitio web:** https://checklistgato.com  
**Estado:** Primera versión pública operativa (v1.0)  
**Objetivo:** Consolidación, mantenimiento, evolución progresiva y expansión internacional.

---

## 1. CONTEXTO Y FILOSOFÍA DEL PROYECTO

Checklist Gato es una aplicación web (PWA) de organización personal que permite trabajar con listas, notas y tareas mediante una interfaz minimalista, intuitiva, personalizable, *offline-first* y visualmente agradable.

**Filosofía principal:**
> *«Una aplicación sencilla de utilizar, poderosa en sus posibilidades y confiable en su funcionamiento».*  
> *«Primero hacer bien lo esencial. Después mejorar continuamente. Y solamente agregar complejidad cuando realmente aporte valor».*

### Principios fundamentales
1. **Minimalismo funcional:** sin sobrecargar la interfaz.
2. **Rendimiento y fluidez:** cero dependencias externas innecesarias.
3. **Personalización visual:** colores, opacidad, fondos de imagen/GIF y temas claro/oscuro.
4. **Facilidad de uso:** curva de aprendizaje inmediata.
5. **Estabilidad y ausencia de errores conocidos:** respaldada por pruebas automatizadas (`tests/run.sh`).
6. **Privacidad y seguridad:** datos 100% locales en el dispositivo del usuario (`localStorage` + `IndexedDB`), sin servidores ni cuentas obligatorias.
7. **Accesibilidad:** soporte completo de teclado, lectores de pantalla (`aria-live`, roles semánticos) y respeto por `prefers-reduced-motion`.
8. **Compatibilidad multi-dispositivo:** escritorio, móviles y tablets (ratón, táctil y teclado).
9. **Evolución progresiva:** basada en necesidades reales.
10. **Mantenimiento sostenible:** arquitectura limpia en `index.html`, `sw.js` y `manifest.json` pensada para un desarrollador independiente.

**Regla fundamental:** Antes de proponer o implementar cualquier modificación, analizar el repositorio, comprender la arquitectura actual y ejecutar la suite de regresión (`bash tests/run.sh`). No eliminar ni reemplazar funciones existentes sin justificación técnica clara.

---

## 2. DIAGNÓSTICO Y AUDITORÍA TÉCNICA DEL ESTADO ACTUAL (BASE v1.0)

### 2.1 Lo que ya existe y funciona (Verificado con `PASS=25 FAIL=0`)
- **Arquitectura cero-dependencias:** HTML5, CSS moderno (variables CSS, `color-mix`, `conic-gradient`) y JavaScript vanilla en `index.html`.
- **Gestión de listas y elementos:**
  - Creación, edición y borrado de listas y elementos.
  - Ajuste multilínea automático (`growItems`) en títulos y elementos.
  - `Enter` divide el elemento activo en la posición del cursor e inserta uno nuevo justo debajo (`insertAfter`); `Shift+Enter` inserta salto de línea; protección IME (`isComposing`).
  - Reordenamiento de elementos dentro de cada grupo (pendientes / completados) mediante arrastre (ratón/táctil) y teclado (`ArrowUp`/`ArrowDown`, `Shift` mueve 3 posiciones).
  - Marcado de tareas completadas, barra plegable de completados y borrado rápido.
  - **Buscador global:** filtro en tiempo real por título, tareas y etiquetas, insensible a mayúsculas y acentos, sin modificar los datos guardados.
  - **Plantillas rápidas:** Compras, Estudios, Proyectos, Hábitos, Viajes y Organización personal, con elementos de ejemplo editables.
  - Fecha y hora de creación (`createdAt`) en formato local (sin inventar fechas para notas antiguas).
- **Dos vistas de tablero:**
  - **Vista Cuadrícula:** diseño adaptable en columnas.
  - **Vista Mapa:** lienzo libre donde las listas se arrastran con ratón, pantalla táctil o teclado.
- **Conexiones entre listas (Grafo estilo Obsidian):**
  - Conexiones manuales (modo conectar) con flechas curvas SVG y borrado con clic.
  - Conexiones automáticas por etiquetas (`tags`) compartidas.
  - Borde coloreado en cada lista conectada (sólido para una conexión, degradado `conic-gradient` para múltiples conexiones).
- **Personalización y temas:**
  - Modo claro y oscuro con persistencia, detección del sistema y cambio automático del logo (`cat-day.png` / `cat-night.png`).
  - Paleta de 10 colores con opacidad regulable (0% a 60%) e imágenes/GIFs de fondo en `IndexedDB` (`checklist-media`) con deduplicación SHA-256 y recolector de basura (`gcImages`).
- **Respaldo de datos (Exportar / Importar Schema v2):**
  - Exportación en JSON incluyendo notas e imágenes codificadas en Base64.
  - Importación con validación estructural, descarga automática de copia de seguridad previa y dos modos: **Fusionar (idempotente)** y **Reemplazar**.
- **PWA e infraestructura:**
  - Instalable (`manifest.json`, iconos 192/512) y funcional sin conexión (`sw.js` con caché `checklist-v11`, estrategia *network-first* para el documento HTML y *cache-first* para recursos estáticos).
  - Dominio personalizado `https://checklistgato.com` (DNS en Hostinger apuntando a GitHub Pages con `CNAME` y HTTPS activo).
  - **Descubrimiento y metadatos:** `description`, `canonical`, OpenGraph (título, descripción, URL e imagen absoluta), Twitter Card y `manifest.json` enriquecido (`lang`, `description`, `categories`), listos para compartir el enlace con vista previa.
- **Seguridad XSS:**
  - Creación de nodos DOM exclusivamente mediante `el()` / `svgEl()` y `textContent` (cero uso de `innerHTML` con datos del usuario).
- **Sección «Apoyar el proyecto» y Sello Open Source:**
  - Footer con enlaces seguros (`rel="noopener noreferrer"`) a Ko-fi, PayPal, referido de Starlink, copia rápida de cuenta Prex (`35502`) y sello Open Source con acceso al repositorio en `header` y `footer`.

### 2.2 Hallazgos técnicos resueltos en esta iteración (v1.1)
1. **Manejo de cuota en `localStorage` (`save()` y `migrate()`):** *(Resuelto)* `localStorage.setItem` envuelto en bloques `try/catch` que abren un diálogo claro (`notifyQuotaExceeded()`) ofreciendo descargar un respaldo JSON inmediato sin romper la ejecución.
2. **Afinado de `mergeNotes()` y enlaces al importar:** *(Resuelto)*
   - En modo `merge`, la validación previa conserva los enlaces dirigidos hacia listas que ya existen localmente.
   - `noteSignature()` contempla metadatos visuales (`color`, `opacity`, `bgId`, `links`, `pos`) cuando dos notas tienen el mismo ID pero carecen de `updatedAt` diferenciador.
3. **Confirmación en «Borrar completados»:** *(Resuelto)* Se solicita confirmación antes de eliminar en bloque las tareas completadas de una lista.
4. **Higiene del repositorio:** *(Resuelto)* `.gitignore` añadido para excluir la carpeta local de pruebas `repositorio testeos json/`.

---

## 3. TABLA MAESTRA DE PRIORIZACIÓN Y ESTADO

**Criterio de prioridades:**
- **P0:** Error crítico o riesgo de pérdida de datos.
- **P1:** Estabilidad, seguridad, respaldos y funcionalidad esencial.
- **P2:** Mejoras importantes de experiencia, feedback, idioma y escalabilidad media.
- **P3:** Funcionalidades opcionales de valor añadido.
- **P4:** Ideas experimentales o de largo plazo.

| ID | Funcionalidad / Etapa | Prioridad | Complejidad | Estado Actual |
|---|---|---|---|---|
| **CAT-01** | Respaldos de datos (Exportar/Importar JSON + Fusión) | **P1** | Media | **Hecho** (20/20 tests PASS; `mergeNotes` refinado con metadatos y enlaces locales) |
| **CAT-02** | PWA offline-first (`manifest.json` + `sw.js`) | **P2** | Baja | **Hecho** (Operativo en producción con `checklist-v9`) |
| **CAT-03** | Conexiones entre listas (Manuales + Tags + Vista Mapa) | **P2** | Media-Alta | **Hecho** (Operativo; pendiente optimización para cientos de tags) |
| **CAT-04** | Blindaje de persistencia (`try/catch` en `save`, `.gitignore`) | **P1** | Baja | **Hecho (Etapa 1 / Backlog v1.1)** |
| **CAT-05** | Confirmaciones en acciones destructivas (incl. "Borrar completados") | **P1** | Baja | **Hecho (Etapa 1 / Backlog v1.1)** |
| **CAT-06** | Sistema de Feedback por correo en el footer (`mmartinez23bio@hotmail.com`) | **P1/P2** | Baja | **Hecho (Etapa 3 / Backlog Paso 4.B)** |
| **CAT-07** | Sección pública «🐾 Próximos pasos» dentro de la app | **P2** | Baja | **Hecho (Sección 5 / Backlog Paso 4.C)** |
| **CAT-08** | Internacionalización Español / Inglés (`Checklist Gato` / `Checklist Cat`) | **P2** | Media | **Hecho (Etapa 4 / Backlog Paso 4)** |
| **CAT-09** | Optimización y rendimiento a gran escala (100 a 10.000 listas) | **P1/P2** | Media-Alta | **Pendiente (Etapa 2)** |
| **CAT-10** | Mejoras de personalización, microinteracciones y Modo Mapa | **P2/P3** | Media | **Pendiente (Etapa 5)** |
| **CAT-11** | Documentación ampliada (README orientado a confianza/privacidad), `CHANGELOG` y tags Git | **P2** | Baja | **Hecho (Etapa 8 / Backlog Paso 2; tags Git según lanzamientos)** |
| **CAT-12** | Buscador / filtro rápido de listas, notas y etiquetas | **P3** | Baja-Media | **Hecho (Paso 8)** |
| **CAT-13** | Visor "Mapa estelar" (3.ª vista modo universo) | **P3** | Alta | **Idea (Etapa 3.3 / 10.E)** |
| **CAT-14** | Plantillas, atajos de teclado y estadísticas discretas | **P3/P4** | Baja-Media | **Hecho: atajos, progreso y plantillas (Pasos 7-8); falta vista ampliada (Etapa 5.4)** |
| **CAT-15** | Distribución en Google Play / Sincronización Cloud / IA | **P4** | Alta | **Idea futura (Etapas 7.1 y 10.F/G)** |
| **CAT-16** | Sello Open Source + enlace al repositorio (footer + ícono en header) | **P2** | Baja | **Hecho (Etapa 11 / Backlog Paso 1)** |
| **CAT-17** | Etiquetas visibles en botones «Importar» / «Exportar» en móvil | **P2** | Baja | **Hecho (Etapa 5 / Backlog Paso 3)** |
| **CAT-18** | Tercera vista: **Calendario** (junto a Cuadrícula y Mapa) | **P3** | Media-Alta | **Idea (Etapa 10.H / Backlog Paso 5)** |
| **CAT-19** | Metadatos SEO / OpenGraph y manifest PWA enriquecido | **P3** | Baja | **Hecho (Etapa 9 / Backlog Paso 6)** |

---

## 4. ETAPAS DE EVOLUCIÓN DETALLADAS

### ETAPA 1 — Consolidación y Estabilidad (Prioridad: CRÍTICA — P0/P1)
Garantizar que Checklist Gato sea impecable realizando las funciones que ya ofrece.
- **1.1 Protección de almacenamiento:** Capturar errores de cuota (`QuotaExceededError`) en `localStorage` e `IndexedDB`, ofreciendo al usuario exportar un respaldo inmediato si la memoria del navegador se llena.
- **1.2 Confirmaciones seguras:** Migrar todos los avisos destructivos (borrar lista, borrar elementos completados, borrar conexión) al modal accesible `openDialog`.
- **1.3 Refinamiento de Fusión (`mergeNotes`):** Preservar enlaces entrantes hacia notas locales existentes y contemplar cambios de estilo/color en notas sin `updatedAt`.
- **1.4 Ampliación de tests (`tests/harness.html`):** Añadir casos de prueba para estos escenarios sin romper los 20 tests existentes.

---

### ETAPA 2 — Listas y Notas a Gran Escala (Prioridad: ALTA — P1/P2)
Permitir que una persona construya desde una simple checklist hasta un espacio extenso de proyectos, conocimientos e ideas sin bloqueos de interfaz.
- **2.1 Escenarios de prueba de rendimiento:** Evaluar tiempos de carga, memoria, fluidez y persistencia con **10, 100, 1.000 y 10.000 listas**, miles de tareas y múltiples conexiones.
- **2.2 Actualizaciones parciales del DOM:** Evitar que acciones locales (marcar un ítem, cambiar color, editar tags) ejecuten un `render()` completo de todo el tablero cuando solo cambia una tarjeta.
- **2.3 Optimización de `growItems()`:** Evitar el recálculo sincrónico de `scrollHeight` en todos los `<textarea>` del tablero simultáneamente; aplicar cálculo bajo demanda o mediante `IntersectionObserver`.
- **2.4 Escalabilidad del grafo de conexiones:** Evitar la explosión cuadrática $\frac{K(K-1)}{2}$ de flechas SVG cuando decenas o cientos de listas comparten una misma etiqueta (ej. conectando en cadena/estrella o limitando aristas visibles por tag).
- **2.5 Evolución del almacenamiento:** Evaluar migración opcional del estado principal de `localStorage` (~5 MB) a `IndexedDB` solo cuando el volumen lo justifique y **siempre con procedimiento automático de respaldo, validación y recuperación previa**.
- **2.6 Pulido del Modo Mapa y Conexiones:**
  - Decidir entre scroll de página o *pan/zoom* del lienzo.
  - Permitir anchos de tarjeta configurables y valorar un auto-layout opcional al entrar en modo Mapa.
  - Evaluar la convivencia entre relaciones libres (grafo actual) y jerarquías opcionales (Proyecto → Subproyecto → Tareas).

---

### ETAPA 3 — Sistema de Feedback (Prioridad: ALTA — P1/P2)
Agregar un mecanismo sencillo, privado y directo para que los usuarios compartan su experiencia.
- **3.1 Ubicación:** Sección discreta en el pie de página (`footer`), debajo del bloque de donaciones y apoyo al proyecto.
- **3.2 Correo confirmado:** `mmartinez23bio@hotmail.com` (mediante enlace `mailto:` accesible y opción de copiar correo para reportar bugs, sugerencias o comentarios al desarrollador).
- **3.3 Texto oficial en español:**
  > **💌 Ayudanos a mejorar Checklist Gato**  
  > «Checklist Gato es un proyecto independiente que continúa creciendo. Si encontraste un error, tenés alguna sugerencia o simplemente querés compartir tu experiencia, podés escribirme.  
  > Leo los comentarios y los tengo en cuenta para futuras mejoras. ¡Gracias por ayudar a que Checklist Gato siga evolucionando! 🐾»
- **3.4 Privacidad:** Sin formularios externos, sin trackers ni recolección de datos personales.
- **3.5 Registro interno de gestión de feedback:**
  Mantener una tabla sencilla de seguimiento de incidencias y sugerencias:
  - Campos: `ID | Fecha | Tipo | Descripción | Prioridad | Estado | Resolución`
  - Flujo de estados: `Pendiente → En evaluación → En desarrollo → Resuelto → Descartado`.

---

### ETAPA 4 — Internacionalización ES / EN (Prioridad: MEDIA-ALTA — P2)
Incorporar el inglés como segundo idioma oficial sin añadir librerías externas.
- **4.1 Idiomas iniciales:**
  - **Español (`es`):** idioma predeterminado — identidad visual **«Checklist Gato»**.
  - **Inglés (`en`):** segunda opción — identidad visual **«Checklist Cat»**.
- **4.2 Selector de idioma:** Control discreto e intuitivo (`ES / EN` o `Español / English`) en la barra superior / configuración, persistiendo la preferencia en `localStorage` (`checklist-lang`) y detectando el idioma del navegador en la primera visita (priorizando siempre la elección manual).
- **4.3 Arquitectura ligera:**
  - Diccionario JSON/objeto en JS nativo con claves estables para las ~65 cadenas de interfaz (botones, placeholders, diálogos de importación/fusión, mensajes de error, sección de apoyo, feedback y `aria-label` / anuncios de lector de pantalla).
- **4.4 Regla de oro:** **Jamás traducir ni alterar el contenido personal escrito por el usuario** (títulos, tareas, etiquetas). Cambiar únicamente los textos de la interfaz y verificar que ningún botón se corte por diferencias de longitud.

---

### ETAPA 5 — Personalización y Experiencia Visual (Prioridad: MEDIA — P2/P3)
Perfeccionar la identidad visual sin recargar la aplicación.
- **5.1 Modo claro y oscuro:** Revisar continuamente contraste WCAG, legibilidad sobre tarjetas coloreadas, transiciones suaves y adaptación de los iconos del gato (`cat-day.png` / `cat-night.png`).
- **5.2 Fondos de listas:** Mejorar la vista previa de imagen/color, evaluar gradientes suaves opcionales y facilitar el restablecimiento al estilo original sin afectar la lectura ni el rendimiento.
- **5.3 Microinteracciones discretas:** Pequeñas animaciones al completar tareas, crear listas o cambiar de vista, respetando estrictamente `@media (prefers-reduced-motion: reduce)`.
- **5.4 Editor ampliado (opcional):** Modal o vista cómoda para leer/editar un ítem de texto muy extenso.
- **5.5 Claridad de acciones en móvil (CAT-17):** Mostrar etiquetas legibles en los botones «Importar» / «Exportar» en pantallas pequeñas. Hoy la regla `@media (max-width:560px){.btn .btn-label{display:none;}}` oculta el texto y deja solo las flechas (`↓` / `↑`), lo que confunde a quien entra por primera vez. Ajustar el `header` (micro-etiquetas o `flex-wrap` compacto) para que su función sea evidente sin adivinar.

---

### ETAPA 6 — Privacidad, Respaldos y Seguridad (Prioridad: ALTA — P1)
Consolidar la ventaja competitiva de ser una herramienta 100% local y privada.
- **6.1 Persistencia y transparencia:** Documentar con claridad en el README y en la ayuda que los datos residen en el navegador del dispositivo y la importancia de exportar copias JSON periódicas antes de borrar datos del navegador.
- **6.2 Seguridad continua:**
  - Mantener la política de cero `innerHTML` para prevenir XSS.
  - Validar tamaño, estructura y tipos MIME al importar JSON e imágenes.
  - Evaluar la incorporación de una política `Content-Security-Policy` (CSP) vía meta tag compatible con el archivo único y blobs locales.
  - Cero credenciales expuestas, cero cuentas obligatorias.

---

### ETAPA 7 — Versión Móvil, PWA y Distribución (Prioridad: FUTURA — P3/P4)
- **7.1 Evolución PWA:** Mantener actualizado `manifest.json` y `sw.js`, asegurando que las actualizaciones del Service Worker nunca causen inconsistencias ni pérdida de información.
- **7.2 Validación móvil:** Pruebas continuas en pantallas táctiles reales para el arrastre de listas en modo Mapa y el reordenamiento de ítems.
- **7.3 Evaluación de Google Play (P4):** Considerar empaquetado (TWA / Bubblewrap) únicamente si existe demanda real de los usuarios, evaluando antes costos, políticas y mantenimiento frente a la instalación directa desde la web.

---

### ETAPA 8 — Repositorio, Documentación y Versionado (Prioridad: MEDIA-ALTA — P2)
- **8.1 Documentación clara:** Mantener `README.md` y `ROADMAP.md` sincronizados con las funciones reales, instrucciones de uso local, arquitectura de privacidad y guía de pruebas.
- **8.2 Estrategia de versiones sugerida (Git tags):**
  - `v1.0` — Versión inicial pública operativa (`checklistgato.com`).
  - `v1.1` — Consolidación, estabilidad, confirmaciones unificadas, sección de Feedback y «Próximos pasos».
  - `v1.2` — Optimización de rendimiento para listas a gran escala y mejoras de experiencia.
  - `v1.3` — Internacionalización Español / Inglés (`Checklist Gato` / `Checklist Cat`).
  - `v2.0` — Evolución mayor (ej. Visor "Mapa estelar" o nuevas capacidades de organización), únicamente cuando esté plenamente justificada.

---

### ETAPA 9 — Difusión y Crecimiento Orgánico (Prioridad: FUTURA — P3/P4)
- ✅ **Metadatos SEO y OpenGraph** (`description`, `canonical`, `og:title`, `og:description`, `og:url`, `og:image` absoluta, `twitter:card`) en `index.html`, más `lang`, `description` y `categories` en `manifest.json`. Verificado con el test `seo-meta`.
- Compartir avances y demostraciones breves en GitHub y comunidades de productividad/organización personal, sin publicidad invasiva ni telemetría.

---

### ETAPA 10 — Ideas Experimentales (Prioridad: BAJA / INVESTIGACIÓN — P3/P4)
*Propuestas sujetas a evaluación previa de utilidad real y costo de mantenimiento (no implementar automáticamente):*

- **A. Buscador global (P3):** ✅ Implementado con filtro en tiempo real por título, tareas y etiquetas (insensible a acentos), atajo `/` y limpieza con `Escape`.
- **B. Visor «Mapa estelar» / Modo Universo (P3):**
  - Tercera vista dentro del tablero (*Cuadrícula*, *Mapa* y *Mapa estelar*): un lienzo tipo cielo nocturno (y variante clara) donde cada lista es un punto luminoso.
  - **Punto por lista:** Color según su conexión (degradado si tiene varias; blanco como una estrella si no tiene conexiones). Tamaño proporcional al número de conexiones.
  - **Aristas:** Líneas finas con el color de la conexión.
  - **Interacción y accesibilidad:** Pasar el ratón o enfocar con teclado (`aria-label` con título) muestra el nombre; clic o `Enter`/`Espacio` abre la nota completa en un panel o modal para editarla.
- **C. Plantillas opcionales (P3/P4):** ✅ Implementadas (Compras, Estudios, Proyectos, Hábitos, Viajes y Organización personal) con diálogo bilingüe.
- **D. Atajos de teclado (P3/P4):** ✅ Implementados `N` (nueva lista), `G` (cuadrícula), `M` (mapa) y `?` (ayuda), con guardas para no dispararse al escribir.
- **E. Estadísticas básicas (P4):** ✅ Progreso discreto por lista (barra + `completados/total`), sin convertirlo en un sistema de presión de productividad.
- **F. Sincronización entre dispositivos (P4):** Investigación a largo plazo (requeriría infraestructura, cifrado y resolución de conflictos; hoy se resuelve de forma privada con Exportar/Importar con Fusión).
- **G. Integración con IA (P4):** Exclusivamente como experimento futuro, opcional, transparente y respetuoso de la privacidad.
- **H. Tercera vista «Calendario» (P3, CAT-18):**
  - Nueva 3.ª opción en el selector de vistas del `header` (junto a *Cuadrícula* y *Mapa*).
  - Ver y organizar listas o tareas por fecha (aprovechando `createdAt` o una fecha asignada), manteniendo la esencia simple de un checklist.
  - Requiere un boceto previo: no debe sobrecargar la interfaz ni desvirtuar la idea de lista de chequeo.
  - Variante complementaria a evaluar: un «modo expansión» que muestre las listas de forma ampliada.

---

### ETAPA 11 — Transparencia, Open Source y Confianza (Prioridad: MEDIA — P2 / CAT-16)
Dejar explícito que el proyecto es abierto, auditable y pensado para durar, para dar seguridad total a quien lo use.
- **11.1 Sello Open Source en la app:** Bloque discreto en el `footer`, cercano a «Apoyar el proyecto», con el mensaje:
  > *«Proyecto escalable a largo plazo, 100% Open Source y auditable.»* + enlace al repositorio.
- **11.2 Enlace al repositorio:** `https://github.com/MartnMartnez14/checklist` (pestaña nueva con `rel="noopener noreferrer"`).
- **11.3 Ícono de GitHub en el `header`:** Acceso rápido y discreto al repositorio desde la barra superior.
- **11.4 Coherencia visual:** El mensaje no debe competir con las donaciones ni con el feedback; mismo estilo y correcto soporte en modo claro y oscuro.

---

## 5. DISEÑO DEL ROADMAP PÚBLICO DENTRO DE LA APP («🐾 Próximos pasos»)

Se incorporará en la interfaz (como panel desplegable discreto en el pie de página, accesible y adaptado a modo claro y oscuro) con tres categorías claras:

### 🛠️ En desarrollo
- Tercera vista de tablero: **Calendario** por fecha.
- Estabilidad continua, confirmaciones seguras y protección del almacenamiento local.

### 🔜 Próximamente
- Optimización de rendimiento para tableros con gran cantidad de listas y conexiones.
- Vista ampliada para leer y editar notas largas.

### 💡 Ideas a futuro *(en evaluación)*
- **Visor «Mapa estelar» (modo universo):** vista panorámica de nodos y conexiones.
- Sincronización entre dispositivos e integraciones futuras.

---

## 6. METODOLOGÍA DE TRABAJO INCREMENTAL

Para cada actualización futura sobre este roadmap se seguirá el ciclo:
1. **Fase A — Análisis:** Inspeccionar el código afectado y revisar los tests existentes.
2. **Fase B — Planificación:** Definir archivos afectados (`index.html`, `sw.js`, `tests/harness.html`), riesgos y criterios de éxito.
3. **Fase C — Desarrollo:** Cambios pequeños, limpios, sin dependencias innecesarias y 100% reversibles.
4. **Fase D — Validación:** Ejecutar `bash tests/run.sh` y comprobar `FAIL=0` (añadiendo tests nuevos cuando corresponda).
5. **Fase E — Documentación:** Actualizar `ROADMAP.md` y `README.md` según los avances completados.
6. **Fase F — Publicación:** Realizar commits o despliegues únicamente con autorización explícita del autor.

---

## 7. HISTORIAL DE FUNCIONALIDADES COMPLETADAS RECIENTEMENTE (BASE v1.0)

- Identidad **Checklist Gato** con dominio propio (`https://checklistgato.com`) y logos adaptados a modo día (`cat-day.png`) y noche (`cat-night.png`).
- Los títulos e ítems ajustan el texto en **varias líneas** automáticamente sin cortarse.
- **Reordenamiento de elementos** dentro de una lista con asa de arrastre (ratón/táctil) y teclado (`↑`/`↓`, `Shift` mueve 3 posiciones), persistiendo al recargar.
- `Enter` en un elemento lo divide o inserta uno nuevo justo después en la posición del cursor (`Shift+Enter` agrega salto de línea).
- **Importación avanzada** con modos **Fusionar (recomendada, idempotente)** y **Reemplazar**, validación previa, copia de seguridad automática antes de importar y resumen de resultados.
- **Fecha y hora de creación** visible en cada nota (respetando notas antiguas sin fecha).
- Pie de página **«Apoyar el proyecto»** (Ko-fi, PayPal, Starlink como enlace de referido y cuenta Prex con botón de copiado rápido).
- Modo **Mapa** con arrastre robusto en móvil y teclado, y bordes coloreados por conexión (sólido o multicolor).
- Harness de pruebas automatizadas en Chrome headless (`tests/run.sh` y `tests/harness.html`) con 25 pruebas de regresión en verde.
- Atajos de teclado (`N`, `G`, `M`, `/`, `?`), progreso discreto por lista y buscador global insensible a acentos.
- Plantillas rápidas bilingües (Compras, Estudios, Proyectos, Hábitos, Viajes y Organización personal).
- Metadatos de descubrimiento (SEO/OpenGraph/Twitter) y manifest PWA enriquecido, con vista previa correcta al compartir `https://checklistgato.com`.

---

## 8. BACKLOG PRÓXIMOS DÍAS (ORDENADO DE MÁS FÁCIL A MÁS DIFÍCIL)

> Plan de trabajo incremental para los próximos días. **Ningún ítem se implementa sin autorización explícita**; el orden va de menor a mayor complejidad. Cada paso se cierra con `bash tests/run.sh` en verde y su actualización correspondiente de documentación.

### ✅ PASO 1 — Sello Open Source + enlace al repositorio *(Completado — CAT-16 / Etapa 11)*
- `footer`: bloque «Proyecto escalable a largo plazo, 100% Open Source y auditable» con enlace al repositorio (`https://github.com/MartnMartnez14/checklist`).
- `header`: ícono discreto de GitHub (`#github-header`) que abre el repositorio.
- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`; coherente en modo claro y oscuro, verificado con test automatizado (`open-source` en `tests/harness.html`).

### ✅ PASO 2 — README orientado a confianza y privacidad *(Completado — CAT-11 / Etapa 8)*
- Explicada la propuesta de **Checklist Gato** tanto para público general como para desarrolladores/auditores.
- Documentado en lenguaje claro que los datos viven **exclusivamente en el dispositivo** (`localStorage` + `IndexedDB`): sin servidores, sin cuentas, sin telemetría y sin riesgo de filtración en la nube; código 100% abierto y auditable.
- Detallado el flujo para pasar datos entre PC y celular con **Exportar / Importar** (modos Fusionar idempotente y Reemplazar, más respaldo automático previo) y la importancia de respaldos periódicos.
- `README.md` y `ROADMAP.md` sincronizados con el estado real del repositorio.

### ✅ PASO 3 — Etiquetas de Importar / Exportar en móvil *(Completado — CAT-17 / Etapa 5)*
- Se eliminó `display:none` sobre `.btn .btn-label` en `@media (max-width:560px)` y se ajustó el espaciado compacto del `header` y `.actions`.
- Ahora los botones muestran claramente su etiqueta («Exportar», «Importar», «Nueva lista») en pantallas móviles, verificado en viewport de `375px` dentro de `tests/harness.html`.

### ✅ PASO 4 — Selector de idioma Español / Inglés *(Completado — CAT-08 / Etapa 4)*
- Selector discreto `#lang-toggle` (`ES` / `EN`) en el `header` que alterna toda la interfaz entre **Checklist Gato (ES)** y **Checklist Cat (EN)** con persistencia en `localStorage` (`checklist-lang`).
- Diccionario nativo completo (`I18N.es` / `I18N.en`) para botones, estados vacíos, diálogos de importación/fusión, colores, `aria-label`, anuncios de lector de pantalla y sección de apoyo/Open Source.
- **Regla de oro respetada:** jamás traduce ni altera el contenido escrito por el usuario (títulos, ítems, etiquetas).

### ✅ PASO 4.B — Contacto / Feedback al desarrollador en el `footer` *(Completado — CAT-06 / Etapa 3)*
- Añadido debajo de las donaciones en el `footer` el bloque «Ayudanos a mejorar Checklist Gato» / «Help us improve Checklist Cat» con enlace `mailto:mmartinez23bio@hotmail.com`, botón de copiado rápido (`#copy-email`) y soporte completo Español / Inglés.

### ✅ PASO 4.C — Cierre de tareas fáciles pendientes *(Completado — CAT-04, CAT-05, CAT-07 / Etapa 1 y Sección 5)*
- **CAT-04:** Protección de cuota en `save()` y `migrate()` con `try/catch` y diálogo `notifyQuotaExceeded()` para descargar respaldo inmediato si `localStorage` se llena.
- **CAT-05 y Etapa 1.3:** Confirmación añadida en «Borrar completados» y refinamiento de `mergeNotes()` / `noteSignature()` para preservar enlaces hacia listas locales y detectar cambios de estilo en notas sin `updatedAt`.
- **CAT-07:** Panel desplegable `<details id="roadmap-details">` («🐾 Próximos pasos» / «🐾 What's next») en el `footer` con las 3 columnas de evolución en Español e Inglés.

### PASO 5 — Tercera vista «Calendario» *(Media-Alta — CAT-18 / Etapa 10.H)*
- Nueva 3.ª opción en el selector de vistas del `header` (junto a *Cuadrícula* y *Mapa*).
- Ver y organizar listas o tareas por fecha (aprovechando `createdAt` o una fecha asignada), sin sobrecargar ni desvirtuar la esencia de un checklist.
- Diseñar un boceto previo antes de implementar.

### ✅ PASO 6 — Metadatos SEO / OpenGraph *(Completado — CAT-19 / Etapa 9)*
- `index.html`: `description`, `canonical`, OpenGraph completo (`og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image` absoluta con dimensiones y `og:locale`) y Twitter Card.
- `manifest.json`: añadidos `lang`, `dir`, `description` y `categories`; nombre ampliado sin cambiar `short_name`.
- `sw.js`: caché elevada a `checklist-v10` para que el manifest actualizado se refresque en instalaciones existentes.
- Nuevo test `seo-meta` en `tests/harness.html` (suite: `PASS=21 FAIL=0`).

### ✅ PASO 7 — Atajos de teclado y progreso por lista *(Completado — CAT-14 / Etapa 10.D-E)*
- **Atajos globales:** `N` crea una lista, `G` y `M` cambian de vista, `?` abre la ayuda con todos los atajos. Se ignoran con modificadores, al escribir en campos o con un diálogo/popover abierto. Añadidos `aria-keyshortcuts` a los botones correspondientes.
- **Progreso por lista:** barra fina + contador `completados/total` en cada tarjeta con elementos, con `role="progressbar"` y `aria-valuenow`/`aria-valuemax`. Se actualiza sin re-renderizar al añadir o dividir tareas (se conserva el foco).
- Nuevos tests `list-stats` y `shortcuts` (suite: `PASS=23 FAIL=0`).

### ✅ PASO 8 — Buscador global y plantillas *(Completado — CAT-12 y CAT-14 / Etapa 10.A-C)*
- **Buscador:** input en el `header` con filtro en tiempo real por título, tareas y etiquetas; insensible a mayúsculas y acentos; atajo `/`, limpieza con `Escape` y mensaje de «Sin resultados». No altera los datos ni la persistencia.
- **Plantillas:** botón «Plantillas» que abre un diálogo con seis opciones bilingües (Compras, Estudios, Proyectos, Hábitos, Viajes y Organización personal), creando una lista con ítems pendientes editables.
- Nuevos tests `search-filter` y `templates` (suite: `PASS=25 FAIL=0`). Caché PWA elevada a `checklist-v11`.
