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

### 2.1 Lo que ya existe y funciona (Verificado con `PASS=20 FAIL=0`)
- **Arquitectura cero-dependencias:** HTML5, CSS moderno (variables CSS, `color-mix`, `conic-gradient`) y JavaScript vanilla en `index.html`.
- **Gestión de listas y elementos:**
  - Creación, edición y borrado de listas y elementos.
  - Ajuste multilínea automático (`growItems`) en títulos y elementos.
  - `Enter` divide el elemento activo en la posición del cursor e inserta uno nuevo justo debajo (`insertAfter`); `Shift+Enter` inserta salto de línea; protección IME (`isComposing`).
  - Reordenamiento de elementos dentro de cada grupo (pendientes / completados) mediante arrastre (ratón/táctil) y teclado (`ArrowUp`/`ArrowDown`, `Shift` mueve 3 posiciones).
  - Marcado de tareas completadas, barra plegable de completados y borrado rápido.
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
  - Instalable (`manifest.json`, iconos 192/512) y funcional sin conexión (`sw.js` con caché `checklist-v8`, estrategia *network-first* para el documento HTML y *cache-first* para recursos estáticos).
- **Seguridad XSS:**
  - Creación de nodos DOM exclusivamente mediante `el()` / `svgEl()` y `textContent` (cero uso de `innerHTML` con datos del usuario).
- **Sección «Apoyar el proyecto»:**
  - Footer con enlaces seguros (`rel="noopener noreferrer"`) a Ko-fi, PayPal, referido de Starlink y copia rápida de cuenta Prex (`35502`).

### 2.2 Hallazgos técnicos a corregir en próximas iteraciones
1. **Manejo de cuota en `localStorage` (`save()` y `migrate()`):** Envolver `localStorage.setItem` en bloques `try/catch` para capturar `QuotaExceededError` y avisar al usuario mediante un diálogo claro sin romper la ejecución.
2. **Afinado de `mergeNotes()` y enlaces al importar:**
   - Evitar que la limpieza previa de `incoming` (`index.html:1868`) descarte enlaces dirigidos hacia listas que ya existen localmente antes de fusionar.
   - Incluir metadatos visuales (`color`, `opacity`, `bgId`, `links`, `pos`) en la comparación de respaldo cuando dos notas tienen el mismo ID pero carecen de `updatedAt` diferenciador.
3. **Unificación de diálogos de confirmación:** Reemplazar los `confirm()` y `alert()` nativos restantes (eliminar lista, eliminar conexión, errores de imagen/importación) por el modal propio accesible `openDialog()`, y añadir confirmación al botón `"Borrar completados"`.
4. **Higiene del repositorio:** Añadir `.gitignore` para excluir la carpeta local de pruebas `repositorio testeos json/`.

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
| **CAT-01** | Respaldos de datos (Exportar/Importar JSON + Fusión) | **P1** | Media | **Hecho** (20/20 tests PASS; pendiente ajuste fino en `mergeNotes`) |
| **CAT-02** | PWA offline-first (`manifest.json` + `sw.js`) | **P2** | Baja | **Hecho** (Operativo en producción; mejoras futuras opcionales) |
| **CAT-03** | Conexiones entre listas (Manuales + Tags + Vista Mapa) | **P2** | Media-Alta | **Hecho** (Operativo; pendiente optimización para cientos de tags) |
| **CAT-04** | Blindaje de persistencia (`try/catch` en `save`, `.gitignore`) | **P1** | Baja | **Pendiente (Etapa 1)** |
| **CAT-05** | Confirmaciones coherentes con `openDialog()` y en "Borrar completados" | **P1** | Baja | **Pendiente (Etapa 1)** |
| **CAT-06** | Sistema de Feedback por correo en el footer (`mmartinez23v@hotmail.com`) | **P1/P2** | Baja | **Pendiente (Etapa 3)** |
| **CAT-07** | Sección pública «🐾 Próximos pasos» dentro de la app | **P2** | Baja | **Pendiente (Sección 5)** |
| **CAT-08** | Internacionalización Español / Inglés (`Checklist Gato` / `Checklist Cat`) | **P2** | Media | **Pendiente (Etapa 4)** |
| **CAT-09** | Optimización y rendimiento a gran escala (100 a 10.000 listas) | **P1/P2** | Media-Alta | **Pendiente (Etapa 2)** |
| **CAT-10** | Mejoras de personalización, microinteracciones y Modo Mapa | **P2/P3** | Media | **Pendiente (Etapa 5)** |
| **CAT-11** | Documentación ampliada (README orientado a confianza/privacidad), `CHANGELOG` y tags Git | **P2** | Baja | **En progreso (Etapa 8)** |
| **CAT-12** | Buscador / filtro rápido de listas, notas y etiquetas | **P3** | Baja-Media | **Idea (Etapa 10.A)** |
| **CAT-13** | Visor "Mapa estelar" (3.ª vista modo universo) | **P3** | Alta | **Idea (Etapa 3.3 / 10.E)** |
| **CAT-14** | Plantillas, atajos de teclado y estadísticas discretas | **P3/P4** | Baja-Media | **Idea (Etapa 10.B/C/D)** |
| **CAT-15** | Distribución en Google Play / Sincronización Cloud / IA | **P4** | Alta | **Idea futura (Etapas 7.1 y 10.F/G)** |
| **CAT-16** | Sello Open Source + enlace al repositorio (footer + ícono en header) | **P2** | Baja | **Pendiente (Etapa 11 / Backlog Paso 1)** |
| **CAT-17** | Etiquetas visibles en botones «Importar» / «Exportar» en móvil | **P2** | Baja | **Pendiente (Etapa 5 / Backlog Paso 3)** |
| **CAT-18** | Tercera vista: **Calendario** (junto a Cuadrícula y Mapa) | **P3** | Media-Alta | **Idea (Etapa 10.H / Backlog Paso 5)** |

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
- **3.1 Ubicación:** Sección discreta en el pie de página (`footer`), integrada armónicamente junto al bloque de apoyo al proyecto.
- **3.2 Correo confirmado:** `mmartinez23v@hotmail.com` (mediante enlace `mailto:` accesible, compatible con móviles y con asunto prellenado opcional, cuidando la exposición al spam).
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
- Mejorar metadatos SEO y OpenGraph (`description`, `og:title`, `og:image`) en `index.html`.
- Compartir avances y demostraciones breves en GitHub y comunidades de productividad/organización personal, sin publicidad invasiva ni telemetría.

---

### ETAPA 10 — Ideas Experimentales (Prioridad: BAJA / INVESTIGACIÓN — P3/P4)
*Propuestas sujetas a evaluación previa de utilidad real y costo de mantenimiento (no implementar automáticamente):*

- **A. Buscador global (P3):** Filtrar rápidamente listas, notas, tareas y etiquetas en tiempo real (muy útil en tableros grandes).
- **B. Visor «Mapa estelar» / Modo Universo (P3):**
  - Tercera vista dentro del tablero (*Cuadrícula*, *Mapa* y *Mapa estelar*): un lienzo tipo cielo nocturno (y variante clara) donde cada lista es un punto luminoso.
  - **Punto por lista:** Color según su conexión (degradado si tiene varias; blanco como una estrella si no tiene conexiones). Tamaño proporcional al número de conexiones.
  - **Aristas:** Líneas finas con el color de la conexión.
  - **Interacción y accesibilidad:** Pasar el ratón o enfocar con teclado (`aria-label` con título) muestra el nombre; clic o `Enter`/`Espacio` abre la nota completa en un panel o modal para editarla.
- **C. Plantillas opcionales (P3/P4):** Compras, Estudios, Proyectos, Hábitos, Viajes, Organización personal.
- **D. Atajos de teclado (P3/P4):** Acciones rápidas para usuarios avanzados.
- **E. Estadísticas básicas (P4):** Progreso discreto por lista sin convertir la app en un sistema de presión de productividad.
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
- Mejoras continuas de estabilidad, confirmaciones seguras y protección del almacenamiento local.
- Canal directo de contacto y sugerencias por correo electrónico.
- Sello **Open Source** con acceso directo al repositorio público del proyecto.

### 🔜 Próximamente
- Idioma inglés (selector **Español / English** — *Checklist Gato / Checklist Cat*).
- Optimización de rendimiento para tableros con gran cantidad de listas y conexiones.
- Búsqueda rápida de listas, tareas y etiquetas.

### 💡 Ideas a futuro *(en evaluación)*
- **Visor «Mapa estelar» (modo universo):** vista panorámica de nodos y conexiones.
- Plantillas opcionales para crear listas rápidas.
- Atajos de teclado adicionales y vista ampliada de notas largas.

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
- Harness de pruebas automatizadas en Chrome headless (`tests/run.sh` y `tests/harness.html`) con 20 pruebas de regresión en verde.

---

## 8. BACKLOG PRÓXIMOS DÍAS (ORDENADO DE MÁS FÁCIL A MÁS DIFÍCIL)

> Plan de trabajo incremental para los próximos días. **Ningún ítem se implementa sin autorización explícita**; el orden va de menor a mayor complejidad. Cada paso se cierra con `bash tests/run.sh` en verde y su actualización correspondiente de documentación.

### PASO 1 — Sello Open Source + enlace al repositorio *(Muy fácil — CAT-16 / Etapa 11)*
- `footer`: bloque «Proyecto escalable a largo plazo, 100% Open Source y auditable» con enlace al repositorio (`https://github.com/MartnMartnez14/checklist`).
- `header`: ícono discreto de GitHub que abre el repositorio.
- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`; coherente en modo claro y oscuro.

### PASO 2 — README orientado a confianza y privacidad *(Muy fácil — CAT-11 / Etapa 8)*
- Explicar la idea general de **Checklist Gato** para público técnico y no técnico.
- Aclarar, en lenguaje simple, que los datos viven **solo en el dispositivo** (`localStorage` + `IndexedDB`): sin servidores, sin cuentas, sin telemetría y sin riesgo de filtración en la nube; código abierto y auditable.
- Explicar cómo pasar datos entre PC y celular con **Exportar / Importar** y la importancia de respaldos periódicos.
- Mantener `README.md` y `ROADMAP.md` sincronizados con el repositorio público.

### PASO 3 — Etiquetas de Importar / Exportar en móvil *(Fácil — CAT-17 / Etapa 5)*
- Hoy `@media (max-width:560px){.btn .btn-label{display:none;}}` oculta el texto y quedan solo las flechas.
- Mostrar el texto visible («Exportar» / «Importar») para que cualquier usuario nuevo entienda su función sin adivinar.

### PASO 4 — Selector de idioma Español / Inglés *(Media — CAT-08 / Etapa 4)*
- Alternar la interfaz entre **Checklist Gato (ES)** y **Checklist Cat (EN)**, con preferencia en `localStorage` (`checklist-lang`) y detección inicial del idioma del navegador.
- **Regla de oro:** nunca traducir ni alterar el contenido escrito por el usuario.

### PASO 5 — Tercera vista «Calendario» *(Media-Alta — CAT-18 / Etapa 10.H)*
- Nueva 3.ª opción en el selector de vistas del `header` (junto a *Cuadrícula* y *Mapa*).
- Ver y organizar listas o tareas por fecha (aprovechando `createdAt` o una fecha asignada), sin sobrecargar ni desvirtuar la esencia de un checklist.
- Diseñar un boceto previo antes de implementar.
