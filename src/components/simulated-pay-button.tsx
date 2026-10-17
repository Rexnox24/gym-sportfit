import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { simulatePayment } from '@/lib/simulate.functions';
import { onlinePlans, type PlanId } from '@/lib/plans';

type OnlineId = Exclude<PlanId, 'visita' | 'anual' | 'cortesia'>;

/** TEMPORAL: botón de pago simulado (modo prueba). */
export function SimulatedPayButton({ defaultPlan = 'mensualidad' }: { defaultPlan?: OnlineId }) {
 const fn = useServerFn(simulatePayment);
 const qc = useQueryClient();
 const session = useQuery({ queryKey: ['session-user'], queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null });
 const [planId, setPlanId] = useState<OnlineId>(defaultPlan);
 const [busy, setBusy] = useState(false);
 const options = onlinePlans();
 if (!session.data) return <div className="simulate-box"><span className="category">MODO PRUEBA</span><Button asChild variant="outline"><Link to="/auth">INICIA SESIÓN PARA SIMULAR EL PAGO</Link></Button></div>;
 async function pay() {
  setBusy(true);
  try {
   const r = await fn({ data: { planId } });
   toast.success(`Pago simulado: ${r.plan} activa hasta el ${new Date(r.expiresAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`);
   await qc.invalidateQueries({ queryKey: ['member-profile'] });
  } catch (e) { toast.error(e instanceof Error ? e.message : 'No pudimos simular el pago.'); }
  finally { setBusy(false); }
 }
 return <div className="simulate-box">
  <span className="category"><FlaskConical aria-hidden="true" className="inline size-3" /> MODO PRUEBA · SIN COBRO REAL</span>
  <label className="field"><span>Elige tu membresía</span>
   <select value={planId} onChange={(e) => setPlanId(e.target.value as OnlineId)}>{options.map((p) => <option key={p.id} value={p.id}>{p.name} · ${p.price}</option>)}</select>
  </label>
  <Button type="button" variant="sport" size="lg" onClick={pay} disabled={busy}>{busy ? 'PROCESANDO…' : 'SIMULAR PAGO (MODO PRUEBA)'}</Button>
 </div>;
}
