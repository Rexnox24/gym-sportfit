# Nueva foto de portada

## Qué cambia
- La foto principal de Inicio (encima de la franja amarilla) se reemplaza por la nueva foto del gimnasio con luces neón.
- Retoque con IA, sin cambiar máquinas, murales ni distribución:
  - Más nitidez y mejor iluminación, conservando el ambiente neón.
  - Piso corregido igual al de las demás fotos (misma loseta, color y acabado, sin desgaste).
  - Oscurecido suave en el lado izquierdo y la parte baja, para que el título, los botones y «DESCUBRE SPORTFIT» se lean bien.
- Encuadre adaptado: en celular se centra en las máquinas rojas para que no se corten con el texto; en PC se ve el salón completo.
- La foto anterior sigue en la galería; solo deja de ser la portada.

## Qué no cambia
Textos, botones, franja, precios, logo y demás fotos.

## Detalles técnicos
- Original guardada como asset (`src/assets/gym-portada.jpg.asset.json`); versión retocada con `imagegen--edit_image` usando `gym-7-retocada.jpg` como referencia de piso, en `src/assets/photography/gym-portada-retocada.jpg`.
- `gym-data.ts`: nuevo export `heroPhoto`; `index.tsx` lo usa en `.hero-image` (photos[0] queda en galería).
- `styles.css`: ajustar `object-position` de `.hero-image` por breakpoint usando el overlay existente.
- Verificar con Playwright en 390px, 768px y 1280px.
