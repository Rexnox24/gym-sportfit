# Gym Sportfit: nuevo dueño, promo anual, pago de prueba y fotos

## 1. Cambio de dueño
- antoniobass.2@icloud.com pasa a ser el dueño: su correo queda confirmado y puede entrar ya con su contraseña.
- axlahc@gmail.com pasa a ser un socio normal. Si abre Gestión de clientes, se le manda a su perfil.

## 2. Botón de pago de prueba (temporal)
- En Planes y en el perfil del socio: el socio elige el plan (Semanal, Mensualidad, Trimestral o Promo fin 2026) y pulsa «SIMULAR PAGO (MODO PRUEBA)».
- La membresía se activa con su fecha de vencimiento real, queda «Pagado (prueba)», sale un mensaje de éxito y se anota en el historial.
- Queda separado para cambiarlo después por el cobro real. No se registra como ingreso del mes.

## 3. Planes y promociones
- **Promo Anual de $3,700 MXN** (12 meses): se muestra destacada en Planes y Promociones con el aviso «Contrátala en recepción». No se puede pagar en línea; solo el dueño la asigna (vigencia de 12 meses, que puede ajustar).
- **Visita**: se quita de la página pública y de PayPal; sigue disponible para el dueño en Gestión de clientes.

## 4. Panel del dueño: 5 tarjetas
Socios activos · Por vencer (4 días) · Vencidos · **Sin pago (#)** · Ingresos del mes.

## 5. Control total en Editar socio
- Fecha de vencimiento libre, también en el pasado.
- Estado de pago a elegir: Pagado (efectivo/transferencia), Pagado (PayPal), Pendiente/sin pago.
- Interruptor de cuenta activa/desactivada claramente visible (ya existe; se refuerza su texto y se agrega también como botón rápido en cada fila).
- El historial anota también: ajuste de vencimiento y pago manual.

## 6. Fotos
- Foto principal (encima de la franja): más nítida y mejor iluminada, sin cambiar equipo ni ambiente, con el piso igual al de las demás.
- Nuevo cartel de promoción (el que enviaste) en lugar del actual, con el piso corregido igual al de las demás fotos y el texto intacto.

## Detalles técnicos
- Migración: cambiar el dueño en user_roles (insertar admin para antonio, quitar admin a axl), confirmar email de antonio; ampliar `log_membership_change()` con `pago_manual` (cambio a payment_status manual/paid) y `ajuste_vencimiento` (cambio de fecha sin cambio de plan).
- `plans.ts`: añadir `anual` (3700, +12 meses) con banderas `onlineCheckout` / `adminOnly`; Visita y Anual con `onlineCheckout:false`; `createPaypalOrder` rechaza planes no en línea.
- Nueva server fn `simulatePayment` (auth, plan en línea, computeExpiry, supabaseAdmin actualiza perfil con payment_status 'test'); componente `SimulatedPayButton` en planes y portal.
- `updateMember` acepta `paymentStatus` ('manual' | 'paid' | 'unrecorded'); sin validación de fecha mínima.
- KPI sin pago: `days === null || payment_status === 'unrecorded'`; `listMembers` devuelve payment_status.
- Fotos con imagegen--edit_image (referencia de piso gym-7); el cartel nuevo se guarda primero como asset y su versión corregida en src/assets/photography.
- Test vitest para precio anual (3700), vencimiento +12 meses y que Visita/Anual no se compran en línea.
