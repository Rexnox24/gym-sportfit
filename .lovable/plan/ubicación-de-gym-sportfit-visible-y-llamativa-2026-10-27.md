# Ubicación de Gym Sportfit visible y llamativa

## Qué verá la gente
1. **Franja amarilla de ubicación en la portada**, justo debajo de la marquesina: icono de pin, «ESTAMOS EN EJE 1, LOMAS DE CARTAGENA, 54958 TULTITLÁN, MÉX.» y botón «CÓMO LLEGAR» que abre Google Maps (tu enlace) en el celular o la PC.
2. **Sección «ENCUÉNTRANOS»** en Inicio, junto a horarios: mapa grande de Google con el gimnasio marcado, bordes con acento amarillo, dirección completa, y botones «ABRIR EN GOOGLE MAPS» y «CÓMO LLEGAR».
3. **Dirección en el pie de página** de todas las páginas, con enlace al mapa.
4. **Menú del celular**: acceso directo «Cómo llegar».
5. En Planes y Promociones, una línea corta «Paga y entrena en: Eje 1, Lomas de Cartagena» con enlace al mapa.

## Notas
- El mapa usa la conexión de Google Maps administrada por Lovable (te saldrá una tarjeta para conectarla en un clic). El mapa no se puede probar aquí; lo revisarás en la página publicada.
- Se respeta el estilo oscuro con acento amarillo; nada de colores nuevos.

## Detalles técnicos
- Agregar `location` (nombre, dirección, `mapsUrl` = enlace corto, `directionsUrl` = `https://www.google.com/maps/dir/?api=1&destination=<dirección>`) en `src/lib/gym-data.ts`.
- Componente `LocationMap` con iframe Maps Embed API (`/maps/embed/v1/place?q=Gym Sport Fit, Eje 1, Lomas de Cartagena, 54958 Tultitlán`) usando `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`, `loading="lazy"`, título accesible; si falta la clave, tarjeta con botón a Google Maps.
- Clases nuevas `.location-band` y `.location-section` en `src/styles.css` con tokens existentes; botones con variantes `sport`/`heroOutline`.
- Añadir dirección en `SiteFooter` y menú móvil; datos estructurados `LocalBusiness` (dirección) en el `head()` de Inicio para que Google la muestre.
