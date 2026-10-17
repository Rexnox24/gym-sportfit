import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useMemo, useState } from 'react';
import { Search, CalendarPlus, Trash2, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { checkIsAdmin, listMembers, setMembership, deleteMember } from '@/lib/admin.functions';
import { pageHead } from '@/lib/gym-data';
import { daysUntil } from '@/lib/plans';

export const Route = createFileRoute('/_authenticated/admin')({
 head: () => pageHead('Gestión de clientes', 'Panel privado del dueño de Gym Sportfit para gestionar clientes y membresías.'),
 component: Admin,
});

type Filter = 'todos' | 'activos' | 'por-vencer' | 'vencidos' | 'sin-pago';
const fmt = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

function Admin() {
 const isAdminFn = useServerFn(checkIsAdmin);
 const listFn = useServerFn(listMembers);
 const setFn = useServerFn(setMembership);
 const delFn = useServerFn(deleteMember);
 const qc = useQueryClient();
 const admin = useQuery(queryOptions({ queryKey: ['is-admin'], queryFn: () => isAdminFn() }));
 const list = useQuery({ queryKey: ['admin-members'], queryFn: () => listFn(), enabled: !!admin.data?.isAdmin });
 const [q, setQ] = useState('');
 const [filter, setFilter] = useState<Filter>('todos');

 const rows = useMemo(() => (list.data?.members ?? []).map((m) => ({ ...m, days: daysUntil(m.membership_expires_at) })), [list.data]);
 const counts = {
  activos: rows.filter((r) => r.days !== null && r.days >= 0).length,
  porVencer: rows.filter((r) => r.days !== null && r.days >= 0 && r.days <= 4).length,
  vencidos: rows.filter((r) => r.days !== null && r.days < 0).length,
 };
 const shown = rows.filter((r) => {
  const t = q.toLowerCase();
  if (t && !r.display_name.toLowerCase().includes(t) && !r.email.toLowerCase().includes(t)) return false;
  if (filter === 'activos') return r.days !== null && r.days >= 0;
  if (filter === 'por-vencer') return r.days !== null && r.days >= 0 && r.days <= 4;
  if (filter === 'vencidos') return r.days !== null && r.days < 0;
  if (filter === 'sin-pago') return r.days === null;
  return true;
 });

 async function run(p: Promise<unknown>, ok: string) {
  try { await p; toast.success(ok); await qc.invalidateQueries({ queryKey: ['admin-members'] }); }
  catch (e) { toast.error(e instanceof Error ? e.message : 'Algo salió mal'); }
 }
 function addDays(r: (typeof rows)[number], days: number) {
  const base = r.membership_expires_at && new Date(r.membership_expires_at) > new Date() ? new Date(r.membership_expires_at) : new Date();
  base.setDate(base.getDate() + days);
  run(setFn({ data: { userId: r.id, membership: r.membership || 'Mensualidad', expiresAt: base.toISOString() } }), `Se sumaron ${days} días a ${r.display_name || r.email}`);
 }

 if (admin.isLoading) return <main className="shell section">Cargando…</main>;
 if (!admin.data?.isAdmin) return <main className="shell section"><div className="page-title"><div className="eyebrow">ACCESO RESTRINGIDO</div><h1>SOLO PARA EL DUEÑO.</h1><p>Esta sección es exclusiva de la administración de Gym Sportfit.</p></div><Button asChild variant="sport"><Link to="/portal">IR A MI PERFIL</Link></Button></main>;

 const filters: [Filter, string][] = [['todos', 'Todos'], ['activos', 'Al corriente'], ['por-vencer', 'Por vencer (≤ 4 días)'], ['vencidos', 'Vencidos'], ['sin-pago', 'Sin pago']];
 return <main className="shell admin-page">
  <div className="page-title"><div className="eyebrow">ADMINISTRACIÓN</div><h1>GESTIÓN DE CLIENTES.</h1><p>Membresías, vencimientos y bajas.</p></div>
  <div className="admin-stats">
   <div className="profile-stat"><span className="category">SOCIOS ACTIVOS</span><h3>{counts.activos}</h3></div>
   <div className="profile-stat is-warn"><span className="category">POR VENCER (4 DÍAS)</span><h3>{counts.porVencer}</h3></div>
   <div className="profile-stat is-danger"><span className="category">VENCIDOS</span><h3>{counts.vencidos}</h3></div>
   <div className="profile-stat"><span className="category">INGRESOS DEL MES</span><h3>${list.data?.revenue ?? 0}</h3></div>
  </div>
  <div className="admin-tools">
   <label className="field admin-search"><span className="sr-only">Buscar cliente</span><Search aria-hidden="true" className="size-4" /><input placeholder="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} /></label>
   <div className="admin-filters" role="group" aria-label="Filtrar clientes">{filters.map(([id, label]) => <Button key={id} size="sm" variant={filter === id ? 'sport' : 'outline'} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</Button>)}</div>
  </div>
  {list.isLoading ? <p>Cargando clientes…</p> : shown.length === 0 ? <p className="section-text">No hay clientes en esta vista.</p> :
   <ul className="admin-list">{shown.map((r) => {
    const tone = r.days === null ? 'is-none' : r.days < 0 ? 'is-danger' : r.days <= 4 ? 'is-warn' : 'is-ok';
    const label = r.days === null ? 'Sin membresía' : r.days < 0 ? `Vencido hace ${-r.days} ${r.days === -1 ? 'día' : 'días'}` : r.days === 0 ? 'Vence HOY' : `${r.days <= 4 ? 'Vence en ' + r.days + (r.days === 1 ? ' día' : ' días') : 'Vigente'} · ${fmt(r.membership_expires_at!)}`;
    return <li key={r.id} className="admin-row">
     <div className="admin-member"><strong>{r.display_name || 'Sin nombre'}</strong><span>{r.email}</span></div>
     <div className="admin-plan"><span className="category">{r.membership || '—'}</span><span className={'admin-status ' + tone}>{label}</span></div>
     <div className="admin-actions">
      <Button size="sm" variant="outline" onClick={() => addDays(r, 30)}><CalendarPlus />+30 días</Button>
      <Button size="sm" variant="ghost" onClick={() => { if (confirm('¿Suspender la membresía de este cliente?')) run(setFn({ data: { userId: r.id, membership: null, expiresAt: null } }), 'Membresía suspendida'); }}><Ban />Suspender</Button>
      <Button size="sm" variant="destructive" onClick={() => { if (confirm('¿Dar de baja y eliminar la cuenta de este cliente? No se puede deshacer.')) run(delFn({ data: { userId: r.id } }), 'Cliente dado de baja'); }}><Trash2 />Dar de baja</Button>
     </div>
    </li>;
   })}</ul>}
 </main>;
}
