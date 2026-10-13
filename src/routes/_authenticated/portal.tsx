import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Save, LogOut, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getProfile, updateProfile } from '@/lib/profile.functions';
import { supabase } from '@/integrations/supabase/client';
import { pageHead } from '@/lib/gym-data';
const options=queryOptions({queryKey:['member-profile'],queryFn:()=>getProfile()});
export const Route=createFileRoute('/_authenticated/portal')({head:()=>pageHead('Mi perfil','Tu perfil privado de Gym Sportfit: nombre, membresía y estado de pago.'),loader:({context})=>context.queryClient.ensureQueryData(options),component:Portal,pendingComponent:()=> <div className="shell section">Cargando tu perfil…</div>});
function Portal(){const {data}=useSuspenseQuery(options);const [name,setName]=useState(data.display_name);const [busy,setBusy]=useState(false);const client=useQueryClient();const navigate=useNavigate();
 async function save(e:FormEvent){e.preventDefault();setBusy(true);try{await updateProfile({data:{display_name:name}});await client.invalidateQueries({queryKey:['member-profile']});toast.success('Nombre actualizado');}catch(e){toast.error(e instanceof Error?e.message:'No pudimos guardar tu nombre');}finally{setBusy(false);}}
 async function logout(){await client.cancelQueries();client.clear();await supabase.auth.signOut();await navigate({to:'/auth',replace:true});}
 const states:Record<string,string>={unrecorded:'Sin registrar',paid:'Al día',pending:'Pendiente',overdue:'Vencido'};
 return <main className="shell"><div className="page-title"><div className="eyebrow">PORTAL DE MIEMBROS</div><h1>HOLA, {data.display_name.split(' ')[0]||'SPORTFIT'}.</h1><p>Tu camino. Tu cuenta.</p></div><div className="portal-grid"><form className="form-stack" onSubmit={save}><label className="field">Nombre<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label><label className="field">Correo electrónico<input readOnly value={data.email}/></label><div className="flex flex-wrap gap-3"><Button type="submit" disabled={busy}><Save/>{busy?'Guardando…':'Guardar nombre'}</Button><Button type="button" variant="outline" onClick={logout}><LogOut/>Cerrar sesión</Button></div></form><div className="profile-stats"><div className="profile-stat"><span className="category">TU MEMBRESÍA</span><h3>{data.membership||'Sin membresía asignada'}</h3><p className="section-text">La membresía se confirma directamente con Gym Sportfit.</p></div><div className="profile-stat"><span className="category">ESTADO DE PAGO</span><h3>{states[data.payment_status]}</h3><p className="section-text">Crear una cuenta no activa una membresía ni registra un pago.</p></div><p className="text-xs text-muted-foreground flex gap-2 items-center"><ShieldCheck className="size-4"/>Tu información es privada.</p></div></div></main>;
}
