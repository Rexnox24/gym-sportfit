# Gym Sportfit: membresía de cortesía, efectivo, Visita, teléfono, contraseña visible y métricas

## Qué vas a ver
1. **Planes y precios:** la tarjeta «Visita $70» vuelve a mostrarse, sin pago en línea, con el aviso «Paga en efectivo en el gimnasio con el dueño o encargado».
2. **Panel del dueño:**
   - Tarjeta renombrada a «SOCIOS ACTIVOS / AL CORRIENTE» (cuenta activa y vigente o de cortesía).
   - Tarjeta nueva «DESACTIVADOS» con el número de cuentas desactivadas.
   - Membresía exclusiva «Cortesía / Staff»: solo el dueño la asigna, no vence y siempre cuenta como al corriente. El dueño queda con esta membresía.
   - Botón «Registrar pago en efectivo» por cliente: elige el plan, calcula la nueva fecha, lo marca como pagado y suma el importe a «Ingresos del mes».
   - Botón «+30 días»: se confirma que suma 30 días tras la fecha vigente (o desde hoy si está vencido) y deja el historial.
   - Teléfono visible junto al correo y editable en «Editar».
3. **Registro:** campo opcional de teléfono y botón con ojo para ver u ocultar la contraseña mientras se escribe (también al iniciar sesión).
4. **Reporte CSV:** nueva columna «Teléfono».

## Detalles técnicos
- Migración: `profiles.phone text` nullable (máx. 20, check simple); actualizar el trigger de alta para copiar `phone` desde los datos de registro; `payments.method text default 'paypal'` para registrar efectivo; ampliar la bitácora con `pago_efectivo`.
- `plans.ts`: plan `cortesia` (precio 0, `onlineCheckout:false`, `ownerOnly:true`); `computeExpiry` devuelve `null` para cortesía; helper `isCurrent(profile)` que trata cortesía como vigente. Visita visible en `/planes` con `onlineCheckout:false`.
- `admin.functions.ts`: `updateMember` acepta `phone`; nueva `recordCashPayment` (verifica admin, usa precio del servidor, inserta en `payments` con método efectivo y actualiza perfil); `listMembers` devuelve `phone`.
- `admin.tsx` / `admin-filters.ts`: KPIs nuevos, cortesía como al corriente en filtros y CSV con teléfono.
- `auth.tsx`: teléfono opcional en `signUp` metadata; toggle Eye/EyeOff con `aria-label`.
- Tests vitest: cortesía siempre al corriente, efectivo suma a ingresos según precio, +30 días, CSV incluye teléfono; `tsgo` limpio.
