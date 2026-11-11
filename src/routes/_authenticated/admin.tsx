import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useMemo, useState, type FormEvent } from 'react';
import { Search, CalendarPlus, Trash2, Pencil, History, Download, Sparkles, X, Power, Banknote, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { checkIsAdmin, listMembers, setMembership, deleteMember, updateMember, listLogs, interpretQuery, recordCashPayment } from '@/lib/admin.functions';
import { matchesSmart, toCsv, type SmartFilter } from '@/lib/admin-filters';
import { pageHead } from '@/lib/gym-data';
import { plans, effectiveDays, computeExpiry, isCourtesy, plusDays, type PlanId } from '@/lib/plans';

export const Route = createFileRoute('/_authenticated/admin')({
 staticData: { sitemap: false },
 head: () => pageHead('Gestión de clientes', 'Panel privado del dueño de Gym Sportfit para gestionar clientes y membresías.'),
 component: Admin,
});

type Filter = 'todos' | 'activos' | 'por-vencer' | 'vencidos' | 'sin-pago' | 'inactivos';
const fmt = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
const actionLabel: Record<string, string> = { alta: 'Alta', activacion: 'Activación', renovacion: 'Renovación', cambio_plan: 'Cambio de plan', suspension: 'Suspensión', reactivacion: 'Reactivación', desactivacion: 'Desactivación', pago_paypal: 'Pago con PayPal', pago_prueba: 'Pago simulado (prueba)', pago_manual: 'Pago registrado', pago_pendiente: 'Pago pendiente', pago_efectivo: 'Pago en efectivo', pago_transferencia: 'Pago por transferencia', ajuste_vencimiento: 'Ajuste de vencimiento' };

function Admin() {
 const isAdminFn = useServerFn(checkIsAdmin);
 const listFn = useServerFn(listMembers);
 const setFn = useServerFn(setMembership);
 const delFn = useServerFn(deleteMember);
 const updFn = useServerFn(updateMember);
 const smartFn = useServerFn(interpretQuery);
 const qc = useQueryClient();
 const admin = useQuery(queryOptions({ queryKey: ['is-admin'], queryFn: () => isAdminFn() }));
 const list = useQuery({ queryKey: ['admin-members'], queryFn: () => listFn(), enabled: !!admin.data?.isAdmin });
 const [q, setQ] = useState('');
 const [filter, setFilter] = useState<Filter>('todos');
 const [ask, setAsk] = useState('');
 const [smart, setSmart] = useState<SmartFilter | null>(null);
 const [asking, setAsking] = useState(false);
 const [editing, setEditing] = useState<string | null>(null);
 const [showLogs, setShowLogs] = useState(false);
 const [cashFor, setCashFor] = useState<string | null>(null);
 const [daysFor, setDaysFor] = useState<string | null>(null);
 const [delFor, setDelFor] = useState<string | null>(null);

 const rows = useMemo(() => (list.data?.members ?? []).map((m) => ({ ...m, days: effectiveDays(m.membership, m.membership_expires_at) })), [list.data]);
 const counts = {
  activos: rows.filter((r) => r.account_active && r.days !== null && r.days >= 0).length,
  porVencer: rows.filter((r) => r.days !== null && r.days >= 0 && r.days <= 4).length,
  vencidos: rows.filter((r) => r.days !== null && r.days < 0).length,
  sinPago: rows.filter((r) => r.days === null || r.payment_status === 'unrecorded').length,
  desactivados: rows.filter((r) => !r.account_active).length,
 };
 const shown = rows.filter((r) => {
  const t = q.toLowerCase();
  if (t && !r.display_name.toLowerCase().includes(t) && !r.email.toLowerCase().includes(t) && !(r.phone ?? '').includes(t)) return false;
  if (smart && !matchesSmart(r, smart)) return false;
  if (filter === 'activos') return r.account_active && r.days !== null && r.days >= 0;
  if (filter === 'por-vencer') return r.days !== null && r.days >= 0 && r.days <= 4;
  if (filter === 'vencidos') return r.days !== null && r.days < 0;
  if (filter === 'sin-pago') return r.days === null || r.payment_status === 'unrecorded';
  if (filter === 'inactivos') return !r.account_active;
  return true;
 });

 async function run(p: Promise<unknown>, ok: string) {
  try { await p; toast.success(ok); await qc.invalidateQueries({ queryKey: ['admin-members'] }); await qc.invalidateQueries({ queryKey: ['admin-logs'] }); return true; }
  catch (e) { toast.error(e instanceof Error ? e.message : 'Algo salió mal'); return false; }
 }
 function addDays(r: (typeof rows)[number], days: number) {
  run(setFn({ data: { userId: r.id, membership: r.membership || 'Mensualidad', expiresAt: plusDays(r.membership_expires_at, days) } }), `Se sumaron ${days} días a ${r.display_name || r.email}`);
 }
 async function askAi(e: FormEvent) {
  e.preventDefault(); if (ask.trim().length < 2) return;
  setAsking(true);
  try { const r = await smartFn({ data: { query: ask } }); if (r.error) toast.error(r.error); else { setSmart(r.filter); setFilter('todos'); } }
  catch { toast.error('No pudimos interpretar la consulta.'); }
  finally { setAsking(false); }
 }
 function exportCsv() {
  const status = (r: (typeof rows)[number]) => !r.account_active ? 'Desactivada' : r.days === null ? (r.membership ? 'Sin fecha de vencimiento' : 'Sin membresía') : r.days < 0 ? 'Vencido' : 'Al corriente';
  const csv = toCsv(['Nombre', 'Correo', 'Teléfono', 'Plan', 'Vencimiento', 'Cuenta', 'Estado'], shown.map((r) => [r.display_name, r.email, r.phone ?? '', r.membership ?? '', isCourtesy(r.membership) ? 'Sin vencimiento' : r.membership_expires_at ? new Date(r.membership_expires_at).toLocaleDateString('es-MX') : '', r.account_active ? 'Activa' : 'Desactivada', status(r)]));
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `socios-sportfit-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
 }

 if (admin.isLoading) return <main className="shell section">Cargando…</main>;
 if (!admin.data?.isAdmin) return <main className="shell section"><div className="page-title"><div className="eyebrow">ACCESO RESTRINGIDO</div><h1>SOLO PARA EL DUEÑO.</h1><p>Esta sección es exclusiva de la administración de Gym Sportfit.</p></div><Button asChild variant="sport"><Link to="/portal">IR A MI PERFIL</Link></Button></main>;

 const filters: [Filter, string][] = [['todos', 'Todos'], ['activos', 'Activos / Al corriente'], ['por-vencer', 'Por vencer (≤ 4 días)'], ['vencidos', 'Vencidos'], ['sin-pago', 'Sin pago'], ['inactivos', 'Desactivadas']];
 const current = rows.find((r) => r.id === editing);
 return <main className="shell admin-page">
  <div className="page-title"><div className="eyebrow">ADMINISTRACIÓN</div><h1>GESTIÓN DE CLIENTES.</h1><p>Membresías, vencimientos y bajas.</p></div>
  <div className="admin-stats">
   <div className="profile-stat"><span className="category">SOCIOS ACTIVOS / AL CORRIENTE</span><h3>{counts.activos}</h3></div>
   <div className="profile-stat is-warn"><span className="category">POR VENCER (4 DÍAS)</span><h3>{counts.porVencer}</h3></div>
   <div className="profile-stat is-danger"><span className="category">VENCIDOS</span><h3>{counts.vencidos}</h3></div>
   <div className="profile-stat is-danger"><span className="category">SIN PAGO</span><h3>{counts.sinPago}</h3></div>
   <div className="profile-stat"><span className="category">DESACTIVADOS</span><h3>{counts.desactivados}</h3></div>
   <div className="profile-stat"><span className="category">INGRESOS DEL MES</span><h3>${(list.data?.revenue ?? 0).toLocaleString('es-MX')}</h3><p className="revenue-split"><span>Efectivo (recepción): <strong>${(list.data?.revenueCash ?? 0).toLocaleString('es-MX')}</strong></span><span>Transferencia BBVA: <strong>${(list.data?.revenueTransfer ?? 0).toLocaleString('es-MX')}</strong></span>{(list.data?.revenueOnline ?? 0) > 0 && <span>En línea: <strong>${(list.data?.revenueOnline ?? 0).toLocaleString('es-MX')}</strong></span>}</p></div>
  </div>
  <form className="admin-ask" onSubmit={askAi}>
   <label className="field admin-search"><span className="sr-only">Pregunta sobre tus socios</span><Sparkles aria-hidden="true" className="size-4 text-primary" /><input placeholder="Pregunta: «vencidos hace más de 15 días»" value={ask} onChange={(e) => setAsk(e.target.value)} maxLength={300} /></label>
   <Button type="submit" variant="sport" disabled={asking}>{asking ? 'PENSANDO…' : 'PREGUNTAR'}</Button>
  </form>
  {smart && <div className="admin-smart"><Sparkles aria-hidden="true" className="size-4" /><span>{smart.summary} · {shown.length} {shown.length === 1 ? 'resultado' : 'resultados'}</span><Button size="sm" variant="ghost" onClick={() => { setSmart(null); setAsk(''); }}><X />Quitar</Button></div>}
  <div className="admin-tools">
   <label className="field admin-search"><span className="sr-only">Buscar cliente</span><Search aria-hidden="true" className="size-4" /><input placeholder="Buscar por nombre, correo o teléfono" value={q} onChange={(e) => setQ(e.target.value)} /></label>
   <div className="admin-filters" role="group" aria-label="Filtrar clientes">{filters.map(([id, label]) => <Button key={id} size="sm" variant={filter === id ? 'sport' : 'outline'} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</Button>)}</div>
   <div className="admin-filters"><Button size="sm" variant="outline" onClick={exportCsv} disabled={!shown.length}><Download />Exportar a CSV</Button><Button size="sm" variant="outline" onClick={() => setShowLogs(true)}><History />Historial</Button></div>
  </div>
  {list.isLoading ? <p>Cargando clientes…</p> : shown.length === 0 ? <p className="section-text">No hay clientes en esta vista.</p> :
   <ul className="admin-list">{shown.map((r) => {
    const tone = !r.account_active ? 'is-none' : r.days === null ? 'is-none' : r.days < 0 ? 'is-danger' : r.days <= 4 ? 'is-warn' : 'is-ok';
    const label = !r.account_active ? 'Cuenta desactivada' : isCourtesy(r.membership) ? 'Al corriente · sin vencimiento' : r.days === null ? (r.membership ? 'Sin fecha de vencimiento' : 'Sin membresía') : r.days < 0 ? `Vencido hace ${-r.days} ${r.days === -1 ? 'día' : 'días'}` : r.days === 0 ? 'Vence HOY' : `${r.days <= 4 ? 'Vence en ' + r.days + (r.days === 1 ? ' día' : ' días') : 'Vigente'} · ${fmt(r.membership_expires_at!)}`;
    return <li key={r.id} className="admin-row">
     <div className="admin-member"><strong>{r.display_name || 'Sin nombre'}</strong><span>{r.email}</span>{r.phone && <a className="text-primary text-xs inline-flex items-center gap-1" href={`https://wa.me/${r.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><Phone className="size-3" aria-hidden="true" />{r.phone}</a>}</div>
     <div className="admin-plan"><span className="category">{r.membership || '—'}</span><span className={'admin-status ' + tone}>{label}</span></div>
     <div className="admin-actions">
      <Button size="sm" variant="sport" onClick={() => setEditing(r.id)}><Pencil />Editar</Button>
      <Button size="sm" variant="outline" onClick={() => setDaysFor(r.id)}><CalendarPlus />+30 días</Button>
      <Button size="sm" variant="outline" onClick={() => setCashFor(r.id)}><Banknote />Registrar pago</Button>
      <Button size="sm" variant="outline" onClick={() => run(updFn({ data: { userId: r.id, displayName: r.display_name, membership: r.membership, expiresAt: r.membership_expires_at ? new Date(r.membership_expires_at).toISOString() : null, active: !r.account_active, paymentStatus: r.payment_status as PayStatus } }), r.account_active ? 'Cuenta desactivada' : 'Cuenta reactivada')}><Power />{r.account_active ? 'Desactivar' : 'Activar'}</Button>
      <Button size="sm" variant="destructive" onClick={() => setDelFor(r.id)}><Trash2 />Baja definitiva</Button>
     </div>
    </li>;
   })}</ul>}
  <Dialog open={!!current} onOpenChange={(o) => !o && setEditing(null)}>
   <DialogContent>{current && <EditForm key={current.id} member={current} onDone={() => setEditing(null)} run={run} />}</DialogContent>
  </Dialog>
  <Dialog open={!!cashFor} onOpenChange={(o) => !o && setCashFor(null)}>
   <DialogContent>{cashFor && <CashForm member={rows.find((r) => r.id === cashFor)!} onDone={() => setCashFor(null)} run={run} />}</DialogContent>
  </Dialog>
  <Dialog open={showLogs} onOpenChange={setShowLogs}>
   <DialogContent className="max-h-[85vh] overflow-y-auto">{showLogs && <Logs names={new Map(rows.map((r) => [r.id, r.display_name || r.email]))} />}</DialogContent>
  </Dialog>
  <Dialog open={!!daysFor} onOpenChange={(o) => !o && setDaysFor(null)}>
   <DialogContent>{daysFor && <ConfirmDays member={rows.find((r) => r.id === daysFor)!} onCancel={() => setDaysFor(null)} onConfirm={() => { const m = rows.find((r) => r.id === daysFor)!; setDaysFor(null); addDays(m, 30); }} />}</DialogContent>
  </Dialog>
  <Dialog open={!!delFor} onOpenChange={(o) => !o && setDelFor(null)}>
   <DialogContent>{delFor && <ConfirmDelete member={rows.find((r) => r.id === delFor)!} onCancel={() => setDelFor(null)} onConfirm={() => { const m = rows.find((r) => r.id === delFor)!; setDelFor(null); run(delFn({ data: { userId: m.id } }), 'Cliente dado de baja'); }} />}</DialogContent>
  </Dialog>
 </main>;
}

type PayStatus = 'manual' | 'paid' | 'test' | 'unrecorded';
type Member = { id: string; display_name: string; phone: string | null; payment_status: string; membership: string | null; membership_expires_at: string | null; account_active: boolean; email: string };
function EditForm({ member, onDone, run }: { member: Member; onDone: () => void; run: (p: Promise<unknown>, ok: string) => Promise<boolean> }) {
 const fn = useServerFn(updateMember);
 const [name, setName] = useState(member.display_name);
 const [phone, setPhone] = useState(member.phone ?? '');
 const [plan, setPlan] = useState(member.membership ?? '');
 const [date, setDate] = useState(member.membership_expires_at ? new Date(member.membership_expires_at).toLocaleDateString('en-CA') : '');
 const [active, setActive] = useState(member.account_active);
 const [pay, setPay] = useState<PayStatus>((['manual','paid','test','unrecorded'].includes(member.payment_status) ? member.payment_status : 'unrecorded') as PayStatus);
 const [busy, setBusy] = useState(false);
 async function save(e: FormEvent) {
  e.preventDefault(); setBusy(true);
  const vip = isCourtesy(plan);
  if (plan && !vip && !date) { toast.error('Elige la fecha de vencimiento.'); setBusy(false); return; }
  const expiresAt = plan && !vip && date ? new Date(`${date}T23:59:59`).toISOString() : null;
  const ok = await run(fn({ data: { userId: member.id, displayName: name, phone, membership: plan || null, expiresAt, active, paymentStatus: pay } }), 'Cambios guardados');
  setBusy(false); if (ok) onDone();
 }
 const options = Array.from(new Set([...plans.map((p) => p.name), ...(member.membership ? [member.membership] : [])]));
 return <form onSubmit={save} className="grid gap-4">
  <DialogHeader><DialogTitle>EDITAR SOCIO</DialogTitle><DialogDescription>{member.email}</DialogDescription></DialogHeader>
  <label className="field"><span>Nombre</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></label>
  <label className="field"><span>Teléfono</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} pattern="[0-9+ ()\-]*" placeholder="Opcional" /></label>
  <label className="field"><span>Membresía</span><select value={plan} onChange={(e) => { const v = e.target.value; setPlan(v); const p = plans.find((x) => x.name === v); if (!v) setDate(''); else if (p) { const x = computeExpiry(p.id, member.membership_expires_at); setDate(x ? new Date(x).toLocaleDateString('en-CA') : ''); } }}><option value="">Sin membresía</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
  <label className="field"><span>Vence el</span><input type="date" className="admin-date" value={date} onChange={(e) => setDate(e.target.value)} onClick={(e) => e.currentTarget.showPicker?.()} disabled={!plan || isCourtesy(plan)} required={!!plan && !isCourtesy(plan)} /></label>{isCourtesy(plan) && <p className="text-xs text-primary">Membresía especial: siempre al corriente, sin vencimiento.</p>}
  <label className="admin-switch"><Switch checked={active} onCheckedChange={setActive} /><span>{active ? 'Cuenta ACTIVA — puede entrar al portal' : 'Cuenta DESACTIVADA — no puede entrar (conserva su historial)'}</span></label>
  <Button type="submit" variant="sport" size="lg" disabled={busy}>{busy ? 'GUARDANDO…' : 'GUARDAR CAMBIOS'}</Button>
 </form>;
}

function CashForm({ member, onDone, run }: { member: Member; onDone: () => void; run: (p: Promise<unknown>, ok: string) => Promise<boolean> }) {
 const fn = useServerFn(recordCashPayment);
 const cashPlans = plans.filter((p) => !p.ownerOnly);
 const [planId, setPlanId] = useState<PlanId>('mensualidad');
 const [method, setMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
 const [busy, setBusy] = useState(false);
 const sel = cashPlans.find((p) => p.id === planId)!;
 async function save(e: FormEvent) {
  e.preventDefault(); setBusy(true);
  const ok = await run(fn({ data: { userId: member.id, planId: planId as 'mensualidad', method } }), `Pago de $${sel.price.toLocaleString('es-MX')} registrado`);
  setBusy(false); if (ok) onDone();
 }
 return <form onSubmit={save} className="grid gap-4">
  <DialogHeader><DialogTitle>REGISTRAR PAGO</DialogTitle><DialogDescription>{member.display_name || member.email} · se suma a Ingresos del mes.</DialogDescription></DialogHeader>
  <label className="field"><span>Plan pagado</span><select value={planId} onChange={(e) => setPlanId(e.target.value as PlanId)}>{cashPlans.map((p) => <option key={p.id} value={p.id}>{p.name} — ${p.price.toLocaleString('es-MX')}</option>)}</select></label>
  <label className="field"><span>Forma de pago</span><select value={method} onChange={(e) => setMethod(e.target.value as 'efectivo' | 'transferencia')}><option value="efectivo">Efectivo en recepción</option><option value="transferencia">Transferencia BBVA</option></select></label>
  <Button type="submit" variant="sport" size="lg" disabled={busy}>{busy ? 'REGISTRANDO…' : `REGISTRAR $${sel.price.toLocaleString('es-MX')}`}</Button>
 </form>;
}

function Logs({ names }: { names: Map<string, string> }) {
 const fn = useServerFn(listLogs);
 const logs = useQuery({ queryKey: ['admin-logs'], queryFn: () => fn() });
 return <div className="grid gap-4">
  <DialogHeader><DialogTitle>HISTORIAL DE MOVIMIENTOS</DialogTitle><DialogDescription>Últimos 200 cambios de membresía.</DialogDescription></DialogHeader>
  {logs.isLoading ? <p>Cargando…</p> : !logs.data?.length ? <p>Aún no hay movimientos.</p> :
   <ul className="admin-logs">{logs.data.map((l) => <li key={l.id}>
    <span className="category">{actionLabel[l.action] ?? l.action}</span>
    <strong>{names.get(l.user_id) ?? 'Cliente eliminado'}</strong>
    <span>{l.membership ?? '—'}{l.expires_at ? ` · vence ${fmt(l.expires_at)}` : ''}</span>
    <time>{new Date(l.created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</time>
   </li>)}</ul>}
 </div>;
}

function ConfirmDays({ member, onCancel, onConfirm }: { member: Member; onCancel: () => void; onConfirm: () => void }) {
	const next = plusDays(member.membership_expires_at, 30);
	const current = member.membership_expires_at && new Date(member.membership_expires_at) > new Date() ? member.membership_expires_at : null;
	return <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="grid gap-4">
		<DialogHeader><DialogTitle>SUMAR 30 DÍAS</DialogTitle><DialogDescription>{member.display_name || member.email} · {member.email}</DialogDescription></DialogHeader>
		{isCourtesy(member.membership)
			? <p className="section-text">Es membresía de cortesía: siempre está al corriente y no usa fecha de vencimiento. Aun así puedes registrarle una fecha.</p>
			: <div className="admin-confirm-dates">
				<span className="category">VENCE AHORA</span><strong>{current ? fmt(current) : 'Sin vigencia'}</strong>
				<span className="category">VENCERÁ EL</span><strong className="admin-confirm-next">{fmt(next)}</strong>
			</div>}
		{!member.membership && !isCourtesy(member.membership) && <p className="admin-confirm-note">No tiene membresía: se le asignará «Mensualidad» con 30 días.</p>}
		<div className="admin-confirm-actions">
		<Button type="button" variant="outline" size="lg" onClick={onCancel}>CANCELAR</Button>
			<Button type="submit" variant="sport" size="lg">SÍ, SUMAR 30 DÍAS</Button>
		</div>
	</form>;
}

function ConfirmDelete({ member, onCancel, onConfirm }: { member: Member; onCancel: () => void; onConfirm: () => void }) {
	return <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="grid gap-4">
		<DialogHeader><DialogTitle>DAR DE BAJA DEFINITIVA</DialogTitle><DialogDescription>{member.display_name || member.email} · {member.email}</DialogDescription></DialogHeader>
		<p className="section-text">Se eliminará la cuenta de este cliente con todo su historial de membresías y pagos. <strong>No se puede deshacer.</strong></p>
		{member.membership && <p className="admin-confirm-note">Actualmente tiene «{member.membership}»{isCourtesy(member.membership) ? ' (membresía de cortesía)' : ''}. Si solo quieres bloquearle el acceso, usa el botón «Desactivar».</p>}
		<div className="admin-confirm-actions">
			<Button type="button" variant="outline" size="lg" onClick={onCancel}>CANCELAR</Button>
			<Button type="submit" variant="destructive" size="lg">SÍ, DAR DE BAJA</Button>
		</div>
	</form>;
}
