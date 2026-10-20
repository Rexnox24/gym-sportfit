import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { payWithTestCard } from '@/lib/card.functions';
import { plans, validateTestCard, type PortalPlanId } from '@/lib/plans';

/** MODO PRUEBA: pago con tarjeta de crédito/débito simulado. */
export function CardPayDialog({ planId }: { planId: PortalPlanId }) {
 const fn = useServerFn(payWithTestCard);
 const qc = useQueryClient();
 const plan = plans.find((p) => p.id === planId)!;
 const [open, setOpen] = useState(false);
 const [number, setNumber] = useState('');
 const [exp, setExp] = useState('');
 const [cvv, setCvv] = useState('');
 const [holder, setHolder] = useState('');
 const [error, setError] = useState('');
 const [busy, setBusy] = useState(false);
 async function submit(e: FormEvent) {
  e.preventDefault();
  const v = validateTestCard({ number, exp, cvv, holder });
  if (v) { setError(v); return; }
  setError(''); setBusy(true);
  try {
   const r = await fn({ data: { planId, last4: number.replace(/\s/g, '').slice(-4) } });
   toast.success(`Pago con tarjeta aprobado: ${r.plan} activa hasta el ${new Date(r.expiresAt ?? Date.now()).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`);
   await qc.invalidateQueries({ queryKey: ['member-profile'] });
   setOpen(false); setNumber(''); setExp(''); setCvv(''); setHolder('');
  } catch (e) { setError(e instanceof Error ? e.message : 'No pudimos procesar el pago.'); }
  finally { setBusy(false); }
 }
 const fmtNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
 const fmtExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
 return <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button type="button" variant="sport" size="lg"><CreditCard />PAGAR CON TARJETA · ${plan.price.toLocaleString('es-MX')}</Button></DialogTrigger>
  <DialogContent>
   <DialogHeader><DialogTitle>PAGO CON TARJETA</DialogTitle><DialogDescription>{plan.name} · ${plan.price.toLocaleString('es-MX')} MXN. Modo prueba: acepta cualquier tarjeta de 16 dígitos, no se hace ningún cobro real.</DialogDescription></DialogHeader>
   <form className="card-form" onSubmit={submit} noValidate>
    <label className="field">Número de tarjeta<input inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" value={number} onChange={(e) => setNumber(fmtNum(e.target.value))} /></label>
    <div className="card-form-row">
     <label className="field">Vence (MM/AA)<input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} /></label>
     <label className="field">CVV<input inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={3} value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} /></label>
    </div>
    <label className="field">Nombre del titular<input autoComplete="cc-name" maxLength={80} value={holder} onChange={(e) => setHolder(e.target.value)} /></label>
    {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
    <Button type="submit" variant="sport" size="lg" disabled={busy}>{busy ? 'PROCESANDO…' : 'PAGAR Y ACTIVAR'}</Button>
   </form>
  </DialogContent>
 </Dialog>;
}
