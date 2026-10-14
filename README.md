# Checklist

PWA de listas y notas tipo tablero, **offline-first**. Funciona instalada en PC y celular, y guarda todo en el propio dispositivo (nada se sube a un servidor).

**App:** https://martnmartnez14.github.io/checklist/

## Funcionalidades

- Listas con elementos, tachado de completados y borrado.
- **Reordenar elementos** dentro de una lista con el asa de arrastre (ratón o táctil) o con el teclado (↑/↓ sobre el asa; `Shift` mueve 3 posiciones). Solo dentro de cada grupo (pendientes / completados) y se guarda.
- **Enter divide el elemento** activo en la posición del cursor (inserta uno nuevo justo después); `Shift+Enter` añade un salto de línea.
- **Dos vistas**: cuadrícula y **mapa** (arrastra las listas libremente, con las conexiones siguiéndolas; también se mueven con el teclado).
- **Modo claro / oscuro** con botón y preferencia guardada.
- **Conexiones entre listas** estilo grafo de Obsidian: manuales (modo conectar) y automáticas por etiquetas (tags) compartidas, dibujadas como flechas curvas. Cada lista con conexiones lleva un **borde con el color de sus conexiones** (multicolor si tiene varias).
- **Apariencia por lista**: 10 colores predefinidos con opacidad ajustable y fondo de imagen o GIF.
- **Fecha de creación** de cada nota (se muestra arriba del título en hora local; no se inventa para notas antiguas).
- **Exportar / Importar** una copia de seguridad en JSON (con las imágenes incluidas). Al importar se puede **Reemplazar** (con confirmación) o **Fusionar** (recomendado), que combina por `id`, conserva ambas versiones en conflictos ambiguos y es idempotente; siempre descarga una copia de seguridad antes y muestra un resumen.
- **Apoyar el proyecto** desde el footer (Ko-fi, PayPal, Starlink y Prex con botón para copiar la cuenta).

## Almacenamiento y privacidad

Los datos quedan **solo en el navegador de cada dispositivo**:

- Notas, colores, etiquetas y conexiones: `localStorage`.
- Imágenes y GIFs de fondo: `IndexedDB` (se guardan como archivos, conservando la animación de los GIF).
- No hay servidor ni cuentas. Entre dispositivos se pasa la información con **Exportar / Importar**.

## Uso local

Necesita un contexto seguro (`localhost` o HTTPS) para poder subir imágenes.

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

No abras el archivo con doble clic (`file://`): las notas y flechas funcionan, pero la subida de imágenes falla porque requiere un contexto seguro.

## Despliegue

Publicado con GitHub Pages (HTTPS), lo que permite instalarlo como app en el celular y usarlo offline.

## Estructura

- `index.html` — toda la aplicación (HTML, CSS y JS, sin dependencias).
- `sw.js` — Service Worker (offline; network-first para el HTML).
- `manifest.json`, `icon.svg` — instalación como PWA.

## Tests

```bash
bash tests/run.sh
```

Requiere `google-chrome` y `python3`. Levanta un servidor local y corre el harness de regresión (`tests/harness.html`) en Chrome headless; al final imprime el resumen `PASS=… FAIL=… NOVERIFY=…`.

## Licencia

MIT.
