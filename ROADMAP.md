# Roadmap

Ideas y mejoras pendientes para Checklist Gato. Lo de arriba tiene prioridad.

## 1. Visor "Mapa estelar" (modo universo)

Una **tercera vista** dentro del tablero (hoy hay *Cuadrícula* y *Mapa*): un lienzo oscuro tipo cielo donde cada lista es un punto.

- **Punto por lista**:
  - Color = el color de su conexión (el mismo del borde). Si tiene varias conexiones, degradado; si **no tiene ninguna, blanco**, como una estrella.
  - Tamaño según el número de conexiones (más conectada = más grande).
- **Aristas** entre puntos: líneas finas con el color de la conexión.
- **Interacción**:
  - Pasar el ratón (o enfocar con teclado) sobre un punto → muestra el **título** de la lista.
  - **Clic/tap** en el punto → abre la **nota completa** (panel o modal) para verla y editarla.
- **Posiciones**: reutiliza las posiciones guardadas del modo Mapa (o layout automático tipo fuerzas).
- **Accesibilidad**: cada punto es un control enfocable (`aria-label` con el título); Enter/Espacio abre la nota.
- **Temas**: fondo tipo noche con el tema oscuro; versión clara en el tema claro.

Estado: **pendiente de diseñar e implementar.** Es la funcionalidad de mayor complejidad, por eso queda aquí.

## 2. Pulido pendiente

- **Editor ampliado** (opcional): vista o modal para leer/editar un ítem muy largo con más comodidad.
- **Modo Mapa**: decidir entre scroll de página o *pan* del lienzo; y permitir anchos de tarjeta configurables.
- **Móvil**: validar en dispositivo real el arrastre táctil y el reordenamiento de elementos.
- **Grafo**: valorar un reordenado automático (auto-layout) al entrar en modo Mapa.
- **Tester**: pasada de casos borde (redimensión del lienzo, export/import con posiciones, uso táctil).

## 3. Hecho recientemente

- Los ítems ajustan el texto en **varias líneas**: ya no se corta.
- Reordenar elementos dentro de una lista: arrastre con asa (ratón/táctil) y teclado (↑/↓; con Mayús, más distancia). Se conserva el orden al recargar.
- Enter en un elemento lo divide/inserta uno nuevo justo después, en la posición del cursor (`Shift+Enter` agrega línea).
- Importación con dos modos: **Reemplazar** y **Fusionar (recomendada)**, con validación del archivo, copia de seguridad automática previa y resumen. Idempotente (importar dos veces el mismo archivo no duplica).
- Fecha y hora de creación visible en cada nota (no se inventa para notas viejas).
- Pie de página "Apoyar el proyecto" (Ko-fi, PayPal, Starlink como enlace de referido, Prex con botón copiar).
- Arrastre de listas en vista Mapa más robusto en móvil (ya no se bloquea tras editar/crear).
- Modo claro/oscuro, iconos SVG, cabecera con contadores.
- Modo Mapa con arrastre (ratón/táctil) y teclado.
- Bordes por conexión (sólido si hay una, multicolor si hay varias; sin borde si no hay conexiones).
- Corrección: el botón "+ Nueva lista" no se veía en modo nocturno.
