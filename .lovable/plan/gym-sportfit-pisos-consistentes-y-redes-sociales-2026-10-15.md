# Gym Sportfit: pisos consistentes y redes sociales

## 1. Corregir los pisos que todavía se ven distintos

- Revisar las 14 imágenes utilizadas por la página y comparar sus pisos con la foto «Estaciones de poleas».
- Retocar con IA únicamente las fotos que no coincidan: mismo material, patrón de losetas, acabado y color base de la referencia, sin hoyos ni desgaste. Conservar sombras e iluminación naturales para que el piso no parezca pegado encima.
- No cambiar máquinas, personas, paredes, distribución ni encuadre. Conservar los textos del cartel de promoción y las fotos originales.
- Revisar las imágenes corregidas juntas antes de sustituirlas; si alguna sigue mostrando otro piso, repetir su corrección.

## 2. Agregar las redes sociales

- Incorporar botones con los iconos de Instagram, Facebook y TikTok al pie de todas las páginas y en el menú de celular.
- Usar exactamente los enlaces proporcionados:
  - Instagram: [https://www.instagram.com/sportfit_gym?igsh=MXFpeW4wd3o0ZDVxaQ%3D%3D&utm_source=qr](https://www.instagram.com/sportfit_gym?igsh=MXFpeW4wd3o0ZDVxaQ%3D%3D&utm_source=qr)
  - Facebook: [https://www.facebook.com/share/1D43ffimaM/?mibextid=wwXIfr](https://www.facebook.com/share/1D43ffimaM/?mibextid=wwXIfr)
  - TikTok: [https://www.tiktok.com/@gym.sport.fit?_r=1&_t=ZS-92qQfm0gpgW](https://www.tiktok.com/@gym.sport.fit?_r=1&_t=ZS-92qQfm0gpgW)
- Abrir cada red en otra pestaña, conservando la página del gimnasio abierta.
- Dar a cada botón un nombre accesible, identificación al pasar el cursor, foco visible y un área cómoda para tocarlo.

## 3. Comprobación

- Revisar las fotos en Inicio, Equipamiento, sus ampliaciones y Promociones.
- Probar los tres botones y confirmar que apuntan al enlace correcto; las redes pueden exigir iniciar sesión en sus propias páginas.
- Verificar que los botones y el menú no se corten ni se encimen en celular, tablet, laptop y PC. Enfatiza mucho en esto ya que al abrir la pagina hay palabras y botones que se enciman 
- No modificar precios, pagos, alertas ni el logo.

## Detalles técnicos

- Editar las imágenes existentes con `imagegen--edit_image`, usando `src/assets/photography/gym-7-retocada.jpg` como referencia visual compartida; no generar sustitutos desde cero.
- Mantener las versiones corregidas bajo `src/assets/photography/` y actualizar las importaciones de `src/lib/gym-data.ts` solo si cambian los nombres.
- Centralizar los enlaces públicos y reutilizar los botones existentes en `src/components/site-shell.tsx`, con estilos y tokens de `src/styles.css`.
- Registrar los requisitos confirmados al implementar y verificar la presentación y los enlaces con Playwright.