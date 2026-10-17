import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';

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
 const { data: profiles, error } = await context.supabase.from('profiles').select('id,display_name,membership,payment_status,membership_expires_at,created_at').order('created_at', { ascending: false }).limit(1000);
 if (error) throw new Error('No pudimos cargar los clientes.');
 const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
 const emails = new Map<string, string>();
 for (let page = 1; page <= 20; page++) {
  const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
  data.users.forEach((u) => emails.set(u.id, u.email ?? ''));
  if (data.users.length < 1000) break;
 }
 const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
 const { data: pays } = await context.supabase.from('payments').select('amount').gte('created_at', monthStart.toISOString());
 const revenue = (pays ?? []).reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0);
 return { revenue, members: (profiles ?? []).map((p: any) => ({ ...p, email: emails.get(p.id) ?? '' })) };
});

export const setMembership = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
 .inputValidator(z.object({ userId: z.string().uuid(), membership: z.string().trim().min(1).max(60).nullable(), expiresAt: z.string().datetime().nullable() }))
 .handler(async ({ data, context }) => {
  await assertAdmin(context);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('profiles').update({ membership: data.membership, membership_expires_at: data.expiresAt, payment_status: data.expiresAt ? 'manual' : 'unrecorded' }).eq('id', data.userId);
  if (error) throw new Error('No pudimos actualizar la membresía.');
  return { ok: true };
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
