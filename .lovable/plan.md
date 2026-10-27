# Revisión completa + avisos por WhatsApp

## ¿Es posible el aviso automático por WhatsApp?
Sí, se puede, pero tiene requisitos que no dependen de la página:
- Se necesita una cuenta de **WhatsApp Business** con un número propio del gimnasio (ese número ya no podrá usarse en WhatsApp normal; sí en la app WhatsApp Business).
- Meta (la empresa de WhatsApp) debe aprobar la cuenta y verificar correo y número.
- Los avisos automáticos (como el de "tu plan vence en 4 días") deben usar una **plantilla de mensaje aprobada por Meta**; la aprobación tarda hasta 48 horas.
- Los avisos de tipo servicio/recordatorio son de bajo costo; los mensajes de publicidad sí se cobran por Meta.

Mientras no esté conectado el WhatsApp Business, el aviso queda listo pero no se envía, y el panel del dueño lo indicará.

## Parte 1: Teléfono obligatorio
- En "Crear cuenta" el campo **Teléfono** pasa a ser obligatorio, 10 dígitos de México (se guarda como +52…).
- Quien entre con Google (que no pide teléfono) verá en Mi perfil un aviso fijo que le pide capturar su número antes de continuar.
- El dueño puede editar el teléfono de cada socio desde el panel (ya existe).

## Parte 2: Aviso automático por WhatsApp 4 días antes
- Todos los días a las 10:00 a.m. (hora de México) la página revisa qué socios vencen exactamente en 4 días y les manda por WhatsApp: "Hola {nombre}, tu plan {plan} en Gym Sport Fit vence el {fecha}. Renueva desde tu perfil o en recepción."
- Nunca se manda dos veces el mismo aviso para el mismo vencimiento.
- En el panel del dueño: nueva lista "Avisos enviados" con estado (enviado, entregado, leído, falló).
- También se manda un mensaje de bienvenida al registrarse (cuando la plantilla esté aprobada).

## Parte 3: Revisión a fondo de toda la página
Pruebo en navegador (celular y PC), con cuentas reales de socio y dueño:
- Inicio, Planes, Promociones, Equipamiento: cada botón y enlace.
- Instagram, Facebook y TikTok en pie de página y menú del celular: que abran el perfil correcto en pestaña nueva.
- Ubicación: "Cómo llegar" y mapa.
- Crear cuenta, iniciar sesión, recuperar contraseña, alertas de contraseña.
- Mi perfil: elegir plan, pagar con tarjeta de prueba y PayPal, que se active la membresía.
- Panel del dueño: que cada pago aparezca (lista de pagos con fecha, socio, plan, monto, método y folio), ingresos del mes con desglose, cobro en efectivo, edición de socios, filtros "por vencer".
- Corrijo cualquier falla que encuentre y te entrego la lista.

## Lo que necesito de ti
- Conectar tu WhatsApp Business cuando te aparezca la tarjeta de conexión (te guío en el paso a paso).

## Detalles técnicos
- Migración: `profiles.phone` requerido en el trigger de alta (desde metadata), tabla `whatsapp_messages` (user_id, kind, expires_for, provider_id, status, error) con índice único (user_id, kind, expires_for), tabla `whatsapp_webhook_events` (inbox) con RLS solo admin.
- Conector WhatsApp vía gateway; ruta `POST /api/public/whatsapp/webhook` con `verifyWebhookRequest` para estados de entrega.
- Ruta `POST /api/public/jobs/expiry-reminders` con `authenticateCronRequest`, programada diariamente 16:00 UTC con `create_http_schedule` (si la herramienta no está disponible, se usa pg_cron/alternativa y se informa).
- Plantilla `aviso_vencimiento` (UTILITY, es_MX) creada por `/message_templates`.
- Validación de teléfono en `src/lib/auth-messages.ts` + tests (10 dígitos, normaliza a +52; recordatorio solo para vencimientos a 4 días).
- Server fn `listPayments` para el panel del dueño si aún no existe la lista detallada.
