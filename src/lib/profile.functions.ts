import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const getProfile = createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('profiles').select('id,display_name,membership,payment_status,created_at').eq('id',context.userId).single();
 if(error) throw new Error('No pudimos cargar tu perfil. Vuelve a intentarlo.');
 const {data:auth,error:authError}=await context.supabase.auth.getUser();
 if(authError) throw new Error('Inicia sesión de nuevo.');
 return {...data,email:auth.user?.email ?? ''};
});
export const updateProfile = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({display_name:z.string().trim().min(1).max(100)})).handler(async({data,context})=>{
 const {error}=await context.supabase.from('profiles').update({display_name:data.display_name}).eq('id',context.userId);
 if(error) throw new Error('No pudimos guardar tu nombre.');
 return {success:true};
});
