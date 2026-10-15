# Gym Sportfit: pagos con PayPal, avisos de vencimiento, pisos uniformes y diseño para todos los dispositivos

## 1. Fotos: un solo color de piso
- Se quedan las fotos actuales, pero en cada una el piso se cambia a un solo color, igual al de la foto "Estaciones de poleas".
- Las máquinas, la luz y el espacio no cambian. Las fotos originales que subiste siguen guardadas.

## 2. Celular, tablet, laptop y PC
- Se revisa cada página en cuatro tamaños de pantalla (celular, tablet, laptop y monitor grande).
- Se ajustan menú, títulos, tarjetas, galería, tabla de precios y portal para que nada se corte, se encime ni quede demasiado pequeño.

## 3. Planes y precios más llamativos
- Tarjetas grandes con brillo neón amarillo y la Mensualidad como "Más popular".
- Para cada plan: precio grande, duración y botón "Pagar con PayPal".
- La promoción de $750 aparece destacada junto al plan Trimestral ($780) para que se note el ahorro.
- Se quita "Efectivo" y "Transferencia": solo se podrá pagar en línea.

## 4. Pago inmediato con PayPal
- El miembro inicia sesión, elige un plan y paga con PayPal sin salir de la página.
- Cuando PayPal confirma el pago, el portal muestra al momento: plan, "Pagado" y fecha de vencimiento (por ejemplo, Semanal = 7 días, Mensualidad = 1 mes, Trimestral o promoción = 3 meses, Visita = ese día).
- Si ya tiene un plan activo, el nuevo se suma después de la fecha de vencimiento actual.
- Cada pago queda registrado con su fecha, importe y número de PayPal.
- **Mientras no tengas cuenta PayPal Business**, todo funciona en **modo de prueba** con una cuenta de prueba de PayPal (sin dinero real). Cuando la abras, solo cambiamos las claves y empiezas a cobrar.

## 5. Avisos de vencimiento
- **Dentro de la página (desde ya):** el portal muestra un aviso cuando faltan 3 días o menos y otro el día que vence, con botón para renovar.
- **Por correo (cuando tengas dominio):** cada día se revisan las membresías. A quien le falten 3 días, y el día que vence, le llega un correo; tú, como dueño, recibes una copia de cada aviso.
- Cada aviso se manda una sola vez por membresía (no se repite el mismo día).
- Los correos necesitan un dominio propio (por ejemplo gymsportfit.com). Hasta que lo tengas, la parte de correo queda lista pero apagada.

## Lo que falta de tu parte
- Cuenta de prueba de PayPal Developer (gratis) para el modo de prueba; después, tu cuenta PayPal Business para cobrar.
- Un dominio propio para los correos.
- El correo donde quieres recibir tus copias de los avisos.

## Detalles técnicos
- Fotos: editar con IA las 14 imágenes de `src/assets/photography/` usando `gym-7` (poleas) como referencia del piso; mismos nombres de archivo, `gym-data.ts` no cambia. Actualizar la memoria del proyecto con la nueva regla de las fotos.
- Base de datos (migración): en `profiles` agregar `membership_expires_at` (timestamptz, puede estar vacío); nueva tabla `payments` (user_id, plan, importe, moneda MXN, paypal_order_id único, estado, fecha) con permisos de solo lectura para su dueño; tabla `expiry_notices` (user_id, tipo `3_dias`/`dia`, fecha de vencimiento, única por combinación) para no repetir avisos. Solo el servidor puede escribir pagos, membresía y vencimiento.
- PayPal: secretos `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV` (sandbox/live). Funciones de servidor autenticadas: crear orden (el importe sale de `rates`/`promotions` en el servidor, nunca del navegador) y capturar orden (verifica con PayPal, guarda el pago y actualiza membresía y vencimiento). Botones con el SDK de PayPal en `/planes` y el portal; sin sesión, el botón pide iniciar sesión.
- Webhook de respaldo en `src/routes/api/public/paypal/webhook.ts` que verifica la firma con PayPal antes de registrar pagos completados.
- Avisos: el portal calcula los días restantes a partir de `membership_expires_at`. Ruta programada diaria `/api/public/jobs/expiry-alerts` (una vez al día), con plantilla de correo para el miembro y copia al dueño; se activa al configurar el dominio.
- Responsivo: ajustar puntos de quiebre en `src/styles.css` (390, 768, 1024, 1440 px) y verificar con Playwright en esos tamaños.
- Registrar en `roadmap.md` y `AGENTS.md` las nuevas tareas y reglas; quitar de la memoria "Pagos en efectivo o transferencia".
