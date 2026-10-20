# Registro amigable, pago con tarjeta de prueba y desglose de ingresos

## 1. Crear cuenta (/auth)
- Mensajes claros: contraseña débil o común, correo ya registrado.
- Indicador en vivo al escribir la contraseña: mínimo 8 caracteres, letras y números. Se conserva el ojo para ver la contraseña.
- Tras registrarse: tarjeta fija «¡Cuenta creada con éxito!…» (revisar spam). Se oculta el formulario y el aviso solo se va al recargar.

## 2. Renovar en el portal
- Se quita la lista desplegable del recuadro de prueba; solo se eligen las tarjetas amarillas.
- Se agrega «Promo Anual $3,700 · 12 meses» a las tarjetas. Suma 12 meses después del vencimiento actual.
- Cambio de regla: hoy la Anual solo la asigna el dueño. Ahora el socio también podrá pagarla en el portal (con tarjeta de prueba o simulación). En Planes seguirá diciendo «Contrátala en recepción», salvo que indiques otra cosa.
- PayPal sigue disponible para los planes normales. Con la Anual se muestra solo el pago con tarjeta, porque PayPal todavía no tiene claves reales.

## 3. Pago con tarjeta de crédito/débito (modo prueba)
- Botón «PAGAR CON TARJETA» que abre una ventana con número (cualquier número de 16 dígitos), MM/AA, CVV de 3 dígitos y titular, con validación.
- «PAGAR Y ACTIVAR»: suma la vigencia, registra el pago (método tarjeta, folio TARJETA-SIM-XXXX, monto del plan) y marca al socio como pagado. Muestra un aviso de confirmación.
- No se guarda ningún número de tarjeta; solo los últimos 4 dígitos van en el folio.

## 4. Ingresos del mes (/admin)
- Total del mes más desglose: Efectivo (recepción) y Tarjeta / En línea (tarjeta + PayPal).

## Detalles técnicos
- `src/lib/card.functions.ts`: `payWithTestCard` (requireSupabaseAuth, zod: planId en planes en línea + 'anual', últimos 4 dígitos). El precio y la vigencia salen de `plans.ts` en el servidor; inserta en `payments` con method 'tarjeta' vía supabaseAdmin; actualiza el perfil a payment_status 'paid'.
- `simulate.functions.ts` y el selector del portal aceptan 'anual'; helper `portalPlans()` en plans.ts = onlinePlans + anual.
- `listMembers` devuelve `revenueCash` y `revenueOnline` (agrupado por `method`).
- `auth.tsx`: mapeo de errores (`weak_password`/pwned, `user_already_exists`/already registered) y estado `registered` que reemplaza el formulario.
- Componente `CardPayDialog` con Dialog y Button existentes; estilos en styles.css con tokens.
- Pruebas: plan anual seleccionable en el portal; la Anual suma 12 meses; separación de ingresos por método; validación de 16 dígitos.
