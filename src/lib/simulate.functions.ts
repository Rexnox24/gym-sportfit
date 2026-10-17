import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { plans, isPlanAvailable, computeExpiry } from '@/lib/plans';

/** TEMPORAL: simula un pago (modo prueba). Sustituir por el cobro real cuando se conecte la pasarela. */
export const simulatePayment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ planId: z.enum(['semanal', 'mensualidad', 'trimestral', 'promo-fin-2026']) }))
 .handler(async ({ data, context }) => {
  const plan = plans.find(p => p.id === data.planId)!;
  if (!plan.onlineCheckout || !isPlanAvailable(plan)) throw new Error('Este plan no está disponible.');
  const { data: prof } = await context.supabase.from('profiles').select('membership_expires_at,account_active').eq('id', context.userId).single();
  if (!prof || prof.account_active === false) throw new Error('Tu cuenta no está activa.');
  const expiresAt = computeExpiry(plan.id, prof.membership_expires_at);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('profiles').update({ membership: plan.name, membership_expires_at: expiresAt, payment_status: 'test' }).eq('id', context.userId);
  if (error) throw new Error('No pudimos simular el pago.');
  return { expiresAt, plan: plan.name };
 });
