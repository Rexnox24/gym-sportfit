import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { plans, isPlanAvailable, computeExpiry, PORTAL_PLAN_IDS } from '@/lib/plans';

/** MODO PRUEBA: cobro simulado con tarjeta. No se guarda el número, solo los últimos 4 dígitos en el folio. */
export const payWithTestCard = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ planId: z.enum(PORTAL_PLAN_IDS), last4: z.string().regex(/^\d{4}$/) }))
 .handler(async ({ data, context }) => {
  const plan = plans.find(p => p.id === data.planId)!;
  if (!isPlanAvailable(plan)) throw new Error('Este plan no está disponible.');
  const { data: prof } = await context.supabase.from('profiles').select('membership_expires_at,account_active').eq('id', context.userId).single();
  if (!prof || prof.account_active === false) throw new Error('Tu cuenta no está activa.');
  const expiresAt = computeExpiry(plan.id, prof.membership_expires_at);
  const folio = `TARJETA-SIM-${data.last4}-${crypto.randomUUID().slice(0, 8)}`;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error: payErr } = await supabaseAdmin.from('payments').insert({ user_id: context.userId, plan: plan.name, amount: plan.price, currency: 'MXN', paypal_order_id: folio, status: 'completed', method: 'tarjeta' });
  if (payErr) throw new Error('No pudimos registrar el pago.');
  const { error } = await supabaseAdmin.from('profiles').update({ membership: plan.name, membership_expires_at: expiresAt, payment_status: 'paid' }).eq('id', context.userId);
  if (error) throw new Error('No pudimos activar tu membresía.');
  return { expiresAt, plan: plan.name, folio };
 });
