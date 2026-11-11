import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState, type FormEvent } from 'react';
import { Save, LogOut, ShieldCheck, BellRing, Users } from 'lucide-react';
import { checkIsAdmin } from '@/lib/admin.functions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BankTransfer } from '@/components/bank-transfer';
import { getProfile, updateProfile } from '@/lib/profile.functions';
import { supabase } from '@/integrations/supabase/client';
import { pageHead } from '@/lib/gym-data';
import { portalPlans, effectiveDays, isCourtesy, type PortalPlanId } from '@/lib/plans';
const options=queryOptions({queryKey:['member-profile'],queryFn:()=>getProfile()});
export const Route=createFileRoute('/_authenticated/portal')({staticData:{sitemap:false},head:()=>pageHead('Mi perfil','Tu perfil privado de Gym Sportfit: membresía, vencimiento y pago por transferencia.'),loader:({context})=>context.queryClient.ensureQueryData(options),component:Portal,pendingComponent:()=> <div className="shell section">Cargando tu perfil…</div>});
const fmt=(d:string)=>new Date(d).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
function Portal(){const {data}=useSuspenseQuery(options);const [name,setName]=useState(data.display_name);const [busy,setBusy]=useState(false);const [planId,setPlanId]=useState<PortalPlanId>('mensualidad');const client=useQueryClient();const navigate=useNavigate();
 async function save(e:FormEvent){e.preventDefault();setBusy(true);try{await updateProfile({data:{display_name:name}});await client.invalidateQueries({queryKey:['member-profile']});toast.success('Nombre actualizado');}catch(e){toast.error(e instanceof Error?e.message:'No pudimos guardar tu nombre');}finally{setBusy(false);}}
 async function logout(){await client.cancelQueries();client.clear();await supabase.auth.signOut();await navigate({to:'/auth',replace:true});}
 const days=effectiveDays(data.membership,data.membership_expires_at);const vip=isCourtesy(data.membership);
 const active=days!==null&&days>=0;
 const status=active?'Al día':days!==null?'Vencido':'Sin pago registrado';
 const alert=days===null?null:days<0?{tone:'is-expired',text:`Tu membresía venció el ${fmt(data.membership_expires_at!)}. Renueva para seguir entrenando.`}:days===0?{tone:'is-today',text:'Tu membresía vence HOY. Renuévala para no perder tu acceso.'}:days<=3?{tone:'is-soon',text:`Tu membresía vence en ${days} ${days===1?'día':'días'} (${fmt(data.membership_expires_at!)}).`}:null;
 return <main className="shell"><div className="page-title"><div className="eyebrow">PORTAL DE MIEMBROS</div><h1>HOLA, {data.display_name.split(' ')[0]||'SPORTFIT'}.</h1><p>Tu camino. Tu cuenta.</p></div>
  <AdminLink/>
  {alert&&<div role="alert" className={'expiry-alert '+alert.tone}><BellRing aria-hidden="true"/><p>{alert.text}</p><a href="#renovar" className="expiry-link">RENOVAR AHORA</a></div>}
  <div className="portal-grid"><form className="form-stack" onSubmit={save}><label className="field">Nombre<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label><label className="field">Correo electrónico<input readOnly value={data.email}/></label><div className="flex flex-wrap gap-3"><Button type="submit" disabled={busy}><Save/>{busy?'Guardando…':'Guardar nombre'}</Button><Button type="button" variant="outline" onClick={logout}><LogOut/>Cerrar sesión</Button></div></form>
  <div className="profile-stats"><h2 className="sr-only">Tu membresía y estado de pago</h2><div className="profile-stat"><span className="category">TU MEMBRESÍA</span><h3>{active?data.membership:'Sin membresía activa'}</h3><p className="section-text">{vip?'Membresía especial sin vencimiento.':data.membership_expires_at?`${active?'Vence':'Venció'} el ${fmt(data.membership_expires_at)}.`:'Elige un plan y paga por transferencia o en recepción.'}</p></div><div className="profile-stat"><span className="category">ESTADO DE PAGO</span><h3>{status}</h3><p className="section-text">Paga por transferencia BBVA o en recepción.</p></div><p className="text-xs text-muted-foreground flex gap-2 items-center"><ShieldCheck className="size-4"/>Tu información es privada.</p></div></div>
  <section id="renovar" className="renew-box" aria-labelledby="renew-title"><div className="eyebrow">PAGO POR TRANSFERENCIA</div><h2 id="renew-title">{active?'RENUEVA O AMPLÍA TU PLAN.':'ACTIVA TU MEMBRESÍA.'}</h2><p className="section-text">Si ya tienes un plan activo, el nuevo se suma después de tu fecha de vencimiento.</p>
   <div className="renew-options" role="radiogroup" aria-label="Elige tu plan">{portalPlans().map(p=><button type="button" role="radio" aria-checked={planId===p.id} key={p.id} className={'renew-option'+(planId===p.id?' is-active':'')} onClick={()=>setPlanId(p.id as PortalPlanId)}><span>{p.name}</span><small>{p.period}</small><strong>${p.price}</strong></button>)}</div>
   <BankTransfer amount={portalPlans().find(p=>p.id===planId)?.price}/></section>
 </main>;
}
function AdminLink(){const fn=useServerFn(checkIsAdmin);const {data}=useQuery({queryKey:['is-admin'],queryFn:()=>fn()});if(!data?.isAdmin)return null;return <div className="mb-6"><Button asChild variant="sport"><Link to="/admin"><Users/>GESTIÓN DE CLIENTES</Link></Button></div>;}
