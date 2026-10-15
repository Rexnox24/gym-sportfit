import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { plans, isPlanAvailable, computeExpiry, type PlanId } from '@/lib/plans';

function paypalBase() {
 return process.env['PAYPAL_ENV'] === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}
async function paypalToken() {
 const id = process.env['PAYPAL_CLIENT_ID']; const secret = process.env['PAYPAL_CLIENT_SECRET'];
 if (!id || !secret) throw new Error('Los pagos con PayPal aún no están configurados.');
 const res = await fetch(`${paypalBase()}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${btoa(`${id}:${secret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
 if (!res.ok) throw new Error('No pudimos conectar con PayPal.');
 return ((await res.json()) as { access_token: string }).access_token;
}

/** Datos públicos para cargar los botones de PayPal. */
export const getPaypalConfig = createServerFn({ method: 'GET' }).handler(async () => ({
 clientId: process.env['PAYPAL_CLIENT_ID'] ?? null,
 mode: process.env['PAYPAL_ENV'] === 'live' ? 'live' : 'sandbox',
}));

const planSchema = z.object({ planId: z.enum(['visita', 'semanal', 'mensualidad', 'trimestral', 'promo-fin-2026']) });

export const createPaypalOrder = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(planSchema).handler(async ({ data, context }) => {
 const plan = plans.find(p => p.id === data.planId)!;
 if (!isPlanAvailable(plan)) throw new Error('Esta promoción ya no está disponible.');
 const token = await paypalToken();
 const res = await fetch(`${paypalBase()}/v2/checkout/orders`, {
  method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ description: `Gym Sportfit · ${plan.name}`, custom_id: `${context.userId}|${plan.id}`, amount: { currency_code: 'MXN', value: plan.price.toFixed(2) } }] }),
 });
 if (!res.ok) throw new Error('PayPal no pudo crear el pago.');
 return { orderId: ((await res.json()) as { id: string }).id };
});

export const capturePaypalOrder = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(z.object({ orderId: z.string().min(5).max(64).regex(/^[A-Z0-9]+$/) })).handler(async ({ data, context }) => {
 const token = await paypalToken();
 const res = await fetch(`${paypalBase()}/v2/checkout/orders/${data.orderId}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
 const order = (await res.json()) as { status?: string; purchase_units?: { payments?: { captures?: { status: string; custom_id?: string; amount: { value: string; currency_code: string } }[] } }[] };
 const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
 if (!res.ok || order.status !== 'COMPLETED' || capture?.status !== 'COMPLETED') throw new Error('El pago no se completó.');
 const [userId, planId] = (capture.custom_id ?? '').split('|') as [string, PlanId];
 const plan = plans.find(p => p.id === planId);
 if (userId !== context.userId || !plan || capture.amount.currency_code !== 'MXN' || Number(capture.amount.value) !== plan.price) throw new Error('El pago no coincide con el plan.');

 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const { error: payErr } = await supabaseAdmin.from('payments').insert({ user_id: userId, plan: plan.name, amount: plan.price, currency: 'MXN', paypal_order_id: data.orderId, status: 'completed' });
 if (payErr) { if (payErr.code === '23505') return { ok: true }; throw new Error('No pudimos registrar tu pago.'); }
 const { data: profile } = await supabaseAdmin.from('profiles').select('membership_expires_at').eq('id', userId).single();
 const expires = computeExpiry(plan.id, profile?.membership_expires_at ?? null);
 const { error } = await supabaseAdmin.from('profiles').update({ membership: plan.name, payment_status: 'paid', membership_expires_at: expires }).eq('id', userId);
 if (error) throw new Error('Tu pago se registró, pero no pudimos actualizar tu membresía. Contacta al gimnasio.');
 return { ok: true, expires };
});
