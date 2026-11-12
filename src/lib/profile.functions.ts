import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const getProfile = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const cols='id,display_name,phone,membership,payment_status,membership_expires_at,created_at,account_active';
 const {data:auth,error:authError}=await context.supabase.auth.getUser();
 if(authError) throw new Error('Inicia sesión de nuevo.');
 let {data,error}=await context.supabase.from('profiles').select(cols).eq('id',context.userId).maybeSingle();
 if(error) throw new Error('No pudimos cargar tu perfil. Vuelve a intentarlo.');
 if(!data){
  // Cuentas creadas sin perfil (p. ej. con Google): se crea uno vacío sin membresía.
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const meta=auth.user?.user_metadata ?? {};
  const {data:created,error:insErr}=await supabaseAdmin.from('profiles').upsert({id:context.userId,display_name:String(meta['display_name'] ?? meta['full_name'] ?? '').slice(0,100),phone:meta['phone']?String(meta['phone']).slice(0,20):null},{onConflict:'id'}).select(cols).single();
  if(insErr||!created) throw new Error('No pudimos cargar tu perfil. Vuelve a intentarlo.');
  data=created;
 }
 if(data.account_active===false) throw new Error('Tu cuenta está desactivada. Contacta al gimnasio.');
 const providers=(auth.user?.app_metadata?.['providers'] as string[]|undefined) ?? [];
 return {...data,email:auth.user?.email ?? '',hasPassword:providers.includes('email')};
});
export const updateProfile = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({display_name:z.string().trim().min(1).max(100)})).handler(async({data,context})=>{
 const {error}=await context.supabase.from('profiles').update({display_name:data.display_name}).eq('id',context.userId);
 if(error) throw new Error('No pudimos guardar tu nombre.');
 return {success:true};
});
export const updatePhone = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({phone:z.string().trim().regex(/^[0-9+ ()-]{10,20}$/)})).handler(async({data,context})=>{
 const digits=data.phone.replace(/\D/g,'').replace(/^52/,'');
 if(digits.length!==10) throw new Error('El teléfono debe tener 10 dígitos.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error}=await supabaseAdmin.from('profiles').update({phone:digits}).eq('id',context.userId);
 if(error) throw new Error('No pudimos guardar tu teléfono.');
 return {success:true};
});
