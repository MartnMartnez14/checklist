# Arquitectura y flujo de desarrollo de Checklist Gato

Documento de referencia para comprender y mantener el proyecto. Revisado el 2026-10-24. Distingue el comportamiento actual de las decisiones pendientes del [roadmap](ROADMAP.md).

## 1. Arquitectura actual

Checklist Gato es una PWA estática, sin backend propio, cuentas ni sincronización automática. Usa HTML, CSS y JavaScript nativos, sin dependencias externas de ejecución. GitHub Pages distribuye archivos; las notas se procesan y almacenan en el navegador.

| Responsabilidad | Implementación actual |
|---|---|
| Interfaz y accesibilidad | HTML, CSS, nodos DOM y diálogos en `index.html`; foco, teclado, anuncios y temas |
| Listas y tareas | Estado en memoria, normalización, edición, búsqueda, plantillas, progreso y fijado |
| Mapa y conexiones | Posiciones por lista, enlaces manuales, etiquetas compartidas, SVG y ordenamiento con Deshacer |
| Persistencia de notas | JSON en `localStorage`, clave `checklist-notas-v1`; preferencias de idioma, tema y vista en claves separadas |
| Medios | Imágenes/GIFs en IndexedDB, base `checklist-media`, almacén `images`; referencias `bgId` en notas, deduplicación y limpieza de huérfanos |
| Respaldos | Exportación/importación JSON, medios incluidos, validación, respaldo previo y fusión o reemplazo |
| Idiomas y ayuda | Diccionarios ES/EN y preguntas guiadas locales; el texto del usuario no se traduce |
| PIN visual actual | Verificador con sal, contenido sin cifrar y desbloqueo en memoria; no equivale a protección criptográfica |
| Uso offline | `sw.js`: red primero para documentos, con respaldo en caché; caché primero para recursos estáticos |
| Instalación y dominio | `manifest.json`, iconos y `CNAME` |
| Regresión | `tests/run.sh` y `tests/harness.html`, ejecutados con Python y Chrome headless |

Estas son responsabilidades lógicas dentro del archivo principal; no se presentan como módulos físicos separados ni se prescribe dividirlo ahora.

```mermaid
flowchart TD
    U[Persona] --> UI[Interfaz y diálogos]
    UI --> L[Listas y tareas]
    UI --> M[Mapa y conexiones]
    UI --> H[Idioma y ayuda local]
    L --> E[Estado en memoria]
    M --> E
    E --> P[Persistencia y normalización]
    P --> LS[localStorage: notas y preferencias]
    UI --> MED[Gestión de medios]
    MED --> IDB[IndexedDB: imágenes y GIFs]
    E --> B[Exportar e importar JSON]
    IDB --> B
    B --> E
    B --> IDB
    SW[Service worker y caché de archivos] --> UI
    MAN[Manifest e iconos] --> UI
```

## 2. Datos y límites de almacenamiento

El estado en memoria representa el tablero activo. Las notas referencian sus medios por identificador; los binarios se guardan aparte. El JSON exportado reúne notas y medios para respaldo o traslado manual. Importar permite fusionar o reemplazar, con respaldo previo del estado actual.

```mermaid
flowchart LR
    A[Edición en navegador] --> S[Estado en memoria]
    S --> LS[localStorage]
    LS --> S
    IMG[Imagen o GIF elegido] --> DB[IndexedDB]
    DB --> V[Vista mediante URL de Blob]
    S --> EX[Exportar JSON]
    DB --> EX
    EX --> F[Archivo guardado por la persona]
    F --> IM[Importar y validar]
    IM --> BK[Respaldo previo]
    BK --> MER[Fusionar o reemplazar]
    MER --> S
    MER --> DB
```

- Cada origen y navegador tiene su almacenamiento propio. `localhost` y `https://checklistgato.com` no comparten listas, aunque ejecuten el mismo código.
- Actualizar código con Git no copia notas entre DEV y live. Para trasladar datos se usa Exportar/Importar conscientemente.
- Borrar datos del sitio puede borrar notas e imágenes. La caché del service worker contiene recursos de la aplicación y no sustituye un respaldo de las notas.
- No hay subida automática de notas a GitHub Pages ni a Hostinger. Los enlaces externos del sitio son servicios separados.
- El PIN publicado solo oculta contenido en la interfaz: almacenamiento y exportaciones conservan texto plano. La evolución a cifrado real está pendiente en CAT-20.

## 3. Entornos, Git y publicación

| Elemento | Función |
|---|---|
| `codex/dev-offline` | Rama de integración y desarrollo local; reúne las tareas antes de publicar |
| Worktree de tarea | Carpeta de trabajo independiente, normalmente con una rama `codex/*` creada desde dev |
| `main` | Rama principal y fuente del sitio publicado; recibe cambios validados y autorizados |
| GitHub | Repositorio remoto y servicio de construcción/despliegue de Pages |
| GitHub Pages | Sirve la aplicación estática desde la raíz de `main` |
| Hostinger | Gestión del dominio/DNS según la documentación del proyecto; no ejecuta el JavaScript de la aplicación ni guarda sus notas |
| `https://checklistgato.com/` | Dirección pública del sitio, con HTTPS obligatorio configurado en Pages |

Un worktree es una carpeta asociada a un estado de Git, no una rama por sí mismo. Comparte el repositorio y sus referencias con los otros worktrees, pero tiene archivos e índice propios. Puede estar en una rama o con HEAD separado. No existe una URL dev pública ni un servidor dev permanente configurado por el mero hecho de tener esa rama.

```mermaid
flowchart TD
    DEV[Rama codex/dev-offline] --> W1[Worktree de tarea A y rama codex/*]
    DEV --> W2[Worktree de tarea B y rama codex/*]
    W1 --> T1[Cambios, pruebas y commit de tarea]
    W2 --> T2[Cambios, pruebas y commit de tarea]
    T1 --> I[Integrar tareas en dev y resolver conflictos]
    T2 --> I
    I --> V[Validación conjunta en dev]
    V --> A[Autorización para publicar]
    A --> MAIN[Incorporar a main]
    MAIN --> PUSH[Push al remoto]
    PUSH --> PAGES[Construcción y despliegue GitHub Pages]
    HOST[Hostinger: dominio y DNS] --> DOM[checklistgato.com]
    PAGES --> DOM
    DOM --> CHECK[Verificar HTTPS, archivos públicos e interacción]
```

### Mecánica habitual

1. Actualizar dev desde la base acordada, revisar cambios locales y crear cada rama de tarea desde dev en un worktree separado.
2. Trabajar en un bloque acotado; ejecutar pruebas pertinentes, revisar el diff y actualizar documentación. Registrar el trabajo en commits de tarea antes de una integración por Git, dentro de la autorización correspondiente.
3. Integrar las ramas de tarea en dev. Resolver conflictos conservando el comportamiento acordado; ejecutar la suite sobre el conjunto integrado, no solo sobre cada tarea aislada.
4. Revisar y autorizar la publicación. Incorporar dev a main con avance rápido cuando sea posible; resolver cualquier divergencia explícitamente, sin sobrescribir trabajo ajeno ni forzar el remoto.
5. Subir main. Un commit local no publica; un push puede iniciar Pages, pero tampoco confirma que el despliegue terminó.
6. Esperar el resultado correcto de Pages para el commit esperado y comprobar el dominio, archivos servidos e interacción. Registrar los límites de las pruebas, como Android físico pendiente.
7. Conservar el worktree hasta verificar que su trabajo esté integrado. Limpiarlo o archivarlo solo cuando corresponda, sin perder cambios pendientes.

### Estado comprobado al cierre del 2026-10-24

- `main`, `codex/dev-offline` y la referencia local `origin/main` apuntan a `649a366403758bc777a4edfce61180b46e02e5d8`.
- En esta sesión se verificó el despliegue de ese commit en Pages y la igualdad de los archivos públicos principales con la versión local.
- Se conserva el worktree `pin-mapa`, basado en `c5b7915`, con HEAD separado, modificaciones locales y sin commit propio de tarea.
- La integración de ese trabajo se hizo copiando siete archivos, con respaldo y verificación SHA-256, hacia dev. Después se creó el commit integrado y main avanzó hasta él. No fue un merge de commits del worktree.
- El worktree conservado es una referencia de esa etapa: puede mostrar diferencias ya integradas. Antes de reutilizarlo hay que comparar su contenido con dev actual.
- Este cierre documental se guarda localmente, sin nuevo commit ni publicación. Las referencias anteriores son una instantánea, no una promesa de que sigan iguales en el futuro.

## 4. Diagramas, decisiones y comentarios mantenibles

Los diagramas Mermaid se guardan como texto junto al documento y evolucionan mediante los mismos diffs que el código. Su representación depende del visor Markdown; el código fuente del diagrama debe seguir siendo entendible por sí mismo.

Al cambiar almacenamiento, responsabilidades, flujo de datos o despliegue:

1. Actualizar el diagrama afectado y comprobar que sus flechas describan el comportamiento real.
2. Registrar fecha, decisión, motivo e impacto; enlazar el roadmap o incidencia correspondiente.
3. Revisar coherencia entre este documento, README, roadmap y changelog, distinguiendo lo implementado de lo pendiente.
4. Documentar comprobaciones realizadas y límites pendientes; no convertir propuestas en resultados verificados.

### Criterio para comentar el código

- Explicar la responsabilidad de un bloque y los motivos de una elección no evidente.
- Comentar invariantes: qué datos deben conservarse, cuándo una operación puede ejecutarse y qué estado invalida otra operación.
- En funciones delicadas, aclarar entradas, salidas, efectos sobre almacenamiento o DOM y comportamiento ante errores.
- Documentar casos como importación/fusión, gestión de cuota, captura de punteros, limpieza de recursos, foco y futuros límites del cifrado.
- Evitar narrar instrucciones evidentes o duplicar el código en comentarios. Actualizar o retirar comentarios que ya no describan la implementación.
- Nunca incluir PIN, contraseñas, notas reales ni credenciales en ejemplos, comentarios, diagramas o registros.

### Registro inicial de decisiones

| Fecha | Decisión | Motivo | Impacto / estado |
|---|---|---|---|
| 2026-10-24 | Mantener PWA estática con datos locales | Simplicidad, privacidad y funcionamiento offline | Arquitectura actual; no agregar backend por defecto |
| 2026-10-24 | Usar tareas en worktrees, integración en dev y publicación desde main | Separar trabajo, validación conjunta y entrega pública | Flujo habitual; la copia verificada anterior queda documentada como antecedente |
| 2026-10-24 | Evolucionar de PIN visual a cifrado real sin recuperación | El ocultamiento actual no cumple el objetivo de proteger el contenido | Pendiente en CAT-20; no se modifica hoy la aplicación |
