import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import type { SmartFilter } from './admin-filters';

type Ctx = { supabase: any; userId: string };
async function assertAdmin(context: Ctx) {
 const { data } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
 if (!data) throw new Error('No tienes permiso de administrador.');
}

export const checkIsAdmin = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
 const { data } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
 return { isAdmin: !!data };
});

export const listMembers = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
 await assertAdmin(context);
 const { data: profiles, error } = await context.supabase.from('profiles').select('id,display_name,phone,membership,payment_status,membership_expires_at,created_at,account_active').order('created_at', { ascending: false }).limit(1000);
 if (error) throw new Error('No pudimos cargar los clientes.');
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const emails = new Map<string, string>();
 for (let page = 1; page <= 20; page++) {
  const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
  data.users.forEach((u) => emails.set(u.id, u.email ?? ''));
  if (data.users.length < 1000) break;
 }
 const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
 const { data: pays } = await context.supabase.from('payments').select('amount,method').gte('created_at', monthStart.toISOString());
 const revenue = (pays ?? []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0);
 const revenueCash = (pays ?? []).filter((p: any) => p.method === 'efectivo').reduce((s: number, p: any) => s + Number(p.amount), 0);
 const revenueTransfer = (pays ?? []).filter((p: any) => p.method === 'transferencia').reduce((s: number, p: any) => s + Number(p.amount), 0);
 const revenueOnline = revenue - revenueCash - revenueTransfer;
 return { revenue, revenueCash, revenueTransfer, revenueOnline, members: (profiles ?? []).map((p: any) => ({ ...p, email: emails.get(p.id) ?? '' })) as Array<{ id: string; display_name: string; phone: string | null; membership: string | null; payment_status: string; membership_expires_at: string | null; created_at: string; account_active: boolean; email: string }> };
});

async function setBan(userId: string, active: boolean) {
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: active ? 'none' : '876000h' });
}

export const setMembership = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ userId: z.string().uuid(), membership: z.string().trim().min(1).max(60).nullable(), expiresAt: z.string().datetime().nullable() }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('profiles').update({ membership: data.membership, membership_expires_at: data.expiresAt, payment_status: data.expiresAt ? 'manual' : 'unrecorded' }).eq('id', data.userId);
  if (error) throw new Error('No pudimos actualizar la membresía.');
  return { ok: true };
 });

export const updateMember = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ userId: z.string().uuid(), displayName: z.string().trim().max(100), phone: z.string().trim().max(20).regex(/^[0-9+ ()-]*$/).optional(), membership: z.string().trim().max(60).nullable(), expiresAt: z.string().datetime().nullable(), active: z.boolean(), paymentStatus: z.enum(['manual', 'paid', 'test', 'unrecorded']) }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  if (data.userId === context.userId && !data.active) throw new Error('No puedes desactivar tu propia cuenta de dueño.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: prev } = await supabaseAdmin.from('profiles').select('membership,membership_expires_at,payment_status,account_active').eq('id', data.userId).single();
  if (!prev) throw new Error('No encontramos al cliente.');
  const membership = data.membership || null;
  // Primero el estado de cuenta (para que la bitácora lo registre por separado), luego el plan.
  if (data.active !== prev.account_active) {
   const { error } = await supabaseAdmin.from('profiles').update({ account_active: data.active }).eq('id', data.userId);
   if (error) throw new Error('No pudimos cambiar el estado de la cuenta.');
   await setBan(data.userId, data.active);
  }
  const { error } = await supabaseAdmin.from('profiles').update({
   display_name: data.displayName, ...(data.phone !== undefined ? { phone: data.phone || null } : {}), membership, membership_expires_at: data.expiresAt,
   payment_status: data.paymentStatus,
  }).eq('id', data.userId);
  if (error) throw new Error('No pudimos guardar los cambios.');
  return { ok: true };
 });

/** Pago en efectivo en recepción: registra el ingreso y extiende la membresía. */
export const recordCashPayment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ userId: z.string().uuid(), planId: z.enum(['visita', 'semanal', 'mensualidad', 'trimestral', 'anual', 'bf-6meses', 'bf-anual']), method: z.enum(['efectivo', 'transferencia']).default('efectivo') }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  const { plans, computeExpiry } = await import('./plans');
  const plan = plans.find((p) => p.id === data.planId)!;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: prev } = await supabaseAdmin.from('profiles').select('membership,membership_expires_at').eq('id', data.userId).single();
  if (!prev) throw new Error('No encontramos al cliente.');
  const { error: payErr } = await supabaseAdmin.from('payments').insert({ user_id: data.userId, plan: plan.name, amount: plan.price, currency: 'MXN', paypal_order_id: `${data.method}-${crypto.randomUUID()}`, status: 'completed', method: data.method });
  if (payErr) throw new Error('No pudimos registrar el pago.');
  const expiresAt = computeExpiry(plan.id, prev.membership === plan.name ? prev.membership_expires_at : null);
  const { error } = await supabaseAdmin.from('profiles').update({ membership: plan.name, membership_expires_at: expiresAt, payment_status: 'manual' }).eq('id', data.userId);
  if (error) throw new Error('El pago quedó registrado, pero no pudimos actualizar la membresía.');
  return { ok: true, amount: plan.price, expiresAt };
 });

export const listLogs = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
 await assertAdmin(context);
 const { data, error } = await context.supabase.from('membership_logs').select('id,user_id,action,membership,expires_at,created_at').order('created_at', { ascending: false }).limit(200);
 if (error) throw new Error('No pudimos cargar el historial.');
 return (data ?? []) as Array<{ id: string; user_id: string; action: string; membership: string | null; expires_at: string | null; created_at: string }>;
});

export const deleteMember = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ userId: z.string().uuid() }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  if (data.userId === context.userId) throw new Error('No puedes eliminar tu propia cuenta de dueño.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
  if (error) throw new Error('No pudimos dar de baja al cliente.');
  return { ok: true };
 });

const filterSchema = {
 type: 'object', additionalProperties: false,
 required: ['status', 'planIncludes', 'minDaysOverdue', 'maxDaysUntil', 'summary'],
 properties: {
  status: { type: 'array', items: { type: 'string', enum: ['activos', 'por-vencer', 'vencidos', 'sin-pago', 'inactivos'] } },
  planIncludes: { type: ['string', 'null'] },
  minDaysOverdue: { type: ['integer', 'null'] },
  maxDaysUntil: { type: ['integer', 'null'] },
  summary: { type: 'string' },
 },
};

/** Traduce una pregunta del dueño a filtros. La IA nunca recibe datos de los socios. */
export const interpretQuery = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ query: z.string().trim().min(2).max(300) }))
 .handler(async ({ data, context }): Promise<{ filter: SmartFilter | null; error: string | null }> => {
  await assertAdmin(context);
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) return { filter: null, error: 'El buscador inteligente no está configurado.' };
  const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, 'Lovable-API-Key': key, 'X-Lovable-AIG-SDK': 'fetch' },
   body: JSON.stringify({
    model: 'openai/gpt-6-astra', stream: true, store: false, reasoning: { effort: 'low' },
    instructions: 'Convierte la consulta del dueño de un gimnasio en filtros de socios. Estados: activos (vigentes), por-vencer (vencen en 0-4 días), vencidos, sin-pago (sin membresía), inactivos (cuenta desactivada o suspendida). planIncludes: texto del plan si lo mencionan (Visita, Semanal, Mensualidad, Trimestral, Promo), si no null. minDaysOverdue: para «vencidos hace más de N días» usa N. maxDaysUntil: para «vencen esta semana» usa 7, «este mes» 30. summary: frase corta en español describiendo el filtro. Usa null o [] cuando no aplique.',
    input: data.query,
    text: { format: { type: 'json_schema', name: 'filtro_socios', strict: true, schema: filterSchema } },
   }),
  });
  if (!res.ok || !res.body) {
   const msg = res.status === 402 ? 'Se agotaron los créditos de IA. Recarga en Configuración → Planes y créditos.'
    : res.status === 429 ? 'Demasiadas consultas seguidas. Espera un momento.'
    : res.status === 403 ? 'El uso de IA está bloqueado para esta cuenta.' : 'No pudimos interpretar la consulta.';
   console.error('interpretQuery', res.status, await res.text().catch(() => ''));
   return { filter: null, error: msg };
  }
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ''; let text = '';
  for (;;) {
   const { done, value } = await reader.read(); if (done) break;
   buf += dec.decode(value, { stream: true });
   const lines = buf.split('\n'); buf = lines.pop() ?? '';
   for (const l of lines) {
    if (!l.startsWith('data:')) continue;
    try { const ev = JSON.parse(l.slice(5)); if (ev.type === 'response.output_text.delta') text += ev.delta; } catch { /* ignorar */ }
   }
  }
  try { return { filter: JSON.parse(text) as SmartFilter, error: null }; }
  catch { return { filter: null, error: 'No entendimos la consulta. Intenta escribirla de otra forma.' }; }
 });

export const listPayments = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth])
 .inputValidator((d: unknown) => z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/) }).parse(d))
 .handler(async ({ context, data }) => {
  await assertAdmin(context);
  const { monthRange } = await import('./admin-filters');
  const { start, end } = monthRange(data.month);
  const { data: pays, error } = await context.supabase.from('payments').select('id,amount,method,plan,created_at,user_id').gte('created_at', start).lt('created_at', end).order('created_at', { ascending: false }).limit(2000);
  if (error) throw new Error('No pudimos cargar los pagos.');
  const ids = [...new Set((pays ?? []).map((p: any) => p.user_id))];
  const names = new Map<string, string>();
  if (ids.length) { const { data: profs } = await context.supabase.from('profiles').select('id,display_name').in('id', ids); (profs ?? []).forEach((p: any) => names.set(p.id, p.display_name ?? '')); }
  const rows = (pays ?? []).map((p: any) => ({ id: p.id as string, amount: Number(p.amount), method: p.method as string, plan: p.plan as string, created_at: p.created_at as string, member: String(p.plan).startsWith('Producto: ') ? 'Mostrador' : (names.get(p.user_id) || 'Socio') }));
  const sum = (f: (r: typeof rows[number]) => boolean) => rows.filter(f).reduce((s, r) => s + r.amount, 0);
  const total = sum(() => true), cash = sum((r) => r.method === 'efectivo'), transfer = sum((r) => r.method === 'transferencia');
  return { rows, total, cash, transfer, online: total - cash - transfer };
 });

/** Venta de producto en mostrador: se guarda como cobro para sumar a ingresos. */
export const recordProductSale = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ product: z.enum(['agua', 'preentreno', 'otro']), name: z.string().trim().max(60).optional(), price: z.number().positive().max(100000).optional(), qty: z.number().int().min(1).max(100).default(1), method: z.enum(['efectivo', 'transferencia']) }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  const { products, PRODUCT_PREFIX } = await import('./plans');
  const fixed = products.find((p) => p.id === data.product);
  const name = fixed ? fixed.name : (data.name || '');
  const price = fixed ? fixed.price : (data.price ?? 0);
  if (!name || price <= 0) throw new Error('Escribe el nombre y el precio del producto.');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('payments').insert({ user_id: context.userId, plan: `${PRODUCT_PREFIX}${name}${data.qty > 1 ? ` x${data.qty}` : ''}`, amount: price * data.qty, currency: 'MXN', paypal_order_id: `producto-${crypto.randomUUID()}`, status: 'completed', method: data.method });
  if (error) throw new Error('No pudimos registrar la venta.');
  return { ok: true, amount: price * data.qty };
 });

/** Borra un cobro registrado por error; deja de sumar en ingresos. */
export const deletePayment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ paymentId: z.string().uuid() }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('payments').delete().eq('id', data.paymentId);
  if (error) throw new Error('No pudimos borrar el pago.');
  return { ok: true };
 });
