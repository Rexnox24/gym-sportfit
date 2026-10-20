import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { simulatePayment } from '@/lib/simulate.functions';
import { portalPlans, type PortalPlanId } from '@/lib/plans';

/** TEMPORAL: botón de pago simulado (modo prueba). Si recibe planId, usa ese plan (sin selector). */
export function SimulatedPayButton({ planId: fixed }: { planId?: PortalPlanId }) {
 const fn = useServerFn(simulatePayment);
 const qc = useQueryClient();
 const session = useQuery({ queryKey: ['session-user'], queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null });
 const [own, setOwn] = useState<PortalPlanId>('mensualidad');
 const planId = fixed ?? own;
 const [busy, setBusy] = useState(false);
 if (!session.data) return <div className="simulate-box"><span className="category">MODO PRUEBA</span><Button asChild variant="outline"><Link to="/auth">INICIA SESIÓN PARA SIMULAR EL PAGO</Link></Button></div>;
 async function pay() {
  setBusy(true);
  try {
   const r = await fn({ data: { planId } });
   toast.success(`Pago simulado: ${r.plan} activa hasta el ${new Date(r.expiresAt ?? Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`);
   await qc.invalidateQueries({ queryKey: ['member-profile'] });
  } catch (e) { toast.error(e instanceof Error ? e.message : 'No pudimos simular el pago.'); }
  finally { setBusy(false); }
 }
 return <div className="simulate-box">
  <span className="category"><FlaskConical aria-hidden="true" className="inline size-3" /> MODO PRUEBA · SIN COBRO REAL</span>
  {!fixed && <label className="field"><span>Elige tu membresía</span>
   <select value={own} onChange={(e) => setOwn(e.target.value as PortalPlanId)}>{portalPlans().filter(p => p.onlineCheckout).map((p) => <option key={p.id} value={p.id}>{p.name} · ${p.price}</option>)}</select>
  </label>}
  <Button type="button" variant="outline" size="lg" onClick={pay} disabled={busy}>{busy ? 'PROCESANDO…' : 'SIMULAR PAGO (MODO PRUEBA)'}</Button>
 </div>;
}
