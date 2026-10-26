# 🐈 CHECKLIST GATO (CHECKLIST CAT) — ROADMAP TÉCNICO, AUDITORÍA Y EXPANSIÓN

**Proyecto:** Checklist Gato (ES) / Checklist Cat (EN)  
**Sitio web:** https://checklistgato.com  
**Estado:** Publicación funcional verificada el 2026-10-26 desde dev a main, GitHub Pages y https://checklistgato.com/; caché `checklist-v16`, commit `35855e0`. Suite local integrada y pública: 50/50 en Chrome con tiempo real normal. Límites de movimiento reducido, Android y reloj virtual conservados en el cierre.
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

### 2.1 Estado funcional y validación
Suite actual de 50 casos; 50 aprobados localmente y en la web pública con Chrome y tiempo real normal. La versión publicada anterior tenía 48 casos aprobados también con movimiento reducido. El ejecutor con reloj virtual tiene esperas intermitentes documentadas en el cierre de integración; no equivale a validación Android física.
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
  - Instalable (`manifest.json`, iconos 192/512) y funcional sin conexión (`sw.js` con caché `checklist-v16`, estrategia *network-first* para el documento HTML y *cache-first* para recursos estáticos).
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
| **CAT-01** | Respaldos de datos (Exportar/Importar JSON + Fusión) | **P1** | Media | **Hecho** (`mergeNotes` refinado con metadatos y enlaces locales) |
| **CAT-02** | PWA offline-first (`manifest.json` + `sw.js`) | **P2** | Baja | **Hecho** (caché actual: `checklist-v16`; distribución desde `main`) |
| **CAT-03** | Conexiones entre listas (Manuales + Tags + Vista Mapa) | **P2** | Media-Alta | **Hecho** (Operativo; pendiente optimización para cientos de tags) |
| **CAT-04** | Blindaje de persistencia (`try/catch` en `save`, `.gitignore`) | **P1** | Baja | **Hecho (Etapa 1 / Backlog v1.1)** |
| **CAT-05** | Confirmaciones en acciones destructivas (incl. "Borrar completados") | **P1** | Baja | **Hecho (Etapa 1 / Backlog v1.1)** |
| **CAT-06** | Sistema de Feedback por correo en el footer (`mmartinez23bio@hotmail.com`) | **P1/P2** | Baja | **Hecho (Etapa 3 / Backlog Paso 4.B)** |
| **CAT-07** | Sección pública «🐾 Próximos pasos» dentro de la app | **P2** | Baja | **Hecho (Sección 5 / Backlog Paso 4.C)** |
| **CAT-08** | Internacionalización Español / Inglés (`Checklist Gato` / `Checklist Cat`) | **P2** | Media | **Hecho (Etapa 4 / Backlog Paso 4)** |
| **CAT-09** | Optimización y rendimiento a gran escala (100 a 10.000 listas) | **P1/P2** | Media-Alta | **Pendiente (Etapa 2)** |
| **CAT-10** | Mejoras de personalización, microinteracciones y Modo Mapa | **P2/P3** | Media | **Parcialmente implementado:** restablecer estilo, contraste y realce publicados; vista previa y transiciones publicadas; gradientes pendientes |
| **CAT-11** | Documentación ampliada (README orientado a confianza/privacidad), `CHANGELOG` y tags Git | **P2** | Baja | **Hecho** (README y CHANGELOG; tags Git pendientes de lanzamientos autorizados) |
| **CAT-12** | Buscador / filtro rápido de listas, notas y etiquetas | **P3** | Baja-Media | **Hecho (Paso 8)** |
| **CAT-13** | Visor "Mapa estelar" (3.ª vista modo universo) | **P3** | Alta | **Idea (Etapa 3.3 / 10.E)** |
| **CAT-14** | Plantillas, atajos de teclado y estadísticas discretas | **P3/P4** | Baja-Media | **Hecho: atajos, progreso, plantillas y editor ampliado (Pasos 7-8 y Etapa 5.4)** |
| **CAT-15** | Distribución en Google Play / Sincronización Cloud / IA | **P4** | Alta | **Idea futura (Etapas 7.1 y 10.F/G)** |
| **CAT-16** | Sello Open Source + enlace al repositorio (footer + ícono en header) | **P2** | Baja | **Hecho (Etapa 11 / Backlog Paso 1)** |
| **CAT-17** | Etiquetas visibles en botones «Importar» / «Exportar» en móvil | **P2** | Baja | **Hecho (Etapa 5 / Backlog Paso 3)** |
| **CAT-18** | Tercera vista: **Calendario** (junto a Cuadrícula y Mapa) | **P3** | Media-Alta | **Pendiente de diseño (Etapa 10.H / Backlog Paso 5)** |
| **CAT-19** | Metadatos SEO / OpenGraph y manifest PWA enriquecido | **P3** | Baja | **Hecho (Etapa 9 / Backlog Paso 6)** |
| **CAT-20** | Contraseña / PIN manual por lista (contenido oculto hasta desbloquear) | **P3/P4** | Media (bloqueo visual) / Alta (cifrado real) | **Fase 1 implementada; fase 2 pendiente, decisión registrada (Etapa 10.I)** |
| **CAT-21** | Arrastre táctil robusto en Android (zoom/pellizco, puntero trabado) | **P1/P2** | Media-Alta | **Endurecimiento publicado; validación Android real pendiente (Etapa 2.7 / 7.2)** |
| **CAT-22** | Fijar hasta 3 listas + estética «carta legendaria» holográfica | **P3** | Media | **Hecho (Etapa 5.6)** |
| **CAT-23** | El Gato asistente: FAQ local + IA opcional | **P4** | Media → Alta | **Fase 1 publicada; IA futura (Etapa 10.J)** |
| **CAT-24** | Actualización de plantillas ES/EN (Estudios, Hábitos, Viajes, Organización) | **P2** | Baja | **Hecho (Etapa 5.7 / 10.C)** |
| **CAT-25** | Orden automático del mapa por conexiones + Deshacer | **P2/P3** | Media | **Publicado (Etapa 2.6; cierre 2026-10-25)** |
| **CAT-26** | Controles de zoom en modo Mapa (+ / −), relacionados con CAT-21 y CAT-25 | **P2** | Por evaluar | **Pendiente (Etapa 2.8; reporte móvil del usuario)** |
| **CAT-27** | Visibilidad y opacidad de imágenes de fondo | **P2** | Por evaluar | **Pendiente (Etapa 5.2; reporte sobre main online)** |

---

## 4. ETAPAS DE EVOLUCIÓN DETALLADAS

### ETAPA 1 — Consolidación y Estabilidad (Prioridad: CRÍTICA — P0/P1)
Garantizar que Checklist Gato sea impecable realizando las funciones que ya ofrece.
- **1.1 Protección de almacenamiento:** Capturar errores de cuota (`QuotaExceededError`) en `localStorage` e `IndexedDB`, ofreciendo al usuario exportar un respaldo inmediato si la memoria del navegador se llena.
- **1.2 Confirmaciones seguras:** ✅ Publicado (ver cierre 2026-10-25). Borrar lista, completados y conexión usa `openDialog`, Cancelar inicialmente enfocado, Escape y cierre desde el fondo sin cambios; foco recuperado tras confirmar. Test `delete-dialogs`.
- **1.3 Refinamiento de Fusión (`mergeNotes`):** Preservar enlaces entrantes hacia notas locales existentes y contemplar cambios de estilo/color en notas sin `updatedAt`.
- **1.4 Ampliación de tests (`tests/harness.html`):** Suite de 50 casos: vista previa y transiciones, base anterior, PIN visual, importación/fusión, ordenamiento/Deshacer, cancelaciones de arrastre y viewport visual. Las comprobaciones automatizadas no equivalen a una auditoría con lector de pantalla ni a pruebas en dispositivos físicos.

---

### ETAPA 2 — Listas y Notas a Gran Escala (Prioridad: ALTA — P1/P2)
Permitir que una persona construya desde una simple checklist hasta un espacio extenso de proyectos, conocimientos e ideas sin bloqueos de interfaz.
- **2.1 Escenarios de prueba de rendimiento:** Evaluar tiempos de carga, memoria, fluidez y persistencia con **10, 100, 1.000 y 10.000 listas**, miles de tareas y múltiples conexiones.
- **2.2 Actualizaciones parciales del DOM:** Evitar que acciones locales (marcar un ítem, cambiar color, editar tags) ejecuten un `render()` completo de todo el tablero cuando solo cambia una tarjeta.
- **2.3 Optimización de `growItems()`:** Evitar el recálculo sincrónico de `scrollHeight` en todos los `<textarea>` del tablero simultáneamente; aplicar cálculo bajo demanda o mediante `IntersectionObserver`.
- **2.4 Escalabilidad del grafo de conexiones:** Evitar la explosión cuadrática $\frac{K(K-1)}{2}$ de flechas SVG cuando decenas o cientos de listas comparten una misma etiqueta (ej. conectando en cadena/estrella o limitando aristas visibles por tag).
- **2.5 Evolución del almacenamiento:** Evaluar migración opcional del estado principal de `localStorage` (~5 MB) a `IndexedDB` solo cuando el volumen lo justifique y **siempre con procedimiento automático de respaldo, validación y recuperación previa**.
- **2.6 Pulido del Modo Mapa y Conexiones:**
  - ✅ **CAT-25 Ordenar mapa:** grupos por enlaces manuales y etiquetas, recorrido desde la lista con más vecinos y desempate por orden del tablero. Unión de etiquetas compartida sin materializar todas las parejas para el agrupador. El dibujo existente del grafo no se optimizó en este bloque.
  - Tarjetas con sus dimensiones reales, separación mínima de 40 px y 64 px entre grupos; listas aisladas al final, sin alterar contenido, enlaces ni fijado. Ancho legible y scroll, sin zoom de encuadre.
  - Deshacer durante la sesión hasta cambiar listas, tamaños o posiciones; botones desactivados durante búsquedas y arrastres. No se ejecuta al editar.
  - Anchos configurables, pan/zoom y jerarquías continúan pendientes de evaluación.
- **2.7 Robustez del arrastre táctil (CAT-21):** Endurecimiento publicado (cierre 2026-10-25): segundo puntero no sustituye al activo; limpieza y persistencia de la última posición/orden ante `pointercancel`, `lostpointercapture`, `blur`, ocultación y cambio de escala de `visualViewport`. Coordenadas CSS sin división automática por escala. Aplicado a listas e ítems. Tests sintéticos aprobados; problema original pendiente de reproducción y validación en Android real.
- **2.8 Controles de zoom en modo Mapa (CAT-26; relacionado con CAT-21 y CAT-25):**
  - **Prueba reportada por el usuario — 2026-10-24:** en PC funciona bien; en móvil funciona el botón de orden automático. En el teléfono probado no puede acercar ni alejar el modo Mapa, tanto en la PWA instalada como en el navegador móvil. Al activar el modo escritorio del navegador sí puede alejar. La causa técnica sigue sin confirmar; no se generaliza el resultado a todos los dispositivos.
  - **Propuesta pendiente:** botones flotantes «+» y «−» para acercar y alejar el mapa, visibles únicamente en modo Mapa y siempre accesibles durante el desplazamiento. Definir la ubicación al implementarlos, evitando tapar tarjetas, controles u otras acciones. Se busca una solución acotada para facilitar el uso móvil.
  - **Criterios futuros de aceptación:** tarjetas y conexiones permanecen alineadas al acercar y alejar; el arrastre y el orden automático continúan funcionando; los controles solo aparecen en Mapa y siguen accesibles al desplazarse. Comprobar en navegador móvil y PWA instalada, además de verificar que no haya regresiones en PC.
  - **Relación con CAT-21:** el reporte aporta evidencia de uso real, pero no confirma todos los escenarios anteriores de captura de punteros, arrastre y zoom. CAT-21 permanece abierta.
  - **Estado de este registro:** solo documentación de la propuesta; sin cambios funcionales, commits ni publicación.

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
- **3.5 Registro interno de gestión de feedback:** ✅ Creado en `INCIDENCIAS.md`; Android continúa pendiente de reproducción local.
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
- **5.1 Modo claro y oscuro:** Implementados contraste adaptativo en tarjetas, iconos sin atenuación, foco y placeholders legibles y capa de lectura sobre imágenes. Medidos diez colores a opacidades 0 %, 18 % y 60 % en ambos temas; no es una auditoría WCAG integral.
- **5.2 Fondos de listas:** Implementado Restablecer estilo con confirmación ES/EN: sin color ni imagen y opacidad 18 %, conservando datos y PIN. Vista previa integrada publicada el 2026-10-26; gradientes pendientes.
  - **CAT-27 — Visibilidad y opacidad de imágenes de fondo (P2, Pendiente):** reporte del usuario del 2026-10-25 sobre main online: las imágenes cargadas quedan de fondo, pero casi no se distinguen.
  - **Causa identificada en el código publicado:** capa de lectura fija al 96 % en ambos temas (`.note.has-bg`); oculta casi toda la imagen. El control actual de opacidad modifica el color de la tarjeta, no esa capa.
  - **Propuesta para trabajar después:** regulación independiente de la visibilidad de la imagen, ajustable por la persona; valor inicial propuesto cercano al 40 % de visibilidad de la imagen, no al 40 % de la capa que la cubre. El valor exacto se validará visualmente al abordar la tarea.
  - **Criterios futuros de aceptación:** imagen reconocible y texto legible en temas claro y oscuro; ajuste conservado al recargar y al exportar/importar. Definir y comprobar la compatibilidad con listas y respaldos existentes al implementar.
  - **Límite de este registro:** propuesta documental conservada al publicar v16; sin corrección funcional. Estado Pendiente hasta implementar y verificar la solución.
- **5.3 Microinteracciones discretas:** Implementado realce de color de 260 ms solo al completar tareas, sin desplazamiento, desactivado con movimiento reducido. Aparición suave de 180 ms al crear listas (incluidas plantillas) y cambiar de vista publicada el 2026-10-26; sin desplazamiento y desactivada con movimiento reducido.
- **5.4 Editor ampliado (CAT-14):** ✅ **Hecho.** Modal accesible para leer y editar un ítem largo, con textarea amplio, Guardar/Cancelar, foco atrapado y Escape. Tests `item-editor`.
- **5.5 Claridad de acciones en móvil (CAT-17):** ✅ Hecho. Etiquetas visibles de Importar, Exportar y Nueva lista, con espaciado compacto del header y comprobación a 375 px.
- **5.6 Listas fijadas y estilo «carta legendaria» (CAT-22):** ✅ **Hecho.** Hasta 3 listas fijadas por tablero, orden persistente (primero las fijadas), botón accesible con `aria-pressed`, validación al importar/fusionar y borde holográfico animado con `conic`/`linear-gradient`, respetando `prefers-reduced-motion` y con fallback sin máscaras CSS. Tests `pin-limit`, `pin-order`, `pin-import`, `pin-import-duplicate` y `pin-holo`.
- **5.7 Contenido de plantillas ES/EN (CAT-24):** ✅ **Hecho.** Estudios incorpora Pomodoro 25/10 y la explicación al espejo; Hábitos suma agua, frutas/verduras, meditación y gratitud; Viajes detalla cargador laptop/celular y revisión del hogar; Organización suma mails/llamadas y agenda/calendario virtual. Test `template-content` con paridad ES/EN.

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
- **I. Contraseña / PIN manual por lista (CAT-20):**
  - **Fase 1 — PIN visual:** ✅ Publicado (ver cierre 2026-10-25). PIN de 4–8 dígitos con repetición; verificador SHA-256 y sal aleatoria mediante Web Crypto. No se guarda el PIN; el contenido permanece en texto plano.
  - La tarjeta bloqueada muestra un nombre genérico y oculta título, ítems, etiquetas, fondo y sus textos accesibles. Conserva relaciones y posición. Búsquedas omiten su contenido; desbloqueo solo en memoria, con «Bloquear ahora» y bloqueo al recargar.
  - Aviso explícito de que no cifra y de que almacenamiento y respaldos contienen texto. «Quitar PIN» verifica el PIN; «Olvidé el PIN» ofrece recuperación confirmada sin PIN. No hay pérdida de contenido por olvidarlo en esta fase.
  - Campo opcional `visualLock: {version:1, salt, verifier}` en notas del esquema 2. Importaciones protegidas quedan bloqueadas; validación de metadatos antes de importar y comparación en la firma de fusión. Versiones antiguas pueden ignorarlo y mostrar el texto.
  - **Fase 2 — Cifrado real sin recuperación (Alta): decisión de evolución pendiente, registrada el 2026-10-24.** El objetivo es proteger el contenido mediante cifrado, no solo ocultarlo. Retirar «Olvidé el PIN» y cualquier mecanismo que revele texto sin la contraseña. Quitar el botón por sí solo no vuelve seguro el PIN actual.
  - **Contraseña y advertencia futura:** exigir una contraseña suficientemente robusta, definir derivación de clave y parámetros adecuados (evaluar AES-GCM/PBKDF2) y no guardar contraseña ni clave recuperable. Antes de activarla, pedir confirmación y advertir: «Guardá la contraseña en un lugar seguro. Si la perdés, no podremos recuperar el contenido cifrado».
  - **Lista bloqueada sin contraseña:** permitir únicamente su eliminación confirmada, sin mostrar contenido ni datos sensibles. No incorporar recuperación que evite la contraseña; olvidar la contraseña implica perder el acceso a ese contenido cifrado.
  - **Datos y compatibilidad:** cifrar contenido sensible en reposo y al exportar; definir importación/fusión y migración segura de listas existentes sin pérdida silenciosa ni copias nuevas en texto plano. Los respaldos antiguos sin cifrar seguirán siendo legibles y no pueden protegerse retroactivamente.
  - **Criterios futuros de cierre:** no hallar contenido sensible en texto plano en almacenamiento ni exportaciones protegidas; no poder revelar contenido sin contraseña; conservar borrado confirmado de listas bloqueadas, migración y restauración de respaldos cifrados. El diseño técnico detallado y sus pruebas se acordarán al abordar esa tarea.
  - **Límite de este cierre:** solo documentación. La versión actual mantiene el PIN visual y su recuperación descritos arriba hasta implementar y verificar la fase nueva.
- **J. El Gato asistente (P4, CAT-23):**
  - **Fase 1 — Gato local:** ✅ Publicado (ver cierre 2026-10-25). Botón en el pie y diálogo de preguntas guiadas, ocho temas en ES/EN, una respuesta visible por vez. Offline, sin IA, sin campo de chat, sin leer notas ni persistir conversaciones. Test `cat-help`.
  - **Fase 2 — IA opcional (Alta):** desactivada por defecto y con consentimiento explícito. Evaluar clave propia del usuario (advirtiendo que queda en `localStorage`) o proxy serverless con límites de costo/abuso; nunca enviar notas salvo que el usuario lo pida expresamente.
  - **Fase 3 — Conversación contextual (Muy alta):** memoria y acciones sobre listas, solo con permiso explícito.
  - **Privacidad:** la IA en la nube es una excepción *opt-in* a la promesa «100% local, sin servidores ni cuentas», no el comportamiento por defecto. Documentarlo en README y en la UI.

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

### ✅ Disponible
- PIN visual, ayuda local y orden automático del mapa con Deshacer.
- Restablecer estilo, mejor legibilidad y realce suave al completar tareas.

### 🔜 Próximamente
- Optimización de rendimiento para tableros con gran cantidad de listas y conexiones.
- Controles de zoom del mapa (CAT-26) y validación de arrastre y zoom en Android real (CAT-21).

### 💡 Ideas a futuro *(en evaluación)*
- **Visor «Mapa estelar» (modo universo):** vista panorámica de nodos y conexiones.
- Calendario e IA opcional, sujetos a evaluación.

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
- Harness de pruebas automatizadas en Chrome headless (`tests/run.sh` y `tests/harness.html`) con 48 casos; ver resultados y límites de ejecución en el cierre de integración del 2026-10-25.
- Atajos de teclado (`N`, `G`, `M`, `/`, `?`), progreso discreto por lista y buscador global insensible a acentos.
- Plantillas rápidas bilingües (Compras, Estudios, Proyectos, Hábitos, Viajes y Organización personal) con contenido actualizado (Pomodoro, hábitos saludables, equipaje y organización).
- **Editor ampliado por ítem:** modal accesible para leer y editar textos largos, con foco atrapado y Escape.
- **Listas fijadas (hasta 3):** orden persistente, límite al importar y estilo holográfico tipo carta legendaria, con respeto por `prefers-reduced-motion`.
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

---

## 9. BACKLOG DE EXPANSIÓN 2026 (PRIORIDAD Y DIFICULTAD)

> Orden de ejecución recomendado. La prioridad manda sobre la dificultad: un bug P1 no espera aunque sea más costoso. Cada paso se cierra con `bash tests/run.sh` en verde y documentación actualizada.

| Orden | ID | Tarea | Dificultad | Prioridad | Estado |
|---|---|---|---|---|---|
| **9.1** | **CAT-21** | Arrastre táctil Android con zoom/pellizco | Media-Alta | **P1** | **Endurecimiento publicado; prueba Android real pendiente** |
| **9.2** | **CAT-24** | Plantillas ES/EN actualizadas | Baja | P2 | **Hecho** |
| **9.3** | **CAT-22** | Fijar hasta 3 listas + estilo holográfico | Media | P3 | **Hecho** |
| **9.4** | **CAT-23 Fase 1** | Gato local por preguntas guiadas, offline | Media | P3/P4 | **Publicado (cierre 2026-10-25)** |
| **9.5** | **CAT-23 Fase 2** | IA opcional con consentimiento | Alta | P4 | **Idea** |
| **9.6** | **CAT-18** | Tercera vista Calendario | Media-Alta | P3 | **Pendiente** |
| **9.7** | **CAT-20 Fase 1** | PIN visual por lista | Media | P3 | **Publicado; sin cifrado** |
| **9.8** | **CAT-09** | Rendimiento a gran escala | Media-Alta | P1/P2 | **Pendiente** |
| **9.9** | **CAT-20 Fase 2** | Cifrado real sin recuperación; evaluar AES-GCM/PBKDF2 | Alta | P4 | **Pendiente: decisión registrada, sin implementar** |
| **9.10** | **CAT-13** | Visor «Mapa estelar» | Alta | P3 | **Idea** |
| **9.11** | **CAT-15** | Sincronización cloud / Google Play | Muy alta | P4 | **Idea** |
| **9.12** | **CAT-26** | Botones flotantes + / − para zoom en modo Mapa | Por evaluar | P2 | **Pendiente; relacionado con CAT-21 y CAT-25** |
| **9.13** | **CAT-27** | Visibilidad y control independiente de opacidad de imágenes | Por evaluar | P2 | **Pendiente; Etapa 5.2** |

### ✅ Cerrado en esta iteración (2026-10)
- **CAT-24:** plantillas ES/EN con Pomodoro 25/10, explicación al espejo, hábitos saludables, equipaje y organización personal.
- **Etapa 5.4:** editor ampliado por ítem con modal accesible, Guardar/Cancelar, Escape y foco atrapado.
- **CAT-22:** fijado de hasta 3 listas, orden persistente, límite al importar/fusionar y borde holográfico con fallback y `prefers-reduced-motion`.
- **Validación:** `bash tests/run.sh` → `PASS=32 FAIL=0 NOVERIFY=0`.


### Revisión local — 2026-10-24 (sin publicar)
- Confirmaciones accesibles de borrado de listas, conexiones y completados.
- Ayuda del gato mediante preguntas guiadas ES/EN, offline y sin acceso a notas.
- Registro `INCIDENCIAS.md` e historial `CHANGELOG.md`; documentación sincronizada.
- Caché local `checklist-v12`; los identificadores y resultados anteriores en el historial corresponden a sus respectivas iteraciones.
- Suite actual: `PASS=34 FAIL=0 NOVERIFY=0`. Commit y publicación requieren autorización posterior.

### Worktree PIN y mapa — 2026-10-24 (sin publicar)
- Base de siete archivos copiada del checkout original y comprobada idéntica; 34 pruebas de base aprobadas antes de implementar.
- CAT-20 Fase 1: PIN visual y recuperación confirmada, sin cifrado.
- CAT-25: Ordenar mapa y Deshacer; diálogos ajustados al viewport visual y cabeceras legibles en mapa táctil.
- CAT-21: robustez local añadida; incidencia sigue abierta hasta reproducir y validar en Android físico.
- Caché actual del worktree: `checklist-v13`; suite actual: `PASS=44 FAIL=0 NOVERIFY=0`.
- Sin commits ni publicación.

### Integración dev offline — 2026-10-24 (sin publicar)
- Ambos bloques locales consolidados en la carpeta de desarrollo, rama `codex/dev-offline`.
- Siete archivos respaldados fuera del repositorio; versiones copiadas comprobadas por SHA-256. El worktree `pin-mapa` sigue adjunto como referencia.
- Verificación desde dev: `PASS=44 FAIL=0 NOVERIFY=0 chrome_rc=0`; diff sin errores.
- `main` conserva su referencia. No se hicieron commits, push ni despliegue. Android físico pendiente.

### Publicación autorizada — 2026-10-24
- Versión dev integrada para publicar desde `main` en GitHub Pages, dominio `https://checklistgato.com/`, raíz del repositorio y HTTPS obligatorio.
- Verificación previa: 44 pruebas aprobadas y diff sin errores; caché `checklist-v13`. La finalización del despliegue y los archivos públicos se verifican después del push.
- Los registros de etapas anteriores describen su estado en ese momento. CAT-21 continúa pendiente de validación física en Android.

### Cierre documental — 2026-10-24
- Creado `ARQUITECTURA.md`: componentes, datos, diagramas Mermaid y flujo habitual worktrees → dev → main → Pages → dominio. Distingue este flujo del antecedente de copia verificada usado hoy.
- CAT-20: registrada la evolución a cifrado real sin recuperación, con borrado confirmado de listas bloqueadas y advertencia de pérdida de acceso al olvidar la contraseña.
- Solo documentación local: sin cambios funcionales, nuevo commit ni publicación.

### Worktree estilo y legibilidad — 2026-10-25 (sin integrar ni publicar)
- Rama `codex/estilo-legibilidad`, desde `main` (`649a366`), en worktree independiente. Otros worktrees y cambios documentales de la carpeta principal conservados.
- **5.2:** Restablecer estilo ES/EN al final del bloque de fondo: confirmación con Cancelar inicial; color nulo, opacidad 18 %, fondo nulo. Mantiene contenido, PIN, fijado, posiciones y conexiones; reutiliza el manejo de imágenes compartidas. Las demás ideas de vista previa y gradientes siguen pendientes.
- **5.1:** Primer plano negro/blanco según superficie compuesta de tarjeta, iconos sin atenuación, foco y placeholders legibles; capa de lectura sobre imágenes al 96 %. Ajuste local, no certificación WCAG integral.
- **5.3:** Realce de color de 260 ms solo al completar una tarea; sin movimiento ni cambio de tamaño, sin reproducción al cargar o redibujar, desactivado con movimiento reducido. Crear listas y cambiar de vista no reciben nuevas animaciones.
- Corregida propagación de Escape y clics de diálogos para conservar el panel de estilo y recuperar foco al cancelar.
- Base: 44 pruebas aprobadas. Cierre: `bash tests/run.sh` → `PASS=48 FAIL=0 NOVERIFY=0`; también 48 aprobadas en Chrome con `--force-prefers-reduced-motion`. `git diff --check` correcto.
- Nuevas pruebas: `style-reset`, `style-shared-image`, `card-contrast`, `completion-feedback`. Cubren cancelación/botón/Escape/fondo, trampa de foco, ES/EN, 375 px, persistencia, PIN y PNG compartido. Contraste medido para textos e iconos en 60 superficies (10 colores × 3 opacidades × 2 temas), foco de edición y límites de imágenes negras/blancas bajo la capa de lectura.
- Revisión visual en Chrome a 375 px, temas claro y oscuro. No se probaron lector de pantalla, Safari ni Android físico; el zoom Android/CAT-21 sigue abierto.
- Caché del worktree: `checklist-v14`. Sin commit, integración a dev ni publicación.

### Integración conjunta en dev — 2026-10-25
- Destino: `codex/dev-offline`, worktree `875e`. Integra documentación de arquitectura, decisión futura de cifrado sin recuperación y CAT-26, más la rama `codex/estilo-legibilidad`.
- `pin-mapa`: código ya presente en la base `649a366`; se conserva como referencia, sin reaplicar archivos antiguos. Sus diferencias documentales describen etapas anteriores.
- Se conservaron las secciones históricas del cierre documental y del worktree de estilo; sus menciones a falta de commits o integración corresponden a esas etapas.
- Caché integrada: `checklist-v14`. Validación conjunta: `PASS=48 FAIL=0 NOVERIFY=0` en Chrome con tiempo real; mismo resultado con el ejecutor headless y `--force-prefers-reduced-motion`.
- Limitación detectada: `bash tests/run.sh` en modo normal y reloj virtual produjo fallos intermitentes de espera (`style-shared-image` y `delete-dialogs`), aunque esos casos pasaron en tiempo real. No se considera estabilizado ese ejecutor; no se modificó para ocultar los fallos.
- `git diff --check`, enlaces documentales locales y conservación de los archivos principales comprobados.
- `main`, sus cambios locales, el remoto y los demás worktrees se conservan. Sin push ni publicación. CAT-21 y CAT-26 siguen pendientes de implementación/validación según su alcance; no se da por resuelto el zoom Android.

### Preparación de publicación — 2026-10-25
- Dev reúne documentación y mejoras de estilo; roadmap visible ES/EN sincronizado con funciones disponibles y pendientes reales.
- Caché candidata `checklist-v15`. Publicación y comprobación del dominio pendientes al preparar este registro.
- Cifrado real, controles de zoom y validación Android siguen pendientes. No se implementan otras funciones en esta publicación.

- Ajuste de cierre: la tarjeta del correo de contacto desbordaba a 375 px con ciertas fuentes; se limita a su contenedor y se permite cortar el texto largo conservando el botón Copiar.
- La candidata pasó 48 pruebas en Chrome con tiempo real normal y reducido. El reloj virtual volvió a agotar esperas de imágenes en ambos modos; no se atribuyen esos fallos a una validación física ni se ocultan.

- Validación final de la candidata: 48/48 aprobadas con tiempo real normal y reducido; ES/EN a 375 px sin desborde; cancelar/restablecer con foco recuperado y persistencia tras editar/recargar offline con caché v15. Datos de prueba ficticios, sin usar notas personales.

### Cierre de publicación verificada — 2026-10-25
- Versión funcional publicada: `99f44a3d9b8dcbd74a8b5c1cc5eeed6cf3085e6a`, desde dev a main por fast-forward y push sin forzar el remoto.
- [Despliegue Pages del cambio funcional](https://github.com/MartnMartnez14/checklist/actions/runs/40218674866): completado con éxito.
- Aplicación, service worker, manifest, README, roadmap, arquitectura y changelog servidos por el dominio HTTPS comparados byte a byte con la versión publicada. También se comprobó el contenido del repositorio remoto.
- 48/48 pruebas en Chrome con tiempo real normal y reducido. El ejecutor con reloj virtual agotó esperas de carga de imágenes en ambos modos; su estabilización queda pendiente y no se ocultan esos fallos.
- Interacción pública: Restablecer estilo, Cancelar inicialmente enfocado y recuperación del foco; roadmap ES/EN y ancho 375 px sin desborde del correo.
- Sesión aislada de prueba: actualización desde caché v13 a v15, retirada de la caché anterior y conservación de una nota y tarea ficticias.
- Offline público verificado con red desactivada (`navigator.onLine === false`): recarga, edición y nueva recarga conservaron título y tarea completada bajo caché v15.
- Los documentos locales anteriores de main se conservaron en copia externa con SHA-256 y stash identificado `respaldo-documentacion-main-antes-publicacion-2026-10-25`; no se reaplicaron versiones antiguas sobre la integración. Todos los worktrees conservados.
- Este cierre es documental y no modifica aplicación, caché ni formato de respaldo; main y dev se sincronizan también con este registro.
- Límites: sin Android físico, lector de pantalla ni Safari. CAT-21 continúa pendiente de validación física; CAT-26, cifrado real, rendimiento y demás ideas permanecen pendientes según sus estados.

### Presentación y documentación — 2026-10-26 (local, sin publicar)
- Estados actuales aclarados sin reemplazar los antecedentes históricos. La publicación anterior sigue en v15.
- Vista previa integrada de estilo con texto ficticio ES/EN, color, opacidad e imagen; conserva aplicación inmediata y contraste. Sin gradientes ni cambios de datos.
- Transiciones de opacidad de 180 ms al crear listas/plantillas y cambiar de vista; sin movimiento, sin reproducción por búsqueda/edición y desactivadas con movimiento reducido.
- Caché candidata `checklist-v16`. Sin commits, integración ni publicación. Android físico, zoom, cifrado y rendimiento siguen pendientes.

- Ampliación solicitada: Mercado Pago al final de los medios de apoyo, cuenta UYU y titular proporcionados por el autor, con botón Copiar y textos ES/EN. Cambio local sin publicar.

### Validación local del bloque — 2026-10-26
- Chrome con tiempo real normal: 50/50 casos aprobados sobre el bloque final, incluido Mercado Pago.
- Reloj virtual normal: 48/50; fallaron esperas de `delete-dialogs` y `style-shared-image`. Movimiento reducido con reloj virtual: 49/50; falló `style-shared-image`. Las dos pruebas nuevas pasaron en ambos modos. La ejecución aislada con tiempo real reducido no llegó a cargar el harness y agotó el plazo; no se declara validada la suite completa en ese modo.
- Revisión visual: vista previa EN/claro a 375 px y ES/oscuro en escritorio; Mercado Pago ES/oscuro a 375 px sin desbordes. Copiar entrega exactamente la cuenta indicada mediante un sustituto de la API del portapapeles; no se verificó el portapapeles del sistema.
- Imagen añadida y retirada reflejada en la muestra; recarga con servidor detenido desde caché v16 conserva estilo y muestra. Datos ficticios y origen local aislado.
- `git diff --check` correcto. Sin Android físico, Safari ni lector de pantalla. Sin commits, integración ni publicación.

### Preparación e integración autorizada — 2026-10-26
- Integrado en `codex/dev-offline` el bloque de presentación y Mercado Pago; conservado el pendiente CAT-27 que existía en dev. Respaldo externo de ambas versiones antes de combinar documentación.
- Suite integrada: 50/50 en Chrome con tiempo real normal. Se mantienen los límites anteriores de reloj virtual y ejecución completa con movimiento reducido.
- Candidata v16; formato de datos sin cambios. Publicación en main y verificación HTTPS autorizadas por el autor, pendientes de confirmar en el cierre siguiente.
- Repositorio revisado: README, licencia MIT, arquitectura, changelog, pruebas y exclusión de respaldos presentes; sin issues ni PR abiertos al consultar. Añadido el enlace https://checklistgato.com/ a la ficha del repositorio. No se incorporan dependencias, CI adicional ni numeración de releases arbitraria.

### Cierre de publicación verificada — 2026-10-26
- Versión funcional `35855e04ba3909d6e7a9f3fef4e185ff7e736e86` integrada primero en `codex/dev-offline`, luego en `main` por fast-forward; ambas ramas subidas sin forzar el remoto.
- [Despliegue GitHub Pages](https://github.com/MartnMartnez14/checklist/actions/runs/40410492648) completado con éxito. Dominio HTTPS configurado desde la raíz de main.
- Doce archivos públicos comparados byte a byte: aplicación, service worker, manifest, cuatro imágenes/iconos, README, roadmap, arquitectura, changelog y harness. Suite pública en contexto aislado: 50/50 PASS, igual que dev en tiempo real normal.
- Interacción pública: muestra de estilo/color/opacidad, ES/EN a 375 px sin desbordes, Mercado Pago con la cuenta indicada y aviso Copiado, animaciones de 180 ms al crear y cambiar de vista, foco en título conservado; sin errores de consola en esta revisión.
- Contexto aislado de actualización: caché v15 retirada y v16 activa, conservando nota ficticia. Edición con `navigator.onLine === false` guardada y conservada tras recargar; la herramienta restableció conexión antes de inspeccionar la recarga, por lo que no se certifica una sesión pública completamente offline de extremo a extremo. La recarga local con servidor detenido sí quedó comprobada en el bloque anterior.
- Repositorio: enlace de sitio añadido a la ficha; licencia MIT, documentación, pruebas y exclusión de respaldos comprobadas. No había issues ni PR abiertos al revisar. No se añadieron dependencias, workflows ni tags de versión arbitrarios.
- Conservados todos los worktrees, la propuesta CAT-27, respaldo externo y stash `respaldo-main-antes-publicacion-v16-2026-10-26`. No se reaplican documentos antiguos sobre el cierre.
- Límites: Android físico, Safari y lector de pantalla no comprobados. Los fallos intermitentes de reloj virtual y la suite completa en tiempo real con movimiento reducido siguen pendientes; las pruebas nuevas pasaron con movimiento reducido virtual. CAT-21, CAT-26, CAT-27, cifrado y rendimiento permanecen abiertos.
- Este cierre actualiza documentación e incidencias; no modifica aplicación, caché ni datos. Dev y main se sincronizan también con este registro.
