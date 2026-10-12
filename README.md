# Checklist

PWA de listas y notas tipo tablero, **offline-first**. Funciona instalada en PC y celular, y guarda todo en el propio dispositivo (nada se sube a un servidor).

## Funcionalidades

- Listas con elementos, tachado de completados y borrado.
- **Conexiones entre listas** estilo grafo de Obsidian: manuales (modo conectar) y automáticas por etiquetas (tags) compartidas, dibujadas como flechas.
- **Apariencia por lista**: 10 colores predefinidos con opacidad ajustable y fondo de imagen o GIF.
- **Exportar / Importar** una copia de seguridad en JSON (con las imágenes incluidas).

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

## Licencia

MIT.
